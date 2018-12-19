import { mat4 } from "gl-matrix";

export class Crosshair {
    positionBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -0.1, +0, -5,
            +0.1, +0, -5,
            +0, -0.1, -5,
            +0, +0.1, -5
        ]), gl.STATIC_DRAW);
    }
}