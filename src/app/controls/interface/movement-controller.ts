import { Deltas3 } from "./deltas";

export interface MovementController {
    movementSpeed: number;
    movementEnabled: boolean;
    movement: Deltas3;

    initMovement(): void;
}
