import { Injectable } from '@angular/core';
import { Camera } from '../rendering/model/camera';
import { Scene } from '../rendering/model/scene';
import { StorageService } from '../storage/storage.service';
import { ImageService } from '../rendering/image/image.service';
import { JoystickService } from './joystick.service';

enum MovementButtons {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd'
}

const TriggerButton = ' ';

interface Movement {
  up: number;
  down: number;
  left: number;
  right: number;
}

interface Rotation {
  dx: number;
  dy: number;
}

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  enabled = false;
  private movementSpeed = 0.015;
  private rotationSpeed = 0.1;
  private lastTime: number;
  private movement: Movement;
  private movement2: Rotation;
  private rotation: Rotation;
  private triggerDownload: boolean;

  // TODO remove later
  constructor(
    private joystickService: JoystickService,
    private storageService: StorageService,
    private imageService: ImageService
  ) { }

  init(pointer) {
    this.resetVariables();
    this.triggerDownload = false;
    this.joystickService.init();
    // this.initKeyboardMovement();
    // this.initMouseRotation(pointer);
  }

  controlsLoop(scene: Scene, camera: Camera, timestamp: number) {
    const time = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.getMovement();
    this.moveCamera(camera, time);
    this.getRotation();
    this.rotateCamera(camera);
    if (this.triggerDownload) {
      this.triggerDownload = false;
      this.startDownload(scene, camera);
    }
  }

  private getMovement() {
    this.movement2.dx = this.joystickService.xMovement;
    this.movement2.dy = this.joystickService.yMovement;
  }

  private getRotation() {
    this.rotation.dx = this.joystickService.xRotation;
    this.rotation.dy = this.joystickService.yRotation;
  }

  private moveCamera(camera: Camera, time: number) {
    // TODO refactor so that it works with joysticks
    // if (this.xor(this.movement.up !== 0, this.movement.down !== 0)) {
    //   let step = this.movementSpeed * time;
    //   if (this.movement.down) {
    //     step = -step;
    //   }
    //   camera.moveZ(step);
    // }
    // if (this.xor(this.movement.left !== 0, this.movement.right !== 0)) {
    //   let step = this.movementSpeed * time;
    //   if (this.movement.right) {
    //     step = -step;
    //   }
    //   camera.moveX(step);
    // }
    if (this.movement2.dx !== 0) {
      camera.moveX(this.movement2.dx * this.movementSpeed);
    }
    if (this.movement2.dy !== 0) {
      camera.moveZ(this.movement2.dy * this.movementSpeed);
    }
  }

  private rotateCamera(camera: Camera) {
    if (this.rotation.dx !== 0) {
      camera.rotateY(this.rotation.dx * this.rotationSpeed);
    }
    if (this.rotation.dy !== 0) {
      camera.rotateX(this.rotation.dy * -this.rotationSpeed);
    }
  }

  private startDownload(scene: Scene, camera: Camera) {
    const image = scene.intersect(camera.getRay());
      if (image) {
        console.log('downloading: ', image.texture.path);
        // TODO delegate download somewhere (popup component?)
        this.storageService.getTexture(image.texture).subscribe((tex) => {
          this.imageService.downloadImage(tex.image.src, 'texture.jpg');
        });
      }
  }

  private resetVariables() {
    this.enabled = true;
    this.lastTime = 0;
    this.movement = {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    };
    this.movement2 = {
      dx: 0,
      dy: 0
    };
    this.rotation = {
      dx: 0,
      dy: 0
    };
  }

  private initKeyboardMovement() {
    window.addEventListener('keydown', (event) => {
      if (this.enabled) {
        const key = event.key;
        switch (key) {
          case MovementButtons.Up:
            this.movement.up = 1;
            break;
          case MovementButtons.Down:
            this.movement.down = 1;
            break;
          case MovementButtons.Left:
            this.movement.left = 1;
            break;
          case MovementButtons.Right:
            this.movement.right = 1;
            break;
          case TriggerButton:
            this.triggerDownload = true;
            break;
        }
      }
    });
    window.addEventListener('keyup', (event) => {
      if (this.enabled) {
        const key = event.key;
        switch (key) {
          case MovementButtons.Up:
            this.movement.up = 0;
            break;
          case MovementButtons.Down:
            this.movement.down = 0;
            break;
          case MovementButtons.Left:
            this.movement.left = 0;
            break;
          case MovementButtons.Right:
            this.movement.right = 0;
            break;
        }
      }
    });
  }

  private initMouseRotation(pointer) {
    pointer.on('attain', (movements) => {
      movements.on('data', (move) => {
        console.log(move);
        this.rotation.dx += move.dx;
        this.rotation.dy += move.dy;
      });
    });
  }

  private xor(a: boolean, b: boolean) {
    return (a && !b) || (!a && b);
  }
}
