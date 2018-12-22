import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RenderingService } from '../rendering.service';
import { Scene } from '../model/scene';
import { Camera } from '../model/camera';
import { glMatrix, vec3 } from 'gl-matrix';
import { ImageService } from '../image/image.service';
import { ControlsService } from 'src/app/controls/controls.service';
import { StorageService } from 'src/app/storage/storage.service';
import { ModalState } from '../download-popup/download-popup.component';
import { PlacementStrategy } from '../image/placement-strategy';
import { CubePlacementStrategy } from '../image/cube-placement-strategy';
import { TextureService } from '../texture/texture.service';
import { fromEvent } from 'rxjs';

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
  private placementStrategy: PlacementStrategy;
  private requestID: number;

  constructor(
    private imageService: ImageService,
    private storageService: StorageService,
    private textureService: TextureService,
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
      const imagesCount = 64;
      this.renderingService.init(this.gl);
      this.imageService.init(this.gl);
      this.scene = new Scene(this.gl);
      // TODO choose placement based on user input
      this.placementStrategy = new CubePlacementStrategy(imagesCount);
      // TODO add parameter
      this.imageService.getImages(
        this.gl, this.placementStrategy, imagesCount
      ).subscribe((img) => {
        this.scene.images.push(img);
      }, () => {}, () => {
        const src = sessionStorage.getItem('uri');
        if (src) {
          const img = new Image();
          fromEvent(img, 'load').subscribe(() => {
            const path = sessionStorage.getItem('path');
            const tex = this.textureService.getTextureFromImgElement(this.gl, img, path);
            this.scene.images[6].texture = tex;
          });
          img.src = src;
        }
      });
      this.camera = new Camera(
        vec3.fromValues(0, 0, -4),
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
        let res = _this.controlsService.controlsLoop(_this.scene, _this.camera, timestamp);
        if (res.download) {
          _this.showModal = true;
          _this.storageService.getImageURL(res.texture).subscribe((url) => {
            _this.imgSrc = url;
          });
        }
        _this.renderingService.renderLoop(_this.scene, _this.camera);
        _this.requestID = window.requestAnimationFrame(loop);
      }
      _this.requestID = window.requestAnimationFrame(loop);
    })(this);
  }
}
