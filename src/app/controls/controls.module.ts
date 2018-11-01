import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerButtonComponent } from './trigger-button/trigger-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TriggerButtonComponent],
  exports: [
    TriggerButtonComponent
  ]
})
export class ControlsModule { }
