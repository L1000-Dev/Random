// Setup canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state variables
let score = 0;
let gameOver = false;
let gamePaused = false;
let player;
let enemies = [];
let bullets = [];
let powerUps = [];
let keys = {};
let enemySpeed = 1;
let spawnRate = 0.02;
let gameLoopInterval;

// Player class
class Player {
    constructor() {
        this.width = 50;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 5;
        this.image = new Image();
        this.image.src = "player.png"; // Replace with actual player image URL
        this.health = 3;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
        if (keys["ArrowRight"] && this.x < canvas.width - this.width) this.x += this.speed;
    }

    shoot() {
        let bullet = new Bullet(this.x + this.width / 2, this.y);
        bullets.push(bullet);
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            gameOver = true;
            document.getElementById("game-over").style.display = "block";
            document.getElementById("restart-button").style.display = "block";
        }
    }
}

// Bullet class
class Bullet {
    constructor(x, y) {
        this.width = 5;
        this.height = 20;
        this.x = x - this.width / 2;
        this.y = y;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = "#ff6f61";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

// Enemy class
class Enemy {
    constructor() {
        this.width = 50;
        this.height = 30;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 2 + enemySpeed;
        this.image = new Image();
        this.image.src = "enemy.png"; // Replace with actual enemy image URL
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

// PowerUp class
class PowerUp {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.type = Math.random() < 0.5 ? "speed" : "health";
    }

    draw() {
        ctx.fillStyle = this.type === "speed" ? "#ff9a8b" : "#61ff9a";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += 2;
    }
}

// Handle key inputs
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") {
        player.shoot();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Start the game
function startGame() {
    player = new Player();
    enemies = [];
    bullets = [];
    powerUps = [];
    score = 0;
    gameOver = false;
    gamePaused = false;

    gameLoopInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS game loop
}

// Game Loop
function gameLoop() {
    if (gameOver || gamePaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player and handle movement
    player.draw();
    player.move();

    // Handle bullets
    bullets.forEach((bullet, index) => {
        bullet.draw();
        bullet.update();

        // Remove bullet if out of screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }

        // Check for collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {

                // Destroy enemy and bullet
                enemies.splice(enemyIndex, 1);
                bullets.splice(index, 1);
                score += 10; // Increase score
            }
        });
    });

    // Handle enemies
    if (Math.random() < spawnRate) {
        enemies.push(new Enemy());
    }

    enemies.forEach((enemy, index) => {
        enemy.draw();
        enemy.update();

        // Check for collision with player
        if (enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y) {

            player.takeDamage();
            enemies.splice(index, 1); // Remove enemy
        }

        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Handle power-ups
    if (Math.random() < 0.01) {
        powerUps.push(new PowerUp());
    }

    powerUps.for
