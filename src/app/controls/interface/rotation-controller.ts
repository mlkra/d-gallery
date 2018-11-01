import { Deltas } from "./deltas";

export interface RotationController {
    rotationSpeed: number;
    rotationEnabled: boolean;
    rotation: Deltas;

    initRotation(): void;
}
