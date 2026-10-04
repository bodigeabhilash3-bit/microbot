# Cell 2025 Magnetic Swarm Lab — Physical Build Blueprint

A complete guide to physically building the rotating magnetic actuation rig and untethered microrobot swarm on your desk, based on the research paper (*Cell Press Device, 2025*).

---

## 1. Bill of Materials (BOM) & Shopping List

| Component | Specification | Quantity | Estimated Cost | Where to Source |
| :--- | :--- | :--- | :--- | :--- |
| **Drive Motor** | 12V DC Geared Motor (300–1000 RPM) or NEMA 17 Stepper | 1 | ₹350 – ₹550 | Robu.in / Amazon / Electronics store |
| **Speed Controller** | 12V PWM DC Motor Speed Controller Knob | 1 | ₹120 – ₹180 | Robu.in / Amazon |
| **Power Supply** | 12V 2A DC Wall Adapter | 1 | ₹200 – ₹250 | Local electronics market |
| **Permanent Magnets** | Neodymium N42/N52 Block Magnets (20 × 10 × 5 mm) | 2 | ₹300 – ₹400 | Amazon / Rare Earth Magnets India |
| **Petri Stage** | 90mm Transparent Glass / Acrylic Petri Dish | 1 | ₹80 – ₹120 | Lab supply / Amazon |
| **Stand & Rotor** | 3D Printed Motor Mount & 40mm Rotor Crossbar | 1 set | ₹100 (Filament) | Local 3D printer / Maker Lab |
| **Micro-Robots** | 2mm Neodymium Magnet Cubes (Pack of 216) | 1 pack | ₹350 – ₹500 | Amazon / Gift/Toy stores |

> **Total Estimated Build Cost:** ~₹1,500 – ₹2,200 ($18 – $26 USD)

---

## 2. System Architecture

```
        [ 📷 Webcam / Phone (OpenCV Tracking) ]
                         │
                         ▼
        ┌──────────────────────────────────┐
        │   PETRI DISH STAGE (Water + Soap)│
        │   • Magnetic Swarm (Chains/Rafts)│
        │   • Obstacle / Cargo / Circuit   │
        └────────────────┬─────────────────┘
                         │ 15 mm Air Gap
                         ▼
        ┌──────────────────────────────────┐
        │   ROTATING MAGNET ROTOR          │
        │   [ N Magnet ] ─── [ S Magnet ]  │
        │                 │                │
        │   [ 12V DC Geared Motor + PWM ]  │
        │   (0 to 900 RPM = 0 to 15 Hz)    │
        └──────────────────────────────────┘
```

---

## 3. Physical Fabrication Steps

### Step 1: The Motor & Rotor Crossbar
1. 3D print or laser-cut a 40mm rotor bar that press-fits onto your motor's 4mm or 5mm D-shaft.
2. Glue one Neodymium magnet on the left wing with **North Pole facing UP**.
3. Glue the second Neodymium magnet on the right wing with **South Pole facing UP**.
4. Secure with epoxy or cyanoacrylate (superglue) and wrap with electrical tape for safety during high-speed rotation.

### Step 2: The Stage Standoffs
1. Mount 4 threaded brass standoffs or 3D-printed pillars around the motor base.
2. The top plate should sit **15 mm to 25 mm above the magnets**.
3. Place the transparent petri dish on the top plate.
4. Fill the dish with 2mm to 5mm of tap water. Add **one drop of liquid dish soap** to reduce surface tension.

### Step 3: Preparing the Swarm Units
* **Beginner Method (Direct 2mm Neodymium Cubes):**
  * Drop 20 to 50 micro-cubes into the center of the dish.
* **Advanced Paper Method (Custom Anisotropic Cuboids):**
  * 3D print 2mm × 2mm × 4mm hollow cuboids.
  * Glue a 1mm cylinder magnet inside at:
    * **0° (Longitudinal):** Head-to-Tail (HT) chains.
    * **45° (Diagonal):** Slipped-Co-Facial (SC) rafts.
    * **90° (Transverse):** Face-to-Face (FF) rigid columns.

---

## 4. Operational Frequency Guide (From the Paper)

| Frequency | Motor RPM | What You Will Observe | Paper Task Benchmark |
| :--- | :--- | :--- | :--- |
| **1.5 Hz – 2.5 Hz** | 90 – 150 RPM | Slow rotating and pivoting; one end lifts off the glass. | Terrain walking, obstacle lifting. |
| **5.0 Hz** | 300 RPM | Agile walking at 64 mm/s; climbing 5x body height obstacles. | Obstacle climbing, water drug delivery. |
| **10.0 Hz** | 600 RPM | SC units lock into dense 2D rafts; high packing density. | Terrestrial cargo transport, LED circuit bridge. |
| **15.0 Hz** | 900 RPM | High centrifugal shear force ($F_c = m \cdot r \cdot \omega^2$). | Instantaneous self-throwing over 7mm walls at 1,080 BL/s! |

---

## 5. Bonus: Python AI Computer Vision Tracking (30 Lines)

Connect a standard USB webcam pointing down at your petri dish, and run this OpenCV script to track your physical swarm in real time:

```python
import cv2
import numpy as np

# Connect to USB webcam over the petri dish
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert to grayscale and threshold to detect dark microrobots
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV)

    # Find contours of the swarm
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find the largest swarm cluster
        largest = max(contours, key=cv2.contourArea)
        M = cv2.moments(largest)
        if M["m00"] > 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            
            # Draw tracking crosshair and swarm centroid
            cv2.circle(frame, (cx, cy), 8, (0, 243, 255), -1)
            cv2.putText(frame, f"Swarm Centroid: ({cx}, {cy})", (cx + 12, cy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 243, 255), 1)

    cv2.imshow("Cell 2025 Magnetic Swarm Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```
