/**
 * Microbot Architecture Lab — Dual Physical V1 & Cell 2025 Magnetic Swarm Simulator
 * Built with Three.js (WebGL) + OrbitControls + GSAP
 */

// --- Global Simulation Constants ---
const CONFIG = {
  ballRadius: 6.0,          // 12mm Chrome Steel Ball
  socketRadius: 6.2,        // 0.2mm radial clearance
  podLength: 58.0,          // Total pod length to apex
  podBaseWidth: 24.0,       // Hexagonal pyramid base width
  podHeight: 22.0,          // Hexagonal pyramid base height
  magnetOD: 10.0,
  magnetID: 3.0,
  magnetThick: 3.0,
  servoLength: 20.0,
  servoWidth: 8.5,
  servoHeight: 20.0,
  pushrodRadius: 0.5,       // 1.0mm diameter wire
  collarRadius: 7.2,
  collarWidth: 2.4,
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

  // Swarm Lab State (Cell Device 2025)
  swarm: {
    view: 'micro',         // 'micro' or 'hardware'
    config: 'ht',          // 'ht', 'sc', 'ff'
    frequency: 5.0,        // Hz
    motionMode: 'spin',    // 'spin', 'orbital'
    mission: 'climb'       // 'climb', 'throw', 'raft', 'bridge', 'unclog', 'morph'
  }
};

// --- Three.js Setup ---
let scene, camera, renderer, controls;
let container = document.getElementById('canvas-container');

// Group Hierarchies
let worldGroup;            // Physical Microbot V1
let swarmGroup;            // Cell 2025 Magnetic Swarm Lab
let ballMesh, collarGroup;
let pod1Pivot, pod1Group, pod1ShellLower, pod1ShellUpper, pod1Magnet, pod1Servo, pod1Horn, pod1Pushrod;
let pod2Pivot, pod2Group, pod2ShellLower, pod2ShellUpper, pod2Magnet, pod2Servo, pod2Horn, pod2Pushrod;
let fluxGroup;
let annotations = [];

// Swarm Simulation Objects
let swarmMicrorobots = [];
let swarmMagnetRig, swarmFluxGroup, swarmObstacleMesh, swarmTubeMesh, swarmLiquidMetalMesh, swarmRaftPill, swarmLedMesh;
let hardwareRigGroup, hardwareRotorRig, hardwareCubes = [];

// Raycasting for interactive click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- Initialization ---
function init() {
  initThree();
  buildEnvironment();
  buildMicrobotModel();
  buildMagneticFluxLines();
  buildSwarmEnvironment();
  create3DAnnotations();
  setupUIEventListeners();
  setupWindowResize();
  updateAssemblyGuideUI();
  animate();
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0c10);
  scene.fog = new THREE.FogExp2(0x0a0c10, 0.005);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 1000);
  camera.position.set(75, 45, 95);

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
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.98, roughness: 0.05 });
  const collarMat = new THREE.MeshStandardMaterial({ color: 0x1a212d, metalness: 0.7, roughness: 0.35 });
  const pinBrassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.85, roughness: 0.25 });
  const magnetMat = new THREE.MeshStandardMaterial({ color: 0xd6dde6, metalness: 0.92, roughness: 0.12 });
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.42, metalness: 0.25, side: THREE.DoubleSide });
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

  // Servo Assembly
  const servoGroup = new THREE.Group();
  servoGroup.position.set(0, 0, 22.0);
  servoGroup.userData = { id: 'servo' };

  const bodyGeo = new THREE.BoxGeometry(CONFIG.servoWidth, CONFIG.servoHeight, CONFIG.servoLength);
  const bodyMesh = new THREE.Mesh(bodyGeo, opts.servoBodyMat);
  bodyMesh.castShadow = true;
  servoGroup.add(bodyMesh);

  const gearHubGeo = new THREE.CylinderGeometry(2.5, 2.5, 3.0, 24);
  const gearHub = new THREE.Mesh(gearHubGeo, opts.servoHornMat);
  gearHub.position.set(CONFIG.servoWidth / 2 + 1.2, 4.0, -3.0);
  gearHub.rotation.z = Math.PI / 2;
  servoGroup.add(gearHub);

  const hornArmGeo = new THREE.BoxGeometry(1.6, 2.5, 8.5);
  const hornMesh = new THREE.Mesh(hornArmGeo, opts.servoHornMat);
  hornMesh.position.set(CONFIG.servoWidth / 2 + 2.5, 4.0, 1.2);
  servoGroup.add(hornMesh);

  innerGroup.add(servoGroup);
  if (isPod1) {
    pod1Servo = servoGroup;
    pod1Horn = hornMesh;
  } else {
    pod2Servo = servoGroup;
    pod2Horn = hornMesh;
  }

  // Pushrod Linkage
  const rodGeo = new THREE.CylinderGeometry(CONFIG.pushrodRadius, CONFIG.pushrodRadius, 26.0, 16);
  const rodMesh = new THREE.Mesh(rodGeo, opts.pushrodMat);
  rodMesh.castShadow = true;
  rodMesh.position.set(CONFIG.servoWidth / 2 + 2.5, 2.0, 13.0);
  rodMesh.rotation.x = 0.12;
  rodMesh.userData = { id: 'pushrod' };
  innerGroup.add(rodMesh);

  if (isPod1) pod1Pushrod = rodMesh;
  else pod2Pushrod = rodMesh;

  // Hexagonal Pod Shell
  const shellLower = createHexagonalPodShell(opts.shellMat, false);
  shellLower.userData = { id: 'shell' };
  innerGroup.add(shellLower);

  const shellUpper = createHexagonalPodShell(opts.shellMat, true);
  shellUpper.position.y = 1.0;
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

