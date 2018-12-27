import { Deltas2 } from "./deltas";

export interface RotationController {
    rotationSpeed: number;
    rotationEnabled: boolean;
    rotation: Deltas2;

    initRotation(): void;
}
