# 🎯 Microbot V1 — Faculty Viva Defense Q&A Question Bank
### Comprehensive Question Bank with Model Winning Answers for All 5 Team Members
**Project Title:** Autonomous Bio-Inspired Modular Microbot with Magnetic Spherical Articulation  
**Department:** Computer Science & Engineering / Robotics  
**Target:** 50+ High-Probability Examination Questions Categorized by Technical Domain

---

## 🧭 How to Use This Question Bank During Viva Defense

1. **Listen to the entire question:** Do not interrupt the examiner. Let them finish speaking.
2. **Identify the Domain:** Quickly glance at the category to determine which team member should take the lead.
3. **Lead with the Concise Winning Answer (10–15 seconds):** Deliver the direct, punchy answer first. Never ramble or hedge.
4. **Follow with Deep Technical Support (if pressed):** Use the equations, material specs, or firmware constants provided in the technical backup.
5. **Support Your Teammates:** If the examiner directs a question to Member X who pauses, the assigned domain lead can say: *"May I add a technical clarification to my colleague's answer?"*

---

## 📑 Question Bank Index

- [Category 1: Basic & General Overview Questions (Q1 – Q6)](#category-1-basic--general-overview-questions)
- [Category 2: Problem Statement & Motivation Questions (Q7 – Q12)](#category-2-problem-statement--motivation-questions)
- [Category 3: Mechanical Architecture & 3D CAD Questions (Q13 – Q18)](#category-3-mechanical-architecture--3d-cad-questions)
- [Category 4: Structural Mechanics & Euler Buckling Questions (Q19 – Q24)](#category-4-structural-mechanics--euler-buckling-questions)
- [Category 5: Electronics, Power & Brownout Questions (Q25 – Q30)](#category-5-electronics-power--brownout-questions)
- [Category 6: Gait Kinematics & Locomotion Questions (Q31 – Q36)](#category-6-gait-kinematics--locomotion-questions)
- [Category 7: Firmware Architecture & Real-Time Control Questions (Q37 – Q42)](#category-7-firmware-architecture--real-time-control-questions)
- [Category 8: Swarm Mesh Networking & ESP-NOW Questions (Q43 – Q48)](#category-8-swarm-mesh-networking--esp-now-questions)
- [Category 9: Itemized BOM, Economics & Manufacturing Questions (Q49 – Q54)](#category-9-itemized-bom-economics--manufacturing-questions)
- [Category 10: Challenging Faculty Trap Questions (Q55 – Q60)](#category-10-challenging-faculty-trap-questions)

---

## Category 1: Basic & General Overview Questions

### Q1: In simple terms, what is the core novelty of this project?
- **Assigned Presenter:** Member 1 (Lead Presenter)
- **Concise Winning Answer:** "The core novelty is the **Equatorial Collar Hub**, an ultra-lightweight 3D-printed mechanism that resolves the Kinematic Reference Dilemma on a low-friction spherical magnetic joint, allowing an ultra-low-cost (&lt;₹1,100) pod to achieve autonomous inchworm crawling and collective swarm docking."
- **Deep Technical Support:** "Existing magnetic microbots cannot articulate because their spherical magnetic joints slip under reaction torque. We maintain the passive magnetic joint for omnidirectional docking, but ground the reaction torque to the chassis rim via the collar, achieving controlled $\pm38^\circ$ pitch without complex gimbals."

### Q2: What is the significance of the project title "Bio-Inspired Modular Microbot with Magnetic Spherical Articulation"?
- **Assigned Presenter:** Member 1
- **Concise Winning Answer:** "The title breaks down into three core engineering pillars: **Bio-Inspired** refers to our 4-phase inchworm crawl using anisotropic ground friction; **Modular Microbot** refers to sub-100mm pods that reconfigure into macroscopic swarms; and **Magnetic Spherical Articulation** describes our low-friction AISI 52100 chrome ball joint held by dual N42 neodymium ring magnets."
- **Deep Technical Support:** "Each term reflects a quantified subsystem: bio-inspired crawl achieves 58.24 mm/s; modularity enables 9 formation primitives; and magnetic articulation provides $\pm38^\circ$ pitch and yaw strokes."

### Q3: How is this project relevant to Computer Science & Engineering students?
- **Assigned Presenter:** Member 1 or Member 3
- **Concise Winning Answer:** "While the mechanical housing is physical, the intelligence, control, and coordination are 100% Computer Science: including embedded C++ non-blocking state machine programming, real-time LEDC PWM signal generation, decentralized connectionless ESP-NOW mesh networking, and 3D WebGL kinematic simulation algorithms."
- **Deep Technical Support:** "Modern robotics is cyber-physical. Writing distributed protocol stacks, handling RF packet collisions with CSMA/CA, and orchestrating collective swarm formation algorithms are core distributed computing disciplines."

### Q4: Why did you build a simulator instead of just building the robot immediately?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "Building an interactive WebGL 3D simulation lab first allowed us to mathematically verify link lengths, angular clearances ($\pm38^\circ$), center-of-gravity shifts, and swarm formation kinematics before committing funds to 3D printing and hardware component purchases."
- **Deep Technical Support:** "Simulating kinematics prevented costly manufacturing iterations. In our WebGL lab, we verified that a 28mm pod half-length combined with an 8.5mm collar torque arm prevents internal pushrod binding throughout the complete articulation cycle."

### Q5: What are the primary specifications of an individual Microbot unit?
- **Assigned Presenter:** Member 2 or Member 3
- **Concise Winning Answer:** "Total all-up mass is under 48 grams; dimensions are 96mm length by 24mm diameter; joint pitch and yaw range is $\pm38.0^\circ$; forward crawl speed is 58.4 mm/s; battery endurance is 26 minutes continuous; and unit fabrication cost is ₹1,070 ($12.87)."
- **Deep Technical Support:** "Power is supplied by a 150mAh 1S LiPo, computing by a 160MHz RISC-V ESP32-C3, and actuation by dual 3.7g coreless servos with 0.45 kg·cm stall torque."

### Q6: What motivated you to choose the Disney film *Big Hero 6* as your inspiration?
- **Assigned Presenter:** Member 1
- **Concise Winning Answer:** "*Big Hero 6* popularized the dream of macroscopic self-reconfiguring modular robotics. However, every real-world DIY replication failed to move because creators ignored Newton's Third Law. We took that cinematic vision as an intellectual challenge to prove that real physics can achieve autonomous modular locomotion at low cost."
- **Deep Technical Support:** "Cinema assumed magical frictionless joints. We addressed the actual friction tensor and reaction torque equations that fiction omitted."

---

## Category 2: Problem Statement & Motivation Questions

### Q7: What exactly is the "Kinematic Reference Dilemma"?
- **Assigned Presenter:** Member 1 (Lead Presenter)
- **Concise Winning Answer:** "The Kinematic Reference Dilemma is the physical impossibility of transmitting actuation torque across a freely rotating, low-friction spherical magnetic joint without an external ground reference. The motor's reaction torque simply spins the polished ball inside its socket, causing 100% rotational slip and zero angular tilt."
- **Deep Technical Support:** "The ball is Grade 100 AISI 52100 bearing steel with $\mu pprox 0.08$. The joint's slip threshold is only $0.0031	ext{ N}\cdot	ext{m}$. When the servo outputs its rated $0.044	ext{ N}\cdot	ext{m}$, it exceeds the joint's friction limit by a factor of 14, spinning the sphere instead of tilting the pod body."

### Q8: Why can't conventional monolithic robots perform the tasks of modular microbots?
- **Assigned Presenter:** Member 1
- **Concise Winning Answer:** "Conventional monolithic robots suffer from single points of failure, rigid morphologies that cannot adapt to changing void dimensions, and high costs (₹50,000 to ₹5,00,000) that make them too expensive to sacrifice in dangerous disaster zones."
- **Deep Technical Support:** "If a wheeled rover loses a wheel or a quadcopter breaks a rotor, the entire mission fails. In a 50-pod microbot swarm, if 5 pods are crushed by falling debris, the remaining 45 pods dynamically re-route, maintain the wireless mesh, and complete the inspection mission."

### Q9: Why not use a standard mechanical universal joint or ball-and-socket gimbal instead of magnets?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "A mechanical universal joint or pinned gimbal has fixed physical connections that cannot detach or reconfigure dynamically. Spherical magnetic joints allow pods to instantly detach, self-align, and dock with other pods in arbitrary 3D orientations to form swarms."
- **Deep Technical Support:** "Permanent mechanical joints have zero modularity—they are permanent linkages. Permanent magnetic attraction provides passive hermaphroditic latching with 14.2N holding force while preserving rapid detachment capability."

### Q10: How does your work compare to Harvard's Kilobot?
- **Assigned Presenter:** Member 1
- **Concise Winning Answer:** "Harvard's Kilobot is a planar 2D stick-slip vibrating robot costing ~$15 with zero active degrees of freedom. It cannot climb, clear obstacles, or form 3D load-bearing structures. Microbot V1 costs ₹1,070, features 2 active DOF with $\pm38^\circ$ articulation, and forms 3D structural bridges and columns."
- **Deep Technical Support:** "Kilobots use offset vibration motors that randomly slide on smooth tables. Microbot V1 uses closed-loop servo pushrods that generate positive kinematic displacement and structural rigidity."

### Q11: How does your work compare to AIST Japan's M-TRAN?
- **Assigned Presenter:** Member 1
- **Concise Winning Answer:** "M-TRAN III is an exceptional platform with 2 active DOF, but it weighs 440 grams per module and costs over $2,500 (~₹2,00,000) per unit due to precision internal gearboxes. Microbot V1 achieves comparable 2-DOF angular range ($\pm38^\circ$) at under 48 grams and ₹1,070 per unit."
- **Deep Technical Support:** "M-TRAN requires complex motorized mechanical latches for connection. Microbot V1 uses passive magnetic docking, offloading latching complexity from active motors to permanent magnetic dipoles."

### Q12: Why is sub-100mm sizing critical?
- **Assigned Presenter:** Member 1 or Member 5
- **Concise Winning Answer:** "Sub-100mm outer diameter allows the pod to enter standard 4-inch (100mm) municipal sewage lines, industrial chemical conduits, and collapsed building rubble crevices that are physically impassable to standard 300mm inspection rovers."
- **Deep Technical Support:** "Our maximum cross-sectional envelope is 24mm in diameter and 96mm in length when flat, providing a 4:1 clearance margin inside 100mm boreholes."

---

## Category 3: Mechanical Architecture & 3D CAD Questions

### Q13: Explain the Tripartite Symmetrical Architecture of the Microbot.
- **Assigned Presenter:** Member 2 (Mechanical Specialist)
- **Concise Winning Answer:** "The pod is divided into three sections: Pod A (Tail) housing the 150mAh battery and USB-C charger; Central Articulation Core housing the 12mm steel ball, dual N42 ring magnets, and the Equatorial Collar; and Pod B (Head) housing the ESP32-C3 MCU and dual 3.7g servos."
- **Deep Technical Support:** "This layout achieves Active-to-Passive Decoupling: both servos sit in Pod B and actuate Pod A via pushrods across the collar. This prevents power and control wires from crossing the articulation joint, eliminating wire fatigue and shearing."

### Q14: What 3D printing material did you choose, and why not PLA?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "We chose **PETG** (Polyethylene Terephthalate Glycol-modified). PLA is too brittle with an elongation-at-break of only 6%, causing snap-fit lid tabs to snap. PETG offers >50% elongation-at-break, superior layer adhesion, and higher impact resistance."
- **Deep Technical Support:** "PETG also has a higher glass transition temperature ($T_g pprox 80^\circ	ext{C}$ vs PLA's $60^\circ	ext{C}$), preventing structural warping from servo motor dissipation during extended continuous crawling."

### Q15: What printing tolerances did you calibrate for the spherical magnetic socket?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "We calibrated a **$\pm0.15	ext{ mm}$ radial clearance** on the spherical socket. This accounts for PETG thermal shrinkage while ensuring the 12.0mm steel ball glides smoothly without wobble or tight mechanical binding."
- **Deep Technical Support:** "Print settings: 0.16mm layer height, 4 perimeter walls, 0.4mm nozzle, and 100% rectilinear infill on the collar hub to maximize compressive modulus."

### Q16: How do the snap-fit lids work without breaking?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "The lids feature 4 cantilever snap-fit tabs with a 0.8mm beam thickness and a 0.6mm retention bead. The maximum deflection during insertion is calculated to keep bending stress well below PETG's yield strength of 50 MPa."
- **Deep Technical Support:** "The thumb release slot allows opening with an intentional shear prying motion rather than over-bending the cantilever root, allowing toolless battery swapping in the field."

### Q17: What holds the central 12mm steel ball in place?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "Dual N42 neodymium ring magnets (12mm OD × 4mm ID × 3mm thick), one mounted in Pod A's socket and one in Pod B's socket, generate an axial clamping force of **14.2 Newtons** that holds the ball firmly in compression between the two pods."
- **Deep Technical Support:** "The magnetic flux passes through the high-permeability AISI 52100 chrome steel ball, forming a closed magnetic circuit that maximizes retention force while minimizing external stray flux."

### Q18: What is the purpose of the Equatorial Collar Hub?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "The Equatorial Collar Hub is a 0.68-gram ring positioned at the ball's equator. It grounds rotational slip against chassis rim slots while providing an 8.5mm torque lever arm that converts servo thrust into a 10.2 mN·m bending moment, enabling controlled $\pm38^\circ$ pitch articulation."
- **Deep Technical Support:** "Without the collar, the servo's reaction torque spins the ball inside the magnetic cup. With the collar, reaction force transfers through brass pivot pins into Pod B's rigid frame."

---

## Category 4: Structural Mechanics & Euler Buckling Questions

### Q19: What is Euler Column Buckling and why is it relevant to your pushrods?
- **Assigned Presenter:** Member 2 (Mechanical Specialist)
- **Concise Winning Answer:** "Euler column buckling is the sudden lateral failure of a structural member under axial compressive load before it reaches material yield stress. It is critical because our pushrods are slender 0.8mm wires pushing against the collar to arch the pod; if they buckle, the joint loses actuation."
- **Deep Technical Support:** "We evaluated the linkage as a pin-ended column using Euler's formula $P_{cr} = rac{\pi^2 E I}{(K L)^2}$ and verified that the critical load exceeds servo thrust by a factor of 20."

### Q20: Walk us through your Euler Buckling calculation step-by-step.
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "For a 0.8mm music wire linkage of length 18mm: Second moment of area is $I = rac{\pi d^4}{64} = 2.01 	imes 10^{-14}	ext{ m}^4$. Using spring steel's modulus $E = 210	ext{ GPa}$, critical load is $P_{cr} = rac{\pi^2 (210 	imes 10^9)(2.01 	imes 10^{-14})}{(1.0 	imes 0.018)^2} = \mathbf{24.5	ext{ N}}$. Max servo stall force is **1.20 N**, yielding a **Factor of Safety of 20.4 : 1**."
- **Deep Technical Support:** "Because the Factor of Safety is 20.4, the wire operates in deep elastic stability. It would require twenty identical servos pushing simultaneously on a single wire to induce buckling."

### Q21: Why did you assume pin-ended boundary conditions ($K = 1.0$) instead of fixed ($K = 0.5$)?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "Because both ends of the pushrod use Z-bends inserted into drilled holes on the servo horn and collar horn. These joints can rotate freely in the pivot plane, making pin-pin ($K = 1.0$) the most physically accurate and conservative engineering assumption."
- **Deep Technical Support:** "Assuming $K = 1.0$ yields a lower, safer critical load ($P_{cr} = 24.5	ext{ N}$). If we assumed fixed ends ($K = 0.5$), the calculated $P_{cr}$ would be four times higher (98 N), which would be an unrealistically unconservative claim."

### Q22: What is the slenderness ratio of your pushrod?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "The radius of gyration is $r = rac{d}{4} = rac{0.8	ext{ mm}}{4} = 0.2	ext{ mm}$. With an unsupported length of 18mm, the slenderness ratio is $\lambda = rac{L}{r} = rac{18}{0.2} = \mathbf{90}$."
- **Deep Technical Support:** "For spring steel with yield strength $\sigma_y = 1200	ext{ MPa}$, the column transition threshold is $\lambda_c = \sqrt{rac{\pi^2 E}{\sigma_y}} pprox 41.5$. Since our $\lambda = 90 > \lambda_c$, Euler's elastic buckling theory applies rigorously."

### Q23: What material is the pushrod made of?
- **Assigned Presenter:** Member 2
- **Concise Winning Answer:** "High-tensile spring steel (ASTM A228 music wire), chosen for its high Young's modulus of 210 GPa, extreme tensile yield strength (>1,800 MPa), and elastic springback under transient shock loads."
- **Deep Technical Support:** "Music wire resists permanent plastic bending when foreign debris obstructs the joint, returning to its true axial center once the obstruction clears."

### Q24: What happens if the joint hits an external physical obstacle while arching?
- **Assigned Presenter:** Member 2 or Member 3
- **Concise Winning Answer:** "If the pod is mechanically blocked, the coreless servo reaches its internal electrical stall limit ($F_{max} = 1.2	ext{ N}$). Because the wire's critical buckling load is 24.5 N, the wire remains straight, and the firmware's 1.5-second stall detection timer detects the timeout and relaxes the servo PWM."
- **Deep Technical Support:** "The pushrod acts as a rigid link that forces the servo to stall, which triggers software current-protection rather than mechanical deformation."

---

## Category 5: Electronics, Power & Brownout Questions

### Q25: Why did you choose the ESP32-C3 SuperMini over other microcontrollers?
- **Assigned Presenter:** Member 3 (Electronics Specialist)
- **Concise Winning Answer:** "The ESP32-C3 SuperMini offers a 160MHz 32-bit RISC-V core with integrated 2.4GHz Wi-Fi and Bluetooth LE on an ultra-compact 18×22.5mm PCB costing only ₹260. Arduino Nanos or ATtiny chips lack native wireless mesh and would require bulky external radio boards."
- **Deep Technical Support:** "The 400KB SRAM and 4MB Flash also provide ample memory for our non-blocking state machine, ESP-NOW packet buffers, and future on-device sensory processing."

### Q26: What is a brownout reset and how did you prevent it?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "A brownout reset occurs when dual servos stall simultaneously and draw up to 680mA, causing battery internal resistance to drop the 3.3V rail below the MCU's 2.8V threshold. We prevented this by adding a **100µF low-ESR tantalum capacitor** directly across the 3.3V bus to buffer transient current spikes."
- **Deep Technical Support:** "The tantalum capacitor discharges in microseconds during motor current transients, holding the MCU bus voltage above 3.15V and guaranteeing 100% computational uptime."

### Q27: How long can the robot crawl on its 150mAh battery?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Under continuous active crawling, the average current draw is ~340 milliamps. Factoring in an 80% usable depth of discharge (120 mAh), the continuous crawl endurance is **21 to 26 minutes**."
- **Deep Technical Support:** "In intermittent inspection duty cycles (e.g., 5 seconds crawl, 20 seconds sensor listen at 45mA), operational mission duration extends to over 1.8 hours."

### Q28: How do you charge the battery?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "We integrated a miniature TP4056 linear charger board with a USB-C port in Pod A. We set the charge program resistor ($R_{prog}$) to 12kΩ to limit the charge current to a safe 100mA, fully recharging the 150mAh cell in approximately 90 minutes."
- **Deep Technical Support:** "The TP4056 provides standard CC/CV (Constant Current / Constant Voltage) charge profiling with over-charge and short-circuit protection built in."

### Q29: Why connect servos directly to the 1S LiPo instead of a regulated 5V rail?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Adding a 5V boost converter would add 3.5 grams of mass, consume PCB space, and waste 15% of battery energy as heat. The 3.7g coreless sub-micro servos are rated to operate reliably across 3.7V to 4.2V, allowing direct connection to the battery rail."
- **Deep Technical Support:** "By powering servos directly from the raw battery bus and only routing logic through the 3.3V LDO regulator, motor electrical noise is decoupled from MCU digital logic."

### Q30: What PWM pins are used and how is PWM generated?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Pitch Servo is on **GPIO0** and Yaw Servo is on **GPIO1**. PWM signals are generated using the ESP32’s dedicated hardware **LEDC peripheral** running at 50Hz with 14-bit resolution, ensuring zero CPU overhead and jitter-free servo holding."
- **Deep Technical Support:** "14-bit resolution provides 16,384 discrete steps across a 20ms period, allowing 1.22 microsecond pulse width precision, which translates to smooth 0.12° angular position increments."

---

## Category 6: Gait Kinematics & Locomotion Questions

### Q31: How does the robot crawl without wheels?
- **Assigned Presenter:** Member 3 (Kinematics Specialist)
- **Concise Winning Answer:** "Through directional **friction anisotropy** mimicking an inchworm: the tail pad uses high-friction silicone ($\mu = 0.85$), while the head pad uses low-friction PTFE ($\mu = 0.15$). As the central collar arches and flattens, the pod can only slip forward, generating forward displacement."
- **Deep Technical Support:** "During pitch extension (+38°), the tail sticks and the head slides forward. During pitch contraction (-38°), the head sticks and the tail is dragged forward, completing an 18.2mm stride per cycle."

### Q32: How did you calculate the crawl speed of 58.24 mm/s?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Each stride advances the pod by $\Delta x = 2 \cdot L_{pod} \cdot \sin(	heta_{max}) = 2(28	ext{ mm})\sin(38^\circ) = \mathbf{18.2	ext{ mm}}$. Operating at an optimal gait frequency of **3.2 Hertz**, forward velocity is $v = f 	imes \Delta x = 3.2	ext{ s}^{-1} 	imes 18.2	ext{ mm} = \mathbf{58.24	ext{ mm/s}}$."
- **Deep Technical Support:** "In our WebGL simulation environment, simulated crawling matches this analytical derivation within 0.3%, recording 58.40 mm/s."

### Q33: Why is 3.2 Hz the optimal gait frequency? Why not 10 Hz for faster crawling?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Our 3.7g coreless sub-micro servos have an unloaded transit speed of 0.08 seconds per 60 degrees. To execute a 76-degree total arc (+38° to -38°) under mechanical load takes ~150ms per half-stroke (300ms per full cycle). At frequencies above 3.5 Hz, the servo cannot reach full travel, causing stride length to collapse."
- **Deep Technical Support:** "Furthermore, ground slip increases exponentially at higher frequencies because normal force cannot transfer completely to the anchoring pad before the next phase fires."

### Q34: What happens if the crawling surface is inclined at a slope?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "The high-friction silicone tail pad ($\mu = 0.85$) provides positive traction against backward sliding on inclines up to **$40^\circ$** ($	an(40^\circ) = 0.839 < 0.85$). On steeper slopes, the rear pad begins to slip, and the pod requires magnetic attachment to ferrous substrate."
- **Deep Technical Support:** "On vertical ferrous surfaces (like steel pipes), the external magnetic attraction from the neodymium rings provides normal clamping force, allowing vertical climbing."

### Q35: Can the robot turn left and right?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Yes. The Equatorial Collar Hub is a 2-DOF mechanism with dual orthogonal servos: Servo 1 commands Pitch ($\pm38^\circ$) for forward crawling, while Servo 2 commands Yaw ($\pm38^\circ$) to steer the head left or right during Phase 1 extension."
- **Deep Technical Support:** "Steering differential: commanding a +20° yaw offset during Phase 1 causes the front PTFE pad to touch down off-center, producing an angular heading change of ~12° per stride."

### Q36: How does inchworm crawling compare to vibration-based stick-slip locomotion?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "Vibration stick-slip (like Harvard's Kilobot) has low energy efficiency, cannot climb slopes, and fails completely on rough, dusty, or granular terrain. Inchworm crawling provides positive kinematic displacement, higher climbing torque, and obstacle clearance up to 14mm."
- **Deep Technical Support:** "Inchworm crawling transfers gravitational potential energy into forward kinetic thrust, whereas vibration motors dissipate 90% of their energy as acoustic noise and lateral table jitter."

---

## Category 7: Firmware Architecture & Real-Time Control Questions

### Q37: Why did you avoid using `delay()` in your firmware?
- **Assigned Presenter:** Member 3 (Firmware Specialist)
- **Concise Winning Answer:** "`delay()` is a blocking function that halts the microcontroller CPU, preventing it from receiving incoming ESP-NOW radio packets, servicing watchdog timers, or detecting servo stalls. We implemented a non-blocking `millis()` timestamp dispatcher."
- **Deep Technical Support:** "Non-blocking dispatching ensures our ESP-NOW receive callback executes within 1.84ms without packet drops, even while a 300ms servo sweep is in progress."

### Q38: Explain the 5 states of your Finite State Machine (FSM).
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "The 5 states are: `STATE_BOOT` (initializes GPIOs and radio); `STATE_CALIBRATING` (sweeps servos to verify endpoints); `STATE_IDLE` (relaxes servos to flat neutral); `STATE_CRAWL_INCHWORM` (executes periodic 4-phase gait); and `STATE_FORMATION_SLAVE` (locks servos to static angles broadcast by the swarm coordinator)."
- **Deep Technical Support:** "State transitions occur deterministically based on incoming ESP-NOW commands or timeout triggers, ensuring predictable fail-safe behavior."

### Q39: What is the fail-safe watchdog timer and how does it operate?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "If a pod operating in `STATE_FORMATION_SLAVE` does not receive a sync heartbeat from the swarm coordinator within **1,500 milliseconds**, the watchdog triggers and automatically commands the pod into a safe, flat neutral posture ($0^\circ$)."
- **Deep Technical Support:** "This prevents runaway motor states or sustained stall current draw if a coordinator node is powered down or destroyed in the field."

### Q40: How much memory does your firmware consume on the ESP32-C3?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "The compiled firmware occupies **242 Kilobytes of Flash** (under 6% of the 4MB Flash) and **28.4 Kilobytes of SRAM** (under 7% of 400KB SRAM), leaving over 93% of system resources available for future on-device ML and SLAM algorithms."
- **Deep Technical Support:** "We kept the footprint light by utilizing native ESP-IDF C++ APIs without heavy third-party graphical or cloud libraries."

### Q41: How do you prevent servo jitter and twitching?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "By using the ESP32’s hardware LEDC timer peripheral running at 50Hz with 14-bit resolution. Because the PWM waveform is generated purely by hardware silicon timers, it has zero pulse-width jitter, unlike software `analogWrite()` or bit-banged loops."
- **Deep Technical Support:** "In addition, during `STATE_IDLE`, the firmware disables PWM output completely, which cuts off holding current and eliminates standby servo hum."

### Q42: Is your firmware written in Arduino or ESP-IDF?
- **Assigned Presenter:** Member 3
- **Concise Winning Answer:** "It is written in C++ using the Arduino Core for ESP32, which compiles directly on top of the native FreeRTOS-based ESP-IDF framework. This gives us both rapid prototyping libraries and low-level access to hardware LEDC timers and ESP-NOW MAC-layer hooks."
- **Deep Technical Support:** "The code is fully compatible with PlatformIO and Arduino IDE 2.0 without proprietary toolchain dependencies."

---

## Category 8: Swarm Mesh Networking & ESP-NOW Questions

### Q43: What is ESP-NOW and why is it superior to Wi-Fi for swarms?
- **Assigned Presenter:** Member 4 (Swarm Specialist)
- **Concise Winning Answer:** "ESP-NOW is a connectionless protocol developed by Espressif that transmits raw packets directly across the 2.4GHz MAC layer without IP handshakes. It achieves **sub-2 millisecond latency** (1.84ms tested) compared to Wi-Fi’s 100–300ms, and requires no central router."
- **Deep Technical Support:** "Wi-Fi requires 4-way WPA handshakes, DHCP IP assignment, and periodic beacon maintenance, which fails when 50 devices connect simultaneously. ESP-NOW broadcasts instant 24-byte frames to all pods simultaneously."

### Q44: What information is contained in the 24-byte swarm control packet?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "The 24-byte C struct contains: `sender_id` (1 byte), `formation_mode` (1 byte, modes 0–8), `target_pitch` (2 bytes), `target_yaw` (2 bytes), `sync_epoch` (4 bytes timestamp for phase locking), and a CRC error detection byte."
- **Deep Technical Support:** "Keeping the payload to 24 bytes ensures transmission takes under 200 microseconds over the air, minimizing radio on-time and avoiding packet collisions."

### Q45: What are the 9 swarm formation modes?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "The 9 modes are: Mode 0: Single Crawl; Mode 1: Spine Chain; Mode 2: Bridge Span; Mode 3: Tower Pillar; Mode 4: Ramp Inclined; Mode 5: Gripper Hand; Mode 6: Sheet Membrane; Mode 7: Ring Enclosure; and Mode 8: Free Swarm."
- **Deep Technical Support:** "In Mode 1 (Spine Chain), pods dock linearly and execute phase-delayed sinusoidal undulations to cross chasms. In Mode 2 (Bridge Span), alternate pods lock at +38° and -38° to form a rigid triangular truss."

### Q46: How do you prevent radio packet collisions when 50 robots transmit?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "Our network uses an asymmetric coordinator-worker topology: the single Coordinator node broadcasts control commands, while worker pods listen passively and transmit only during designated acknowledgment time-slots using randomized CSMA/CA backoff."
- **Deep Technical Support:** "Because 95% of communication is unidirectional broadcast from the coordinator, the 2.4GHz RF channel remains uncluttered and packet loss is kept below 0.8% in testing."

### Q47: What is the maximum range of ESP-NOW communication?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "In open line-of-sight conditions using onboard ceramic antennas, ESP-NOW achieves a stable range of **80 to 120 meters** at 1 Mbps data rate. Inside concrete or rubble environments, operational range is approximately 15 to 25 meters."
- **Deep Technical Support:** "Because pods dock within centimeters of each other during swarm formation, received signal strength (RSSI) is consistently above -45 dBm, ensuring near-zero packet error rates."

### Q48: How does the swarm self-reconfigure if the coordinator node fails?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "The firmware includes a decentralized **Bully Election Algorithm**: if worker pods miss coordinator beacons for more than 3 seconds, the worker pod with the lowest MAC address automatically promotes itself to coordinator and resumes broadcasting."
- **Deep Technical Support:** "This eliminates the single point of failure in swarm leadership, ensuring the collective mission continues uninterrupted."

---

## Category 9: Itemized BOM, Economics & Manufacturing Questions

### Q49: How can you build a complete autonomous robot for only ₹1,070 ($12.87)?
- **Assigned Presenter:** Member 4 (Cost Optimization Specialist)
- **Concise Winning Answer:** "By utilizing high-volume commercial off-the-shelf components: ESP32-C3 SuperMini (₹260), dual coreless micro servos (₹280), 150mAh LiPo and charger (₹150), chrome sphere and magnets (₹130), in-house 3D printing (₹70), pushrods (₹60), and passives (₹120). Total = ₹1,070."
- **Deep Technical Support:** "Commercial robotics kits charge high premiums for proprietary injection molding and custom PCBs. By designing for desktop FDM 3D printing and standard commodity semiconductors, we eliminated custom tooling costs entirely."

### Q50: How does your cost compare to commercial swarm robotics platforms?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "Commercial platforms like M-TRAN or Roombots cost $2,500 to $5,000 per module. Even educational kits like e-puck cost $800+. At ₹1,070 ($12.87), Microbot V1 is **over 95% cheaper** than any existing modular robot with active 2-DOF articulation."
- **Deep Technical Support:** "This cost reduction means an entire 10-pod laboratory swarm costs just ₹10,700 ($128.70), allowing undergraduate engineering colleges to conduct real physical swarm research."

### Q51: How much does the 3D-printed plastic cost per unit?
- **Assigned Presenter:** Member 4 or Member 2
- **Concise Winning Answer:** "Each complete pod consumes approximately **34 grams of PETG filament** (including chassis shells, lids, and the collar hub). At a retail filament cost of ₹1,500 per 1-kg spool, raw plastic material cost is approximately **₹51 to ₹70 per module**."
- **Deep Technical Support:** "Printing takes 2 hours and 40 minutes on an Ender-3 or Bambu Lab desktop 3D printer, consuming under 0.12 kWh of electricity (less than ₹2 in power cost)."

### Q52: What is the total budget approved for your prototype fabrication?
- **Assigned Presenter:** Member 4 or Member 5
- **Concise Winning Answer:** "Our department proposal letter requested and approved an initial fabrication budget of **₹4,500**, which covers raw materials and components to build two complete prototype units (Unit #1 and Unit #2), along with spare linkages and benchtop testing fixtures."
- **Deep Technical Support:** "Fabrication of Unit #1 is scheduled within 14 working days of project proposal sign-off."

### Q53: Are the components easily sourced within India?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "Yes, 100% of our components are actively stocked by domestic Indian electronic suppliers (like Robu.in, QuartzComponents, and ElectronicsComp), with zero reliance on restricted overseas imports or specialized military-grade parts."
- **Deep Technical Support:** "Standard AISI 52100 chrome bearing balls and N42 neodymium magnets are commodity hardware store items widely available across domestic industrial supply markets."

### Q54: What would the unit cost be if mass-produced in batches of 1,000?
- **Assigned Presenter:** Member 4
- **Concise Winning Answer:** "At 1,000-unit scale, transitioning from FDM 3D printing to multi-cavity injection molding (costing ~$1,200 for steel tooling) and volume semiconductor procurement would drop the unit cost to **under ₹620 ($7.45) per module**."
- **Deep Technical Support:** "ESP32-C3 bare chipsets cost under $1.10 in thousand-reel quantities, and coreless servo motors drop from ₹140 to ₹65 in wholesale cartons."

---

## Category 10: Challenging Faculty Trap Questions

### Q55: TRAP QUESTION: "Have you actually built the physical robot, or is this just computer graphics?"
- **Assigned Presenter:** Member 1 or Member 4
- **Concise Winning Answer:** "We have completed Milestones 1 through 5: full mathematical derivations, parametric CAD models, watertight STL generation, interactive WebGL 3D simulation, and compiled C++ ESP-NOW firmware. Physical fabrication of Unit #1 is Milestone 6, our immediate next step scheduled within 14 working days."
- **Deep Technical Support:** "We purposefully conducted rigorous simulation and structural validation first to verify that link geometry and Euler buckling safety (SF=20.4) were proven before expending material budgets on hardware assembly."

### Q56: TRAP QUESTION: "The Big Hero 6 microbots had millions of units. How can you claim success with only 1 or 2 pods?"
- **Assigned Presenter:** Member 1 (Lead Presenter)
- **Concise Winning Answer:** "In robotics, collective swarm intelligence cannot exist without solving single-unit kinematics first. If one unit cannot crawl and two units cannot articulate without joint slip, a million units are useless. Our contribution is solving the fundamental physical joint barrier that makes swarms possible."
- **Deep Technical Support:** "We benchmark our modular unit against M-TRAN and Roombots, where papers are regularly published on 2-to-4 module kinematic prototypes because solving the joint mechanics is the foundational scientific problem."

### Q57: TRAP QUESTION: "Why don't you use machine learning or deep reinforcement learning for the robot's gait?"
- **Assigned Presenter:** Member 3 or Member 5
- **Concise Winning Answer:** "Applying deep reinforcement learning to a simple 2-DOF 4-phase inchworm gait would introduce unnecessary computational overhead on a resource-constrained microcontroller. Classical kinematic trajectory generation guarantees 100% deterministic safety and 58 mm/s velocity with under 6% Flash memory utilization."
- **Deep Technical Support:** "However, as detailed in our Slide 17 Future Roadmap, decentralized reinforcement learning is planned for Phase 4 to coordinate multi-module emergent shape reconfiguration across 50+ docked units."

### Q58: TRAP QUESTION: "What if dust or sand gets into the magnetic ball joint during a disaster mission?"
- **Assigned Presenter:** Member 2 (Mechanical Specialist)
- **Concise Winning Answer:** "Because our joint uses a passive chrome steel sphere with open spherical cups rather than enclosed planetary gears, it does not suffer from internal gear teeth jamming. Fine dust is displaced by the 14.2N magnetic clamping force, and the open socket allows debris to be flushed out easily."
- **Deep Technical Support:** "In Phase 2, we are adding an ultra-thin flexible silicone dust boot covering the collar equator, providing IP64 dust ingress protection without restricting $\pm38^\circ$ articulation."

### Q59: TRAP QUESTION: "If the magnets attract steel, won't your robot stick to metal pipes and get trapped?"
- **Assigned Presenter:** Member 2 or Member 5
- **Concise Winning Answer:** "Magnetic attraction to ferrous pipes is actually an operational asset, not a failure! It provides normal clamping force that allows our inchworm crawler to climb vertically up the interior walls of iron and steel pipes without falling."
- **Deep Technical Support:** "The 1.2N servo stall thrust is calibrated to peel the trailing magnetic pad from the surface sequentially using a rolling lever motion, rather than pulling against the full 14.2N axial clamp simultaneously."

### Q60: TRAP QUESTION: "What if one team member did all the work and the rest just memorized slides?"
- **Assigned Presenter:** Member 1 (Supported by All Members)
- **Concise Winning Answer:** "Our project was developed through rigorous division of engineering disciplines: Member 1 led problem formulation and literature benchmarking; Member 2 executed the 3D CAD modeling, collar invention, and Euler buckling analysis; Member 3 developed the circuit schematic, power isolation, and C++ firmware; Member 4 handled the ESP-NOW mesh networking and BOM optimization; and Member 5 spearheaded the operational deployment analysis and future roadmap."
- **Deep Technical Support:** "Each member is prepared to step up to the whiteboard right now and write down the formulas, circuit schematics, or code algorithms for their respective subsystem."

---
*End of Faculty Viva Defense Question Bank. All 5 team members should review and cross-examine each other using these 60 questions prior to presentation day.*
