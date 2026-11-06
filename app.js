/**
 * Microbot Architecture Lab — Dual Physical V1 & Cell 2025 Magnetic Swarm Simulator
 * Built with Three.js (WebGL) + OrbitControls + GSAP
 */

// --- Global Simulation Constants ---
const CONFIG = {
  ballRadius: 6.0,          // 12mm Chrome Steel Ball
  socketRadius: 6.2,        // 0.2mm radial clearance
  podLength: 49.5,          // Total pod length to flat tip (movie accurate)
  podBaseWidth: 14.5,       // Hexagonal shoulder max width across flats
  podHeight: 13.0,          // Hexagonal shoulder max height
  magnetOD: 10.0,
  magnetID: 4.5,
  magnetThick: 2.5,
  servoLength: 19.5,
  servoWidth: 7.8,
  servoHeight: 11.2,        // Fits completely inside pod shell!
  pushrodRadius: 0.5,       // 1.0mm diameter wire
  collarRadius: 6.8,
  collarWidth: 2.2,
  maxArticulation: 38.0     // degrees
};

// --- Component Specifications Database for Inspector ---
const COMPONENT_DB = {
  ball: {
    name: "Central Steel Sphere",
    category: "JOINT CORE / BEARING",
    icon: "⚪",
    desc: "Precision grade 100 chrome steel ball bearing serving as the omnidirectional spherical joint contact surface. Retained passively by magnetic attraction from both pods.",
    specs: {
      "Diameter": "12.0 mm (±0.005mm)",
      "Material": "AISI 52100 Chrome Steel",
      "Surface Finish": "Mirror Polished (Ra < 0.05µm)",
      "Hardness": "60–66 HRC",
      "Mass": "7.1 grams",
      "Magnetic Permeability": "High Ferromagnetic"
    },
    cost: "₹30 – ₹50",
    source: "Bearing Distributor / Amazon.in"
  },
  collar: {
    name: "Equatorial Central Hub (Collar)",
    category: "KINEMATIC ANCHOR",
    icon: "⭕",
    desc: "Ultra-low-profile central band clasped around the sphere equator. Solves the Kinematic Reference problem by providing stationary ground anchor pivots for pushrod reaction forces.",
    specs: {
      "Inner Diameter": "12.1 mm (Slip-fit on ball)",
      "Outer Diameter": "14.4 mm",
      "Thickness / Width": "2.4 mm (Minimal footprint)",
      "Material": "PETG or Anodized Aluminum",
      "Pivot Offset": "9.0 mm from sphere center",
      "Mounting": "Detachable benchtop fixture tab"
    },
    cost: "₹25 – ₹40",
    source: "FDM 3D Printed (Maker Lab)"
  },
  magnet: {
    name: "Neodymium N42 Ring Magnet",
    category: "MAGNETIC JOINT ACTUATION",
    icon: "🧲",
    desc: "Axially magnetized rare-earth ring magnet mounted concentrically behind the spherical socket. The annular magnetic field naturally centers the steel sphere along the pod axis.",
    specs: {
      "Dimensions": "10.0 mm OD × 3.0 mm ID × 3.0 mm T",
      "Grade": "N42 NdFeB",
      "Holding Force (Pull)": "5.2 N (~530 gf) @ 0.3mm air gap",
      "Coating": "Ni-Cu-Ni Triple Layer",
      "Retention": "M2 screw backing + retaining lip",
      "Mass": "1.8 grams each"
    },
    cost: "₹60 – ₹90 each",
    source: "Rare Earth Magnet India / Robu.in"
  },
  servo: {
    name: "3.7g Sub-Micro Servo Motor",
    category: "ELECTROMECHANICAL ACTUATION",
    icon: "⚙️",
    desc: "High-power miniature coreless servo mounted longitudinally inside the pod. Directly drives the 1-DOF articulation pushrod to swing the pod around the spherical joint.",
    specs: {
      "Model": "GH-S37A / DSM44 Sub-Micro",
      "Dimensions": "20.0 × 8.5 × 20.0 mm",
      "Stall Torque": "0.65 kg·cm @ 4.8V (5.0x Safety Margin)",
      "Operating Speed": "0.10 sec / 60°",
      "Operating Voltage": "3.7V – 5.0V DC",
      "Mass": "3.7 grams"
    },
    cost: "₹140 – ₹190 each",
    source: "Robu.in / Electronics Hobby Store"
  },
  pushrod: {
    name: "Piano Wire Pushrod Linkage",
    category: "KINEMATIC LINKAGE",
    icon: "📏",
    desc: "High-tensile spring steel pushrod connecting the servo horn to the central equator hub. Converts rotary servo motion into planar pod sweep around the ball center.",
    specs: {
      "Diameter": "1.0 mm (0.040\")",
      "Effective Length": "26.0 mm (Center-to-Center)",
      "Material": "Hardened Spring Carbon Steel",
      "End Termination": "Precision dual Z-bends / micro clevis",
      "Buckling Load": "> 24 N (Far exceeds servo stall)",
      "Mass": "0.4 grams"
    },
    cost: "₹10 – ₹20",
    source: "RC Model Shop / Spring Wire"
  },
  shell: {
    name: "Hexagonal Pyramid Pod Shell",
    category: "STRUCTURAL AIRFRAME",
    icon: "🔺",
    desc: "Aesthetic elongated hexagonal pyramid shell inspired by Big Hero 6 Microbots. A 6-sided hexagonal base at the central sphere tapers into a sleek pyramidal apex. Features internal servo cradle, ring magnet retention pocket, spherical socket, and recessed longitudinal groove details.",
    specs: {
      "Geometry": "True 6-Sided Hexagonal Pyramid",
      "Length": "58.0 mm (Joint Base to Pyramidal Apex)",
      "Base Cross-Section": "24.0 mm × 22.0 mm Hexagon",
      "Apex Profile": "Tapered 6-Faceted Pyramidal Tip",
      "Wall Thickness": "1.6 mm (3 solid perimeters)",
      "Print Material": "PETG (Carbon Black or Stealth Grey)",
      "Socket Chamfer": "40° relief for ±38° swing",
      "Total Shell Mass": "11.2 grams (Lower Chassis + Upper Lid)"
    },
    cost: "₹40 – ₹70 (Filament)",
    source: "Maker Lab 3D Printer"
  },
  hw_motor: {
    name: "12V DC Geared Drive Motor",
    category: "MAGNETIC FIELD ROTOR ACTUATOR",
    icon: "⚙️",
    desc: "High-torque 12V DC geared motor (Model JGA25-370) mounted vertically in the chassis base. Spins the rotor crossbar between 90 and 900 RPM (1.5 to 15 Hz) to generate rotating magnetic flux.",
    specs: {
      "Operating Voltage": "12.0V DC",
      "No-Load Speed": "1000 RPM (Max 16.6 Hz)",
      "Stall Torque": "1.2 kg·cm",
      "Shaft Diameter": "4.0 mm D-Shaft",
      "Control": "12V PWM Dial Speed Controller",
      "Mass": "85 grams"
    },
    cost: "₹350 – ₹550",
    source: "Robu.in / Amazon"
  },
  hw_rotor: {
    name: "3D-Printed Rotor Crossbar",
    category: "MAGNET HOLDER & AXLE",
    icon: "✈️",
    desc: "Rigid FDM 3D-printed rotor bar press-fitted onto the motor D-shaft. Secures the two Neodymium block magnets at an effective radius of 20mm.",
    specs: {
      "Span": "90.0 mm tip-to-tip",
      "Material": "PETG or ABS (Infill 40%)",
      "Magnet Sockets": "25 × 10 × 5 mm pockets",
      "Retention": "M3 grub screw clamp + safety wrap"
    },
    cost: "₹50 (Filament)",
    source: "Maker Lab 3D Printer"
  },
  hw_magnets: {
    name: "N42 Neodymium Block Magnets",
    category: "EXTERNAL MAGNETIC FIELD SOURCE",
    icon: "🧲",
    desc: "Two rare-earth NdFeB block magnets producing a 0.35 Tesla magnetic field gradient. Arranged with North pole facing up on one arm, and South pole facing up on the opposite arm.",
    specs: {
      "Dimensions": "25.0 × 10.0 × 5.0 mm",
      "Grade": "N42 / N52 NdFeB",
      "Surface Flux": "0.35 Tesla (3,500 Gauss)",
      "Orientation": "Vertical Dipole Dipole Array"
    },
    cost: "₹300 – ₹400 (Pair)",
    source: "Rare Earth Magnet India"
  },
  hw_standoff: {
    name: "Brass Hexagonal Standoff Pillars",
    category: "STRUCTURAL RIG ELEVATION",
    icon: "🔩",
    desc: "Four M3 60mm brass standoff pillars elevating the acrylic stage precisely 15–20mm above the spinning magnets to set the optimal magnetic gradient (0.15 to 7.0 T/m).",
    specs: {
      "Height": "60.0 mm",
      "Material": "Solid Brass (Non-Magnetic)",
      "Thread": "M3 Female-to-Female",
      "Air Gap": "15.0 mm to Petri base"
    },
    cost: "₹120 (Pack of 4)",
    source: "Hardware / Drone store"
  },
  hw_cubes: {
    name: "2mm Neodymium Cube Microrobots",
    category: "SWARM AGENTS (MILLI-SCALE)",
    icon: "🧊",
    desc: "Off-the-shelf 2mm nickel-plated neodymium magnetic cubes. In the rotating field, they spontaneously assemble into flexible Head-to-Tail chains and 2D rafts without any cleanroom fabrication.",
    specs: {
      "Dimensions": "2.0 × 2.0 × 2.0 mm",
      "Quantity": "50–100 units in swarm",
      "Plating": "Ni-Cu-Ni Triple Layer",
      "Magnetic Moment": "High Remanence (Br > 1.2 T)",
      "Cooperative Gaits": "Pivoting, Walking, Raft Float"
    },
    cost: "₹350 – ₹500 (Set of 216)",
    source: "Amazon / Magnetic Puzzle sets"
  },
  hw_webcam: {
    name: "Overhead USB Camera (Computer Vision)",
    category: "AI CLOSED-LOOP SENSOR",
    icon: "📹",
    desc: "1080p USB webcam mounted on a flexible gooseneck arm directly above the petri dish. Feeds real-time video into OpenCV / Python to track the swarm centroid and automate gait control.",
    specs: {
      "Resolution": "1920 × 1080 @ 30 FPS",
      "Interface": "USB 2.0 / UVC Plug-and-Play",
      "Lens": "Wide-angle low distortion",
      "Tracking Latency": "< 15 ms via Python OpenCV"
    },
    cost: "₹600 – ₹1,200",
    source: "Amazon / Local PC Store"
  }
};

