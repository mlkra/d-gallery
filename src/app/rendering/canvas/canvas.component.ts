import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RenderingService } from '../rendering.service';
import { Scene } from '../model/scene';
import { Camera } from '../model/camera';
import { vec3 } from 'gl-matrix';
import { degToRad } from 'src/app/math/math-utils';
import { ImageService } from '../image/image.service';
import { StorageService } from 'src/app/storage/storage.service';
import { Ray } from '../model/ray';
import { Image } from '../model/image';

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

  constructor(
    private storageService: StorageService,
    private imageService: ImageService,
    private renderingService: RenderingService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = document.querySelector('#app-canvas');
    this.gl = canvas.getContext('webgl');
    if (this.gl) {
      // TODO init control?? service
      //      get images and add theme to scene
      this.renderingService.init(this.gl);
      this.imageService.init(this.gl);
      this.scene = new Scene(this.gl);
      // TODO add parameter
      this.imageService.getImages(this.gl, 10).subscribe((img) => {
        this.scene.images.push(img);
      });
      this.camera = new Camera(
        vec3.fromValues(0, 0, -2),
        degToRad(90),
        canvas.width / canvas.height,
        0.1,
        100
      );
      (function (_this) {
        // TODO call method from ControlsService passing calculated timestamp
        function loop(timestamp) {
          _this.renderingService.renderLoop(_this.scene, _this.camera);
          window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
      })(this);
      // TODO move this to appropriate service
      window.addEventListener('keydown', (event) => {
        const key = event.key;
        switch (key) {
          case 'w':
            this.camera.moveZ(0.1);
            break;
          case 's':
            this.camera.moveZ(-0.1);
            break;
          case 'a':
            this.camera.moveX(0.1);
            break;
          case 'd':
            this.camera.moveX(-0.1);
            break;
          case 'i':
            this.camera.rotateX(2);
            break;
          case 'k':
            this.camera.rotateX(-2);
            break;
          case 'j':
            this.camera.rotateY(-2);
            break;
          case 'l':
            this.camera.rotateY(2);
            break;
          case ' ':
            console.log('Download starting... someday');
            const image = this.intersect(this.scene, this.camera.getRay());
            if (image) {
              // TODO start download
              console.log('Hit!');
            }
            break;
        }
      });
    } else {
      this.noWebGLMessage = 'Your browser does not support WebGL';
    }
  }

  private intersect(scene: Scene, ray: Ray) {
    let nearestImage: Image;
    let minDist = Infinity;
    for (const image of scene.images) {
      const point = ray.intersect(image.position, image.normal);
      if (point) {
        if (image.contains(point)) {
          console.log('valid!!');
          const dist = vec3.dist(ray.start, point);
          if (dist < minDist) {
            nearestImage = image;
            minDist = dist;
          }
        }
        console.log(point);
        console.log(image);
      }
    }
    return nearestImage;
  }
}
