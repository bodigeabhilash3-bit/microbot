# ✅ Microbot V1 — 5-Slide Master Verification Checklist
### Quality Assurance, Fact-Checking, and Viva Readiness Audit for 5-Member Team
**Project Title:** Autonomous Bio-Inspired Modular Microbot with Magnetic Spherical Articulation  
**Total Target Presentation Duration:** 10 Minutes (Exactly 2:00 Minutes per Slide / Team Member)  
**Verification Standard:** IEEE Camera-Ready Paper (`paper.html`) & Project Report (`PROJECT_REPORT.md`)

---

## ⏱️ Master 5-Slide Presentation Timing & Rehearsal Schedule

| Slide # | Slide Title | Presenter | Allocated Time | Cumulative Time | Presentation Focus |
|:---:|:---|:---:|:---:|:---:|:---|
| **01** | Project Identity, Motivation & The Kinematic Dilemma | **Member 1 (Lead)** | 2:00 (120s) | 0:00 – 2:00 | Mission, Physics Barrier & Literature Review |
| **02** | Mechanical CAD, Collar Hub & Buckling Proof | **Member 2 (Mechanical)** | 2:00 (120s) | 2:00 – 4:00 | 3D CAD, Collar Moment ($10.2	ext{ mN}\cdot	ext{m}$), Euler $	ext{SF}=20.4$ |
| **03** | Electronics, Power, 4-Phase Crawl Gait & Firmware | **Member 3 (Electronics)** | 2:00 (120s) | 4:00 – 6:00 | ESP32-C3, 100µF Cap, Anisotropic Crawl (58.2 mm/s), FSM |
| **04** | Multi-Robot Swarm Mesh, Itemized BOM & Validation | **Member 4 (Swarm & Cost)** | 2:00 (120s) | 6:00 – 8:00 | ESP-NOW (<2ms), ₹1,070 BOM ($12.87), Academic Status |
| **05** | Applications, Limitations, Roadmap & Viva Defense | **Member 5 (Scope & Lead)** | 2:00 (120s) | 8:00 – 10:00 | USAR, Limitations & Mitigations, M6–M8 Roadmap, Q&A |

---

# 📋 Slide-by-Slide Verification Audits

---

### Slide 01: Project Identity, Motivation & The Kinematic Dilemma
- **Assigned Presenter:** Member 1 (Lead Presenter)
- **Allocated Duration:** 2:00 Minutes (0:00 – 2:00)
- **Visual Elements Check:**
  - [x] Slide title: "Autonomous Bio-Inspired Modular Microbot (Microbot V1)"
  - [x] Speaker chip reads `SPEAKER: MEMBER 1 (LEAD PRESENTER)`
  - [x] Embedded Image: `images/movie_microbot_unit.jpg` renders cleanly
  - [x] 3 Metric Hero badges: ₹1,070 Cost, ±38.0° Pitch, 58.4 mm/s Speed
  - [x] Torque failure formula box displayed: $	au_{friction} = 0.0031	ext{ N}\cdot	ext{m} \ll 	au_{servo} = 0.0441	ext{ N}\cdot	ext{m}$
  - [x] Literature benchmark gap card (M-TRAN $2,500, Kilobot 0 DOF vs Microbot V1 ₹1,070)
  - [x] Key Takeaway bar at base: Solves physical slip barrier without adding expensive gimbals
- **Factual Claims & Source Verification:**
  - *Claim:* Sub-₹1,100 ($12.87) unit cost. $ightarrow$ **Verified:** Itemized in `PROJECT_REPORT.md` Section 6.
  - *Claim:* Clamping force = 14.2 N; chrome ball friction $\mu pprox 0.08$. $ightarrow$ **Verified:** `paper.html` Section II.
  - *Claim:* Servo stall torque = 0.0441 N·m vs joint friction = 0.0031 N·m (14x higher). $ightarrow$ **Verified:** Servo spec sheet & kinematic derivations.
- **Presenter Readiness Check (3 Must-Know Facts):**
  1. The chrome ball is Grade 100 AISI 52100 precision bearing steel.
  2. Free-spin slip results in 0% useful mechanical work without a collar.
  3. Hand-off phrase: *"I now invite Member 2 to walk us through the mechanical CAD and our kinematic solution."*

---

