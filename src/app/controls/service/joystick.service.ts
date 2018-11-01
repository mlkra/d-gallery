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
        if (data.direction) {
          switch (data.direction.angle) {
            case 'left':
              this.movement.dx = data.distance;
              break;
            case 'right':
              this.movement.dx = -data.distance;
              break;
            case 'up':
              this.movement.dy = data.distance;
              break;
            case 'down':
              this.movement.dy = -data.distance;
              break;
          }
        }
        console.log(event);
        console.log(data);
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
        if (data.direction) {
        switch (data.direction.angle) {
            case 'left':
              this.rotation.dx = -data.distance;
              break;
            case 'right':
              this.rotation.dx = data.distance;
              break;
            case 'up':
              this.rotation.dy = data.distance;
              break;
            case 'down':
              this.rotation.dy = -data.distance;
              break;
          }
        }
        console.log(event);
        console.log(data);
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
