
const fsp = require('fs/promises');
const path = require('path');

const src = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');

const copyDirectory = async () => {
  try {
    await fsp.rm(copy, { recursive: true, force: true });
    await fsp.mkdir(copy, { recursive: true });
    const srcFiles = await fsp.readdir(src, { withFileTypes: true });
    for (const file of srcFiles) {
      if (file.isFile()) {
        await fsp.copyFile(path.join(src, file.name), path.join(copy, file.name));
      } 
    }
  } catch (error) {
    console.log(error);
  }
};
copyDirectory();