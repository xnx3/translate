'use strict';

require('../helpers/module')(__filename, [
  { remark: '法语 é 的特征决定法语分类', args: ['café'], expected: 'french' },
  { remark: '法语 œ 的特征决定法语分类', args: ['cœur'], expected: 'french' },
  { remark: '法语大写重音字符同样识别', args: ['ÉÈÊ'], expected: 'french' },
  { remark: '西班牙语 ñ 的特征决定西班牙语分类', args: ['señor'], expected: 'spanish' },
  { remark: '西班牙语 ll 双字符特征被识别', args: ['calle'], expected: 'spanish' },
  { remark: '意大利语 ò 的特征决定意大利语分类', args: ['però'], expected: 'italian' },
  { remark: '意大利语 cc 双字符特征被识别', args: ['ecco'], expected: 'italian' },
  { remark: '意大利语 ss 双字符特征被识别', args: ['rosso'], expected: 'italian' },
  { remark: '葡萄牙语 ã 的特征决定葡萄牙语分类', args: ['amanhã'], expected: 'portuguese' },
  { remark: '葡萄牙语 õ 的特征决定葡萄牙语分类', args: ['põe'], expected: 'portuguese' },
  { remark: '西班牙语双字符特征忽略大小写', args: ['LL'], expected: 'spanish' },
  { remark: '多个语种特征按更高权重分类', args: ['éãõ'], expected: 'portuguese' }
]);
