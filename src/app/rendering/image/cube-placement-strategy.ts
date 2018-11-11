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
        const x = -1.5 + (localCounter % 2) * 3;
        const y = -1.5 + (Math.trunc(localCounter / 2) % 2) * 3;
        const z = -1.5 + Math.trunc(localCounter / 4) * 3;
        return vec3.fromValues(x, y, z);
    }
}
