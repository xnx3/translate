
translate.extend = {
    elementUI:{
        mounted:function(){
            translate.element.tagAttribute['input']=['value']; //对 input 的value也进行翻译
            
        },
        beforeDestroy:function() {
            // 移除事件监听，防止内存泄漏
            document.removeEventListener('input', translate.extend.elementUI.handleAllInputChange, true);
            document.removeEventListener('change', translate.extend.elementUI.handleAllInputChange, true);
        },
        handleAllInputChange:function(event){
            const target = event.target;
            console.log(target);
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



