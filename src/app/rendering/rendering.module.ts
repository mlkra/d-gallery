import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenderingRoutingModule } from './rendering-routing.module';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  imports: [
    CommonModule,
    RenderingRoutingModule
  ],
  declarations: [CanvasComponent]
})
export class RenderingModule { }
