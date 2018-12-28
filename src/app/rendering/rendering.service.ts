import { Injectable } from '@angular/core';
import { ShaderService } from './shader/shader.service';
import { mat4 } from 'gl-matrix';
import { Scene } from './model/scene';
import { Camera } from './model/camera';
import { Floor } from './model/floor';
import { Image } from './model/image';
import { Crosshair } from './model/crosshair';
import { Box } from './model/box';

@Injectable({
  providedIn: 'root'
})
export class RenderingService {
  private gl: WebGLRenderingContext;
  private crosshair: Crosshair;

  constructor(private shaderService: ShaderService) { }

  init(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shaderService.initShaders(gl);
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.FRONT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.crosshair = new Crosshair(gl);
  }

  renderLoop(scene: Scene, camera: Camera) {
    const gl = this.gl;
    this.resizeCanvas(camera);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // this.renderFloor(scene.floor, camera);
    if (scene.images) {
      this.renderImages(scene.images, camera);
    }
    this.renderBox(scene.box, camera);
    this.renderCrosshair(this.crosshair, camera);
    gl.flush();
  }

  private renderFloor(floor: Floor, camera: Camera) {
    const gl = this.gl;
    const wrapper = this.shaderService.colorProgramWrapper;
    gl.useProgram(wrapper.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.positionBuffer);
    gl.enableVertexAttribArray(wrapper.positionAttribLocation);
    gl.vertexAttribPointer(
      wrapper.positionAttribLocation,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const modelViewProjection = mat4.create();
    mat4.multiply(
      modelViewProjection,
      camera.projectionMatrix,
      camera.viewMatrix
    );
    mat4.multiply(
      modelViewProjection, modelViewProjection, floor.modelMatrix
    );
    gl.uniformMatrix4fv(
      wrapper.modelViewProjectionUniformLocation,
      false,
      modelViewProjection
    );
    gl.uniform4f(
      wrapper.colorUniformLocation,
      1.0, 0.0, 0.0, 1.0
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(wrapper.positionAttribLocation);
  }

  private renderCrosshair(crosshair: Crosshair, camera: Camera) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    const wrapper = this.shaderService.colorProgramWrapper;
    gl.useProgram(wrapper.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, crosshair.positionBuffer);
    gl.enableVertexAttribArray(wrapper.positionAttribLocation);
    gl.vertexAttribPointer(
      wrapper.positionAttribLocation,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.uniformMatrix4fv(
      wrapper.modelViewProjectionUniformLocation,
      false,
      camera.projectionMatrix
    );
    gl.uniform4f(
      wrapper.colorUniformLocation,
      0, 0, 0, 1.0
    );
    gl.drawArrays(gl.LINES, 0, 4);
    gl.disableVertexAttribArray(wrapper.positionAttribLocation);
    gl.enable(gl.DEPTH_TEST);
  }

  private renderBox(box: Box, camera: Camera) {
    const gl = this.gl;
    const wrapper = this.shaderService.colorProgramWrapper;
    gl.useProgram(wrapper.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, box.positionBuffer);
    gl.enableVertexAttribArray(wrapper.positionAttribLocation);
    gl.vertexAttribPointer(
      wrapper.positionAttribLocation,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const modelViewProjection = mat4.create();
    mat4.multiply(
      modelViewProjection,
      camera.projectionMatrix,
      camera.viewMatrix
    );
    gl.uniformMatrix4fv(
      wrapper.modelViewProjectionUniformLocation,
      false,
      modelViewProjection
    );
    gl.uniform4f(
      wrapper.colorUniformLocation,
      0, 0, 0, 1.0
    );
    gl.drawArrays(gl.LINES, 0, 24);
    gl.disableVertexAttribArray(wrapper.positionAttribLocation);
  }

  private renderImages(images: Image[], camera: Camera) {
    const gl = this.gl;
    const wrapper = this.shaderService.texProgramWrapper;
    gl.useProgram(wrapper.program);
    gl.enableVertexAttribArray(wrapper.positionAttribLocation);
    gl.enableVertexAttribArray(wrapper.texCoordAttribLocation);

    images.forEach((img) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, img.positionBuffer);
      gl.vertexAttribPointer(
        wrapper.positionAttribLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, img.texture.texCoords);
      gl.vertexAttribPointer(
        wrapper.texCoordAttribLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, img.texture.texture);
      gl.uniform1i(wrapper.textureUniformLocation, 0);
      const modelViewProjection = mat4.create();
      mat4.multiply(
        modelViewProjection,
        camera.projectionMatrix,
        camera.viewMatrix
      );
      mat4.multiply(
        modelViewProjection, modelViewProjection, img.modelMatrix
      );
      gl.uniformMatrix4fv(
        wrapper.modelViewProjectionUniformLocation,
        false,
        modelViewProjection
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    gl.disableVertexAttribArray(wrapper.positionAttribLocation);
    gl.disableVertexAttribArray(wrapper.texCoordAttribLocation);
  }

  private resizeCanvas(camera: Camera) {
    const canvas = this.gl.canvas;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      camera.setAspectRatio(this.calculateAspectRatio());
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  private calculateAspectRatio() {
    return this.gl.canvas.width / this.gl.canvas.height;
  }
}
