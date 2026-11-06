/**
 * ============================================================================
 * MICROBOT MULTI-UNIT SWARM FIRMWARE — ESP-NOW DECENTRALIZED PROTOCOL
 * ============================================================================
 * Target Microcontroller: ESP32 / ESP32-C3 SuperMini / ESP32-S3
 * Communication: Peer-to-Peer ESP-NOW 2.4 GHz (<1ms Latency, No Router Needed)
 * Actuation: Dual Sub-Micro Servos (3.7g / SG90) driving Spherical Joint
 *
 * Inspired by Big Hero 6 Microbots:
 * - Master Node: Transmits collective heading, formation ID, and sync clock
 * - Slave Nodes: Calculate individual phase delays and execute synchronized
 *   traveling wave crawling (Chain) or rigid isometric locking (Bridge/Pillar).
 * ============================================================================
 */

#include <esp_now.h>
#include <WiFi.h>
#include <ESP32Servo.h>

// ============================================================================
// 1. CONFIGURATION & IDENTITY
// ============================================================================

// Set this unit's role:
// - MASTER: Acts as the Neural Transmitter / Central Controller
// - SLAVE:  Acts as an individual Microbot unit in the swarm array
#define NODE_ROLE_SLAVE    // Uncomment this for Microbot units
//#define NODE_ROLE_MASTER // Uncomment this for the Headband / USB Bridge node

// Unique Microbot Index in the swarm array (0 to 139)
// Used to compute spatial position in multi-unit traveling waves:
// Phase_i = Phase_Master - (NODE_INDEX * 32.5°)
const uint8_t NODE_INDEX = 1; // Change for each physical bot (1, 2, 3...)

// Servo Pin Assignments (ESP32-C3 SuperMini Pinout)
// GPIO 1 (D1) -> Servo 1 (Upper Pod Pitch Linkage)
// GPIO 2 (D2) -> Servo 2 (Lower Pod Pitch Linkage)
const int SERVO1_PIN = 1;
const int SERVO2_PIN = 2;

// Kinematic Constants
const float NEUTRAL_ANGLE = 90.0f; // 90° center alignment
const float MAX_AMPLITUDE = 35.0f; // ±35° articulation clearance limit
const float TRAVELING_WAVE_OFFSET = 32.5f * (PI / 180.0f); // 32.5° phase shift per unit

// ============================================================================
// 2. SWARM COMMUNICATION PACKET SCHEMA
// ============================================================================

enum SwarmFormation : uint8_t {
  FORM_STOP = 0,
  FORM_HAND = 1,
  FORM_CHAIN_CRAWL = 2,
  FORM_BRIDGE_ARCH = 3,
  FORM_DYNAMIC_WAVE = 4,
  FORM_SUPPORT_PILLAR = 5,
  FORM_WALL_RAMP = 6,
  FORM_CHASM_SPAN = 7,
  FORM_CARGO_CRADLE = 8
};

typedef struct __attribute__((packed)) {
  uint8_t packetId;             // Incrementing sequence counter
  uint8_t formation;            // SwarmFormation enum
  float frequency;              // Oscillation frequency (Hz, typically 0.8 - 2.5)
  float globalPhase;            // Master sync clock (0 to 2*PI radians)
  int8_t amplitude;             // Stroke amplitude in degrees (10 to 35)
  int8_t steerBias;             // Left/Right differential steering (-35 to +35)
} SwarmPacket;

SwarmPacket incomingPacket;
SwarmPacket outgoingPacket;

// Broadcast Address: FF:FF:FF:FF:FF:FF transmits to ALL listening Microbots
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

// Hardware Servos
Servo servoPod1;
Servo servoPod2;

// Local runtime variables
unsigned long lastPacketReceived = 0;
unsigned long lastMasterSend = 0;
float localPhase = 0.0f;

// ============================================================================
// 3. ESP-NOW CALLBACK FUNCTIONS
// ============================================================================

#if defined(NODE_ROLE_SLAVE)
void OnDataRecv(const esp_now_recv_info *info, const uint8_t *incomingData, int len) {
  if (len == sizeof(SwarmPacket)) {
    memcpy(&incomingPacket, incomingData, sizeof(SwarmPacket));
    lastPacketReceived = millis();
  }
}
#endif

