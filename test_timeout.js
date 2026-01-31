// 测试setTimeout是否执行的脚本
// 在浏览器控制台运行

console.log('========== setTimeout执行测试 ==========');

// 检查是否有任何JavaScript错误
console.log('\n1. 检查控制台是否有红色错误信息');

// 尝试手动执行setTimeout内部的代码
console.log('\n2. 尝试手动执行事件绑定代码:');

try {
    // 测试绑定保存按钮
    console.log('绑定保存按钮...');
    $('#gg_save_pmt').off('click').on('click', async function() {
        console.log('✅ 保存按钮被点击了！');
        alert('保存按钮工作正常！');
    });
    console.log('✅ 保存按钮事件已绑定');

    // 测试绑定恢复默认按钮
    console.log('绑定恢复默认按钮...');
    $('#gg_reset_pmt').off('click').on('click', async function() {
        console.log('✅ 恢复默认按钮被点击了！');
        alert('恢复默认按钮工作正常！');
    });
    console.log('✅ 恢复默认按钮事件已绑定');

    // 测试绑定radio切换
    console.log('绑定radio切换事件...');
    $('input[name="pmt-sum-type"]').off('change').on('change', function() {
        const type = $(this).val();
        console.log('✅ Radio切换到:', type);
        alert('Radio切换工作正常！当前值: ' + type);
    });
    console.log('✅ Radio切换事件已绑定');

    console.log('\n========== 测试完成 ==========');
    console.log('✅ 所有事件已手动绑定，现在尝试点击按钮或切换radio');
    console.log('如果仍然不工作，说明问题可能在SillyTavern的弹窗机制中');

} catch (e) {
    console.error('❌ 绑定事件时出错:', e);
    console.error('错误堆栈:', e.stack);
}
