const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const fileName = path.join(__dirname, 'sample.txt');
const rl = readline.createInterface( {input, output} );
const writeStream = fs.createWriteStream(fileName);

rl.on('line', (text) => {
  if(text === 'exit') {
    process.exit();
  }
  writeStream.write(text + '\n');
});

process.on('exit', () => {
  console.log('Bye, text is saved');
});

console.log('Hi, write your text in console, i will save in sample.txt file');