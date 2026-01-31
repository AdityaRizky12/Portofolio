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
  
  // Dictionary for translations with new keys
  const translations = {
    en: {
      'home.title': 'Aditya Rizky Ramadhan',
      'home.subtitle': 'Fullstack Developer',
      'home.viewProjects': 'View Projects',
      'home.contactMe': 'Contact Me',
      'home.downloadCV': 'Download CV',
      'about.title': 'About Me',
      'about.description': 'My name is Aditya Rizky Ramadhan. I am a Fullstack Developer with experience in building web applications using various technologies such as JavaScript, PHP, Laravel, Vue, and React. I am always eager to learn new things and create innovative solutions.',
      'about.passion': 'I have a passion for developing user-friendly, responsive, and high-performance web applications. With a focus on outstanding user experience and clean, maintainable code, I strive to create digital products that provide added value.',
      'about.downloadCV': 'Download CV',
      'history.title': 'My History',
      'history.education': 'Education',
      'history.smk.title': 'SMKN 36 Jakarta',
      'history.smk.major': 'Light Vehicle Engineering',
      'history.smk.year': '2018 - 2021',
      'history.smk.description': 'Graduate of Light Vehicle Engineering with focus on motor vehicle systems, basic mechanics, and vehicle maintenance.',
      'history.bootcamp.title': 'Fullstack Developer Bootcamp',
      'history.bootcamp.program': 'Senin Fullstack Developer',
      'history.bootcamp.year': '2024 - Present',
      'history.bootcamp.description': 'Intensive bootcamp focusing on fullstack web application development using JavaScript, React, Node.js, and modern databases.',
      'history.journey': 'Career Journey',
      'history.transition.title': 'Transition to Tech',
      'history.transition.period': '2022 - 2023',
      'history.transition.description': 'After graduating from vocational school, I started learning programming independently through online platforms like FreeCodeCamp, YouTube, and official documentation.',
      'history.firstproject.title': 'First Web Projects',
      'history.firstproject.period': '2023 - 2024',
      'history.firstproject.description': 'Built first web projects using HTML, CSS, JavaScript, and started learning frameworks like React and Laravel.',
      'history.bootcampjourney.title': 'Bootcamp & Professional Growth',
      'history.bootcampjourney.period': '2024 - Present',
      'history.bootcampjourney.description': 'Participated in bootcamp to deepen fullstack development knowledge, build solid portfolio, and prepare for professional career in tech.',
      'history.motivation': '"My mechanical engineering background gave me strong problem-solving abilities, which I now apply in software development to create efficient and effective solutions."',
      'skills.title': 'Skills',
      'projects.title': 'Projects',
      'projects.pokemon.description': 'Interactive web application about Pokemon with API implementation.',
      'projects.ditmovie.description': 'Web application for searching and reviewing movies using TMDB API.',
      'projects.agecalc.description': 'Age calculator that calculates age based on date of birth with attractive display.',
      'projects.blog.description': 'Simple blog with React that has CRUD features for article posts.',
      'projects.videos.description': 'Learning video platform with React Vite and modern UI using Tailwind CSS and Daisy UI.',
      'projects.todo.description': 'Todo list application with complete CRUD features, filtering, and local storage.',
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
      'home.downloadCV': 'Unduh CV',
      'about.title': 'Tentang Saya',
      'about.description': 'Nama saya Aditya Rizky Ramadhan. Saya adalah seorang Fullstack Developer dengan pengalaman dalam membangun aplikasi web menggunakan berbagai teknologi seperti JavaScript, PHP, Laravel, Vue, dan React. Saya selalu bersemangat untuk mempelajari hal-hal baru dan menciptakan solusi yang inovatif.',
      'about.passion': 'Saya memiliki passion dalam pengembangan aplikasi web yang user-friendly, responsif, dan berkinerja tinggi. Dengan fokus pada pengalaman pengguna yang luar biasa dan kode bersih yang dapat dirawat, saya berusaha untuk membuat produk digital yang memberikan nilai tambah.',
      'about.downloadCV': 'Unduh CV',
      'history.title': 'Riwayat Saya',
      'history.education': 'Pendidikan',
      'history.smk.title': 'SMKN 36 Jakarta',
      'history.smk.major': 'Teknik Kendaraan Ringan',
      'history.smk.year': '2018 - 2021',
      'history.smk.description': 'Lulusan Teknik Kendaraan Ringan dengan fokus pada sistem kendaraan bermotor, mekanik dasar, dan perawatan kendaraan.',
      'history.bootcamp.title': 'Bootcamp Fullstack Developer',
      'history.bootcamp.program': 'Senin Fullstack Developer',
      'history.bootcamp.year': '2024 - Sekarang',
      'history.bootcamp.description': 'Bootcamp intensif yang berfokus pada pengembangan aplikasi web fullstack menggunakan JavaScript, React, Node.js, dan database modern.',
      'history.journey': 'Perjalanan Karir',
      'history.transition.title': 'Transisi ke Teknologi',
      'history.transition.period': '2022 - 2023',
      'history.transition.description': 'Setelah lulus SMK, saya mulai belajar pemrograman secara otodidak melalui platform online seperti FreeCodeCamp, YouTube, dan dokumentasi resmi.',
      'history.firstproject.title': 'Proyek Web Pertama',
      'history.firstproject.period': '2023 - 2024',
      'history.firstproject.description': 'Membangun proyek-proyek web pertama menggunakan HTML, CSS, JavaScript, dan mulai mempelajari framework seperti React dan Laravel.',
      'history.bootcampjourney.title': 'Bootcamp & Pertumbuhan Profesional',
      'history.bootcampjourney.period': '2024 - Sekarang',
      'history.bootcampjourney.description': 'Mengikuti bootcamp untuk memperdalam pengetahuan fullstack development, membangun portofolio yang solid, dan mempersiapkan karir profesional di dunia teknologi.',
      'history.motivation': '"Latar belakang teknik kendaraan memberikan saya kemampuan problem-solving yang kuat, yang sekarang saya terapkan dalam pengembangan software untuk menciptakan solusi yang efisien dan efektif."',
      'skills.title': 'Keahlian',
      'projects.title': 'Proyek',
      'projects.pokemon.description': 'Aplikasi web interaktif tentang Pokemon dengan implementasi API.',
      'projects.ditmovie.description': 'Aplikasi web untuk pencarian dan review film menggunakan TMDB API.',
      'projects.agecalc.description': 'Kalkulator umur yang menghitung usia berdasarkan tanggal lahir dengan tampilan yang menarik.',
      'projects.blog.description': 'Blog sederhana dengan React yang memiliki fitur CRUD untuk postingan artikel.',
      'projects.videos.description': 'Platform video pembelajaran dengan React Vite dan UI yang modern menggunakan Tailwind CSS dan Daisy UI.',
      'projects.todo.description': 'Aplikasi daftar tugas dengan fitur CRUD lengkap, filter, dan penyimpanan lokal.',
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
  
  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Simple validation
      if (!name || !email || !subject || !message) {
        alert(currentLang === 'id' ? 'Harap isi semua field!' : 'Please fill in all fields!');
        return;
      }
      
      // In a real application, you would send this data to a server
      // For now, we'll just show a success message
      alert(currentLang === 'id' 
        ? `Terima kasih ${name}! Pesan Anda telah dikirim. Saya akan membalas ke ${email} segera.`
        : `Thank you ${name}! Your message has been sent. I will reply to ${email} soon.`
      );
      
      // Reset form
      contactForm.reset();
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
  
  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll('#mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
    });
  });
});