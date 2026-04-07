let ws = null;
let wsReady = false;
let pendingUrl = null;

/**
 * 建立 WebSocket 连接
 */
function connectWebSocket(callback) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        if (callback) callback();
        return;
    }

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(protocol + '//' + location.host + '/ws/analysis');

    ws.onopen = function() {
        console.log('WebSocket 已连接');
        wsReady = true;
        if (callback) callback();
    };

    ws.onmessage = function(event) {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
    };

    ws.onerror = function(error) {
        console.error('WebSocket 错误:', error);
        wsReady = false;
        showStatus('error', '连接服务失败，请刷新页面重试');
        enableButtons();
    };

    ws.onclose = function() {
        console.log('WebSocket 已断开');
        wsReady = false;
    };
}

/**
 * 在步骤1区域显示状态信息
 */
function showStatus(type, message) {
    var statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'statusMessage';
        var stepContent = document.querySelector('#step-url .step-content');
        stepContent.appendChild(statusDiv);
    }
    statusDiv.style.display = 'block';
    statusDiv.style.padding = '12px 16px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.marginTop = '12px';
    statusDiv.style.fontSize = '14px';

    if (type === 'error') {
        statusDiv.style.background = '#fce4ec';
        statusDiv.style.borderLeft = '4px solid #f44336';
        statusDiv.style.color = '#c62828';
    } else if (type === 'info') {
        statusDiv.style.background = '#e3f2fd';
        statusDiv.style.borderLeft = '4px solid #2196f3';
        statusDiv.style.color = '#1565c0';
    } else if (type === 'success') {
        statusDiv.style.background = '#e8f5e9';
        statusDiv.style.borderLeft = '4px solid #4caf50';
        statusDiv.style.color = '#2e7d32';
    }
    statusDiv.textContent = message;
}

function hideStatus() {
    var statusDiv = document.getElementById('statusMessage');
    if (statusDiv) statusDiv.style.display = 'none';
}

/**
 * 处理服务端消息
 */
function handleMessage(msg) {
    switch (msg.type) {
        case 'connected':
            console.log('服务已连接');
            break;

        case 'launching':
            showStatus('info', msg.message);
            break;

        case 'browserReady':
            hideStatus();
            showStep('step-wait');
            document.getElementById('waitMessage').innerHTML =
                '浏览器已打开，请在弹出的浏览器窗口中：<br><br>' +
                '1. 完成登录（如需要）<br>' +
                '2. 导航到你要接入翻译的页面<br>' +
                '3. 确认页面加载完成后，点击下方按钮<br>';
            break;

        case 'analysisStarted':
            showStep('step-progress');
            appendLog('analyzing', msg.message);
            break;

        case 'progress':
            if (msg.data) {
                appendLog(msg.data.phase, msg.data.message);
            }
            break;

        case 'result':
            renderReport(msg.data);
            showStep('step-report');
            break;

        case 'error':
            showStatus('error', msg.message);
            // 同时写到进度日志（如果可见的话）
            appendLog('error', msg.message);
            enableButtons();
            break;
    }
}

/**
 * 启动浏览器
 */
function launchBrowser() {
    var url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert('请输入网站地址');
        return;
    }

    document.getElementById('btnLaunch').disabled = true;
    document.getElementById('btnLaunch').textContent = '启动中...';
    hideStatus();
    showStatus('info', '正在连接服务...');

    // 确保 WebSocket 连接就绪后再发送
    connectWebSocket(function() {
        showStatus('info', '正在启动浏览器，请稍候...');
        ws.send(JSON.stringify({
            action: 'launch',
            url: url
        }));
    });
}

/**
 * 用户确认页面已就绪
 */
function pageReady() {
    document.getElementById('btnReady').disabled = true;
    document.getElementById('btnReady').textContent = '分析中，请稍候...';
    showStep('step-progress');

    ws.send(JSON.stringify({
        action: 'pageReady'
    }));
}

/**
 * 添加日志行
 */
function appendLog(phase, message) {
    var logDiv = document.getElementById('progressLog');
    if (!logDiv) return;

    var lines = message.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.trim()) continue;
        var lineEl = document.createElement('div');
        lineEl.className = 'log-line phase-' + phase;

        var time = new Date().toLocaleTimeString();
        lineEl.textContent = '[' + time + '] ' + line;
        logDiv.appendChild(lineEl);
    }
    logDiv.scrollTop = logDiv.scrollHeight;
}