#if defined(NODE_ROLE_MASTER)
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  // Master send acknowledgement callback
}
#endif

// ============================================================================
// 4. SETUP
// ============================================================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println(F("\n========================================================"));
  Serial.println(F("   MICROBOT SWARM FIRMWARE — ESP-NOW DECENTRALIZED MESH  "));
  Serial.println(F("========================================================"));

  // Initialize Wi-Fi in Station Mode (required for ESP-NOW)
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  Serial.print(F("Device MAC Address: "));
  Serial.println(WiFi.macAddress());

  #if defined(NODE_ROLE_SLAVE)
    Serial.print(F("Role: SLAVE UNIT (Node Index #"));
    Serial.print(NODE_INDEX);
    Serial.println(F(")"));
  #else
    Serial.println(F("Role: MASTER TRANSMITTER (Swarm Controller)"));
  #endif

  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println(F("Error: ESP-NOW Initialization Failed!"));
    while (1) { delay(500); }
  }

  #if defined(NODE_ROLE_SLAVE)
    // Register Receive Callback
    esp_now_register_recv_cb(OnDataRecv);
    Serial.println(F("ESP-NOW Receiver Registered. Awaiting Master Swarm Packets..."));

    // Configure Servos using ESP32PWM timer allocation
    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    servoPod1.setPeriodHertz(50); // 50 Hz PWM standard for micro servos
    servoPod2.setPeriodHertz(50);

    servoPod1.attach(SERVO1_PIN, 500, 2500);
    servoPod2.attach(SERVO2_PIN, 500, 2500);

    // Initial Neutral Home
    servoPod1.write(NEUTRAL_ANGLE);
    servoPod2.write(NEUTRAL_ANGLE);
    delay(400);
  #endif

  #if defined(NODE_ROLE_MASTER)
    esp_now_register_send_cb(OnDataSent);

    // Register broadcast peer
    esp_now_peer_info_t peerInfo = {};
    memcpy(peerInfo.peer_addr, broadcastAddress, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;

    if (esp_now_add_peer(&peerInfo) != ESP_OK) {
      Serial.println(F("Error: Failed to register broadcast peer!"));
      while (1) { delay(500); }
    }
    Serial.println(F("ESP-NOW Master Ready. Broadcasting on 2.4 GHz channel..."));
  #endif

  Serial.println(F("System Ready.\n"));
}

// ============================================================================
// 5. MAIN LOOP
// ============================================================================

void loop() {
  #if defined(NODE_ROLE_SLAVE)
    executeSlaveSwarmKinematics();
  #endif

  #if defined(NODE_ROLE_MASTER)
    executeMasterTransmitter();
  #endif
}

// ============================================================================
// 6. SLAVE SWARM KINEMATICS ENGINE
// ============================================================================

