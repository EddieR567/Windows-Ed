document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startMenu = document.createElement('div');
    
    startMenu.id = 'start-menu';
    startMenu.style.position = 'absolute';
    startMenu.style.bottom = '40px';
    startMenu.style.left = '0';
    startMenu.style.width = '200px';
    startMenu.style.background = 'white';
    startMenu.style.border = '1px solid #ccc';
    startMenu.style.display = 'none';
    startMenu.innerHTML = `
        <ul>
            <li>Programs</li>
            <li>Documents</li>
            <li>Settings</li>
            <li>Search</li>
            <li>Help</li>
            <li>Run...</li>
        </ul>
    `;
    
    document.body.appendChild(startMenu);
    
    startButton.addEventListener('click', () => {
        startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
    });
});