// ========================================================================
// 提示词管理页面终极诊断脚本
// 在浏览器控制台运行此脚本，收集所有信息并找出问题
// ========================================================================

console.log('='.repeat(100));
console.log('🔍 提示词管理页面终极诊断工具');
console.log('='.repeat(100));

const diagnosticData = {
    timestamp: new Date().toISOString(),
    environment: {},
    elements: {},
    events: {},
    styles: {},
    issues: []
};

// 1. 环境检查
console.log('\n📦 1. 环境检查:');
try {
    diagnosticData.environment = {
        jQuery: typeof $ !== 'undefined' ? $.fn.jquery : 'NOT FOUND',
        jQueryAvailable: typeof $ !== 'undefined',
        windowGaigai: typeof window.Gaigai !== 'undefined',
        popFunction: typeof window.Gaigai?.pop === 'function',
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
    };
    console.log('✅ jQuery:', diagnosticData.environment.jQuery);
    console.log('✅ window.Gaigai:', diagnosticData.environment.windowGaigai);
    console.log('✅ pop函数:', diagnosticData.environment.popFunction);
} catch (e) {
    diagnosticData.issues.push('环境检查失败: ' + e.message);
    console.error('❌ 环境检查失败:', e);
}

// 2. 弹窗容器检查
console.log('\n🪟 2. 弹窗容器检查:');
try {
    const $overlay = $('.g-ov');
    diagnosticData.elements.overlay = {
        found: $overlay.length > 0,
        count: $overlay.length,
        visible: $overlay.is(':visible'),
        display: $overlay.css('display'),
        zIndex: $overlay.css('z-index'),
        position: $overlay.css('position'),
        pointerEvents: $overlay.css('pointer-events')
    };

    if ($overlay.length > 0) {
        console.log(`✅ 找到 ${$overlay.length} 个弹窗容器`);
        console.log('   可见性:', diagnosticData.elements.overlay.visible);
        console.log('   display:', diagnosticData.elements.overlay.display);
        console.log('   z-index:', diagnosticData.elements.overlay.zIndex);
        console.log('   pointer-events:', diagnosticData.elements.overlay.pointerEvents);
    } else {
        diagnosticData.issues.push('未找到弹窗容器');
        console.error('❌ 未找到弹窗容器');
    }
} catch (e) {
    diagnosticData.issues.push('弹窗检查失败: ' + e.message);
    console.error('❌ 弹窗检查失败:', e);
}

// 3. 按钮元素检查
console.log('\n🔘 3. 按钮元素检查:');
const buttonSelectors = {
    '保存设置': '#gg_save_pmt',
    '恢复默认': '#gg_reset_pmt'
};

diagnosticData.elements.buttons = {};

for (const [name, selector] of Object.entries(buttonSelectors)) {
    try {
        const $btn = $(selector);
        const btnData = {
            found: $btn.length > 0,
            visible: $btn.is(':visible'),
            disabled: $btn.prop('disabled'),
            display: $btn.css('display'),
            pointerEvents: $btn.css('pointer-events'),
            opacity: $btn.css('opacity'),
            zIndex: $btn.css('z-index'),
            position: $btn.css('position'),
            cursor: $btn.css('cursor'),
            offset: $btn.length > 0 ? $btn.offset() : null,
            outerWidth: $btn.length > 0 ? $btn.outerWidth() : null,
            outerHeight: $btn.length > 0 ? $btn.outerHeight() : null,
            hasClickEvent: false,
            clickHandlerCount: 0
        };

        if ($btn.length > 0) {
            const events = $._data($btn[0], 'events');
            btnData.hasClickEvent = !!(events && events.click);
            btnData.clickHandlerCount = events && events.click ? events.click.length : 0;

            console.log(`✅ ${name} (${selector}):`);
            console.log(`   可见: ${btnData.visible}, 禁用: ${btnData.disabled}`);
            console.log(`   pointer-events: ${btnData.pointerEvents}, cursor: ${btnData.cursor}`);
            console.log(`   事件: ${btnData.hasClickEvent ? '✅ 已绑定 ' + btnData.clickHandlerCount + ' 个' : '❌ 未绑定'}`);

            if (!btnData.hasClickEvent) {
                diagnosticData.issues.push(`${name}按钮没有绑定点击事件`);
            }
        } else {
            console.error(`❌ ${name}按钮未找到`);
            diagnosticData.issues.push(`${name}按钮未找到`);
        }

        diagnosticData.elements.buttons[name] = btnData;
    } catch (e) {
        diagnosticData.issues.push(`${name}按钮检查失败: ` + e.message);
        console.error(`❌ ${name}按钮检查失败:`, e);
    }
}

