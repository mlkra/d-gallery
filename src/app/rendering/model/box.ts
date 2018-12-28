export class Box {
    positionBuffer: WebGLBuffer

    constructor(gl: WebGLRenderingContext) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -15, -15, -15,
            +20, -15, -15,
            -15, -15, -15,
            -15, +20, -15,
            -15, -15, -15,
            -15, -15, +30,
            +20, -15, -15,
            +20, +20, -15,
            +20, -15, -15,
            +20, -15, +30,
            -15, +20, -15,
            +20, +20, -15,
            -15, +20, -15,
            -15, +20, +30,
            +20, +20, -15,
            +20, +20, +30,
            -15, -15, +30,
            +20, -15, +30,
            -15, -15, +30,
            -15, +20, +30,
            +20, +20, +30,
            -15, +20, +30,
            +20, +20, +30,
            +20, -15, +30
        ]), gl.STATIC_DRAW);
    }
}