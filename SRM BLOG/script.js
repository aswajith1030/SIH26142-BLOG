/* ==========================================================================
   AMASTRA TECH — DeepSRM-AI Interactive & Movable Graphic Engine (Purple Theme)
   Vanilla JS (No external libraries required)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modular controllers
  initNavigation();
  initReadingProgressBar();
  initHeroOrbitalCanvas();
  initTiltCards();
  initPipelineStepper();
  initApplicationsTabs();
  initGisSimulator();
  initBlogEngine();
  initScrollAnimations();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Drawer Controller
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav .nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Top Reading Progress Bar Controller
   -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* --------------------------------------------------------------------------
   3. Movable Interactive Hero Orbital Canvas Graphic (Purple Theme)
   -------------------------------------------------------------------------- */
function initHeroOrbitalCanvas() {
  const canvas = document.getElementById('hero-orbital-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Purple/Violet particle constellation nodes
  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.5,
      color: Math.random() > 0.5 ? '#a855f7' : '#e879f9'
    });
  }

  let angleSweep = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw orbital grid rings
    const centerX = width * 0.75;
    const centerY = height * 0.45;

    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
    ctx.lineWidth = 1;
    
    for (let r = 80; r <= 320; r += 80) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotating radar sweep arc
    angleSweep += 0.008;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, 320, angleSweep, angleSweep + 0.4);
    ctx.closePath();
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 320);
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Update & draw particles with mouse interaction
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(192, 132, 252, ${1 - dist / 110 * 0.8})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. 3D Tilt Card Interaction
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Technical Pipeline Stepper Data & Interaction
   -------------------------------------------------------------------------- */
