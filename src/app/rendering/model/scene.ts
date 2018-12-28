import { Floor } from './floor';
import { Image } from './image';
import { Ray } from './ray';
import { vec3 } from 'gl-matrix';
import { Box } from './box';

export class Scene {
    floor: Floor;
    box: Box;
    images: Image[] = [];

    constructor(gl: WebGLRenderingContext) {
      this.floor = new Floor(gl);
      this.box = new Box(gl);
    }

    intersect(ray: Ray) {
      let nearestImage: Image;
      let minDist = Infinity;
      for (const image of this.images) {
        const point = ray.intersect(image.position, image.normal);
        if (point) {
          if (image.contains(point)) {
            const dist = vec3.dist(ray.start, point);
            if (dist < minDist) {
              nearestImage = image;
              minDist = dist;
            }
          }
        }
      }
      return nearestImage;
    }
}
