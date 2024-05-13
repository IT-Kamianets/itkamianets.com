window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.getElementById("scrollToTopBtn").style.display = "none"; // Приховуємо кнопку після натискання
}

let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Прокрутка вниз
        document.querySelector('.header').style.transition = "top 0.3s ease-in-out"; // Додаємо плавний перехід
        document.querySelector('.header').style.top = "-100px"; // Ховаємо хедер при прокрутці вниз
    } else {
        // Прокрутка вверх
        document.querySelector('.header').style.transition = "top 0.3s ease-in-out"; // Додаємо плавний перехід
        document.querySelector('.header').style.top = "0"; // Показуємо хедер при прокрутці вверх
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Для мобільних пристроїв
}, false);

// Отримуємо всі елементи розділів, які мають бути анімовані
const sections = document.querySelectorAll('.section1-content, .section2-content, .Contact-content');

// Функція для перевірки, чи елемент перевищив середину вікна
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight / 1.2) &&
        rect.bottom >= (window.innerHeight / 2)
    );
}

// Функція, яка встановлює клас .visible для розділів, які перевищили середину вікна
function toggleVisibility() {
    sections.forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Викликаємо функцію при завантаженні сторінки та при прокрутці
window.addEventListener('load', toggleVisibility);
window.addEventListener('scroll', toggleVisibility);

