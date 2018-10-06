export class Texture {
    texCoords: WebGLBuffer;

    constructor(public path: string, public image: HTMLImageElement) { }
}