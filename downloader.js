const fs = require(`fs`);
const path = require(`path`);

async function main() {
	const url = 'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s';
	const delay = (ms) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
		}
		const jsonData = await response.json();
		const data = jsonData.data;
		if (!data) {
			throw new Error('ERROR: JSON does not have a "data" property at its root.');
		}
		
		const count = data ? Object.keys(data).length : 0;
		console.info(`Found ${count} images..`);
		
		const downloadDir = path.join(__dirname, 'downloads');
		if (!fs.existsSync(downloadDir)) {
			fs.mkdirSync(downloadDir);
			console.info(`Created directory: ${downloadDir}`);
		}
		let fileIndex = 1;
		for (const key in data) {
			const subproperty = data[key];
			if (subproperty && subproperty.dhd) {
				const imageUrl = subproperty.dhd;
				await delay(100);
				const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
				const filename = `MKBHD_Panels_Free_Wallpaper_${fileIndex}${ext}`;
				const filePath = path.join(downloadDir, filename);
				await downloadImage(imageUrl, filePath);
				console.info(`Saved image to ${filePath}`);
				fileIndex++;
				await delay(250);
			}
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

async function downloadImage(url, filePath) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download image: ${response.statusText}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await fs.promises.writeFile(filePath, buffer);
}

function asciiArt() {
	console.info(`Download started..`);
}

(() => {
	asciiArt();
	setTimeout(main, 5000);
})();