### Slide 02: Mechanical CAD, Equatorial Collar Hub & Buckling Proof
- **Assigned Presenter:** Member 2 (Mechanical Specialist)
- **Allocated Duration:** 2:00 Minutes (2:00 – 4:00)
- **Visual Elements Check:**
  - [x] Slide title: "Mechanical CAD, The Equatorial Collar Hub & Buckling Proof"
  - [x] Speaker chip reads `SPEAKER: MEMBER 2 (MECHANICAL SPECIALIST)`
  - [x] Embedded Image: `images/microbot_cutaway_assembly.jpg` (CAD cutaway)
  - [x] Collar Moment Formula box: $M_{pitch} = 1.2	ext{ N} 	imes 0.0085	ext{ m} = \mathbf{10.2	ext{ mN}\cdot	ext{m}}$
  - [x] Tripartite Architecture card: Pod A (~21g), Core (~6.5g), Pod B (~24g)
  - [x] Euler Buckling Safety card: $P_{cr} = 24.51	ext{ N} \implies \mathbf{SF = 20.4 : 1}$
  - [x] FDM 3D printing specs card: PETG, 0.16mm layer height, $\pm0.15	ext{ mm}$ socket tolerance
- **Factual Claims & Source Verification:**
  - *Claim:* Collar mass = 0.68 grams. $ightarrow$ **Verified:** Slicer mass estimation (`equator_collar.stl`).
  - *Claim:* Torque lever arm = 8.5mm. $ightarrow$ **Verified:** OpenSCAD collar horn geometry.
  - *Claim:* Euler buckling critical load = 24.51 N ($d = 0.8	ext{ mm}$, $L = 18	ext{ mm}$, $E = 210	ext{ GPa}$). $ightarrow$ **Verified:** `paper.html` Section III-C.
  - *Claim:* Factor of Safety = 20.4 : 1. $ightarrow$ **Verified:** $	ext{SF} = 24.51	ext{ N} / 1.20	ext{ N}$.
- **Presenter Readiness Check (3 Must-Know Facts):**
  1. Active-to-Passive Decoupling means no wires cross the joint.
  2. Euler formula: $P_{cr} = rac{\pi^2 E I}{(K L)^2}$. Be prepared to write it on the whiteboard!
  3. Hand-off phrase: *"I now hand over to Member 3 for Electronics Architecture, Gait Kinematics, and Embedded Firmware."*

---

### Slide 03: Electronics, 4-Phase Crawl Gait & Real-Time Firmware
- **Assigned Presenter:** Member 3 (Electronics & Firmware Specialist)
- **Allocated Duration:** 2:00 Minutes (4:00 – 6:00)
- **Visual Elements Check:**
  - [x] Slide title: "Electronics, 4-Phase Crawl Gait & Real-Time Firmware"
  - [x] Speaker chip reads `SPEAKER: MEMBER 3 (ELECTRONICS & FIRMWARE)`
  - [x] Embedded Image: `images/fig5_circuit_schematic.jpg` (Circuit Schematic)
  - [x] 4-Phase Gait sequence description: Extend (+38°), Strike, Contract (-38°), Reset (0°)
  - [x] Crawl velocity formula box: $v_{crawl} = 3.2	ext{ Hz} 	imes 18.2	ext{ mm} = \mathbf{58.24	ext{ mm/s}}$
  - [x] Brownout Defense card: 100µF low-ESR tantalum capacitor buffering 680mA surges
  - [x] C++ Firmware card: 5-state FSM, 14-bit hardware LEDC PWM, 1500ms watchdog
- **Factual Claims & Source Verification:**
  - *Claim:* MCU = ESP32-C3 SuperMini (160MHz RISC-V, 400KB SRAM, 4MB Flash). $ightarrow$ **Verified:** Hardware inventory.
  - *Claim:* Tail friction $\mu = 0.85$ (silicone) vs Head friction $\mu = 0.15$ (PTFE). $ightarrow$ **Verified:** `PROJECT_REPORT.md` Section 4.
  - *Claim:* Battery = 150mAh 1S LiPo yielding 26 minutes continuous crawl. $ightarrow$ **Verified:** 340mA average current model.
  - *Claim:* Firmware footprint = 242 KB Flash (<6%), 28.4 KB RAM (<7%). $ightarrow$ **Verified:** Binary compile stats.
- **Presenter Readiness Check (3 Must-Know Facts):**
  1. Anisotropic friction ratio: $0.85 / 0.15 pprox 5.67 : 1$.
  2. 100µF tantalum capacitor prevents MCU brownout resets when both servos stall simultaneously.
  3. Hand-off phrase: *"I now invite Member 4 to present Swarm Mesh Networking, BOM Cost, and Quantitative Validation."*

---

### Slide 04: Multi-Robot Swarm Mesh, Itemized BOM & Validation
- **Assigned Presenter:** Member 4 (Swarm & Cost Optimization Specialist)
- **Allocated Duration:** 2:00 Minutes (6:00 – 8:00)
- **Visual Elements Check:**
  - [x] Slide title: "Multi-Robot Swarm Mesh, Itemized BOM & Validation"
  - [x] Speaker chip reads `SPEAKER: MEMBER 4 (SWARM & COST SPECIALIST)`
  - [x] Embedded Image: `images/fig6_swarm_topologies.jpg` (9 Swarm Topologies)
  - [x] ESP-NOW Protocol card: Sub-2ms latency (1.84ms measured), 24-byte control packet, 100% off-grid
  - [x] Itemized BOM table totaling ₹1,070 ($12.87) per complete pod
  - [x] Academic Honesty card: Milestones 1–5 complete; Physical Unit #1 fabrication is Milestone 6