// 4. Radio按钮和标签检查
console.log('\n🔘 4. Radio按钮和标签检查:');
try {
    const $radios = $('input[name="pmt-sum-type"]');
    diagnosticData.elements.radios = {
        found: $radios.length > 0,
        count: $radios.length,
        items: []
    };

    console.log(`找到 ${$radios.length} 个radio按钮`);

    $radios.each(function(i) {
        const $radio = $(this);
        const $label = $radio.parent('label');
        const radioData = {
            value: $radio.val(),
            checked: $radio.is(':checked'),
            visible: $radio.is(':visible'),
            display: $radio.css('display'),
            opacity: $radio.css('opacity'),
            pointerEvents: $radio.css('pointer-events'),
            position: $radio.css('position'),
            hasChangeEvent: false,
            changeHandlerCount: 0,
            label: {
                found: $label.length > 0,
                id: $label.attr('id'),
                visible: $label.is(':visible'),
                cursor: $label.css('cursor'),
                pointerEvents: $label.css('pointer-events')
            }
        };

        const events = $._data(this, 'events');
        radioData.hasChangeEvent = !!(events && events.change);
        radioData.changeHandlerCount = events && events.change ? events.change.length : 0;

        console.log(`  [${radioData.checked ? '✓' : ' '}] ${radioData.value}:`);
        console.log(`      radio可见: ${radioData.visible}, display: ${radioData.display}, opacity: ${radioData.opacity}`);
        console.log(`      label: ${radioData.label.id}, cursor: ${radioData.label.cursor}`);
        console.log(`      事件: ${radioData.hasChangeEvent ? '✅ 已绑定' : '❌ 未绑定'}`);

        if (!radioData.hasChangeEvent) {
            diagnosticData.issues.push(`Radio按钮 ${radioData.value} 没有绑定change事件`);
        }

        diagnosticData.elements.radios.items.push(radioData);
    });
} catch (e) {
    diagnosticData.issues.push('Radio检查失败: ' + e.message);
    console.error('❌ Radio检查失败:', e);
}

// 5. 遮挡检测
console.log('\n🔍 5. 遮挡检测:');
try {
    const $saveBtn = $('#gg_save_pmt');
    if ($saveBtn.length > 0 && $saveBtn.is(':visible')) {
        const offset = $saveBtn.offset();
        const centerX = offset.left + $saveBtn.outerWidth() / 2;
        const centerY = offset.top + $saveBtn.outerHeight() / 2;

        const elemAtPoint = document.elementFromPoint(centerX, centerY);

        diagnosticData.elements.occlusion = {
            buttonCenter: { x: centerX, y: centerY },
            elementAtPoint: elemAtPoint ? {
                tagName: elemAtPoint.tagName,
                id: elemAtPoint.id,
                className: elemAtPoint.className,
                isButton: elemAtPoint === $saveBtn[0] || $saveBtn.has(elemAtPoint).length > 0
            } : null
        };

        if (elemAtPoint && (elemAtPoint === $saveBtn[0] || $saveBtn.has(elemAtPoint).length > 0)) {
            console.log('✅ 保存按钮没有被遮挡');
        } else if (elemAtPoint) {
            const info = `${elemAtPoint.tagName}${elemAtPoint.id ? '#' + elemAtPoint.id : ''}${elemAtPoint.className ? '.' + elemAtPoint.className.split(' ').join('.') : ''}`;
            console.warn('⚠️ 保存按钮被遮挡，遮挡元素:', info);
            diagnosticData.issues.push('保存按钮被遮挡: ' + info);
        }
    }
} catch (e) {
    diagnosticData.issues.push('遮挡检测失败: ' + e.message);
    console.error('❌ 遮挡检测失败:', e);
}

