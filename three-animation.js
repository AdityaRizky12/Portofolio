// ==================== THREE.JS ADVANCED ANIMATION ====================
class ThreeScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.galaxy = null;
    this.homeSpheres = null;
    this.aboutShapes = null;
    this.skillsShapes = null;
    this.projectsShapes = null;
    this.contactShapes = null;
    this.sparkles = null;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentSection = 'home';
    this.scrollY = 0;
    this.targetSection = 'home';
    this.sectionTransition = 0;
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }
  
  init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    // Setup scene with fog for depth
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.0015);
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 30);
    
    // Setup renderer with better settings
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0f172a, 1);
    container.appendChild(this.renderer.domElement);
    
    this.createGalaxy();
    this.createHomeSpheres();
    this.createAboutShapes();
    this.createSkillsShapes();
    this.createProjectsShapes();
    this.createContactShapes();
    this.createSparkles();
    this.createLights();
  }
  
  createGalaxy() {
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 4000;
    
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    
    for (let i = 0; i < galaxyCount; i++) {
      // Spiral galaxy distribution
      const radius = Math.random() * 25;
      const angle = radius * 1.5 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 8;
      
      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;
      
      galaxyPositions[i * 3] = x;
      galaxyPositions[i * 3 + 1] = y;
      galaxyPositions[i * 3 + 2] = z;
      
      // Colors based on position (blue to purple)
      const color = new THREE.Color().setHSL(0.6 + radius * 0.015, 0.9, 0.5 + height * 0.05);
      galaxyColors[i * 3] = color.r;
      galaxyColors[i * 3 + 1] = color.g;
      galaxyColors[i * 3 + 2] = color.b;
    }
    
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    
    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    this.scene.add(this.galaxy);
  }
  
  createHomeSpheres() {
    this.homeSpheres = new THREE.Group();
    const homeSphereCount = 40;
    
    for (let i = 0; i < homeSphereCount; i++) {
      const geometry = new THREE.SphereGeometry(0.25 + Math.random() * 0.3, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${200 + Math.random() * 40}, 90%, 65%)`),
        emissive: new THREE.Color(`hsl(${200 + Math.random() * 40}, 80%, 25%)`),
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      // Random position in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 15 + Math.random() * 10;
      
      sphere.position.x = r * Math.sin(phi) * Math.cos(theta);
      sphere.position.y = r * Math.sin(phi) * Math.sin(theta);
      sphere.position.z = r * Math.cos(phi);
      
      sphere.userData = {
        originalPos: sphere.position.clone(),
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      };
      
      this.homeSpheres.add(sphere);
    }
    this.scene.add(this.homeSpheres);
  }
  
  createAboutShapes() {
    this.aboutShapes = new THREE.Group();
    const aboutCount = 30;
    
    for (let i = 0; i < aboutCount; i++) {
      // Mix of cubes and rectangles (like books/steps)
      const isCube = Math.random() > 0.5;
      let geometry;
      
      if (isCube) {
        geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      } else {
        geometry = new THREE.BoxGeometry(0.6, 0.2, 0.3);
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${210 + Math.random() * 30}, 80%, 60%)`),
        emissive: new THREE.Color(`hsl(${210 + Math.random() * 30}, 70%, 20%)`),
        wireframe: Math.random() > 0.8,
        transparent: true,
        opacity: 0.6
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Position in a ring-like formation
      const angle = (i / aboutCount) * Math.PI * 2;
      const radius = 18;
      const height = Math.sin(angle * 3) * 5;
      
      shape.position.x = Math.cos(angle) * radius;
      shape.position.y = height;
      shape.position.z = Math.sin(angle) * radius;
      
      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      shape.rotation.z = Math.random() * Math.PI;
      
      shape.userData = {
        originalPos: shape.position.clone(),
        speed: 0.2 + Math.random() * 0.3,
        angle: angle,
        radius: radius
      };
      
      this.aboutShapes.add(shape);
    }
    this.scene.add(this.aboutShapes);
  }
  
  createSkillsShapes() {
    this.skillsShapes = new THREE.Group();
    const skillCount = 60;
    
    for (let i = 0; i < skillCount; i++) {
      // Create different shapes for different skills
      let geometry;
      const shapeType = Math.floor(Math.random() * 3);
      
      switch(shapeType) {
        case 0: geometry = new THREE.TorusGeometry(0.25, 0.08, 8, 20); break;
        case 1: geometry = new THREE.ConeGeometry(0.25, 0.5, 8); break;
        case 2: geometry = new THREE.OctahedronGeometry(0.25); break;
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${190 + Math.random() * 50}, 90%, 60%)`),
        emissive: new THREE.Color(`hsl(${190 + Math.random() * 50}, 80%, 20%)`),
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Grid-like formation
      const cols = 8;
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const spacing = 4;
      const centerX = (cols - 1) * spacing / 2;
      
      shape.position.x = (col * spacing) - centerX;
      shape.position.y = Math.sin(i) * 3;
      shape.position.z = row * spacing - 10;
      
      shape.userData = {
        originalY: shape.position.y,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      };
      
      this.skillsShapes.add(shape);
    }
    this.scene.add(this.skillsShapes);
  }
  
  createProjectsShapes() {
    this.projectsShapes = new THREE.Group();
    const projectCount = 27; // 3x9 grid for 9 projects
    
    for (let i = 0; i < projectCount; i++) {
      const geometry = new THREE.BoxGeometry(1.2, 0.8, 0.2);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${210 + (i % 3) * 20}, 80%, 60%)`),
        emissive: new THREE.Color(`hsl(${210 + (i % 3) * 20}, 70%, 20%)`),
        transparent: true,
        opacity: 0.5
      });
      
      const card = new THREE.Mesh(geometry, material);
      
      // 3x9 grid
      const rows = 3;
      const cols = 9;
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const spacingX = 3.5;
      const spacingZ = 3;
      const centerX = (cols - 1) * spacingX / 2;
      const centerZ = (rows - 1) * spacingZ / 2;
      
      card.position.x = (col * spacingX) - centerX;
      card.position.y = Math.sin(i) * 2;
      card.position.z = (row * spacingZ) - centerZ - 5;
      
      card.rotation.y = Math.PI / 4;
      card.rotation.x = Math.PI / 6;
      
      card.userData = {
        originalPos: card.position.clone(),
        originalRot: card.rotation.clone(),
        speed: 0.3 + Math.random() * 0.3
      };
      
      this.projectsShapes.add(card);
    }
    this.scene.add(this.projectsShapes);
  }
  
  createContactShapes() {
    this.contactShapes = new THREE.Group();
    
    // Create nodes
    const nodeCount = 20;
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.2, 8, 8);
      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1e3a8a,
        transparent: true,
        opacity: 0.8
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 12;
      
      sphere.position.x = Math.cos(angle) * radius;
      sphere.position.y = Math.sin(angle) * 3;
      sphere.position.z = Math.sin(angle) * radius;
      
      nodes.push(sphere);
      this.contactShapes.add(sphere);
    }
    
    // Create connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) { // Only create some connections
          const points = [
            nodes[i].position.clone(),
            nodes[j].position.clone()
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.2
          });
          
          const line = new THREE.Line(geometry, material);
          this.contactShapes.add(line);
        }
      }
    }
    
    this.scene.add(this.contactShapes);
  }
  
  createSparkles() {
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 2000;
    
    const sparklePositions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 80;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    
    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x88ccff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    
    this.sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    this.scene.add(this.sparkles);
  }
  
  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404060);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 50);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x60a5fa, 0.8, 50);
    pointLight2.position.set(-5, -5, -5);
    this.scene.add(pointLight2);
  }
  
  setupEventListeners() {
    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      for (let i = 0; i < sectionElements.length; i++) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
            this.targetSection = sections[i];
            break;
          }
        }
      }
    });
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Smooth section transition
    this.sectionTransition += (this.targetSection !== this.currentSection ? 0.02 : -0.02);
    this.sectionTransition = Math.max(0, Math.min(1, this.sectionTransition));
    
    if (this.sectionTransition >= 0.99) {
      this.currentSection = this.targetSection;
    }
    
    // Rotate galaxy base
    if (this.galaxy) {
      this.galaxy.rotation.y += 0.0002;
      this.galaxy.rotation.x += 0.0001;
    }
    
    // Animate home spheres (floating)
    if (this.homeSpheres) {
      this.homeSpheres.children.forEach((sphere) => {
        sphere.position.x = sphere.userData.originalPos.x + Math.sin(Date.now() * 0.001 + sphere.userData.offset) * 2;
        sphere.position.y = sphere.userData.originalPos.y + Math.cos(Date.now() * 0.001 + sphere.userData.offset) * 2;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.02;
      });
    }
    
    // Animate about shapes (rotating ring)
    if (this.aboutShapes) {
      this.aboutShapes.rotation.y += 0.001;
      this.aboutShapes.children.forEach((shape) => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
      });
    }
    
    // Animate skills shapes (floating grid)
    if (this.skillsShapes) {
      this.skillsShapes.children.forEach((shape) => {
        shape.position.y = shape.userData.originalY + Math.sin(Date.now() * 0.002 + shape.userData.offset) * 1.5;
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.02;
      });
    }
    
    // Animate projects shapes (floating cards)
    if (this.projectsShapes) {
      this.projectsShapes.children.forEach((shape) => {
        shape.position.y = shape.userData.originalPos.y + Math.sin(Date.now() * 0.001) * 1;
        shape.rotation.z = shape.userData.originalRot.z + Math.sin(Date.now() * 0.001) * 0.2;
      });
    }
    
    // Animate contact shapes (pulsing nodes)
    if (this.contactShapes) {
      this.contactShapes.children.forEach((shape, index) => {
        if (shape.geometry && shape.geometry.type === 'SphereGeometry') {
          const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.3;
          shape.scale.set(scale, scale, scale);
        }
      });
    }
    
    // Calculate intensities based on current section
    const homeIntensity = this.currentSection === 'home' ? 1 : (1 - this.sectionTransition);
    const aboutIntensity = this.currentSection === 'about' ? 1 : (this.currentSection === 'home' ? this.sectionTransition : (this.currentSection === 'skills' ? 1 - this.sectionTransition : 0));
    const skillsIntensity = this.currentSection === 'skills' ? 1 : (this.currentSection === 'about' ? this.sectionTransition : (this.currentSection === 'projects' ? 1 - this.sectionTransition : 0));
    const projectsIntensity = this.currentSection === 'projects' ? 1 : (this.currentSection === 'skills' ? this.sectionTransition : (this.currentSection === 'contact' ? 1 - this.sectionTransition : 0));
    const contactIntensity = this.currentSection === 'contact' ? 1 : (this.currentSection === 'projects' ? this.sectionTransition : 0);
    
    // Apply intensities to different groups
    if (this.homeSpheres) {
      this.homeSpheres.children.forEach(child => child.material.opacity = 0.7 * homeIntensity);
    }
    if (this.aboutShapes) {
      this.aboutShapes.children.forEach(child => child.material.opacity = 0.6 * aboutIntensity);
    }
    if (this.skillsShapes) {
      this.skillsShapes.children.forEach(child => child.material.opacity = 0.7 * skillsIntensity);
    }
    if (this.projectsShapes) {
      this.projectsShapes.children.forEach(child => child.material.opacity = 0.5 * projectsIntensity);
    }
    if (this.contactShapes) {
      this.contactShapes.children.forEach(child => {
        if (child.material) child.material.opacity = 0.8 * contactIntensity;
      });
    }
    
    // Parallax effect
    const targetX = this.mouseX * 3;
    const targetY = this.mouseY * 3;
    
    if (this.galaxy) {
      this.galaxy.position.x += (targetX - this.galaxy.position.x) * 0.01;
      this.galaxy.position.y += (targetY - this.galaxy.position.y) * 0.01;
    }
    
    if (this.homeSpheres) {
      this.homeSpheres.position.x += (targetX * 0.7 - this.homeSpheres.position.x) * 0.01;
      this.homeSpheres.position.y += (targetY * 0.7 - this.homeSpheres.position.y) * 0.01;
    }
    
    if (this.aboutShapes) {
      this.aboutShapes.position.x += (targetX * 0.5 - this.aboutShapes.position.x) * 0.01;
      this.aboutShapes.position.y += (targetY * 0.5 - this.aboutShapes.position.y) * 0.01;
    }
    
    if (this.skillsShapes) {
      this.skillsShapes.position.x += (targetX * 0.4 - this.skillsShapes.position.x) * 0.01;
      this.skillsShapes.position.y += (targetY * 0.4 - this.skillsShapes.position.y) * 0.01;
    }
    
    if (this.projectsShapes) {
      this.projectsShapes.position.x += (targetX * 0.3 - this.projectsShapes.position.x) * 0.01;
      this.projectsShapes.position.y += (targetY * 0.3 - this.projectsShapes.position.y) * 0.01;
    }
    
    if (this.contactShapes) {
      this.contactShapes.position.x += (targetX * 0.2 - this.contactShapes.position.x) * 0.01;
      this.contactShapes.position.y += (targetY * 0.2 - this.contactShapes.position.y) * 0.01;
    }
    
    // Rotate sparkles
    if (this.sparkles) {
      this.sparkles.rotation.y += 0.0002;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Inisialisasi Three.js setelah halaman dimuat
let threeScene = null;