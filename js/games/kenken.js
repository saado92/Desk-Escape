// Professional KenKen Game Implementation
let kenkenGrid = [];
let kenkenSolution = [];
let kenkenSize = 4;
let kenkenCages = [];
let kenkenMoves = 0;
let selectedKenKenCell = null;

function initKenKen() {
    kenkenMoves = 0;
    selectedKenKenCell = null;
    
    // Get grid size setting
    const sizeSelect = document.getElementById('kenkenSize');
    if (sizeSelect) {
        kenkenSize = parseInt(sizeSelect.value);
        document.getElementById('kenkenCurrentSize').textContent = `${kenkenSize}x${kenkenSize}`;
        
        // Update grid CSS
        const gridElement = document.getElementById('kenkenGrid');
        gridElement.style.gridTemplateColumns = `repeat(${kenkenSize}, 1fr)`;
        gridElement.style.maxWidth = `${kenkenSize * 60 + (kenkenSize - 1) * 5}px`;
        
        // Update number pad
        updateKenKenNumberPad();
    }
    
    // Generate KenKen puzzle
    generateKenKenPuzzle();
    
    // Initialize player grid
    kenkenGrid = Array(kenkenSize).fill().map(() => Array(kenkenSize).fill(0));
    
    renderKenKenGrid();
    updateKenKenStats();
    
    // Add size change listener
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            initKenKen(); // Restart with new size
        });
    }
}

function updateKenKenNumberPad() {
    const numberPad = document.querySelector('.kenken-container .number-pad');
    if (numberPad) {
        numberPad.innerHTML = '';
        
        for (let i = 1; i <= kenkenSize; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = i;
            btn.onclick = () => selectKenKenNumber(i);
            numberPad.appendChild(btn);
        }
        
        // Add erase button
        const eraseBtn = document.createElement('button');
        eraseBtn.className = 'number-btn';
        eraseBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        eraseBtn.textContent = '✖';
        eraseBtn.onclick = () => selectKenKenNumber(0);
        numberPad.appendChild(eraseBtn);
    }
}

function generateKenKenPuzzle() {
    // Generate valid solution first
    kenkenSolution = generateValidKenKenSolution();
    
    // Create cages with operations
    kenkenCages = generateKenKenCages();
}

function generateValidKenKenSolution() {
    const grid = Array(kenkenSize).fill().map(() => Array(kenkenSize).fill(0));
    
    // Fill grid with valid Latin square
    for (let row = 0; row < kenkenSize; row++) {
        for (let col = 0; col < kenkenSize; col++) {
            grid[row][col] = ((row + col) % kenkenSize) + 1;
        }
    }
    
    // Shuffle rows and columns to randomize
    for (let i = 0; i < 50; i++) {
        if (Math.random() < 0.5) {
            // Swap two rows
            const row1 = Math.floor(Math.random() * kenkenSize);
            const row2 = Math.floor(Math.random() * kenkenSize);
            [grid[row1], grid[row2]] = [grid[row2], grid[row1]];
        } else {
            // Swap two columns
            const col1 = Math.floor(Math.random() * kenkenSize);
            const col2 = Math.floor(Math.random() * kenkenSize);
            for (let row = 0; row < kenkenSize; row++) {
                [grid[row][col1], grid[row][col2]] = [grid[row][col2], grid[row][col1]];
            }
        }
    }
    
    return grid;
}

function generateKenKenCages() {
    const cages = [];
    const used = Array(kenkenSize).fill().map(() => Array(kenkenSize).fill(false));
    let cageId = 0;
    
    for (let row = 0; row < kenkenSize; row++) {
        for (let col = 0; col < kenkenSize; col++) {
            if (!used[row][col]) {
                const cage = createKenKenCage(row, col, used, cageId++);
                if (cage) cages.push(cage);
            }
        }
    }
    
    return cages;
}

function createKenKenCage(startRow, startCol, used, cageId) {
    const cells = [{ row: startRow, col: startCol }];
    used[startRow][col] = true;
    
    // Randomly grow the cage (1-3 cells typically)
    const maxSize = Math.min(4, Math.floor(Math.random() * 3) + 1);
    
    while (cells.length < maxSize) {
        const growthOptions = [];
        
        for (let cell of cells) {
            const neighbors = [
                { row: cell.row - 1, col: cell.col },
                { row: cell.row + 1, col: cell.col },
                { row: cell.row, col: cell.col - 1 },
                { row: cell.row, col: cell.col + 1 }
            ];
            
            for (let neighbor of neighbors) {
                if (neighbor.row >= 0 && neighbor.row < kenkenSize &&
                    neighbor.col >= 0 && neighbor.col < kenkenSize &&
                    !used[neighbor.row][neighbor.col]) {
                    growthOptions.push(neighbor);
                }
            }
        }
        
        if (growthOptions.length === 0) break;
        
        const nextCell = growthOptions[Math.floor(Math.random() * growthOptions.length)];
        cells.push(nextCell);
        used[nextCell.row][nextCell.col] = true;
    }
    
    // Calculate operation and target
    const values = cells.map(cell => kenkenSolution[cell.row][cell.col]);
    const { operation, target } = calculateKenKenOperation(values);
    
    return {
        id: cageId,
        cells,
        operation,
        target,
        color: getKenKenCageColor(cageId)
    };
}

