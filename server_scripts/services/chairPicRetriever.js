/**
 * This script handles the maintenance of a Least Recently Used cache (LRU) of the images.
 * Through this service, images can be pulled from Amazon S3 and then stored locally so
 * that image retrieval doesnt have to be done all the way from S3 each time, and can just be done from the local disk.
 *
 * However, you can't store all of the files on your local disk (at least not when the site is running on heroku)
 * That's why the cache has a max size capacity of ~100 MB.
 * This is a rough estimate since each image is estimated to be 300 KB, which is a rather large estimate (better safe than sorry)
 *
 * Once the local LRU cache reaches max capacity, any new additions to the cache require that the least-recently-used image is deleted
 * from the local disk before the new image can be added so that the new image can be added.
 * More info on LRU cache systems: http://mcicpc.cs.atu.edu/archives/2012/mcpc2012/lru/lru.html
 *
 * All of this logic is abstracted by the single get(...) function that is exposed by this module
 * The get(...) function takes in one param and returns a promise of the result:
 *  imageKey - unique name of the chairPic you are trying to retrieve
 *  return value - Promise that resolves to readstream for the image
 * When get(...) is given a imageKey for a chairPic that is currently contained in the LRU cache,
 * it simply provides a readstream to the callback from the localDisk copy of the image.
 * When the image for the given imageKey isnt in the LRU cache, it retrieves a readstream for it from S3.
 * This S3 readstream is piped into a writestream that will save the file locally, and the
 * promise that is returned resolves to the S3 readstream.
 *
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const LRU  = require('lru-cache');
const _    = require('lodash');

const s3 = require('./s3');

const CHAIR_PICS_S3_BUCKET = 'p4x-intelliwheels';
const CHAIR_PICS_DIR = path.join(os.homedir(), '/temp_chair_pics');

const STANDARD_IMAGE_SIZE_KB = 300; // estimate of how big each image should be...300 KB is a large estimation but playing it safe
const MAX_CACHE_SIZE_KB = 100000; // at most store 100 MB worth of image data on local disk
const CACHE_EXPIRATION_MS = 48 * 60 * 60 * 1000; // Expire a cache item every 48 hours

// If the chair pics directory doesnt exist, make it
if (!fs.existsSync(CHAIR_PICS_DIR)) {
	fs.mkdirSync(CHAIR_PICS_DIR);
}

// Escape forward slash characters in imageKey and returns absolute path to where it should be stored locally
function getPathForImageKey(imageKey) {
	const encodedImageKey = encodeURIComponent(imageKey);
	return path.join(CHAIR_PICS_DIR, encodedImageKey);
}

function deleteLocalFile(imageKey) {
	const filePath = getPathForImageKey(imageKey);
	console.log(`deleting '${filePath}'`);
	fs.unlink(filePath, err => {
		if (err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});
}

function getS3ImageStream(imageKey) {
	const params = {
		Bucket: CHAIR_PICS_S3_BUCKET,
		Key: imageKey
	};

	return s3.getObject(params).createReadStream();
}

/**
 * Internally, the imageCache contains a mapping of imageKey {String} -> localFilePathPromise {Promise}
 * the localFilePathPromise resolves to the path that the local copy of the chairPic is stored at
 * @type {LRUCache}
 */
const imageCache = new LRU({
	max: MAX_CACHE_SIZE_KB,
	length: _.constant(STANDARD_IMAGE_SIZE_KB),
	dispose: deleteLocalFile,
	maxAge: CACHE_EXPIRATION_MS
});

exports.get = (imageKey) => {
	if (imageCache.has(imageKey)) {
		// returns a promise
		console.log(`pulling locally: ${imageKey}`);
		return imageCache.get(imageKey)
		.then(imagePath => {
			const localImageStream = fs.createReadStream(imagePath);
			localImageStream.on('error', () => imageCache.del(imageKey));
			return localImageStream;// resolve to a readstream for the image to be consistent
		});
	} else {
		console.log(`pulling from s3: ${imageKey}`);
		const s3ImageStream = getS3ImageStream(imageKey);

		var localImagePathPromise = new Promise((resolve, reject) => {
			reject = _.once(reject);

			s3ImageStream.on('error', (err) => {
				// if the readstream has an error, delete it's cache entry and reject this promise
				console.log(`s3 error for ${imageKey}: ${JSON.stringify(err)}`);
				reject(err);
				imageCache.del(imageKey);
			});

			const localImagePath = getPathForImageKey(imageKey);
			// save the image locally
			s3ImageStream.pipe(fs.createWriteStream(localImagePath))
			.on('error', err => {
				console.log(`error for ${imageKey}: ${JSON.stringify(err)}`);
				reject(err);
				imageCache.del(imageKey);
			})
			.on('finish', () => resolve(localImagePath));
		});

		// set the imageKey to be the promise that is resolved once the iamge has been stored localy
		imageCache.set(imageKey, localImagePathPromise);

		// return a promise that is already resolved to s3ImageStream so that caller can start reading immediately
		return new Promise(resolve => resolve(s3ImageStream));
	}
};
