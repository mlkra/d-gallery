import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { Texture } from './texture';

@Injectable({
  providedIn: 'root'
})
export class TextureService {
  private thumbSize = 256;

  constructor(private storageService: StorageService) { }

  getTexture(gl: WebGLRenderingContext, count: number) {
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
        // TODO fill x and check if it matches vertexes
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0.0, 0.0,
          0.0, 0.0,
          0.0, 1.0,
          0.0, 1.0
        ]), gl.STATIC_DRAW);
        // TODO check if this should be here
        gl.generateMipmap(gl.TEXTURE_2D);
        tex.texture = glTex;

        observer.next(tex);
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
    for (let i = 0; i < count * 256 * 256; i++) {
      arr.push(0.0, 0.0, 0.0, 1.0);
    }
    return new Uint8Array(arr);
  }
}
