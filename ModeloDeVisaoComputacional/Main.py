import bpy
import random
import math
import os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

# =========================================================
# CONFIG
# =========================================================

OUTPUT_DIR = "C:/dataset_saneago"

TOTAL_IMAGES = 500

IMAGE_WIDTH = 640
IMAGE_HEIGHT = 640

# Classes YOLO
CLASSES = {
    "Caixa": 0,
    "Cano": 1,
    "Porta": 2
}

# =========================================================
# CREATE FOLDERS
# =========================================================

images_dir = os.path.join(OUTPUT_DIR, "images")
labels_dir = os.path.join(OUTPUT_DIR, "labels")

os.makedirs(images_dir, exist_ok=True)
os.makedirs(labels_dir, exist_ok=True)

# =========================================================
# SCENE CONFIG
# =========================================================

scene = bpy.context.scene
scene.render.image_settings.file_format = 'PNG'
scene.render.resolution_x = IMAGE_WIDTH
scene.render.resolution_y = IMAGE_HEIGHT

# =========================================================
# GET OBJECTS
# =========================================================

camera = bpy.data.objects["Camera"]
light = bpy.data.objects["Light"]

caixa = bpy.data.objects["Caixa"]
cano = bpy.data.objects["Cano"]
porta = bpy.data.objects["Porta"]

objects = [caixa, cano, porta]

# =========================================================
# FUNCTIONS
# =========================================================

def randomize_camera():
    camera.location.x = random.uniform(-0.3, 0.3)
    camera.location.y = random.uniform(-4.5, -3.5)
    camera.location.z = random.uniform(1.2, 2.0)

    camera.rotation_euler[0] = math.radians(random.uniform(80, 100))
    camera.rotation_euler[2] = math.radians(random.uniform(-5, 5))


def randomize_light():
    light.location.x = random.uniform(-3, 3)
    light.location.y = random.uniform(-3, 3)
    light.location.z = random.uniform(3, 6)

    light.data.energy = random.uniform(500, 3000)


def randomize_objects():

    # Cano torto (gera reprovação)
    cano.rotation_euler[0] = math.radians(random.uniform(-10, 10))

    # Porta aberta/fechada
    porta.rotation_euler[2] = math.radians(random.uniform(0, 120))

    # Pequenas variações
    caixa.scale.x = random.uniform(0.95, 1.05)
    caixa.scale.y = random.uniform(0.95, 1.05)
    caixa.scale.z = random.uniform(0.95, 1.05)


def get_bbox(obj, cam):

    scene = bpy.context.scene

    mat = obj.matrix_world
    verts = [mat @ Vector(v[:]) for v in obj.bound_box]

    coords_2d = [world_to_camera_view(scene, cam, v) for v in verts]

    xs = [v.x for v in coords_2d]
    ys = [v.y for v in coords_2d]

    min_x = max(min(xs), 0)
    max_x = min(max(xs), 1)

    min_y = max(min(ys), 0)
    max_y = min(max(ys), 1)

    bbox_width = max_x - min_x
    bbox_height = max_y - min_y

    center_x = min_x + bbox_width / 2
    center_y = min_y + bbox_height / 2

    center_y = 1 - center_y

    return (
        center_x,
        center_y,
        bbox_width,
        bbox_height
    )


def export_yolo_label(filepath):

    lines = []

    for obj in objects:

        bbox = get_bbox(obj, camera)

        class_id = CLASSES[obj.name]

        line = f"{class_id} {bbox[0]} {bbox[1]} {bbox[2]} {bbox[3]}"
        lines.append(line)

    with open(filepath, "w") as f:
        f.write("\n".join(lines))


# =========================================================
# GENERATE DATASET
# =========================================================

for i in range(TOTAL_IMAGES):

    randomize_camera()
    randomize_light()
    randomize_objects()

    image_name = f"img_{i:05d}.png"
    label_name = f"img_{i:05d}.txt"

    image_path = os.path.join(images_dir, image_name)
    label_path = os.path.join(labels_dir, label_name)

    scene.render.filepath = image_path

    bpy.ops.render.render(write_still=True)

    export_yolo_label(label_path)

    print(f"[OK] Generated {image_name}")

print("===================================")
print("DATASET GENERATED SUCCESSFULLY")
print("===================================")