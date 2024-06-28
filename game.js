const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const birdImages = [
    'dino_game/imgs/birdnobg-run-1.png',
    'dino_game/imgs/birdnobg-run-2.png',
    'dino_game/imgs/birdnobg-run-0.png'
];
const bgImg = new Image();
const coinImg = new Image();
bgImg.src = 'images/me.jpg'; // Ensure the path is correct
coinImg.src = 'dino_game/imgs/enemy1.png'; // Ensure the path is correct

let birdFrames = [];
let bird = {
    x: 50,
    y: 150,
    width: 80,
    height: 65,
    gravity: 0.4, // Adjusted value
    lift: -12, // Adjusted value
    velocity: 0,
    frameIndex: 0,
    frameDelay: 7, // Number of game frames to wait before changing the bird frame
    frameCounter: 0 // Counter to keep track of frames
};

let coins = [];
let coinSize = 20;
let frame = 0;
let score = 0;
let gameStarted = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function drawBird() {
    ctx.drawImage(birdFrames[bird.frameIndex], bird.x, bird.y, bird.width, bird.height);
    bird.frameCounter++;
    if (bird.frameCounter >= bird.frameDelay) {
        bird.frameIndex = (bird.frameIndex + 1) % birdFrames.length;
        bird.frameCounter = 0;
    }
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        let coin = coins[i];
        ctx.drawImage(coinImg, coin.x, coin.y, coinSize, coinSize);

        coin.x -= 2; // Move coins to the left

        // Remove coins that have gone off screen
        if (coin.x + coinSize <= 0) {
            coins.splice(i, 1);
            i--;
        }

        // Collision detection with bird
        if (
            bird.x < coin.x + coinSize &&
            bird.x + bird.width > coin.x &&
            bird.y < coin.y + coinSize &&
            bird.y + bird.height > coin.y
        ) {
            coins.splice(i, 1); // Remove collected coin
            i--;
            score++;
        }
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    } else if (bird.y <= 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    coins = [];
    score = 0;
}

function gameLoop() {
    frame++;

    if (frame % 100 === 0) {
        let coinY = Math.random() * (canvas.height - coinSize);
        coins.push({ x: canvas.width, y: coinY });
    }

    drawBackground();
    drawBird();
    drawCoins();
    updateBird();

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);

    requestAnimationFrame(gameLoop);
}

function loadImages() {
    return Promise.all([
        new Promise((resolve, reject) => {
            birdFrames = birdImages.map(src => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
                return img;
            });
        }),
        new Promise((resolve, reject) => {
            bgImg.onload = resolve;
            bgImg.onerror = reject;
        }),
        new Promise((resolve, reject) => {
            coinImg.onload = resolve;
            coinImg.onerror = reject;
        })
    ]);
}

loadImages().then(() => {
    console.log('All images loaded');
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Start', canvas.width / 2 - 80, canvas.height / 2);
}).catch(err => {
    console.error('Error loading images:', err);
});