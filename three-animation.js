// ==================== THREE.JS MODERN CYBERNETIC SPACE & BATTLE ANIMATION ====================
// 1. Cybernetic Holographic Particle Planet (Dot lattice, Day/Night Terminator, Fresnel Halo, Star Dust Particle Rings)
// 2. Anti-Clipping Space Battle (UFO Alien Saucer vs Sci-Fi Fighter with Velocity-Aligned lookAt)
// 3. Directional Laser Dogfight & Particle Hit Sparks

class ThreeScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Cosmic Scene Elements
    this.galaxy = null;
    this.sparkles = null;
    this.planetGroup = null;
    this.planetMesh = null;
    this.planetDots = null;
    this.planetHoloRings = null;
    this.planetAtmosphere = null;
    this.planetParticleRing = null;
    this.moons = [];
    this.meteors = [];
    
    // Space Battle: UFO & Fighter
    this.battleGroup = null;
    this.ufoGroup = null;
    this.ufoRingLights = null;
    this.ufoShield = null;
    
    this.fighterGroup = null;
    this.fighterThrusters = [];
    this.fighterShield = null;
    this.prevFighterPos = new THREE.Vector3();
    
    this.lasers = [];
    this.hitSparks = [];
    
    // Combat timers
    this.battleTime = 0;
    this.fighterFireTimer = 1.0;
    this.ufoFireTimer = 2.2;
    
    // Section Accent Shapes (subtle dark glassmorphism depth)
    this.aboutShapes = null;
    this.skillsShapes = null;
    this.projectsShapes = null;
    this.contactShapes = null;
    
    // Smooth mouse parallax damping
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.currentSection = 'home';
    this.scrollY = 0;
    this.targetSection = 'home';
    this.sectionTransition = 0;
    this.isMobile = window.innerWidth < 1024;
    this.isVisible = true;
    
    // Unified palette: Electric Blue, Cyan, Slate Indigo
    this.palette = [
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x6366f1),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0x38bdf8)
    ];
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }
  
  init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0018);
    
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 30);
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: !this.isMobile, 
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setClearColor(0x0a0f1d, 1);
    container.appendChild(this.renderer.domElement);
    
    // Build Cosmic Elements
    this.createGalaxy();
    this.createSparkles();
    this.createCosmicPlanet();
    this.createMeteors();
    this.createSpaceBattle();
    
    // Section Accents
    this.createAboutShapes();
    this.createSkillsShapes();
    this.createProjectsShapes();
    this.createContactShapes();
    
    this.createLights();
  }
  
  // 1. Cybernetic Holographic Particle Planet with Day/Night Terminator & Star Dust Rings
  createCosmicPlanet() {
    this.planetGroup = new THREE.Group();
    
    // 25% smaller radius for perfect visual balance (radius 3.1 desktop, 2.2 mobile)
    const radius = this.isMobile ? 2.2 : 3.1;
    
    // A. Deep Core with Day/Night Terminator & Atmospheric Rim Lighting Shader
    const coreGeo = new THREE.SphereGeometry(radius, 36, 36);
    const coreVertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const coreFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Directional sunlight from upper-right
        vec3 sunDir = normalize(vec3(0.85, 0.65, 0.5));
        float sunLight = max(dot(normal, sunDir), 0.0);
        
        vec3 nightColor = vec3(0.02, 0.05, 0.12);
        vec3 dayColor = vec3(0.06, 0.22, 0.52);
        vec3 base = mix(nightColor, dayColor, pow(sunLight, 1.2));
        
        // Atmosphere Fresnel rim glow
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        fresnel = pow(fresnel, 2.6);
        vec3 rimColor = mix(vec3(0.08, 0.82, 0.95), vec3(0.38, 0.55, 1.0), fresnel);
        
        gl_FragColor = vec4(base + rimColor * (fresnel * 0.9), 0.92);
      }
    `;
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      transparent: true,
      side: THREE.FrontSide
    });
    this.planetMesh = new THREE.Mesh(coreGeo, coreMat);
    this.planetGroup.add(this.planetMesh);
    
    // B. Cybernetic Holographic Dot Lattice (GitHub Globe inspired dot matrix)
    const dotCount = this.isMobile ? 550 : 1200;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);
    
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const rAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      const r = radius * 1.025;
      const x = Math.cos(theta) * rAtY * r;
      const z = Math.sin(theta) * rAtY * r;
      
      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y * r;
      dotPositions[i * 3 + 2] = z;
      
      const isBright = Math.random() > 0.4;
      dotColors[i * 3] = isBright ? 0.13 : 0.25;
      dotColors[i * 3 + 1] = isBright ? 0.85 : 0.65;
      dotColors[i * 3 + 2] = 1.0;
    }
    
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    
    const dotMat = new THREE.PointsMaterial({
      size: this.isMobile ? 0.08 : 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.planetDots = new THREE.Points(dotGeo, dotMat);
    this.planetGroup.add(this.planetDots);
    
    // C. Subtle Holographic Latitude/Longitude Rings
    this.planetHoloRings = new THREE.Group();
    const holoRingsData = [
      { r: radius * 1.03, tiltX: 0.2, tiltZ: 0.1 },
      { r: radius * 1.04, tiltX: 0.6, tiltZ: -0.3 },
      { r: radius * 1.05, tiltX: -0.4, tiltZ: 0.5 }
    ];
    holoRingsData.forEach((d) => {
      const ringCurveGeo = new THREE.BufferGeometry();
      const segs = 64;
      const pts = [];
      for (let j = 0; j <= segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * d.r, 0, Math.sin(a) * d.r));
      }
      ringCurveGeo.setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(ringCurveGeo, lineMat);
      line.rotation.x = d.tiltX;
      line.rotation.z = d.tiltZ;
      this.planetHoloRings.add(line);
    });
    this.planetGroup.add(this.planetHoloRings);
    
    // D. Outer Atmospheric Fresnel Halo
    const haloGeo = new THREE.SphereGeometry(radius * 1.12, 32, 32);
    const haloVertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const haloFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        fresnel = pow(fresnel, 2.8);
        vec3 glowColor = mix(vec3(0.08, 0.82, 0.95), vec3(0.38, 0.55, 1.0), fresnel);
        gl_FragColor = vec4(glowColor, fresnel * 0.75);
      }
    `;
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: haloVertexShader,
      fragmentShader: haloFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.planetAtmosphere = new THREE.Mesh(haloGeo, haloMat);
    this.planetGroup.add(this.planetAtmosphere);
    
    // E. Pure Star Dust Particle Ring System (No solid geometric mesh!)
    const ringParticleCount = this.isMobile ? 650 : 1400;
    const innerR = radius * 1.5;
    const outerR = radius * 2.5;
    const cassiniInner = radius * 1.95;
    const cassiniOuter = radius * 2.05;
    
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringParticleCount * 3);
    const ringColors = new Float32Array(ringParticleCount * 3);
    
    for (let i = 0; i < ringParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      let r = innerR + Math.random() * (outerR - innerR);
      // Cassini division gap
      if (r > cassiniInner && r < cassiniOuter) {
        r = Math.random() > 0.5 ? cassiniInner - Math.random() * 0.15 : cassiniOuter + Math.random() * 0.15;
      }
      const zOffset = (Math.random() - 0.5) * 0.18;
      
      ringPos[i * 3] = Math.cos(angle) * r;
      ringPos[i * 3 + 1] = zOffset;
      ringPos[i * 3 + 2] = Math.sin(angle) * r;
      
      const rand = Math.random();
      if (rand > 0.6) {
        ringColors[i * 3] = 0.2; ringColors[i * 3 + 1] = 0.85; ringColors[i * 3 + 2] = 1.0; // Cyan
      } else if (rand > 0.25) {
        ringColors[i * 3] = 0.35; ringColors[i * 3 + 1] = 0.55; ringColors[i * 3 + 2] = 1.0; // Electric Blue
      } else {
        ringColors[i * 3] = 0.9; ringColors[i * 3 + 1] = 0.95; ringColors[i * 3 + 2] = 1.0; // White Ice
      }
    }
    
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));
    
    const ringMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.planetParticleRing = new THREE.Points(ringGeo, ringMat);
    this.planetParticleRing.rotation.x = Math.PI / 2.35;
    this.planetParticleRing.rotation.z = Math.PI / 6.5;
    this.planetGroup.add(this.planetParticleRing);
    
    // F. Mini Moons
    const moon1Geo = new THREE.SphereGeometry(0.24, 16, 16);
    const moon1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });
    const moon1 = new THREE.Mesh(moon1Geo, moon1Mat);
    moon1.userData = { orbitRadius: radius * 2.85, speed: 0.007, angle: 0.8, inclination: 0.2 };
    this.planetGroup.add(moon1);
    this.moons.push(moon1);
    
    const moon2Geo = new THREE.SphereGeometry(0.16, 14, 14);
    const moon2Mat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc,
      emissive: 0x6366f1,
      emissiveIntensity: 0.7,
      roughness: 0.4
    });
    const moon2 = new THREE.Mesh(moon2Geo, moon2Mat);
    moon2.userData = { orbitRadius: radius * 3.6, speed: 0.0045, angle: 3.2, inclination: -0.38 };
    this.planetGroup.add(moon2);
    this.moons.push(moon2);
    
    // Positioning: In deep background space at z = -15.0, shifted higher and to the left
    // Completely unoccluded from the JS badge (at pixelX ~785, pixelY ~330) and the left title
    if (this.isMobile) {
      this.planetGroup.position.set(4.5, 18.5, -18);
      this.planetGroup.scale.set(0.6, 0.6, 0.6);
    } else {
      this.planetGroup.position.set(4.5, 12.5, -15.0);
      this.planetGroup.scale.set(1.0, 1.0, 1.0);
    }
    
    this.scene.add(this.planetGroup);
  }
  
  // 2. Space Battle: UFO Alien Flying Saucer vs Sci-Fi Space Fighter (Anti-Clipping & Direction-Aligned lookAt)
  createSpaceBattle() {
    this.battleGroup = new THREE.Group();
    
    // ==================== A. UFO ALIEN SAUCER ====================
    this.ufoGroup = new THREE.Group();
    
    // 1. Saucer Metallic Disc
    const saucerUpperGeo = new THREE.CylinderGeometry(0.6, 2.0, 0.32, 24);
    const saucerLowerGeo = new THREE.CylinderGeometry(2.0, 0.5, 0.28, 24);
    const saucerHullMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.88,
      roughness: 0.2,
      emissive: 0x081c3b,
      emissiveIntensity: 0.35
    });
    
    const saucerUpper = new THREE.Mesh(saucerUpperGeo, saucerHullMat);
    saucerUpper.position.y = 0.16;
    const saucerLower = new THREE.Mesh(saucerLowerGeo, saucerHullMat);
    saucerLower.position.y = -0.14;
    this.ufoGroup.add(saucerUpper);
    this.ufoGroup.add(saucerLower);
    
    // 2. Glowing Alien Cockpit Glass Dome
    const domeGeo = new THREE.SphereGeometry(0.72, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x22c55e,
      emissiveIntensity: 1.5,
      roughness: 0.15,
      transparent: true,
      opacity: 0.88
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.3;
    this.ufoGroup.add(dome);
    
    // 3. Rotating Ring of Neon Rim Lights
    this.ufoRingLights = new THREE.Group();
    const lightNodeCount = 10;
    const lightRadius = 1.82;
    for (let i = 0; i < lightNodeCount; i++) {
      const angle = (i / lightNodeCount) * Math.PI * 2;
      const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const isGreen = i % 2 === 0;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isGreen ? 0x22c55e : 0x06b6d4,
        emissive: isGreen ? 0x22c55e : 0x06b6d4,
        emissiveIntensity: 1.8
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * lightRadius, 0.02, Math.sin(angle) * lightRadius);
      this.ufoRingLights.add(node);
    }
    this.ufoGroup.add(this.ufoRingLights);
    
    // 4. Ventral Propulsion Beam (Under-saucer glow)
    const ventralGeo = new THREE.CylinderGeometry(0.35, 0.75, 0.25, 16);
    const ventralMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.8
    });
    const ventral = new THREE.Mesh(ventralGeo, ventralMat);
    ventral.position.y = -0.32;
    this.ufoGroup.add(ventral);
    
    // 5. UFO Shield Mesh
    const ufoShieldGeo = new THREE.SphereGeometry(2.3, 16, 16);
    const ufoShieldMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.ufoShield = new THREE.Mesh(ufoShieldGeo, ufoShieldMat);
    this.ufoShield.userData = { flashTimer: 0 };
    this.ufoGroup.add(this.ufoShield);
    
    // UFO scale & initial position
    this.ufoGroup.scale.set(1.15, 1.15, 1.15);
    this.ufoGroup.position.set(8, 6.5, -4.0);
    this.battleGroup.add(this.ufoGroup);
    
    // ==================== B. SCI-FI SPACE FIGHTER ====================
    this.fighterGroup = new THREE.Group();
    
    // 1. Sleek Arrowhead Fuselage
    const fuselageGeo = new THREE.ConeGeometry(0.45, 2.5, 4);
    fuselageGeo.rotateX(Math.PI / 2); // Point along +Z (nose is +Z)
    const fighterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.4
    });
    const fuselage = new THREE.Mesh(fuselageGeo, fighterMat);
    this.fighterGroup.add(fuselage);
    
    // 2. Cockpit Canopy Glass
    const cockpitGeo = new THREE.SphereGeometry(0.22, 12, 12);
    cockpitGeo.scale(1, 0.8, 1.8);
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.4,
      roughness: 0.1
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.2, 0.3);
    this.fighterGroup.add(cockpit);
    
    // 3. Swept Delta Wings
    const wingGeo = new THREE.BoxGeometry(2.5, 0.05, 0.9);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.3,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.3
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, -0.05, -0.2);
    this.fighterGroup.add(wings);
    
    // Wingtip laser cannons
    const cannonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    cannonGeo.rotateX(Math.PI / 2);
    const cannonMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 });
    const leftCannon = new THREE.Mesh(cannonGeo, cannonMat);
    leftCannon.position.set(-1.18, -0.05, 0.2);
    const rightCannon = new THREE.Mesh(cannonGeo, cannonMat);
    rightCannon.position.set(1.18, -0.05, 0.2);
    this.fighterGroup.add(leftCannon);
    this.fighterGroup.add(rightCannon);
    
    // 4. Twin Engine Thrusters & Jet Plumes
    const engineGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    
    const leftEngine = new THREE.Mesh(engineGeo, engineMat);
    leftEngine.position.set(-0.35, 0, -1.1);
    const rightEngine = new THREE.Mesh(engineGeo, engineMat);
    rightEngine.position.set(0.35, 0, -1.1);
    this.fighterGroup.add(leftEngine);
    this.fighterGroup.add(rightEngine);
    
    const plumeGeo = new THREE.ConeGeometry(0.15, 0.9, 8);
    plumeGeo.rotateX(-Math.PI / 2);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    
    const leftPlume = new THREE.Mesh(plumeGeo, plumeMat);
    leftPlume.position.set(-0.35, 0, -1.65);
    const rightPlume = new THREE.Mesh(plumeGeo, plumeMat.clone());
    rightPlume.position.set(0.35, 0, -1.65);
    this.fighterGroup.add(leftPlume);
    this.fighterGroup.add(rightPlume);
    this.fighterThrusters.push(leftPlume, rightPlume);
    
    // 5. Fighter Shield Mesh
    const fighterShieldGeo = new THREE.SphereGeometry(1.6, 14, 14);
    const fighterShieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.fighterShield = new THREE.Mesh(fighterShieldGeo, fighterShieldMat);
    this.fighterShield.userData = { flashTimer: 0 };
    this.fighterGroup.add(this.fighterShield);
    
    // Fighter scale & initial position
    this.fighterGroup.scale.set(1.1, 1.1, 1.1);
    this.fighterGroup.position.set(2, 5.0, -4.0);
    this.prevFighterPos.copy(this.fighterGroup.position);
    this.battleGroup.add(this.fighterGroup);
    
    // ==================== C. DIRECTIONAL LASER BEAM POOL ====================
    const laserPoolSize = 14;
    const laserGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8);
    laserGeo.rotateX(Math.PI / 2); // Cylinder along Z-axis
    
    for (let i = 0; i < laserPoolSize; i++) {
      const isUfo = i % 3 === 0;
      const laserColor = isUfo ? 0x22c55e : 0x22d3ee;
      const laserMat = new THREE.MeshBasicMaterial({
        color: laserColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.userData = {
        active: false,
        velocity: new THREE.Vector3(),
        life: 0,
        fromUfo: isUfo
      };
      this.battleGroup.add(laser);
      this.lasers.push(laser);
    }
    
    // ==================== D. HIT SPARKS SYSTEM ====================
    const sparkCount = 45;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    
    for (let i = 0; i < sparkCount; i++) {
      sparkColors[i * 3] = 0.4;
      sparkColors[i * 3 + 1] = 0.9;
      sparkColors[i * 3 + 2] = 1.0;
    }
    
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));
    
    const sparkMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.hitSparks = new THREE.Points(sparkGeo, sparkMat);
    this.hitSparks.userData = {
      sparks: Array.from({ length: sparkCount }, () => ({
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0
      }))
    };
    this.battleGroup.add(this.hitSparks);
    
    if (this.isMobile) {
      this.battleGroup.scale.set(0.65, 0.65, 0.65);
      this.battleGroup.position.set(0, 4.0, 0);
    }
    
    this.scene.add(this.battleGroup);
  }
  
  // Fire directional laser
  fireLaser(fromCraft, toCraft, isUfo) {
    const laser = this.lasers.find(l => !l.userData.active && l.userData.fromUfo === isUfo);
    if (!laser) return;
    
    const u = laser.userData;
    u.active = true;
    u.life = 40;
    
    laser.position.copy(fromCraft.position);
    
    if (!isUfo) {
      // Offset from fighter wing cannon
      const wingOffset = (Math.random() > 0.5 ? 0.9 : -0.9);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(fromCraft.quaternion);
      laser.position.add(right.multiplyScalar(wingOffset));
      
      // Fire forward along fighter heading
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(fromCraft.quaternion);
      u.velocity.copy(forward).multiplyScalar(1.35);
      laser.quaternion.copy(fromCraft.quaternion);
    } else {
      // UFO fires toward fighter
      const dir = toCraft.position.clone().sub(fromCraft.position).normalize();
      u.velocity.copy(dir).multiplyScalar(1.15);
      laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    }
    
    laser.material.opacity = 0.95;
  }
  
  triggerHitSparks(position) {
    const sparks = this.hitSparks.userData.sparks;
    let burstCount = 0;
    
    for (let i = 0; i < sparks.length; i++) {
      if (!sparks[i].active && burstCount < 14) {
        sparks[i].active = true;
        sparks[i].pos.copy(position);
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 0.15 + Math.random() * 0.25;
        
        sparks[i].vel.set(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        );
        sparks[i].life = 18;
        burstCount++;
      }
    }
    this.hitSparks.material.opacity = 0.9;
  }
  
  // Anti-Clipping Dogfight Flight Physics with Velocity lookAt
  updateSpaceBattle(delta) {
    if (!this.ufoGroup || !this.fighterGroup) return;
    
    this.battleTime += delta * 0.85;
    const t = this.battleTime;
    
    // 1. UFO Flight Path: Expansive sweeping loops in foreground zone (z: -4.5 to -1.5)
    // Planet is far back at z = -15.0 and y = 12.5, completely separated in depth!
    const ufoBaseX = this.isMobile ? 3.5 : 4.0;
    const ufoBaseY = this.isMobile ? 12.0 : 6.8;
    const ufoBaseZ = -3.5;
    
    const prevUfoPos = this.ufoGroup.position.clone();
    
    // Wide sweeping curves across open space
    this.ufoGroup.position.x = ufoBaseX + Math.sin(t * 0.6) * 9.5 + Math.cos(t * 0.28) * 2.5;
    this.ufoGroup.position.y = ufoBaseY + Math.cos(t * 0.82) * 3.2 + Math.sin(t * 0.4) * 1.5;
    this.ufoGroup.position.z = ufoBaseZ + Math.sin(t * 0.48) * 2.0;
    
    // Banking tilt based on velocity
    const ufoVelX = this.ufoGroup.position.x - prevUfoPos.x;
    const ufoVelY = this.ufoGroup.position.y - prevUfoPos.y;
    this.ufoGroup.rotation.z = -ufoVelX * 1.6;
    this.ufoGroup.rotation.x = ufoVelY * 1.2;
    
    if (this.ufoRingLights) {
      this.ufoRingLights.rotation.y += 0.06;
    }
    
    // 2. Space Fighter Pursuit Dynamics
    // Trailing combat position behind UFO
    const trailOffset = new THREE.Vector3(
      -Math.cos(t * 0.6) * 5.5 - 2.8,
      -Math.sin(t * 0.82) * 2.0 - 0.4,
      1.8 + Math.sin(t * 0.48) * 1.2
    );
    const targetFighterPos = this.ufoGroup.position.clone().add(trailOffset);
    
    // Store position before moving for velocity calculation
    const currentFighterPos = this.fighterGroup.position.clone();
    
    // Smooth pursuit tracking
    this.fighterGroup.position.lerp(targetFighterPos, 0.055);
    
    // CRITICAL: Fighter MUST ALWAYS FACE its forward flight direction (Velocity lookAt)
    const flightVel = this.fighterGroup.position.clone().sub(currentFighterPos);
    if (flightVel.lengthSq() > 0.00005) {
      flightVel.normalize();
      const lookTarget = this.fighterGroup.position.clone().add(flightVel);
      this.fighterGroup.lookAt(lookTarget);
      
      // Roll banking into turn
      const bankAngle = -flightVel.x * 0.75;
      this.fighterGroup.rotateZ(bankAngle);
    }
    
    // Pulse thrusters
    this.fighterThrusters.forEach((plume) => {
      const pulse = 0.85 + Math.random() * 0.4;
      plume.scale.set(1, pulse, 1);
    });
    
    // 3. Laser Weapons Dogfight: Only fire when fighter is oriented towards UFO
    this.fighterFireTimer -= delta;
    if (this.fighterFireTimer <= 0) {
      const fighterForward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.fighterGroup.quaternion);
      const dirToUfo = this.ufoGroup.position.clone().sub(this.fighterGroup.position).normalize();
      
      // Fire only when having line-of-sight bearing toward UFO
      if (fighterForward.dot(dirToUfo) > 0.7) {
        this.fireLaser(this.fighterGroup, this.ufoGroup, false);
      }
      this.fighterFireTimer = 1.2 + Math.random() * 1.4;
    }
    
    this.ufoFireTimer -= delta;
    if (this.ufoFireTimer <= 0) {
      this.fireLaser(this.ufoGroup, this.fighterGroup, true);
      this.ufoFireTimer = 2.0 + Math.random() * 2.2;
    }
    
    // 4. Update Laser Positions & Shield Collisions
    this.lasers.forEach((laser) => {
      const u = laser.userData;
      if (!u.active) return;
      
      laser.position.add(u.velocity);
      u.life--;
      
      const targetCraft = u.fromUfo ? this.fighterGroup : this.ufoGroup;
      const targetShield = u.fromUfo ? this.fighterShield : this.ufoShield;
      const dist = laser.position.distanceTo(targetCraft.position);
      
      if (dist < 1.6) {
        this.triggerHitSparks(laser.position);
        if (targetShield) {
          targetShield.userData.flashTimer = 12;
          targetShield.material.opacity = 0.75;
        }
        u.active = false;
        laser.material.opacity = 0;
        return;
      }
      
      if (u.life <= 0) {
        u.active = false;
        laser.material.opacity = 0;
      }
    });
    
    // Shield flash decay
    [this.ufoShield, this.fighterShield].forEach((shield) => {
      if (shield && shield.userData.flashTimer > 0) {
        shield.userData.flashTimer--;
        shield.material.opacity = (shield.userData.flashTimer / 12) * 0.75;
      }
    });
    
    // 5. Update Hit Sparks Particles
    if (this.hitSparks) {
      const sparks = this.hitSparks.userData.sparks;
      const posAttr = this.hitSparks.geometry.attributes.position;
      let activeSparks = 0;
      
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        if (s.active) {
          s.pos.add(s.vel);
          s.vel.multiplyScalar(0.92);
          s.life--;
          
          posAttr.setXYZ(i, s.pos.x, s.pos.y, s.pos.z);
          activeSparks++;
          
          if (s.life <= 0) {
            s.active = false;
            posAttr.setXYZ(i, 0, 9999, 0);
          }
        } else {
          posAttr.setXYZ(i, 0, 9999, 0);
        }
      }
      posAttr.needsUpdate = true;
      if (activeSparks === 0) {
        this.hitSparks.material.opacity = 0;
      }
    }
  }
  
  // 3. Cinematic Meteor / Shooting Stars System
  createMeteors() {
    const meteorCount = 3;
    for (let i = 0; i < meteorCount; i++) {
      const trailSegments = 8;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(trailSegments * 3);
      const colors = new Float32Array(trailSegments * 3);
      
      for (let j = 0; j < trailSegments; j++) {
        const ratio = 1 - (j / (trailSegments - 1));
        colors[j * 3] = 0.6 + ratio * 0.4;
        colors[j * 3 + 1] = 0.85 + ratio * 0.15;
        colors[j * 3 + 2] = 1.0;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5,
        depthWrite: false
      });
      
      const line = new THREE.Line(geometry, material);
      line.userData = {
        active: false,
        headPos: new THREE.Vector3(),
        length: 5.5 + Math.random() * 4,
        speed: 0.65 + Math.random() * 0.35,
        direction: new THREE.Vector3(-1.1, -0.65, 0.1).normalize(),
        delay: 1.0 + i * 2.8 + Math.random() * 2.5,
        fadeOpacity: 0
      };
      
      this.scene.add(line);
      this.meteors.push(line);
    }
  }
  
  spawnMeteor(meteor) {
    const u = meteor.userData;
    u.headPos.set(12 + Math.random() * 26, 12 + Math.random() * 18, -8 + Math.random() * 14);
    u.length = 5.5 + Math.random() * 4.5;
    u.speed = 0.7 + Math.random() * 0.35;
    u.active = true;
    u.fadeOpacity = 0.85;
    meteor.material.opacity = u.fadeOpacity;
  }
  
  updateMeteors(delta) {
    this.meteors.forEach((meteor) => {
      const u = meteor.userData;
      if (!u.active) {
        u.delay -= delta;
        if (u.delay <= 0) this.spawnMeteor(meteor);
        return;
      }
      
      const step = u.direction.clone().multiplyScalar(u.speed);
      u.headPos.add(step);
      
      const posAttr = meteor.geometry.attributes.position;
      const trailCount = posAttr.count;
      const tailOffset = u.direction.clone().multiplyScalar(-u.length / trailCount);
      
      for (let j = 0; j < trailCount; j++) {
        const p = u.headPos.clone().add(tailOffset.clone().multiplyScalar(j));
        posAttr.setXYZ(j, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
      
      if (u.headPos.x < -36 || u.headPos.y < -24) {
        u.fadeOpacity -= 0.08;
        if (u.fadeOpacity <= 0) {
          u.active = false;
          meteor.material.opacity = 0;
          u.delay = 3.0 + Math.random() * 4.5;
        } else {
          meteor.material.opacity = u.fadeOpacity;
        }
      }
    });
  }
  
  // 4. Starfield Galaxy
  createGalaxy() {
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = this.isMobile ? 900 : 2000;
    
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    
    for (let i = 0; i < galaxyCount; i++) {
      const radius = Math.random() * 32;
      const angle = radius * 1.2 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 10;
      
      galaxyPositions[i * 3] = Math.cos(angle) * radius;
      galaxyPositions[i * 3 + 1] = height;
      galaxyPositions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const colorIndex = i % this.palette.length;
      const baseColor = this.palette[colorIndex];
      const mixedColor = baseColor.clone().lerp(this.palette[(colorIndex + 1) % this.palette.length], Math.random() * 0.4);
      
      galaxyColors[i * 3] = mixedColor.r;
      galaxyColors[i * 3 + 1] = mixedColor.g;
      galaxyColors[i * 3 + 2] = mixedColor.b;
    }
    
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    
    const galaxyMaterial = new THREE.PointsMaterial({
      size: this.isMobile ? 0.075 : 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    this.scene.add(this.galaxy);
  }
  
  createSparkles() {
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = this.isMobile ? 320 : 750;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 85;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 85;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 85;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    
    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    this.scene.add(this.sparkles);
  }
  
  // 5. Section Shapes
  createAboutShapes() {
    this.aboutShapes = new THREE.Group();
    const aboutCount = this.isMobile ? 10 : 18;
    for (let i = 0; i < aboutCount; i++) {
      const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const isCyan = i % 2 === 0;
      const material = new THREE.MeshStandardMaterial({
        color: isCyan ? 0x06b6d4 : 0x6366f1,
        emissive: isCyan ? 0x0891b2 : 0x4f46e5,
        emissiveIntensity: 0.25,
        wireframe: Math.random() > 0.45,
        transparent: true,
        opacity: 0.3
      });
      const shape = new THREE.Mesh(geometry, material);
      const angle = (i / aboutCount) * Math.PI * 2;
      shape.position.set(Math.cos(angle) * 18, Math.sin(angle * 3) * 4, Math.sin(angle) * 18 - 5);
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shape.userData = { originalPos: shape.position.clone(), speed: 0.15 + Math.random() * 0.2 };
      this.aboutShapes.add(shape);
    }
    this.scene.add(this.aboutShapes);
  }
  
  createSkillsShapes() {
    this.skillsShapes = new THREE.Group();
    const skillCount = this.isMobile ? 14 : 26;
    for (let i = 0; i < skillCount; i++) {
      let geometry = (i % 2 === 0) ? new THREE.OctahedronGeometry(0.2) : new THREE.TorusGeometry(0.18, 0.05, 8, 16);
      const material = new THREE.MeshStandardMaterial({
        color: (i % 3 === 0) ? 0x06b6d4 : (i % 3 === 1 ? 0x3b82f6 : 0x6366f1),
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.3
      });
      const shape = new THREE.Mesh(geometry, material);
      const cols = 7;
      const spacing = 4.5;
      shape.position.set(((i % cols) * spacing) - ((cols - 1) * spacing / 2), Math.sin(i) * 2.5, Math.floor(i / cols) * spacing - 14);
      shape.userData = { originalY: shape.position.y, speed: 0.25 + Math.random() * 0.25, offset: Math.random() * Math.PI * 2 };
      this.skillsShapes.add(shape);
    }
    this.scene.add(this.skillsShapes);
  }
  
  createProjectsShapes() {
    this.projectsShapes = new THREE.Group();
    const projectCount = this.isMobile ? 8 : 14;
    for (let i = 0; i < projectCount; i++) {
      const geometry = new THREE.BoxGeometry(0.7, 0.45, 0.08);
      const material = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, emissive: 0x1e293b, transparent: true, opacity: 0.25 });
      const card = new THREE.Mesh(geometry, material);
      const cols = 5;
      const spacingX = 4.2;
      card.position.set(((i % cols) * spacingX) - ((cols - 1) * spacingX / 2), Math.sin(i) * 2, Math.floor(i / cols) * 3.5 - 12);
      card.rotation.set(Math.PI / 8, Math.PI / 5, 0);
      card.userData = { originalPos: card.position.clone(), speed: 0.2 + Math.random() * 0.2 };
      this.projectsShapes.add(card);
    }
    this.scene.add(this.projectsShapes);
  }
  
  createContactShapes() {
    this.contactShapes = new THREE.Group();
    const nodeCount = this.isMobile ? 8 : 14;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.12, 8, 8);
      const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x06b6d4, emissiveIntensity: 0.4, transparent: true, opacity: 0.4 });
      const sphere = new THREE.Mesh(geometry, material);
      const angle = (i / nodeCount) * Math.PI * 2;
      sphere.position.set(Math.cos(angle) * 14, Math.sin(angle) * 2.5, Math.sin(angle) * 14 - 6);
      nodes.push(sphere);
      this.contactShapes.add(sphere);
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.68) {
          const points = [nodes[i].position.clone(), nodes[j].position.clone()];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.12 });
          this.contactShapes.add(new THREE.Line(geometry, material));
        }
      }
    }
    this.scene.add(this.contactShapes);
  }
  
  createLights() {
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    this.scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight.position.set(8, 12, 10);
    this.scene.add(dirLight);
    
    const fillLight = new THREE.PointLight(0x3b82f6, 1.0, 60);
    fillLight.position.set(-10, 6, 8);
    this.scene.add(fillLight);
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', (event) => {
      this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
    
    window.addEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        this.targetMouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });
    
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const sectionElements = sections.map(id => document.getElementById(id));
      for (let i = 0; i < sectionElements.length; i++) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            this.targetSection = sections[i];
            break;
          }
        }
      }
    }, { passive: true });
    
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      
      if (this.planetGroup) {
        if (this.isMobile) {
          this.planetGroup.position.set(4.5, 18.5, -18);
          this.planetGroup.scale.set(0.6, 0.6, 0.6);
        } else {
          this.planetGroup.position.set(4.5, 12.5, -15.0);
          this.planetGroup.scale.set(1.0, 1.0, 1.0);
        }
      }
      
      if (this.battleGroup) {
        if (this.isMobile) {
          this.battleGroup.scale.set(0.65, 0.65, 0.65);
          this.battleGroup.position.set(0, 4.0, 0);
        } else {
          this.battleGroup.scale.set(1.0, 1.0, 1.0);
          this.battleGroup.position.set(0, 0, 0);
        }
      }
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.isVisible) return;
    
    const delta = 0.016;
    
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.035;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.035;
    
    this.sectionTransition += (this.targetSection !== this.currentSection ? 0.025 : -0.025);
    this.sectionTransition = Math.max(0, Math.min(1, this.sectionTransition));
    if (this.sectionTransition >= 0.99) {
      this.currentSection = this.targetSection;
    }
    
    // 1. Stars & galaxy rotation
    if (this.galaxy) {
      this.galaxy.rotation.y += 0.00018;
      this.galaxy.rotation.x += 0.00009;
    }
    if (this.sparkles) {
      this.sparkles.rotation.y += 0.00012;
    }
    
    // 2. Animate Cybernetic Planet, Holographic Lattice & Star Dust Rings
    if (this.planetGroup) {
      if (this.planetMesh) this.planetMesh.rotation.y += 0.0018;
      if (this.planetDots) this.planetDots.rotation.y += 0.0025; // Holographic lattice spin
      if (this.planetHoloRings) this.planetHoloRings.rotation.y += 0.003;
      if (this.planetParticleRing) this.planetParticleRing.rotation.y += 0.0012;
      
      this.moons.forEach((moon) => {
        const u = moon.userData;
        u.angle += u.speed;
        moon.position.set(
          Math.cos(u.angle) * u.orbitRadius,
          Math.sin(u.angle) * (u.orbitRadius * u.inclination),
          Math.sin(u.angle) * u.orbitRadius
        );
      });
      
      const hoverTime = Date.now() * 0.0008;
      const basePosY = this.isMobile ? 18.5 : 12.5;
      this.planetGroup.position.y = basePosY + Math.sin(hoverTime) * 0.25;
      
      const isHome = this.currentSection === 'home';
      const targetZ = isHome ? (this.isMobile ? -18 : -15.0) : -30;
      this.planetGroup.position.z += (targetZ - this.planetGroup.position.z) * 0.04;
    }
    
    // 3. Update Space Battle Dogfight & Anti-Clipping Flight
    this.updateSpaceBattle(delta);
    
    // 4. Update Meteors
    this.updateMeteors(delta);
    
    // 5. Section Shapes
    if (this.aboutShapes) {
      this.aboutShapes.rotation.y += 0.0008;
      this.aboutShapes.children.forEach(s => { s.rotation.x += 0.006; s.rotation.y += 0.006; });
    }
    if (this.skillsShapes) {
      const time = Date.now() * 0.0012;
      this.skillsShapes.children.forEach(s => { s.position.y = s.userData.originalY + Math.sin(time + s.userData.offset) * 0.7; });
    }
    if (this.projectsShapes) {
      const time = Date.now() * 0.0008;
      this.projectsShapes.children.forEach(c => { c.position.y = c.userData.originalPos.y + Math.sin(time) * 0.6; });
    }
    
    // Dynamic Section Intensity
    const homeIntensity = this.currentSection === 'home' ? 1 : (1 - this.sectionTransition);
    const aboutIntensity = this.currentSection === 'about' ? 1 : (this.currentSection === 'home' ? this.sectionTransition : (this.currentSection === 'skills' ? 1 - this.sectionTransition : 0));
    const skillsIntensity = this.currentSection === 'skills' ? 1 : (this.currentSection === 'about' ? this.sectionTransition : (this.currentSection === 'projects' ? 1 - this.sectionTransition : 0));
    const projectsIntensity = this.currentSection === 'projects' ? 1 : (this.currentSection === 'skills' ? this.sectionTransition : (this.currentSection === 'contact' ? 1 - this.sectionTransition : 0));
    const contactIntensity = this.currentSection === 'contact' ? 1 : (this.currentSection === 'projects' ? this.sectionTransition : 0);
    
    if (this.battleGroup) {
      if (this.ufoGroup) this.ufoGroup.visible = homeIntensity > 0.1;
      if (this.fighterGroup) this.fighterGroup.visible = homeIntensity > 0.1;
    }
    
    if (this.aboutShapes) this.aboutShapes.children.forEach(c => c.material.opacity = 0.3 * aboutIntensity);
    if (this.skillsShapes) this.skillsShapes.children.forEach(c => c.material.opacity = 0.3 * skillsIntensity);
    if (this.projectsShapes) this.projectsShapes.children.forEach(c => c.material.opacity = 0.25 * projectsIntensity);
    if (this.contactShapes) this.contactShapes.children.forEach(c => { if (c.material) c.material.opacity = (c.isLine ? 0.12 : 0.4) * contactIntensity; });
    
    // 6. Smooth Mouse Parallax
    const parallaxX = this.mouseX * 0.8;
    const parallaxY = this.mouseY * 0.8;
    
    if (this.galaxy) {
      this.galaxy.position.x = parallaxX * 0.4;
      this.galaxy.position.y = parallaxY * 0.4;
    }
    if (this.planetGroup) {
      const basePosX = this.isMobile ? 4.0 : 4.5;
      this.planetGroup.position.x = basePosX + parallaxX * 0.4;
    }
    if (this.battleGroup) {
      this.battleGroup.position.x = parallaxX * 0.65;
      this.battleGroup.position.y = parallaxY * 0.65;
    }
    if (this.aboutShapes) {
      this.aboutShapes.position.x = parallaxX * 0.4;
      this.aboutShapes.position.y = parallaxY * 0.4;
    }
    if (this.skillsShapes) {
      this.skillsShapes.position.x = parallaxX * 0.3;
      this.skillsShapes.position.y = parallaxY * 0.3;
    }
    if (this.projectsShapes) {
      this.projectsShapes.position.x = parallaxX * 0.25;
      this.projectsShapes.position.y = parallaxY * 0.25;
    }
    if (this.contactShapes) {
      this.contactShapes.position.x = parallaxX * 0.2;
      this.contactShapes.position.y = parallaxY * 0.2;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Inisialisasi Three.js setelah DOM siap
window.threeScene = null;
function initThreeScene() {
  if (typeof THREE !== 'undefined' && !window.threeScene) {
    window.threeScene = new ThreeScene();
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initThreeScene);
} else {
  initThreeScene();
}
