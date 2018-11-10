import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { Observable } from 'rxjs';
import { Texture } from '../model/texture';

@Injectable({
  providedIn: 'root'
})
export class TextureService {
  private texCoordsBuffer: WebGLBuffer;

  constructor(private storageService: StorageService) { }

  getTextures(gl: WebGLRenderingContext, count: number) {
    const source = new Observable<Texture>((observer) => {
      this.fillTexCoordsBuffer(gl);
      this.storageService.getTextures(count).subscribe((tex) => {
        const glTex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        tex.texCoords = this.texCoordsBuffer;
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
      this.fillTexCoordsBuffer(gl);
      this.storageService.getTexture(texture).subscribe((tex) => {
        const glTex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          tex.image
        );
        tex.texCoords = this.texCoordsBuffer;
        gl.generateMipmap(gl.TEXTURE_2D);
        tex.texture = glTex;

        observer.next(tex);
      }, () => {}, () => {
        observer.complete();
      });
    });
    return source;
  }

  private fillTexCoordsBuffer(gl: WebGLRenderingContext) {
    if (!this.texCoordsBuffer) {
      this.texCoordsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 1,
        1, 1,
        0, 0,
        1, 0
      ]), gl.STATIC_DRAW);
    }
  }
}
