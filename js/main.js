// Core portal variables
let currentGame = null;
let isDarkMode = false;
let gameTimers = {};

// Main portal functions
function loadGame(gameType) {
    gameActive = false;
    gamePaused = false;
    resetTimer();
    currentGame = gameType;
    
    // Remove pause button and overlay
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.remove();
    }
    
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.remove();
    }
    
    // Update active state
    document.querySelectorAll('.game-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${gameType}'`)) {
            item.classList.add('active');
        }
    });

    switch(gameType) {
        case 'welcome':
            currentGame = null;
            showWelcomeScreen();
            break;
        case 'sudoku':
            loadSudokuGame();
            break;
        case '2048':
            load2048Game();
            break;
        case 'sliding':
            loadSlidingGame();
            break;
        case 'nonogram':
            loadNonogramGame();
            break;
        case 'kenken':
            loadKenKenGame();
            break;
        case 'sumplete':
            loadSumpleteGame();
            break;
        case 'digits':
            loadDigitsGame();
            break;
    }
}

function showWelcomeScreen() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="welcome-screen">
            <h2 data-translate="welcomeTitle">${translate('welcomeTitle')}</h2>
            <p data-translate="welcomeText">${translate('welcomeText')}</p>
            <div class="game-icons">🧩 🔢 🎯 🎨 🧮 💰 🎲</div>
            <p data-translate="startInstructions">${translate('startInstructions')}</p>
        </div>
    `;
}

// Game overlay system
function createGameOverlay(title, description, gameType, hasRules = true) {
    return `
        <div class="game-overlay" id="gameOverlay">
            <div class="overlay-title">${title}</div>
            <div class="overlay-description">${description}</div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
                <button class="start-game-btn" onclick="startGame('${gameType}')">${translate('startGame')}</button>
                ${hasRules ? `<button class="rules-btn" onclick="showRules('${gameType}')">${translate('rules')}</button>` : ''}
            </div>
        </div>
    `;
}

function hideGameOverlay() {
    const overlay = document.getElementById('gameOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function startGame(gameType) {
    hideGameOverlay();
    gameActive = true;
    gamePaused = false;
    currentGame = gameType;
    
    // Add pause button for games that need it
    if (['sudoku', '2048', 'sliding', 'nonogram', 'kenken', 'sumplete', 'digits'].includes(gameType)) {
        addPauseButton();
        startTimer();
    }
    
    // Initialize specific game
    setTimeout(() => {
        switch(gameType) {
            case 'sudoku':
                initSudoku();
                break;
            case '2048':
                init2048();
                break;
            case 'sliding':
                initSliding();
                break;
            case 'nonogram':
                initNonogram();
                break;
            case 'kenken':
                initKenKen();
                break;
            case 'sumplete':
                initSumplete();
                break;
            case 'digits':
                initDigits();
                break;
        }
    }, 100);
}

// Professional notification system
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `professional-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(120px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Theme system
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    if (isDarkMode) {
        body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%)';
        body.style.color = '#f1f5f9';
        themeBtn.textContent = '☀️ Light Mode';
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.background = 'rgba(15, 23, 42, 0.95)';
            gameContainer.style.color = '#f1f5f9';
        }
        
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    } else {
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        body.style.color = '#1a1a1a';
        themeBtn.textContent = '🌙 Dark Mode';
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.background = 'rgba(255,255,255,0.95)';
            gameContainer.style.color = '#1f2937';
        }
        
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.background = 'rgba(255,255,255,0.1)';
        }
    }
}

// Fullscreen function
function showFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
    
    showNotification('Fullscreen mode activated', 'info', 2000);
}

// Game loading functions (templates)
function loadSudokuGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🧩 ${translate('sudoku')}</h2>
                <div class="game-controls">
                    <select id="sudokuDifficulty" class="difficulty-select">
                        <option value="easy">${translate('easy')}</option>
                        <option value="medium">${translate('medium')}</option>
                        <option value="hard">${translate('hard')}</option>
                        <option value="expert">${translate('expert')}</option>
                    </select>
                    <button class="game-btn" onclick="showRules('sudoku')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('difficulty')}: <span id="sudokuCurrentDifficulty">${translate('easy')}</span></div>
                <div class="stat-item">${translate('time')}: <span id="sudokuTime">0</span>s</div>
                <div class="stat-item">${translate('completed')}: <span id="sudokuCompleted">0</span>/81</div>
            </div>
            <div class="sudoku-container">
                <div id="sudokuGrid" class="sudoku-grid" style="grid-template-columns: repeat(9, 1fr); max-width: 450px;"></div>
                <div class="number-pad">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="number-btn" onclick="selectSudokuNumber(${n})">${n}</button>`).join('')}
                    <button class="number-btn" onclick="selectSudokuNumber(0)" style="background: linear-gradient(135deg, #ef4444, #dc2626);">✖</button>
                </div>
            </div>
        </div>
        ${createGameOverlay('Professional Sudoku', 'Master the ultimate logic puzzle with 4 difficulty levels designed for analytical minds.', 'sudoku')}
    `;
}

function load2048Game() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🔢 ${translate('2048')}</h2>
                <div class="game-controls">
                    <select id="game2048Size" class="difficulty-select">
                        <option value="4">4x4 Grid</option>
                        <option value="5">5x5 Grid</option>
                        <option value="6">6x6 Grid</option>
                    </select>
                    <button class="game-btn" onclick="showRules('game2048')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('score')}: <span id="game2048Score">0</span></div>
                <div class="stat-item">${translate('target')}: <span id="game2048Target">2048</span></div>
                <div class="stat-item">${translate('moves')}: <span id="game2048Moves">0</span></div>
            </div>
            <div class="game2048-container">
                <div id="game2048Grid" class="game2048-grid" style="grid-template-columns: repeat(4, 1fr); max-width: 400px;"></div>
                <div style="text-align: center; margin-top: 20px; color: #6b7280;">
                    <p>Use arrow keys or swipe to move tiles</p>
                </div>
            </div>
        </div>
        ${createGameOverlay('Strategic 2048', 'Merge numbers strategically to reach the target. Multiple grid sizes for progressive difficulty.', '2048')}
    `;
}

function loadSlidingGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🎯 ${translate('sliding')}</h2>
                <div class="game-controls">
                    <select id="slidingSize" class="difficulty-select">
                        <option value="3">Small (3x3)</option>
                        <option value="4">Medium (4x4)</option>
                        <option value="5">Large (5x5)</option>
                    </select>
                    <button class="game-btn" onclick="showRules('sliding')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('moves')}: <span id="slidingMoves">0</span></div>
                <div class="stat-item">${translate('time')}: <span id="slidingTime">0</span>s</div>
                <div class="stat-item">Grid: <span id="slidingCurrentSize">3x3</span></div>
            </div>
            <div class="sliding-container">
                <div id="slidingGrid" class="sliding-grid" style="grid-template-columns: repeat(3, 1fr); max-width: 300px;"></div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="game-btn" onclick="shuffleSliding()">${translate('newGame')}</button>
                </div>
            </div>
        </div>
        ${createGameOverlay('Strategic Number Sliding', 'Arrange numbers in perfect order using minimal moves. Choose your preferred grid size.', 'sliding')}
    `;
}

function loadNonogramGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🎨 ${translate('nonogram')}</h2>
                <div class="game-controls">
                    <select id="nonogramSize" class="difficulty-select">
                        <option value="5">5x5 Grid</option>
                        <option value="10">10x10 Grid</option>
                        <option value="15">15x15 Grid</option>
                    </select>
                    <button class="game-btn" onclick="showRules('nonogram')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('completed')}: <span id="nonogramCompleted">0</span>%</div>
                <div class="stat-item">${translate('time')}: <span id="nonogramTime">0</span>s</div>
                <div class="stat-item">Grid: <span id="nonogramCurrentSize">5x5</span></div>
            </div>
            <div class="nonogram-container">
                <div id="nonogramGrid" class="nonogram-grid" style="grid-template-columns: repeat(5, 1fr); max-width: 300px;"></div>
                <div style="text-align: center; margin-top: 20px; color: #6b7280;">
                    <p>Left click: Fill | Right click: Mark empty</p>
                </div>
            </div>
        </div>
        ${createGameOverlay('Logic Picture Puzzle', 'Reveal hidden pictures using numerical clues. Perfect for systematic logical thinking.', 'nonogram')}
    `;
}

function loadKenKenGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🧮 ${translate('kenken')}</h2>
                <div class="game-controls">
                    <select id="kenkenSize" class="difficulty-select">
                        <option value="4">4x4 Grid</option>
                        <option value="6">6x6 Grid</option>
                        <option value="8">8x8 Grid</option>
                    </select>
                    <button class="game-btn" onclick="showRules('kenken')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('completed')}: <span id="kenkenCompleted">0</span>/16</div>
                <div class="stat-item">${translate('time')}: <span id="kenkenTime">0</span>s</div>
                <div class="stat-item">Grid: <span id="kenkenCurrentSize">4x4</span></div>
            </div>
            <div class="kenken-container">
                <div id="kenkenGrid" class="kenken-grid" style="grid-template-columns: repeat(4, 1fr); max-width: 320px;"></div>
                <div class="number-pad">
                    ${[1,2,3,4].map(n => `<button class="number-btn" onclick="selectKenKenNumber(${n})">${n}</button>`).join('')}
                    <button class="number-btn" onclick="selectKenKenNumber(0)" style="background: linear-gradient(135deg, #ef4444, #dc2626);">✖</button>
                </div>
            </div>
        </div>
        ${createGameOverlay('Mathematical Logic Puzzle', 'Combine arithmetic with logic. Fill grids using mathematical operations and constraints.', 'kenken')}
    `;
}

function loadSumpleteGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>💰 ${translate('sumplete')}</h2>
                <div class="game-controls">
                    <select id="sumpleteSize" class="difficulty-select">
                        <option value="easy">${translate('easy')}</option>
                        <option value="medium">${translate('medium')}</option>
                        <option value="hard">${translate('hard')}</option>
                    </select>
                    <button class="game-btn" onclick="showRules('sumplete')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">Rows: <span id="sumpleteRowsComplete">0</span>/5</div>
                <div class="stat-item">Cols: <span id="sumpleteColsComplete">0</span>/5</div>
                <div class="stat-item">${translate('time')}: <span id="sumpleteTime">0</span>s</div>
            </div>
            <div class="sumplete-container">
                <div id="sumpleteGrid" class="sumplete-grid" style="grid-template-columns: repeat(5, 1fr); max-width: 350px;"></div>
                <div class="sumplete-targets" style="display: flex; justify-content: center; gap: 30px; margin-top: 20px;">
                    <div>
                        <h4>Row Targets</h4>
                        <div id="rowTargets"></div>
                    </div>
                    <div>
                        <h4>Column Targets</h4>
                        <div id="colTargets"></div>
                    </div>
                </div>
            </div>
        </div>
        ${createGameOverlay('Strategic Sum Elimination', 'Remove numbers strategically to achieve exact target sums for all rows and columns.', 'sumplete')}
    `;
}

function loadDigitsGame() {
    document.getElementById('gameContainer').innerHTML = `
        <div class="modern-game">
            <div class="game-header">
                <h2>🎲 ${translate('digits')}</h2>
                <div class="game-controls">
                    <select id="digitsLevel" class="difficulty-select">
                        <option value="easy">${translate('easy')}</option>
                        <option value="medium">${translate('medium')}</option>
                        <option value="hard">${translate('hard')}</option>
                    </select>
                    <button class="game-btn" onclick="showRules('digits')">${translate('rules')}</button>
                </div>
            </div>
            <div class="game-stats">
                <div class="stat-item">${translate('target')}: <span id="digitsTarget">100</span></div>
                <div class="stat-item">${translate('current')}: <span id="digitsCurrent">0</span></div>
                <div class="stat-item">${translate('score')}: <span id="digitsScore">0</span></div>
            </div>
            <div class="digits-container">
                <div style="text-align: center; margin: 20px 0;">
                    <h4>Available Digits</h4>
                    <div id="digitsNumbers" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 15px 0;"></div>
                </div>
                <div style="text-align: center;">
                    <div style="margin: 20px 0;">
                        <input type="text" id="digitsExpression" placeholder="Build your expression..." readonly style="width: 300px; padding: 10px; font-size: 1.1em; text-align: center; border: 2px solid #6366f1; border-radius: 10px;">
                    </div>
                    <div style="margin: 15px 0;">
                        <button class="number-btn" onclick="addDigitsOperation('+')">+</button>
                        <button class="number-btn" onclick="addDigitsOperation('-')">−</button>
                        <button class="number-btn" onclick="addDigitsOperation('*')">×</button>
                        <button class="number-btn" onclick="addDigitsOperation('/')">÷</button>
                        <button class="number-btn" onclick="addDigitsOperation('(')">(</button>
                        <button class="number-btn" onclick="addDigitsOperation(')')">)</button>
                    </div>
                    <div style="margin: 20px 0;">
                        <button class="game-btn secondary" onclick="clearDigitsExpression()">Clear</button>
                        <button class="game-btn" onclick="calculateDigitsExpression()">Calculate</button>
                        <button class="game-btn" onclick="generateNewDigitsChallenge()">New Challenge</button>
                    </div>
                </div>
            </div>
        </div>
        ${createGameOverlay('Mathematical Expression Builder', 'Use provided digits and operations to reach exact target numbers. Efficiency matters!', 'digits')}
    `;
}

// Initialize the portal
document.addEventListener('DOMContentLoaded', () => {
    updateAllText();
    loadGame('welcome');
    
    // Professional keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'h':
                    e.preventDefault();
                    loadGame('welcome');
                    break;
                case 'f':
                    e.preventDefault();
                    showFullscreen();
                    break;
                case 'd':
                    e.preventDefault();
                    toggleDarkMode();
                    break;
            }
        }
        
        // Escape key pauses/resumes game
        if (e.key === 'Escape') {
            if (gameActive && !gamePaused) {
                pauseGame();
            } else if (gamePaused) {
                resumeGame();
            }
        }
    });
});
