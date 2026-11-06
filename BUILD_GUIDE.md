# Microbot V1 — Physical Build Blueprint

A complete, beginner-friendly guide to building a functional, moving Big Hero 6 style Microbot replica.

---

## 1. The Shopping List (Everything You Need)

| Part | Spec / Model | Quantity | Approx. Cost (INR) | Where to find | Why it's needed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Central Ball** | 12mm Chrome Steel Ball Bearing (G100) | 1 | ₹30 – ₹50 | Local bearing shop / Amazon / Robu.in | Serves as the smooth swivel joint |
| **Ring Magnets** | Neodymium N42 Ring Magnet (10mm OD × 3mm ID × 3mm Thick) | 2 | ₹60 – ₹90 each | Robu.in / Amazon / Rare earth magnet stores | Snaps each pod to the steel ball securely |
| **Actuators** | 3.7g Sub-Micro Servos (Model: GH-S37A or DSM44) | 2 | ₹130 – ₹180 each | Robu.in / Robocraze / Electronics stores | The "muscles" that swing the pods up & down |
| **Pushrod Wire** | 1.0 mm (0.040") Spring Steel Piano Wire | 1 piece (~15 cm) | ₹20 | RC hobby shop / Hardware store | Connects the servo arm to the center collar |
| **Brain / Board** | ESP32-C3 SuperMini or Arduino Nano | 1 | ₹200 – ₹300 | Robu.in / Amazon | Sends pulse signals to the servos |
| **Battery** | 3.7V 150mAh–300mAh 1S LiPo Battery | 1 | ₹150 – ₹200 | Drone/RC hobby stores | Powers the servos and board |
| **3D Filament** | PLA or PETG (Black or Dark Grey) | ~50 grams | ₹50 | 3D printer / Local maker lab | Body shells & collar |

> **Total Estimated Cost:** ~₹800 – ₹1,200 ($10 – $15 USD)

---

## 2. The 3D Printed Parts (Only 3 Unique Pieces)

You do **NOT** need to 3D print the ball (a polished steel ball bearing works 100x smoother than 3D printed plastic). You only 3D print:

1. **Pod 1 Shell (Hexagonal Pyramid):** Hollow body with servo cavity and spherical socket cup.
2. **Pod 2 Shell (Hexagonal Pyramid):** Identical to Pod 1.
3. **Equatorial Collar Ring:** A slender 2.4mm wide ring with 2 tiny pivot ears that slides around the center equator of the ball.

---

## 3. Step-by-Step Build Sequence

### Step 1: 3D Print the Parts
* Layer height: **0.12 mm** (critical for the spherical cup to be smooth).
* Infill: **15% – 20%**.
* Material: Standard **PLA** or **PETG** (Black).

### Step 2: Install Magnets & Snap-Fit Ball (55% Capture Lip)
* Place one 10×3mm ring magnet into the circular pocket behind the front socket cup of each pod. Secure with a tiny drop of superglue (Cyanoacrylate).
* **The 55% Capture Lip:** The front opening is engineered with an over-center snap rim ($r = 5.85\text{ mm}$, wrapping slightly past the 12.0mm ball equator). 
* Press the 12mm ball firmly into the socket: the PLA rim will flex slightly and snap over the ball. The magnet provides holding tension, while the plastic lip mechanically absorbs bending/prying forces so the pod cannot peel off!

### Step 3: Install & Lock the Center Collar (Pin / Glue Anchor)
* Slide the printed collar ring over the 12mm ball so it sits right between the two pods.
* **CRITICAL LOCKING STEP:** Do **NOT** let the collar free-spin! If it spins, pushrod forces just rotate the ring in mid-air.
* Place a tiny drop of medium CA superglue (or a micro pin) between the inner collar rim and the steel ball to lock the collar permanently to the sphere. This gives the pushrods an immovable mechanical reaction anchor!

### Step 4: Mount the Servos & Pushrods
* Press-fit each 3.7g micro servo into its internal slot inside the pod.
* Cut two 26mm lengths of 1.0mm piano wire.
* Bend each end into a small "Z-bend" using pliers.
* Hook one end into the servo horn arm, and the other end into the pivot ear on the locked collar ring.
* Now, when the servo turns, it reacts against the stationary collar, forcing the entire pod to pitch up and down with maximum leverage!

### Step 5: Install Directional Grippers (The "Toothbrush Bristle" Hack)
* Smooth 3D printed plastic tips slip on desks without moving forward (frictional symmetry).
* Cut a tiny $4\text{ mm} \times 4\text{ mm}$ square patch of bristles from a standard nylon toothbrush.
* Glue the patch to the flat blunt tip under each pod, **angled backward at $45^\circ$**.
* **Result:** When the pod drives downward, the bristles bite into the table surface and push the body forward. When lifted, they slide smoothly. The robot scuttles forward immediately!

### Step 6: Wire the Electronics (Tethered Bench Setup + Anti-Brownout Capacitor)
* **Keep the Brain on Your Desk:** Keep the ESP32-C3 / Arduino on your desk connected to your PC via USB. Run 4 thin, flexible jumper wires to the robot. The robot stays ultra-lightweight (~18g) and easy to calibrate.
* Connect Servo 1 Signal to **Pin D1** (or GPIO 1).
* Connect Servo 2 Signal to **Pin D2** (or GPIO 2).
* Connect both Servo Red wires to **5V / Battery +**.
* Connect both Servo Brown/Black wires to **GND**.
* **Anti-Brownout Capacitor ($0.10 Fix):** Solder a **$220\mu\text{F}$ to $470\mu\text{F}$ (6.3V–16V)** electrolytic capacitor directly between the servo $5\text{V}$ line and $\text{GND}$ near the board. This absorbs servo stall surges and completely prevents the microcontroller from resetting!

---

## 3.1 Alternative: The SG90 External Mount Hack (No 3D Printer / Big Servos)

If you only have standard 9g blue **SG90 / MG90S** servos and cannot 3D print larger pods right now, you do **not** need to wait! The kinematic principle works identically when servos are mounted externally:

* **Step A: Surface Prep:** Clean the flat top facet of your pod shell (or cardboard prototype pod) with rubbing alcohol.
* **Step B: Double-Sided Foam Tape:** Apply a 20×15mm strip of high-tack foam mounting tape to the flat outer facet.
* **Step C: Position SG90:** Press the SG90 servo body down firmly with its white output shaft facing forward (toward the center sphere).
* **Step D: Zip-Tie Reinforcement:** Loop one 2.5mm nylon zip-tie around the pod body and the servo body. Cinch it tight to prevent any prying flex.
* **Step E: Linkage Arm:** Fit the single-arm servo horn onto the servo spline. Bend a 1.0mm paperclip or steel wire into Z-bends connecting the horn hole directly to the locked center collar ear.
* **Advantage:** The SG90 provides ~1.6 kg·cm torque (3× more powerful than 3.7g servos), giving your robot stronger crawling thrust!

---

## 4. Crawling Gaits (How it walks)

### The Anti-Phase Crawl Gait:
* Pod 1 tilts down (pushing against the ground).
* Pod 2 tilts up (lifting its tip).
* The whole body shifts forward.
* Pod 1 lifts while Pod 2 plants down.
* **Result:** It scuttles forward across your desk just like an insect!

---

## 5. Ready-to-Use 3D Print & Firmware Files

All fabrication files have been generated directly into your project folder:

1. **[equator_collar.stl](file:///c:/Users/HP/Desktop/cse/microbot/equator_collar.stl)**: Center ring with pushrod anchor ears (Slip-fit on 12mm ball).
2. **[pod_chassis.stl](file:///c:/Users/HP/Desktop/cse/microbot/pod_chassis.stl)**: Lower hexagonal pyramid shell with servo and magnet sockets. Print **2 copies**.
3. **[pod_lid.stl](file:///c:/Users/HP/Desktop/cse/microbot/pod_lid.stl)**: Upper aerodynamic shell lid with snap-fit locking pins. Print **2 copies**.
4. **[microbot_firmware.ino](file:///c:/Users/HP/Desktop/cse/microbot/microbot_firmware.ino)**: Ready-to-flash Arduino / ESP32 sketch with Anti-Phase crawl, In-Phase climb, and steering gaits via Serial commands.
5. **[generate_stls.py](file:///c:/Users/HP/Desktop/cse/microbot/generate_stls.py)**: Python script to re-generate the STL models anytime.

