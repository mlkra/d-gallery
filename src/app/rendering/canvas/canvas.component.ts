import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RenderingService } from '../rendering.service';
import { Scene } from '../model/scene';
import { Camera } from '../model/camera';
import { glMatrix, vec3 } from 'gl-matrix';
import { ImageService } from '../image/image.service';
import { ControlsService } from 'src/app/controls/controls.service';
import { StorageService } from 'src/app/storage/storage.service';
import { ModalState } from '../download-popup/download-popup.component';

const toRadian = glMatrix.toRadian;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  noWebGLMessage: string;
  imgSrc: string;
  showModal: boolean = false;

  private gl: WebGLRenderingContext;
  private scene: Scene;
  private camera: Camera;
  private requestID: number;

  constructor(
    private imageService: ImageService,
    private storageService: StorageService,
    private controlsService: ControlsService,
    private renderingService: RenderingService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = document.querySelector('#app-canvas');
    if ('ontouchstart' in document.documentElement) {
      // canvas.addEventListener('click', () => {
      //   // TODO improve
      //   document.body.webkitRequestFullscreen();
      // });
    }
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
      this.startAnimation();
      this.controlsService.init();
    } else {
      setTimeout(() => {
        this.noWebGLMessage = 'Your browser does not support WebGL';
      })
    }
  }

  ngOnDestroy() {
    this.controlsService.disableControls();
    window.cancelAnimationFrame(this.requestID);
  }

  onToggle(visible: ModalState) {
    console.log('onToggle ', visible);
    switch (visible) {
      case ModalState.VISIBLE:
        this.showModal = true;
        this.controlsService.disableControls();
        window.cancelAnimationFrame(this.requestID);
        break;
      case ModalState.HIDDEN:
        this.showModal = false;
        this.controlsService.enableControls();
        this.startAnimation();
        break;
    }
  }

  private startAnimation() {
    (function (_this) {
      function loop(timestamp) {
        // TODO fix
        let res = _this.controlsService.controlsLoop(_this.scene, _this.camera, timestamp);
        if (res.download) {
          _this.showModal = true;
          _this.storageService.getTexture(res.texture).subscribe((tex) => {
            _this.imgSrc = tex.image.src;
          });
        }
        _this.renderingService.renderLoop(_this.scene, _this.camera);
        _this.requestID = window.requestAnimationFrame(loop);
      }
      _this.requestID = window.requestAnimationFrame(loop);
    })(this);
  }
}