#if defined(NODE_ROLE_SLAVE)
void executeSlaveSwarmKinematics() {
  // Watchdog: If no packet received for > 2 seconds, enter safe neutral hold
  if (millis() - lastPacketReceived > 2000) {
    servoPod1.write(NEUTRAL_ANGLE);
    servoPod2.write(NEUTRAL_ANGLE);
    delay(20);
    return;
  }

  float angle1 = NEUTRAL_ANGLE;
  float angle2 = NEUTRAL_ANGLE;
  float amp = (float)incomingPacket.amplitude;

  switch (incomingPacket.formation) {
    case FORM_STOP:
      angle1 = NEUTRAL_ANGLE;
      angle2 = NEUTRAL_ANGLE;
      break;

    case FORM_CHAIN_CRAWL: {
      // UNDULATORY TRAVELING WAVE (CENTIPEDE / SNAKE CRAWL)
      // Phase shifts sequentially down the chain of Microbots
      float myPhase = incomingPacket.globalPhase - (NODE_INDEX * TRAVELING_WAVE_OFFSET);
      float wave = sin(myPhase);
      float steer = (float)incomingPacket.steerBias;

      // Antiphase stroke with steering bias
      angle1 = NEUTRAL_ANGLE + wave * amp + steer;
      angle2 = NEUTRAL_ANGLE - wave * amp - steer;
      break;
    }

    case FORM_HAND: {
      // SYNCHRONIZED GRIPPING / CLENCHING
      // Joint flex depends on whether node is in palm or fingers
      float gripPhase = sin(incomingPacket.globalPhase);
      float flex = (gripPhase > 0) ? (gripPhase * amp) : 0;
      angle1 = NEUTRAL_ANGLE - flex;
      angle2 = NEUTRAL_ANGLE - flex * 0.8f;
      break;
    }

    case FORM_BRIDGE_ARCH:
    case FORM_SUPPORT_PILLAR:
    case FORM_CHASM_SPAN: {
      // STATIC RIGID LATTICE LOCKING
      // Pods lock at prescribed structural bracing angles to maximize magnetic latching
      float braceAngle = ((NODE_INDEX % 2 == 0) ? +22.0f : -22.0f);
      angle1 = NEUTRAL_ANGLE + braceAngle;
      angle2 = NEUTRAL_ANGLE - braceAngle;
      break;
    }

    case FORM_DYNAMIC_WAVE: {
      // 3D FLUID RIPPLE WAVE
      float ripple = sin(incomingPacket.globalPhase + (NODE_INDEX * 0.45f));
      angle1 = NEUTRAL_ANGLE + ripple * amp;
      angle2 = NEUTRAL_ANGLE + ripple * amp * 0.5f;
      break;
    }

    case FORM_WALL_RAMP: {
      // INCLINED STAIRCASE CONVEYOR
      float rampPitch = 28.0f; // Fixed climb slope
      float stepWave = sin(incomingPacket.globalPhase * 2.0f + NODE_INDEX * 0.5f) * 8.0f;
      angle1 = NEUTRAL_ANGLE + rampPitch + stepWave;
      angle2 = NEUTRAL_ANGLE - rampPitch - stepWave;
      break;
    }

    default:
      angle1 = NEUTRAL_ANGLE;
      angle2 = NEUTRAL_ANGLE;
      break;
  }

  // Enforce mechanical bounds (±35° from 90° center: 55° to 125°)
  angle1 = constrain(angle1, NEUTRAL_ANGLE - MAX_AMPLITUDE, NEUTRAL_ANGLE + MAX_AMPLITUDE);
  angle2 = constrain(angle2, NEUTRAL_ANGLE - MAX_AMPLITUDE, NEUTRAL_ANGLE + MAX_AMPLITUDE);

  servoPod1.write(angle1);
  servoPod2.write(angle2);

  delay(15); // ~60 Hz kinematic refresh rate
}
#endif

// ============================================================================
// 7. MASTER TRANSMITTER ENGINE
// ============================================================================

#if defined(NODE_ROLE_MASTER)
void executeMasterTransmitter() {
  // Update sync clock
  static unsigned long lastTime = 0;
  unsigned long now = millis();
  float dt = (now - lastTime) / 1000.0f;
  lastTime = now;

  float freq = 1.4f; // Default 1.4 Hz crawl pace
  localPhase += dt * freq * 2.0f * PI;
  if (localPhase > 2.0f * PI) localPhase -= 2.0f * PI;

  // Transmit 30 times per second (~33ms period)
  if (now - lastMasterSend >= 33) {
    lastMasterSend = now;

    outgoingPacket.packetId++;
    outgoingPacket.formation = FORM_CHAIN_CRAWL; // Default to chain crawl
    outgoingPacket.frequency = freq;
    outgoingPacket.globalPhase = localPhase;
    outgoingPacket.amplitude = 30; // ±30° stroke
    outgoingPacket.steerBias = 0;  // Straight heading

    // Broadcast to all listening swarm units
    esp_now_send(broadcastAddress, (uint8_t *)&outgoingPacket, sizeof(SwarmPacket));
  }

  // Handle Serial inputs from Ground Station / USB Bridge
  if (Serial.available() > 0) {
    char c = Serial.read();
    if (c == 'c' || c == 'C') outgoingPacket.formation = FORM_CHAIN_CRAWL;
    else if (c == 'h' || c == 'H') outgoingPacket.formation = FORM_HAND;
    else if (c == 'b' || c == 'B') outgoingPacket.formation = FORM_BRIDGE_ARCH;
    else if (c == 'w' || c == 'W') outgoingPacket.formation = FORM_DYNAMIC_WAVE;
    else if (c == 's' || c == 'S') outgoingPacket.formation = FORM_STOP;
  }
}
#endif
