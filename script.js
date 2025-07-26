const translations = {
    en: {
        preloaderText: "⚡ Entering the Kaneki Staff universe...",
        contact: "Contact",
        invite: "Invite",
        kanekiChannel: "Kaneki Channel",
        mikuChannel: "Miku Channel",
        github: "Visit my GitHub",
        visits: "Visits",
        likes: "Likes",
        didYouLike: "Did you like this page?",
        yes: "Yes",
        no: "No",
        voteThanks: "Thanks for your positive vote! 🥳",
        voteImprove: "We'll try to improve! 💪",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        rights: "All rights reserved."
    },
    es: {
        preloaderText: "⚡ Entrando al universo Kaneki Staff...",
        contact: "Contactar",
        invite: "Invitar",
        kanekiChannel: "Kaneki Canal",
        mikuChannel: "Miku Canal",
        github: "Visita mi GitHub",
        visits: "Visitas",
        likes: "Me gusta",
        didYouLike: "¿Te gustó esta página?",
        yes: "Sí",
        no: "No",
        voteThanks: "¡Gracias por tu voto positivo! 🥳",
        voteImprove: "¡Intentaremos mejorar! 💪",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
        rights: "Todos los derechos reservados."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initCountersAndPreferences();
    setInterval(updateDateTime, 1000);
});

function initPreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        preloader.addEventListener('transitionend', () => {
            preloader.classList.add('fade-out-complete');
            preloader.remove();
        }, { once: true });
        document.getElementById('mainContent').style.display = 'flex';
    }, 1500);
}

function initParticles() {
    particlesJS("particles-js", {
        particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: ["#00ffe1", "#ff0059", "#ffffff"] }, shape: { type: "circle" }, opacity: { value: 0.6, random: true }, size: { value: 4, random: true }, line_linked: { enable: true, distance: 150, color: "#00ffe1", opacity: 0.3, width: 1 }, move: { enable: true, speed: 2 } },
        interactivity: { events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } }, modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } } },
        retina_detect: true
    });
}

function initCountersAndPreferences() {
    if (localStorage.getItem('kaneki_hasVisited') !== 'true') {
        let visitCount = parseInt(localStorage.getItem('kaneki_visits') || 0);
        visitCount++;
        localStorage.setItem('kaneki_visits', visitCount);
        localStorage.setItem('kaneki_hasVisited', 'true');
    }

    const finalVisitCount = parseInt(localStorage.getItem('kaneki_visits') || 0);
    const finalLikeCount = parseInt(localStorage.getItem('kaneki_likes') || 0);
    
    animateCounter(document.getElementById('visitorCount'), finalVisitCount, 1000);
    animateCounter(document.getElementById('likeCount'), finalLikeCount, 1000);

    if (localStorage.getItem('kaneki_hasLiked') === 'true') {
        document.querySelector('.ninja-btn').classList.add('disabled');
    }
    
    const savedLang = localStorage.getItem('kaneki_lang') || 'es';
    document.getElementById('langSelect').value = savedLang;
    
    const savedDarkMode = localStorage.getItem('kaneki_darkMode') === 'true';
    document.getElementById('darkSwitch').checked = savedDarkMode;

    switchLang(true);
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = Math.ceil(target / (duration / 20));
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 20);
    if (target === 0) element.textContent = 0;
}

function handleFloatingButtonClick(e) {
    const likeButton = e.currentTarget;
    if (localStorage.getItem('kaneki_hasLiked') === 'true') {
        return;
    }

    localStorage.setItem('kaneki_hasLiked', 'true');
    likeButton.classList.add('disabled');

    let likes = parseInt(localStorage.getItem('kaneki_likes') || 0);
    likes++;
    localStorage.setItem('kaneki_likes', likes);
    
    const likeCountElement = document.getElementById('likeCount');
    likeCountElement.textContent = (likes - 1 >= 0) ? (likes - 1) : 0;
    animateCounter(likeCountElement, likes, 500);

    const star = document.getElementById('star');
    star.style.left = `${e.clientX - 15}px`;
    star.style.top = `${e.clientY - 30}px`;
    star.style.opacity = 1;
    star.style.transform = 'translateY(-60px) scale(1.5)';
    setTimeout(() => { star.style.opacity = 0; star.style.transform = 'translateY(0) scale(1)'; }, 800);
}

function updateDateTime() {
  const lang = document.getElementById('langSelect').value;
  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
  document.getElementById('dateTime').textContent = now.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', options);
}

function vote(option) {
  const result = document.getElementById('voteResult');
  const lang = document.getElementById('langSelect').value;
  if (option === 'yes') { result.innerHTML = translations[lang].voteThanks; result.style.color = '#00ffe1'; }
  else { result.innerHTML = translations[lang].voteImprove; result.style.color = '#ff0059'; }
  document.querySelectorAll('.vote-box button').forEach(button => button.disabled = true);
}

function switchLang(isInitialLoad = false) {
    const lang = document.getElementById('langSelect').value;
    localStorage.setItem('kaneki_lang', lang);
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) { elem.textContent = translations[lang][key]; }
    });
    updateDateTime();
    
    if (!isInitialLoad || localStorage.getItem('kaneki_darkMode') !== null) {
        toggleDarkMode();
    }
}

function toggleDarkMode() {
  const isChecked = document.getElementById('darkSwitch').checked;
  document.body.classList.toggle('dark-mode', isChecked);
  
  const lang = document.getElementById('langSelect').value;
  document.getElementById('darkLabel').textContent = isChecked ? translations[lang].darkMode : translations[lang].lightMode;
  
  localStorage.setItem('kaneki_darkMode', isChecked);
}

function playClick() {
  console.log("Botón clickeado");
}