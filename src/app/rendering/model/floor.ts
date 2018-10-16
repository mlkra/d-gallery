import { mat4 } from 'gl-matrix';

export class Floor {
    positionBuffer: WebGLBuffer;
    modelMatrix = mat4.create();

    constructor(gl: WebGLRenderingContext) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -32, -1, -32,
            +32, -1, -32,
            -32, -1, +32,
            +32, -1, +32
        ]), gl.STATIC_DRAW);
    }
}
