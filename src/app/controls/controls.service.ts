import { Injectable } from '@angular/core';
import { Camera } from '../rendering/model/camera';
import { Scene } from '../rendering/model/scene';
import { StorageService } from '../storage/storage.service';
import { ImageService } from '../rendering/image/image.service';

enum MovementButtons {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd'
}

const TriggerButton = ' ';

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
  private triggerDownload: boolean;

  // TODO remove later
  constructor(
    private storageService: StorageService,
    private imageService: ImageService
  ) { }

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
    this.triggerDownload = false;
    // TODO extract method
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      switch (key) {
        case MovementButtons.Up:
          this.movement.up = true;
          break;
        case MovementButtons.Down:
          this.movement.down = true;
          break;
        case MovementButtons.Left:
          this.movement.left = true;
          break;
        case MovementButtons.Right:
          this.movement.right = true;
          break;
        case TriggerButton:
          this.triggerDownload = true;
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.key;
      switch (key) {
        case MovementButtons.Up:
          this.movement.up = false;
          break;
        case MovementButtons.Down:
          this.movement.down = false;
          break;
        case MovementButtons.Left:
          this.movement.left = false;
          break;
        case MovementButtons.Right:
          this.movement.right = false;
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

  controlsLoop(scene: Scene, camera: Camera, timestamp: number) {
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
    if (this.triggerDownload) {
      this.triggerDownload = false;
      const image = scene.intersect(camera.getRay());
      if (image) {
        console.log('downloading: ', image.texture.path);
        // TODO delegate download somewhere (popup component?)
        this.storageService.getTexture(image.texture).subscribe((tex) => {
          this.imageService.downloadImage(tex.image.src, 'texture.jpg');
        });
      }
    }
  }

  private xor(a: boolean, b: boolean) {
    return (a && !b) || (!a && b);
  }
}
