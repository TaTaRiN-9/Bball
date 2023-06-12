let hamburger = document.querySelector('.hamburger');
let navLinks = document.getElementById('nav-links');
let links = document.querySelectorAll('.links');

// Показываем ссылки при нажатии на 3 полоски
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('hide');
    hamburger.classList.toggle('lines-rotate');
})

// Прячем ссылки при нажатии на любую ссылку
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', () => {
        navLinks.classList.toggle('hide');
    })
}