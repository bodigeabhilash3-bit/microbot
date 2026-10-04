# Microbot V1 — Autonomous Kinematic Prototype & Magnetic Swarm Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![3D Print: STL Ready](https://img.shields.io/badge/3D%20Print-STL%20Ready-brightgreen.svg)](file:///c:/Users/HP/Desktop/cse/microbot/equator_collar.stl)
[![Firmware: Arduino / ESP32](https://img.shields.io/badge/Firmware-Arduino%20%7C%20ESP32-orange.svg)](file:///c:/Users/HP/Desktop/cse/microbot/microbot_firmware.ino)
[![Simulation: Three.js WebGL](https://img.shields.io/badge/Simulator-Three.js%20WebGL-cyan.svg)](file:///c:/Users/HP/Desktop/cse/microbot/index.html)

> An open-source robotics research project inspired by *Big Hero 6* Microbots, bridging **mechatronic autonomous modular robotics** and **external magnetic swarm intelligence** (*Cell Press Device, 2025*).

---

## 📌 Executive Summary

Most DIY replicas of the *Big Hero 6* Microbot are **passive magnetic props**—magnets inside plastic shells that snap into a static pose but cannot move independently.

This project solves the **"Kinematic Reference Dilemma"** (Newton's 3rd Law on a frictionless spherical joint) to produce a **genuinely autonomous, self-powered crawling Microbot** without needing external magnets beneath the table. It also provides a digital replica of the cutting-edge **Cell Press Device (2025) Magnetic Swarm Lab** for untethered swarm research.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TWO COMPLEMENTARY MODES                         │
├────────────────────────────────────┬───────────────────────────────────┤
│ 🤖 MODE 1: PHYSICAL MICROBOT V1    │ 🔬 MODE 2: CELL 2025 SWARM LAB    │
│ • Autonomous single-unit robot     │ • Untethered micro-swarm (200 bot)│
│ • Internal 3.7g micro-servos       │ • External rotating B-field rig   │
│ • Pushrods + Equator Anchor Collar │ • Programmed anisotropy (0°/45°/90°)│
│ • True floor crawling & steering   │ • Self-assembly (HT/SC/FF)        │
└────────────────────────────────────┴───────────────────────────────────┘
```

---

## 📂 Repository Contents

```bash
microbot/
├── README.md                 # Master project documentation (GitHub)
├── PROJECT_REPORT.md         # Printable engineering report & academic paper
├── BUILD_GUIDE.md            # Step-by-step physical build instructions
├── SWARM_BUILD_GUIDE.md      # DIY Desktop Magnetic Swarm Lab hardware guide
├── generate_stls.py          # Parametric Python script to export binary STLs
│
├── 3D_Models/
│   ├── equator_collar.stl    # Center 12.1mm collar ring with pivot ears
│   ├── pod_chassis.stl       # Lower hexagonal pyramid body (print 2x)
│   └── pod_lid.stl           # Upper aerodynamic snap-fit cover (print 2x)
│
├── Firmware/
│   └── microbot_firmware.ino # Ready-to-flash Arduino / ESP32 crawl gaits
│
├── Simulation/
│   ├── index.html            # Interactive 3D WebGL simulator & assembly guide
│   ├── app.js                # Three.js CAD models, kinematics & swarm engine
│   └── styles.css            # Dark glassmorphic HUD styling
│
└── References/
    └── mmc9.pdf              # Cell Press Device (2025) research paper
```

---

## 🚀 Interactive 3D WebGL Simulator

The repository includes a standalone WebGL engineering dashboard running Three.js + GSAP.

### How to Run Locally:
```bash
# Option 1: Direct file open
Double-click index.html in your browser (Chrome / Edge / Firefox)

# Option 2: Local HTTP server
python -m http.server 8080
# Open http://localhost:8080/index.html
```

### Key Interactive Features:
1. **Interactive Assembly Guide (`🛠️ Build Guide`):** Step-by-step virtual builder showing **where to put every part**, **how to install it**, and **how it works**, with dynamic camera auto-focus.
2. **Exploded View Dispersion:** Continuously variable 0% to 100% component separation.
3. **Live Articulation Simulator:** Sine-wave anti-phase and in-phase gait demonstration.
4. **Cell 2025 Magnetic Swarm Lab:** Live 3D simulation of HT (Chains), SC (Rafts), and FF (Columns) with adjustable 1.5–15 Hz rotating magnetic fields and desktop rig BOM visualization.

---

## ⚙️ Mechanical & Kinematic Architecture (Microbot V1)

```
       [ Pod 1 (Upper Hex Pyramid) ]
                   │
                   ▼  (N42 Ring Magnet Clamping — 5.2 N)
        ┌──────────────────────┐
        │  12mm Steel Sphere   │ <─── [ Equatorial Collar Anchor Ring ]
        └──────────────────────┘                     │
                   ▲                                 ▼
                   │  (N42 Ring Magnet)     [ 1.0mm Piano Pushrod ]
                   │                                 ▲
       [ Pod 2 (Lower Hex Pyramid) ]                 │
                   │                                 │
                   └─────── [ 3.7g Sub-Micro Servo Motor ]
```

### The Kinematic Reference Problem Solved:
* **The Problem:** A motor inside a pod trying to rotate against a free, polished chrome steel sphere will simply slip inside the socket cup due to low friction ($\mu < 0.1$).
* **The Solution:** A low-profile **Equatorial Collar Ring** clasps the ball equator. The servo horn connects to this collar via a **1.0mm piano wire pushrod** with precision Z-bends. When the servo actuates, it pushes against the collar, tilting the entire pod by up to **$\pm 38^\circ$**.

---

## 🛠️ Bill of Materials (BOM)

### Microbot V1 Autonomous Unit (~₹800 / $10 USD)

| Item | Specification | Qty | Approx Cost | Sourcing |
| :--- | :--- | :--- | :--- | :--- |
| **Central Ball** | 12.0 mm AISI 52100 Chrome Steel Ball (G100) | 1 | ₹40 | Bearing shop / Robu.in |
| **Ring Magnets** | N42 NdFeB Ring (10mm OD × 3mm ID × 3mm T) | 2 | ₹140 | Rare earth magnet store |
| **Micro Servos** | 3.7g Sub-Micro Coreless Servos (GH-S37A / DSM44) | 2 | ₹300 | Robu.in / Robocraze |
| **Pushrod Wire** | 1.0 mm Spring Steel Piano Wire | 15 cm | ₹20 | RC hobby store |
| **Microcontroller** | ESP32-C3 SuperMini or Arduino Nano | 1 | ₹250 | Robu.in / Amazon |
| **Battery** | 3.7V 1S LiPo (150mAh–300mAh) | 1 | ₹180 | Drone hobby store |
| **3D Filament** | Black PETG or PLA (0.12mm layer height) | ~40g | ₹40 | 3D Printer |

---

## 🔌 Wiring & Electrical Schematic

```
               ┌──────────────────────────────┐
               │    ESP32-C3 / ARDUINO NANO   │
               │                              │
               │  [GPIO 1 / D9]  ──(Signal)──> Servo 1 (Pod 1)
               │  [GPIO 2 / D10] ──(Signal)──> Servo 2 (Pod 2)
               │  [GND] ─────────(Common)───> Battery (-) & Servos
               └──────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │  3.7V 1S LiPo Battery (150mAh) │
               │  (+) ───> Servo 1 & 2 Power │
               │  (-) ───> Common GND        │
               └─────────────────────────────┘
```

> ⚠️ **CRITICAL WIRING RULE:** Never power servos through the 3.3V pin of your microcontroller. Servos draw up to 500mA stall spikes that cause board brownouts. Wire the battery (+) directly to the servo red wires.

---

## 🏃 Gait Kinematics & Firmware (`microbot_firmware.ino`)

The firmware drives both servos via harmonic sinusoidal modulation:

$$\theta_1(t) = \theta_{\text{neutral}} + A \cdot \sin(\omega t)$$
$$\theta_2(t) = \theta_{\text{neutral}} - A \cdot \sin(\omega t)$$

* **Anti-Phase Crawling Gait (`'c'`):** Pod 1 drives down while Pod 2 lifts up ($180^\circ$ phase offset). Alternating floor contact pushes the robot forward across tables and carpets.
* **In-Phase Climbing Gait (`'i'`):** Synchronous pitching for climbing thresholds and obstacles.
* **Steering (`'l'` / `'r'`):** Differential stroke amplitudes for sharp left and right turns.

### Serial Commands (115200 Baud):
* `'c'` — Start Anti-Phase crawl
* `'i'` — Start In-Phase inchworm climb
* `'l'` / `'r'` — Steer left / right
* `'s'` — Stop & hold neutral 90° pose
* `'+'` / `'-'` — Adjust gait speed (0.5 to 3.5 Hz)

---

## 🔬 Scientific Foundations: Cell Press *Device* (2025)

The project incorporates research from **Yang, Wie et al. (Cell Press *Device*, April 2025)**: *"Magnetic swarm intelligence of mass-produced, programmable microrobot assemblies for versatile task execution."*

```
┌────────────────────────────────────────────────────────────────────────┐
│               THREE DETERMINISTIC ASSEMBLY CONFIGURATIONS              │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ HT (θ = 0°)          │ SC (θ = 45°)         │ FF (θ = 90°)             │
│ Head-to-Tail         │ Slipped-Co-Facial    │ Face-to-Face             │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ • CA/V = 3.2 mm⁻¹    │ • CA/V = 4.9 mm⁻¹    │ • CA/V = 6.5 mm⁻¹        │
│ • Long 1D chains     │ • 2D planar rafts    │ • Rigid columnar blocks  │
│ • Obstacle climbing  │ • Floating rafts     │ • High shear resistance  │
│ • Self-throwing flings│ • Circuit bridging   │ • Occlusion clot crusher │
└──────────────────────┴──────────────────────┴──────────────────────────┘
```

---

## 🗺️ Evolutionary Roadmap

- [x] **Milestone 1:** 3D CAD modeling of the 58mm hexagonal pyramid pods and equatorial collar.
- [x] **Milestone 2:** Interactive 3D WebGL simulator with step-by-step Assembly Guide and Swarm Lab.
- [x] **Milestone 3:** Parametric binary STL generation ([generate_stls.py](file:///c:/Users/HP/Desktop/cse/microbot/generate_stls.py)).
- [x] **Milestone 4:** Autonomous crawling firmware ([microbot_firmware.ino](file:///c:/Users/HP/Desktop/cse/microbot/microbot_firmware.ino)).
- [ ] **Milestone 5:** Physical 3D printing and benchtop assembly of Unit #1.
- [ ] **Milestone 6:** Addition of tip docking magnets for multi-bot magnetic latching.
- [ ] **Milestone 7:** ESP-NOW peer-to-peer wireless swarm sync across 3+ linked units (tandem train & gap bridging).

---

## 📜 Author, License & Citation

**Author / Creator:** Bodige Abhilash ([@bodigeabhilash3-bit](https://github.com/bodigeabhilash3-bit))  
**Repository:** [https://github.com/bodigeabhilash3-bit/microbot](https://github.com/bodigeabhilash3-bit/microbot)  
**License:** Distributed under the **MIT License**.

If you use this architecture or research summary in your academic projects, please cite:
* Yang, K., Won, S., Park, J. E., Jeon, J., & Wie, J. J. (2025). *Magnetic swarm intelligence of mass-produced, programmable microrobot assemblies for versatile task execution.* **Cell Press Device**, 3, 100626.

