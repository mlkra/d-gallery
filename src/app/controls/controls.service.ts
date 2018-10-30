import { Injectable } from '@angular/core';
import { Camera } from '../rendering/model/camera';

enum MovementButtons {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd'
}

interface Movement {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface Rotation {
  dx: number;
  dy: number;
}

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  private movementSpeed = 0.015;
  private rotationSpeed = 0.1;
  private lastTime: number;
  private movement: Movement;
  private rotation: Rotation;

  constructor() { }

  init(pointer) {
    this.lastTime = 0;
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    this.rotation = {
      dx: 0,
      dy: 0
    };
    // TODO extract method
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      switch (key) {
        case MovementButtons.Up:
          this.movement.up = true;
          // this.camera.moveZ(0.1);
          break;
        case MovementButtons.Down:
          this.movement.down = true;
          // this.camera.moveZ(-0.1);
          break;
        case MovementButtons.Left:
          this.movement.left = true;
          // this.camera.moveX(0.1);
          break;
        case MovementButtons.Right:
          this.movement.right = true;
          // this.camera.moveX(-0.1);
          break;
        case 'i':
          // this.camera.rotateX(2);
          break;
        case 'k':
          // this.camera.rotateX(-2);
          break;
        case 'j':
          // this.camera.rotateY(-2);
          break;
        case 'l':
          // this.camera.rotateY(2);
          break;
        case ' ':
          // const image = this.intersect(this.scene, this.camera.getRay());
          // if (image) {
          //   console.log('downloading: ', image.texture.path);
          //   this.storageService.getTexture(image.texture).subscribe((tex) => {
          //     downloadImage(tex.image.src, 'texture.jpg');
          //   });
          // }
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      switch (key) {
        case MovementButtons.Up:
          this.movement.up = false;
          // this.camera.moveZ(0.1);
          break;
        case MovementButtons.Down:
          this.movement.down = false;
          // this.camera.moveZ(-0.1);
          break;
        case MovementButtons.Left:
          this.movement.left = false;
          // this.camera.moveX(0.1);
          break;
        case MovementButtons.Right:
          this.movement.right = false;
          // this.camera.moveX(-0.1);
          break;
        case 'i':
          // this.camera.rotateX(2);
          break;
        case 'k':
          // this.camera.rotateX(-2);
          break;
        case 'j':
          // this.camera.rotateY(-2);
          break;
        case 'l':
          // this.camera.rotateY(2);
          break;
        case ' ':
          // const image = this.intersect(this.scene, this.camera.getRay());
          // if (image) {
          //   console.log('downloading: ', image.texture.path);
          //   this.storageService.getTexture(image.texture).subscribe((tex) => {
          //     downloadImage(tex.image.src, 'texture.jpg');
          //   });
          // }
          break;
      }
    });
    pointer.on('attain', (movements) => {
      movements.on('data', (move) => {
        console.log(move);
        this.rotation.dx += move.dx;
        this.rotation.dy += move.dy;
      });
    });
  }

  controlsLoop(camera: Camera, timestamp: number) {
    const time = timestamp - this.lastTime;
    this.lastTime = timestamp;
    if (this.xor(this.movement.up, this.movement.down)) {
      let step = this.movementSpeed * time;
      if (this.movement.down) {
        step = -step;
      }
      camera.moveZ(step);
    }
    if (this.xor(this.movement.left, this.movement.right)) {
      let step = this.movementSpeed * time;
      if (this.movement.right) {
        step = -step;
      }
      camera.moveX(step);
    }
    if (this.rotation.dx !== 0) {
      camera.rotateY(this.rotation.dx * this.rotationSpeed);
    }
    if (this.rotation.dy !== 0) {
      camera.rotateX(this.rotation.dy * -this.rotationSpeed);
    }
    this.rotation = {
      dx: 0,
      dy: 0
    };
  }

  private xor(a: boolean, b: boolean) {
    return (a && !b) || (!a && b);
  }
}
