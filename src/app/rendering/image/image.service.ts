import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../model/image';
import { vec3 } from 'gl-matrix';
import { TextureService } from '../texture/texture.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private positionBuffer: WebGLBuffer;

  constructor(private textureService: TextureService) { }

  init(gl: WebGLRenderingContext) {
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0,
      +1, -1, 0,
      -1, +1, 0,
      +1, +1, 0
    ]), gl.STATIC_DRAW);
  }

  getImages(gl: WebGLRenderingContext, count: number) {
    const images: Image[] = [];
    const source = new Observable<Image>((observer) => {
      this.textureService.getTextures(gl, count).subscribe((tex) => {
        const x = _.random(-40, 40, true);
        const z = _.random(-40, 40, true);
        // TODO bad infinite loop causing problems, maybe add retries limit?
        while (true) {
          let valid = true;
          for (const image of images) {
            if ((Math.abs(image.position[0] - x) < 1) && (Math.abs(image.position[2] - z) < 1)) {
              valid = false;
              break;
            }
          }
          if (valid) {
            break;
          }
        }
        const img = new Image(this.positionBuffer, tex, vec3.fromValues(x, 0, z), vec3.fromValues(1, 1, 1));
        images.push(img);
        console.log(img);
        observer.next(img);
      }, () => {}, () => {
        observer.complete();
      });
    });
    return source;
  }

  getImage(gl: WebGLRenderingContext, image: Image) {
    const source = new Observable<Image>((observer) => {
      this.textureService.getTexture(gl, image.texture).subscribe((tex) => {
        const img = new Image(this.positionBuffer, tex, vec3.create(), vec3.fromValues(1, 1, 1));
        observer.next(img);
      }, () => {}, () => {
        observer.complete();
      });
    });
    return source;
  }
}