// --- Step-by-Step Interactive Assembly Guide Database ---
const ASSEMBLY_GUIDE_STEPS = [
  {
    step: 1,
    title: "12mm Steel Sphere & Equatorial Collar Hub",
    where: "Center origin of the robot (0,0,0). The 2.4mm collar band slides directly over the equator of the sphere between the two pod socket openings.",
    how: "1. Take your polished 12mm G100 chrome steel ball.\n2. Slide the 3D-printed PETG collar ring onto the equator of the ball.\n3. Position the two brass pivot ears horizontally facing outward (along the ±X lateral axes).\n4. CRITICAL: Do NOT glue the collar to the ball—it must rotate freely with smooth slip-fit clearance.",
    works: "Solves Newton's 3rd Law reference dilemma. The collar acts as the stationary 'ground anchor'. When the pod servos pull on their pushrods, they push against this collar ring rather than slipping helplessly on the ball.",
    tip: "Apply a tiny smear of synthetic silicone grease or dry PTFE lubricant on the ball before slipping the collar for effortless zero-backlash swivel.",
    camPos: { x: 26, y: 15, z: 32 },
    camTarget: { x: 0, y: 0, z: 0 },
    focusPart: 'collar'
  },
  {
    step: 2,
    title: "Neodymium N42 Ring Magnets (10×3mm)",
    where: "Inside the cylindrical recessed pocket located directly behind the front spherical socket cup inside Pod 1 and Pod 2.",
    how: "1. Press-fit one 10mm OD × 3mm ID ring magnet into the socket recess of each pod.\n2. Apply one tiny drop of Cyanoacrylate (superglue) on the back face to secure it.\n3. Ensure axial magnetic orientation pulls the steel ball inward firmly.",
    works: "Generates 5.2 N (~530 gf) of passive magnetic clamping force. It locks the pod securely onto the steel sphere without mechanical screws, while allowing 360° omnidirectional low-friction gliding.",
    tip: "Test magnet fit without glue first. Ensure the magnet sits completely flush against the inner socket backwall so it doesn't rub directly on the ball.",
    camPos: { x: 30, y: 18, z: 36 },
    camTarget: { x: 0, y: 2, z: 10 },
    focusPart: 'magnet'
  },
  {
    step: 3,
    title: "Sub-Micro 3.7g Servos (GH-S37A / DSM44)",
    where: "Mounted longitudinally inside the middle body cavity of Pod 1 and Pod 2, with the gear spline output facing upwards.",
    how: "1. Slide the 3.7g micro servo into the printed mounting cradle ribs.\n2. Power on the servo with an Arduino or servo tester to center the spline at 90° neutral before pressing on the single-arm servo horn.\n3. Secure the servo chassis with a dab of silicone adhesive or small M1.4 screw.",
    works: "Primary electromechanical actuator. Delivers 0.65 kg·cm stall torque at 4.8V (5.0× safety margin), rotating its horn arm to drive the pushrod linkage back and forth.",
    tip: "Route the 3-wire servo lead (GND, 5V, Signal) through the rear internal wire groove towards the apex before securing the servo.",
    camPos: { x: 36, y: 24, z: 42 },
    camTarget: { x: 0, y: 0, z: 22 },
    focusPart: 'servo'
  },
  {
    step: 4,
    title: "1.0mm Piano Wire Pushrod Linkages",
    where: "Spans directly from the outermost hole on the servo horn to the pivot ear on the central equatorial collar (effective length: 26.0mm).",
    how: "1. Cut a 30mm piece of 1.0mm spring steel piano wire.\n2. Use needle-nose pliers to bend a 90° Z-bend on each end (26.0mm effective center-to-center length).\n3. Hook one end into the servo horn and the other into the collar pivot ear pin.",
    works: "Converts the rotary sweep of the servo motor into linear push/pull force relative to the collar anchor, tilting the entire pod up and down around the spherical ball joint (±38° range).",
    tip: "Keep the Z-bends tight (<0.2mm tolerance). Any slack in the wire bends will reduce your pitch angle accuracy and create mechanical backlash.",
    camPos: { x: 22, y: 14, z: 24 },
    camTarget: { x: 5, y: 2, z: 12 },
    focusPart: 'pushrod'
  },
  {
    step: 5,
    title: "Hexagonal Pyramid Pod Shells (Chassis & Lid)",
    where: "Outer protective aerodynamic chassis encasing the servo, magnets, and linkage, forming the iconic Big Hero 6 hexagonal pyramid body.",
    how: "1. Seat the lower chassis around the ball and servo.\n2. Route the servo lead out the apex connector port.\n3. Align the upper snap lid's alignment pins into the lower chassis mating sockets and press until it clicks flush.",
    works: "Provides structural airframe stiffness, protects internal electronics from impacts, and features a 40° relief chamfer at the spherical socket to allow full ±38° pitch sweep without mechanical collision.",
    tip: "3D print with 0.12mm layer height in black PETG or tough resin with 3 perimeters for high rigidity and smooth joint facets.",
    camPos: { x: 65, y: 35, z: 75 },
    camTarget: { x: 0, y: 0, z: 0 },
    focusPart: 'shell'
  },
  {
    step: 6,
    title: "Microcontroller Brain & Power Wiring (ESP32-C3)",
    where: "External tether cable or micro battery / ESP32-C3 SuperMini board at the pod apex.",
    how: "1. Connect Pod 1 Servo signal to GPIO 1 (D1), Pod 2 Servo signal to GPIO 2 (D2).\n2. Wire both servo power leads directly to battery (+) and GND to battery (-).\n3. Flash the crawl gait firmware sketch via Arduino IDE.",
    works: "The ESP32 microcontroller executes sine-wave gait kinematics (anti-phase crawl or in-phase climb) by outputting 50Hz PWM signals to drive both servos autonomously.",
    tip: "Do not power the servos through the microcontroller's 3.3V pin—servos draw up to 500mA stall spikes that can brown-out the board. Feed battery power directly to servo red wires.",
    camPos: { x: 60, y: 45, z: 90 },
    camTarget: { x: 0, y: 0, z: 0 },
    focusPart: 'all'
  }
];

// --- Application State ---
const state = {
  systemTab: 'v1',         // 'v1' or 'swarm'
  mode: 'assembly',        // 'assembly', 'explode', 'articulate', 'guide'
  guideStep: 0,            // 0 to 5
  explodePercent: 0,       // 0 to 100
  pod1Angle: 0,            // degrees (-38 to +38)
  pod2Angle: 0,            // degrees (-38 to +38)
  isXray: false,
  isCutaway: false,
  showLabels: true,
  showFlux: true,
  gait: null,              // null, 'antiphase', 'inphase'
  selectedComponent: null,

  // Big Hero 6 Movie Swarm & Multi-Bot Coordination State
  swarm: {
    formation: 'hand',       // 'hand', 'chain', 'bridge', 'wave', 'tower'
    count: 140,              // 20 to 140 bots
    speed: 1.0,              // 0.2 to 2.5x
    neuralFollow: true,      // Swarm follows cursor
    mousePos: new THREE.Vector2(0, 0),
    isScattered: false
  }
};

// --- Three.js Setup ---
let scene, camera, renderer, controls;
let container = document.getElementById('canvas-container');

// Group Hierarchies
let worldGroup;            // Physical Microbot V1
let swarmGroup;            // Big Hero 6 Movie Swarm Lab
let ballMesh, collarGroup;
let pod1Pivot, pod1Group, pod1ShellLower, pod1ShellUpper, pod1Magnet, pod1Servo, pod1Horn, pod1Pushrod;
let pod2Pivot, pod2Group, pod2ShellLower, pod2ShellUpper, pod2Magnet, pod2Servo, pod2Horn, pod2Pushrod;
let fluxGroup;
let annotations = [];

// Movie Swarm Simulation Objects
let movieBots = [];
let swarmObstacleGroup = null;
let obsWallMesh = null, obsChasmLeft = null, obsChasmRight = null, obsCargoBox = null;

// Web Serial API Hardware Link
let hardwareSerialPort = null;
let hardwareSerialWriter = null;
let isHardwareConnected = false;
let swarmCenterOffset = new THREE.Vector3(0, 12, 0);

// Raycasting for interactive click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function setSafeText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function showErrorOverlay(message) {
  const container = document.getElementById('canvas-container') || document.body;
  const existing = document.getElementById('error-overlay');
  if (existing) existing.remove();

  const errDiv = document.createElement('div');
  errDiv.id = 'error-overlay';
  errDiv.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(20, 24, 34, 0.95);
    border: 1px solid #ff3366;
    border-radius: 12px;
    padding: 24px 32px;
    color: #f0f4f8;
    font-family: 'Outfit', sans-serif;
    text-align: center;
    max-width: 500px;
    z-index: 1000;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255,51,102,0.3);
  `;
  errDiv.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
    <h3 style="color: #ff3366; margin-bottom: 8px; font-size: 18px; font-weight: 600;">Simulation Error</h3>
    <p style="color: #8b9bb4; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">${message}</p>
    <button onclick="location.reload()" style="background: #00f3ff; color: #0a0c10; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">Reload Page</button>
  `;
  container.appendChild(errDiv);
}

// --- Initialization ---
function init() {
  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded. Check internet connection for CDN scripts.");
    showErrorOverlay("Three.js 3D library failed to load. Please check your internet connection and reload.");
    return;
  }

  try {
    initThree();
    buildEnvironment();
    buildMicrobotModel();
    buildMagneticFluxLines();
    buildSwarmEnvironment(); // Initialize Big Hero 6 movie swarm units
    create3DAnnotations();
    setupUIEventListeners();
    setupWindowResize();
    updateAssemblyGuideUI();
    animate();
  } catch (err) {
    console.error("Error during Microbot prototype initialization:", err);
    showErrorOverlay("Simulation failed to start: " + err.message);
  }
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0c10);
  scene.fog = new THREE.FogExp2(0x0a0c10, 0.005);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 1000);
  camera.position.set(110, 36, 85);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 250;
  controls.minDistance = 15;
  controls.target.set(0, 0, 0);

  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  swarmGroup = new THREE.Group();
  swarmGroup.visible = false;
  scene.add(swarmGroup);
}

function buildEnvironment() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const mainDirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  mainDirLight.position.set(60, 100, 60);
  mainDirLight.castShadow = true;
  mainDirLight.shadow.mapSize.width = 2048;
  mainDirLight.shadow.mapSize.height = 2048;
  mainDirLight.shadow.bias = -0.0005;
  scene.add(mainDirLight);

  const cyanFill = new THREE.DirectionalLight(0x00f3ff, 1.2);
  cyanFill.position.set(-60, 30, -50);
  scene.add(cyanFill);

  const rimLight = new THREE.DirectionalLight(0xff7b00, 0.8);
  rimLight.position.set(0, -60, -40);
  scene.add(rimLight);

  const gridHelper = new THREE.GridHelper(200, 40, 0x00f3ff, 0x182433);
  gridHelper.position.y = -35;
  scene.add(gridHelper);

  const planeGeo = new THREE.PlaneGeometry(250, 250);
  const planeMat = new THREE.ShadowMaterial({ opacity: 0.35 });
  const ground = new THREE.Mesh(planeGeo, planeMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -35;
  ground.receiveShadow = true;
  scene.add(ground);
}

