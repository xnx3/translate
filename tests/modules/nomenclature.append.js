'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "单条术语配置写入对应语种映射",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "你好=Hello");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "多行配置分别写入不同术语",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "你好=Hello\n世界=World");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 2 &&
        data["你好"] === "Hello" &&
        data["世界"] === "World";
    }
  },
  {
    remark: "配置行首尾空格与键值两侧空格被裁剪",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "  你好 = Hello  ");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "CRLF 行结束符被正确处理",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "你好=Hello\r\n世界=World\r\n");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 2 &&
        data["你好"] === "Hello" &&
        data["世界"] === "World";
    }
  },
  {
    remark: "空行不会创建额外术语",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "\n你好=Hello\n\n");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "仅包含空白的行被忽略",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', " \t\n你好=Hello\n  ");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "重复键以最后一行值为准",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "你好=First\n你好=Last");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Last";
    }
  },
  {
    remark: "相同键值表示忽略翻译，仍保留该术语",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "ContiNew Admin=ContiNew Admin");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["ContiNew Admin"] === "ContiNew Admin";
    }
  },
  {
    remark: "空键行被忽略但有效行仍写入",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "=ignored\n你好=Hello");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "空值行被忽略但有效行仍写入",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "空值=\n你好=Hello");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "缺少等号的行被忽略",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "invalid\n你好=Hello");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "包含多个等号的非键值行被忽略",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "invalid=a=b\n你好=Hello");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["你好"] === "Hello";
    }
  },
  {
    remark: "Unicode 和 emoji 键值保持完整",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "中文😀=Hello😀");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["中文😀"] === "Hello😀";
    }
  },
  {
    remark: "标点、美元和正则字符作为普通文本保存",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "a.b$=x+y?");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 1 &&
        data["a.b$"] === "x+y?";
    }
  },
  {
    remark: "空配置不生成术语条目",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', "");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 0;
    }
  },
  {
    remark: "仅空白配置不生成术语条目",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', " \n\t ");
      const data = translate.nomenclature.get().chinese_simplified.english;
      return Object.keys(data).length === 0;
    }
  },
  {
    remark: "来源语种为 undefined 时采用已设置的本地语种",
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.nomenclature.append(undefined, 'english', '你好=Hello');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: "来源语种为 null 时采用已设置的本地语种",
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.nomenclature.append(null, 'english', '你好=Hello');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: "来源语种为 auto 时采用已设置的本地语种",
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.nomenclature.append('auto', 'english', '你好=Hello');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: "连续追加保留旧键并新增新键",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      translate.nomenclature.append('chinese_simplified', 'english', '世界=World');
      const data = translate.nomenclature.get().chinese_simplified.english;
      return data['你好'] === 'Hello' && data['世界'] === 'World';
    }
  },
  {
    remark: "后一次追加覆盖已有同名键",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=First');
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Last');
      return translate.nomenclature.get().chinese_simplified.english['你好'] === 'Last';
    }
  },
  {
    remark: "相同来源到不同目标语种的术语互相隔离",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      translate.nomenclature.append('chinese_simplified', 'spanish', '你好=Hola');
      const data = translate.nomenclature.get().chinese_simplified;
      return data.english['你好'] === 'Hello' && data.spanish['你好'] === 'Hola';
    }
  },
  {
    remark: "不同来源到相同目标语种的术语互相隔离",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      translate.nomenclature.append('japanese', 'english', 'こんにちは=HelloJP');
      const data = translate.nomenclature.get();
      return data.chinese_simplified.english['你好'] === 'Hello' && data.japanese.english['こんにちは'] === 'HelloJP';
    }
  },
  {
    remark: "较长术语排在较短术语之前，保证优先匹配长词",
    test: function () {
      translate.nomenclature.append('chinese_simplified', 'english', '你=you\n你好=Hello\n你好世界=HelloWorld');
      const keys = Object.keys(translate.nomenclature.get().chinese_simplified.english);
      return keys[0] === '你好世界' && keys[1] === '你好' && keys[2] === '你';
    }
  }
]);
