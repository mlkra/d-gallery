import { Injectable } from '@angular/core';
import { Camera } from '../rendering/model/camera';
import { Scene } from '../rendering/model/scene';
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
  private movementControllers: MovementController[];
  private rotationControllers: RotationController[];
  private triggerControllers: TriggerController[];

  constructor(
    private joystickService: JoystickService,
    private keyboardService: KeyboardService,
    private mouseService: MouseService,
    private triggerButtonService: TriggerButtonService
  ) { }

  init() {
    this.lastTime = 0;
    this.movementControllers = [];
    this.rotationControllers = [];
    this.triggerControllers = [];
    if ((pointer.available()) && !('ontouchstart' in document.documentElement)) {
      this.movementControllers.push(this.keyboardService);
      this.rotationControllers.push(this.keyboardService);
      this.rotationControllers.push(this.mouseService);
      this.triggerControllers.push(this.keyboardService);
    } else if ('ontouchstart' in document.documentElement) {
      this.movementControllers.push(this.joystickService);
      this.rotationControllers.push(this.joystickService);
      this.triggerControllers.push(this.triggerButtonService);
    } else {
      this.movementControllers.push(this.keyboardService);
      this.rotationControllers.push(this.keyboardService);
      this.triggerControllers.push(this.keyboardService);
    }

    this.movementControllers.forEach((mC) => {
      mC.initMovement();
    });
    this.rotationControllers.forEach((rC) => {
      rC.initRotation();
    });
    this.triggerControllers.forEach((tC) => {
      tC.initTrigger();
    });
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
    this.movementControllers.forEach((mC) => {
      mC.movementEnabled = enabled;
    });
    this.rotationControllers.forEach((rC) => {
      rC.rotationEnabled = enabled;
    });
    this.triggerControllers.forEach((tC) => {
      tC.triggerEnabled = enabled;
    });
  }

  private checkTrigger(scene: Scene, camera: Camera) {
    for (const tC of this.triggerControllers) {
      if (tC.triggerDownload) {
        tC.triggerDownload = false;
        let img = this.startDownload(scene, camera);
        if (img) {
          return {
            download: true,
            texture: img.texture
          };
        }
      }
    }
    return {
      download: false
    };
  }
  
  private moveCamera(camera: Camera, time: number) {
    this.movementControllers.forEach((mC) => {
      const movement = mC.movement;
      const speed = mC.movementSpeed;
      if (movement.dx !== 0) {
        camera.moveX(movement.dx * speed * time);
      }
      if (movement.dz !== 0) {
        camera.moveY(movement.dz * speed * time);
      }
      if (movement.dy !== 0) {
        camera.moveZ(movement.dy * speed * time);
      }
    });
  }

  private rotateCamera(camera: Camera, time: number) {
    this.rotationControllers.forEach((rC) => {
      const rotation = rC.rotation;
      const speed = rC.rotationSpeed;
      if (rotation.dx !== 0) {
        camera.rotateY(rotation.dx * speed * time);
      }
      if (rotation.dy !== 0) {
        camera.rotateX(rotation.dy * speed * time);
      }
    });
  }

  private startDownload(scene: Scene, camera: Camera) {
    const image = scene.intersect(camera.getRay());
    return image;
  }
}
