import { Injectable } from '@angular/core';
import * as nipplejs from 'nipplejs';
import { Deltas } from '../interface/deltas';
import { MovementController } from '../interface/movement-controller';
import { RotationController } from '../interface/rotation-controller';

@Injectable({
  providedIn: 'root'
})
export class JoystickService implements MovementController, RotationController {
  movementSpeed = 0.0005;
  rotationSpeed = 0.001;
  movementEnabled: boolean;
  rotationEnabled: boolean;
  movement: Deltas;
  rotation: Deltas;
  
  private movementJoystick;
  private rotationJoystick;

  constructor() { }

  initMovement() {
    this.movementEnabled = true;
    this.movement = {
      dx: 0,
      dy: 0
    };
    const canvas = document.querySelector('app-canvas');
    const div = document.createElement('div');
    canvas.appendChild(div);
    const options = {
      zone: div,
      mode: 'static',
      position: {
        left: '15%',
        top: '80%'
      },
      color: 'blue'
    };
    this.movementJoystick = nipplejs.create(options);
    this.movementJoystick.on('move', (event, data) => {
      if (this.movementEnabled) {
          this.movement.dx = -data.distance * Math.cos(data.angle.radian);
          this.movement.dy = data.distance * Math.sin(data.angle.radian);
      }
    });
    this.movementJoystick.on('end', () => {
      if (this.movementEnabled) {
        this.movement = {
          dx: 0,
          dy: 0
        };
      }
    });
  }

  initRotation() {
    this.rotationEnabled = true;
    this.rotation = {
      dx: 0,
      dy: 0
    };
    const canvas = document.querySelector('app-canvas');
    const div = document.createElement('div');
    canvas.appendChild(div);
    const options = {
      zone: div,
      mode: 'static',
      position: {
        left: '85%',
        top: '80%'
      },
      color: 'green'
    };
    this.rotationJoystick = nipplejs.create(options);
    this.rotationJoystick.on('move', (event, data) => {
      if (this.rotationEnabled) {
          this.rotation.dx = data.distance * Math.cos(data.angle.radian);
          this.rotation.dy = data.distance * Math.sin(data.angle.radian);
      }
    });
    this.rotationJoystick.on('end', () => {
      if (this.rotationEnabled) {
        this.rotation = {
          dx: 0,
          dy: 0
        };
      }
    });
  }
}
