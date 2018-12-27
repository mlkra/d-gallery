import { Component, OnInit } from '@angular/core';
import { CameraButtonsService } from '../service/camera-buttons.service';

@Component({
  selector: 'app-camera-buttons',
  templateUrl: './camera-buttons.component.html',
  styleUrls: ['./camera-buttons.component.css']
})
export class CameraButtonsComponent {

  constructor(private cameraButtonsService: CameraButtonsService) { }

  enabled() {
    return this.cameraButtonsService.movementEnabled;
  }
  
  up() {
    this.cameraButtonsService.up();
  }

  down() {
    this.cameraButtonsService.down();
  }
}
