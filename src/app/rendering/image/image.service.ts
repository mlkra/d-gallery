import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../model/image';
import { vec3 } from 'gl-matrix';
import { TextureService } from '../texture/texture.service';
import * as _ from 'lodash';
import { PlacementStrategy } from './placement-strategy';

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
    const images: Image[] = [];
    const source = new Observable<Image>((observer) => {
      this.textureService.getTextures(gl, count).subscribe((tex) => {
        const img = new Image(
          this.positionBuffer,
          tex,
          placementStrategy.getPosition(),
          vec3.fromValues(1, 1, 1)
        );
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