// --- High-Fidelity 3D CAD Geometry Generator for V1 ---
function buildMicrobotModel() {
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0x282e38, metalness: 0.94, roughness: 0.16 });
  const collarMat = new THREE.MeshStandardMaterial({ color: 0x141820, metalness: 0.7, roughness: 0.35 });
  const pinBrassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.85, roughness: 0.25 });
  const magnetMat = new THREE.MeshStandardMaterial({ color: 0xd6dde6, metalness: 0.92, roughness: 0.12 });
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x151922, roughness: 0.28, metalness: 0.62, side: THREE.DoubleSide });
  const servoBodyMat = new THREE.MeshStandardMaterial({ color: 0x0055aa, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.85 });
  const servoHornMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.2 });
  const pushrodMat = new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.9, roughness: 0.1 });

  // 1. Central 12mm Polished Steel Ball
  const ballGeo = new THREE.SphereGeometry(CONFIG.ballRadius, 64, 64);
  ballMesh = new THREE.Mesh(ballGeo, chromeMat);
  ballMesh.castShadow = true;
  ballMesh.userData = { id: 'ball' };
  worldGroup.add(ballMesh);

  // 2. Equatorial Central Hub (Collar)
  collarGroup = new THREE.Group();
  collarGroup.userData = { id: 'collar' };

  const ringGeo = new THREE.CylinderGeometry(CONFIG.collarRadius, CONFIG.collarRadius, CONFIG.collarWidth, 48, 1, true);
  const ringMesh = new THREE.Mesh(ringGeo, collarMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.castShadow = true;
  collarGroup.add(ringMesh);

  const earGeo = new THREE.BoxGeometry(2.4, 2.0, 3.5);
  const ear1 = new THREE.Mesh(earGeo, collarMat);
  ear1.position.set(CONFIG.collarRadius + 1.2, 0, 0);
  collarGroup.add(ear1);

  const ear2 = new THREE.Mesh(earGeo, collarMat);
  ear2.position.set(-(CONFIG.collarRadius + 1.2), 0, 0);
  collarGroup.add(ear2);

  const pinGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.2, 16);
  const pin1 = new THREE.Mesh(pinGeo, pinBrassMat);
  pin1.position.copy(ear1.position);
  collarGroup.add(pin1);

  const pin2 = new THREE.Mesh(pinGeo, pinBrassMat);
  pin2.position.copy(ear2.position);
  collarGroup.add(pin2);

  worldGroup.add(collarGroup);

  // 3. POD 1 (Upper / Left Arm)
  pod1Pivot = new THREE.Group();
  worldGroup.add(pod1Pivot);

  pod1Group = new THREE.Group();
  pod1Pivot.add(pod1Group);

  buildPodComponents(pod1Group, {
    direction: 1,
    shellMat,
    magnetMat,
    servoBodyMat,
    servoHornMat,
    pushrodMat,
    earPosition: ear1.position
  });

  // 4. POD 2 (Lower / Right Arm)
  pod2Pivot = new THREE.Group();
  pod2Pivot.rotation.y = Math.PI;
  worldGroup.add(pod2Pivot);

  pod2Group = new THREE.Group();
  pod2Pivot.add(pod2Group);

  buildPodComponents(pod2Group, {
    direction: -1,
    shellMat,
    magnetMat,
    servoBodyMat,
    servoHornMat,
    pushrodMat,
    earPosition: ear2.position
  });
}

function buildPodComponents(parentGroup, opts) {
  const isPod1 = opts.direction === 1;
  const innerGroup = new THREE.Group();
  parentGroup.add(innerGroup);

  // Ring Magnet
  const magnetShape = new THREE.Shape();
  magnetShape.absarc(0, 0, CONFIG.magnetOD / 2, 0, Math.PI * 2, false);
  const holePath = new THREE.Path();
  holePath.absarc(0, 0, CONFIG.magnetID / 2, 0, Math.PI * 2, true);
  magnetShape.holes.push(holePath);

  const extrudeSettings = { depth: CONFIG.magnetThick, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
  const magnetGeo = new THREE.ExtrudeGeometry(magnetShape, extrudeSettings);
  const magnetMesh = new THREE.Mesh(magnetGeo, opts.magnetMat);
  magnetMesh.position.set(0, 0, 7.0);
  magnetMesh.castShadow = true;
  magnetMesh.userData = { id: 'magnet' };
  innerGroup.add(magnetMesh);

  if (isPod1) pod1Magnet = magnetMesh;
  else pod2Magnet = magnetMesh;

  // Servo Assembly (Scaled to 3.7g sub-micro specifications)
  const servoGroup = new THREE.Group();
  servoGroup.position.set(0, 0, 23.0);
  servoGroup.userData = { id: 'servo' };

  const bodyGeo = new THREE.BoxGeometry(CONFIG.servoWidth, CONFIG.servoHeight, CONFIG.servoLength);
  const bodyMesh = new THREE.Mesh(bodyGeo, opts.servoBodyMat);
  bodyMesh.castShadow = true;
  servoGroup.add(bodyMesh);

  const gearHubGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.8, 16);
  const gearHub = new THREE.Mesh(gearHubGeo, opts.servoHornMat);
  gearHub.position.set(CONFIG.servoWidth / 2 + 0.6, 1.5, -3.0);
  gearHub.rotation.z = Math.PI / 2;
  servoGroup.add(gearHub);

  const hornArmGeo = new THREE.BoxGeometry(1.1, 1.6, 5.8);
  const hornMesh = new THREE.Mesh(hornArmGeo, opts.servoHornMat);
  hornMesh.position.set(CONFIG.servoWidth / 2 + 1.2, 1.5, 0.2);
  servoGroup.add(hornMesh);

  innerGroup.add(servoGroup);
  if (isPod1) {
    pod1Servo = servoGroup;
    pod1Horn = hornMesh;
  } else {
    pod2Servo = servoGroup;
    pod2Horn = hornMesh;
  }

  // Pushrod Linkage (Encased longitudinally inside pod cavity)
  const rodGeo = new THREE.CylinderGeometry(CONFIG.pushrodRadius, CONFIG.pushrodRadius, 14.0, 16);
  const rodMesh = new THREE.Mesh(rodGeo, opts.pushrodMat);
  rodMesh.castShadow = true;
  rodMesh.position.set(CONFIG.servoWidth / 2 + 0.6, 1.0, 15.0);
  rodMesh.rotation.x = Math.PI / 2;
  rodMesh.userData = { id: 'pushrod' };
  innerGroup.add(rodMesh);

  if (isPod1) pod1Pushrod = rodMesh;
  else pod2Pushrod = rodMesh;

  // Hexagonal Pod Shell (Movie Accurate, Flat Tip)
  const shellLower = createHexagonalPodShell(opts.shellMat, false);
  shellLower.userData = { id: 'shell' };
  innerGroup.add(shellLower);

  const shellUpper = createHexagonalPodShell(opts.shellMat, true);
  shellUpper.position.y = 0; // Flush seamless mating when assembled!
  shellUpper.userData = { id: 'shell' };
  innerGroup.add(shellUpper);

  if (isPod1) {
    pod1ShellLower = shellLower;
    pod1ShellUpper = shellUpper;
  } else {
    pod2ShellLower = shellLower;
    pod2ShellUpper = shellUpper;
  }
}

function getHexVerticesAtZ(z, r) {
  const h = Math.sqrt(3) / 2.0 * r;
  const wHalf = r / 2.0;
  return [
    [wHalf, h, z],    // 0: Top-right
    [r, 0.0, z],      // 1: Mid-right
    [wHalf, -h, z],   // 2: Bottom-right
    [-wHalf, -h, z],  // 3: Bottom-left
    [-r, 0.0, z],     // 4: Mid-left
    [-wHalf, h, z]    // 5: Top-left
  ];
}

function createHexagonalPodShell(mat, isUpperLid) {
  const shellGroup = new THREE.Group();

  // Movie-Accurate Stations from Big Hero 6 screenshot:
  // Base opens around ball -> Widens to maximum shoulder with latch slots -> Long gentle hexagonal taper -> Silver beveled collar -> Flat hexagonal blunt tip (NO SPIKES!)
  const stations = [
    { z: 6.2,  r: 6.0 },   // Level 0: Spherical socket opening
    { z: 10.5, r: 8.0 },   // Level 1: Shoulder peak (maximum width, 13.9mm across flats)
    { z: 16.0, r: 7.7 },   // Level 2: Shoulder facet band (latch slot region)
    { z: 44.0, r: 4.8 },   // Level 3: Main body tapered shaft end
    { z: 47.0, r: 4.3 },   // Level 4: Metallic collar bevel start
    { z: 49.5, r: 3.9 }    // Level 5: Flat terminal tip (6.8mm across flats, blunt end!)
  ];

  const rings = stations.map(s => getHexVerticesAtZ(s.z, s.r));

  // 1. Main Dark Shell Body (stations 0 to 4: z = 6.2 to 47.0)
  const bodyGeom = new THREE.BufferGeometry();
  const bodyVerts = [];

  for (let i = 0; i < 4; i++) {
    const r1 = rings[i];
    const r2 = rings[i + 1];

    if (isUpperLid) {
      bodyVerts.push(...r1[4], ...r1[5], ...r2[5]);
      bodyVerts.push(...r1[4], ...r2[5], ...r2[4]);
      bodyVerts.push(...r1[5], ...r1[0], ...r2[0]);
      bodyVerts.push(...r1[5], ...r2[0], ...r2[5]);
      bodyVerts.push(...r1[0], ...r1[1], ...r2[1]);
      bodyVerts.push(...r1[0], ...r2[1], ...r2[0]);
    } else {
      bodyVerts.push(...r1[1], ...r1[2], ...r2[2]);
      bodyVerts.push(...r1[1], ...r2[2], ...r2[1]);
      bodyVerts.push(...r1[2], ...r1[3], ...r2[3]);
      bodyVerts.push(...r1[2], ...r2[3], ...r2[2]);
      bodyVerts.push(...r1[3], ...r1[4], ...r2[4]);
      bodyVerts.push(...r1[3], ...r2[4], ...r2[3]);
    }
  }

  bodyGeom.setAttribute('position', new THREE.Float32BufferAttribute(bodyVerts, 3));
  bodyGeom.computeVertexNormals();
  const bodyMesh = new THREE.Mesh(bodyGeom, mat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  shellGroup.add(bodyMesh);

  // 2. Movie-Accurate Silver/Titanium Chamfered Collar (stations 4 to 5: z = 47.0 to 49.5)
  const collarTipMat = new THREE.MeshStandardMaterial({
    color: 0x95a1b3,
    metalness: 0.94,
    roughness: 0.22
  });
  const collarGeom = new THREE.BufferGeometry();
  const collarVerts = [];
  const r4 = rings[4];
  const r5 = rings[5];

  if (isUpperLid) {
    collarVerts.push(...r4[4], ...r4[5], ...r5[5]);
    collarVerts.push(...r4[4], ...r5[5], ...r5[4]);
    collarVerts.push(...r4[5], ...r4[0], ...r5[0]);
    collarVerts.push(...r4[5], ...r5[0], ...r5[5]);
    collarVerts.push(...r4[0], ...r4[1], ...r5[1]);
    collarVerts.push(...r4[0], ...r5[1], ...r5[0]);
  } else {
    collarVerts.push(...r4[1], ...r4[2], ...r5[2]);
    collarVerts.push(...r4[1], ...r5[2], ...r5[1]);
    collarVerts.push(...r4[2], ...r4[3], ...r5[3]);
    collarVerts.push(...r4[2], ...r5[3], ...r5[2]);
    collarVerts.push(...r4[3], ...r4[4], ...r5[4]);
    collarVerts.push(...r4[3], ...r5[4], ...r5[3]);
  }

  collarGeom.setAttribute('position', new THREE.Float32BufferAttribute(collarVerts, 3));
  collarGeom.computeVertexNormals();
  const collarMesh = new THREE.Mesh(collarGeom, collarTipMat);
  collarMesh.castShadow = true;
  collarMesh.receiveShadow = true;
  shellGroup.add(collarMesh);

  // 3. Flat Terminal Hexagonal End Cap at z = 49.5 (Blunt tip, NOT A POINT!)
  const capGeom = new THREE.BufferGeometry();
  const capVerts = [];
  const tipZ = stations[5].z;
  const tipCenter = [0, 0, tipZ];

  if (isUpperLid) {
    capVerts.push(...tipCenter, ...r5[4], ...r5[5]);
    capVerts.push(...tipCenter, ...r5[5], ...r5[0]);
    capVerts.push(...tipCenter, ...r5[0], ...r5[1]);
  } else {
    capVerts.push(...tipCenter, ...r5[1], ...r5[2]);
    capVerts.push(...tipCenter, ...r5[2], ...r5[3]);
    capVerts.push(...tipCenter, ...r5[3], ...r5[4]);
  }

  capGeom.setAttribute('position', new THREE.Float32BufferAttribute(capVerts, 3));
  capGeom.computeVertexNormals();
  const capMesh = new THREE.Mesh(capGeom, mat);
  capMesh.castShadow = true;
  shellGroup.add(capMesh);

  // 4. Movie-Accurate Flat Tip Magnet Docking Port (circular dark recessed core)
  const tipMagnetGeo = new THREE.CircleGeometry(2.1, 24);
  const tipMagnetMat = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.95, roughness: 0.1 });
  const tipMagnet = new THREE.Mesh(tipMagnetGeo, tipMagnetMat);
  tipMagnet.position.set(0, 0, tipZ + 0.05);
  shellGroup.add(tipMagnet);

  // Movie-Accurate Rectangular Latch Ports on Shoulder Facets (as seen in screenshot)
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.95, metalness: 0.1 });
  const slotGeo = new THREE.BoxGeometry(0.5, 1.6, 2.8);

  const slotY = isUpperLid ? (stations[1].r * 0.72) : (-stations[1].r * 0.72);
  const slotZ1 = 12.2;
  const slotZ2 = 15.0;

  [-stations[1].r * 0.38, stations[1].r * 0.38].forEach(slotX => {
    const slotMesh1 = new THREE.Mesh(slotGeo, slotMat);
    slotMesh1.position.set(slotX, slotY, slotZ1);
    shellGroup.add(slotMesh1);

    const slotMesh2 = new THREE.Mesh(slotGeo, slotMat);
    slotMesh2.position.set(slotX, slotY, slotZ2);
    shellGroup.add(slotMesh2);
  });

  // Longitudinal Aerodynamic Crease Grooves along the long body
  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: 0.9, metalness: 0.1 });
  const grooveGeo = new THREE.BoxGeometry(0.5, 0.3, 26.0);
  [-2.2, 2.2].forEach(gx => {
    const gMesh = new THREE.Mesh(grooveGeo, grooveMat);
    gMesh.position.set(gx, isUpperLid ? (stations[2].r * 0.62) : (-stations[2].r * 0.62), 30.5);
    shellGroup.add(gMesh);
  });

  // Lower Chassis: Concave socket cup and red magnetic joint accent
  if (!isUpperLid) {
    const socketCupGeo = new THREE.SphereGeometry(CONFIG.socketRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const socketCupMat = new THREE.MeshStandardMaterial({ color: 0x242d38, roughness: 0.15, metalness: 0.3, side: THREE.BackSide });
    const socketCup = new THREE.Mesh(socketCupGeo, socketCupMat);
    socketCup.position.set(0, 0, 0);
    shellGroup.add(socketCup);

    // Movie-Accurate Emissive Red Socket Ring
    const movieRingGeo = new THREE.TorusGeometry(CONFIG.socketRadius * 0.96, 0.4, 16, 32);
    const movieRingMat = new THREE.MeshStandardMaterial({ color: 0xff3311, emissive: 0xff2200, emissiveIntensity: 1.8, roughness: 0.2 });
    const movieRing = new THREE.Mesh(movieRingGeo, movieRingMat);
    movieRing.position.set(0, 0, 1.2);
    shellGroup.add(movieRing);
  }

  return shellGroup;
}

