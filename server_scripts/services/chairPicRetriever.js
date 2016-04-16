const fs   = require('fs');
const path = require('path');
const os   = require('os');
const LRU  = require('lru-cache');
const _    = require('lodash');

const s3 = require('./s3');

const CHAIR_PICS_S3_BUCKET = 'tinkerwheelchair';
const CHAIR_PICS_DIR = path.join(os.homedir(), '/temp_chair_pics');

const STANDARD_IMAGE_SIZE_KB = 300; // estimate of how big each image should be...300 KB is a large estimation but playing it safe
const MAX_CACHE_SIZE_KB = 100000; // at most store 100 MB worth of image data on local disk
const CACHE_EXPIRATION_MS = 3 * 60 * 60 * 1000; // Expire an cache item every 3 hours

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
	fs.unlink(filePath, err => console.log(JSON.stringify(err, null, 2)));
}

function getS3ImageStream(imageKey) {
	const params = {
		Bucket: CHAIR_PICS_S3_BUCKET,
		Key: imageKey
	};

	return s3.getObject(params).createReadStream();
}

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
		.then(imagePath => fs.createReadStream(imagePath)); // resolve to a readstream for the image to be consistent
	} else {
		console.log(`pulling from s3: ${imageKey}`);
		const s3ImageStream = getS3ImageStream(imageKey);

		var localImagePathPromise = new Promise((resolve, reject) => {
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