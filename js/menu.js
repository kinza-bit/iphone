export function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    const isOpen = !menu.classList.contains('translate-x-full');
    
    if (!isOpen) {
        menu.classList.remove('translate-x-full');
        toggle.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.add('translate-x-full');
        toggle.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
}

export function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    const icon = document.getElementById('mobileThemeIcon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}