function buildMagneticFluxLines() {
  fluxGroup = new THREE.Group();
  const fluxMat = new THREE.LineDashedMaterial({
    color: 0x00f3ff,
    dashSize: 1.5,
    gapSize: 0.8,
    linewidth: 2,
    transparent: true,
    opacity: 0.75
  });

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 9.0),
      new THREE.Vector3(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5, 5.0),
      new THREE.Vector3(Math.cos(angle) * 7.5, Math.sin(angle) * 7.5, -4.0),
      new THREE.Vector3(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, -9.0)
    );

    const points = curve.getPoints(36);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, fluxMat);
    line.computeLineDistances();
    fluxGroup.add(line);
  }

  worldGroup.add(fluxGroup);
}

// --- Big Hero 6 Movie Swarm & Multi-Bot Collective Coordination Simulation ---

function buildSwarmEnvironment() {
  swarmGroup.clear();
  movieBots = [];

  // Shared Materials for High-Performance Rendering
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.05
  });
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x141822,
    metalness: 0.78,
    roughness: 0.28,
    flatShading: true
  });
  const redRingMat = new THREE.MeshStandardMaterial({
    color: 0xff2200,
    emissive: 0xff1100,
    emissiveIntensity: 1.2,
    roughness: 0.2
  });

  // Shared Geometries - Movie-Accurate Blunt Hexagonal Pods (Flat Tip, No Spikes!)
  const ballGeo = new THREE.SphereGeometry(1.6, 16, 16);
  // Composite Movie Pod: Shoulder flare (1.4 -> 1.95) + Tapered hexagonal shaft (1.95 -> 1.15) + Silver collar (1.15 -> 0.95 flat tip)
  const shoulderGeo = new THREE.CylinderGeometry(1.95, 1.4, 1.2, 6);
  const shaftGeo = new THREE.CylinderGeometry(1.15, 1.95, 5.4, 6);
  const tipCollarGeo = new THREE.CylinderGeometry(0.95, 1.15, 0.8, 6);
  const silverCollarMat = new THREE.MeshStandardMaterial({ color: 0x8c96a5, metalness: 0.92, roughness: 0.2 });
  const ringGeo = new THREE.TorusGeometry(1.7, 0.22, 8, 24);

  // Spawn 140 Movie-Accurate Microbot Units
  const TOTAL_BOTS = 140;
  for (let i = 0; i < TOTAL_BOTS; i++) {
    const bot = new THREE.Group();

    // Central 12mm Chrome Steel Ball
    const ball = new THREE.Mesh(ballGeo, chromeMat);
    ball.castShadow = true;
    bot.add(ball);

    // Helper to build a movie-accurate pod with flat blunt tip and silver collar
    function createMovieSwarmPod() {
      const pGroup = new THREE.Group();
      // 1. Shoulder Flare (widens from ball)
      const mShoulder = new THREE.Mesh(shoulderGeo, shellMat);
      mShoulder.position.y = 0.6;
      pGroup.add(mShoulder);

      // 2. Main Hexagonal Shaft (gently tapers to 1.15, NOT a spike!)
      const mShaft = new THREE.Mesh(shaftGeo, shellMat);
      mShaft.position.y = 3.9;
      pGroup.add(mShaft);

      // 3. Silver Chamfered Collar & Flat End Cap (terminates at flat 0.95mm hexagon!)
      const mCollar = new THREE.Mesh(tipCollarGeo, silverCollarMat);
      mCollar.position.y = 7.0;
      pGroup.add(mCollar);

      return pGroup;
    }

    // Upper Hexagonal Pod (+Z)
    const pod1 = createMovieSwarmPod();
    pod1.position.z = 1.0;
    pod1.rotation.x = Math.PI / 2;
    bot.add(pod1);

    // Lower Hexagonal Pod (-Z)
    const pod2 = createMovieSwarmPod();
    pod2.position.z = -1.0;
    pod2.rotation.x = -Math.PI / 2;
    bot.add(pod2);

    // Movie-Accurate Emissive Red Magnetic Joint Accents
    const r1 = new THREE.Mesh(ringGeo, redRingMat);
    r1.position.z = 1.3;
    bot.add(r1);

    const r2 = new THREE.Mesh(ringGeo, redRingMat);
    r2.position.z = -1.3;
    bot.add(r2);

    // Disperse initially
    const r = Math.sqrt(Math.random()) * 45;
    const theta = Math.random() * Math.PI * 2;
    bot.position.set(Math.cos(theta) * r, 10 + (Math.random() - 0.5) * 20, Math.sin(theta) * r);
    bot.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    bot.userData = {
      index: i,
      active: true,
      targetPos: new THREE.Vector3(),
      targetRot: new THREE.Euler(),
      basePos: new THREE.Vector3(),
      role: 'palm',
      fingerParam: { finger: 'middle', joint: 0, t: 0 },
      chainParam: { chainIdx: 0, posInChain: 0 },
      waveParam: { gridX: 0, gridZ: 0 }
    };

    swarmGroup.add(bot);
    movieBots.push(bot);
  }

  // Ground plane in Swarm mode
  const swarmGrid = new THREE.GridHelper(260, 52, 0x00f3ff, 0x182433);
  swarmGrid.position.y = -25;
  swarmGroup.add(swarmGrid);

  // Obstacle Sandbox Props (Wall, Chasm, Cargo Box)
  swarmObstacleGroup = new THREE.Group();
  swarmObstacleGroup.visible = false;

  // 1. Concrete Wall (28mm elevation)
  const wallGeo = new THREE.BoxGeometry(60, 34, 12);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.7, metalness: 0.2 });
  obsWallMesh = new THREE.Mesh(wallGeo, wallMat);
  obsWallMesh.position.set(0, -8, -15);
  obsWallMesh.castShadow = true;
  obsWallMesh.receiveShadow = true;
  swarmObstacleGroup.add(obsWallMesh);

  // 2. Canyon Chasm Ledges
  const ledgeGeo = new THREE.BoxGeometry(42, 28, 55);
  const ledgeMat = new THREE.MeshStandardMaterial({ color: 0x181e28, roughness: 0.85, metalness: 0.1 });
  obsChasmLeft = new THREE.Mesh(ledgeGeo, ledgeMat);
  obsChasmLeft.position.set(-62, -11, 0);
  obsChasmLeft.receiveShadow = true;
  swarmObstacleGroup.add(obsChasmLeft);

  obsChasmRight = new THREE.Mesh(ledgeGeo, ledgeMat);
  obsChasmRight.position.set(62, -11, 0);
  obsChasmRight.receiveShadow = true;
  swarmObstacleGroup.add(obsChasmRight);

  // 3. Heavy Payload / Cargo Box
  const boxGeo = new THREE.BoxGeometry(15, 11, 15);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.85, roughness: 0.2 });
  obsCargoBox = new THREE.Mesh(boxGeo, boxMat);
  obsCargoBox.position.set(0, 16, -15);
  obsCargoBox.castShadow = true;
  swarmObstacleGroup.add(obsCargoBox);

  swarmGroup.add(swarmObstacleGroup);

  // Apply default formation: Colossal Robotic Hand
  applyMovieSwarmFormation('hand');
}

