import { Injectable } from '@angular/core';
import { MovementController } from '../interface/movement-controller';
import { Deltas3 } from '../interface/deltas';

@Injectable({
  providedIn: 'root'
})
export class CameraButtonsService implements MovementController {
  movementSpeed: number;
  movementEnabled: boolean;
  movement: Deltas3;
  
  constructor() { }

  initMovement(): void {
    setTimeout(() => {
      this.movementEnabled = true;
    });
    this.movementSpeed = 0.08;
    this.movement = {
      dx: 0,
      dy: 0,
      dz: 0
    };
  }

  up() {
    this.movement.dz = 1;
  }

  down() {
    this.movement.dz = -1;
  }
}
