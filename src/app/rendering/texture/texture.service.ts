import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { Observable } from 'rxjs';
import { Texture } from '../model/texture';

@Injectable({
  providedIn: 'root'
})
export class TextureService {
  // TODO should it be smaller?
  private thumbSize = 256;

  constructor(private storageService: StorageService) { }

  getTextures(gl: WebGLRenderingContext, count: number) {
    const roundedCount = this.roundToPowerOfTwo(count);
    let counter = 0;
    const glTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.thumbSize * roundedCount,
      this.thumbSize,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.generateColorArray(roundedCount)
    );
    const source = new Observable<Texture>((observer) => {
      this.storageService.getTextures(count).subscribe((tex) => {
        const localCounter = counter;
        counter++;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          this.thumbSize * localCounter,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          tex.image
        );
        tex.texCoords = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tex.texCoords);
        const x0 = 0 + 1 / roundedCount * localCounter;
        const x1 = 1 / roundedCount  + 1 / roundedCount * localCounter;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          x0, 1,
          x1, 1,
          x0, 0,
          x1, 0
        ]), gl.STATIC_DRAW);
        gl.generateMipmap(gl.TEXTURE_2D);
        tex.texture = glTex;

        observer.next(tex);
      }, () => {}, () => {
        observer.complete();
      });
    });
    return source;
  }

  getTexture(gl: WebGLRenderingContext, texture: Texture) {
    const source = new Observable<Texture>((observer) => {
      this.storageService.getTexture(texture).subscribe((tex) => {
        const glTex = gl.createTexture();
        // TODO check if it is right
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.FLOAT,
          tex.image
        );
        tex.texCoords = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tex.texCoords);
        // TODO check if it's right
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0, 1,
          1, 1,
          0, 0,
          1, 0
        ]), gl.STATIC_DRAW);
        gl.generateMipmap(gl.TEXTURE_2D);
        tex.texture = glTex;

        observer.next(tex);
      }, () => {}, () => {
        observer.complete();
      });
    });
    return source;
  }

  private roundToPowerOfTwo(number: number) {
    number--;
    number |= number >> 1;
    number |= number >> 2;
    number |= number >> 4;
    number |= number >> 8;
    number |= number >> 16;
    number |= number >> 32;
    number++;
    return number;
  }

  private generateColorArray(count: number) {
    const arr = [];
    for (let i = 0; i < count * this.thumbSize * this.thumbSize; i++) {
      arr.push(0.0, 0.0, 0.0, 1.0);
    }
    return new Uint8Array(arr);
  }
}
