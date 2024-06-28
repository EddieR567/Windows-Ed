
document.addEventListener('DOMContentLoaded', () => {
    let maximized = false; // Track the maximized state
    let worldVisible = false; // Track the visibility of the world section

    const startButton = document.getElementById("start-button");
    const worldSection = document.getElementById("world");
    const startMenu = document.getElementById('start-menu');
    const taskbarItems = document.getElementById('taskbar-items');
    const targetScore = 10;

    // Initially hide the world section
    worldSection.style.display = "none";

    // Add click event listener to the Start button
    startButton.addEventListener("click", () => {
        if (!worldVisible) {
            // Show the world section
            worldSection.style.display = "block";
            resizeCanvas();
            worldVisible = true;
            // Toggle Start menu visibility
            startMenu.classList.toggle('show');

            // Start the game if it hasn't already started
            if (!gameStarted) {
                resetGame();
                gameStarted = true;
                gameLoop();
            }
        } else {
            // Hide the world section
            worldSection.style.display = "none";
            worldVisible = false;
        }
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight/2;
    }








    // Helper function to make elements draggable
    function makeDraggable(element, header) {
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // Function to handle showing and hiding windows
    function handleWindow(iconId, windowId) {
        const icon = document.getElementById(iconId);
        const windowElement = document.getElementById(windowId);
        const closeButton = windowElement.querySelector('.close-button');
        const minimizeButton = windowElement.querySelector('.minimize-button');
        const maximizeButton = windowElement.querySelector('.maximize-button');
        const header = windowElement.querySelector('.window-header');

        icon.addEventListener('click', () => {
            windowElement.style.display = 'flex';
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Calculate dimensions
            const windowWidth = screenWidth * 0.8; // 80% of the screen width
            const windowHeight = screenHeight * 0.8; // 80% of the screen height

            // Set styles
            windowElement.style.width = `${windowWidth}px`;
            windowElement.style.height = `${windowHeight}px`;
            windowElement.style.top = `${(screenHeight - windowHeight) / 2}px`; // Center vertically
            windowElement.style.left = `${(screenWidth - windowWidth) / 2}px`; // Center horizontally

            // Reset maximized state on window open
            if (maximized) {
                maximizeButton.click(); // Simulate click to restore size
            }

            const tabName = icon.querySelector('span').textContent.trim();
            toggleTab(tabName);
        });

        closeButton.addEventListener('click', () => {
            windowElement.style.display = 'none'; // Hide the window

            // Get the tab name associated with the current window
            const tabName = windowElement.querySelector('span').textContent.trim();

            // Find the corresponding tab in the taskbar
            const existingTab = taskbarItems.querySelector(`.tab[data-tab="${tabName}"]`);
            if (existingTab) {
                existingTab.remove(); // Remove the tab from the taskbar
            }
        });

        minimizeButton.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });

        maximizeButton.addEventListener('click', () => {
            if (maximized) {
                // If window is already maximized, restore to original size
                windowElement.style.width = ''; // Reset to CSS defined width
                windowElement.style.height = ''; // Reset to CSS defined height
                windowElement.style.top = ''; // Reset to CSS defined top position
                windowElement.style.left = ''; // Reset to CSS defined left position
                maximized = false;
            } else {
                // Maximize to 100% size
                windowElement.style.width = '100%';
                windowElement.style.height = '100%';
                windowElement.style.top = '0';
                windowElement.style.left = '0';
                maximized = true;
            }
        });

        makeDraggable(windowElement, header);
    }

    // Show or hide the Start menu
   

    startButton.addEventListener('click', () => {
        startMenu.style.display = startMenu.style.display === 'none' || startMenu.style.display === '' ? 'flex' : 'none';
    });

    // Setup windows
    handleWindow('about-me-icon', 'about-me-window');
    handleWindow('portfolio-icon', 'portfolio-window');
    handleWindow('resume-icon', 'resume-window');
    handleWindow('start-about-me', 'about-me-window');
    handleWindow('start-portfolio', 'portfolio-window');
    handleWindow('start-resume', 'resume-window');

    // Clock functionality
    function updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    const icons = document.querySelectorAll('.icon');


    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            const tabName = this.querySelector('span').textContent.trim();
            toggleTab(tabName);
        });
    });

    const startMenuItems = document.querySelectorAll('.start-menu-item');

    startMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.textContent.trim();
            const windowId = `${tabName.toLowerCase().replace(' ', '-')}-window`;
            const windowElement = document.getElementById(windowId);
            if (windowElement) {
                windowElement.style.display = 'flex';
                toggleTab(tabName);
            }
        });
    });

    function toggleTab(name) {
        const existingTab = taskbarItems.querySelector(`.tab[data-tab="${name}"]`);
        if (name != 'Email') {
            if (existingTab) {
                existingTab.classList.toggle('active');
            } else {
                const tab = document.createElement('div');
                tab.classList.add('tab', 'active');
                tab.setAttribute('data-tab', name);
                tab.textContent = name;
                taskbarItems.appendChild(tab);

                tab.addEventListener('click', function() {
                    const windowId = name.toLowerCase().replace(' ', '-') + '-window';
                    const windowElement = document.getElementById(windowId);
                    if (windowElement) {
                        toggleWindow(windowElement);
                    }
                });
            }}
    }

    function toggleWindow(windowElement) {
        if (windowElement.style.display === 'flex') {
            windowElement.style.display = 'none';
        } else {
            windowElement.style.display = 'flex';
        }

        const allWindows = document.querySelectorAll('.window');
        allWindows.forEach(win => {
            if (win !== windowElement) {
                win.classList.remove('active-window');
            }
        });
    }


    startButton.addEventListener('click', function() {
        startMenu.classList.toggle('show');
    });


    const emailIcon = document.getElementById('email-icon');

    emailIcon.addEventListener('click', function() {
        const email = 'eddieranyard@gmail.com';
        const subject = ''; 
        const body = ''; 

        
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        
        window.open(mailtoUrl);
    });



    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const birdImages = [
        'dino_game/imgs/birdnobg-run-1.png',
        'dino_game/imgs/birdnobg-run-2.png',
        'dino_game/imgs/birdnobg-run-0.png'
    ];
    const bgImg = new Image();
    const coinImg = new Image();

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

                bird.velocity = bird.lift;
            
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

            coin.x -= 4; // Move coins to the left

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
        if (score >= targetScore) {
            endGame();
            return; 
        }

        if (frame % 100 === 0) {
            let coinY = Math.random() * (canvas.height - coinSize);
            coins.push({ x: canvas.width, y: coinY });
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBird();
        drawCoins();
        updateBird();

        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
      
        ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);

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

    function endGame() {
        gameStarted = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '40px Arial';
        ctx.fillText(`You Win! Score: ${score}`, canvas.width / 2 - 150, canvas.height / 2);

        setTimeout(() => {
            worldSection.style.display = 'none';
            worldVisible = false;
        }, 2000);
    }


    
});