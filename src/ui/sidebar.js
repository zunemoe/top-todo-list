export function setupSidebarToggle() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const icon = hamburgerMenu.querySelector('.material-symbols-outlined');    
    const sidebar = document.getElementById('sidebar');

    console.log('Setting up sidebar toggle');
    console.log('Hamburger menu:', hamburgerMenu);
    console.log('Sidebar:', sidebar);
    
    hamburgerMenu.addEventListener('click', () => {
        console.log('Hamburger menu clicked');
        sidebar.classList.toggle('active');
        icon.classList.add('hide');
        
        setTimeout(() => {
            icon.textContent = sidebar.classList.contains('active') ? 'close' : 'menu';
            icon.classList.remove('hide');
        }, 200);        
    });
}