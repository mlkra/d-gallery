import { Deltas } from "./deltas";

export interface MovementController {
    movementSpeed: number;
    movementEnabled: boolean;
    movement: Deltas;

    initMovement(): void;
}
