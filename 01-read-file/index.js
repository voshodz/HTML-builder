const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, 'text.txt');
const readStream = fs.ReadStream(fileName, 'utf-8');
readStream.on('data', (text) => {
  process.stdout.write(text);
});
readStream.on('error', () => {
  process.stdout.write( ` ${fileName}  not exist in current directory` );
});


