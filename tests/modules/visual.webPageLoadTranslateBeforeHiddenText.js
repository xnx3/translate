require('../helpers/module')(__filename, [
  { remark: '目标语种不同于本地语种时启用并隐藏文本', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    return translate.visual.webPageLoadTranslateBeforeHiddenText_use === true && document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '本地语种与当前语种相同时不隐藏', test: function () {
    translate.language.setLocal('english'); translate.language.setDefaultTo('english');
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    return translate.visual.webPageLoadTranslateBeforeHiddenText_use === true && !document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '强制翻译本地语种时同语种也进入隐藏状态', test: function () {
    translate.language.setLocal('english'); translate.language.setDefaultTo('english'); translate.language.translateLocal = true;
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    return document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '重复调用不重复注册生命周期回调', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    const before = [translate.lifecycle.execute.translateNetworkBefore.length, translate.lifecycle.execute.renderFinish.length, translate.lifecycle.execute.finally.length];
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    return translate.lifecycle.execute.translateNetworkBefore.length === before[0] + 1 && translate.lifecycle.execute.renderFinish.length === before[1] + 1 && translate.lifecycle.execute.finally.length === before[2] + 1;
  } },
  { remark: '首次翻译渲染完成后解除隐藏', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    translate.lifecycle.execute.translateNetworkBefore.at(-1)({ uuid: 'first' });
    translate.lifecycle.execute.renderFinish.at(-1)('first', 'english');
    return !document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '其他翻译任务渲染完成不会提前解除首次任务的隐藏', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    translate.lifecycle.execute.translateNetworkBefore.at(-1)({ uuid: 'first' });
    translate.lifecycle.execute.renderFinish.at(-1)('other', 'english');
    return document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '初始化阶段 finally 回调兜底恢复可见文本', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.language.setDefaultTo('english');
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    translate.lifecycle.execute.finally.at(-1)({ triggerNumber: 1 });
    return !document.documentElement.classList.contains('translatejs-text-hidden');
  } },
  { remark: '关闭 inHeadTip 后不打印 head 位置警告', test: function () {
    translate.language.setLocal('english');
    const logs = []; translate.log = function (message) { logs.push(String(message)); };
    translate.visual.webPageLoadTranslateBeforeHiddenText({ inHeadTip: false });
    return !logs.some(message => message.includes('head 标签'));
  } }
]);
