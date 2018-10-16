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
        let x = _.random(-16, 16, true);
        let z = _.random(-16, 16, true);
        while (true) {
          let valid = true;
          for (const img of images) {
            if ((Math.abs(img.position[0] - x) < 2) && (Math.abs(img.position[2] - z) < 2)) {
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
      });
    });
    return source;
  }

  getImage() {

  }
}
