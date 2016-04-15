const fs   = require('fs');
const path = require('path');
const os   = require('os');

const CHAIR_PICS_DIR = path.join(os.homedir(), '/temp_chair_pics');

if (!fs.existsSync(CHAIR_PICS_DIR)) {
	fs.mkdirSync(CHAIR_PICS_DIR);
}