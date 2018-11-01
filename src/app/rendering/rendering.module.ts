import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenderingRoutingModule } from './rendering-routing.module';
import { CanvasComponent } from './canvas/canvas.component';
import { ControlsModule } from '../controls/controls.module';

@NgModule({
  imports: [
    CommonModule,
    RenderingRoutingModule,
    ControlsModule
  ],
  declarations: [CanvasComponent]
})
export class RenderingModule { }
