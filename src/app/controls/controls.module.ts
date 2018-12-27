import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerButtonComponent } from './trigger-button/trigger-button.component';
import { CameraButtonsComponent } from './camera-buttons/camera-buttons.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TriggerButtonComponent, CameraButtonsComponent],
  exports: [
    TriggerButtonComponent,
    CameraButtonsComponent
  ]
})
export class ControlsModule { }
