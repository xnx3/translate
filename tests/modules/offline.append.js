'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "单条离线术语写入目标语种缓存",
    test: function () {
      translate.offline.append('english', "你好=Hello");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello";
    }
  },
  {
    remark: "多行离线术语分别写入缓存",
    test: function () {
      translate.offline.append('english', "你好=Hello\n世界=World");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello" &&
        translate.storage.get('hash_english_' + translate.util.hash("世界")) === "World";
    }
  },
  {
    remark: "源文本和值的单行首尾空格保持原样",
    test: function () {
      translate.offline.append('english', " 原文 = value ");
      return translate.storage.get('hash_english_' + translate.util.hash("原文 ")) === " value ";
    }
  },
  {
    remark: "统一两个空格缩进被剥离后正确写入",
    test: function () {
      translate.offline.append('english', "  你好=Hello\n  世界=World");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello" &&
        translate.storage.get('hash_english_' + translate.util.hash("世界")) === "World";
    }
  },
  {
    remark: "统一制表符缩进被剥离后正确写入",
    test: function () {
      translate.offline.append('english', "\t你好=Hello\n\t世界=World");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello" &&
        translate.storage.get('hash_english_' + translate.util.hash("世界")) === "World";
    }
  },
  {
    remark: "空行不影响其他有效项写入",
    test: function () {
      translate.offline.append('english', "\n你好=Hello\n\n世界=World\n");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello" &&
        translate.storage.get('hash_english_' + translate.util.hash("世界")) === "World";
    }
  },
  {
    remark: "相同键重复配置由最后一行覆盖",
    test: function () {
      translate.offline.append('english', "你好=First\n你好=Last");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Last";
    }
  },
  {
    remark: "占位换行符在键和值中还原",
    test: function () {
      translate.offline.append('english', "第一{\\n}第二=First{\\n}Second");
      return translate.storage.get('hash_english_' + translate.util.hash("第一\n第二")) === "First\nSecond";
    }
  },
  {
    remark: "Unicode 和 emoji 键值保存完整",
    test: function () {
      translate.offline.append('english', "中文😀=English😀");
      return translate.storage.get('hash_english_' + translate.util.hash("中文😀")) === "English😀";
    }
  },
  {
    remark: "正则与美元符号按普通文本保存",
    test: function () {
      translate.offline.append('english', "a.b$=x+y?");
      return translate.storage.get('hash_english_' + translate.util.hash("a.b$")) === "x+y?";
    }
  },
  {
    remark: "无等号的非法行不影响后续正常配置",
    test: function () {
      translate.offline.append('english', "invalid\n你好=Hello");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello";
    }
  },
  {
    remark: "多个等号的非法行不影响后续正常配置",
    test: function () {
      translate.offline.append('english', "invalid=a=b\n你好=Hello");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === "Hello";
    }
  },
  {
    remark: "空原文行不写入缓存",
    test: function () {
      translate.offline.append('english', "=Hello");
      return translate.storage.get('hash_english_' + translate.util.hash("")) === null;
    }
  },
  {
    remark: "空译文行不写入缓存",
    test: function () {
      translate.offline.append('english', "你好=");
      return translate.storage.get('hash_english_' + translate.util.hash("你好")) === null;
    }
  },
  {
    remark: "完全空配置不写入空键",
    test: function () {
      translate.offline.append('english', "");
      return translate.storage.get('hash_english_' + translate.util.hash("")) === null;
    }
  },
  {
    remark: "不同目标语种的同一原文保存独立缓存",
    test: function () {
      translate.offline.append('english', '你好=Hello');
      translate.offline.append('spanish', '你好=Hola');
      return translate.storage.get('hash_english_' + translate.util.hash('你好')) === 'Hello' &&
        translate.storage.get('hash_spanish_' + translate.util.hash('你好')) === 'Hola';
    }
  },
  {
    remark: "连续导入不同原文时保留此前离线缓存",
    test: function () {
      translate.offline.append('english', '你好=Hello');
      translate.offline.append('english', '世界=World');
      return translate.storage.get('hash_english_' + translate.util.hash('你好')) === 'Hello' &&
        translate.storage.get('hash_english_' + translate.util.hash('世界')) === 'World';
    }
  },
  {
    remark: "导入缓存不自动切换当前显示语种",
    test: function () {
      translate.to = 'spanish';
      translate.offline.append('english', '你好=Hello');
      return translate.to === 'spanish';
    }
  },
  {
    remark: "导入操作同步完成且返回 undefined",
    test: function () {
      return translate.offline.append('english', '你好=Hello') === undefined &&
        translate.storage.get('hash_english_' + translate.util.hash('你好')) === 'Hello';
    }
  }
]);
