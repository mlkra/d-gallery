import { Injectable } from '@angular/core';
import * as nipplejs from 'nipplejs';

@Injectable({
  providedIn: 'root'
})
export class JoystickService {
  private movementJoystick;
  private rotationJoystick;
  xMovement = 0;
  yMovement = 0;
  xRotation = 0;
  yRotation = 0;

  constructor() { }

  init() {
    const canvas = document.querySelector('app-canvas');
    const leftDiv = document.createElement('div');
    canvas.appendChild(leftDiv);
    const rightDiv = document.createElement('div');
    canvas.appendChild(rightDiv);
    const leftOptions = {
      zone: leftDiv,
      mode: 'static',
      position: {
        left: '15%',
        top: '85%'
      },
      color: 'blue'
    };
    const rightOptions = {
      zone: rightDiv,
      mode: 'static',
      position: {
        left: '85%',
        top: '85%'
      },
      color: 'green'
    };
    this.movementJoystick = nipplejs.create(leftOptions);
    this.rotationJoystick = nipplejs.create(rightOptions);

    this.movementJoystick.on('move', (event, data) => {
      if (data.direction) {
        switch (data.direction.angle) {
          case 'left':
            this.xMovement = data.distance;
            break;
          case 'right':
            this.xMovement = -data.distance;
            break;
          case 'up':
            this.yMovement = data.distance;
            break;
          case 'down':
            this.yMovement = -data.distance;
            break;
        }
      }
      console.log(event);
      console.log(data);
    });
    this.movementJoystick.on('end', () => {
      this.xMovement = 0;
      this.yMovement = 0;
    });

    this.rotationJoystick.on('move', (event, data) => {
      if (data.direction) {
        switch (data.direction.angle) {
          case 'left':
            this.xRotation = -data.distance;
            break;
          case 'right':
            this.xRotation = data.distance;
            break;
          case 'up':
            this.yRotation = -data.distance;
            break;
          case 'down':
            this.yRotation = data.distance;
            break;
        }
      }
      console.log(event);
      console.log(data);
    });
    this.rotationJoystick.on('end', () => {
      this.xRotation = 0;
      this.yRotation = 0;
    });
  }
}
