// Professional Pause System (Extracted from uploaded kids portal)
let gameActive = false;
let gamePaused = false;
let currentTimerInterval = null;
let pausedTime = 0;

// Pause System CSS (injected dynamically)
const pauseSystemCSS = `
.pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 24px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.pause-overlay.show {
    opacity: 1;
    visibility: visible;
}

.pause-title {
    color: white;
    font-size: 3em;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    font-weight: 700;
}

.resume-btn {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    padding: 20px 40px;
    border-radius: 16px;
    font-size: 1.5em;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    backdrop-filter: blur(10px);
}

.resume-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(99, 102, 241, 0.5);
}

.pause-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    padding: 12px 24px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 50;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

[dir="rtl"] .pause-btn {
    left: auto;
    right: 20px;
}

.pause-btn:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}
`;

// Inject pause system CSS
function injectPauseCSS() {
    if (!document.getElementById('pauseSystemCSS')) {
        const style = document.createElement('style');
        style.id = 'pauseSystemCSS';
        style.textContent = pauseSystemCSS;
        document.head.appendChild(style);
    }
}

// Create pause overlay HTML
function createPauseOverlay() {
    return `
        <div class="pause-overlay" id="pauseOverlay">
            <div class="pause-title">⏸️ ${translate('pauseGame')}</div>
            <button class="resume-btn" onclick="resumeGame()">${translate('resumeGame')}</button>
        </div>
    `;
}

// Pause game function
function pauseGame() {
    if (!gameActive || gamePaused) return;
    
    gamePaused = true;
    gameActive = false;
    
    // Store current elapsed time before stopping timer
    if (currentTimerInterval) {
        const timeElement = document.querySelector('[id$="Time"]');
        if (timeElement) {
            pausedTime = parseInt(timeElement.textContent) || 0;
        }
        clearInterval(currentTimerInterval);
        currentTimerInterval = null;
    }
    
    // Show pause overlay
    let pauseOverlay = document.getElementById('pauseOverlay');
    if (!pauseOverlay) {
        document.getElementById('gameContainer').insertAdjacentHTML('beforeend', createPauseOverlay());
        pauseOverlay = document.getElementById('pauseOverlay');
    }
    pauseOverlay.classList.add('show');
    
    // Hide pause button
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }
}

// Resume game function
function resumeGame() {
    if (!gamePaused) return;
    
    gamePaused = false;
    gameActive = true;
    
    // Hide pause overlay
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.classList.remove('show');
    }
    
    // Show pause button
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.display = 'block';
    }
    
    // Resume timer from where it was paused
    if (currentGame && ['sudoku', '2048', 'sliding', 'nonogram', 'kenken', 'sumplete', 'digits'].includes(currentGame)) {
        startTimer();
    }
}

// Add pause button to games
function addPauseButton() {
    // Remove existing pause button
    const existingBtn = document.getElementById('pauseBtn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Add pause button to game container
    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pauseBtn';
    pauseBtn.className = 'pause-btn';
    pauseBtn.textContent = translate('pauseGame');
    pauseBtn.onclick = pauseGame;
    
    document.getElementById('gameContainer').appendChild(pauseBtn);
}

// Timer management with pause support
function startTimer() {
    if (!currentGame) return;
    
    // Clear any existing timer
    if (currentTimerInterval) {
        clearInterval(currentTimerInterval);
    }
    
    // Calculate start time accounting for any paused time
    const adjustedStartTime = Date.now() - (pausedTime * 1000);
    
    currentTimerInterval = setInterval(() => {
        if (gameActive && !gamePaused) {
            const elapsed = Math.floor((Date.now() - adjustedStartTime) / 1000);
            const timeElement = document.querySelector('[id$="Time"]');
            if (timeElement) {
                timeElement.textContent = elapsed;
            }
        }
    }, 1000);
}

function stopTimer() {
    if (currentTimerInterval) {
        clearInterval(currentTimerInterval);
        currentTimerInterval = null;
        const finalTime = pausedTime;
        pausedTime = 0;
        return finalTime;
    }
    return 0;
}

function resetTimer() {
    if (currentTimerInterval) {
        clearInterval(currentTimerInterval);
        currentTimerInterval = null;
    }
    
    pausedTime = 0;
    
    const timeElement = document.querySelector('[id$="Time"]');
    if (timeElement) {
        timeElement.textContent = '0';
    }
}

// Initialize pause system
function initializePauseSystem() {
    injectPauseCSS();
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializePauseSystem);
