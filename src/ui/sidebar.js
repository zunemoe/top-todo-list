export function setupSidebarToggle() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    console.log('Setting up sidebar toggle');
    console.log('Hamburger menu:', hamburgerMenu);
    console.log('Sidebar:', sidebar);
    
    hamburgerMenu.addEventListener('click', () => {
        console.log('Hamburger menu clicked');
        sidebar.classList.toggle('active');
    });
}