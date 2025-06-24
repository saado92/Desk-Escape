// Professional Nonogram Game Implementation
let nonogramGrid = [];
let nonogramSolution = [];
let nonogramSize = 5;
let nonogramRowClues = [];
let nonogramColClues = [];
let nonogramCompleted = 0;

function initNonogram() {
    // Get grid size setting
    const sizeSelect = document.getElementById('nonogramSize');
    if (sizeSelect) {
        nonogramSize = parseInt(sizeSelect.value);
        document.getElementById('nonogramCurrentSize').textContent = `${nonogramSize}x${nonogramSize}`;
        
        // Update grid CSS
        const gridElement = document.getElementById('nonogramGrid');
        gridElement.style.gridTemplateColumns = `repeat(${nonogramSize}, 1fr)`;
        gridElement.style.maxWidth = `${nonogramSize * 25 + (nonogramSize - 1) * 2}px`;
    }
    
    // Generate random nonogram puzzle
    generateNonogramPuzzle();
    
    // Initialize player grid (0 = empty, 1 = filled, -1 = marked empty)
    nonogramGrid = Array(nonogramSize).fill().map(() => Array(nonogramSize).fill(0));
    
    renderNonogramGrid();
    updateNonogramStats();
    
    // Add size change listener
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            initNonogram(); // Restart with new size
        });
    }
}

function generateNonogramPuzzle() {
    // Create random solution pattern
    nonogramSolution = Array(nonogramSize).fill().map(() => 
        Array(nonogramSize).fill().map(() => Math.random() < 0.6 ? 1 : 0)
    );
    
    // Generate row clues
    nonogramRowClues = nonogramSolution.map(row => {
        const clues = [];
        let currentGroup = 0;
        
        for (let cell of row) {
            if (cell === 1) {
                currentGroup++;
            } else {
                if (currentGroup > 0) {
                    clues.push(currentGroup);
                    currentGroup = 0;
                }
            }
        }
        if (currentGroup > 0) {
            clues.push(currentGroup);
        }
        
        return clues.length > 0 ? clues : [0];
    });
    
    // Generate column clues
    nonogramColClues = [];
    for (let col = 0; col < nonogramSize; col++) {
        const clues = [];
        let currentGroup = 0;
        
        for (let row = 0; row < nonogramSize; row++) {
            if (nonogramSolution[row][col] === 1) {
                currentGroup++;
            } else {
                if (currentGroup > 0) {
                    clues.push(currentGroup);
                    currentGroup = 0;
                }
            }
        }
        if (currentGroup > 0) {
            clues.push(currentGroup);
        }
        
        nonogramColClues.push(clues.length > 0 ? clues : [0]);
    }
}

