// === GAME STATE ===
const gameState = {
  score: 0,
  timeLeft: 60,
  arrows: 15,
  gameOver: false,
  isDrawing: false,
  drawFrame: 0,
  targetX: 0,
  targetY: 0,
  targetSpeed: 2,
  arrowActive: false,
  arrowX: 0,
  arrowY: 0,
  arrowVelocityX: 0,
  arrowVelocityY: 0,
  lastTimestamp: 0
};

// === DOM ELEMENTS ===
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time-left');
const quiverEl = document.getElementById('quiver');
const bowEl = document.getElementById('bow');
const targetEl = document.getElementById('target');
const arrowEl = document.getElementById('arrow');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');

// === TARGET HIT ZONES (from your Y-coords) ===
// w1 = 0, wb1 = 54, bbl1 = 115, blr1 = 182, ry1 = 249, ry2 = 385, blr2 = 451, bbl2 = 519, wb2 = 579, w2 = 634
// Target height = 634px → center at 317px
const TARGET_HEIGHT = 634;
const CENTER_Y = TARGET_HEIGHT / 2; // 317

const SCORE_ZONES = [
  { yTop: 0, yBottom: 54, score: 5 },     // White outer
  { yTop: 54, yBottom: 115, score: 10 },  // Black
  { yTop: 115, yBottom: 182, score: 15 }, // Blue
  { yTop: 182, yBottom: 249, score: 30 }, // Red
  { yTop: 249, yBottom: 385, score: 50 }, // Gold (bullseye)
  { yTop: 385, yBottom: 451, score: 30 },
  { yTop: 451, yBottom: 519, score: 15 },
  { yTop: 519, yBottom: 579, score: 10 },
  { yTop: 579, yBottom: 634, score: 5 }
];

// === UTILITIES ===
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateQuiver() {
  const bagIndex = Math.max(0, Math.min(3, 3 - Math.floor((15 - gameState.arrows) / 5)));
  quiverEl.src = `sprites/bag${bagIndex + 1}.png`;
}

// === GAME LOGIC ===
function initGame() {
  gameState.score = 0;
  gameState.timeLeft = 60;
  gameState.arrows = 15;
  gameState.gameOver = false;
  gameState.isDrawing = false;
  gameState.drawFrame = 0;
  gameState.arrowActive = false;
  gameState.targetSpeed = 2;

  scoreEl.textContent = gameState.score;
  timeEl.textContent = gameState.timeLeft;
  updateQuiver();

  // Reset bow
  bowEl.style.backgroundImage = "url('sprites/bow1.png')";
  
  // Place target randomly (within safe bounds)
  const gameArea = document.getElementById('game-area');
  const gameRect = gameArea.getBoundingClientRect();
  const targetWidth = 120;
  const targetHeight = 120;
  gameState.targetX = getRandomInt(targetWidth / 2, gameRect.width - targetWidth / 2);
  gameState.targetY = getRandomInt(targetHeight / 2, gameRect.height - targetHeight / 2);
  targetEl.style.left = `${gameState.targetX}px`;
  targetEl.style.top = `${gameState.targetY}px`;

  // Hide game over
  gameOverEl.classList.add('hidden');

  // Start timer
  startTimer();
  // Start target movement
  moveTarget();
}