function applyMovieSwarmFormation(formationKey) {
  state.swarm.formation = formationKey;
  const count = state.swarm.count;

  // Description & specs database
  const formationDB = {
    hand: {
      name: "Colossal Robotic Hand",
      badge: "FORMATION: COLOSSAL ROBOTIC HAND",
      desc: "Microbots self-assemble into a functional articulated hand with palm, wrist, and 5 flexing digits executing coordinated gripping.",
      rigidity: "High Dynamic (Articulated Grip)",
      stateText: "SYNCHRONIZED GRIP"
    },
    chain: {
      name: "Articulated Spine Chain",
      badge: "FORMATION: ARTICULATED SPINE CHAIN",
      desc: "Multi-unit kinematic centipede chain linked apex-to-ball, executing undulatory traveling-wave crawling locomotion via ESP-NOW sync.",
      rigidity: "Serial Multi-Link (Traveling Wave)",
      stateText: "UNDULATORY CRAWL"
    },
    bridge: {
      name: "Suspension Bridge Arch",
      badge: "FORMATION: SUSPENSION BRIDGE ARCH",
      desc: "Parabolic catenary arch spanning across two load-bearing support towers. Illustrates high tensile & compressive lattice distribution.",
      rigidity: "Ultra-High Static Lattice",
      stateText: "LOAD-BEARING ARCH"
    },
    wave: {
      name: "Dynamic Swarm Wave",
      badge: "FORMATION: DYNAMIC SWARM WAVE",
      desc: "Hundreds of Microbots flowing in a collective fluid wave, dynamically rippling in 3D and following neural headband cursor direction.",
      rigidity: "Fluid Flocking (Reynolds Mesh)",
      stateText: "NEURAL FLUID FLOW"
    },
    tower: {
      name: "Heavy Support Pillar",
      badge: "FORMATION: HEAVY SUPPORT PILLAR",
      desc: "Dense vertical hexagonal column with interlocking facets, engineered for high-altitude vertical payload elevation.",
      rigidity: "Compressive Column (4.2 kN Capacity)",
      stateText: "COLUMN RIGID"
    },
    obs_wall: {
      name: "28mm Wall Climb Ramp",
      badge: "OBSTACLE: 28mm WALL RAMP",
      desc: "Microbots assemble into an inclined conveyor staircase, lifting payloads over a 28mm vertical barrier.",
      rigidity: "Inclined Shear Truss",
      stateText: "PAYLOAD ELEVATION"
    },
    obs_chasm: {
      name: "Canyon Arch Span",
      badge: "OBSTACLE: 80mm CHASM CROSSING",
      desc: "Swarm units interlock apex-to-ball across an 80mm void to establish a load-bearing traversal arch.",
      rigidity: "Interlocking Catenary",
      stateText: "VOID TRAVERSAL"
    },
    obs_cradle: {
      name: "Heavy Cargo Cradle",
      badge: "OBSTACLE: CARGO CRADLE",
      desc: "Swarm forms a multi-tiered circular suspension cradle, lifting heavy equipment aloft with vibration isolation.",
      rigidity: "Radial Suspension Matrix",
      stateText: "CRADLE LEVITATION"
    }
  };

  const info = formationDB[formationKey] || formationDB.hand;

  // Update DOM Telemetry and HUD badges
  setSafeText('badge-swarm-formation', info.badge);
  setSafeText('info-swarm-formation', info.name);
  setSafeText('info-swarm-desc', info.desc);
  setSafeText('info-swarm-rigidity', info.rigidity);
  setSafeText('swarm-tele-state', info.stateText);
  setSafeText('swarm-tele-count', `${count} Movie Microbots`);
  setSafeText('swarm-tele-mass', `${(count * 0.0183).toFixed(2)} kg Array`);

  // Manage Obstacle Mesh Props Visibility
  if (swarmObstacleGroup) {
    if (formationKey === 'obs_wall') {
      swarmObstacleGroup.visible = true;
      obsWallMesh.visible = true;
      obsChasmLeft.visible = false;
      obsChasmRight.visible = false;
      obsCargoBox.visible = true;
      obsCargoBox.position.set(0, 14, -15);
    } else if (formationKey === 'obs_chasm') {
      swarmObstacleGroup.visible = true;
      obsWallMesh.visible = false;
      obsChasmLeft.visible = true;
      obsChasmRight.visible = true;
      obsCargoBox.visible = false;
    } else if (formationKey === 'obs_cradle') {
      swarmObstacleGroup.visible = true;
      obsWallMesh.visible = false;
      obsChasmLeft.visible = false;
      obsChasmRight.visible = false;
      obsCargoBox.visible = true;
      obsCargoBox.position.set(0, 16, 0);
    } else {
      swarmObstacleGroup.visible = false;
    }
  }

  // Calculate target positions for every active bot
  movieBots.forEach((bot, idx) => {
    bot.visible = idx < count;
    if (idx >= count) return;

    let targetX = 0, targetY = 0, targetZ = 0;
    let rotX = 0, rotY = 0, rotZ = 0;

    if (formationKey === 'hand') {
      // Hand layout: Wrist (0..15), Palm (16..55), Thumb (56..71), Index (72..91), Middle (92..113), Ring (114..129), Pinky (130..139)
      if (idx < 16) {
        // Wrist
        const col = (idx % 4) - 1.5;
        const row = Math.floor(idx / 4);
        targetX = col * 4.8;
        targetY = -18 + row * 4.2;
        targetZ = (Math.random() - 0.5) * 2;
        rotZ = 0;
        bot.userData.role = 'wrist';
      } else if (idx < 56) {
        // Palm
        const palmIdx = idx - 16;
        const col = (palmIdx % 7) - 3.0;
        const row = Math.floor(palmIdx / 7);
        targetX = col * 4.6;
        targetY = -2 + row * 4.2;
        targetZ = -Math.abs(col) * 0.8;
        rotY = col * 0.08;
        bot.userData.role = 'palm';
      } else if (idx < 72) {
        // Thumb
        const tIdx = idx - 56;
        const angle = -0.7; // angled outward
        const seg = tIdx * 1.6;
        targetX = -15 - seg * Math.cos(angle);
        targetY = 2 + seg * Math.sin(angle);
        targetZ = 2 + Math.sin(tIdx * 0.4) * 4;
        rotZ = angle;
        rotX = 0.3;
        bot.userData.role = 'thumb';
        bot.userData.fingerParam = { finger: 'thumb', joint: tIdx };
      } else if (idx < 92) {
        // Index Finger
        const fIdx = idx - 72;
        targetX = -10;
        targetY = 16 + fIdx * 2.2;
        targetZ = Math.sin(fIdx * 0.22) * 5;
        rotX = -fIdx * 0.08;
        bot.userData.role = 'index';
        bot.userData.fingerParam = { finger: 'index', joint: fIdx };
      } else if (idx < 114) {
        // Middle Finger (Tallest)
        const fIdx = idx - 92;
        targetX = -2;
        targetY = 17 + fIdx * 2.3;
        targetZ = Math.sin(fIdx * 0.2) * 5;
        rotX = -fIdx * 0.07;
        bot.userData.role = 'middle';
        bot.userData.fingerParam = { finger: 'middle', joint: fIdx };
      } else if (idx < 130) {
        // Ring Finger
        const fIdx = idx - 114;
        targetX = 6;
        targetY = 16 + fIdx * 2.1;
        targetZ = Math.sin(fIdx * 0.22) * 4.5;
        rotX = -fIdx * 0.08;
        bot.userData.role = 'ring';
        bot.userData.fingerParam = { finger: 'ring', joint: fIdx };
      } else {
        // Pinky Finger
        const fIdx = idx - 130;
        targetX = 13;
        targetY = 14 + fIdx * 1.9;
        targetZ = Math.sin(fIdx * 0.25) * 4;
        rotX = -fIdx * 0.09;
        bot.userData.role = 'pinky';
        bot.userData.fingerParam = { finger: 'pinky', joint: fIdx };
      }
    } else if (formationKey === 'chain') {
      // Articulated Snake Chain: 2 parallel chains crawling forward
      const chains = 2;
      const chainIdx = idx % chains;
      const posInChain = Math.floor(idx / chains);
      const totalInChain = Math.floor(count / chains);

      const spacing = 5.2;
      targetX = (chainIdx === 0 ? -9 : 9);
      targetZ = (posInChain - totalInChain / 2) * spacing;
      targetY = -12; // Resting on ground

      rotX = Math.PI / 2; // Aligned along chain axis
      bot.userData.role = 'chain';
      bot.userData.chainParam = { chainIdx, posInChain };
    } else if (formationKey === 'bridge') {
      // Parabolic Suspension Bridge Arch across two glowing pylons
      const span = 90.0;
      const leftPylon = -45.0;
      const rightPylon = 45.0;

      if (idx < 24) {
        // Left Pylon Tower
        const pIdx = idx;
        const level = Math.floor(pIdx / 2);
        const side = (pIdx % 2) * 4 - 2;
        targetX = leftPylon;
        targetY = -22 + level * 4.2;
        targetZ = side;
        bot.userData.role = 'pylon';
      } else if (idx < 48) {
        // Right Pylon Tower
        const pIdx = idx - 24;
        const level = Math.floor(pIdx / 2);
        const side = (pIdx % 2) * 4 - 2;
        targetX = rightPylon;
        targetY = -22 + level * 4.2;
        targetZ = side;
        bot.userData.role = 'pylon';
      } else if (idx < 100) {
        // Suspension Parabolic Arch
        const aIdx = idx - 48;
        const t = aIdx / 52; // 0 to 1 across span
        const x = leftPylon + t * span;
        // Parabola: highest in center
        const archY = 24 - Math.pow((t - 0.5) * 2, 2) * 22;
        targetX = x;
        targetY = archY;
        targetZ = 0;
        rotZ = -(t - 0.5) * 0.8;
        bot.userData.role = 'arch';
      } else {
        // Horizontal Roadway Deck
        const dIdx = idx - 100;
        const t = dIdx / 40;
        targetX = leftPylon + t * span;
        targetY = 2; // Deck height
        targetZ = (dIdx % 2 === 0 ? -3 : 3);
        rotX = 0;
        bot.userData.role = 'deck';
      }
    } else if (formationKey === 'wave') {
      // Dynamic Swarm Wave Grid
      const cols = 14;
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const spacingX = 6.5;
      const spacingZ = 6.0;

      targetX = (col - cols / 2) * spacingX;
      targetZ = (row - 5) * spacingZ;
      targetY = 8; // base wave height

      bot.userData.role = 'wave';
      bot.userData.waveParam = { gridX: col, gridZ: row };
    } else if (formationKey === 'tower') {
      // Heavy Vertical Support Column (Hexagonal stacked rings)
      const ringBots = 8;
      const layer = Math.floor(idx / ringBots);
      const inRing = idx % ringBots;
      const radius = 9.5;
      const angle = (inRing / ringBots) * Math.PI * 2 + (layer % 2) * (Math.PI / ringBots);

      targetX = Math.cos(angle) * radius;
      targetZ = Math.sin(angle) * radius;
      targetY = -20 + layer * 4.8;
      rotY = angle;
      rotX = 0.1;
      bot.userData.role = 'tower';
    } else if (formationKey === 'obs_wall') {
      const stepIdx = Math.floor(idx / 10);
      const colIdx = (idx % 10) - 4.5;
      const t = stepIdx / 14;
      targetX = colIdx * 4.8;
      targetY = -22 + t * 32;
      targetZ = 28 - t * 43;
      rotX = 0.62;
      bot.userData.role = 'obs_ramp';
    } else if (formationKey === 'obs_chasm') {
      const span = 95.0;
      const t = idx / count;
      targetX = -47.5 + t * span;
      const archH = Math.sin(t * Math.PI) * 15.0;
      targetY = -2 + archH + (idx % 2 === 0 ? 0 : -3.5);
      targetZ = (idx % 3 - 1) * 5.2;
      rotZ = -Math.cos(t * Math.PI) * 0.4;
      bot.userData.role = 'obs_chasm';
    } else if (formationKey === 'obs_cradle') {
      const tier = Math.floor(idx / 28);
      const inTier = idx % 28;
      const ang = (inTier / 28) * Math.PI * 2;
      const radius = 12 + tier * 2.5;
      targetX = Math.cos(ang) * radius;
      targetZ = Math.sin(ang) * radius;
      targetY = -8 + tier * 5.0;
      rotY = ang;
      rotX = 0.3;
      bot.userData.role = 'obs_cradle';
    }

    bot.userData.basePos.set(targetX, targetY, targetZ);
    bot.userData.targetPos.set(targetX, targetY, targetZ);
    bot.userData.targetRot.set(rotX, rotY, rotZ);

    // Smooth cinematic morphing
    gsap.to(bot.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.1 + Math.random() * 0.4,
      ease: "power2.out"
    });

    gsap.to(bot.rotation, {
      x: rotX,
      y: rotY,
      z: rotZ,
      duration: 1.1 + Math.random() * 0.4,
      ease: "power2.out"
    });
  });
}

