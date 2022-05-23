const fs = require('fs');
const fp = require('fs/promises');
const path = require('path');
const folderName = path.join(__dirname, '/secret-folder');

fs.readdir(folderName, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
    process.exit();
  } 
  showInfo(files);
});

const showInfo = async (files) => {
  for(const file of files) {
    if(file.isFile()) {
      const filePath = path.join(folderName, file.name);
      const fileName = path.parse(filePath).name;
      const extName = path.parse(filePath).ext.slice(1);
      const statsOfFile = (await fp.stat(filePath)).size/1024;
      console.log(fileName + '-' + extName + '-' + statsOfFile.toFixed(3) + 'kb');
    }
  }
};