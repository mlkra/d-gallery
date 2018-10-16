import { Texture } from "./texture";
import { mat4, vec3, quat } from "gl-matrix";

export class Image {
    modelMatrix = mat4.create();

    constructor(
        public positionBuffer: WebGLBuffer,
        public texture: Texture,
        public position: vec3,
        scale: vec3
    ) {
        mat4.fromRotationTranslationScale(this.modelMatrix, quat.create(), position, scale);
    }
}