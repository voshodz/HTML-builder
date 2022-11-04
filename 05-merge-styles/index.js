const path = require('path');
const fsp = require('fs/promises');

const mergeStyles = async() => {
  const bundlePath = path.join(__dirname, '/project-dist/bundle.css');
  const stylesPath = path.join(__dirname, '/styles');
  try {
    let result = '';
    const files = await fsp.readdir(stylesPath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        if (result) {
          result += '\n';
        }
        result += await fsp.readFile(filePath, 'utf8');
      }
    }
    await fsp.writeFile(bundlePath, result, 'utf8');
  } catch (err) {
    console.log(`We got err =>: ${err}`);
    return;
  }
  console.log('styles merged succesfully');
};
mergeStyles();