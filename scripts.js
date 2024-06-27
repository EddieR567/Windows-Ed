import { updateGround, setupGround } from "./dino_game/ground.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino_game/dino.js"
import { updateCactus, setupCactus, getCactusRects } from "./dino_game/cactus.js"

document.addEventListener('DOMContentLoaded', () => {
    let maximized = false; // Track the maximized state
    let worldVisible = false; // Track the visibility of the world section

    const startButton = document.getElementById("start-button");
    const worldSection = document.getElementById("world");
    const startMenu = document.getElementById('start-menu');
    const taskbarItems = document.getElementById('taskbar-items');

    // Initially hide the world section
    worldSection.style.display = "none";

    // Add click event listener to the Start button
    startButton.addEventListener("click", () => {
        if (!worldVisible) {
            // Show the world section
            worldSection.style.display = "block";
            worldVisible = true;
            // Toggle Start menu visibility
            startMenu.classList.toggle('show');
        } else {
            // Hide the world section
            worldSection.style.display = "none";
            worldVisible = false;
        }
    });


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



const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime
let speedScale
let score
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateCactus(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  score += delta * 0.01
  scoreElem.textContent = Math.floor(score)
}

function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0

  setupDino()
  setupCactus()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}

function handleLose() {
  setDinoLose()
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 100)
}

function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}

});