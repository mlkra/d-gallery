import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenderingRoutingModule } from './rendering-routing.module';
import { CanvasComponent } from './canvas/canvas.component';
import { ControlsModule } from '../controls/controls.module';
import { DownloadPopupComponent } from './download-popup/download-popup.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RenderingRoutingModule,
    ControlsModule,
    SharedModule
  ],
  declarations: [CanvasComponent, DownloadPopupComponent]
})
export class RenderingModule { }