- **Factual Claims & Source Verification:**
  - *Claim:* ESP-NOW packet latency = 1.84 ms. $ightarrow$ **Verified:** Benchtop testbed packet logs.
  - *Claim:* Control payload = 24 bytes C struct. $ightarrow$ **Verified:** `microbot_espnow_mesh.ino`.
  - *Claim:* Itemized BOM: MCU ₹260, Servos ₹280, Battery ₹150, Ball & Magnets ₹130, PETG ₹70, Hardware ₹180 $ightarrow$ Total: ₹1,070. $ightarrow$ **Verified:** `PROJECT_REPORT.md` Section 6.
  - *Claim:* 10-unit swarm cost = ₹10,700 ($128.70). $ightarrow$ **Verified:** Mathematical multiplication ($10 	imes 1,070$).
- **Presenter Readiness Check (3 Must-Know Facts):**
  1. ESP-NOW latency (1.84ms) is 10x faster than servo refresh rate (20ms).
  2. The 9 swarm modes include Spine Chain, Bridge Span, Tower Pillar, and Gripper Hand.
  3. Hand-off phrase: *"I now invite Member 5 to discuss real-world applications, constraints, roadmap, and concluding remarks."*

---

### Slide 05: Applications, Limitations, Roadmap & Viva Defense
- **Assigned Presenter:** Member 5 (Applications, Feasibility & Roadmap Specialist)
- **Allocated Duration:** 2:00 Minutes (8:00 – 10:00)
- **Visual Elements Check:**
  - [x] Slide title: "Applications, Limitations, Engineering Roadmap & Viva Defense"
  - [x] Speaker chip reads `SPEAKER: MEMBER 5 (APPLICATIONS & ROADMAP)`
  - [x] Embedded Image: `images/fig1_microbot_cad_assembly.jpg` (Complete CAD Assembly)
  - [x] Operational Deployments card: Confined pipe inspection, USAR rubble search, adaptive shoring
  - [x] Limitations & Mitigations card: 26-min battery, magnetic alignment, FDM drift, RF pipe attenuation
  - [x] Summary of 4 Core Contributions card in emerald
  - [x] 4-Phase Phased Roadmap: Phase 1 (M6, 14 days, ₹4,500), Phase 2 (M7 EPM), Phase 3 (M8 ToF)
  - [x] Panel Viva Defense Routing card: M1 problem, M2 mechanical, M3 electronics, M4 swarm/BOM, M5 roadmap
- **Factual Claims & Source Verification:**
  - *Claim:* Fits into 4-inch (100mm) pipes. $ightarrow$ **Verified:** 24mm outer diameter envelope.
  - *Claim:* EPM (Electro-Permanent Magnet) requires only 10µs pulse to switch states. $ightarrow$ **Verified:** EPM physics specifications.
  - *Claim:* Milestone 6 fabrication budget = ₹4,500; Timeline = 14 working days. $ightarrow$ **Verified:** College proposal letter.
  - *Claim:* Open source on GitHub under MIT license. $ightarrow$ **Verified:** `github.com/bodigeabhilash3-bit/microbot`.
- **Presenter Readiness Check (3 Must-Know Facts):**
  1. The 4 core contributions: Kinematic collar, Euler safety, ₹1,070 BOM, and sub-2ms swarm mesh.
  2. EPM holds permanent magnetic latching with zero continuous electrical power.
  3. Final closing cue: *"All five members of our team are now ready to take your questions across our specialized domains."*

---

## 🎯 5-Member Team Dry-Run Rehearsal Protocol

1. **Strict Stopwatch Enforcement:** 
   - 0:00 to 2:00 $ightarrow$ Member 1
   - 2:00 to 4:00 $ightarrow$ Member 2
   - 4:00 to 6:00 $ightarrow$ Member 3
   - 6:00 to 8:00 $ightarrow$ Member 4
   - 8:00 to 10:00 $ightarrow$ Member 5
2. **Transition Protocol:** Each speaker delivers their verbal hand-off cue at the 1:55 mark of their turn. The next speaker steps up immediately without awkward pauses.
3. **Presenter View Superpower:** In PowerPoint (`Microbot_Presentation.pptx`), run **Presenter View**. The exact spoken script, timing, and anticipated faculty questions appear directly on your laptop screen while the projector shows the visual slide!
