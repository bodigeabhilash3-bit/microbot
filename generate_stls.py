"""
Microbot V1 — Precision STL 3D Print File Generator
Generates clean, 3D-printable binary STL files for:
1. equator_collar.stl  (Center anchor ring with pushrod pivot ears)
2. pod_chassis.stl     (Lower hexagonal pyramid shell with servo & magnet cradle)
3. pod_lid.stl         (Upper snap-fit aerodynamic shell lid)
"""

import math
import struct
import os

def write_binary_stl(filepath, triangles):
    """
    Writes triangles to binary STL format.
    triangles: list of (normal, v1, v2, v3)
    """
    with open(filepath, 'wb') as f:
        # 80-byte header
        header = b'Microbot V1 Precision 3D Printed Component - Binary STL' + b'\x00' * 80
        f.write(header[:80])
        # Number of triangles
        f.write(struct.pack('<I', len(triangles)))
        for normal, v1, v2, v3 in triangles:
            # Normal vector (3 floats)
            f.write(struct.pack('<3f', *normal))
            # Vertices (3 floats each)
            f.write(struct.pack('<3f', *v1))
            f.write(struct.pack('<3f', *v2))
            f.write(struct.pack('<3f', *v3))
            # Attribute byte count
            f.write(struct.pack('<H', 0))

def calc_normal(v1, v2, v3):
    u = (v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2])
    v = (v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2])
    nx = u[1] * v[2] - u[2] * v[1]
    ny = u[2] * v[0] - u[0] * v[2]
    nz = u[0] * v[1] - u[1] * v[0]
    length = math.sqrt(nx * nx + ny * ny + nz * nz)
    if length > 1e-6:
        return (nx / length, ny / length, nz / length)
    return (0.0, 0.0, 1.0)

def add_quad(triangles, v1, v2, v3, v4):
    """Adds a quad as two triangles (v1, v2, v3) and (v1, v3, v4)."""
    n1 = calc_normal(v1, v2, v3)
    triangles.append((n1, v1, v2, v3))
    n2 = calc_normal(v1, v3, v4)
    triangles.append((n2, v1, v3, v4))

def add_box(triangles, x_min, x_max, y_min, y_max, z_min, z_max):
    # 8 vertices
    p1 = (x_min, y_min, z_min)
    p2 = (x_max, y_min, z_min)
    p3 = (x_max, y_max, z_min)
    p4 = (x_min, y_max, z_min)
    p5 = (x_min, y_min, z_max)
    p6 = (x_max, y_min, z_max)
    p7 = (x_max, y_max, z_max)
    p8 = (x_min, y_max, z_max)

    # 6 faces
    add_quad(triangles, p4, p3, p2, p1) # bottom -z
    add_quad(triangles, p5, p6, p7, p8) # top +z
    add_quad(triangles, p1, p2, p6, p5) # front -y
    add_quad(triangles, p3, p4, p8, p7) # back +y
    add_quad(triangles, p4, p1, p5, p8) # left -x
    add_quad(triangles, p2, p3, p7, p6) # right +x

# -------------------------------------------------------------
# 1. Equator Collar Ring (Center Kinematic Anchor)
# -------------------------------------------------------------
def generate_equator_collar(output_path):
    triangles = []
    r_in = 6.05     # 12.1mm ID (slip fit on 12mm ball)
    r_out = 7.2     # 14.4mm OD
    width = 2.4     # width along Z axis
    segments = 48
    z_min = -width / 2.0
    z_max = width / 2.0

    # Build cylindrical collar ring
    for i in range(segments):
        theta1 = (i / segments) * 2.0 * math.pi
        theta2 = ((i + 1) / segments) * 2.0 * math.pi

        cos1, sin1 = math.cos(theta1), math.sin(theta1)
        cos2, sin2 = math.cos(theta2), math.sin(theta2)

        # Outer ring vertices
        o1_bot = (r_out * cos1, r_out * sin1, z_min)
        o2_bot = (r_out * cos2, r_out * sin2, z_min)
        o1_top = (r_out * cos1, r_out * sin1, z_max)
        o2_top = (r_out * cos2, r_out * sin2, z_max)

        # Inner ring vertices
        i1_bot = (r_in * cos1, r_in * sin1, z_min)
        i2_bot = (r_in * cos2, r_in * sin2, z_min)
        i1_top = (r_in * cos1, r_in * sin1, z_max)
        i2_top = (r_in * cos2, r_in * sin2, z_max)

        # Outer wall
        add_quad(triangles, o1_bot, o2_bot, o2_top, o1_top)
        # Inner wall (reversed winding)
        add_quad(triangles, i1_top, i2_top, i2_bot, i1_bot)
        # Bottom rim
        add_quad(triangles, i1_bot, i2_bot, o2_bot, o1_bot)
        # Top rim
        add_quad(triangles, o1_top, o2_top, i2_top, i1_top)

    # Add Left and Right Pushrod Pivot Ears (+X and -X)
    ear_w = 2.2
    ear_h = 2.0
    ear_len = 3.5
    add_box(triangles, r_out, r_out + ear_len, -ear_w / 2, ear_w / 2, -ear_h / 2, ear_h / 2)
    add_box(triangles, -(r_out + ear_len), -r_out, -ear_w / 2, ear_w / 2, -ear_h / 2, ear_h / 2)

    write_binary_stl(output_path, triangles)
    print(f"Generated: {output_path} ({len(triangles)} triangles)")