// Explosive scatter and magnetic re-link animation
function scatterAndRelinkSwarm() {
  if (state.swarm.isScattered) return;
  state.swarm.isScattered = true;

  setSafeText('swarm-tele-state', 'DISPERSED (FREE SWARM)');

  movieBots.forEach((bot, idx) => {
    if (!bot.visible) return;

    // Random explosive outward trajectory
    const phi = Math.random() * Math.PI * 2;
    const theta = (Math.random() - 0.5) * Math.PI;
    const dist = 50 + Math.random() * 60;

    const explodeX = bot.position.x + Math.cos(phi) * Math.cos(theta) * dist;
    const explodeY = bot.position.y + Math.sin(theta) * dist;
    const explodeZ = bot.position.z + Math.sin(phi) * Math.cos(theta) * dist;

    // Phase 1: Fly outward
    gsap.to(bot.position, {
      x: explodeX,
      y: explodeY,
      z: explodeZ,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => {
        // Phase 2: Magnetically snap back together!
        gsap.to(bot.position, {
          x: bot.userData.targetPos.x,
          y: bot.userData.targetPos.y,
          z: bot.userData.targetPos.z,
          duration: 1.0,
          delay: idx * 0.003,
          ease: "elastic.out(1, 0.45)",
          onComplete: () => {
            if (idx === 0) {
              state.swarm.isScattered = false;
              const fInfo = {
                hand: "SYNCHRONIZED GRIP",
                chain: "UNDULATORY CRAWL",
                bridge: "LOAD-BEARING ARCH",
                wave: "NEURAL FLUID FLOW",
                tower: "COLUMN RIGID"
              };
              setSafeText('swarm-tele-state', fInfo[state.swarm.formation] || 'MAGNETICALLY LOCKED');
            }
          }
        });
      }
    });

    gsap.to(bot.rotation, {
      x: Math.random() * Math.PI * 4,
      y: Math.random() * Math.PI * 4,
      z: Math.random() * Math.PI * 4,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(bot.rotation, {
          x: bot.userData.targetRot.x,
          y: bot.userData.targetRot.y,
          z: bot.userData.targetRot.z,
          duration: 0.9,
          ease: "power2.out"
        });
      }
    });
  });
}

// --- Dynamic Swarm Simulation Loop ---
function updateSwarmSimulation(time, delta) {
  if (state.systemTab !== 'swarm' || state.swarm.isScattered) return;

  const speed = state.swarm.speed;
  const formation = state.swarm.formation;

  // Neural Cursor Follow: Swarm center shifts toward mouse position
  if (state.swarm.neuralFollow) {
    const targetOffset = new THREE.Vector3(
      state.swarm.mousePos.x * 24,
      12 + state.swarm.mousePos.y * 16,
      0
    );
    swarmCenterOffset.lerp(targetOffset, 0.04);
  } else {
    swarmCenterOffset.lerp(new THREE.Vector3(0, 12, 0), 0.04);
  }

  movieBots.forEach((bot, idx) => {
    if (!bot.visible) return;

    const base = bot.userData.basePos;

    if (formation === 'hand') {
      // Clenching / Breathing Hand Animation
      const gripPhase = Math.sin(time * speed * 2.2);
      const role = bot.userData.role;

      if (role === 'index' || role === 'middle' || role === 'ring' || role === 'pinky') {
        const joint = bot.userData.fingerParam.joint;
        // Curl fingers forward and down during grip
        const curlAmount = Math.max(0, gripPhase) * (joint * 0.6);
        bot.position.z = base.z - curlAmount + swarmCenterOffset.z;
        bot.position.y = base.y - (curlAmount * 0.4) + (swarmCenterOffset.y - 12);
        bot.position.x = base.x + swarmCenterOffset.x;
        bot.rotation.x = bot.userData.targetRot.x - (curlAmount * 0.08);
      } else if (role === 'thumb') {
        const curlAmount = Math.max(0, gripPhase) * 6.0;
        bot.position.x = base.x + curlAmount * 0.4 + swarmCenterOffset.x;
        bot.position.z = base.z - curlAmount * 0.6 + swarmCenterOffset.z;
        bot.position.y = base.y + (swarmCenterOffset.y - 12);
      } else {
        // Palm and wrist breathe gently
        bot.position.x = base.x + swarmCenterOffset.x;
        bot.position.y = base.y + Math.sin(time * 2 + idx * 0.1) * 0.3 + (swarmCenterOffset.y - 12);
        bot.position.z = base.z + swarmCenterOffset.z;
      }
    } else if (formation === 'chain') {
      // Synchronized Traveling Wave Locomotion (ESP-NOW crawl)
      const param = bot.userData.chainParam;
      const wave = Math.sin(time * speed * 4.5 - param.posInChain * 0.35);
      const waveCos = Math.cos(time * speed * 4.5 - param.posInChain * 0.35);

      bot.position.x = base.x + waveCos * 4.0 + swarmCenterOffset.x;
      bot.position.y = -12 + Math.abs(wave) * 7.5; // Lifting and planting on ground
      bot.position.z = base.z + swarmCenterOffset.z;

      // Pitch tilting around magnetic joint
      bot.rotation.x = Math.PI / 2 + wave * 0.45;
      bot.rotation.y = waveCos * 0.25;
    } else if (formation === 'bridge') {
      // Load-bearing bridge: subtle structural flex under load
      const role = bot.userData.role;
      if (role === 'arch' || role === 'deck') {
        const flex = Math.sin(time * speed * 3 + base.x * 0.06) * 0.6;
        bot.position.x = base.x + swarmCenterOffset.x;
        bot.position.y = base.y + flex + (swarmCenterOffset.y - 12);
        bot.position.z = base.z + swarmCenterOffset.z;
      } else {
        bot.position.x = base.x + swarmCenterOffset.x;
        bot.position.y = base.y + (swarmCenterOffset.y - 12);
        bot.position.z = base.z + swarmCenterOffset.z;
      }
    } else if (formation === 'wave') {
      // 3D Fluid Swarm Wave (Movie Neural Flocking)
      const p = bot.userData.waveParam;
      const ripple = Math.sin(p.gridX * 0.45 + time * speed * 3.5) * Math.cos(p.gridZ * 0.45 + time * speed * 2.5);

      bot.position.x = base.x + swarmCenterOffset.x;
      bot.position.y = base.y + ripple * 10.0 + (swarmCenterOffset.y - 12);
      bot.position.z = base.z + swarmCenterOffset.z;

      bot.rotation.x = ripple * 0.4;
      bot.rotation.z = -ripple * 0.3;
    } else if (formation === 'tower') {
      // Heavy Column: subtle compressive breathing
      const breathe = Math.sin(time * speed * 2 + base.y * 0.1) * 0.4;
      bot.position.x = base.x * (1 + breathe * 0.03) + swarmCenterOffset.x;
      bot.position.z = base.z * (1 + breathe * 0.03) + swarmCenterOffset.z;
      bot.position.y = base.y + (swarmCenterOffset.y - 12);
    }
  });
}

// --- 3D Annotations & Screen-Space Projection ---
function create3DAnnotations() {
  const overlay = document.getElementById('annotation-overlay');
  overlay.innerHTML = '';

  const pinData = [
    { id: 'ball', text: '12mm Steel Sphere', target: ballMesh },
    { id: 'collar', text: 'Equatorial Hub', target: collarGroup },
    { id: 'magnet', text: 'N42 Ring Magnet', target: pod1Magnet },
    { id: 'servo', text: '3.7g Micro Servo', target: pod1Servo },
    { id: 'pushrod', text: 'Pushrod Linkage', target: pod1Pushrod },
    { id: 'shell', text: 'Hexagonal Pod Shell', target: pod1ShellLower }
  ];

  pinData.forEach(pin => {
    const el = document.createElement('div');
    el.className = 'pin-label';
    el.innerText = pin.text;
    el.setAttribute('data-id', pin.id);
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectComponent(pin.id);
    });
    overlay.appendChild(el);
    annotations.push({ element: el, target: pin.target, id: pin.id });
  });
}

function update3DAnnotations() {
  if (!state.showLabels || state.systemTab === 'swarm') {
    document.getElementById('annotation-overlay').classList.add('hidden');
    return;
  }
  document.getElementById('annotation-overlay').classList.remove('hidden');

  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  annotations.forEach(item => {
    if (!item.target) return;
    const worldPos = new THREE.Vector3();
    item.target.getWorldPosition(worldPos);
    worldPos.y += 2.5;

    const screenPos = worldPos.clone().project(camera);
    if (screenPos.z > 1) {
      item.element.style.display = 'none';
      return;
    }

    item.element.style.display = 'block';
    const x = (screenPos.x * halfWidth) + halfWidth;
    const y = -(screenPos.y * halfHeight) + halfHeight;
    item.element.style.left = `${x}px`;
    item.element.style.top = `${y}px`;
  });
}

// --- Interactive Kinematics & Exploded View Animation ---
function setExplodedState(percent) {
  state.explodePercent = percent;
  const f = percent / 100;

  if (pod1Group && pod2Group) {
    pod1ShellLower.position.z = f * 35;
    pod1ShellUpper.position.z = f * 35;
    pod1ShellUpper.position.y = 1.0 + f * 22;

    pod2ShellLower.position.z = f * 35;
    pod2ShellUpper.position.z = f * 35;
    pod2ShellUpper.position.y = 1.0 + f * 22;

    pod1Servo.position.y = f * 12;
    pod2Servo.position.y = f * 12;

    pod1Magnet.position.z = 7.0 + f * 15;
    pod2Magnet.position.z = 7.0 + f * 15;

    pod1Pushrod.position.y = 2.0 + f * 8;
    pod2Pushrod.position.y = 2.0 + f * 8;

    collarGroup.scale.set(1 + f * 0.45, 1 + f * 0.45, 1);
  }
}

function setPodAngles(angle1, angle2) {
  state.pod1Angle = angle1;
  state.pod2Angle = angle2;

  const rad1 = THREE.MathUtils.degToRad(angle1);
  const rad2 = THREE.MathUtils.degToRad(angle2);

  if (pod1Pivot) pod1Pivot.rotation.x = rad1;
  if (pod2Pivot) pod2Pivot.rotation.x = -rad2;

  if (pod1Horn) pod1Horn.rotation.x = -rad1 * 0.85;
  if (pod2Horn) pod2Horn.rotation.x = -rad2 * 0.85;

  const l1 = document.getElementById('label-pod1-val');
  const l2 = document.getElementById('label-pod2-val');
  if (l1) l1.innerText = `${angle1 > 0 ? '+' : ''}${Math.round(angle1)}°`;
  if (l2) l2.innerText = `${angle2 > 0 ? '+' : ''}${Math.round(angle2)}°`;

  // Transmit real-time angles to physical robot if connected
  if (isHardwareConnected) {
    sendHardwareSerialCommand(`A:${Math.round(angle1)},${Math.round(angle2)}\n`);
  }
}

// --- Step-by-Step Interactive Assembly Guide Engine ---
function setAssemblyGuideStep(stepIndex) {
  if (stepIndex < 0) stepIndex = 0;
  if (stepIndex >= ASSEMBLY_GUIDE_STEPS.length) stepIndex = ASSEMBLY_GUIDE_STEPS.length - 1;

  state.guideStep = stepIndex;
  const stepData = ASSEMBLY_GUIDE_STEPS[stepIndex];

  // Update UI Elements
  document.getElementById('guide-step-number').innerText = `STEP ${stepData.step} OF ${ASSEMBLY_GUIDE_STEPS.length}`;
  document.getElementById('guide-step-title').innerText = stepData.title;
  document.getElementById('guide-where').innerText = stepData.where;
  document.getElementById('guide-how').innerText = stepData.how;
  document.getElementById('guide-works').innerText = stepData.works;
  document.getElementById('guide-tip').innerText = stepData.tip;

  document.getElementById('btn-guide-prev').disabled = (stepIndex === 0);
  document.getElementById('btn-guide-next').disabled = (stepIndex === ASSEMBLY_GUIDE_STEPS.length - 1);

  // Update step pills
  document.querySelectorAll('.step-pill').forEach((pill, idx) => {
    pill.classList.toggle('active', idx === stepIndex);
  });

  // Animate Camera to optimal view angle ONLY when active in assembly guide mode
  if (state.mode === 'guide') {
    gsap.to(camera.position, {
      x: stepData.camPos.x,
      y: stepData.camPos.y,
      z: stepData.camPos.z,
      duration: 1.0,
      ease: "power2.inOut"
    });

    gsap.to(controls.target, {
      x: stepData.camTarget.x,
      y: stepData.camTarget.y,
      z: stepData.camTarget.z,
      duration: 1.0,
      ease: "power2.inOut"
    });
  }

  // Visual emphasis / Ghosting of parts based on active assembly step
  applyAssemblyStepVisuals(stepIndex);
}

