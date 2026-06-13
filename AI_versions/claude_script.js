// ===== GAME STATE VARIABLES =====
const gameState = {
    score: 0,
    timeLeft: 60,
    arrows: 15,
    totalShots: 0,
    hits: 0,
    gameActive: false,
    timerInterval: null,
    targetSpeed: 2,
    targetSize: 200,
    difficulty: 1
};

// ===== DOM ELEMENTS =====
const elements = {
    // Screens
    mainMenu: document.getElementById('main-menu'),
    howToScreen: document.getElementById('how-to-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    
    // Buttons
    startBtn: document.getElementById('start-btn'),
    howToBtn: document.getElementById('how-to-btn'),
    backBtn: document.getElementById('back-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn'),
    
    // Game elements
    gameArea: document.getElementById('game-area'),
    target: document.getElementById('target'),
    bow: document.getElementById('bow'),
    bowImg: document.getElementById('bow-img'),
    arrowsContainer: document.getElementById('arrows-container'),
    
    // HUD
    scoreValue: document.getElementById('score-value'),
    timerValue: document.getElementById('timer-value'),
    ammoImg: document.getElementById('ammo-img'),
    scorePopup: document.getElementById('score-popup'),
    
    // Game Over
    finalScoreValue: document.getElementById('final-score-value'),
    hitsValue: document.getElementById('hits-value'),
    accuracyValue: document.getElementById('accuracy-value')
};

// ===== TARGET SCORING ZONES (based on target.png measurements) =====
const targetZones = {
    w1: 0,      // Top white start
    wb1: 54,    // White to black transition
    bbl1: 115,  // Black to blue transition
    blr1: 182,  // Blue to red transition
    ry1: 249,   // Red to gold (yellow) transition
    ry2: 385,   // Gold to red transition
    blr2: 451,  // Red to blue transition
    bbl2: 519,  // Blue to black transition
    wb2: 579,   // Black to white transition
    w2: 634     // Bottom white end
};

// ===== TARGET MOVEMENT =====
let targetPosition = { x: 500, y: 300 };
let targetVelocity = { x: 2, y: 1.5 };
let targetMovementInterval = null;

// ===== EVENT LISTENERS =====
const initEventListeners = () => {
    elements.startBtn.addEventListener('click', startGame);
    elements.howToBtn.addEventListener('click', showHowToPlay);
    elements.backBtn.addEventListener('click', showMainMenu);
    elements.playAgainBtn.addEventListener('click', resetAndStartGame);
    elements.mainMenuBtn.addEventListener('click', showMainMenu);
    elements.gameArea.addEventListener('click', shootArrow);
};

// ===== SCREEN NAVIGATION FUNCTIONS =====
const showScreen = (screenToShow) => {
    const screens = [elements.mainMenu, elements.howToScreen, elements.gameScreen, elements.gameOverScreen];
    screens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
};

const showMainMenu = () => {
    showScreen(elements.mainMenu);
    stopGame();
};

const showHowToPlay = () => {
    showScreen(elements.howToScreen);
};

const showGameScreen = () => {
    showScreen(elements.gameScreen);
};

const showGameOver = () => {
    showScreen(elements.gameOverScreen);
    updateGameOverStats();
};

// ===== GAME INITIALIZATION =====
const startGame = () => {
    showGameScreen();
    gameState.gameActive = true;
    startTimer();
    moveTarget();
};

const resetAndStartGame = () => {
    resetGameState();
    startGame();
};

const resetGameState = () => {
    gameState.score = 0;
    gameState.timeLeft = 60;
    gameState.arrows = 15;
    gameState.totalShots = 0;
    gameState.hits = 0;
    gameState.targetSpeed = 2;
    gameState.targetSize = 200;
    gameState.difficulty = 1;
    
    updateScore();
    updateTimer();
    updateAmmo();
    
    // Clear any existing arrows
    elements.arrowsContainer.innerHTML = '';
    
    // Reset target position
    targetPosition = { x: 500, y: 300 };
    elements.target.style.width = gameState.targetSize + 'px';
    elements.target.style.height = gameState.targetSize + 'px';
};

const stopGame = () => {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    clearInterval(targetMovementInterval);
    gameState.timerInterval = null;
    targetMovementInterval = null;
};

// ===== TIMER FUNCTIONS =====
const startTimer = () => {
    updateTimer();
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
};

const updateTimer = () => {
    elements.timerValue.textContent = gameState.timeLeft;
    
    // Add warning effect when time is low
    if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
        elements.timerValue.style.color = '#dc3545';
        elements.timerValue.style.animation = 'pulse 0.5s ease-in-out';
    } else {
        elements.timerValue.style.color = '';
        elements.timerValue.style.animation = '';
    }
};