// 6. setTimeout检查
console.log('\n⏱️ 6. setTimeout延迟检查:');
try {
    // 检查DOM是否完全加载
    const $textareas = $('.g-p textarea');
    const $allInputs = $('.g-p input');

    diagnosticData.elements.domLoaded = {
        textareaCount: $textareas.length,
        inputCount: $allInputs.length,
        saveButtonExists: $('#gg_save_pmt').length > 0
    };

    console.log('   Textarea数量:', $textareas.length);
    console.log('   Input数量:', $allInputs.length);
    console.log('   保存按钮存在:', $('#gg_save_pmt').length > 0);

    if ($textareas.length === 0) {
        diagnosticData.issues.push('DOM可能未完全加载，找不到textarea元素');
        console.warn('⚠️ DOM可能未完全加载');
    }
} catch (e) {
    diagnosticData.issues.push('DOM检查失败: ' + e.message);
    console.error('❌ DOM检查失败:', e);
}

// 7. 手动测试点击
console.log('\n🖱️ 7. 手动触发测试:');
console.log('正在尝试手动触发保存按钮点击...');
try {
    const $saveBtn = $('#gg_save_pmt');
    if ($saveBtn.length > 0) {
        let clickFired = false;
        const testHandler = function() {
            clickFired = true;
            console.log('✅ 点击事件成功触发！');
        };

        $saveBtn.one('click', testHandler);
        $saveBtn.trigger('click');

        setTimeout(() => {
            if (!clickFired) {
                console.error('❌ 手动trigger("click")没有触发事件');
                diagnosticData.issues.push('手动trigger("click")没有触发事件');
            }
            $saveBtn.off('click', testHandler);
        }, 100);
    }
} catch (e) {
    diagnosticData.issues.push('手动点击测试失败: ' + e.message);
    console.error('❌ 手动点击测试失败:', e);
}

// 8. 查找可能的错误
console.log('\n⚠️ 8. JavaScript错误检查:');
console.log('请查看Console面板中是否有红色的错误信息');

// 9. 总结问题
console.log('\n' + '='.repeat(100));
console.log('📊 诊断总结:');
console.log('='.repeat(100));

if (diagnosticData.issues.length > 0) {
    console.log('\n❌ 发现以下问题:');
    diagnosticData.issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
    });
} else {
    console.log('\n✅ 未发现明显问题（但按钮仍不工作，需要进一步调查）');
}

// 10. 导出诊断数据
console.log('\n📤 诊断数据已准备好，请复制以下内容发送给开发者:');
console.log('='.repeat(100));
console.log(JSON.stringify(diagnosticData, null, 2));
console.log('='.repeat(100));

// 11. 提供快速修复建议
console.log('\n💡 快速测试命令:');
console.log('// 1. 测试jQuery是否正常');
console.log('typeof $ !== "undefined"');
console.log('');
console.log('// 2. 手动绑定点击事件测试');
console.log('$("#gg_save_pmt").off("click").on("click", function() { alert("按钮被点击了！"); });');
console.log('');
console.log('// 3. 测试radio切换');
console.log('$("input[name=\'pmt-sum-type\'][value=\'chat\']").prop("checked", true).trigger("change");');
console.log('');
console.log('// 4. 检查是否有元素阻止事件传播');
console.log('$(document).on("click", function(e) { console.log("点击了:", e.target); });');

// 返回诊断数据供进一步分析
window.diagnosticData = diagnosticData;
console.log('\n✅ 诊断数据已保存到 window.diagnosticData');