function startTimer() {
  if (gameState.gameOver) return;

  const tick = () => {
    if (gameState.gameOver) return;

    gameState.timeLeft--;
    timeEl.textContent = gameState.timeLeft;

    if (gameState.timeLeft <= 0) {
      endGame();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function moveTarget() {
  if (gameState.gameOver) return;

  const gameArea = document.getElementById('game-area');
  const gameRect = gameArea.getBoundingClientRect();
  const targetWidth = 120;
  const targetHeight = 120;

  // Random direction each frame (small step)
  const dx = (Math.random() - 0.5) * gameState.targetSpeed * 2;
  const dy = (Math.random() - 0.5) * gameState.targetSpeed * 2;

  gameState.targetX = clamp(gameState.targetX + dx, targetWidth / 2, gameRect.width - targetWidth / 2);
  gameState.targetY = clamp(gameState.targetY + dy, targetHeight / 2, gameRect.height - targetHeight / 2);

  targetEl.style.left = `${gameState.targetX}px`;
  targetEl.style.top = `${gameState.targetY}px`;

  setTimeout(moveTarget, 50); // ~20fps
}

function drawBow() {
  if (gameState.isDrawing || gameState.arrows <= 0 || gameState.gameOver) return;

  gameState.isDrawing = true;
  gameState.drawFrame = 0;

  const drawStep = () => {
    gameState.drawFrame++;
    if (gameState.drawFrame <= 6) {
      bowEl.style.backgroundImage = `url('sprites/bow${gameState.drawFrame}.png')`;
      setTimeout(drawStep, 80);
    } else {
      // Ready to shoot
      bowEl.style.cursor = 'pointer';
    }
  };

  drawStep();
}

function releaseArrow() {
  if (!gameState.isDrawing || gameState.arrows <= 0 || gameState.gameOver) return;

  gameState.isDrawing = false;
  gameState.arrows--;
  updateQuiver();

  // Reset bow
  bowEl.style.backgroundImage = "url('sprites/bow1.png')";
  bowEl.style.cursor = 'default';

  // Launch arrow from bow tip (~x=120, y=50)
  const bowRect = bowEl.getBoundingClientRect();
  const gameRect = document.getElementById('game-area').getBoundingClientRect();

  gameState.arrowX = bowRect.left + gameRect.left + 120;
  gameState.arrowY = bowRect.top + gameRect.top + 50;

  // Direction toward target
  const dx = gameState.targetX - gameState.arrowX;
  const dy = gameState.targetY - gameState.arrowY;
  const dist = Math.hypot(dx, dy);
  const speed = 8 + gameState.score * 0.2; // Faster with score

  gameState.arrowVelocityX = (dx / dist) * speed;
  gameState.arrowVelocityY = (dy / dist) * speed;
  gameState.arrowActive = true;

  // Show arrow
  arrowEl.style.opacity = '1';
  arrowEl.style.left = `${gameState.arrowX}px`;
  arrowEl.style.top = `${gameState.arrowY}px`;
  arrowEl.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;

  animateArrow();
}

function animateArrow() {
  if (!gameState.arrowActive || gameState.gameOver) return;

  gameState.arrowX += gameState.arrowVelocityX;
  gameState.arrowY += gameState.arrowVelocityY;

  arrowEl.style.left = `${gameState.arrowX}px`;
  arrowEl.style.top = `${gameState.arrowY}px`;

  // Check collision with target (simple bounding box + Y-zone scoring)
  const targetRect = targetEl.getBoundingClientRect();
  const arrowRect = arrowEl.getBoundingClientRect();

  const hitX = arrowRect.left + arrowRect.width / 2;
  const hitY = arrowRect.top + arrowRect.height / 2;

  const inTargetX = hitX >= targetRect.left && hitX <= targetRect.right;
  const inTargetY = hitY >= targetRect.top && hitY <= targetRect.bottom;

  if (inTargetX && inTargetY) {
    // Calculate relative Y inside target (0 to 634)
    const relY = hitY - targetRect.top;
    let hitScore = 0;

    for (const zone of SCORE_ZONES) {
      if (relY >= zone.yTop && relY <= zone.yBottom) {
        hitScore = zone.score;
        break;
      }
    }

    gameState.score += hitScore;
    scoreEl.textContent = gameState.score;

    // Increase difficulty
    gameState.targetSpeed = Math.min(8, 2 + Math.floor(gameState.score / 50) * 0.5);

    // Reset arrow
    gameState.arrowActive = false;
    arrowEl.style.opacity = '0';

    // Reposition target
    const gameArea = document.getElementById('game-area');
    const gameRect = gameArea.getBoundingClientRect();
    const targetWidth = 120;
    const targetHeight = 120;
    gameState.targetX = getRandomInt(targetWidth / 2, gameRect.width - targetWidth / 2);
    gameState.targetY = getRandomInt(targetHeight / 2, gameRect.height - targetHeight / 2);
    targetEl.style.left = `${gameState.targetX}px`;
    targetEl.style.top = `${gameState.targetY}px`;
  } else if (
    gameState.arrowX < 0 ||
    gameState.arrowX > window.innerWidth ||
    gameState.arrowY < 0 ||
    gameState.arrowY > window.innerHeight
  ) {
    // Arrow missed & off screen
    gameState.arrowActive = false;
    arrowEl.style.opacity = '0';
  } else {
    requestAnimationFrame(animateArrow);
  }
}

function endGame() {
  gameState.gameOver = true;
  finalScoreEl.textContent = gameState.score;
  gameOverEl.classList.remove('hidden');
  arrowEl.style.opacity = '0';
}

// === EVENT LISTENERS ===
btnStart.addEventListener('click', () => {
  mainMenu.classList.remove('active');
  gameScreen.classList.add('active');
  initGame();
});

btnRestart.addEventListener('click', () => {
  gameOverEl.classList.add('hidden');
  initGame();
});

bowEl.addEventListener('mousedown', drawBow);
bowEl.addEventListener('mouseup', releaseArrow);
bowEl.addEventListener('touchstart', (e) => {
  e.preventDefault();
  drawBow();
});
bowEl.addEventListener('touchend', (e) => {
  e.preventDefault();
  releaseArrow();
});

// Prevent default context menu on right-click/tap
document.addEventListener('contextmenu', e => e.preventDefault());

// Optional: Spacebar to shoot
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameState.isDrawing && gameState.arrows > 0 && !gameState.gameOver) {
    e.preventDefault();
    drawBow();
    setTimeout(releaseArrow, 500); // simulate draw+release
  }
});