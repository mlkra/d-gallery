import { Floor } from './floor';
import { Image } from './image';

export class Scene {
    floor: Floor;
    images: Image[] = [];

    constructor(gl: WebGLRenderingContext) {
        this.floor = new Floor(gl);
    }
}