function applyAssemblyStepVisuals(stepIndex) {
  // Collapse exploded state for clear step positioning
  setExplodedState(0);
  setPodAngles(0, 0);

  // Ghosting / transparency controls
  const step = stepIndex + 1;

  // Step 1: Only ball & collar visible
  // Step 2: Ball, collar + magnets visible
  // Step 3: Ball, collar, magnets + servos visible
  // Step 4: Add pushrods
  // Step 5: Add shells
  // Step 6: Full assembly

  // Step-based visibility only applies when in Assembly Guide mode
  if (state.mode === 'guide') {
    collarGroup.visible = (step >= 1);
    ballMesh.visible = (step >= 1);

    pod1Magnet.visible = (step >= 2);
    pod2Magnet.visible = (step >= 2);

    pod1Servo.visible = (step >= 3);
    pod2Servo.visible = (step >= 3);

    pod1Pushrod.visible = (step >= 4);
    pod2Pushrod.visible = (step >= 4);

    pod1ShellLower.visible = (step >= 5);
    pod1ShellUpper.visible = (step >= 5);
    pod2ShellLower.visible = (step >= 5);
    pod2ShellUpper.visible = (step >= 5);

    // Pulse the newly introduced component
    const focus = ASSEMBLY_GUIDE_STEPS[stepIndex].focusPart;
    pulseObjectById(focus);
  }
}

function updateAssemblyGuideUI() {
  setAssemblyGuideStep(0);
}