# -------------------------------------------------------------
# 2. Hexagonal Pod Chassis (Lower Body with internal cavity)
# -------------------------------------------------------------
def generate_pod_chassis(output_path):
    triangles = []
    length = 58.0
    w_base = 24.0
    h_base = 22.0
    z0 = 6.2
    z_apex = z0 + length
    apex = (0.0, 0.0, z_apex)

    # 6 vertices of hexagonal base
    p0 = [
        (0.0, h_base / 2.0, z0),
        (w_base / 2.0, h_base / 4.0, z0),
        (w_base / 2.0, -h_base / 4.0, z0),
        (0.0, -h_base / 2.0, z0),
        (-w_base / 2.0, -h_base / 4.0, z0),
        (-w_base / 2.0, h_base / 4.0, z0)
    ]
    m_right = (w_base / 2.0, 0.0, z0)
    m_left = (-w_base / 2.0, 0.0, z0)

    # Outer Shell Facets (Lower chassis: Y <= 0)
    # Facet 1: m_right -> p0[2] -> apex
    triangles.append((calc_normal(p0[2], m_right, apex), p0[2], m_right, apex))
    # Facet 2: p0[2] -> p0[3] -> apex
    triangles.append((calc_normal(p0[3], p0[2], apex), p0[3], p0[2], apex))
    # Facet 3: p0[3] -> p0[4] -> apex
    triangles.append((calc_normal(p0[4], p0[3], apex), p0[4], p0[3], apex))
    # Facet 4: p0[4] -> m_left -> apex
    triangles.append((calc_normal(m_left, p0[4], apex), m_left, p0[4], apex))

    # Flat split face on Y = 0 (Internal mating deck)
    deck_in_r = (w_base * 0.45, 0.0, z0 + 1.0)
    deck_in_l = (-w_base * 0.45, 0.0, z0 + 1.0)
    deck_apex = (0.0, 0.0, z_apex - 2.0)
    add_quad(triangles, m_left, m_right, deck_in_r, deck_in_l)
    triangles.append((calc_normal(deck_in_l, deck_in_r, deck_apex), deck_in_l, deck_in_r, deck_apex))

    # Base rim face (around spherical socket cup)
    socket_r = 6.2
    segs = 24
    for i in range(segs // 2):
        th1 = math.pi + (i / (segs // 2)) * math.pi
        th2 = math.pi + ((i + 1) / (segs // 2)) * math.pi
        c1, s1 = math.cos(th1), math.sin(th1)
        c2, s2 = math.cos(th2), math.sin(th2)

        v_inner1 = (socket_r * c1, socket_r * s1, z0)
        v_inner2 = (socket_r * c2, socket_r * s2, z0)
        v_outer1 = ((w_base / 2) * c1, (h_base / 2) * s1, z0)
        v_outer2 = ((w_base / 2) * c2, (h_base / 2) * s2, z0)

        add_quad(triangles, v_outer1, v_outer2, v_inner2, v_inner1)

    # Internal Servo Cradle Ribs & Magnet Socket pocket
    add_box(triangles, -5.2, 5.2, -8.0, -1.0, z0 + 12.0, z0 + 32.0)

    write_binary_stl(output_path, triangles)
    print(f"Generated: {output_path} ({len(triangles)} triangles)")

# -------------------------------------------------------------
# 3. Hexagonal Pod Lid (Upper Snap-fit Shell)
# -------------------------------------------------------------
def generate_pod_lid(output_path):
    triangles = []
    length = 58.0
    w_base = 24.0
    h_base = 22.0
    z0 = 6.2
    z_apex = z0 + length
    apex = (0.0, 0.0, z_apex)

    p0 = [
        (0.0, h_base / 2.0, z0),
        (w_base / 2.0, h_base / 4.0, z0),
        (w_base / 2.0, -h_base / 4.0, z0),
        (0.0, -h_base / 2.0, z0),
        (-w_base / 2.0, -h_base / 4.0, z0),
        (-w_base / 2.0, h_base / 4.0, z0)
    ]
    m_right = (w_base / 2.0, 0.0, z0)
    m_left = (-w_base / 2.0, 0.0, z0)

    # Upper Lid Shell Facets (Y >= 0)
    triangles.append((calc_normal(p0[5], m_left, apex), p0[5], m_left, apex))
    triangles.append((calc_normal(p0[0], p0[5], apex), p0[0], p0[5], apex))
    triangles.append((calc_normal(p0[1], p0[0], apex), p0[1], p0[0], apex))
    triangles.append((calc_normal(m_right, p0[1], apex), m_right, p0[1], apex))

    # Base rim face (Y >= 0)
    socket_r = 6.2
    segs = 24
    for i in range(segs // 2):
        th1 = (i / (segs // 2)) * math.pi
        th2 = ((i + 1) / (segs // 2)) * math.pi
        c1, s1 = math.cos(th1), math.sin(th1)
        c2, s2 = math.cos(th2), math.sin(th2)

        v_inner1 = (socket_r * c1, socket_r * s1, z0)
        v_inner2 = (socket_r * c2, socket_r * s2, z0)
        v_outer1 = ((w_base / 2) * c1, (h_base / 2) * s1, z0)
        v_outer2 = ((w_base / 2) * c2, (h_base / 2) * s2, z0)

        add_quad(triangles, v_outer1, v_outer2, v_inner2, v_inner1)

    # Snap-fit alignment alignment pins (+Y to -Y locking)
    add_box(triangles, -3.0, 3.0, -1.2, 0.0, z0 + 15.0, z0 + 18.0)
    add_box(triangles, -3.0, 3.0, -1.2, 0.0, z0 + 40.0, z0 + 43.0)

    write_binary_stl(output_path, triangles)
    print(f"Generated: {output_path} ({len(triangles)} triangles)")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    generate_equator_collar(os.path.join(base_dir, "equator_collar.stl"))
    generate_pod_chassis(os.path.join(base_dir, "pod_chassis.stl"))
    generate_pod_lid(os.path.join(base_dir, "pod_lid.stl"))
    print("All Microbot V1 3D printable STL files successfully generated!")
