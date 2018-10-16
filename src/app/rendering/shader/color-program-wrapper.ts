export interface ColorProgramWrapper {
    program: WebGLProgram;
    positionAttribLocation: number;
    modelViewProjectionUniformLocation: WebGLUniformLocation;
    colorUniformLocation: WebGLUniformLocation;
}
