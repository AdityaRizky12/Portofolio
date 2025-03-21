// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
    }
  
    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or use preferred color scheme
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      document.documentElement.classList.remove('dark');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    
    if (themeToggle && themeIcon) {
      themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        
        // Change icon based on theme
        if (document.documentElement.classList.contains('dark')) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
          localStorage.setItem('theme', 'dark');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  
    // Language toggle
    const languageToggle = document.getElementById('language-toggle');
    const languageToggleMobile = document.getElementById('language-toggle-mobile');
    const languageText = document.getElementById('language-text');
    const languageTextMobile = document.getElementById('language-text-mobile');
    
    // Dictionary for translations
    const translations = {
      en: {
        'home.title': 'Aditya Rizky Ramadhan',
        'home.subtitle': 'Fullstack Developer',
        'home.viewProjects': 'View Projects',
        'home.contactMe': 'Contact Me',
        'about.title': 'About Me',
        'about.description': 'My name is Aditya Rizky Ramadhan. I am a Fullstack Developer with experience in building web applications using various technologies such as JavaScript, PHP, Laravel, Vue, and React. I am always eager to learn new things and create innovative solutions.',
        'about.passion': 'I have a passion for developing user-friendly, responsive, and high-performance web applications. With a focus on outstanding user experience and clean, maintainable code, I strive to create digital products that provide added value.',
        'skills.title': 'Skills',
        'projects.title': 'Projects',
        'projects.pokemon.description': 'Interactive web application about Pokemon with API implementation.',
        'projects.ditmovie.description': 'Web application for searching and reviewing movies using TMDB API.',
        'projects.comingSoon.title': 'Coming Soon',
        'projects.comingSoon.subtitle': 'New exciting project',
        'projects.comingSoon.description': 'New project coming soon. Stay tuned for updates!',
        'projects.comingSoon.status': 'Coming Soon',
        'projects.view': 'View Project',
        'contact.title': 'Contact',
        'contact.info': 'Contact Info',
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.subject': 'Subject',
        'contact.message': 'Message',
        'contact.submit': 'Send Message',
        'footer.rights': 'All rights reserved'
      },
      id: {
        'home.title': 'Aditya Rizky Ramadhan',
        'home.subtitle': 'Fullstack Developer',
        'home.viewProjects': 'Lihat Proyek',
        'home.contactMe': 'Hubungi Saya',
        'about.title': 'Tentang Saya',
        'about.description': 'Nama saya Aditya Rizky Ramadhan. Saya adalah seorang Fullstack Developer dengan pengalaman dalam membangun aplikasi web menggunakan berbagai teknologi seperti JavaScript, PHP, Laravel, Vue, dan React. Saya selalu bersemangat untuk mempelajari hal-hal baru dan menciptakan solusi yang inovatif.',
        'about.passion': 'Saya memiliki passion dalam pengembangan aplikasi web yang user-friendly, responsif, dan berkinerja tinggi. Dengan fokus pada pengalaman pengguna yang luar biasa dan kode bersih yang dapat dirawat, saya berusaha untuk membuat produk digital yang memberikan nilai tambah.',
        'skills.title': 'Keahlian',
        'projects.title': 'Proyek',
        'projects.pokemon.description': 'Aplikasi web interaktif tentang Pokemon dengan implementasi API.',
        'projects.ditmovie.description': 'Aplikasi web untuk pencarian dan review film menggunakan TMDB API.',
        'projects.comingSoon.title': 'Segera Hadir',
        'projects.comingSoon.subtitle': 'Proyek menarik baru',
        'projects.comingSoon.description': 'Proyek baru yang akan datang. Tunggu pembaruan selanjutnya!',
        'projects.comingSoon.status': 'Segera Hadir',
        'projects.view': 'Lihat Proyek',
        'contact.title': 'Kontak',
        'contact.info': 'Informasi Kontak',
        'contact.name': 'Nama',
        'contact.email': 'Email',
        'contact.subject': 'Subjek',
        'contact.message': 'Pesan',
        'contact.submit': 'Kirim Pesan',
        'footer.rights': 'Semua hak dilindungi'
      }
    };
    
    // Check for saved language preference or default to Indonesian
    let currentLang = localStorage.getItem('language') || 'id';
    updateLanguage(currentLang);
    
    // Function to update all text elements with the selected language
    function updateLanguage(lang) {
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });
      
      // Update language toggle text
      if (languageText) languageText.textContent = lang.toUpperCase();
      if (languageTextMobile) languageTextMobile.textContent = lang.toUpperCase();
      
      // Save preference
      localStorage.setItem('language', lang);
      currentLang = lang;
    }
    
    // Add click events for language toggles
    if (languageToggle) {
      languageToggle.addEventListener('click', function() {
        const newLang = currentLang === 'id' ? 'en' : 'id';
        updateLanguage(newLang);
      });
    }
    
    if (languageToggleMobile) {
      languageToggleMobile.addEventListener('click', function() {
        const newLang = currentLang === 'id' ? 'en' : 'id';
        updateLanguage(newLang);
      });
    }
    
    // Initialize skill bars animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = document.querySelectorAll('.skill-progress');
          bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
          observer.unobserve(entry.target);
        }
      });
    });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  });