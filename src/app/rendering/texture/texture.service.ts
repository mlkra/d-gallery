import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { Observable } from 'rxjs';
import { Texture } from '../model/texture';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TextureService {
  private texCoordsBuffer: WebGLBuffer;

  constructor(private storageService: StorageService) { }

  getTextures(gl: WebGLRenderingContext, count: number) {
    this.fillTexCoordsBuffer(gl);
    return this.storageService.getTextures(count).pipe(
      map((tex) => {
        const glTex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        tex.texCoords = this.texCoordsBuffer;
        gl.generateMipmap(gl.TEXTURE_2D);
        tex.texture = glTex;
        return tex;
      })
    );
  }

  getTexture(gl: WebGLRenderingContext, texture: Texture) {
    this.fillTexCoordsBuffer(gl);
    return this.storageService.getTexture(texture).pipe(
      map((tex) => {
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
          return tex;
      })
    );
  }

  getTextureFromImgElement(
    gl: WebGLRenderingContext, image: HTMLImageElement, path: string
  ) {
    this.fillTexCoordsBuffer(gl);
    const tex = new Texture(path, image);
    const glTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
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
    return tex;
  }

  private fillTexCoordsBuffer(gl: WebGLRenderingContext) {
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
