
translate.extend = {
    elementUI:{
        mounted:function(){
            // 使用事件委托，监听整个文档的input事件
            document.addEventListener('input', translate.extend.elementUI.handleAllInputChange, true);

            // 对于ElementUI的输入框，有时需要监听change事件
            document.addEventListener('change', translate.extend.elementUI.handleAllInputChange, true);
        },
        beforeDestroy:function() {
            // 移除事件监听，防止内存泄漏
            document.removeEventListener('input', translate.extend.elementUI.handleAllInputChange, true);
            document.removeEventListener('change', translate.extend.elementUI.handleAllInputChange, true);
        },
        handleAllInputChange:function(event){
            const target = event.target;
            // 检查触发事件的是否是input元素
            if (target.tagName === 'INPUT') {
                console.log('当前变化的元素：', target);
                // 可以在这里获取输入框的值
                console.log('当前值：', target.value);
                console.log(target);
                translate.execute(target);
            }
        }
    }
}