/**
 * 显示指定步骤
 */
function showStep(stepId) {
    var targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
        // 滚动到该步骤
        targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * 渲染报告
 */
function renderReport(data) {
    // 网站信息
    document.getElementById('reportUrl').textContent = data.url || '';
    document.getElementById('reportTitle').textContent = data.pageTitle || '';
    document.getElementById('reportFramework').textContent = data.detectedFramework || 'Unknown';
    document.getElementById('reportLanguage').textContent = data.detectedLanguage || 'unknown';

    // 接入代码
    document.getElementById('insertPosition').textContent = data.insertPosition || '将代码插入到 </body> 标签之前';
    document.getElementById('finalCode').textContent = data.finalCode || '';

    // 截图
    if (data.screenshotBefore) {
        document.getElementById('imgBefore').src = 'data:image/png;base64,' + data.screenshotBefore;
    }
    if (data.screenshotAfter) {
        document.getElementById('imgAfter').src = 'data:image/png;base64,' + data.screenshotAfter;
    }
    if (data.screenshotMobile) {
        document.getElementById('imgMobile').src = 'data:image/png;base64,' + data.screenshotMobile;
    }

    // 审查历程
    renderAuditHistory(data.rounds || []);

    // 注意事项
    if (data.notes && data.notes.length > 0) {
        document.getElementById('notesSection').style.display = 'block';
        var notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        for (var i = 0; i < data.notes.length; i++) {
            var li = document.createElement('li');
            li.textContent = data.notes[i];
            notesList.appendChild(li);
        }
    }
}

/**
 * 渲染审查历程
 */
function renderAuditHistory(rounds) {
    var container = document.getElementById('auditHistory');
    container.innerHTML = '';

    for (var r = 0; r < rounds.length; r++) {
        var round = rounds[r];
        var roundDiv = document.createElement('div');
        roundDiv.className = 'audit-round';

        // 头部
        var scoreClass = round.passed ? 'perfect' : (round.overallScore >= 7 ? 'good' : 'bad');
        roundDiv.innerHTML = '<div class="audit-round-header">' +
            '<span>第 ' + round.round + ' 轮</span>' +
            '<span class="score-badge ' + scoreClass + '">' +
            (round.passed ? '全部通过' : 'overall: ' + round.overallScore.toFixed(1)) +
            '</span></div>';

        // 维度列表
        var body = document.createElement('div');
        body.className = 'audit-round-body';

        var dims = round.dimensions || [];
        for (var d = 0; d < dims.length; d++) {
            var dim = dims[d];
            var isPassed = dim.score >= 10;
            var row = document.createElement('div');
            row.className = 'dimension-row';
            row.innerHTML =
                '<div class="dim-status ' + (isPassed ? 'pass' : 'fail') + '">' +
                    (isPassed ? 'PASS' : 'FAIL') +
                '</div>' +
                '<div class="dim-name">' + escapeHtml(dim.name) + '</div>' +
                '<div class="dim-score">' + dim.score + '/10</div>' +
                '<div class="dim-detail">' + escapeHtml(dim.detail || '') + '</div>';
            body.appendChild(row);
        }

        roundDiv.appendChild(body);
        container.appendChild(roundDiv);
    }
}

/**
 * 复制代码到剪贴板
 */
function copyCode() {
    var code = document.getElementById('finalCode').textContent;
    navigator.clipboard.writeText(code).then(function() {
        var btn = document.querySelector('.btn-copy');
        var originalText = btn.textContent;
        btn.textContent = '已复制!';
        setTimeout(function() { btn.textContent = originalText; }, 2000);
    }).catch(function() {
        var textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('代码已复制到剪贴板');
    });
}

function enableButtons() {
    var btnLaunch = document.getElementById('btnLaunch');
    if (btnLaunch) {
        btnLaunch.disabled = false;
        btnLaunch.textContent = '启动浏览器';
    }
    var btnReady = document.getElementById('btnReady');
    if (btnReady) {
        btnReady.disabled = false;
        btnReady.textContent = '页面已就绪，开始分析';
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载时自动连接 WebSocket
window.addEventListener('load', function() {
    connectWebSocket();

    // 回车键触发启动
    document.getElementById('urlInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            launchBrowser();
        }
    });
});
