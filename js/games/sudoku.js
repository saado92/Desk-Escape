// Professional Sudoku Game Implementation
let sudokuGrid = [];
let sudokuSolution = [];
let sudokuMoves = 0;
let selectedSudokuCell = null;
let sudokuDifficulty = 'easy';
let sudokuCompleted = 0;

function initSudoku() {
    sudokuMoves = 0;
    sudokuCompleted = 0;
    selectedSudokuCell = null;
    
    // Get difficulty setting
    const difficultySelect = document.getElementById('sudokuDifficulty');
    if (difficultySelect) {
        sudokuDifficulty = difficultySelect.value;
        document.getElementById('sudokuCurrentDifficulty').textContent = translate(sudokuDifficulty);
    }
    
    // Generate new Sudoku puzzle
    generateSudokuPuzzle();
    renderSudokuGrid();
    updateSudokuStats();
    
    // Add difficulty change listener
    if (difficultySelect) {
        difficultySelect.addEventListener('change', () => {
            sudokuDifficulty = difficultySelect.value;
            document.getElementById('sudokuCurrentDifficulty').textContent = translate(sudokuDifficulty);
            initSudoku(); // Restart with new difficulty
        });
    }
}

function generateSudokuPuzzle() {
    // Create a complete valid Sudoku grid
    sudokuSolution = generateCompleteSudoku();
    
    // Create puzzle by removing numbers based on difficulty
    sudokuGrid = JSON.parse(JSON.stringify(sudokuSolution));
    
    const cellsToRemove = {
        'easy': 40,    // 41 filled cells
        'medium': 45,  // 36 filled cells  
        'hard': 50,    // 31 filled cells
        'expert': 55   // 26 filled cells
    };
    
    const removeCount = cellsToRemove[sudokuDifficulty] || 40;
    
    // Randomly remove cells
    for (let i = 0; i < removeCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (sudokuGrid[row][col] === 0);
        
        sudokuGrid[row][col] = 0;
    }
}

function generateCompleteSudoku() {
    // Create empty 9x9 grid
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill the grid using backtracking
    fillSudokuGrid(grid);
    return grid;
}

function fillSudokuGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                // Shuffle numbers for randomness
                const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
                
                for (let num of shuffledNumbers) {
                    if (isValidSudokuMove(grid, row, col, num)) {
                        grid[row][col] = num;
                        
                        if (fillSudokuGrid(grid)) {
                            return true;
                        }
                        
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValidSudokuMove(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function renderSudokuGrid() {
    const gridElement = document.getElementById('sudokuGrid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell sudoku-cell';
            cell.style.cssText = `
                height: 40px;
                font-size: 1.2em;
                cursor: pointer;
                background: ${sudokuSolution[row][col] === sudokuGrid[row][col] && sudokuGrid[row][col] !== 0 ? '#e8f5e8' : '#fff'};
                border: 2px solid ${(row % 3 === 2 && row !== 8) || (col % 3 === 2 && col !== 8) ? '#2563eb' : '#d1d5db'};
                position: relative;
            `;
            
            if (sudokuGrid[row][col] !== 0) {
                cell.textContent = sudokuGrid[row][col];
                if (sudokuSolution[row][col] !== sudokuGrid[row][col]) {
                    cell.style.color = '#666';
                }
            }
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => selectSudokuCell(row, col);
            
            gridElement.appendChild(cell);
        }
    }
}

function selectSudokuCell(row, col) {
    if (!gameActive || gamePaused) return;
    
    // Remove previous selection
    document.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.style.background = sudokuSolution[cell.dataset.row][cell.dataset.col] === sudokuGrid[cell.dataset.row][cell.dataset.col] && sudokuGrid[cell.dataset.row][cell.dataset.col] !== 0 ? '#e8f5e8' : '#fff';
    });
    
    // Select new cell (only if it's empty or user-entered)
    if (sudokuGrid[row][col] === 0 || sudokuSolution[row][col] !== sudokuGrid[row][col]) {
        selectedSudokuCell = { row, col };
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.style.background = '#dbeafe';
    } else {
        selectedSudokuCell = null;
    }
}

function selectSudokuNumber(num) {
    if (!gameActive || gamePaused || !selectedSudokuCell) return;
    
    const { row, col } = selectedSudokuCell;
    
    if (num === 0) {
        // Erase number
        sudokuGrid[row][col] = 0;
        sudokuMoves++;
    } else {
        // Place number
        if (isValidSudokuMove(sudokuGrid, row, col, num)) {
            sudokuGrid[row][col] = num;
            sudokuMoves++;
            
            if (sudokuSolution[row][col] === num) {
                showNotification(translate('correct'), 'success', 1000);
            } else {
                showNotification(translate('wrong'), 'error', 1000);
            }
        } else {
            showNotification(translate('invalidMove'), 'error', 1500);
            return;
        }
    }
    
    updateSudokuStats();
    renderSudokuGrid();
    
    // Check if puzzle is complete
    if (checkSudokuComplete()) {
        const time = stopTimer();
        gameActive = false;
        showNotification(translate('puzzleSolved') + ' ' + translate('inMoves', {moves: sudokuMoves}) + ' ' + translate('inSeconds', {time}), 'success', 3000);
    }
}

function updateSudokuStats() {
    sudokuCompleted = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] !== 0 && sudokuSolution[row][col] === sudokuGrid[row][col]) {
                sudokuCompleted++;
            }
        }
    }
    
    document.getElementById('sudokuCompleted').textContent = sudokuCompleted;
}

function checkSudokuComplete() {
    return sudokuCompleted === 81;
}
