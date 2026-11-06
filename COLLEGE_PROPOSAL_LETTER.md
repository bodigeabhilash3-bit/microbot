# PROJECT PROPOSAL & LABORATORY PERMISSION REQUEST

**To:**  
The Head of the Department / Project Evaluation Committee  
Department of Computer Science and Engineering  
[College / University Name]  

**Date:** October 5, 2026  
**Subject:** Formal Approval & Laboratory Resource Request for Mini / Major Project: *"Autonomous Bio-Inspired Modular Microbot with Magnetic Spherical Articulation"*

---

### 1. Project Overview & Title
* **Project Title:** Design, Kinematic Formulation, and Fabrication of an Autonomous Modular Microbot with Active Spherical Magnetic Joints (Microbot V1)
* **Domain:** Robotics & Autonomous Systems, Embedded Systems, Mechatronics, Bio-Inspired Locomotion
* **Principal Investigator / Team Lead:** Bodige Abhilash (Roll No / ID: `____________________`)
* **Team Members (if applicable):**
  1. `______________________________________` (Roll No: `____________`)
  2. `______________________________________` (Roll No: `____________`)
  3. `______________________________________` (Roll No: `____________`)
* **Project Repository & Open-Source Code:** [https://github.com/bodigeabhilash3-bit/microbot](https://github.com/bodigeabhilash3-bit/microbot)
* **Interactive 3D WebGL Simulator:** Operational locally on `index.html` (Three.js WebGL CAD)

---

### 2. Problem Statement & Research Innovation
Traditional modular robotics and movie-inspired replicas (such as the *Big Hero 6* Microbot) face a fundamental physical obstacle: **The Kinematic Reference Dilemma**. Due to Newton's Third Law ($\sum \vec{\tau} = 0$), internal actuators attempting to articulate across a frictionless spherical magnetic joint cause the internal components to slip without transferring motive torque. Consequently, all previous maker implementations have been inert, passive toys.

**Our Proposed Solution:**
We introduce an **Equatorial Collar Hub** mechanically slip-fitted to a 12mm central chrome-steel sphere. By anchoring dual 3.7g coreless sub-micro servos to this stationary reference frame via 1.0mm spring-steel pushrods, the robot achieves:
1. **Active $\pm 38^\circ$ pitch articulation** across a spherical magnetic joint with an Euler buckling safety factor of $SF = 20.08$.
2. **True terrestrial autonomous crawling** at $45-64\text{ mm/s}$ driven by onboard ESP32-C3 RISC-V compute and a 1S LiPo power cell (zero external magnetic rigs or tether wires).
3. **Passive magnetic docking** via N52 neodymium ring magnets delivering $5.2\text{ N}$ clamping force for multi-unit kinematic chaining.

---

### 3. Current Project Deliverables Completed
1. **Full Academic Pre-print:** Publication-grade manuscript attached (`paper.html` / IEEE 2-column format).
2. **Interactive 3D CAD & Kinematic Simulator:** Live WebGL software visualizing assembled, exploded, and kinematic gaits.
3. **Additive Manufacturing CAD Models:** Production-ready binary STL files (`pod_chassis.stl`, `pod_lid.stl`, `equator_collar.stl`).
4. **Embedded Firmware:** Complete Arduino C++ firmware with sinusoidal harmonic gait generation (`microbot_firmware.ino`).

---

### 4. Laboratory Facilities & Permissions Requested
To fabricate and experimentally benchmark the physical prototype, we kindly request permission to access the following college facilities:
1. **MakerSpace / 3D Printing Facility:** Use of FDM/SLA 3D printer for approx. 2 hours of printing (PLA/PETG material; total mass < 30 grams).
2. **Robotics / IoT Laboratory:** Access to a basic soldering station, digital multimeter, and bench DC power supply for electronics assembly and tuning.
3. **Project Lab Workspace:** A flat test bench space for conducting high-speed camera locomotion benchmarks.

---

### 5. Bill of Materials & Budget Estimate (Per Single Autonomous Unit)
*All components have been engineered for extreme cost-effectiveness (Total: ~₹1,070 INR / $12.87 USD)*:
* 2× 3.7g Coreless Sub-Micro Servos: ₹280
* 1× ESP32-C3 RISC-V Mini Development Board: ₹240
* 2× N52 Countersunk Ring Neodymium Magnets (Ø10×Ø6×2mm): ₹120
* 1× 12mm AISI 52100 Precision Chrome Steel Ball: ₹30
* 1× 1S 150mAh 3.7V LiPo Battery + TP4056 USB-C Charger: ₹180
* 3D Printing Filament & Piano Wire linkages: ₹220

---

### 6. Signatures & Approvals

**Submitted By:**  
Bodige Abhilash  
Signature: `_____________________________`  
Date: `____ / ____ / 2026`  

<br>

**Faculty Project Guide / Mentor:**  
Name: `___________________________________`  
Department: `____________________________`  
Signature: `_____________________________`  
Date: `____ / ____ / 2026`  

<br>

**Head of Department / Lab In-Charge:**  
Approval Status: `[  ] APPROVED   /   [  ] REVISION REQUESTED`  
Comments: `__________________________________________________________________`  
Signature & Stamp: `_____________________________`  
Date: `____ / ____ / 2026`  