const pipelineData = {
  1: {
    title: "STEP 01: Sentinel-2 Input Satellite Imagery",
    subtitle: "Multispectral Input Acquisition",
    description: "DeepSRM-AI ingests freely accessible 10m Sentinel-2 satellite imagery containing 13 spectral bands covering optical, near-infrared (NIR), and short-wave infrared (SWIR) spectra.",
    bullets: [
      "Spatial Resolution: 10m (Bands 2, 3, 4, 8) & 20m (Bands 5, 6, 7, 8A, 11, 12)",
      "Spectral Coverage: Blue, Green, Red, Vegetation Red Edge, NIR, SWIR",
      "Revisit Frequency: 5 days under constellation orbital coverage",
      "Format: Level-2A Bottom-Of-Atmosphere (BOA) surface reflectance"
    ],
    badges: ["Sentinel-2", "10m Bands", "13 Multispectral Bands", "ESA Copernicus"]
  },
  2: {
    title: "STEP 02: Radiometric & Spatial Pre-processing",
    subtitle: "Atmospheric & Geometric Normalization",
    description: "Standardizes input tiles through cloud filtering, atmospheric correction verification, spectral band resampling to 10m base grid, and radiometric normalization.",
    bullets: [
      "SCL Cloud & Shadow Masking to eliminate atmospheric contamination",
      "Bicubic & Nearest-Neighbor band alignment for 20m/60m bands to 10m grid",
      "Z-Score and Min-Max Minification for dynamic range standardization",
      "Overlapping 256x256 pixel sub-image tiling with 16-pixel padding"
    ],
    badges: ["Cloud Masking", "Band Resampling", "Tiling", "Normalization"]
  },
  3: {
    title: "STEP 03: Training Data Pair Preparation",
    subtitle: "Supervised Alignment & Ground Truth Mapping",
    description: "Pairs Sentinel-2 tiles with high-resolution reference datasets (e.g. WorldView/VENµS or aerial imagery) alongside high-precision land-cover ground truth labels.",
    bullets: [
      "Sub-pixel geometric co-registration using cross-correlation alignment",
      "Categorical land-cover mapping: Crops, Water, Built-up, Forest, Soil, Roads",
      "Data augmentation: Flip, rotation, spectral jittering, scale synthesis",
      "Benchmark alignment with SEN2VENUS and ESA OpenSR protocols"
    ],
    badges: ["Paired Samples", "SEN2VENUS Dataset", "Sub-pixel Alignment"]
  },
  4: {
    title: "STEP 04: Multi-Scale Feature Extraction",
    subtitle: "Spatial & Spectral Multi-Res Representation",
    description: "Extracts multi-scale spatial textures and spectral index representations (NDVI, NDWI, NDBI) simultaneously using parallel convolutional feature paths.",
    bullets: [
      "Multi-head spatial feature attention layers capturing spatial context",
      "Spectral cross-band attention modeling intra-spectral band correlations",
      "Dual-stream spatial-spectral feature fusion blocks",
      "Preserves high-frequency spatial gradients while retaining radiometric values"
    ],
    badges: ["Attention Mechanism", "NDVI / NDWI Indexing", "Spatial-Spectral Fusion"]
  },
  5: {
    title: "STEP 05: Deep SRM Model Architecture",
    subtitle: "Lightweight CNN & U-Net Dual Encoder-Decoder",
    description: "Core deep learning engine. Uses a lightweight residual U-Net architecture designed for simultaneous super-resolution reconstruction and semantic classification.",
    bullets: [
      "Lightweight CNN backbone optimized for fast inference without heavy GPU overhead",
      "Dual-head output decoder: Image SR Head + Subpixel Semantic Classification Head",
      "Multi-loss optimization preserving physical spectral integrity and edge sharpness",
      "Model size < 15MB enabling edge deployment on GIS workstations"
    ],
    badges: ["U-Net Residual Engine", "Dual-Head Output", "Lightweight CNN", "PyTorch"]
  },
  6: {
    title: "STEP 06: Output Generation",
    subtitle: "Fine-Resolution Imagery & Semantic Maps",
    description: "Produces three coordinated geospatial outputs: 2.5m enhanced multispectral tiles, 2.5m semantic land-cover maps, and per-pixel uncertainty estimation maps.",
    bullets: [
      "Enhanced 2.5m multispectral surface reflectance imagery",
      "Sub-pixel land-cover map with refined building boundaries & narrow field borders",
      "Pixel-level confidence & model uncertainty map",
      "Exportable GeoTIFF format with full spatial CRS metadata"
    ],
    badges: ["2.5m Enhanced Image", "Semantic Land-Cover Map", "Uncertainty Map"]
  },
  7: {
    title: "STEP 07: Empirical Quantitative Validation",
    subtitle: "Rigorous Metric Evaluation",
    description: "Evaluates reconstruction fidelity and classification accuracy against ground truth reference data using established remote sensing metrics.",
    bullets: [
      "Reconstruction Quality: PSNR (Peak Signal-to-Noise Ratio), SSIM, RMSE, SAM (Spectral Angle Mapper)",
      "Classification Accuracy: Overall Accuracy, Precision, Recall, F1-Score, IoU (Intersection over Union)",
      "Cross-validation over diverse agricultural and urban biomes",
      "Confidence thresholding to flag suspicious AI-inferred structures"
    ],
    badges: ["PSNR & SSIM", "SAM Spectral Check", "IoU & F1-Score", "Validation"]
  }
};

