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

### Step 2: Install Magnets in the Pods
* Place one 10×3mm ring magnet into the circular pocket behind the front socket cup of each pod.
* A tiny drop of superglue (Cyanoacrylate) secures the magnet.
* Test by snapping the pod onto your 12mm steel ball: it should hold tightly while gliding smoothly in all directions.

### Step 3: Install the Center Collar
* Slide the printed collar ring over the 12mm ball so it sits right between the two pods.
* The collar should spin freely on the ball equator.

### Step 4: Mount the Servos & Pushrods
* Press-fit each 3.7g micro servo into its internal slot inside the pod.
* Cut two 26mm lengths of 1.0mm piano wire.
* Bend each end into a small "Z-bend" using pliers.
* Hook one end into the servo horn arm, and the other end into the pivot ear on the collar ring.
* Now, when the servo turns, it pushes against the collar, forcing the entire pod to pitch up and down!

### Step 5: Wire the Electronics
* Connect Servo 1 Signal to **Pin D1** (or GPIO 1).
* Connect Servo 2 Signal to **Pin D2** (or GPIO 2).
* Connect both Servo Red wires to Battery **+ (3.7V - 5V)**.
* Connect both Servo Brown/Black wires to Battery **GND**.

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

