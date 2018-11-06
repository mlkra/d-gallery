import { Injectable } from '@angular/core';
import { Camera } from '../rendering/model/camera';
import { Scene } from '../rendering/model/scene';
import { StorageService } from '../storage/storage.service';
import { ImageService } from '../rendering/image/image.service';
import { JoystickService } from './service/joystick.service';
import { KeyboardService } from './service/keyboard.service';
import { MouseService } from './service/mouse.service';
import { MovementController } from './interface/movement-controller';
import { RotationController } from './interface/rotation-controller';
import { TriggerController } from './interface/trigger-controller';
import * as pointer from 'pointer-lock';
import { TriggerButtonService } from './service/trigger-button.service';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  private lastTime: number;
  private movementController: MovementController;
  private rotationController: RotationController;
  private triggerController: TriggerController;

  // TODO remove later
  constructor(
    private joystickService: JoystickService,
    private keyboardService: KeyboardService,
    private mouseService: MouseService,
    private triggerButtonService: TriggerButtonService,
    private storageService: StorageService,
    private imageService: ImageService
  ) { }

  init() {
    this.lastTime = 0;
    if ((pointer.available()) && !('ontouchstart' in document.documentElement)) {
      this.movementController = this.keyboardService;
      this.rotationController = this.mouseService;
      this.triggerController = this.keyboardService;
    } else if ('ontouchstart' in document.documentElement) {
      this.movementController = this.joystickService;
      this.rotationController = this.joystickService;
      this.triggerController = this.triggerButtonService;
    } else {
      this.movementController = this.keyboardService;
      this.rotationController = this.keyboardService;
      this.triggerController = this.keyboardService;
    }
    this.movementController.initMovement();
    this.rotationController.initRotation();
    this.triggerController.initTrigger();
  }

  controlsLoop(scene: Scene, camera: Camera, timestamp: number) {
    const time = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.moveCamera(camera, time);
    this.rotateCamera(camera, time);
    let res = this.checkTrigger(scene, camera);
    return res;
  }

  enableControls() {
    this.setControlsState(true);
  }

  disableControls() {
    this.setControlsState(false);
  }

  private setControlsState(enabled: boolean) {
    this.movementController.movementEnabled = enabled;
    this.rotationController.rotationEnabled = enabled;
    this.triggerController.triggerEnabled = enabled;
  }

  private checkTrigger(scene: Scene, camera: Camera) {
    if (this.triggerController.triggerDownload) {
      this.triggerController.triggerDownload = false;
      let img = this.startDownload(scene, camera);
      if (img) {
        return {
          download: true,
          texture: img.texture
        };
      }
    }
    return {
      download: false
    };
  }
  
  private moveCamera(camera: Camera, time: number) {
    const movement = this.movementController.movement;
    const speed = this.movementController.movementSpeed;
    if (movement.dx !== 0) {
      camera.moveX(movement.dx * speed * time);
    }
    if (movement.dy !== 0) {
      camera.moveZ(movement.dy * speed * time);
    }
  }

  private rotateCamera(camera: Camera, time: number) {
    const rotation = this.rotationController.rotation;
    const speed = this.rotationController.rotationSpeed;
    if (rotation.dx !== 0) {
      camera.rotateY(rotation.dx * speed * time);
    }
    if (rotation.dy !== 0) {
      camera.rotateX(rotation.dy * speed * time);
    }
  }

  private startDownload2(scene: Scene, camera: Camera) {
    const image = scene.intersect(camera.getRay());
    if (image) {
      console.log('downloading: ', image.texture.path);
      // TODO delegate download somewhere (popup component?)
      this.storageService.getTexture(image.texture).subscribe((tex) => {
        this.imageService.downloadImage(tex.image.src, 'texture.jpg');
      });
    }
  }

  private startDownload(scene: Scene, camera: Camera) {
    const image = scene.intersect(camera.getRay());
    return image;
  }
}
