// Professional 2048 Game Implementation
let game2048Grid = [];
let game2048Score = 0;
let game2048Moves = 0;
let game2048Size = 4;
let game2048Target = 2048;

function init2048() {
    game2048Score = 0;
    game2048Moves = 0;
    
    // Get grid size setting
    const sizeSelect = document.getElementById('game2048Size');
    if (sizeSelect) {
        game2048Size = parseInt(sizeSelect.value);
        game2048Target = game2048Size === 4 ? 2048 : game2048Size === 5 ? 4096 : 8192;
        document.getElementById('game2048Target').textContent = game2048Target;
        
        // Update grid CSS
        const gridElement = document.getElementById('game2048Grid');
        gridElement.style.gridTemplateColumns = `repeat(${game2048Size}, 1fr)`;
        gridElement.style.maxWidth = `${game2048Size * 80 + (game2048Size - 1) * 10}px`;
    }
    
    // Initialize empty grid
    game2048Grid = Array(game2048Size).fill().map(() => Array(game2048Size).fill(0));
    
    // Add two starting tiles
    addRandom2048Tile();
    addRandom2048Tile();
    
    render2048Grid();
    update2048Stats();
    
    // Add keyboard controls
    document.addEventListener('keydown', handle2048KeyPress);
    
    // Add size change listener
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            init2048(); // Restart with new size
        });
    }
}

function addRandom2048Tile() {
    const emptyCells = [];
    for (let row = 0; row < game2048Size; row++) {
        for (let col = 0; col < game2048Size; col++) {
            if (game2048Grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048Grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function render2048Grid() {
    const gridElement = document.getElementById('game2048Grid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < game2048Size; row++) {
        for (let col = 0; col < game2048Size; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell tile-2048';
            
            const value = game2048Grid[row][col];
            cell.textContent = value === 0 ? '' : value;
            
            // Color scheme based on value
            const tileColors = {
                0: { bg: '#cdc1b4', color: '#776e65' },
                2: { bg: '#eee4da', color: '#776e65' },
                4: { bg: '#ede0c8', color: '#776e65' },
                8: { bg: '#f2b179', color: '#f9f6f2' },
                16: { bg: '#f59563', color: '#f9f6f2' },
                32: { bg: '#f67c5f', color: '#f9f6f2' },
                64: { bg: '#f65e3b', color: '#f9f6f2' },
                128: { bg: '#edcf72', color: '#f9f6f2' },
                256: { bg: '#edcc61', color: '#f9f6f2' },
                512: { bg: '#edc850', color: '#f9f6f2' },
                1024: { bg: '#edc53f', color: '#f9f6f2' },
                2048: { bg: '#edc22e', color: '#f9f6f2' },
                4096: { bg: '#3c3a32', color: '#f9f6f2' },
                8192: { bg: '#3c3a32', color: '#f9f6f2' }
            };
            
            const colors = tileColors[value] || { bg: '#3c3a32', color: '#f9f6f2' };
            
            cell.style.cssText = `
                height: min(60px, 15vw);
                background: ${colors.bg};
                color: ${colors.color};
                font-weight: bold;
                font-size: ${value > 999 ? 'min(12px, 3vw)' : 'min(16px, 4vw)'};
                border-radius: 8px;
                transition: all 0.15s ease-in-out;
                transform: ${value === 0 ? 'scale(0.9)' : 'scale(1)'};
            `;
            
            gridElement.appendChild(cell);
        }
    }
}

function handle2048KeyPress(e) {
    if (!gameActive || gamePaused) return;
    
    let moved = false;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            moved = move2048Up();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moved = move2048Down();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            moved = move2048Left();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moved = move2048Right();
            break;
    }
    
    if (moved) {
        game2048Moves++;
        addRandom2048Tile();
        render2048Grid();
        update2048Stats();
        
        // Check win condition
        if (hasReached2048Target()) {
            const time = stopTimer();
            gameActive = false;
            showNotification(translate('gameWon') + ' ' + translate('inMoves', {moves: game2048Moves}) + ' ' + translate('inSeconds', {time}), 'success', 4000);
        } else if (isGame2048Over()) {
            const time = stopTimer();
            gameActive = false;
            showNotification(translate('gameOver') + ' ' + translate('score') + ': ' + game2048Score, 'error', 3000);
        }
    }
}

function move2048Left() {
    let moved = false;
    for (let row = 0; row < game2048Size; row++) {
        const newRow = slide2048Array(game2048Grid[row]);
        if (newRow.moved) moved = true;
        game2048Grid[row] = newRow.array;
    }
    return moved;
}

function move2048Right() {
    let moved = false;
    for (let row = 0; row < game2048Size; row++) {
        const reversed = game2048Grid[row].slice().reverse();
        const newRow = slide2048Array(reversed);
        if (newRow.moved) moved = true;
        game2048Grid[row] = newRow.array.reverse();
    }
    return moved;
}

function move2048Up() {
    let moved = false;
    for (let col = 0; col < game2048Size; col++) {
        const column = [];
        for (let row = 0; row < game2048Size; row++) {
            column.push(game2048Grid[row][col]);
        }
        const newColumn = slide2048Array(column);
        if (newColumn.moved) moved = true;
        for (let row = 0; row < game2048Size; row++) {
            game2048Grid[row][col] = newColumn.array[row];
        }
    }
    return moved;
}

function move2048Down() {
    let moved = false;
    for (let col = 0; col < game2048Size; col++) {
        const column = [];
        for (let row = game2048Size - 1; row >= 0; row--) {
            column.push(game2048Grid[row][col]);
        }
        const newColumn = slide2048Array(column);
        if (newColumn.moved) moved = true;
        for (let row = 0; row < game2048Size; row++) {
            game2048Grid[game2048Size - 1 - row][col] = newColumn.array[row];
        }
    }
    return moved;
}

function slide2048Array(array) {
    const filtered = array.filter(val => val !== 0);
    let moved = false;
    
    // Merge adjacent same values
    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            filtered[i + 1] = 0;
            game2048Score += filtered[i];
            moved = true;
        }
    }
    
    // Remove zeros created by merging
    const merged = filtered.filter(val => val !== 0);
    
    // Pad with zeros
    while (merged.length < game2048Size) {
        merged.push(0);
    }
    
    // Check if array changed
    if (!moved) {
        moved = !array.every((val, index) => val === merged[index]);
    }
    
    return { array: merged, moved };
}

function update2048Stats() {
    document.getElementById('game2048Score').textContent = game2048Score;
    document.getElementById('game2048Moves').textContent = game2048Moves;
}

function hasReached2048Target() {
    for (let row = 0; row < game2048Size; row++) {
        for (let col = 0; col < game2048Size; col++) {
            if (game2048Grid[row][col] >= game2048Target) {
                return true;
            }
        }
    }
    return false;
}

function isGame2048Over() {
    // Check for empty cells
    for (let row = 0; row < game2048Size; row++) {
        for (let col = 0; col < game2048Size; col++) {
            if (game2048Grid[row][col] === 0) return false;
        }
    }
    
    // Check for possible merges
    for (let row = 0; row < game2048Size; row++) {
        for (let col = 0; col < game2048Size; col++) {
            const current = game2048Grid[row][col];
            if (
                (row < game2048Size - 1 && game2048Grid[row + 1][col] === current) ||
                (col < game2048Size - 1 && game2048Grid[row][col + 1] === current)
            ) {
                return false;
            }
        }
    }
    
    return true;
}
