// Professional Number Sliding Puzzle Implementation
let slidingGrid = [];
let slidingSize = 3;
let slidingMoves = 0;
let emptyPosition = { row: 2, col: 2 };

function initSliding() {
    slidingMoves = 0;
    
    // Get grid size setting
    const sizeSelect = document.getElementById('slidingSize');
    if (sizeSelect) {
        slidingSize = parseInt(sizeSelect.value);
        document.getElementById('slidingCurrentSize').textContent = `${slidingSize}x${slidingSize}`;
        
        // Update grid CSS
        const gridElement = document.getElementById('slidingGrid');
        gridElement.style.gridTemplateColumns = `repeat(${slidingSize}, 1fr)`;
        gridElement.style.maxWidth = `${slidingSize * 80 + (slidingSize - 1) * 10}px`;
    }
    
    // Initialize solved grid
    slidingGrid = Array(slidingSize).fill().map((_, row) => 
        Array(slidingSize).fill().map((_, col) => {
            const num = row * slidingSize + col + 1;
            return num === slidingSize * slidingSize ? 0 : num;
        })
    );
    
    emptyPosition = { row: slidingSize - 1, col: slidingSize - 1 };
    
    // Shuffle the puzzle
    shuffleSliding();
    renderSlidingGrid();
    updateSlidingStats();
    
    // Add size change listener
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            initSliding(); // Restart with new size
        });
    }
}

function renderSlidingGrid() {
    const gridElement = document.getElementById('slidingGrid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < slidingSize; row++) {
        for (let col = 0; col < slidingSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell sliding-tile';
            
            const value = slidingGrid[row][col];
            cell.textContent = value === 0 ? '' : value;
            
            cell.style.cssText = `
                height: min(70px, 18vw);
                background: ${value === 0 ? '#f0f0f0' : '#fff'};
                border: 2px solid ${value === 0 ? '#d1d5db' : '#6366f1'};
                font-size: min(18px, 5vw);
                font-weight: 600;
                cursor: ${value === 0 ? 'default' : 'pointer'};
                border-radius: 8px;
                transition: all 0.2s ease;
                user-select: none;
            `;
            
            if (value !== 0) {
                cell.addEventListener('mouseenter', () => {
                    if (gameActive && !gamePaused && canSlidingMove(row, col)) {
                        cell.style.background = '#e0e7ff';
                        cell.style.transform = 'scale(1.05)';
                    }
                });
                
                cell.addEventListener('mouseleave', () => {
                    cell.style.background = '#fff';
                    cell.style.transform = 'scale(1)';
                });
            }
            
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => moveSlidingTile(row, col);
            
            gridElement.appendChild(cell);
        }
    }
}

function moveSlidingTile(row, col) {
    if (!gameActive || gamePaused || !canSlidingMove(row, col)) return;
    
    // Swap with empty space
    slidingGrid[emptyPosition.row][emptyPosition.col] = slidingGrid[row][col];
    slidingGrid[row][col] = 0;
    
    emptyPosition = { row, col };
    slidingMoves++;
    
    renderSlidingGrid();
    updateSlidingStats();
    
    // Check if puzzle is solved
    if (isSlidingSolved()) {
        const time = stopTimer();
        gameActive = false;
        showNotification(translate('puzzleSolved') + ' ' + translate('inMoves', {moves: slidingMoves}) + ' ' + translate('inSeconds', {time}), 'success', 3000);
    }
}

function canSlidingMove(row, col) {
    const { row: emptyRow, col: emptyCol } = emptyPosition;
    return (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
}

function shuffleSliding() {
    // Perform valid moves to shuffle
    for (let i = 0; i < 1000; i++) {
        const possibleMoves = [];
        
        for (let row = 0; row < slidingSize; row++) {
            for (let col = 0; col < slidingSize; col++) {
                if (slidingGrid[row][col] !== 0 && canSlidingMove(row, col)) {
                    possibleMoves.push({ row, col });
                }
            }
        }
        
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            // Make the move without counting
            slidingGrid[emptyPosition.row][emptyPosition.col] = slidingGrid[randomMove.row][randomMove.col];
            slidingGrid[randomMove.row][randomMove.col] = 0;
            emptyPosition = randomMove;
        }
    }
    
    slidingMoves = 0;
}

function isSlidingSolved() {
    for (let row = 0; row < slidingSize; row++) {
        for (let col = 0; col < slidingSize; col++) {
            const expectedValue = row * slidingSize + col + 1;
            if (row === slidingSize - 1 && col === slidingSize - 1) {
                // Last cell should be empty (0)
                if (slidingGrid[row][col] !== 0) return false;
            } else {
                if (slidingGrid[row][col] !== expectedValue) return false;
            }
        }
    }
    return true;
}

function updateSlidingStats() {
    document.getElementById('slidingMoves').textContent = slidingMoves;
}
