import { glMatrix, vec3, mat4 } from 'gl-matrix';
import { Ray } from './ray';

const toRadian = glMatrix.toRadian;

export class Camera {
    projectionMatrix = mat4.create();
    viewMatrix = mat4.create();

    private up = vec3.fromValues(0, 1, 0);
    private center = vec3.create();
    private front = vec3.create();
    private right = vec3.create();
    // TODO reset to 0?
    private yaw = 90;
    private pitch = 0;
    private box = {
        min: vec3.fromValues(-15, -15, -15),
        max: vec3.fromValues(20, 20, 30),
    };

    constructor(
        private eye: vec3,
        private fov: number,
        aspectRatio: number,
        private nearPlane: number,
        private farPlane: number
    ) {
        this.calculateViewMatrix();
        mat4.perspective(
            this.projectionMatrix,
            fov, aspectRatio,
            nearPlane, farPlane
        );
    }

    setAspectRatio(aspectRation: number) {
        mat4.perspective(
            this.projectionMatrix,
            this.fov, aspectRation,
            this.nearPlane, this.farPlane
        );
    }

    moveX(step: number) {
        const vecStep = vec3.clone(this.right);
        this.move(vecStep, step);
    }

    moveY(step: number) {
        const vecStep = vec3.clone(this.up);
        vec3.normalize(vecStep, vecStep);
        this.move(vecStep, step);
    }

    moveZ(step: number) {
        const vecStep = vec3.clone(this.front);
        vecStep[1] = 0;
        vec3.normalize(vecStep, vecStep);
        this.move(vecStep, step);
    }

    rotateY(step: number) {
        this.yaw += step;
        this.yaw %= 360;
        this.calculateViewMatrix();
    }

    rotateX(step: number) {
        this.pitch += step;

        if (this.pitch > 45) {
            this.pitch = 45;
        } else if (this.pitch < -45) {
            this.pitch = -45;
        }

        this.calculateViewMatrix();
    }

    getRay(): Ray {
        return new Ray(this.eye, this.front);
    }

    private move(vecStep: vec3, step: number) {
        const e = vec3.create();
        const c = vec3.create();
        vec3.scaleAndAdd(e, this.eye, vecStep, step);
        vec3.scaleAndAdd(c, this.center, vecStep, step);
        if (this.checkValid(e)) {
            this.eye = e;
            this.center = c;
            mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up);
        }
    }

    private checkValid(e: vec3) {
        const mi = this.box.min;
        const ma = this.box.max;
        if (e[0] < mi[0] || e[1] < mi[1] || e[2] < mi[2] ||
            e[0] > ma[0] || e[1] > ma[1] || e[2] > ma[2]) {
            return false;
        } else {
            return true;
        }
    }

    private calculateViewMatrix() {
        this.front[0] =
            Math.cos(toRadian(this.pitch)) * Math.cos(toRadian(this.yaw));
        this.front[1] = Math.sin(toRadian(this.pitch));
        this.front[2] =
            Math.cos(toRadian(this.pitch)) * Math.sin(toRadian(this.yaw));
        vec3.normalize(this.front, this.front);
        vec3.cross(this.right, this.up, this.front);
        vec3.normalize(this.right, this.right);
        vec3.add(this.center, this.eye, this.front);

        mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up);
    }
}