function createHexagonalPodShell(mat, isUpperLid) {
  const shellGroup = new THREE.Group();
  const length = CONFIG.podLength;
  const w1 = CONFIG.podBaseWidth;
  const h1 = CONFIG.podHeight;
  const z0 = 6.2;
  const zApex = z0 + length;
  const apex = [0, 0, zApex];

  const geom = new THREE.BufferGeometry();
  const p0 = [
    [0, h1 / 2, z0],
    [w1 / 2, h1 / 4, z0],
    [w1 / 2, -h1 / 4, z0],
    [0, -h1 / 2, z0],
    [-w1 / 2, -h1 / 4, z0],
    [-w1 / 2, h1 / 4, z0]
  ];

  const mRight = [w1 / 2, 0, z0];
  const mLeft = [-w1 / 2, 0, z0];
  const vertices = [];

  if (isUpperLid) {
    vertices.push(...p0[5], ...mLeft, ...apex);
    vertices.push(...p0[0], ...p0[5], ...apex);
    vertices.push(...p0[1], ...p0[0], ...apex);
    vertices.push(...mRight, ...p0[1], ...apex);
  } else {
    vertices.push(...p0[2], ...mRight, ...apex);
    vertices.push(...p0[3], ...p0[2], ...apex);
    vertices.push(...p0[4], ...p0[3], ...apex);
    vertices.push(...mLeft, ...p0[4], ...apex);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.computeVertexNormals();

  const shellMesh = new THREE.Mesh(geom, mat);
  shellMesh.castShadow = true;
  shellMesh.receiveShadow = true;
  shellGroup.add(shellMesh);

  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.9, metalness: 0.05 });
  const grooveGeo = new THREE.BoxGeometry(0.7, 0.4, length * 0.55);
  const groove1 = new THREE.Mesh(grooveGeo, grooveMat);
  groove1.position.set(w1 * 0.22, (isUpperLid ? 1 : -1) * (h1 * 0.24), z0 + length * 0.35);
  groove1.rotation.y = (isUpperLid ? -1 : 1) * 0.08;
  groove1.rotation.x = (isUpperLid ? -1 : 1) * 0.12;
  shellGroup.add(groove1);

  const groove2 = new THREE.Mesh(grooveGeo, grooveMat);
  groove2.position.set(-w1 * 0.22, (isUpperLid ? 1 : -1) * (h1 * 0.24), z0 + length * 0.35);
  groove2.rotation.y = (isUpperLid ? 1 : -1) * 0.08;
  groove2.rotation.x = (isUpperLid ? -1 : 1) * 0.12;
  shellGroup.add(groove2);

  if (!isUpperLid) {
    const socketCupGeo = new THREE.SphereGeometry(CONFIG.socketRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const socketCupMat = new THREE.MeshStandardMaterial({ color: 0x242d38, roughness: 0.15, metalness: 0.3, side: THREE.BackSide });
    const socketCup = new THREE.Mesh(socketCupGeo, socketCupMat);
    socketCup.position.set(0, 0, 0);
    shellGroup.add(socketCup);
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

// --- Cell 2025 Magnetic Swarm Lab Simulation ---
function buildSwarmEnvironment() {
  // 1. Transparent Acrylic Petri Stage
  const stageGeo = new THREE.CylinderGeometry(45, 45, 4, 64);
  const stageMat = new THREE.MeshPhysicalMaterial({
    color: 0x111c2e,
    transmission: 0.88,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.49,
    metalness: 0.05
  });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.y = -2;
  stage.receiveShadow = true;
  swarmGroup.add(stage);

  // Outer Petri Rim
  const rimGeo = new THREE.TorusGeometry(45, 1.2, 16, 64);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.2, metalness: 0.8 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.5;
  swarmGroup.add(rim);

  // 2. Rotating Permanent Magnet Rig beneath stage
  swarmMagnetRig = new THREE.Group();
  swarmMagnetRig.position.y = -18;

  const spindleGeo = new THREE.CylinderGeometry(2, 2, 12, 16);
  const spindleMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.8 });
  const spindle = new THREE.Mesh(spindleGeo, spindleMat);
  swarmMagnetRig.add(spindle);

  const crossbarGeo = new THREE.BoxGeometry(40, 3, 6);
  const crossbar = new THREE.Mesh(crossbarGeo, spindleMat);
  crossbar.position.y = 4;
  swarmMagnetRig.add(crossbar);

  // North (Red) and South (Blue) Neodymium Blocks
  const magBlockGeo = new THREE.BoxGeometry(10, 8, 12);
  const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.2 });
  const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.6, roughness: 0.2 });

  const northMag = new THREE.Mesh(magBlockGeo, northMat);
  northMag.position.set(16, 4, 0);
  swarmMagnetRig.add(northMag);

  const southMag = new THREE.Mesh(magBlockGeo, southMat);
  southMag.position.set(-16, 4, 0);
  swarmMagnetRig.add(southMag);

  swarmGroup.add(swarmMagnetRig);

  // 3. Create 200 Anisotropic Cuboid Microrobots (300×300×600 µm scaled to 1.2×1.2×2.4mm)
  const botGeo = new THREE.BoxGeometry(1.2, 1.2, 2.4);
  const botMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.35,
    metalness: 0.45
  });

  // Pole markers for visualization
  const northCapGeo = new THREE.BoxGeometry(1.22, 1.22, 0.4);
  const southCapGeo = new THREE.BoxGeometry(1.22, 1.22, 0.4);

  for (let i = 0; i < 200; i++) {
    const singleBotGroup = new THREE.Group();

    const body = new THREE.Mesh(botGeo, botMat);
    body.castShadow = true;
    singleBotGroup.add(body);

    const nCap = new THREE.Mesh(northCapGeo, northMat);
    nCap.position.z = 1.1;
    singleBotGroup.add(nCap);

    const sCap = new THREE.Mesh(southCapGeo, southMat);
    sCap.position.z = -1.1;
    singleBotGroup.add(sCap);

    // Initial random disperse on stage
    const rad = Math.sqrt(Math.random()) * 28;
    const ang = Math.random() * Math.PI * 2;
    singleBotGroup.position.set(Math.cos(ang) * rad, 0.6, Math.sin(ang) * rad);
    singleBotGroup.rotation.y = Math.random() * Math.PI * 2;

    singleBotGroup.userData = {
      index: i,
      baseRadius: rad,
      baseAngle: ang,
      targetPos: new THREE.Vector3(),
      targetRot: new THREE.Euler()
    };

    swarmGroup.add(singleBotGroup);
    swarmMicrorobots.push(singleBotGroup);
  }

  // 4. Mission Props (Climbing Obstacle, Occluded Tube, Liquid Metal Droplet, Circuit)
  // A. Obstacle Wall (7mm height, 25mm width)
  const wallGeo = new THREE.BoxGeometry(6, 7, 28);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  swarmObstacleMesh = new THREE.Mesh(wallGeo, wallMat);
  swarmObstacleMesh.position.set(18, 3.5, 0);
  swarmObstacleMesh.castShadow = true;
  swarmGroup.add(swarmObstacleMesh);

  // B. Vascular Occlusion Tube & Tofu Clot
  const tubeGeo = new THREE.CylinderGeometry(5, 5, 45, 32, 1, true);
  const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, roughness: 0.1 });
  swarmTubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  swarmTubeMesh.rotation.z = Math.PI / 2;
  swarmTubeMesh.position.set(0, 5, -24);
  swarmTubeMesh.visible = false;
  swarmGroup.add(swarmTubeMesh);

  // C. Liquid Metal Droplet (EGaIn)
  const lmGeo = new THREE.SphereGeometry(4.5, 32, 32);
  const lmMat = new THREE.MeshStandardMaterial({ color: 0xdde5ed, metalness: 0.98, roughness: 0.05 });
  swarmLiquidMetalMesh = new THREE.Mesh(lmGeo, lmMat);
  swarmLiquidMetalMesh.position.set(-16, 2.5, 12);
  swarmLiquidMetalMesh.scale.set(1.4, 0.6, 1.4); // flat puddle shape
  swarmLiquidMetalMesh.castShadow = true;
  swarmLiquidMetalMesh.visible = false;
  swarmGroup.add(swarmLiquidMetalMesh);

  // D. Floating Pill Cargo (for SC 2D Raft mission)
  const pillGeo = new THREE.CylinderGeometry(3.5, 3.5, 10, 32);
  const pillMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  swarmRaftPill = new THREE.Mesh(pillGeo, pillMat);
  swarmRaftPill.rotation.z = Math.PI / 2;
  swarmRaftPill.position.set(0, 4.5, 0);
  swarmRaftPill.visible = false;
  swarmGroup.add(swarmRaftPill);

  // E. Circuit Wires & LED
  const ledGeo = new THREE.SphereGeometry(2.5, 16, 16);
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: 0x00f3ff, emissiveIntensity: 0.8 });
  swarmLedMesh = new THREE.Mesh(ledGeo, ledMat);
  swarmLedMesh.position.set(28, 5, 20);
  swarmLedMesh.visible = false;
  swarmGroup.add(swarmLedMesh);

  // Configure initial swarm configuration
  applySwarmConfiguration('ht');

  // Build the complete DIY Desktop Hardware Rig (12V Motor, Standoffs, Rotor, 2mm Cubes, Webcam)
  buildHardwareRig();
}

