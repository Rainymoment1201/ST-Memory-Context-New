// ========================================================================
// 批量填表诊断脚本
// 在浏览器控制台运行此脚本，查看批量填表为什么没有触发
// ========================================================================

console.log('='.repeat(60));
console.log('📊 批量填表诊断工具');
console.log('='.repeat(60));

// 1. 检查全局对象
if (typeof window.Gaigai === 'undefined') {
    console.error('❌ window.Gaigai 未定义，插件可能未加载');
} else {
    console.log('✅ window.Gaigai 已加载');
}

// 2. 检查配置
const ggConfig = localStorage.getItem('gg_config');
const ggApi = localStorage.getItem('gg_api');

if (!ggConfig) {
    console.error('❌ localStorage 中没有 gg_config');
} else {
    const C = JSON.parse(ggConfig);
    console.log('\n📋 当前配置:');
    console.log('  - autoBackfill (批量填表开关):', C.autoBackfill);
    console.log('  - autoBackfillFloor (触发间隔):', C.autoBackfillFloor, '层');
    console.log('  - autoBackfillDelay (延迟启动):', C.autoBackfillDelay);
    console.log('  - autoBackfillDelayCount (延迟层数):', C.autoBackfillDelayCount, '层');
    console.log('  - autoBackfillPrompt (弹窗确认):', C.autoBackfillPrompt ? '❌ 静默发起' : '✅ 弹窗确认');
    console.log('  - autoBackfillSilent (静默保存):', C.autoBackfillSilent ? '❌ 静默保存' : '✅ 弹窗编辑');
}

if (!ggApi) {
    console.error('❌ localStorage 中没有 gg_api');
} else {
    const API = JSON.parse(ggApi);
    console.log('\n📊 API 配置与进度:');
    console.log('  - enableAI (AI功能):', API.enableAI);
    console.log('  - lastBackfillIndex (上次填表楼层):', API.lastBackfillIndex || 0);
}

// 3. 检查当前会话状态
if (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) {
    const ctx = SillyTavern.getContext();
    const chatLength = ctx.chat?.length || 0;

    console.log('\n💬 当前会话状态:');
    console.log('  - 当前楼层数:', chatLength);

    if (ggConfig && ggApi) {
        const C = JSON.parse(ggConfig);
        const API = JSON.parse(ggApi);
        const lastBf = API.lastBackfillIndex || 0;
        const interval = parseInt(C.autoBackfillFloor) || 10;
        const delay = C.autoBackfillDelay ? (parseInt(C.autoBackfillDelayCount) || 0) : 0;
        const threshold = interval + delay;
        const diff = chatLength - lastBf;

        console.log('  - 上次填表楼层:', lastBf);
        console.log('  - 触发间隔:', interval, '层');
        console.log('  - 延迟层数:', delay, '层');
        console.log('  - 触发阈值:', threshold, '层 (间隔 + 延迟)');
        console.log('  - 当前差值:', diff, '层');
        console.log('  - 是否应触发:', diff >= threshold ? '✅ 是' : '❌ 否');

        if (diff >= threshold) {
            console.log('\n🎯 应该触发批量填表！');
            console.log('填表范围: 第', lastBf, '层 → 第', (C.autoBackfillDelay ? lastBf + interval : chatLength), '层');
        } else {
            console.log('\n⏳ 还需要', threshold - diff, '层才能触发');
        }
    }
} else {
    console.error('❌ 无法获取 SillyTavern 上下文');
}

// 4. 检查消息监听器
console.log('\n🎧 消息监听检查:');
if (typeof window.Gaigai?.omsg === 'function') {
    console.log('✅ omsg 函数已定义');
} else {
    console.error('❌ omsg 函数未定义，消息监听可能未启动');
}

// 5. 检查 BackfillManager
console.log('\n⚡ 批量填表管理器:');
if (typeof window.Gaigai?.BackfillManager === 'object') {
    console.log('✅ BackfillManager 已加载');
    if (typeof window.Gaigai.BackfillManager.autoRunBackfill === 'function') {
        console.log('✅ autoRunBackfill 函数已定义');
    } else {
        console.error('❌ autoRunBackfill 函数未定义');
    }
} else {
    console.error('❌ BackfillManager 未加载');
}

// 6. 检查是否有弹窗阻塞
if ($('.g-ov').length > 0) {
    console.warn('⚠️ 检测到插件弹窗打开，可能会阻止自动触发');
} else {
    console.log('\n✅ 没有弹窗阻塞');
}

// 7. 检查每聊配置
const chatId = SillyTavern?.getContext()?.chatId;
if (chatId) {
    const chatMetaKey = `gg_session_${chatId}`;
    const chatMeta = localStorage.getItem(chatMetaKey);
    if (chatMeta) {
        const meta = JSON.parse(chatMeta);
        console.log('\n💾 当前会话配置:');
        if (meta.config) {
            console.log('  - autoBackfill (会话级):', meta.config.autoBackfill);
            console.log('  - autoBackfillFloor (会话级):', meta.config.autoBackfillFloor);
        }
        if (meta.api) {
            console.log('  - lastBackfillIndex (会话级):', meta.api.lastBf);
        }
    } else {
        console.log('\n⚠️ 当前会话没有独立配置，使用全局配置');
    }
}

console.log('\n' + '='.repeat(60));
console.log('📋 诊断完成！');
console.log('='.repeat(60));
console.log('\n💡 如果发现问题，请检查:');
console.log('  1. autoBackfill 是否为 true');
console.log('  2. lastBackfillIndex 是否正确更新');
console.log('  3. 楼层差值是否 >= 触发阈值');
console.log('  4. BackfillManager 和 autoRunBackfill 是否正常加载');
console.log('  5. 控制台是否有报错信息');
