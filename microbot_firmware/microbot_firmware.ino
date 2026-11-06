/**
 * Microbot V1 — Autonomous Crawling Firmware
 * Compatible with Arduino Uno / Nano / ESP32-C3 / RP2040
 *
 * Kinematics:
 * - Pod 1: Drives Left / Upper Arm around central spherical joint
 * - Pod 2: Drives Right / Lower Arm around central spherical joint
 * - Anti-Phase Gait: Alternates pod pitch against ground to walk forward
 * - In-Phase Gait: Synchronous pitch to hop / inchworm climb
 */

#if defined(ESP32)
  #include <ESP32Servo.h>
#else
  #include <Servo.h>
#endif

// --- Pin Configuration ---
#if defined(ESP8266)
  const int SERVO1_PIN = D1;  // GPIO 5 (NodeMCU D1)
  const int SERVO2_PIN = D2;  // GPIO 4 (NodeMCU D2)
#elif defined(ESP32)
  const int SERVO1_PIN = 1;   // GPIO 1 (D1)
  const int SERVO2_PIN = 2;   // GPIO 2 (D2)
#else
  const int SERVO1_PIN = 9;   // Arduino D9
  const int SERVO2_PIN = 10;  // Arduino D10
#endif

Servo servoPod1;
Servo servoPod2;

// --- Kinematic Gait Constants ---
const float NEUTRAL_ANGLE = 90.0;    // Center reference (degrees)
const float MAX_AMPLITUDE = 35.0;    // Pitch amplitude (±35° swing)
float currentAmplitude = 32.0;       // Default crawl stroke
float gaitFrequency = 1.6;           // Speed in Hz (cycles per second)

// State machine
enum GaitMode { STOPPED, ANTI_PHASE_CRAWL, IN_PHASE_CLIMB, TURN_LEFT, TURN_RIGHT };
GaitMode currentGait = ANTI_PHASE_CRAWL;

unsigned long previousMillis = 0;
float phaseTime = 0.0;
float currentPos1 = NEUTRAL_ANGLE;
float currentPos2 = NEUTRAL_ANGLE;
const float SLEW_RATE_LIMIT = 4.5f; // Max degree change per 15ms loop (eliminates brownout spikes)

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println(F("========================================"));
  Serial.println(F("      MICROBOT V1 AUTONOMOUS FIRMWARE   "));
  Serial.println(F("========================================"));
  Serial.println(F("Commands via Serial Monitor (115200 baud):"));
  Serial.println(F("  'c' -> Start Anti-Phase Crawl (Walking)"));
  Serial.println(F("  'i' -> Start In-Phase Inchworm (Climbing)"));
  Serial.println(F("  'l' -> Steer Left"));
  Serial.println(F("  'r' -> Steer Right"));
  Serial.println(F("  's' -> Stop / Neutral Pose"));
  Serial.println(F("  '+' -> Speed Up (+0.2 Hz)"));
  Serial.println(F("  '-' -> Slow Down (-0.2 Hz)"));
  Serial.println(F("========================================"));

  // Attach servos
  #if defined(ESP32)
    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    servoPod1.setPeriodHertz(50);
    servoPod2.setPeriodHertz(50);
  #endif

  servoPod1.attach(SERVO1_PIN, 500, 2500);
  servoPod2.attach(SERVO2_PIN, 500, 2500);

  // Home to neutral
  servoPod1.write(NEUTRAL_ANGLE);
  servoPod2.write(NEUTRAL_ANGLE);
  delay(600);

  Serial.println(F(">> Servos initialized at 90° Neutral. Starting Crawl!"));
}

void loop() {
  handleSerialCommands();
  updateGaitMotion();
}