function buildHardwareRig() {
  hardwareRigGroup = new THREE.Group();
  hardwareRigGroup.position.set(0, 0, 0);

  // 1. Black FDM 3D-Printed Baseplate (160x160x12mm)
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x181e26, roughness: 0.65, metalness: 0.2 });
  const baseGeo = new THREE.BoxGeometry(160, 12, 160);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -62;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  hardwareRigGroup.add(baseMesh);

  // Recessed electronics bay on baseplate
  const bayGeo = new THREE.BoxGeometry(140, 2, 140);
  const bayMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const bayMesh = new THREE.Mesh(bayGeo, bayMat);
  bayMesh.position.y = -55.5;
  hardwareRigGroup.add(bayMesh);

  // 2. 12V DC Geared Motor (Model JGA25-370)
  const motorMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.15 });
  const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(12.5, 12.5, 45, 32), motorMat);
  motorBody.position.y = -35;
  motorBody.castShadow = true;
  motorBody.userData = { id: 'hw_motor' };
  hardwareRigGroup.add(motorBody);

  // Motor shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 16), motorMat);
  shaft.position.y = -10;
  hardwareRigGroup.add(shaft);

  // 3. 4 Brass Hexagonal Standoff Pillars (60mm tall)
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, metalness: 0.92, roughness: 0.25 });
  const standoffGeo = new THREE.CylinderGeometry(3, 3, 60, 6);
  const corners = [
    [55, -26, 55],
    [-55, -26, 55],
    [55, -26, -55],
    [-55, -26, -55]
  ];
  corners.forEach(pos => {
    const post = new THREE.Mesh(standoffGeo, brassMat);
    post.position.set(pos[0], pos[1], pos[2]);
    post.castShadow = true;
    post.userData = { id: 'hw_standoff' };
    hardwareRigGroup.add(post);
  });

  // 4. Rotor Crossbar (90mm span) mounted on motor shaft
  hardwareRotorRig = new THREE.Group();
  hardwareRotorRig.position.y = -8;

  const rotorMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
  const rotorBar = new THREE.Mesh(new THREE.BoxGeometry(80, 6, 12), rotorMat);
  rotorBar.castShadow = true;
  rotorBar.userData = { id: 'hw_rotor' };
  hardwareRotorRig.add(rotorBar);

  // Red (North) and Blue (South) Neodymium Block Magnets (25x10x5mm)
  const magMatN = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.2 });
  const magMatS = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.7, roughness: 0.2 });
  const magGeo = new THREE.BoxGeometry(22, 8, 10);

  const blockN = new THREE.Mesh(magGeo, magMatN);
  blockN.position.set(30, 4, 0);
  blockN.castShadow = true;
  blockN.userData = { id: 'hw_magnets' };
  hardwareRotorRig.add(blockN);

  const blockS = new THREE.Mesh(magGeo, magMatS);
  blockS.position.set(-30, 4, 0);
  blockS.castShadow = true;
  blockS.userData = { id: 'hw_magnets' };
  hardwareRotorRig.add(blockS);

  hardwareRigGroup.add(hardwareRotorRig);

  // 5. Upper Transparent Acrylic Stage (140mm dia, 4mm thick)
  const acrylicMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.94,
    opacity: 1,
    transparent: true,
    roughness: 0.05,
    ior: 1.49
  });
  const acrylicPlate = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 4, 64), acrylicMat);
  acrylicPlate.position.y = 4;
  acrylicPlate.receiveShadow = true;
  hardwareRigGroup.add(acrylicPlate);

  // 6. Pyrex Glass Petri Dish (100mm dia, 15mm tall)
  const dishMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 1,
    transparent: true,
    roughness: 0.08,
    ior: 1.52
  });
  const dishMesh = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 12, 64, 1, true), dishMat);
  dishMesh.position.y = 12;
  dishMesh.userData = { id: 'hw_petri' };
  hardwareRigGroup.add(dishMesh);

  // Water level inside dish
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f3ff,
    transmission: 0.75,
    opacity: 0.8,
    transparent: true,
    roughness: 0.1
  });
  const waterMesh = new THREE.Mesh(new THREE.CylinderGeometry(49, 49, 4, 64), waterMat);
  waterMesh.position.y = 8;
  hardwareRigGroup.add(waterMesh);

  // 7. 48× 2mm Neodymium Cube Microrobots inside the dish (Shiny silver chrome finish)
  const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.98,
    roughness: 0.05
  });

  hardwareCubes = [];
  for (let i = 0; i < 48; i++) {
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.castShadow = true;
    cube.userData = { id: 'hw_cubes', index: i };
    cube.position.set(0, 11, 0);
    hardwareRigGroup.add(cube);
    hardwareCubes.push(cube);
  }

  // 8. Overhead USB Webcam on flexible gooseneck arm
  const armMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 });
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, -60, -75),
    new THREE.Vector3(0, 40, -85),
    new THREE.Vector3(0, 95, -45),
    new THREE.Vector3(0, 85, 0)
  );
  const neckMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 3.5, 12, false), armMat);
  hardwareRigGroup.add(neckMesh);

  const camHeadGeo = new THREE.BoxGeometry(26, 14, 18);
  const camHead = new THREE.Mesh(camHeadGeo, armMat);
  camHead.position.set(0, 85, 0);
  camHead.rotation.x = Math.PI / 2;
  camHead.userData = { id: 'hw_webcam' };
  hardwareRigGroup.add(camHead);

  const camLens = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 4, 24), new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.1, metalness: 0.8 }));
  camLens.position.set(0, 76, 0);
  hardwareRigGroup.add(camLens);

  // 9. PWM Speed Controller Dial on Baseplate
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.5 });
  const dialMesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 10, 24), dialMat);
  dialMesh.position.set(55, -51, 55);
  hardwareRigGroup.add(dialMesh);

  // Initial visibility: hidden until Hardware Rig view is chosen
  hardwareRigGroup.visible = false;
  swarmGroup.add(hardwareRigGroup);
}

