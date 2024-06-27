document.addEventListener('DOMContentLoaded', () => {
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
        });

        closeButton.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });

        minimizeButton.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });

        maximizeButton.addEventListener('click', () => {
            windowElement.style.width = '100%';
            windowElement.style.height = '100%';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
        });

        makeDraggable(windowElement, header);
    }

    // Show or hide the Start menu
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    startButton.addEventListener('click', () => {
        startMenu.style.display = startMenu.style.display === 'none' || startMenu.style.display === '' ? 'flex' : 'none';
    });

    // Setup windows
   
    handleWindow('me-icon', 'me-window');
    handleWindow('portfolio-icon', 'portfolio-window');
    handleWindow('resume-icon', 'resume-window');
    handleWindow('contact-icon', 'contact-window');
    handleWindow('blog-icon', 'blog-window');
    handleWindow('start-me', 'me-window');
    handleWindow('start-portfolio', 'portfolio-window');
    handleWindow('start-resume', 'resume-window');
    handleWindow('start-contact', 'contact-window');
    handleWindow('start-blog', 'blog-window');

    // Clock functionality
    function updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    const icons = document.querySelectorAll('.icon');
    const taskbarItems = document.getElementById('taskbar-items');

    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            const tabName = this.querySelector('span').textContent.trim();
            toggleTab(tabName);
        });
    });

    function toggleTab(name) {
       
        const existingTab = taskbarItems.querySelector(`.tab[data-tab="${name}"]`);
        if (existingTab) {
           
            existingTab.classList.toggle('active');
        } else {
           
            const tab = document.createElement('div');
            tab.classList.add('tab', 'active');
            tab.setAttribute('data-tab', name);
            tab.textContent = name;
            taskbarItems.appendChild(tab)
        
            tab.addEventListener('click', function() {
                const windowId = name.toLowerCase() + '-window';
                const windowElement = document.getElementById(windowId);
                if (windowElement) {
                    toggleWindow(windowElement);
            }
        });}
    }

    function toggleWindow(windowElement) {
 
        if (windowElement.style.display == 'flex'){
         windowElement.style.display = 'none';}
        else{
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


});