// --- Component Inspector Interactions ---
function selectComponent(id) {
  state.selectedComponent = id;
  const data = COMPONENT_DB[id];
  if (!data) return;

  document.querySelectorAll('.layer-list li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-layer') === id || (id === 'shell' && li.getAttribute('data-layer') === 'shells'));
  });

  const emptyState = document.querySelector('.empty-state');
  const details = document.getElementById('inspector-details');
  if (emptyState) emptyState.classList.add('hidden');
  if (details) details.classList.remove('hidden');

  document.getElementById('inspect-title').innerText = data.name;
  document.getElementById('inspect-category').innerText = data.category;
  document.getElementById('inspect-icon-badge').innerText = data.icon;
  document.getElementById('inspect-desc').innerText = data.desc;
  document.getElementById('inspect-cost').innerText = data.cost;
  document.getElementById('inspect-source').innerText = data.source;

  const tableBody = document.getElementById('inspect-table-body');
  tableBody.innerHTML = '';
  for (const [key, val] of Object.entries(data.specs)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${key}</td><td>${val}</td>`;
    tableBody.appendChild(tr);
  }

  pulseObjectById(id);
}

function pulseObjectById(id) {
  let targetMesh = null;
  if (id === 'ball') targetMesh = ballMesh;
  else if (id === 'collar') targetMesh = collarGroup;
  else if (id === 'magnet') targetMesh = pod1Magnet;
  else if (id === 'servo') targetMesh = pod1Servo;
  else if (id === 'pushrod') targetMesh = pod1Pushrod;
  else if (id === 'shell') targetMesh = pod1ShellLower;

  if (targetMesh) {
    gsap.fromTo(targetMesh.scale, 
      { x: 1.15, y: 1.15, z: 1.15 }, 
      { x: 1.0, y: 1.0, z: 1.0, duration: 0.6, ease: "elastic.out(1, 0.4)" }
    );
  }
}


// --- Web Serial API Hardware-in-the-Loop Engine ---
async function toggleHardwareConnection() {
  if (!('serial' in navigator)) {
    alert("Web Serial API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Opera.");
    return;
  }

  if (isHardwareConnected) {
    try {
      if (hardwareSerialWriter) {
        await hardwareSerialWriter.close();
        hardwareSerialWriter = null;
      }
      if (hardwareSerialPort) {
        await hardwareSerialPort.close();
        hardwareSerialPort = null;
      }
    } catch (e) {
      console.warn("Serial close:", e);
    }
    isHardwareConnected = false;
    setSafeText('hardware-status-val', 'DISCONNECTED');
    const statusVal = document.getElementById('hardware-status-val');
    if (statusVal) statusVal.style.color = '#ffaa00';
    const btn = document.getElementById('btn-connect-hardware');
    if (btn) btn.innerText = '⚡ Connect Physical Bot (Web Serial)';
    return;
  }

  try {
    hardwareSerialPort = await navigator.serial.requestPort();
    await hardwareSerialPort.open({ baudRate: 115200 });
    const textEncoder = new TextEncoderStream();
    textEncoder.readable.pipeTo(hardwareSerialPort.writable);
    hardwareSerialWriter = textEncoder.writable.getWriter();

    isHardwareConnected = true;
    setSafeText('hardware-status-val', 'CONNECTED (115200 BAUD)');
    const statusVal = document.getElementById('hardware-status-val');
    if (statusVal) statusVal.style.color = '#00ff88';
    const btn = document.getElementById('btn-connect-hardware');
    if (btn) btn.innerText = '🔌 Disconnect Hardware';

    sendHardwareSerialCommand('s\n');
  } catch (err) {
    console.error("Web Serial connection failed:", err);
    setSafeText('hardware-status-val', 'FAILED / CANCELLED');
    const statusVal = document.getElementById('hardware-status-val');
    if (statusVal) statusVal.style.color = '#ff3366';
  }
}

async function sendHardwareSerialCommand(cmd) {
  if (!isHardwareConnected || !hardwareSerialWriter) return;
  try {
    await hardwareSerialWriter.write(cmd);
  } catch (e) {
    console.warn("Serial write error:", e);
  }
}

// --- UI Event Listeners ---
function setupUIEventListeners() {
  // Domain: Physical V1
  const tabV1 = document.getElementById('tab-v1');
  const panelV1 = document.getElementById('controls-panel');
  const statusV1 = document.getElementById('status-container-v1');
  const trackerV1 = document.getElementById('tracker-v1');
  const teleV1 = document.getElementById('telemetry-v1');

  const tabSwarm = document.getElementById('tab-swarm');
  const panelSwarm = document.getElementById('swarm-controls-panel');
  const statusSwarm = document.getElementById('status-container-swarm');
  const trackerSwarm = document.getElementById('tracker-swarm');
  const teleSwarm = document.getElementById('telemetry-swarm');

  if (tabV1) {
    tabV1.addEventListener('click', () => {
      state.systemTab = 'v1';
      tabV1.classList.add('active');
      if (tabSwarm) tabSwarm.classList.remove('active');
      worldGroup.visible = true;
      if (swarmGroup) swarmGroup.visible = false;

      if (panelV1) panelV1.classList.remove('hidden');
      if (panelSwarm) panelSwarm.classList.add('hidden');
      if (statusV1) statusV1.classList.remove('hidden');
      if (statusSwarm) statusSwarm.classList.add('hidden');
      if (trackerV1) trackerV1.classList.remove('hidden');
      if (trackerSwarm) trackerSwarm.classList.add('hidden');
      if (teleV1) teleV1.classList.remove('hidden');
      if (teleSwarm) teleSwarm.classList.add('hidden');

      setCameraPreset('iso');
      create3DAnnotations();
      update3DAnnotations();
    });
  }

  if (tabSwarm) {
    tabSwarm.addEventListener('click', () => {
      state.systemTab = 'swarm';
      tabSwarm.classList.add('active');
      if (tabV1) tabV1.classList.remove('active');
      worldGroup.visible = false;
      if (swarmGroup) swarmGroup.visible = true;

      if (panelV1) panelV1.classList.add('hidden');
      if (panelSwarm) panelSwarm.classList.remove('hidden');
      if (statusV1) statusV1.classList.add('hidden');
      if (statusSwarm) statusSwarm.classList.remove('hidden');
      if (trackerV1) trackerV1.classList.add('hidden');
      if (trackerSwarm) trackerSwarm.classList.remove('hidden');
      if (teleV1) teleV1.classList.add('hidden');
      if (teleSwarm) teleSwarm.classList.remove('hidden');

      // Clear annotations in swarm mode
      const overlay = document.getElementById('annotation-overlay');
      if (overlay) overlay.innerHTML = '';

      // Frame the entire Movie Swarm formation dynamically
      gsap.to(camera.position, {
        x: 0,
        y: 45,
        z: 120,
        duration: 1.2,
        ease: "power2.inOut"
      });
      gsap.to(controls.target, {
        x: 0,
        y: 8,
        z: 0,
        duration: 1.2,
        ease: "power2.inOut"
      });
    });
  }

  // --- Swarm Formation Buttons ---
  const formationMap = {
    'btn-form-hand': 'hand',
    'btn-form-chain': 'chain',
    'btn-form-bridge': 'bridge',
    'btn-form-wave': 'wave',
    'btn-form-tower': 'tower'
  };

  Object.entries(formationMap).forEach(([btnId, fKey]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        Object.keys(formationMap).forEach(id => {
          const b = document.getElementById(id);
          if (b) b.classList.remove('active');
        });
        btn.classList.add('active');
        applyMovieSwarmFormation(fKey);
      });
    }
  });

  // Swarm Population Slider
  const sliderSwarmSize = document.getElementById('slider-swarm-size');
  if (sliderSwarmSize) {
    sliderSwarmSize.addEventListener('input', (e) => {
      state.swarm.count = parseInt(e.target.value, 10);
      setSafeText('label-swarm-size', `${state.swarm.count} BOTS`);
      applyMovieSwarmFormation(state.swarm.formation);
    });
  }

  // Swarm Speed Slider
  const sliderSwarmSpeed = document.getElementById('slider-swarm-speed');
  if (sliderSwarmSpeed) {
    sliderSwarmSpeed.addEventListener('input', (e) => {
      state.swarm.speed = parseFloat(e.target.value);
      setSafeText('label-swarm-speed', `${state.swarm.speed.toFixed(1)}x`);
    });
  }

  // Neural Follow Toggle
  const btnNeural = document.getElementById('btn-toggle-neural');
  if (btnNeural) {
    btnNeural.addEventListener('click', () => {
      state.swarm.neuralFollow = !state.swarm.neuralFollow;
      btnNeural.classList.toggle('active', state.swarm.neuralFollow);
    });
  }

  // Scatter & Re-assemble Button
  const btnScatter = document.getElementById('btn-swarm-scatter');
  if (btnScatter) {
    btnScatter.addEventListener('click', () => {
      scatterAndRelinkSwarm();
    });
  }

  // Web Serial Hardware Connect Button
  const btnConnectHw = document.getElementById('btn-connect-hardware');
  if (btnConnectHw) {
    btnConnectHw.addEventListener('click', toggleHardwareConnection);
  }

  // Obstacle Sandbox Buttons
  const obsButtons = {
    'btn-obs-wall': 'obs_wall',
    'btn-obs-chasm': 'obs_chasm',
    'btn-obs-cradle': 'obs_cradle',
    'btn-obs-clear': 'hand'
  };

  Object.entries(obsButtons).forEach(([btnId, formKey]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        Object.keys(formationMap).forEach(id => {
          const b = document.getElementById(id);
          if (b) b.classList.remove('active');
        });
        Object.keys(obsButtons).forEach(id => {
          const b = document.getElementById(id);
          if (b) b.classList.remove('active');
        });
        if (btnId !== 'btn-obs-clear') {
          btn.classList.add('active');
        } else {
          const handBtn = document.getElementById('btn-form-hand');
          if (handBtn) handBtn.classList.add('active');
        }
        applyMovieSwarmFormation(formKey);
      });
    }
  });

  // Window mousemove listener for Neural Telepathy cursor tracking
  window.addEventListener('mousemove', (e) => {
    state.swarm.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.swarm.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Mechanism Mode Buttons for V1
  const btnAssembly = document.getElementById('btn-mode-assembly');
  const btnExplode = document.getElementById('btn-mode-explode');
  const btnArticulate = document.getElementById('btn-mode-articulate');
  const btnGuide = document.getElementById('btn-mode-guide');

  const secExploded = document.getElementById('section-exploded-controls');
  const secKinematics = document.getElementById('section-kinematics-controls');
  const secGuide = document.getElementById('section-guide-controls');

  function clearActiveModeButtons() {
    [btnAssembly, btnExplode, btnArticulate, btnGuide].forEach(b => b.classList.remove('active'));
    secExploded.classList.add('hidden');
    secKinematics.classList.add('hidden');
    secGuide.classList.add('hidden');
    stopGait();
  }

  btnAssembly.addEventListener('click', () => {
    clearActiveModeButtons();
    btnAssembly.classList.add('active');
    secExploded.classList.remove('hidden');
    state.mode = 'assembly';

    // Reset visibility of all components
    [ballMesh, collarGroup, pod1Magnet, pod2Magnet, pod1Servo, pod2Servo, pod1Pushrod, pod2Pushrod, pod1ShellLower, pod1ShellUpper, pod2ShellLower, pod2ShellUpper].forEach(o => {
      if (o) o.visible = true;
    });

    gsap.to(state, {
      explodePercent: 0,
      pod1Angle: 0,
      pod2Angle: 0,
      duration: 0.8,
      onUpdate: () => {
        setExplodedState(state.explodePercent);
        setPodAngles(state.pod1Angle, state.pod2Angle);
        document.getElementById('slider-explode').value = 0;
        document.getElementById('label-explode-val').innerText = '0%';
      }
    });
  });

  btnExplode.addEventListener('click', () => {
    clearActiveModeButtons();
    btnExplode.classList.add('active');
    secExploded.classList.remove('hidden');
    state.mode = 'explode';

    [ballMesh, collarGroup, pod1Magnet, pod2Magnet, pod1Servo, pod2Servo, pod1Pushrod, pod2Pushrod, pod1ShellLower, pod1ShellUpper, pod2ShellLower, pod2ShellUpper].forEach(o => {
      if (o) o.visible = true;
    });

    gsap.to(state, {
      explodePercent: 75,
      pod1Angle: 0,
      pod2Angle: 0,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: () => {
        setExplodedState(state.explodePercent);
        setPodAngles(state.pod1Angle, state.pod2Angle);
        document.getElementById('slider-explode').value = state.explodePercent;
        document.getElementById('label-explode-val').innerText = `${Math.round(state.explodePercent)}%`;
      }
    });
  });

  btnArticulate.addEventListener('click', () => {
    clearActiveModeButtons();
    btnArticulate.classList.add('active');
    secKinematics.classList.remove('hidden');
    state.mode = 'articulate';

    [ballMesh, collarGroup, pod1Magnet, pod2Magnet, pod1Servo, pod2Servo, pod1Pushrod, pod2Pushrod, pod1ShellLower, pod1ShellUpper, pod2ShellLower, pod2ShellUpper].forEach(o => {
      if (o) o.visible = true;
    });

    setExplodedState(0);
    document.getElementById('slider-explode').value = 0;
    document.getElementById('label-explode-val').innerText = '0%';
    startGait('antiphase');
  });

  btnGuide.addEventListener('click', () => {
    clearActiveModeButtons();
    btnGuide.classList.add('active');
    secGuide.classList.remove('hidden');
    state.mode = 'guide';
    setAssemblyGuideStep(state.guideStep);
  });

  // Assembly Guide Navigation
  document.getElementById('btn-guide-prev').addEventListener('click', () => {
    setAssemblyGuideStep(state.guideStep - 1);
  });

  document.getElementById('btn-guide-next').addEventListener('click', () => {
    setAssemblyGuideStep(state.guideStep + 1);
  });

  document.querySelectorAll('.step-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const stepIdx = parseInt(pill.getAttribute('data-step'), 10);
      setAssemblyGuideStep(stepIdx);
    });
  });

  // Explode Sliders
  const sliderExplode = document.getElementById('slider-explode');
  sliderExplode.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('label-explode-val').innerText = `${val}%`;
    setExplodedState(val);
  });

  document.getElementById('btn-auto-explode').addEventListener('click', () => {
    const targetVal = state.explodePercent > 20 ? 0 : 85;
    gsap.to(state, {
      explodePercent: targetVal,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setExplodedState(state.explodePercent);
        sliderExplode.value = state.explodePercent;
        document.getElementById('label-explode-val').innerText = `${Math.round(state.explodePercent)}%`;
      }
    });
  });

  document.getElementById('btn-reset-explode').addEventListener('click', () => {
    gsap.to(state, {
      explodePercent: 0,
      duration: 0.6,
      onUpdate: () => {
        setExplodedState(state.explodePercent);
        sliderExplode.value = 0;
        document.getElementById('label-explode-val').innerText = '0%';
      }
    });
  });

  // Kinematic Sliders
  const sliderPod1 = document.getElementById('slider-pod1');
  const sliderPod2 = document.getElementById('slider-pod2');

  sliderPod1.addEventListener('input', (e) => {
    stopGait();
    setPodAngles(parseFloat(e.target.value), state.pod2Angle);
  });

  sliderPod2.addEventListener('input', (e) => {
    stopGait();
    setPodAngles(state.pod1Angle, parseFloat(e.target.value));
  });

  // Gait Buttons
  document.getElementById('btn-gait-antiphase').addEventListener('click', () => startGait('antiphase'));
  document.getElementById('btn-gait-inphase').addEventListener('click', () => startGait('inphase'));
  document.getElementById('btn-gait-stop').addEventListener('click', () => stopGait());

  // View Toggles
  const btnXray = document.getElementById('btn-toggle-xray');
  btnXray.addEventListener('click', () => {
    state.isXray = !state.isXray;
    btnXray.setAttribute('data-active', state.isXray);
    toggleXrayMode(state.isXray);
  });

  const btnLabels = document.getElementById('btn-toggle-labels');
  btnLabels.addEventListener('click', () => {
    state.showLabels = !state.showLabels;
    btnLabels.setAttribute('data-active', state.showLabels);
    update3DAnnotations();
  });

  const btnFlux = document.getElementById('btn-toggle-flux');
  btnFlux.addEventListener('click', () => {
    state.showFlux = !state.showFlux;
    btnFlux.setAttribute('data-active', state.showFlux);
    fluxGroup.visible = state.showFlux;
  });

  const btnCutaway = document.getElementById('btn-toggle-cutaway');
  btnCutaway.addEventListener('click', () => {
    state.isCutaway = !state.isCutaway;
    btnCutaway.setAttribute('data-active', state.isCutaway);
    pod1ShellUpper.visible = !state.isCutaway;
    pod2ShellUpper.visible = !state.isCutaway;
  });

  // Camera Presets
  document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-cam');
      setCameraPreset(type);
    });
  });

  // Inspector Close
  const btnCloseInspector = document.getElementById('btn-close-inspector');
  if (btnCloseInspector) {
    btnCloseInspector.addEventListener('click', () => {
      document.querySelector('.empty-state').classList.remove('hidden');
      document.getElementById('inspector-details').classList.add('hidden');
      document.querySelectorAll('.layer-list li').forEach(li => li.classList.remove('active'));
    });
  }

  // Layer list items
  document.querySelectorAll('.layer-list li').forEach(li => {
    li.addEventListener('click', () => {
      const layer = li.getAttribute('data-layer');
      const idMap = { ball: 'ball', collar: 'collar', magnets: 'magnet', servos: 'servo', linkage: 'pushrod', shells: 'shell' };
      selectComponent(idMap[layer]);
    });
  });

  window.addEventListener('click', onCanvasClick);
}

function toggleXrayMode(isXray) {
  const opacity = isXray ? 0.22 : 1.0;
  const transparent = isXray;

  [pod1ShellLower, pod1ShellUpper, pod2ShellLower, pod2ShellUpper].forEach(group => {
    if (!group) return;
    group.traverse(child => {
      if (child.isMesh && child.userData.id === 'shell') {
        child.material.transparent = transparent;
        child.material.opacity = opacity;
        child.material.wireframe = isXray;
        child.material.needsUpdate = true;
      }
    });
  });
}

function setCameraPreset(type) {
  let targetPos = new THREE.Vector3(110, 36, 85);
  let lookTarget = new THREE.Vector3(0, 0, 0);

  switch (type) {
    case 'iso': targetPos.set(110, 36, 85); break;
    case 'joint': targetPos.set(34, 16, 28); break;
    case 'top': targetPos.set(0, 140, 0.01); break;
    case 'side': targetPos.set(130, 16, 0); break;
    case 'front': targetPos.set(0, 0, 130); break;
    case 'desk': targetPos.set(78, 14, 46); break;
  }

  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 1.0,
    ease: "power2.inOut"
  });

  gsap.to(controls.target, {
    x: lookTarget.x,
    y: lookTarget.y,
    z: lookTarget.z,
    duration: 1.0,
    ease: "power2.inOut"
  });
}

// --- Gaits Animation for V1 ---
function startGait(gaitType) {
  state.gait = gaitType;
  document.getElementById('btn-gait-antiphase').classList.toggle('active', gaitType === 'antiphase');
  document.getElementById('btn-gait-inphase').classList.toggle('active', gaitType === 'inphase');
  if (isHardwareConnected) {
    if (gaitType === 'antiphase') sendHardwareSerialCommand('c\n');
    else if (gaitType === 'inphase') sendHardwareSerialCommand('i\n');
  }
}

function stopGait() {
  state.gait = null;
  const b1 = document.getElementById('btn-gait-antiphase');
  const b2 = document.getElementById('btn-gait-inphase');
  if (b1) b1.classList.remove('active');
  if (b2) b2.classList.remove('active');
  if (isHardwareConnected) {
    sendHardwareSerialCommand('s\n');
  }
}

function updateGaits(time) {
  if (!state.gait) return;

  const freq = 1.8;
  const amplitude = 32;

  let a1 = 0, a2 = 0;
  if (state.gait === 'antiphase') {
    a1 = Math.sin(time * freq) * amplitude;
    a2 = -Math.sin(time * freq) * amplitude;
  } else if (state.gait === 'inphase') {
    a1 = Math.sin(time * freq) * amplitude;
    a2 = Math.sin(time * freq) * amplitude;
  }

  setPodAngles(a1, a2);
  document.getElementById('slider-pod1').value = a1;
  document.getElementById('slider-pod2').value = a2;
}

// --- Raycaster Selection ---
function onCanvasClick(event) {
  if (event.target.closest('.glass-panel') || event.target.closest('.pin-label')) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const targetGroup = state.systemTab === 'v1' ? worldGroup : swarmGroup;
  const intersects = raycaster.intersectObjects(targetGroup.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj && !obj.userData.id && obj.parent) {
      obj = obj.parent;
    }
    if (obj && obj.userData && obj.userData.id) {
      selectComponent(obj.userData.id);
    }
  }
}

function setupWindowResize() {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- Main Render Loop ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  const delta = clock.getDelta();

  // Run V1 robotic walking gaits if active
  updateGaits(elapsedTime);

  // Run Movie Swarm Simulation Loop
  updateSwarmSimulation(elapsedTime, delta);

  // Animate V1 magnetic flux line dashes
  if (fluxGroup && state.showFlux) {
    fluxGroup.children.forEach((line, idx) => {
      line.material.dashSize = 1.5 + Math.sin(elapsedTime * 4 + idx) * 0.4;
    });
  }

  controls.update();
  update3DAnnotations();
  renderer.render(scene, camera);
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', init);
