# Precision Shot - Archery Game

A dynamic archery game built with HTML, CSS, and JavaScript featuring moving targets, a drag-to-shoot power mechanic, difficulty progression, and accurate score tracking.

**🌟 Play the Live Game:** [https://precision-shot.vercel.app/](https://precision-shot.vercel.app/)

## 🎯 Game Features

### Gameplay
- **Moving Target**: Target continuously moves within the game area, increasing difficulty.
- **Dynamic Controls**: Click, drag, and release to calculate shot power and angle.
- **Power Bar**: Visual feedback showing how much force is applied to the bow string.
- **Limited Resources**: 15 arrows and 60 seconds to achieve the highest score.
- **Dynamic Difficulty**: Target gets smaller and faster as your score increases.
- **Realistic Scoring**: Points based on exactly where you hit the target (50, 30, 15, 10, or 5 points).

### Technical Implementation

#### DOM Elements & Object Usage ✅
- Uses `getElementById` and `querySelector` for DOM selection.
- Stores elements efficiently using standard variables to prevent constant DOM querying.
- Manipulates arrow and bow elements dynamically during gameplay.
- No hard-coded values - uses constants and variables (e.g., `defArrowSpeed`, `defTime`).

#### Event Handling Logic ✅
- Implements `addEventListener` for all user interactions (`mousedown`, `mousemove`, `mouseup`, `click`).
- Distinguishes between interactive game clicks and background/UI clicks.
- Prevents unintended UI clicks (like the restart button) from triggering arrow shots.
- Efficient event delegation.

#### Function & Code Structure ✅
- **Modular Functions**: Each task has its own dedicated function:
  - `moveTarget()` - Handles target movement with boundary detection.
  - `startTimer()` - Manages countdown timer.
  - `updateScore()` - Updates score display and triggers animations.
  - `increaseDifficulty()` - Adjusts game difficulty thresholds.
  - `setPower()` / `updateAngles()` - Handles drag physics and visual bow stretching.
  - `checkInnerCollision()` - Detects exact Y-axis hits and calculates points.
- **Consistent Style**: Uses modern JavaScript syntax and array/math functions.
- **No Code Duplication**: Reusable functions prevent repetition.
- **Clear Naming**: Function names describe their purpose perfectly.

#### Game Logic & State ✅
- **State Management**: Tracks game state using dedicated variables:
  - `score` - Current score
  - `timeLeft` - Remaining time
  - `arrowCount` - Remaining arrows
  - `gameOver` / `gameEnded` - Game running status
  - `arrowMoving` / `arrowPinned` - Physics state tracking
- **Timer System**: Counts down correctly every second using `setInterval`.
- **Game Over Conditions**: 
  - Time reaches zero
  - Out of arrows
  - Stops target movement
  - Shows game over screen
- **Score Updates**: Only increases on successful hits.
- **Reset Functionality**: Clean restart via `restartGame()` without page reload errors.

#### Dynamic Styling & Difficulty ✅
- **JavaScript-Driven Styling**:
  - Target size changes based on difficulty dynamically manipulating DOM styles.
  - Target speed increases with score.
  - Arrow rotation and Bow translation use dynamic CSS `transform: rotate()`.
  - Bow animation frame updates via `src` attribute manipulation.
- **Progressive Difficulty**:
  - Every 50 points increases difficulty level (`nextTarget += 50`).
  - Speed: Increases continuously per level (`targetSpeed += 5`).
  - Size: Decreases progressively (`target.offsetHeight - 10px`).
- **Smooth Transitions**: CSS transitions for UI elements.
- **Responsive**: Adapts to different screen sizes and viewport heights.

## 🎮 How to Play

1. **Click "Start Game"** on the main menu.
2. **Click and Hold** anywhere on the game screen to grab the bowstring.
3. **Drag your mouse back** to increase power (watch the green power bar!) and adjust your angle.
4. **Release** to shoot the arrow.
5. **Hit the moving target** to score points:
   - 🎯 Yellow Center: **50 points**
   - 🔴 Red Ring: **30 points**
   - 🔵 Blue Ring: **15 points**
   - ⚫ Black Ring: **10 points**
   - ⚪ White Ring: **5 points**
6. **Beat your high score** before time runs out or you run out of arrows!

## 📁 File Structure

```
precision-shot/
├── index.html            # Main Menu screen
├── game.html             # Core game logic, UI, and event listeners
├── style.css             # Global styling and animations
├── script.js             # Game logic and mechanics
├── project_document.pdf  # Official project report/documentation
├── README.md             # Project overview and instructions
└── sprites/              # Game assets and UI images
    ├── logo.png
    ├── favicon.png
    ├── bg-main.jpg
    ├── bg-game.png
    ├── button.png
    ├── menu-bg.png
    ├── bow1.png - bow6.png
    ├── arrow.png
    ├── target.png
    ├── target_scores.png
    └── bag1.png - bag4.png
```

## 🛠️ Technical Details

### Collision Detection
Uses advanced trigonometric calculations (`Math.atan2` and `Math.sin`) to calculate the exact Y-axis intersection point of the arrow tip against the target. The scoring zones are mathematically calculated based on the scaled fractional height (`fact = originalH / target.offsetHeight`) of the `target.png` dimensions.

### Animation System
* **Bow Animation:** 6-frame sequence swapping image `src` based on drag distance.
* **Arrow Flight:** Trigonometric vector movement (`Math.cos` / `Math.sin`) for realistic trajectory.
* **Target Movement:** `setInterval` powered smooth movement with dynamic boundary detection.
* **Score Popup:** Custom CSS `@keyframes` animation triggered by JS reflow hacks (`void scoreInc.offsetWidth`) for repeatable fade and rise effects.

### Responsive Design
* Mobile-friendly controls.
* Scaled UI elements for smaller screens.
* Maintained playability across devices.

## 🎨 Design Features

* **Typography:** Cinzel (display) + Crimson Text (body) for a medieval/outdoor theme.
* **Color Palette:** Natural wood tones, forest greens, and sunset golds.
* **Animations:** Smooth transitions, floating logo, button hover effects.
* **Visual Effects:** Drop shadows, glow effects, particle-style score popups.

## 📊 Scoring Algorithm

The game uses real-time DOM measurements to calculate accurate scoring:

* Drag distance is mapped to arrow speed and bow tension.
* The arrow tip's precise Y-coordinate is calculated upon boundary intersection.
* The intersection point is mapped to fractional scoring zones (50/30/15/10/5 points).
* Visual feedback is instantly provided with an animated score popup positioned relative to the target.

## 🚀 Setup Instructions

1. Create a `sprites` folder in the same directory as the HTML file.
2. Add all required sprite images (listed in File Structure).
3. Open `index.html` in a modern web browser.
4. Click "START GAME" and enjoy!