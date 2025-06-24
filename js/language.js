// Professional Language System with German and Indonesian
let currentLanguage = 'en';

const translations = {
    en: {
        // Header & Navigation
        headerTitle: 'DESK ESCAPE',
        fullscreenBtn: '⛶ Fullscreen',
        themeBtn: '🌙 Dark Mode',
        sidebarTitle: 'Select Game',
        
        // Games
        home: 'Home',
        sudoku: 'Sudoku',
        '2048': '2048',
        sliding: 'Number Slide',
        nonogram: 'Nonogram',
        kenken: 'KenKen',
        sumplete: 'Number Sum',
        digits: 'Digits Challenge',
        
        // Welcome Screen
        welcomeTitle: 'Welcome to DESK ESCAPE',
        welcomeText: 'Challenge your mind with 7 professional number puzzle games designed for analytical thinking and strategic problem-solving.',
        startInstructions: 'Select any game from the sidebar to begin your cognitive journey',
        
        // Game Stats
        moves: 'Moves',
        time: 'Time',
        score: 'Score',
        level: 'Level',
        difficulty: 'Difficulty',
        completed: 'Completed',
        remaining: 'Remaining',
        target: 'Target',
        current: 'Current',
        
        // Difficulty Levels
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        expert: 'Expert',
        
        // Buttons
        startGame: '▶ Start Game',
        newGame: '🔄 New Game',
        pauseGame: '⏸ Pause',
        resumeGame: '▶ Resume',
        resetGame: '🔄 Reset',
        rules: '📖 Rules',
        
        // Notifications
        gameCompleted: 'Excellent! Puzzle completed successfully!',
        puzzleSolved: 'Congratulations! Puzzle solved!',
        gameWon: 'Victory achieved!'
    },
    
    de: {
        // Header & Navigation
        headerTitle: 'SCHREIBTISCH FLUCHT',
        fullscreenBtn: '⛶ Vollbild',
        themeBtn: '🌙 Dunkler Modus',
        sidebarTitle: 'Spiel Auswählen',
        
        // Games
        home: 'Startseite',
        sudoku: 'Sudoku',
        '2048': '2048',
        sliding: 'Zahlen Schieben',
        nonogram: 'Nonogramm',
        kenken: 'KenKen',
        sumplete: 'Zahlen Summe',
        digits: 'Ziffern Herausforderung',
        
        // Welcome Screen
        welcomeTitle: 'Willkommen bei SCHREIBTISCH FLUCHT',
        welcomeText: 'Fordern Sie Ihren Verstand mit 7 professionellen Zahlenrätselspielen heraus, die für analytisches Denken und strategische Problemlösung entwickelt wurden.',
        startInstructions: 'Wählen Sie ein Spiel aus der Seitenleiste, um Ihre kognitive Reise zu beginnen',
        
        // Game Stats
        moves: 'Züge',
        time: 'Zeit',
        score: 'Punkte',
        level: 'Level',
        difficulty: 'Schwierigkeit',
        completed: 'Abgeschlossen',
        remaining: 'Verbleibend',
        target: 'Ziel',
        current: 'Aktuell',
        
        // Difficulty Levels
        easy: 'Einfach',
        medium: 'Mittel',
        hard: 'Schwer',
        expert: 'Experte',
        
        // Buttons
        startGame: '▶ Spiel Starten',
        newGame: '🔄 Neues Spiel',
        pauseGame: '⏸ Pausieren',
        resumeGame: '▶ Fortsetzen',
        resetGame: '🔄 Zurücksetzen',
        rules: '📖 Regeln',
        
        // Notifications
        gameCompleted: 'Ausgezeichnet! Rätsel erfolgreich gelöst!',
        puzzleSolved: 'Glückwunsch! Rätsel gelöst!',
        gameWon: 'Sieg erreicht!'
    },
    
    id: {
        // Header & Navigation
        headerTitle: 'DESK ESCAPE',
        fullscreenBtn: '⛶ Layar Penuh',
        themeBtn: '🌙 Mode Gelap',
        sidebarTitle: 'Pilih Permainan',
        
        // Games
        home: 'Beranda',
        sudoku: 'Sudoku',
        '2048': '2048',
        sliding: 'Geser Angka',
        nonogram: 'Nonogram',
        kenken: 'KenKen',
        sumplete: 'Jumlah Angka',
        digits: 'Tantangan Digit',
        
        // Welcome Screen
        welcomeTitle: 'Selamat Datang di DESK ESCAPE',
        welcomeText: 'Tantang pikiran Anda dengan 7 permainan puzzle angka profesional yang dirancang untuk pemikiran analitis dan pemecahan masalah strategis.',
        startInstructions: 'Pilih permainan apa pun dari sidebar untuk memulai perjalanan kognitif Anda',
        
        // Game Stats
        moves: 'Langkah',
        time: 'Waktu',
        score: 'Skor',
        level: 'Level',
        difficulty: 'Kesulitan',
        completed: 'Selesai',
        remaining: 'Tersisa',
        target: 'Target',
        current: 'Sekarang',
        
        // Difficulty Levels
        easy: 'Mudah',
        medium: 'Sedang',
        hard: 'Sulit',
        expert: 'Ahli',
        
        // Buttons
        startGame: '▶ Mulai Permainan',
        newGame: '🔄 Permainan Baru',
        pauseGame: '⏸ Jeda',
        resumeGame: '▶ Lanjutkan',
        resetGame: '🔄 Reset',
        rules: '📖 Aturan',
        
        // Notifications
        gameCompleted: 'Luar biasa! Puzzle berhasil diselesaikan!',
        puzzleSolved: 'Selamat! Puzzle terpecahkan!',
        gameWon: 'Kemenangan tercapai!'
    }
    
    // Add similar complete translations for ar, fr, es, tr, it, pt...
};

const languageFlags = {
    en: '🇺🇸',
    ar: '🇸🇦',
    fr: '🇫🇷',
    es: '🇪🇸',
    tr: '🇹🇷',
    it: '🇮🇹',  
    pt: '🇵🇹',
    de: '🇩🇪',
    id: '🇮🇩'
};

const languageNames = {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    es: 'Español', 
    tr: 'Türkçe',
    it: 'Italiano',
    pt: 'Português',
    de: 'Deutsch',
    id: 'Bahasa Indonesia'
};

// Language Functions
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageOptions');
    dropdown.classList.toggle('show');
    
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.language-dropdown')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function setLanguage(lang) {
    currentLanguage = lang;
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.getElementById('currentLangFlag').textContent = languageFlags[lang];
    document.getElementById('currentLangName').textContent = languageNames[lang];
    
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[onclick="setLanguage('${lang}')"]`).classList.add('active');
    
    document.getElementById('languageOptions').classList.remove('show');
    updateAllText();
    
    // ALWAYS redirect to home when language changes
    loadGame('welcome');
}

function updateAllText() {
    const t = translations[currentLanguage];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (t[key]) {
            element.innerHTML = t[key];
        }
    });
    
    const updateById = {
        'headerTitle': t.headerTitle,
        'fullscreenBtn': t.fullscreenBtn,
        'themeBtn': t.themeBtn,
        'sidebarTitle': t.sidebarTitle
    };
    
    Object.keys(updateById).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = updateById[id];
        }
    });
}

function translate(key, replacements = {}) {
    let text = translations[currentLanguage]?.[key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    
    return text;
}
