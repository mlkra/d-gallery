import { Injectable } from '@angular/core';
import { Deltas2, Deltas3 } from '../interface/deltas';
import { MovementController } from '../interface/movement-controller';
import { RotationController } from '../interface/rotation-controller';
import { TriggerController } from '../interface/trigger-controller';

enum MovementButtons {
  Front = 'w',
  Back = 's',
  Left = 'a',
  Right = 'd',
  Up = 'r',
  Down = 'f'
}

enum RotationButtons {
  Up = 'i',
  Down = 'k',
  Left = 'j',
  Right = 'l'
}

const TriggerButton = ' ';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService implements MovementController, RotationController, TriggerController {
  movementSpeed = 0.01;
  rotationSpeed = 0.05;
  movementEnabled: boolean;
  rotationEnabled: boolean;
  triggerEnabled: boolean;
  triggerDownload: boolean;
  movement: Deltas3;
  rotation: Deltas2;

  constructor() { }

  initMovement() {
    this.movementEnabled = true;
    this.movement = {
      dx: 0,
      dy: 0,
      dz: 0
    };
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      if (this.movementEnabled) {
        switch (key) {
          case MovementButtons.Front:
            this.movement.dy = 1;
            break;
          case MovementButtons.Back:
            this.movement.dy = -1;
            break;
          case MovementButtons.Left:
            this.movement.dx = 1;
            break;
          case MovementButtons.Right:
            this.movement.dx = -1;
            break;
          case MovementButtons.Up:
            this.movement.dz = 1;
            break;
          case MovementButtons.Down:
            this.movement.dz = -1;
            break;
        }
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      if (this.movementEnabled) {
        switch (key) {
          case MovementButtons.Front:
            if (this.movement.dy > 0) {
              this.movement.dy = 0;
            }
            break;
          case MovementButtons.Back:
          if (this.movement.dy < 0) {
            this.movement.dy = 0;
          }
            break;
          case MovementButtons.Left:
            if (this.movement.dx > 0) {
              this.movement.dx = 0;
            }
            break;
          case MovementButtons.Right:
            if (this.movement.dx < 0) {
              this.movement.dx = 0;
            }
            break;
          case MovementButtons.Up:
            if (this.movement.dz > 0) {
              this.movement.dz = 0;
            }
            break;
          case MovementButtons.Down:
            if (this.movement.dz < 0) {
              this.movement.dz = 0;
            }
            break;
        }
      }
    });
  }

  initRotation() {
    this.rotationEnabled = true;
    this.rotation = {
      dx: 0,
      dy: 0
    };
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      if (this.rotationEnabled) {
        switch (key) {
          case RotationButtons.Up:
            this.rotation.dy = 1;
            break;
          case RotationButtons.Down:
            this.rotation.dy = -1;
            break;
          case RotationButtons.Left:
            this.rotation.dx = -1;
            break;
          case RotationButtons.Right:
            this.rotation.dx = 1;
            break;
        }
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      if (this.rotationEnabled) {
        switch (key) {
          case RotationButtons.Up:
            if (this.rotation.dy > 0) {
              this.rotation.dy = 0;
            }
            break;
          case RotationButtons.Down:
            if (this.rotation.dy < 0) {
              this.rotation.dy = 0;
            }
            break;
          case RotationButtons.Left:
            if (this.rotation.dx < 0) {
              this.rotation.dx = 0;
            }
            break;
          case RotationButtons.Right:
          if (this.rotation.dx > 0) {
            this.rotation.dx = 0;
          }
            break;
        }
      }
    });
  }

  initTrigger() {
    this.triggerEnabled = true;
    this.triggerDownload = false;
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      if (this.triggerEnabled) {
        switch (key) {
          case TriggerButton:
            this.triggerDownload = true;
            break;
        }
      }
    });
  }

  init() {
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      if (this.movementEnabled) {
        switch (key) {
          case MovementButtons.Front:
            this.movement.dy = 1;
            break;
          case MovementButtons.Back:
            this.movement.dy = -1;
            break;
          case MovementButtons.Left:
            this.movement.dx = 1;
            break;
          case MovementButtons.Right:
            this.movement.dx = -1;
            break;
        }
      }
      if (this.rotationEnabled) {
        switch (key) {
          case RotationButtons.Up:
            this.rotation.dy = 1;
            break;
          case RotationButtons.Down:
            this.rotation.dy = -1;
            break;
          case RotationButtons.Left:
            this.rotation.dx = -1;
            break;
          case RotationButtons.Right:
            this.rotation.dx = 1;
            break;
        }
      }
      if (this.triggerEnabled) {
        switch (key) {
          case TriggerButton:
            this.triggerDownload = true;
            break;
        }
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      if (this.movementEnabled) {
        switch (key) {
          case MovementButtons.Front:
            if (this.movement.dy > 0) {
              this.movement.dy = 0;
            }
            break;
          case MovementButtons.Back:
          if (this.movement.dy < 0) {
            this.movement.dy = 0;
          }
            break;
          case MovementButtons.Left:
            if (this.movement.dx > 0) {
              this.movement.dx = 0;
            }
            break;
          case MovementButtons.Right:
          if (this.movement.dx < 0) {
            this.movement.dx = 0;
          }
            break;
        }
      }
      if (this.rotationEnabled) {
        switch (key) {
          case RotationButtons.Up:
            if (this.rotation.dy > 0) {
              this.rotation.dy = 0;
            }
            break;
          case RotationButtons.Down:
            if (this.rotation.dy < 0) {
              this.rotation.dy = 0;
            }
            break;
          case RotationButtons.Left:
            if (this.rotation.dx < 0) {
              this.rotation.dx = 0;
            }
            break;
          case RotationButtons.Right:
          if (this.rotation.dx > 0) {
            this.rotation.dx = 0;
          }
            break;
        }
      }
    });
  }
}
