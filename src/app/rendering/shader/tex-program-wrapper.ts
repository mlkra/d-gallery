export interface TexProgramWrapper {
    program: WebGLProgram;
    positionAttribLocation: number;
    texCoordAttribLocation: number;
    modelViewProjectionUniformLocation: WebGLUniformLocation;
    textureUniformLocation: WebGLUniformLocation;
}