function initPipelineStepper() {
  const stepItems = document.querySelectorAll('.pipeline-step-item');
  const detailTitle = document.getElementById('pipeline-detail-title');
  const detailSubtitle = document.getElementById('pipeline-detail-subtitle');
  const detailDesc = document.getElementById('pipeline-detail-desc');
  const detailList = document.getElementById('pipeline-detail-list');
  const detailBadges = document.getElementById('pipeline-detail-badges');

  if (!stepItems.length || !detailTitle) return;

  function renderStep(stepNumber) {
    const data = pipelineData[stepNumber];
    if (!data) return;

    stepItems.forEach(item => {
      if (item.getAttribute('data-step') === String(stepNumber)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    detailTitle.textContent = data.title;
    detailSubtitle.textContent = data.subtitle;
    detailDesc.textContent = data.description;

    detailList.innerHTML = '';
    data.bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.className = 'detail-list-item';
      li.innerHTML = `<span class="list-bullet"></span><span>${bullet}</span>`;
      detailList.appendChild(li);
    });

    detailBadges.innerHTML = '';
    data.badges.forEach(badgeText => {
      const span = document.createElement('span');
      span.className = 'badge badge-cyan';
      span.textContent = badgeText;
      detailBadges.appendChild(span);
    });
  }

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = item.getAttribute('data-step');
      renderStep(step);
    });
  });

  renderStep(1);
}

/* --------------------------------------------------------------------------
   6. Applications Tab Selector
   -------------------------------------------------------------------------- */
const applicationData = {
  agriculture: {
    title: "Precision Agriculture & Crop Monitoring",
    desc: "Sentinel-2 10m resolution often blends field boundaries, small irrigation channels, and heterogeneous crop patches. DeepSRM-AI unmixes sub-pixel vegetation metrics to delineate individual farm plots.",
    items: [
      "Sub-pixel Crop Boundary & Plot Mapping",
      "Localized Crop Stress & Soil Moisture Detection",
      "Precision Fertilizer & Yield Prediction Support",
      "Agricultural Parcel Inventory & Compliance"
    ]
  },
  urban: {
    title: "Urban Infrastructure & Land-Use Planning",
    desc: "Dense urban regions present complex spatial patterns with narrow roads, informal settlements, and micro-green spaces lost in 10m pixels. DeepSRM-AI delivers sharp structural separation.",
    items: [
      "Building Footprint & Infrastructure Mapping",
      "Road Network & Transportation Corridor Extraction",
      "Urban Heat Island & Micro-Vegetation Inventory",
      "Informal Settlement & Urban Sprawl Monitoring"
    ]
  },
  disaster: {
    title: "Disaster Management & Emergency Response",
    desc: "Rapid situational assessment during floods, landslides, or industrial accidents requires fine spatial detail to direct rescue teams and evaluate structural impact.",
    items: [
      "Fine-Scale Flood Surface & Water Inundation Mapping",
      "Post-Disaster Structural Damage Assessment",
      "Emergency Evacuation Corridor Accessibility",
      "Landslide & Debris Accumulation Tracking"
    ]
  },
  environment: {
    title: "Environmental & Forest Monitoring",
    desc: "Critical ecosystems such as coastal wetlands, riparian buffer zones, and fragmented forest edges require precise spatial tracking to evaluate degradation over time.",
    items: [
      "Forest Deforestation Edge & Patch Analysis",
      "Wetland Water-Body & Coastal Marsh Mapping",
      "Land Degradation & Soil Erosion Tracking",
      "Protected Biodiversity Zone Encroachment Monitoring"
    ]
  }
};

function initApplicationsTabs() {
  const tabBtns = document.querySelectorAll('.app-tab-btn');
  const appTitle = document.getElementById('app-info-title');
  const appDesc = document.getElementById('app-info-desc');
  const appList = document.getElementById('app-feature-list');

  if (!tabBtns.length || !appTitle) return;

  function renderApp(key) {
    const data = applicationData[key];
    if (!data) return;

    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-app') === key) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    appTitle.textContent = data.title;
    appDesc.textContent = data.desc;

    appList.innerHTML = '';
    data.items.forEach(itemText => {
      const li = document.createElement('li');
      li.className = 'app-feature-item';
      li.innerHTML = `
        <span class="app-icon-check">✓</span>
        <span>${itemText}</span>
      `;
      appList.appendChild(li);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-app');
      renderApp(key);
    });
  });

  renderApp('agriculture');
}

/* --------------------------------------------------------------------------
   7. Interactive GIS Satellite Simulator & Automated Scan Demo
   -------------------------------------------------------------------------- */