// ===== SCORE FUNCTIONS =====
const updateScore = () => {
    elements.scoreValue.textContent = gameState.score;
};

const addScore = (points, x, y) => {
    gameState.score += points;
    gameState.hits++;
    updateScore();
    showScorePopup(points, x, y);
    increaseDifficulty();
};

const showScorePopup = (points, x, y) => {
    elements.scorePopup.textContent = `+${points}`;
    elements.scorePopup.style.left = x + 'px';
    elements.scorePopup.style.top = y + 'px';
    elements.scorePopup.classList.add('show');
    
    setTimeout(() => {
        elements.scorePopup.classList.remove('show');
    }, 1000);
};

// ===== AMMO FUNCTIONS =====
const updateAmmo = () => {
    const ammoImages = {
        3: 'sprites/bag1.png',
        2: 'sprites/bag2.png',
        1: 'sprites/bag3.png',
        0: 'sprites/bag4.png'
    };
    
    elements.ammoImg.src = ammoImages[gameState.arrows] || ammoImages[0];
};

// ===== DIFFICULTY FUNCTIONS =====
const increaseDifficulty = () => {
    // Increase difficulty every 50 points
    const newDifficulty = Math.floor(gameState.score / 50) + 1;
    
    if (newDifficulty > gameState.difficulty) {
        gameState.difficulty = newDifficulty;
        
        // Increase speed
        gameState.targetSpeed = 2 + (gameState.difficulty * 0.5);
        
        // Decrease size (minimum 100px)
        gameState.targetSize = Math.max(100, 200 - (gameState.difficulty * 15));
        
        // Update target size with smooth transition
        elements.target.style.width = gameState.targetSize + 'px';
        elements.target.style.height = gameState.targetSize + 'px';
    }
};

// ===== TARGET MOVEMENT FUNCTIONS =====
const moveTarget = () => {
    targetMovementInterval = setInterval(() => {
        if (!gameState.gameActive) return;
        
        // Update position
        targetPosition.x += targetVelocity.x * gameState.targetSpeed;
        targetPosition.y += targetVelocity.y * gameState.targetSpeed;
        
        // Get boundaries
        const gameAreaRect = elements.gameArea.getBoundingClientRect();
        const targetWidth = gameState.targetSize;
        const targetHeight = gameState.targetSize;
        
        // Bounce off edges
        if (targetPosition.x <= 0 || targetPosition.x >= gameAreaRect.width - targetWidth) {
            targetVelocity.x *= -1;
            targetPosition.x = Math.max(0, Math.min(targetPosition.x, gameAreaRect.width - targetWidth));
        }
        
        if (targetPosition.y <= 120 || targetPosition.y >= gameAreaRect.height - targetHeight - 50) {
            targetVelocity.y *= -1;
            targetPosition.y = Math.max(120, Math.min(targetPosition.y, gameAreaRect.height - targetHeight - 50));
        }
        
        // Apply position
        elements.target.style.left = targetPosition.x + 'px';
        elements.target.style.top = targetPosition.y + 'px';
    }, 16); // ~60 FPS
};

// ===== SHOOTING FUNCTIONS =====
const shootArrow = (event) => {
    if (!gameState.gameActive || gameState.arrows <= 0) return;
    
    // Prevent shooting if clicking on UI elements
    if (event.target.closest('.hud')) return;
    
    gameState.arrows--;
    gameState.totalShots++;
    updateAmmo();
    
    // Get click position
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Animate bow
    animateBow();
    
    // Create and shoot arrow
    createAndShootArrow(clickX, clickY);
    
    // Check if out of arrows
    if (gameState.arrows <= 0) {
        setTimeout(() => {
            endGame();
        }, 1500);
    }
};

