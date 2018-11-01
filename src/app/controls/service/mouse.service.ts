import { Injectable } from '@angular/core';
import * as pointer from 'pointer-lock';
import { Deltas } from '../interface/deltas';
import { RotationController } from '../interface/rotation-controller';

@Injectable({
  providedIn: 'root'
})
export class MouseService implements RotationController {
  rotationSpeed = 0.005;
  rotationEnabled: boolean;
  get rotation(): Deltas {
    const rot = this._rotation;
    this._rotation = {
      dx: 0,
      dy: 0
    };
    return rot;
  }
  set rotation(rotation: Deltas) {
    this._rotation = rotation;
  }
  
  private canvas: HTMLCanvasElement;
  private pointer;
  private _rotation: Deltas;

  constructor() { }

  initRotation() {
    this.rotationEnabled = true;
    this.rotation = {
      dx: 0,
      dy: 0
    };
    this.canvas = document.querySelector('#app-canvas');
    if (!pointer.available()) {
      // TODO switch if not available
      //      move to ControlsService
      console.log('Pointer not available. Fallback to keyboard!');
    }
    this.pointer = pointer(this.canvas);
    this.pointer.on('attain', (movements) => {
      movements.on('data', (move) => {
        if (this.rotationEnabled) {
          console.log(move);
          this.rotation = {
            dx: move.dx,
            dy: -move.dy
          };
        }
      });
    });
  }

  init() {
    this.rotationEnabled = true;
    this.rotation = {
      dx: 0,
      dy: 0
    };
    this.canvas = document.querySelector('#app-canvas');
    if (!pointer.available()) {
      // TODO switch if not available
      //      move to ControlsService
      console.log('Pointer not available. Fallback to keyboard!');
    }
    this.pointer = pointer(this.canvas);
    this.pointer.on('attain', (movements) => {
      movements.on('data', (move) => {
        if (this.rotationEnabled) {
          console.log(move);
          this.rotation = {
            dx: move.dx,
            dy: -move.dy
          };
        }
      });
    });
  }
}
