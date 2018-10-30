import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RenderingService } from '../rendering.service';
import { Scene } from '../model/scene';
import { Camera } from '../model/camera';
import { glMatrix, vec3 } from 'gl-matrix';
import { ImageService } from '../image/image.service';
import { StorageService } from 'src/app/storage/storage.service';
import { Ray } from '../model/ray';
import { Image } from '../model/image';
import { ControlsService } from 'src/app/controls/controls.service';
import * as pointer from 'pointer-lock';

const toRadian = glMatrix.toRadian;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  noWebGLMessage: string;
  private gl: WebGLRenderingContext;
  private scene: Scene;
  private camera: Camera;
  private pointer;

  constructor(
    private imageService: ImageService,
    private controlsService: ControlsService,
    private renderingService: RenderingService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = document.querySelector('#app-canvas');
    this.gl = canvas.getContext('webgl');
    if (this.gl) {
      this.renderingService.init(this.gl);
      this.imageService.init(this.gl);
      this.scene = new Scene(this.gl);
      // TODO add parameter
      this.imageService.getImages(this.gl, 10).subscribe((img) => {
        this.scene.images.push(img);
      });
      this.camera = new Camera(
        vec3.fromValues(0, 0, -2),
        toRadian(90),
        canvas.width / canvas.height,
        0.1,
        100
      );
      (function (_this) {
        function loop(timestamp) {
          _this.controlsService.controlsLoop(_this.scene, _this.camera, timestamp);
          _this.renderingService.renderLoop(_this.scene, _this.camera);
          window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
      })(this);
      if (!pointer.available()) {
        // TODO switch if not available
        console.log('Pointer not available. Fallback to keyboard!');
      }
      this.pointer = pointer(canvas);
      this.controlsService.init(this.pointer);
      canvas.addEventListener('onclick', () => {
        this.pointer.request();
      });
    } else {
      this.noWebGLMessage = 'Your browser does not support WebGL';
    }
  }
}
