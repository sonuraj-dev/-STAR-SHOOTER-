# 🚀 STAR SHOOTER  




to play 

link : https://sonuraj-dev.github.io/-STAR-SHOOTER-/



## 🌌 About The Game

Star Shooter is a fast-paced 3D space combat game built using:

- HTML5  
- CSS3  
- Vanilla JavaScript  
- A-Frame (WebXR Framework)  

The player fights waves of enemy ships in a dynamic space environment featuring:

- Explosion effects  
- Procedural sound effects  
- Health system  
- Wave progression  
- Mouse-based aiming  
- VR compatibility  



---

<br><br>

## 🎮 Gameplay Features



### 👾 Enemy System

- Multiple enemy types (Fighter & Bomber)
- Homing movement AI
- Zigzag behavior (advanced waves)
- Increasing difficulty per wave



### 🔫 Shooting System

- Mouse-based aiming (Yaw + Pitch)
- Frame-rate independent bullet movement
- Collision detection with swept physics
- Explosion particle effects



### ❤️ Player System

- Health bar with color transitions
- Damage screen flash
- Wave-based progression
- Game Over & Restart functionality



### 🌠 Visual Effects

- Animated starfield background
- Explosion rings & particles
- Muzzle flash effect
- Dynamic lighting



---

<br><br>

## 🛠 Tech Stack

```
HTML5
CSS3
JavaScript (Vanilla)
A-Frame 1.6.0
WebXR
```

---

<br><br>

## 📁 Project Structure

```
Star-Shooter/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── gameState.js
│   ├── utils.js
│   ├── audio.js
│   ├── ui.js
│   ├── enemies.js
│   ├── components.js
│   ├── shooting.js
│   └── main.js
│
└── assets/
    └── poster.png
```

---

<br><br>

## 🎯 Controls

| Action            | Key / Input |
|------------------|------------|
| Aim              | Mouse |
| Shoot            | Left Click |
| Strafe Left      | A |
| Strafe Right     | D |
| Move Up          | Space |
| Move Down        | S |
| Lock Mouse       | Click Screen |
| Release Mouse    | ESC |



---

<br><br>

## ▶ How To Run The Project

⚠ Do NOT open using double click (`file:///`)

<br>

### Option 1 – VS Code Live Server (Recommended)

1. Open project folder in VS Code  
2. Install **Live Server** extension  
3. Right-click `index.html`  
4. Select **Open With Live Server**  

<br>

### Option 2 – Python Local Server

Run inside project folder:

```bash
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000
```

<br><br>

---

## 🔥 Difficulty Scaling

Each wave increases:

- Enemy count  
- Enemy speed  
- Fire rate  
- Damage output  
- Movement complexity  



---

<br><br>

## 🧠 Architecture Overview

The game is modularized for maintainability:



### 🔹 gameState.js
Global state object controlling:
- Health
- Score
- Wave
- Player position
- Active enemies



### 🔹 utils.js
Helper functions:
- DOM selector
- Random number generator
- Safe element removal



### 🔹 audio.js
Procedural sound effects:
- Laser shot
- Explosion
- Player damage



### 🔹 ui.js
Controls:
- HUD
- Health bar updates
- Game Over screen
- Wave announcements



### 🔹 enemies.js
Handles:
- Enemy spawning
- Wave generation
- Enemy firing logic



### 🔹 components.js
A-Frame custom components:
- Player movement
- Enemy movement
- Bullet physics
- Collision detection



### 🔹 shooting.js
- Bullet spawning
- Explosion effects
- Muzzle flash



### 🔹 main.js
- Game initialization
- Event listeners
- Pointer lock
- Start / Restart logic



---

<br><br>

## 🥽 VR Support

Built with A-Frame (WebXR ready)

If VR headset is available:

- Enter VR Mode
- Use controller trigger to shoot



---

<br><br>

## 🚀 Future Improvements

- Boss waves
- Power-ups
- Background music
- High score saving (localStorage)
- Shield system
- Multiplayer support



---

<br><br>

## 👨‍🚀 Developed By

**Quantum Vision – Team 12**



---

<br><br>

## ⭐ If You Like This Project

Give it a ⭐ on GitHub!



---
