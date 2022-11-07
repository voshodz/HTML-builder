const fsp = require('fs/promises');
const path = require('path');
const distFolder = path.join(__dirname, 'project-dist');
const cssPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');

const initProjectDistFolder = async(distPath) => {
  try {
    await fsp.rm(distPath, { recursive: true, force: true, maxRetries: 2, retryDelay: 2 });
    await fsp.mkdir(distPath, { recursive: true }).catch(() => fsp.mkdir(distPath, { recursive: true }));
  } catch(err) {
    console.log('Not success init project dist folder');
  }
};

const mergeHtml = async(templatePath, componentPath, outputPath) => {
  const files = await fsp.readdir(componentPath, { withFileTypes: true });
  let bundle = await fsp.readFile(templatePath, 'utf-8');
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentBody = await fsp.readFile(path.join(componentPath, file.name), 'utf-8');
      //console.log(componentBody);
      //console.log(bundle);
      //console.log('<---------------------------->');
      const replaceField = '{{' + `${file.name.replace(/\.html/, '')}` + '}}';
      bundle = bundle.replace(replaceField, componentBody);
    }
  }
  await fsp.writeFile(outputPath, bundle);
};

const copyAssets = async(input, output) => {
  await fsp.mkdir(output, { recursive: true });
  const files = await fsp.readdir(input, { withFileTypes: true });
  for (const file of files) {
    const inputPath = path.join(input, file.name);
    const outputPath = path.join(output, file.name);
    if (file.isFile()) {
      await fsp.copyFile(inputPath, outputPath);
    } else {
      await copyAssets(inputPath, outputPath);
    }
  }
};

const mergeStyles = async(input, output) => {
  const files = await fsp.readdir(input, { withFileTypes: true });
  let result = '';
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      if (result) {
        result += '\n';
      }
      result += await fsp.readFile(path.join(input, file.name));
    }
  }
  await fsp.writeFile(output, result);
};

const bundleFiles = async() => {
  await initProjectDistFolder(distFolder);
  await mergeHtml(templatePath, componentsPath, path.join(distFolder, 'index.html'));
  await copyAssets(assetsPath, path.join(distFolder, 'assets'));
  await mergeStyles(cssPath, path.join(distFolder, 'style.css'));
};

bundleFiles().catch((err) => {
  console.log(`we got err => ${err}, try again pls`);
});