function calculateKenKenOperation(values) {
    if (values.length === 1) {
        return { operation: '', target: values[0] };
    }
    
    const operations = ['+', '-', '×', '÷'];
    const validOps = [];
    
    // Addition
    const sum = values.reduce((a, b) => a + b, 0);
    validOps.push({ operation: '+', target: sum });
    
    // Multiplication  
    const product = values.reduce((a, b) => a * b, 1);
    validOps.push({ operation: '×', target: product });
    
    if (values.length === 2) {
        // Subtraction
        const diff = Math.abs(values[0] - values[1]);
        validOps.push({ operation: '-', target: diff });
        
        // Division
        const max = Math.max(...values);
        const min = Math.min(...values);
        if (max % min === 0) {
            validOps.push({ operation: '÷', target: max / min });
        }
    }
    
    return validOps[Math.floor(Math.random() * validOps.length)];
}

function getKenKenCageColor(cageId) {
    const colors = [
        'rgba(239, 68, 68, 0.2)',   // Red
        'rgba(34, 197, 94, 0.2)',   // Green  
        'rgba(59, 130, 246, 0.2)',  // Blue
        'rgba(245, 158, 11, 0.2)',  // Yellow
        'rgba(168, 85, 247, 0.2)',  // Purple
        'rgba(236, 72, 153, 0.2)',  // Pink
        'rgba(20, 184, 166, 0.2)',  // Teal
        'rgba(251, 146, 60, 0.2)'   // Orange
    ];
    return colors[cageId % colors.length];
}

function renderKenKenGrid() {
    const gridElement = document.getElementById('kenkenGrid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < kenkenSize; row++) {
        for (let col = 0; col < kenkenSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell kenken-cell';
            
            const value = kenkenGrid[row][col];
            cell.textContent = value === 0 ? '' : value;
            
            // Find cage for this cell
            const cage = kenkenCages.find(c => 
                c.cells.some(cageCell => cageCell.row === row && cageCell.col === col)
            );
            
            const isTopLeft = cage && cage.cells[0].row === row && cage.cells[0].col === col;
            
            cell.style.cssText = `
                height: 50px;
                background: ${cage ? cage.color : '#fff'};
                border: 2px solid #374151;
                font-size: 1.2em;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                transition: all 0.2s ease;
            `;
            
            // Add cage label (operation and target)
            if (isTopLeft) {
                const label = document.createElement('div');
                label.style.cssText = `
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    font-size: 10px;
                    font-weight: bold;
                    color: #374151;
                `;
                label.textContent = cage.operation ? `${cage.target}${cage.operation}` : cage.target;
                cell.appendChild(label);
            }
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => selectKenKenCell(row, col);
            
            gridElement.appendChild(cell);
        }
    }
}

function selectKenKenCell(row, col) {
    if (!gameActive || gamePaused) return;
    
    // Remove previous selection
    document.querySelectorAll('.kenken-cell').forEach(cell => {
        cell.style.boxShadow = 'none';
    });
    
    selectedKenKenCell = { row, col };
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.style.boxShadow = '0 0 0 3px #6366f1';
}

function selectKenKenNumber(num) {
    if (!gameActive || gamePaused || !selectedKenKenCell) return;
    
    const { row, col } = selectedKenKenCell;
    
    if (num === 0) {
        kenkenGrid[row][col] = 0;
    } else {
        // Check if number is valid in row and column
        if (isValidKenKenNumber(row, col, num)) {
            kenkenGrid[row][col] = num;
            kenkenMoves++;
            
            if (kenkenSolution[row][col] === num) {
                showNotification(translate('correct'), 'success', 1000);
            } else {
                showNotification(translate('wrong'), 'error', 1000);
            }
        } else {
            showNotification(translate('invalidMove'), 'error', 1500);
            return;
        }
    }
    
    renderKenKenGrid();
    updateKenKenStats();
    
    // Check if puzzle is complete
    if (isKenKenComplete()) {
        const time = stopTimer();
        gameActive = false;
        showNotification(translate('puzzleSolved') + ' ' + translate('inSeconds', {time}), 'success', 3000);
    }
}

function isValidKenKenNumber(row, col, num) {
    // Check row
    for (let c = 0; c < kenkenSize; c++) {
        if (c !== col && kenkenGrid[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < kenkenSize; r++) {
        if (r !== row && kenkenGrid[r][col] === num) return false;
    }
    
    return true;
}

function updateKenKenStats() {
    let completed = 0;
    for (let row = 0; row < kenkenSize; row++) {
        for (let col = 0; col < kenkenSize; col++) {
            if (kenkenGrid[row][col] !== 0) completed++;
        }
    }
    
    document.getElementById('kenkenCompleted').textContent = completed;
}

function isKenKenComplete() {
    // Check if all cells are filled correctly
    for (let row = 0; row < kenkenSize; row++) {
        for (let col = 0; col < kenkenSize; col++) {
            if (kenkenGrid[row][col] !== kenkenSolution[row][col]) {
                return false;
            }
        }
    }
    
    // Verify all cage constraints
    for (let cage of kenkenCages) {
        if (!verifyCageConstraint(cage)) {
            return false;
        }
    }
    
    return true;
}

function verifyCageConstraint(cage) {
    const values = cage.cells.map(cell => kenkenGrid[cell.row][cell.col]);
    
    if (values.some(v => v === 0)) return false;
    
    if (!cage.operation) {
        return values[0] === cage.target;
    }
    
    switch (cage.operation) {
        case '+':
            return values.reduce((a, b) => a + b, 0) === cage.target;
        case '×':
            return values.reduce((a, b) => a * b, 1) === cage.target;
        case '-':
            return Math.abs(values[0] - values[1]) === cage.target;
        case '÷':
            const max = Math.max(...values);
            const min = Math.min(...values);
            return max / min === cage.target;
        default:
            return false;
    }
}
