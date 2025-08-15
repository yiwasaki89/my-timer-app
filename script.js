// グローバル変数
let countdownInterval = null;
let countupInterval = null;
let countdownTime = 0;
let countupTime = 0;
let countdownRunning = false;
let countupRunning = false;

// DOM要素の取得
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// カウントダウン要素
const countdownMinutesInput = document.getElementById('countdown-minutes');
const countdownSecondsInput = document.getElementById('countdown-seconds');
const countdownDisplay = document.getElementById('countdown-display');
const countdownStartBtn = document.getElementById('countdown-start');
const countdownPauseBtn = document.getElementById('countdown-pause');
const countdownResetBtn = document.getElementById('countdown-reset');
const countdownStatus = document.getElementById('countdown-status');

// カウントアップ要素
const countupDisplay = document.getElementById('countup-display');
const countupStartBtn = document.getElementById('countup-start');
const countupPauseBtn = document.getElementById('countup-pause');
const countupResetBtn = document.getElementById('countup-reset');
const countupStatus = document.getElementById('countup-status');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeClock();
    initializeCountdown();
    initializeCountup();
    initializeFullscreen();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// タブ機能の初期化
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    // アクティブなタブボタンを更新
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    
    // アクティブなタブコンテンツを更新
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(targetTab).classList.add('active');
}

// 現在時刻の初期化と更新
function initializeClock() {
    updateCurrentTime();
}

// フルスクリーン機能の初期化
function initializeFullscreen() {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // フルスクリーン状態の変更を監視
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

function toggleFullscreen() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        // フルスクリーンモードに入る
        enterFullscreen();
    } else {
        // フルスクリーンモードを終了
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    
    // フルスクリーンクラスを追加
    document.body.classList.add('fullscreen-mode');
    updateFullscreenButton(true);
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    
    // フルスクリーンクラスを削除
    document.body.classList.remove('fullscreen-mode');
    updateFullscreenButton(false);
}

function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);
    
    if (isFullscreen) {
        document.body.classList.add('fullscreen-mode');
        updateFullscreenButton(true);
    } else {
        document.body.classList.remove('fullscreen-mode');
        updateFullscreenButton(false);
    }
}

function updateFullscreenButton(isFullscreen) {
    const icon = fullscreenBtn.querySelector('.fullscreen-icon');
    if (isFullscreen) {
        icon.textContent = '⛶'; // 縮小アイコン
        fullscreenBtn.title = 'フルスクリーン終了 (ESC)';
    } else {
        icon.textContent = '⛶'; // 拡大アイコン
        fullscreenBtn.title = 'フルスクリーン切り替え (F11)';
    }
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ja-JP', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    currentTimeElement.textContent = timeString;
    currentDateElement.textContent = dateString;
}

