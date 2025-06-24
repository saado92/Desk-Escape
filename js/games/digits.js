// Professional Digits Challenge Game Implementation
let digitsTarget = 0;
let digitsNumbers = [];
let digitsExpression = '';
let digitsScore = 0;
let digitsLevel = 'easy';
let usedDigits = new Set();

function initDigits() {
    digitsScore = 0;
    digitsExpression = '';
    usedDigits.clear();
    
    // Get difficulty setting
    const levelSelect = document.getElementById('digitsLevel');
    if (levelSelect) {
        digitsLevel = levelSelect.value;
    }
    
    generateNewDigitsChallenge();
    updateDigitsDisplay();
    
    // Add level change listener
    if (levelSelect) {
        levelSelect.addEventListener('change', () => {
            digitsLevel = levelSelect.value;
            generateNewDigitsChallenge();
        });
    }
}

function generateNewDigitsChallenge() {
    usedDigits.clear();
    digitsExpression = '';
    
    // Generate target based on difficulty
    switch (digitsLevel) {
        case 'easy':
            digitsTarget = Math.floor(Math.random() * 50) + 10; // 10-59
            digitsNumbers = generateEasyDigits();
            break;
        case 'medium':
            digitsTarget = Math.floor(Math.random() * 200) + 50; // 50-249
            digitsNumbers = generateMediumDigits();
            break;
        case 'hard':
            digitsTarget = Math.floor(Math.random() * 500) + 100; // 100-599
            digitsNumbers = generateHardDigits();
            break;
    }
    
    document.getElementById('digitsTarget').textContent = digitsTarget;
    document.getElementById('digitsCurrent').textContent = '0';
    updateDigitsDisplay();
}

function generateEasyDigits() {
    // Generate 4-6 single digits that can reach the target
    const digits = [];
    const count = Math.floor(Math.random() * 3) + 4; // 4-6 digits
    
    for (let i = 0; i < count; i++) {
        digits.push(Math.floor(Math.random() * 9) + 1);
    }
    
    return digits;
}

function generateMediumDigits() {
    // Generate 5-7 numbers (single digits and small multi-digit)
    const digits = [];
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 numbers
    
    for (let i = 0; i < count; i++) {
        if (Math.random() < 0.7) {
            digits.push(Math.floor(Math.random() * 9) + 1); // Single digit
        } else {
            digits.push(Math.floor(Math.random() * 20) + 10); // 10-29
        }
    }
    
    return digits;
}

function generateHardDigits() {
    // Generate 6-8 numbers with larger values
    const digits = [];
    const count = Math.floor(Math.random() * 3) + 6; // 6-8 numbers
    
    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        if (rand < 0.4) {
            digits.push(Math.floor(Math.random() * 9) + 1); // Single digit
        } else if (rand < 0.8) {
            digits.push(Math.floor(Math.random() * 50) + 10); // 10-59
        } else {
            digits.push(Math.floor(Math.random() * 100) + 25); // 25-124
        }
    }
    
    return digits;
}

function updateDigitsDisplay() {
    // Update available digits
    const numbersContainer = document.getElementById('digitsNumbers');
    numbersContainer.innerHTML = '';
    
    digitsNumbers.forEach((number, index) => {
        const numberBtn = document.createElement('button');
        numberBtn.className = 'number-btn';
        numberBtn.textContent = number;
        numberBtn.style.cssText = `
            margin: 3px;
            opacity: ${usedDigits.has(index) ? 0.3 : 1};
            cursor: ${usedDigits.has(index) ? 'not-allowed' : 'pointer'};
        `;
        
        if (!usedDigits.has(index)) {
            numberBtn.onclick = () => addDigitToExpression(number, index);
        }
        
        numbersContainer.appendChild(numberBtn);
    });
    
    // Update expression display
    document.getElementById('digitsExpression').value = digitsExpression;
    
    // Update score
    document.getElementById('digitsScore').textContent = digitsScore;
}

function addDigitToExpression(digit, index) {
    if (!gameActive || gamePaused || usedDigits.has(index)) return;
    
    usedDigits.add(index);
    
    if (digitsExpression === '' || isLastCharOperation()) {
        digitsExpression += digit;
    } else {
        // Need an operation before adding another digit
        showNotification('Add an operation first!', 'error', 1500);
        usedDigits.delete(index);
        return;
    }
    
    updateDigitsDisplay();
}

function addDigitsOperation(op) {
    if (!gameActive || gamePaused || digitsExpression === '' || isLastCharOperation()) {
        showNotification('Add a number first!', 'error', 1500);
        return;
    }
    
    digitsExpression += ` ${op} `;
    updateDigitsDisplay();
}

function isLastCharOperation() {
    const trimmed = digitsExpression.trim();
    return trimmed.endsWith('+') || trimmed.endsWith('-') || 
           trimmed.endsWith('*') || trimmed.endsWith('/') ||
           trimmed.endsWith('(') || trimmed.endsWith(')');
}

function clearDigitsExpression() {
    if (!gameActive || gamePaused) return;
    
    digitsExpression = '';
    usedDigits.clear();
    updateDigitsDisplay();
}

function calculateDigitsExpression() {
    if (!gameActive || gamePaused || digitsExpression === '') {
        showNotification('Build an expression first!', 'error', 1500);
        return;
    }
    
    try {
        // Replace display operators with JavaScript operators
        let evalExpression = digitsExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        // Validate expression (only allow numbers, operators, parentheses, and spaces)
        if (!/^[\d+\-*/().\s]+$/.test(evalExpression)) {
            throw new Error('Invalid characters in expression');
        }
        
        const result = eval(evalExpression);
        
        if (!Number.isFinite(result)) {
            throw new Error('Invalid calculation result');
        }
        
        const roundedResult = Math.round(result * 100) / 100; // Round to 2 decimal places
        document.getElementById('digitsCurrent').textContent = roundedResult;
        
        // Check if target is reached
        if (Math.abs(roundedResult - digitsTarget) < 0.01) {
            // Calculate score based on efficiency
            const efficiency = Math.max(1, 10 - usedDigits.size);
            const points = efficiency * 10;
            digitsScore += points;
            
            showNotification(translate('correct') + ` +${points} points!`, 'success', 2000);
            
            setTimeout(() => {
                generateNewDigitsChallenge();
            }, 2000);
        } else {
            const difference = Math.abs(roundedResult - digitsTarget);
            showNotification(`Close! Off by ${difference.toFixed(2)}`, 'info', 2000);
        }
        
