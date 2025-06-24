// Professional Number Sum (Sumplete) Game Implementation
let sumpleteGrid = [];
let sumpleteRowTargets = [];
let sumpleteColTargets = [];
let sumpleteSize = 5;
let sumpleteDifficulty = 'easy';
let sumpleteRemovedCells = new Set();

function initSumplete() {
    sumpleteRemovedCells.clear();
    
    // Get difficulty setting
    const difficultySelect = document.getElementById('sumpleteSize');
    if (difficultySelect) {
        sumpleteDifficulty = difficultySelect.value;
    }
    
    // Set grid size based on difficulty
    sumpleteSize = sumpleteDifficulty === 'easy' ? 5 : sumpleteDifficulty === 'medium' ? 6 : 7;
    
    generateSumpletePuzzle();
    renderSumpleteGrid();
    updateSumpleteStats();
    
    // Add difficulty change listener
    if (difficultySelect) {
        difficultySelect.addEventListener('change', () => {
            initSumplete(); // Restart with new difficulty
        });
    }
}

function generateSumpletePuzzle() {
    // Create grid with random numbers
    sumpleteGrid = Array(sumpleteSize).fill().map(() => 
        Array(sumpleteSize).fill().map(() => Math.floor(Math.random() * 9) + 1)
    );
    
    // Calculate initial sums
    const initialRowSums = sumpleteGrid.map(row => row.reduce((a, b) => a + b, 0));
    const initialColSums = [];
    for (let col = 0; col < sumpleteSize; col++) {
        let sum = 0;
        for (let row = 0; row < sumpleteSize; row++) {
            sum += sumpleteGrid[row][col];
        }
        initialColSums.push(sum);
    }
    
    // Randomly remove some numbers to create the puzzle
    const numbersToRemove = Math.floor(sumpleteSize * sumpleteSize * 0.3); // Remove 30% of numbers
    
    for (let i = 0; i < numbersToRemove; i++) {
        const row = Math.floor(Math.random() * sumpleteSize);
        const col = Math.floor(Math.random() * sumpleteSize);
        const cellKey = `${row}-${col}`;
        
        if (!sumpleteRemovedCells.has(cellKey)) {
            sumpleteRemovedCells.add(cellKey);
        }
    }
    
    // Calculate target sums (what sums should be after removing the selected numbers)
    sumpleteRowTargets = [];
    sumpleteColTargets = [];
    
    for (let row = 0; row < sumpleteSize; row++) {
        let sum = 0;
        for (let col = 0; col < sumpleteSize; col++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        sumpleteRowTargets.push(sum);
    }
    
    for (let col = 0; col < sumpleteSize; col++) {
        let sum = 0;
        for (let row = 0; row < sumpleteSize; row++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        sumpleteColTargets.push(sum);
    }
    
    // Reset removed cells for player to solve
    sumpleteRemovedCells.clear();
}

function renderSumpleteGrid() {
    const container = document.querySelector('.sumplete-container');
    container.innerHTML = '';
    
    // Create main grid
    const gridElement = document.createElement('div');
    gridElement.id = 'sumpleteGrid';
    gridElement.className = 'sumplete-grid';
    gridElement.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${sumpleteSize}, 1fr);
        gap: 3px;
        max-width: ${sumpleteSize * 50 + (sumpleteSize - 1) * 3}px;
        margin: 0 auto 20px auto;
        background: #6366f1;
        padding: 5px;
        border-radius: 12px;
    `;
    
    for (let row = 0; row < sumpleteSize; row++) {
        for (let col = 0; col < sumpleteSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell sumplete-cell';
            
            const cellKey = `${row}-${col}`;
            const isRemoved = sumpleteRemovedCells.has(cellKey);
            
            cell.textContent = sumpleteGrid[row][col];
            cell.style.cssText = `
                width: 45px;
                height: 45px;
                background: ${isRemoved ? '#fecaca' : '#fff'};
                border: 2px solid ${isRemoved ? '#ef4444' : '#d1d5db'};
                font-size: 1.1em;
                font-weight: 600;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s ease;
                opacity: ${isRemoved ? 0.5 : 1};
                text-decoration: ${isRemoved ? 'line-through' : 'none'};
            `;
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => toggleSumpleteCell(row, col);
            
            cell.addEventListener('mouseenter', () => {
                if (gameActive && !gamePaused) {
                    cell.style.transform = 'scale(1.1)';
                    cell.style.background = isRemoved ? '#fca5a5' : '#f3f4f6';
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
                cell.style.background = isRemoved ? '#fecaca' : '#fff';
            });
            
            gridElement.appendChild(cell);
        }
    }
    
    container.appendChild(gridElement);
    
    // Create targets display
    const targetsDiv = document.createElement('div');
    targetsDiv.className = 'sumplete-targets';
    targetsDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 20px;
    `;
    
    // Row targets
    const rowTargetsDiv = document.createElement('div');
    rowTargetsDiv.innerHTML = '<h4 style="text-align: center; color: #6366f1; margin-bottom: 10px;">Row Targets</h4>';
    const rowTargetsContainer = document.createElement('div');
    rowTargetsContainer.id = 'rowTargets';
    rowTargetsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px;';
    
    sumpleteRowTargets.forEach((target, index) => {
        const targetDiv = document.createElement('div');
        targetDiv.style.cssText = `
            background: #e0e7ff;
            padding: 8px 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            color: #3730a3;
        `;
        targetDiv.textContent = `Row ${index + 1}: ${target}`;
        targetDiv.id = `row-target-${index}`;
        rowTargetsContainer.appendChild(targetDiv);
    });
    
    rowTargetsDiv.appendChild(rowTargetsContainer);
    targetsDiv.appendChild(rowTargetsDiv);
    
    // Column targets
    const colTargetsDiv = document.createElement('div');
    colTargetsDiv.innerHTML = '<h4 style="text-align: center; color: #6366f1; margin-bottom: 10px;">Column Targets</h4>';
    const colTargetsContainer = document.createElement('div');
    colTargetsContainer.id = 'colTargets';
    colTargetsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px;';
    
    sumpleteColTargets.forEach((target, index) => {
        const targetDiv = document.createElement('div');
        targetDiv.style.cssText = `
            background: #dcfce7;
            padding: 8px 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            color: #166534;
        `;
        targetDiv.textContent = `Col ${index + 1}: ${target}`;
        targetDiv.id = `col-target-${index}`;
        colTargetsContainer.appendChild(targetDiv);
    });
    
    colTargetsDiv.appendChild(colTargetsContainer);
    targetsDiv.appendChild(colTargetsDiv);
    
    container.appendChild(targetsDiv);
}

function toggleSumpleteCell(row, col) {
    if (!gameActive || gamePaused) return;
    
    const cellKey = `${row}-${col}`;
    
    if (sumpleteRemovedCells.has(cellKey)) {
        sumpleteRemovedCells.delete(cellKey);
    } else {
        sumpleteRemovedCells.add(cellKey);
    }
    
    // Update the cell appearance
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const isRemoved = sumpleteRemovedCells.has(cellKey);
    
    cell.style.background = isRemoved ? '#fecaca' : '#fff';
    cell.style.border = `2px solid ${isRemoved ? '#ef4444' : '#d1d5db'}`;
    cell.style.opacity = isRemoved ? 0.5 : 1;
    cell.style.textDecoration = isRemoved ? 'line-through' : 'none';
    
    updateSumpleteStats();
    
    // Check if puzzle is solved
    if (isSumpleteSolved()) {
        const time = stopTimer();
        gameActive = false;
        showNotification(translate('puzzleSolved') + ' ' + translate('inSeconds', {time}), 'success', 3000);
    }
}

function updateSumpleteStats() {
    let rowsComplete = 0;
    let colsComplete = 0;
    
    // Check row sums
    for (let row = 0; row < sumpleteSize; row++) {
        let sum = 0;
        for (let col = 0; col < sumpleteSize; col++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        
        const targetDiv = document.getElementById(`row-target-${row}`);
        if (sum === sumpleteRowTargets[row]) {
            rowsComplete++;
            if (targetDiv) {
                targetDiv.style.background = '#bbf7d0';
                targetDiv.style.color = '#166534';
            }
        } else {
            if (targetDiv) {
                targetDiv.style.background = '#e0e7ff';
                targetDiv.style.color = '#3730a3';
            }
        }
    }
    
    // Check column sums
    for (let col = 0; col < sumpleteSize; col++) {
        let sum = 0;
        for (let row = 0; row < sumpleteSize; row++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        
        const targetDiv = document.getElementById(`col-target-${col}`);
        if (sum === sumpleteColTargets[col]) {
            colsComplete++;
            if (targetDiv) {
                targetDiv.style.background = '#ddd6fe';
                targetDiv.style.color = '#5b21b6';
            }
        } else {
            if (targetDiv) {
                targetDiv.style.background = '#dcfce7';
                targetDiv.style.color = '#166534';
            }
        }
    }
    
    document.getElementById('sumpleteRowsComplete').textContent = rowsComplete;
    document.getElementById('sumpleteColsComplete').textContent = colsComplete;
}

function isSumpleteSolved() {
    // Check all row sums
    for (let row = 0; row < sumpleteSize; row++) {
        let sum = 0;
        for (let col = 0; col < sumpleteSize; col++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        if (sum !== sumpleteRowTargets[row]) return false;
    }
    
    // Check all column sums
    for (let col = 0; col < sumpleteSize; col++) {
        let sum = 0;
        for (let row = 0; row < sumpleteSize; row++) {
            if (!sumpleteRemovedCells.has(`${row}-${col}`)) {
                sum += sumpleteGrid[row][col];
            }
        }
        if (sum !== sumpleteColTargets[col]) return false;
    }
    
    return true;
}