const animateBow = () => {
    const bowFrames = ['bow1.png', 'bow2.png', 'bow3.png', 'bow4.png', 'bow5.png', 'bow6.png', 'bow5.png', 'bow4.png', 'bow3.png', 'bow2.png', 'bow1.png'];
    let frameIndex = 0;
    
    elements.bow.classList.add('shooting');
    
    const bowAnimation = setInterval(() => {
        if (frameIndex < bowFrames.length) {
            elements.bowImg.src = `sprites/${bowFrames[frameIndex]}`;
            frameIndex++;
        } else {
            clearInterval(bowAnimation);
            elements.bow.classList.remove('shooting');
        }
    }, 50);
};

const createAndShootArrow = (targetX, targetY) => {
    // Create arrow element
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.innerHTML = '<img src="sprites/arrow.png" alt="Arrow">';
    
    // Get bow position
    const bowRect = elements.bow.getBoundingClientRect();
    const startX = bowRect.right;
    const startY = bowRect.top + (bowRect.height / 2);
    
    // Set initial position
    arrow.style.left = startX + 'px';
    arrow.style.top = startY + 'px';
    
    // Calculate angle
    const dx = targetX - startX;
    const dy = targetY - startY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    arrow.style.transform = `rotate(${angle}deg)`;
    
    elements.arrowsContainer.appendChild(arrow);
    
    // Animate arrow
    const duration = 500;
    const startTime = Date.now();
    
    const animateArrow = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for realistic arrow flight
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (dx * easeProgress);
        const currentY = startY + (dy * easeProgress);
        
        arrow.style.left = currentX + 'px';
        arrow.style.top = currentY + 'px';
        
        if (progress < 1) {
            requestAnimationFrame(animateArrow);
        } else {
            // Check collision at final position
            checkCollision(currentX, currentY);
            
            // Remove arrow after a delay
            setTimeout(() => {
                arrow.remove();
            }, 500);
        }
    };
    
    requestAnimationFrame(animateArrow);
};

// ===== COLLISION DETECTION =====
const checkCollision = (arrowX, arrowY) => {
    const targetRect = elements.target.getBoundingClientRect();
    
    // Check if arrow is within target bounds
    if (arrowX >= targetRect.left && arrowX <= targetRect.right &&
        arrowY >= targetRect.top && arrowY <= targetRect.bottom) {
        
        // Calculate hit position relative to target center
        const targetCenterX = targetRect.left + (targetRect.width / 2);
        const targetCenterY = targetRect.top + (targetRect.height / 2);
        
        const relativeX = arrowX - targetCenterX;
        const relativeY = arrowY - targetCenterY;
        
        // Calculate distance from center
        const distanceFromCenter = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
        
        // Scale distance based on current target size (reference: 200px)
        const scaledDistance = (distanceFromCenter / gameState.targetSize) * 634;
        
        // Determine score based on scaled distance
        const points = calculatePoints(scaledDistance);
        
        if (points > 0) {
            // Hit animation
            elements.target.classList.add('hit');
            setTimeout(() => {
                elements.target.classList.remove('hit');
            }, 300);
            
            addScore(points, arrowX, arrowY);
        }
    }
};

const calculatePoints = (scaledDistance) => {
    // Using the target zones from target.png
    // Center is at approximately y=317 (middle of target)
    // We're using distance from center for circular scoring
    
    const zones = [
        { max: 68, points: 50 },  // Gold center (ry1 to ry2 midpoint scaled)
        { max: 134, points: 30 }, // Red ring
        { max: 201, points: 15 }, // Blue ring
        { max: 268, points: 10 }, // Black ring
        { max: 317, points: 5 }   // White ring
    ];
    
    for (const zone of zones) {
        if (scaledDistance <= zone.max) {
            return zone.points;
        }
    }
    
    return 0; // Miss
};

// ===== GAME END FUNCTIONS =====
const endGame = () => {
    stopGame();
    showGameOver();
};

const updateGameOverStats = () => {
    elements.finalScoreValue.textContent = gameState.score;
    elements.hitsValue.textContent = gameState.hits;
    
    const accuracy = gameState.totalShots > 0 
        ? Math.round((gameState.hits / gameState.totalShots) * 100) 
        : 0;
    elements.accuracyValue.textContent = accuracy + '%';
};

// ===== INITIALIZE GAME =====
const init = () => {
    initEventListeners();
    resetGameState();
};

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