// カウントダウンタイマーの初期化
function initializeCountdown() {
    countdownStartBtn.addEventListener('click', startCountdown);
    countdownPauseBtn.addEventListener('click', pauseCountdown);
    countdownResetBtn.addEventListener('click', resetCountdown);
    
    countdownMinutesInput.addEventListener('input', updateCountdownDisplay);
    countdownSecondsInput.addEventListener('input', updateCountdownDisplay);
    
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    if (!countdownRunning) {
        const minutes = parseInt(countdownMinutesInput.value) || 0;
        const seconds = parseInt(countdownSecondsInput.value) || 0;
        countdownTime = minutes * 60 + seconds;
    }
    
    const displayMinutes = Math.floor(countdownTime / 60);
    const displaySeconds = countdownTime % 60;
    countdownDisplay.textContent = 
        `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
}

function startCountdown() {
    if (countdownTime <= 0) {
        const minutes = parseInt(countdownMinutesInput.value) || 0;
        const seconds = parseInt(countdownSecondsInput.value) || 0;
        countdownTime = minutes * 60 + seconds;
    }
    
    if (countdownTime <= 0) {
        alert('時間を設定してください');
        return;
    }
    
    countdownRunning = true;
    countdownStatus.textContent = '実行中...';
    countdownStatus.className = 'status running';
    countdownDisplay.classList.add('pulse');
    
    countdownStartBtn.disabled = true;
    countdownPauseBtn.disabled = false;
    
    countdownInterval = setInterval(() => {
        countdownTime--;
        updateCountdownDisplay();
        
        if (countdownTime <= 0) {
            finishCountdown();
        }
    }, 1000);
}

function pauseCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    countdownStatus.textContent = '一時停止中';
    countdownStatus.className = 'status paused';
    countdownDisplay.classList.remove('pulse');
    
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
}

function resetCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = 0;
    updateCountdownDisplay();
    countdownStatus.textContent = '';
    countdownStatus.className = 'status';
    countdownDisplay.classList.remove('pulse');
    
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
}

function finishCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    countdownStatus.textContent = '時間終了！';
    countdownStatus.className = 'status finished';
    countdownDisplay.classList.remove('pulse');
    
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
    
    // 音声通知（ブラウザがサポートしている場合）
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('時間終了です');
        utterance.lang = 'ja-JP';
        speechSynthesis.speak(utterance);
    }
    
    // ブラウザ通知（許可されている場合）
    if (Notification.permission === 'granted') {
        new Notification('タイマー終了', {
            body: 'カウントダウンタイマーが終了しました',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>'
        });
    }
}

// カウントアップタイマーの初期化
function initializeCountup() {
    countupStartBtn.addEventListener('click', startCountup);
    countupPauseBtn.addEventListener('click', pauseCountup);
    countupResetBtn.addEventListener('click', resetCountup);
    
    updateCountupDisplay();
}

function updateCountupDisplay() {
    const minutes = Math.floor(countupTime / 60);
    const seconds = countupTime % 60;
    countupDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startCountup() {
    countupRunning = true;
    countupStatus.textContent = '実行中...';
    countupStatus.className = 'status running';
    countupDisplay.classList.add('pulse');
    
    countupStartBtn.disabled = true;
    countupPauseBtn.disabled = false;
    
    countupInterval = setInterval(() => {
        countupTime++;
        updateCountupDisplay();
    }, 1000);
}

function pauseCountup() {
    countupRunning = false;
    clearInterval(countupInterval);
    countupStatus.textContent = '一時停止中';
    countupStatus.className = 'status paused';
    countupDisplay.classList.remove('pulse');
    
    countupStartBtn.disabled = false;
    countupPauseBtn.disabled = true;
}

function resetCountup() {
    countupRunning = false;
    clearInterval(countupInterval);
    countupTime = 0;
    updateCountupDisplay();
    countupStatus.textContent = '';
    countupStatus.className = 'status';
    countupDisplay.classList.remove('pulse');
    
    countupStartBtn.disabled = false;
    countupPauseBtn.disabled = true;
}

// ブラウザ通知の許可を要求
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    // F11キーでフルスクリーン切り替え
    if (e.code === 'F11') {
        e.preventDefault();
        toggleFullscreen();
        return;
    }
    
    // ESCキーでフルスクリーン終了
    if (e.code === 'Escape') {
        if (document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullscreenElement) {
            exitFullscreen();
            return;
        }
    }
    
    // スペースキーでタイマーの開始/一時停止
    if (e.code === 'Space') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab-content.active').id;
        
        if (activeTab === 'countdown') {
            if (countdownRunning) {
                pauseCountdown();
            } else {
                startCountdown();
            }
        } else if (activeTab === 'countup') {
            if (countupRunning) {
                pauseCountup();
            } else {
                startCountup();
            }
        }
    }
    
    // Rキーでリセット
    if (e.code === 'KeyR') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab-content.active').id;
        
        if (activeTab === 'countdown') {
            resetCountdown();
        } else if (activeTab === 'countup') {
            resetCountup();
        }
    }
    
    // 数字キーでタブ切り替え
    if (e.code === 'Digit1') {
        switchTab('clock');
    } else if (e.code === 'Digit2') {
        switchTab('countdown');
    } else if (e.code === 'Digit3') {
        switchTab('countup');
    }
});