void handleSerialCommands() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    switch (cmd) {
      case 'c':
      case 'C':
        currentGait = ANTI_PHASE_CRAWL;
        Serial.println(F(">> Gait: ANTI-PHASE CRAWL (Walking)"));
        break;

      case 'i':
      case 'I':
        currentGait = IN_PHASE_CLIMB;
        Serial.println(F(">> Gait: IN-PHASE INCHWORM (Climbing)"));
        break;

      case 'l':
      case 'L':
        currentGait = TURN_LEFT;
        Serial.println(F(">> Gait: STEERING LEFT"));
        break;

      case 'r':
      case 'R':
        currentGait = TURN_RIGHT;
        Serial.println(F(">> Gait: STEERING RIGHT"));
        break;

      case 's':
      case 'S':
        currentGait = STOPPED;
        servoPod1.write(NEUTRAL_ANGLE);
        servoPod2.write(NEUTRAL_ANGLE);
        Serial.println(F(">> Gait: STOPPED (Holding Neutral)"));
        break;

      case '+':
        gaitFrequency = min(gaitFrequency + 0.2f, 3.5f);
        Serial.print(F(">> Frequency: "));
        Serial.print(gaitFrequency);
        Serial.println(F(" Hz"));
        break;

      case '-':
        gaitFrequency = max(gaitFrequency - 0.2f, 0.5f);
        Serial.print(F(">> Frequency: "));
        Serial.print(gaitFrequency);
        Serial.println(F(" Hz"));
        break;
    }
  }
}

void updateGaitMotion() {
  if (currentGait == STOPPED) return;

  unsigned long currentMillis = millis();
  float deltaTime = (currentMillis - previousMillis) / 1000.0f;
  previousMillis = currentMillis;

  phaseTime += deltaTime * gaitFrequency * 2.0f * PI;
  if (phaseTime > 2.0f * PI) {
    phaseTime -= 2.0f * PI;
  }

  float wave = sin(phaseTime);

  float angle1 = NEUTRAL_ANGLE;
  float angle2 = NEUTRAL_ANGLE;

  switch (currentGait) {
    case ANTI_PHASE_CRAWL:
      // Pod 1 pushes down while Pod 2 lifts up (180° phase offset)
      angle1 = NEUTRAL_ANGLE + wave * currentAmplitude;
      angle2 = NEUTRAL_ANGLE - wave * currentAmplitude;
      break;

    case IN_PHASE_CLIMB:
      // Both pods push synchronously
      angle1 = NEUTRAL_ANGLE + wave * currentAmplitude;
      angle2 = NEUTRAL_ANGLE + wave * currentAmplitude;
      break;

    case TURN_LEFT:
      // Pod 1 does large stroke, Pod 2 does small stroke
      angle1 = NEUTRAL_ANGLE + wave * currentAmplitude;
      angle2 = NEUTRAL_ANGLE - wave * (currentAmplitude * 0.35f);
      break;

    case TURN_RIGHT:
      // Pod 2 does large stroke, Pod 1 does small stroke
      angle1 = NEUTRAL_ANGLE + wave * (currentAmplitude * 0.35f);
      angle2 = NEUTRAL_ANGLE - wave * currentAmplitude;
      break;

    default:
      break;
  }

  // Constrain to mechanical limits (±38° max)
  float target1 = constrain(angle1, NEUTRAL_ANGLE - MAX_AMPLITUDE, NEUTRAL_ANGLE + MAX_AMPLITUDE);
  float target2 = constrain(angle2, NEUTRAL_ANGLE - MAX_AMPLITUDE, NEUTRAL_ANGLE + MAX_AMPLITUDE);

  // Soft-start slew rate filter (prevents abrupt acceleration & battery voltage sag)
  currentPos1 += constrain(target1 - currentPos1, -SLEW_RATE_LIMIT, SLEW_RATE_LIMIT);
  currentPos2 += constrain(target2 - currentPos2, -SLEW_RATE_LIMIT, SLEW_RATE_LIMIT);

  servoPod1.write((int)round(currentPos1));
  servoPod2.write((int)round(currentPos2));

  // 15ms update period (~66Hz smooth loop)
  delay(15);
}
