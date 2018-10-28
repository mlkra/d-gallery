import { Texture } from './texture';
import { mat4, vec3, quat, vec4 } from 'gl-matrix';

export class Image {
    modelMatrix = mat4.create();
    normal: vec3;
    private u: vec3;
    private v: vec3;

    private ua: number;
    private ub: number;
    private va: number;
    private vc: number;

    constructor(
        public positionBuffer: WebGLBuffer,
        public texture: Texture,
        public position: vec3,
        scale: vec3
    ) {
        mat4.fromRotationTranslationScale(
            this.modelMatrix, quat.create(), position, scale
        );
        const p0 = vec4.fromValues(0, 0, 0, 1);
        const p1 = vec4.fromValues(0, 0, 1, 1);
        vec4.transformMat4(p0, p0, this.modelMatrix);
        vec4.transformMat4(p1, p1, this.modelMatrix);
        vec4.sub(p0, p1, p0);
        this.normal = vec3.fromValues(p0[0], p0[1], p0[2]);
        vec3.normalize(this.normal, this.normal);
        console.log(this.normal);

        this.calculateVectors();
    }

    contains(p: vec3) {
        const up = vec3.dot(this.u, p);
        const vp = vec3.dot(this.v, p);

        console.log(this.ua, up, this.ub);
        console.log(this.va, vp, this.vc);

        if ((this.ua > up && up > this.ub) && (this.va > vp && vp > this.vc)) {
            return true;
        } else {
            return false;
        }
    }

    private calculateVectors() {
        const a4 = vec4.fromValues(-1, -1, 0, 1);
        const b4 = vec4.fromValues(1, -1, 0, 1);
        const c4 = vec4.fromValues(-1, 1, 0, 1);

        vec4.transformMat4(a4, a4, this.modelMatrix);
        vec4.transformMat4(b4, b4, this.modelMatrix);
        vec4.transformMat4(c4, c4, this.modelMatrix);

        const a = vec3.fromValues(a4[0], a4[1], a4[2]);
        const b = vec3.fromValues(b4[0], b4[1], b4[2]);
        const c = vec3.fromValues(c4[0], c4[1], c4[2]);

        this.u = vec3.sub(vec3.create(), a, b);
        this.v = vec3.sub(vec3.create(), a, c);

        this.ua = vec3.dot(this.u, a);
        this.ub = vec3.dot(this.u, b);
        this.va = vec3.dot(this.v, a);
        this.vc = vec3.dot(this.v, c);
    }
}
