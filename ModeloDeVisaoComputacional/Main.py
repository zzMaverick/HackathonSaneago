import bpy
import json

def get_2d_bbox(obj, scene, cam):
    # pega bounding box do objeto em coordenadas da câmera
    coords = [cam.matrix_world @ v for v in obj.bound_box]

    render = scene.render
    frame = []

    for v in coords:
        co = bpy_extras.object_utils.world_to_camera_view(scene, cam, v)
        frame.append((co.x, co.y))

    xs = [p[0] for p in frame]
    ys = [p[1] for p in frame]

    return {
        "xmin": min(xs),
        "xmax": max(xs),
        "ymin": min(ys),
        "ymax": max(ys)
    }
