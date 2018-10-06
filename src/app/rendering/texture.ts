export class Texture {
    texture: WebGLTexture;
    texCoords: WebGLBuffer;

    constructor(public path: string, public image: HTMLImageElement) { }
}