function applySwarmConfiguration(config) {
  state.swarm.config = config;

  const count = swarmMicrorobots.length;

  if (config === 'ht') {
    // Head-to-Tail (θ = 0°): Assemble into 6 continuous long chains
    const chainsCount = 6;
    const botsPerChain = Math.floor(count / chainsCount);

    swarmMicrorobots.forEach((bot, idx) => {
      const chainIdx = idx % chainsCount;
      const posInChain = Math.floor(idx / chainsCount);
      const chainAng = (chainIdx / chainsCount) * Math.PI * 2;

      // Radially oriented chain extending outward
      const r = 4.0 + posInChain * 2.5;
      bot.userData.targetPos.set(Math.cos(chainAng) * r, 0.6, Math.sin(chainAng) * r);
      bot.userData.targetRot.set(0, -chainAng + Math.PI / 2, 0);
    });

    document.getElementById('badge-swarm-config').innerText = 'CONFIG: HT ASSEMBLY (0°)';
    document.getElementById('formula-cav').innerText = 'CA/V = (n - 1) / (a * n) = 3.2 mm⁻¹';
    document.getElementById('swarm-tele-cav').innerText = '3.2 mm⁻¹ (HT Low Stiffness)';
    document.getElementById('swarm-tele-speed').innerText = '64.0 mm/s (108 BL/s)';
  } else if (config === 'sc') {
    // Slipped-Co-Facial (θ = 45°): Assemble into a dense 2D hexagonal raft
    const rows = 14;
    const cols = 14;
    const spacing = 1.9;

    swarmMicrorobots.forEach((bot, idx) => {
      const row = Math.floor(idx / cols) - rows / 2;
      const col = (idx % cols) - cols / 2;
      const x = col * spacing + (row % 2) * (spacing / 2);
      const z = row * spacing * 0.866;

      bot.userData.targetPos.set(x, 0.6, z);
      bot.userData.targetRot.set(0, Math.PI / 4, 0); // 45° diagonal angle
    });

    document.getElementById('badge-swarm-config').innerText = 'CONFIG: SC ASSEMBLY (45°)';
    document.getElementById('formula-cav').innerText = 'CA/V = 1.5*(n - 1) / (a * n) = 4.9 mm⁻¹';
    document.getElementById('swarm-tele-cav').innerText = '4.9 mm⁻¹ (SC Medium Raft)';
    document.getElementById('swarm-tele-speed').innerText = '34.0 mm/s (High Packing)';
  } else if (config === 'ff') {
    // Face-to-Face (θ = 90°): Assemble into 4 thick, ultra-rigid columnar stacks
    const stacksCount = 4;
    const botsPerStack = Math.floor(count / stacksCount);

    swarmMicrorobots.forEach((bot, idx) => {
      const stackIdx = idx % stacksCount;
      const inStack = Math.floor(idx / stacksCount);
      const stackAng = (stackIdx / stacksCount) * Math.PI * 2;
      const centerDist = 12.0;

      const cx = Math.cos(stackAng) * centerDist;
      const cz = Math.sin(stackAng) * centerDist;

      // Grid within stack
      const sx = (inStack % 5) * 1.3 - 2.6;
      const sz = Math.floor(inStack / 5) * 1.3 - 5.0;

      bot.userData.targetPos.set(cx + sx, 0.6, cz + sz);
      bot.userData.targetRot.set(0, stackAng + Math.PI / 2, 0); // 90° transverse
    });

    document.getElementById('badge-swarm-config').innerText = 'CONFIG: FF ASSEMBLY (90°)';
    document.getElementById('formula-cav').innerText = 'CA/V = 2*(n - 1) / (a * n) = 6.5 mm⁻¹';
    document.getElementById('swarm-tele-cav').innerText = '6.5 mm⁻¹ (FF High Stiffness)';
    document.getElementById('swarm-tele-speed').innerText = '28.0 mm/s (Impact Crush)';
  }

  // Smoothly tween microrobots to target configurations
  swarmMicrorobots.forEach(bot => {
    gsap.to(bot.position, {
      x: bot.userData.targetPos.x,
      y: bot.userData.targetPos.y,
      z: bot.userData.targetPos.z,
      duration: 1.2,
      ease: "power2.out"
    });
    gsap.to(bot.rotation, {
      x: bot.userData.targetRot.x,
      y: bot.userData.targetRot.y,
      z: bot.userData.targetRot.z,
      duration: 1.2,
      ease: "power2.out"
    });
  });

  // Update button active state
  document.querySelectorAll('.swarm-config-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-swarm-${config}`);
  if (activeBtn) activeBtn.classList.add('active');
}

function setSwarmMission(mission) {
  state.swarm.mission = mission;

  // Toggle mission props visibility
  swarmObstacleMesh.visible = (mission === 'climb' || mission === 'throw');
  swarmTubeMesh.visible = (mission === 'unclog');
  swarmLiquidMetalMesh.visible = (mission === 'morph');
  swarmRaftPill.visible = (mission === 'raft');
  swarmLedMesh.visible = (mission === 'bridge');

  // Match optimal configuration for mission
  if (mission === 'climb' || mission === 'throw') {
    applySwarmConfiguration('ht');
  } else if (mission === 'raft' || mission === 'bridge') {
    applySwarmConfiguration('sc');
  } else if (mission === 'unclog' || mission === 'morph') {
    applySwarmConfiguration('ff');
  }

  document.querySelectorAll('.mission-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-mission-${mission}`);
  if (btn) btn.classList.add('active');
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

  // Animate Camera to optimal view angle
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

// --- UI Event Listeners ---
function setupUIEventListeners() {
  // Domain Switcher: Physical V1 vs Cell 2025 Swarm
  const tabV1 = document.getElementById('tab-v1');
  const tabSwarm = document.getElementById('tab-swarm');

  const panelV1 = document.getElementById('controls-panel');
  const panelSwarm = document.getElementById('swarm-controls-panel');

  const statusV1 = document.getElementById('status-container-v1');
  const statusSwarm = document.getElementById('status-container-swarm');

  const trackerV1 = document.getElementById('tracker-v1');
  const trackerSwarm = document.getElementById('tracker-swarm');

  const teleV1 = document.getElementById('telemetry-v1');
  const teleSwarm = document.getElementById('telemetry-swarm');

  tabV1.addEventListener('click', () => {
    state.systemTab = 'v1';
    tabV1.classList.add('active');
    tabSwarm.classList.remove('active');

    panelV1.classList.remove('hidden');
    panelSwarm.classList.add('hidden');

    statusV1.classList.remove('hidden');
    statusSwarm.classList.add('hidden');

    trackerV1.classList.remove('hidden');
    trackerSwarm.classList.add('hidden');

    teleV1.classList.remove('hidden');
    teleSwarm.classList.add('hidden');

    worldGroup.visible = true;
    swarmGroup.visible = false;

    // Reset camera to V1 viewpoint
    setCameraPreset('iso');
  });

  tabSwarm.addEventListener('click', () => {
    state.systemTab = 'swarm';
    tabSwarm.classList.add('active');
    tabV1.classList.remove('active');

    panelSwarm.classList.remove('hidden');
    panelV1.classList.add('hidden');

    statusSwarm.classList.remove('hidden');
    statusV1.classList.add('hidden');

    trackerSwarm.classList.remove('hidden');
    trackerV1.classList.add('hidden');

    teleSwarm.classList.remove('hidden');
    teleV1.classList.add('hidden');

    worldGroup.visible = false;
    swarmGroup.visible = true;

    // Pan camera to swarm Petri stage
    gsap.to(camera.position, { x: 55, y: 48, z: 65, duration: 1.0, ease: "power2.inOut" });
    gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.inOut" });
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

  // Swarm View Mode Toggle: Micro Scale vs Desktop Hardware Rig
  const btnViewMicro = document.getElementById('btn-swarm-view-micro');
  const btnViewHardware = document.getElementById('btn-swarm-view-hardware');

  btnViewMicro.addEventListener('click', () => {
    state.swarm.view = 'micro';
    btnViewMicro.classList.add('active');
    btnViewHardware.classList.remove('active');

    if (hardwareRigGroup) hardwareRigGroup.visible = false;
    swarmMicrorobots.forEach(b => b.visible = true);
    if (swarmObstacleMesh) swarmObstacleMesh.visible = (state.swarm.mission === 'climb' || state.swarm.mission === 'throw');
    if (swarmTubeMesh) swarmTubeMesh.visible = (state.swarm.mission === 'unclog');
    if (swarmLiquidMetalMesh) swarmLiquidMetalMesh.visible = (state.swarm.mission === 'morph');
    if (swarmRaftPill) swarmRaftPill.visible = (state.swarm.mission === 'raft');
    if (swarmLedMesh) swarmLedMesh.visible = (state.swarm.mission === 'bridge');

    gsap.to(camera.position, { x: 55, y: 48, z: 65, duration: 1.0, ease: "power2.inOut" });
    gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.inOut" });
  });

  btnViewHardware.addEventListener('click', () => {
    state.swarm.view = 'hardware';
    btnViewHardware.classList.add('active');
    btnViewMicro.classList.remove('active');

    if (hardwareRigGroup) hardwareRigGroup.visible = true;
    swarmMicrorobots.forEach(b => b.visible = false);
    if (swarmObstacleMesh) swarmObstacleMesh.visible = false;
    if (swarmTubeMesh) swarmTubeMesh.visible = false;
    if (swarmLiquidMetalMesh) swarmLiquidMetalMesh.visible = false;
    if (swarmRaftPill) swarmRaftPill.visible = false;
    if (swarmLedMesh) swarmLedMesh.visible = false;

    gsap.to(camera.position, { x: 105, y: 95, z: 125, duration: 1.2, ease: "power2.inOut" });
    gsap.to(controls.target, { x: 0, y: 15, z: 0, duration: 1.2, ease: "power2.inOut" });
  });

  // Swarm Configurations (Cell 2025)
  document.getElementById('btn-swarm-ht').addEventListener('click', () => applySwarmConfiguration('ht'));
  document.getElementById('btn-swarm-sc').addEventListener('click', () => applySwarmConfiguration('sc'));
  document.getElementById('btn-swarm-ff').addEventListener('click', () => applySwarmConfiguration('ff'));

  // Swarm Frequencies
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const freq = parseFloat(btn.getAttribute('data-freq'));
      state.swarm.frequency = freq;
      document.getElementById('label-swarm-freq').innerText = `${freq.toFixed(1)} Hz`;
      document.getElementById('badge-swarm-freq').innerText = `FIELD: ${freq.toFixed(1)} Hz ROTATING`;
    });
  });

  // Swarm Motion Mode (Spinning vs Orbital Drag)
  const btnSpin = document.getElementById('btn-motion-spin');
  const btnOrbital = document.getElementById('btn-motion-orbital');

  btnSpin.addEventListener('click', () => {
    state.swarm.motionMode = 'spin';
    btnSpin.classList.add('active');
    btnOrbital.classList.remove('active');
    document.getElementById('swarm-tele-grad').innerText = '0.15 T/m (Spinning/Pivoting)';
  });

  btnOrbital.addEventListener('click', () => {
    state.swarm.motionMode = 'orbital';
    btnOrbital.classList.add('active');
    btnSpin.classList.remove('active');
    document.getElementById('swarm-tele-grad').innerText = '7.0 T/m (High Gradient Orbital)';
  });

  // Swarm Mission Tasks
  document.getElementById('btn-mission-climb').addEventListener('click', () => setSwarmMission('climb'));
  document.getElementById('btn-mission-throw').addEventListener('click', () => setSwarmMission('throw'));
  document.getElementById('btn-mission-raft').addEventListener('click', () => setSwarmMission('raft'));
  document.getElementById('btn-mission-bridge').addEventListener('click', () => setSwarmMission('bridge'));
  document.getElementById('btn-mission-unclog').addEventListener('click', () => setSwarmMission('unclog'));
  document.getElementById('btn-mission-morph').addEventListener('click', () => setSwarmMission('morph'));

  // Inspector Close
  document.getElementById('btn-close-inspector').addEventListener('click', () => {
    document.querySelector('.empty-state').classList.remove('hidden');
    document.getElementById('inspector-details').classList.add('hidden');
    document.querySelectorAll('.layer-list li').forEach(li => li.classList.remove('active'));
  });

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
  let targetPos = new THREE.Vector3(75, 45, 95);
  let lookTarget = new THREE.Vector3(0, 0, 0);

  switch (type) {
    case 'iso': targetPos.set(70, 50, 85); break;
    case 'joint': targetPos.set(24, 14, 28); break;
    case 'top': targetPos.set(0, 110, 0.01); break;
    case 'side': targetPos.set(110, 0, 0); break;
    case 'front': targetPos.set(0, 0, 110); break;
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
}

function stopGait() {
  state.gait = null;
  const b1 = document.getElementById('btn-gait-antiphase');
  const b2 = document.getElementById('btn-gait-inphase');
  if (b1) b1.classList.remove('active');
  if (b2) b2.classList.remove('active');
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

// --- Swarm Kinetic Simulation Loop ---
function updateSwarmSimulation(time, delta) {
  if (state.systemTab !== 'swarm') return;

  const freq = state.swarm.frequency;
  const omega = freq * Math.PI * 2;

  // 1. Rotate the permanent magnet rig beneath the stage
  if (swarmMagnetRig) {
    swarmMagnetRig.rotation.y = time * omega;
  }
  if (hardwareRotorRig) {
    hardwareRotorRig.rotation.y = time * omega;
  }

  // Animate 2mm hardware cubes inside the petri dish
  if (hardwareCubes && hardwareCubes.length > 0 && state.swarm.view === 'hardware') {
    hardwareCubes.forEach((cube, idx) => {
      const armIdx = idx % 4;
      const posOnArm = Math.floor(idx / 4);
      const baseAng = armIdx * (Math.PI / 2) + time * omega * 0.5;
      const r = 5.0 + posOnArm * 3.2;

      cube.position.x = Math.cos(baseAng) * r;
      cube.position.z = Math.sin(baseAng) * r;
      cube.position.y = 10.5 + Math.sin(time * 6 + idx * 0.3) * 0.3;
      cube.rotation.y = -baseAng;
    });
  }

  // 2. Animate Microrobots based on motion mode & configuration
  if (state.swarm.motionMode === 'spin') {
    // Spinning & Pivoting mode (low gradient 0.15 T/m)
    swarmMicrorobots.forEach((bot, idx) => {
      // Rotate around own axis or swarm cluster center
      const pivotLift = Math.sin(time * omega + idx * 0.1) * 0.4;
      bot.position.y = 0.6 + Math.max(0, pivotLift);
      bot.rotation.y = time * omega * 0.5 + (bot.userData.targetRot ? bot.userData.targetRot.y : 0);

      // In HT climbing mission: chains lift up toward obstacle
      if (state.swarm.mission === 'climb' && idx < 20) {
        bot.position.x = bot.userData.targetPos.x + Math.sin(time * 2) * 4;
        bot.position.y = 0.6 + Math.sin(time * 3 + idx * 0.3) * 3.5; // Climbing height
      }

      // In HT self-throwing mission: one bot flings over the wall at 15 Hz
      if (state.swarm.mission === 'throw' && idx === 0) {
        const cycle = (time * 1.5) % 1.0;
        if (cycle < 0.3) {
          bot.position.set(10 + cycle * 35, 1 + Math.sin(cycle / 0.3 * Math.PI) * 12, 0);
        }
      }
    });
  } else {
    // Orbital Dragging mode (high gradient 7.0 T/m) - Agile 880 mm/s orbital flight
    const orbitRadius = 26.0;
    swarmMicrorobots.forEach((bot, idx) => {
      const angle = time * omega + (idx / swarmMicrorobots.length) * Math.PI * 0.2;
      bot.position.x = Math.cos(angle) * orbitRadius;
      bot.position.z = Math.sin(angle) * orbitRadius;
      bot.position.y = 1.2 + Math.sin(time * 10 + idx) * 0.5;
      bot.rotation.y = -angle;
    });

    // In FF unclog mission: swarm smashes into the occlusion tube
    if (state.swarm.mission === 'unclog' && swarmTubeMesh) {
      swarmTubeMesh.scale.x = 1.0 + Math.sin(time * 15) * 0.05; // Impact pulse
    }

    // In FF morph mission: liquid metal droplet ripples under impact
    if (state.swarm.mission === 'morph' && swarmLiquidMetalMesh) {
      swarmLiquidMetalMesh.scale.x = 1.4 + Math.sin(time * 8) * 0.3;
      swarmLiquidMetalMesh.scale.z = 1.4 - Math.sin(time * 8) * 0.2;
    }
  }

  // Raft mission: pill rocks gently on the floating SC raft
  if (state.swarm.mission === 'raft' && swarmRaftPill) {
    swarmRaftPill.position.y = 4.2 + Math.sin(time * 3) * 0.3;
    swarmRaftPill.rotation.x = Math.sin(time * 2) * 0.08;
  }

  // Bridge mission: LED glows steadily
  if (state.swarm.mission === 'bridge' && swarmLedMesh) {
    swarmLedMesh.material.emissiveIntensity = 0.6 + Math.sin(time * 6) * 0.4;
  }
}

// --- Main Render Loop ---
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  const delta = clock.getDelta();

  if (state.systemTab === 'v1') {
    // Run V1 robotic walking gaits if active
    updateGaits(elapsedTime);

    // Animate V1 magnetic flux line dashes
    if (fluxGroup && state.showFlux) {
      fluxGroup.children.forEach((line, idx) => {
        line.material.dashSize = 1.5 + Math.sin(elapsedTime * 4 + idx) * 0.4;
      });
    }
  } else {
    // Run Cell 2025 Magnetic Swarm simulation loop
    updateSwarmSimulation(elapsedTime, delta);
  }

  controls.update();
  update3DAnnotations();
  renderer.render(scene, camera);
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', init);