function initGisSimulator() {
  const sliderContainer = document.getElementById('comparison-slider');
  const imgAfter = document.getElementById('img-after');
  const divider = document.getElementById('slider-divider');
  const layerBtns = document.querySelectorAll('.layer-btn');
  const layerTitleText = document.getElementById('gis-layer-title');
  const autoScanBtn = document.getElementById('auto-scan-btn');

  if (!sliderContainer || !divider) return;

  let isDragging = false;
  let autoScanInterval = null;
  let autoScanPos = 50;
  let autoScanDirection = 1;

  function setSliderPosition(x) {
    const rect = sliderContainer.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    imgAfter.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
    divider.style.left = `${percentage}%`;
    autoScanPos = percentage;
  }

  // Mouse & Touch events
  sliderContainer.addEventListener('mousedown', (e) => {
    stopAutoScan();
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  sliderContainer.addEventListener('touchstart', (e) => {
    stopAutoScan();
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Automated Scanning Demo
  function startAutoScan() {
    if (autoScanInterval) return;
    if (autoScanBtn) autoScanBtn.textContent = '⏸ Pause Scan';

    autoScanInterval = setInterval(() => {
      autoScanPos += autoScanDirection * 0.75;
      if (autoScanPos >= 90) {
        autoScanDirection = -1;
      } else if (autoScanPos <= 10) {
        autoScanDirection = 1;
      }
      imgAfter.style.clipPath = `polygon(${autoScanPos}% 0, 100% 0, 100% 100%, ${autoScanPos}% 100%)`;
      divider.style.left = `${autoScanPos}%`;
    }, 20);
  }

  function stopAutoScan() {
    if (autoScanInterval) {
      clearInterval(autoScanInterval);
      autoScanInterval = null;
      if (autoScanBtn) autoScanBtn.textContent = '▶ Auto Scan Demo';
    }
  }

  if (autoScanBtn) {
    autoScanBtn.addEventListener('click', () => {
      if (autoScanInterval) {
        stopAutoScan();
      } else {
        startAutoScan();
      }
    });
  }

  // Layer toggling (Purple / Violet Theme Gradients)
  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.getAttribute('data-layer');
      
      if (layerTitleText) {
        layerTitleText.textContent = `Active View Mode: ${btn.textContent.trim()}`;
      }

      const fineLayer = document.getElementById('simulated-fine-layer');
      if (!fineLayer) return;

      if (layer === 'satellite') {
        fineLayer.style.background = 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #a855f7 70%, #e879f9 100%)';
      } else if (layer === 'landcover') {
        fineLayer.style.background = 'linear-gradient(135deg, #22c55e 0%, #15803d 30%, #eab308 50%, #9333ea 80%, #ef4444 100%)';
      } else if (layer === 'roads') {
        fineLayer.style.background = 'repeating-linear-gradient(45deg, #2e1065, #2e1065 12px, #e879f9 12px, #e879f9 24px)';
      } else if (layer === 'water') {
        fineLayer.style.background = 'radial-gradient(circle at 60% 40%, #7c3aed 0%, #581c87 60%, #2e1065 100%)';
      } else if (layer === 'uncertainty') {
        fineLayer.style.background = 'radial-gradient(circle at 70% 30%, #10b981 0%, #f59e0b 60%, #ef4444 100%)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Blog Articles Repository & Dynamic Modal Reader
   -------------------------------------------------------------------------- */
const blogArticles = [
  {
    id: "blog-01",
    slug: "why-10m-satellite-imagery-needs-super-resolution-mapping",
    category: "Super Resolution",
    categoryCode: "super-resolution",
    title: "Why 10m Satellite Imagery Needs Super Resolution Mapping",
    subtitle: "Addressing the mixed pixel problem in Earth observation",
    date: "September 18, 2026",
    readTime: "5 min read",
    excerpt: "Medium-resolution 10m Sentinel-2 imagery provides global coverage but lacks the fine spatial details required for precision mapping, resulting in unresolvable mixed pixels.",
    content: `
      <p>Satellite remote sensing has transformed Earth observation by providing consistent, global imagery. The European Space Agency’s (ESA) Copernicus Sentinel-2 mission offers freely accessible multispectral data at 10-meter spatial resolution. While 10m pixels are suitable for regional forest inventories and macro-climate studies, they present severe limitations when applied to fine-scale spatial analysis.</p>
      
      <h3>The Mixed Pixel Challenge</h3>
      <p>A single 10-meter pixel represents an area of 100 square meters on the ground. In heterogeneous landscapes—such as urban fringes, agricultural field borders, or damaged disaster zones—a single pixel routinely contains a mixture of multiple ground features: crop soil, asphalt roads, small building roofs, and grass patches.</p>
      
      <div class="article-callout">
        "When multiple land-cover classes coexist within a single satellite pixel, standard classification algorithms assign only one dominant class, discarding spatial boundaries and under-representing critical infrastructure."
      </div>

      <h3>Consequences for Downstream Decision Making</h3>
      <p>This resolution bottleneck leads to three major issues:</p>
      <ul>
        <li><strong>Underestimation of Linear Features:</strong> Narrow irrigation canals, access roads, and small stream channels disappear completely.</li>
        <li><strong>Inaccurate Boundary Delineation:</strong> Small agricultural plot boundaries become blurred, hindering precision farming yield estimations.</li>
        <li><strong>Delayed Disaster Response:</strong> Localized building damage or small flood inundations remain undetected in initial post-disaster passes.</li>
      </ul>

      <div class="key-takeaways-box">
        <div class="takeaways-title">Key Takeaway</div>
        <p>Super-Resolution Mapping (SRM) resolves this fundamental bottleneck by unmixing coarse pixels and estimating sub-pixel spatial class distributions without requiring costly commercial high-resolution satellite acquisitions.</p>
      </div>
    `
  },
  {
    id: "blog-02",
    slug: "inside-deep-srm-ai-from-sentinel-2-to-fine-resolution-maps",
    category: "Architecture",
    categoryCode: "architecture",
    title: "Inside DeepSRM-AI: From Sentinel-2 to Fine-Resolution Maps",
    subtitle: "A deep dive into our end-to-end deep learning methodology",
    date: "September 20, 2026",
    readTime: "7 min read",
    excerpt: "Explore the step-by-step technical architecture of DeepSRM-AI, from 13-band Sentinel-2 processing to sub-pixel U-Net classification and confidence estimation.",
    content: `
      <p>DeepSRM-AI is built around a unified multi-task deep neural network designed specifically for multispectral satellite data. Traditional super-resolution pipelines process spatial enhancement as an independent image-processing step before performing classification. DeepSRM-AI performs spatial enhancement and semantic land-cover mapping simultaneously.</p>
      
      <h3>13-Band Input Processing & Feature Extraction</h3>
      <p>Sentinel-2 data contains bands at 10m, 20m, and 60m spatial resolutions. DeepSRM-AI first normalizes atmospheric surface reflectance across all 13 bands and uses a spatial-spectral attention layer to preserve inter-band physical consistency.</p>

      <h3>Residual U-Net Architecture</h3>
      <p>The network employs a residual U-Net backbone with skip connections. The encoder extracts multi-scale spatial textures while the decoder splits into two coordinated heads:</p>
      <ul>
        <li><strong>Image Reconstruction Head:</strong> Reconstructs 2.5m enhanced multispectral surface reflectance.</li>
        <li><strong>Semantic Subpixel Head:</strong> Predicts categorical land-cover probabilities at 2.5m resolution.</li>
      </ul>

      <div class="article-callout">
        "By co-optimizing spectral reconstruction loss alongside semantic classification loss, DeepSRM-AI prevents feature distortion and ensures edge alignment."
      </div>

      <div class="key-takeaways-box">
        <div class="takeaways-title">Key Takeaway</div>
        <p>Direct joint training enables DeepSRM-AI to achieve high spatial fidelity while maintaining low computational complexity (&lt; 15MB model footprint).</p>
      </div>
    `
  },
  {
    id: "blog-03",
    slug: "ai-for-agriculture-urban-planning-and-disaster-assessment",
    category: "Applications",
    categoryCode: "applications",
    title: "AI for Agriculture, Urban Planning and Disaster Assessment",
    subtitle: "Transforming open satellite imagery into actionable decision intelligence",
    date: "September 22, 2026",
    readTime: "6 min read",
    excerpt: "Discover how fine-scale super-resolved maps support precision farming, urban sprawl analysis, and rapid emergency disaster recovery.",
    content: `
      <p>High-resolution satellite imagery from commercial satellites can cost thousands of dollars per scene, making continuous monitoring cost-prohibitive for municipal governments and smallholder farming collectives. DeepSRM-AI bridges this gap by enhancing free Sentinel-2 data.</p>
      
      <h3>Precision Agriculture</h3>
      <p>Farmers can track micro-variations in crop vigor across individual fields, identifying early disease outbreaks or irrigation leakages that are completely obscured at 10m resolution.</p>

      <h3>Urban Planning & Infrastructure</h3>
      <p>City planners can automatically track building footprint expansions, road network developments, and informal settlement growth in rapidly urbanizing regions.</p>

      <h3>Disaster Emergency Response</h3>
      <p>During flood events, emergency managers receive 2.5m localized water extent maps, enabling precise identification of flooded roadways and isolated structures.</p>

      <div class="key-takeaways-box">
        <div class="takeaways-title">Key Takeaway</div>
        <p>Unlocking fine spatial detail from free satellite datasets democratizes high-precision spatial analytics for public good applications.</p>
      </div>
    `
  },
  {
    id: "blog-04",
    slug: "understanding-spectral-and-geographic-consistency",
    category: "Architecture",
    categoryCode: "architecture",
    title: "Understanding Spectral and Geographic Consistency",
    subtitle: "Why radiometry and coordinate alignment matter in deep learning SR",
    date: "September 24, 2026",
    readTime: "5 min read",
    excerpt: "Super-resolution for satellite imagery is fundamentally different from photograph enhancement—preserving physical surface reflectance metrics is essential.",
    content: `
      <p>In standard computer vision, super-resolution models prioritize perceptual sharpness—making photos look crisp to human eyes. In satellite remote sensing, however, pixel values represent physical measurements of solar reflectance (radiometry).</p>

      <h3>Spectral Preservation</h3>
      <p>If an AI model sharpens a crop field image but alters the ratio between Red and Near-Infrared (NIR) wavelengths, calculated vegetation indices like NDVI become invalid. DeepSRM-AI incorporates a specialized <strong>Spectral Consistency Loss</strong> to guarantee that energy conservation and physical reflectance ratios are maintained.</p>

      <h3>Geographic Alignment</h3>
      <p>Sub-pixel predictions must map accurately to geographic CRS coordinates. DeepSRM-AI enforces spatial gradient losses to ensure boundaries line up precisely with ground coordinates.</p>

      <div class="key-takeaways-box">
        <div class="takeaways-title">Key Takeaway</div>
        <p>Physical radiometric integrity is non-negotiable in satellite AI. DeepSRM-AI balances visual clarity with scientific quantitative rigor.</p>
      </div>
    `
  },
  {
    id: "blog-05",
    slug: "why-uncertainty-matters-in-ai-based-satellite-mapping",
    category: "Uncertainty & AI",
    categoryCode: "uncertainty",
    title: "Why Uncertainty Matters in AI-Based Satellite Mapping",
    subtitle: "Ensuring responsible and verifiable artificial intelligence in remote sensing",
    date: "September 25, 2026",
    readTime: "6 min read",
    excerpt: "AI model outputs are probabilistic estimates. DeepSRM-AI generates pixel-level confidence maps to highlight areas requiring manual expert verification.",
    content: `
      <p>Deep learning models can occasionally output plausible-looking details that are model inferences rather than true ground reflections. In high-stakes applications like disaster relief or legal boundary disputes, unvalidated AI outputs introduce risk.</p>

      <h3>Confidence & Uncertainty Quantification</h3>
      <p>DeepSRM-AI computes pixel-level variance across model ensemble predictions, generating a spatial confidence map alongside every land-cover classification map.</p>

      <h3>Three-Tier Validation System</h3>
      <ul>
        <li><strong style="color:#10b981;">High Confidence (&gt;85%):</strong> Direct integration into GIS automated pipelines.</li>
        <li><strong style="color:#f59e0b;">Moderate Confidence (60-85%):</strong> Flagged for secondary algorithmic checking.</li>
        <li><strong style="color:#ef4444;">Needs Verification (&lt;60%):</strong> Highlighted for human GIS analyst review.</li>
      </ul>

      <div class="key-takeaways-box">
        <div class="takeaways-title">Key Takeaway</div>
        <p>Responsible AI in Earth observation requires transparency. Providing explicit uncertainty maps ensures human oversight where it matters most.</p>
      </div>
    `
  }
];

function initBlogEngine() {
  const blogGrid = document.getElementById('blog-grid');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const searchInput = document.getElementById('blog-search-input');
  const modalOverlay = document.getElementById('article-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!blogGrid) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function renderBlogCards() {
    blogGrid.innerHTML = '';

    const filtered = blogArticles.filter(article => {
      const matchCat = (currentCategory === 'all') || (article.categoryCode === currentCategory);
      const matchSearch = article.title.toLowerCase().includes(searchQuery) ||
                          article.excerpt.toLowerCase().includes(searchQuery) ||
                          article.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          No research articles match your selected filter criteria.
        </div>
      `;
      return;
    }

    filtered.forEach(article => {
      const card = document.createElement('article');
      card.className = 'blog-card tilt-card';
      card.innerHTML = `
        <div class="blog-card-visual">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="4"/>
            <path d="M7 12h10M12 7v10"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span class="blog-category-badge">${article.category}</span>
            <span>${article.date}</span>
            <span>•</span>
            <span>${article.readTime}</span>
          </div>
          <h3 class="blog-title">${article.title}</h3>
          <p class="blog-excerpt">${article.excerpt}</p>
          <button class="blog-read-more-btn" data-slug="${article.slug}">
            Read Research Paper <span>→</span>
          </button>
        </div>
      `;
      blogGrid.appendChild(card);
    });

    initTiltCards();

    document.querySelectorAll('.blog-read-more-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        openArticleModal(slug);
      });
    });
  }

  function openArticleModal(slug) {
    const article = blogArticles.find(a => a.slug === slug);
    if (!article || !modalOverlay) return;

    document.getElementById('modal-article-category').textContent = article.category;
    document.getElementById('modal-article-date').textContent = article.date;
    document.getElementById('modal-article-readtime').textContent = article.readTime;
    document.getElementById('modal-article-title').textContent = article.title;
    document.getElementById('modal-article-subtitle').textContent = article.subtitle;
    document.getElementById('modal-article-body').innerHTML = article.content;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    window.location.hash = `blog/${slug}`;
  }

  function closeArticleModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      renderBlogCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderBlogCards();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeArticleModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeArticleModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeArticleModal();
  });

  if (window.location.hash.startsWith('#blog/')) {
    const slug = window.location.hash.replace('#blog/', '');
    openArticleModal(slug);
  }

  renderBlogCards();
}

/* --------------------------------------------------------------------------
   9. Intersection Observer for Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   10. Back To Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
