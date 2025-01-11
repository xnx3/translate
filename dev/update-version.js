const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');
const translateJsPath = path.resolve(__dirname, '../translate.js/translate.js');
const translateJs = fs.readFileSync(translateJsPath, 'utf-8');

/**
 * 把 packageJson.version 写入到 ../translate.js/translate.js 中的 version 字段
 * translate.js 中的版本号格式：major.minor.patch.YYYYMMDD
 */
const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const translateJsVersion = `${packageJson.version}.${dateSuffix}`;
const start = translateJs.indexOf('// AUTO_VERSION_START') + '// AUTO_VERSION_START'.length;
const end = translateJs.indexOf('// AUTO_VERSION_END');
const newTranslateJs = `${translateJs.slice(0, start)}\n\tversion: '${translateJsVersion}',\n  ${translateJs.slice(end)}`;
fs.writeFileSync(translateJsPath, newTranslateJs, 'utf-8');

// 添加更新的文件到 git stage
execSync('git add translate.js/translate.js');
