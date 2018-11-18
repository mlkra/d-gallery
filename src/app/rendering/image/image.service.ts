import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../model/image';
import { vec3 } from 'gl-matrix';
import { TextureService } from '../texture/texture.service';
import * as _ from 'lodash';
import { PlacementStrategy } from './placement-strategy';
import { map } from 'rxjs/operators';

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

  getImages(
    gl: WebGLRenderingContext,
    placementStrategy: PlacementStrategy,
    count: number
  ) {
    return this.textureService.getTextures(gl, count).pipe(
      map((tex) => {
        const img = new Image(
          this.positionBuffer,
          tex,
          placementStrategy.getPosition(),
          vec3.fromValues(2, 2, 2)
        );
        console.log(img);
        return img;
      })
    );
  }

  getImage(gl: WebGLRenderingContext, image: Image) {
    return this.textureService.getTexture(gl, image.texture).pipe(
      map((tex) => {
        const img = new Image(
          this.positionBuffer, tex, vec3.create(), vec3.fromValues(1, 1, 1)
        );
        return img;
      })
    );
  }

  // TODO refactor?
  downloadImage(url: string, name: string) {
    return new Observable<boolean>((observer) => {
      fetch(url, {
        headers: new Headers({
          'Origin': location.origin
        }),
        mode: 'cors'
      }).then((response) => {
        return response.blob();
      }).then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        this.downloadUsingAnchor(blobUrl, name);
        observer.next(true);
        observer.complete();
      });  
    });
  }

  private downloadUsingAnchor(blob, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    a.click();
  }
}