function renderNonogramGrid() {
    const container = document.querySelector('.nonogram-container');
    container.innerHTML = '';
    
    // Create main grid with clues
    const gridWrapper = document.createElement('div');
    gridWrapper.style.cssText = `
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        gap: 10px;
        max-width: 600px;
        margin: 0 auto;
    `;
    
    // Empty corner cell
    const cornerCell = document.createElement('div');
    cornerCell.style.cssText = 'background: transparent;';
    gridWrapper.appendChild(cornerCell);
    
    // Column clues header
    const colCluesHeader = document.createElement('div');
    colCluesHeader.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${nonogramSize}, 1fr);
        gap: 2px;
        padding: 5px;
    `;
    
    for (let col = 0; col < nonogramSize; col++) {
        const clueCell = document.createElement('div');
        clueCell.style.cssText = `
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            color: #6366f1;
            min-height: 30px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
        `;
        clueCell.innerHTML = nonogramColClues[col].join('<br>');
        colCluesHeader.appendChild(clueCell);
    }
    gridWrapper.appendChild(colCluesHeader);
    
    // Row clues sidebar
    const rowCluesSidebar = document.createElement('div');
    rowCluesSidebar.style.cssText = `
        display: grid;
        grid-template-rows: repeat(${nonogramSize}, 1fr);
        gap: 2px;
        padding: 5px;
    `;
    
    for (let row = 0; row < nonogramSize; row++) {
        const clueCell = document.createElement('div');
        clueCell.style.cssText = `
            text-align: right;
            font-size: 10px;
            font-weight: bold;
            color: #6366f1;
            min-width: 40px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 5px;
        `;
        clueCell.textContent = nonogramRowClues[row].join(' ');
        rowCluesSidebar.appendChild(clueCell);
    }
    gridWrapper.appendChild(rowCluesSidebar);
    
    // Main game grid
    const gridElement = document.createElement('div');
    gridElement.id = 'nonogramGrid';
    gridElement.className = 'nonogram-grid';
    gridElement.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${nonogramSize}, 1fr);
        gap: 1px;
        background: #6366f1;
        padding: 2px;
        border-radius: 8px;
    `;
    
    for (let row = 0; row < nonogramSize; row++) {
        for (let col = 0; col < nonogramSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell nonogram-cell';
            cell.style.cssText = `
                width: min(25px, 6vw);
                height: min(25px, 6vw);
                background: ${getCellBackground(row, col)};
                cursor: pointer;
                border-radius: 2px;
                transition: all 0.2s ease;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Left click to fill, right click to mark empty
            cell.addEventListener('click', (e) => {
                e.preventDefault();
                toggleNonogramCell(row, col, 1);
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleNonogramCell(row, col, -1);
            });
            
            cell.addEventListener('mouseenter', () => {
                if (gameActive && !gamePaused) {
                    cell.style.transform = 'scale(1.1)';
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
            });
            
            gridElement.appendChild(cell);
        }
    }
    
    gridWrapper.appendChild(gridElement);
    container.appendChild(gridWrapper);
    
    // Add legend
    const legend = document.createElement('div');
    legend.style.cssText = `
        text-align: center;
        margin-top: 15px;
        color: #6b7280;
        font-size: 0.9em;
    `;
    legend.textContent = 'Left click: Fill | Right click: Mark empty';
    container.appendChild(legend);
}

function getCellBackground(row, col) {
    const state = nonogramGrid[row][col];
    switch (state) {
        case 1: return '#6366f1'; // Filled
        case -1: return '#fecaca'; // Marked empty
        default: return '#fff'; // Empty
    }
}

function toggleNonogramCell(row, col, action) {
    if (!gameActive || gamePaused) return;
    
    if (action === 1) {
        // Toggle filled state
        nonogramGrid[row][col] = nonogramGrid[row][col] === 1 ? 0 : 1;
    } else if (action === -1) {
        // Toggle marked empty state
        nonogramGrid[row][col] = nonogramGrid[row][col] === -1 ? 0 : -1;
    }
    
    // Update the specific cell
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.style.background = getCellBackground(row, col);
    
    updateNonogramStats();
    
    // Check if puzzle is solved
    if (isNonogramSolved()) {
        const time = stopTimer();
        gameActive = false;
        showNotification(translate('puzzleSolved') + ' ' + translate('inSeconds', {time}), 'success', 3000);
    }
}

function updateNonogramStats() {
    let correctCells = 0;
    let totalFilledCells = 0;
    
    // Count solution cells
    for (let row = 0; row < nonogramSize; row++) {
        for (let col = 0; col < nonogramSize; col++) {
            if (nonogramSolution[row][col] === 1) totalFilledCells++;
        }
    }
    
    // Count correct player cells
    for (let row = 0; row < nonogramSize; row++) {
        for (let col = 0; col < nonogramSize; col++) {
            if (nonogramSolution[row][col] === 1 && nonogramGrid[row][col] === 1) {
                correctCells++;
            }
        }
    }
    
    nonogramCompleted = Math.round((correctCells / totalFilledCells) * 100);
    document.getElementById('nonogramCompleted').textContent = nonogramCompleted;
}

function isNonogramSolved() {
    for (let row = 0; row < nonogramSize; row++) {
        for (let col = 0; col < nonogramSize; col++) {
            if (nonogramSolution[row][col] === 1 && nonogramGrid[row][col] !== 1) {
                return false;
            }
            if (nonogramSolution[row][col] === 0 && nonogramGrid[row][col] === 1) {
                return false;
            }
        }
    }
    return true;
}
