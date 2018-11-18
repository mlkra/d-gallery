import { PlacementStrategy } from "./placement-strategy";
import { vec3 } from "gl-matrix";

export class CubePlacementStrategy implements PlacementStrategy {
    private counter = 0;

    constructor(private imagesCount: number) { }

    getPosition() {
        if (this.counter >= this.imagesCount) {
            this.counter = 0;
        }
        const localCounter = this.counter;
        this.counter += 1;
        const x = -6.05 + (localCounter % 4) * 4.05;
        const y = -2 + (Math.trunc(localCounter / 4) % 2) * 4.05;
        const z = -2 + Math.trunc(localCounter / 8) * 6;
        return vec3.fromValues(x, y, z);
    }
}
