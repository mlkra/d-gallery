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
        vec3.scaleAndAdd(this.eye, this.eye, vecStep, step);
        vec3.scaleAndAdd(this.center, this.center, vecStep, step);
        mat4.lookAt(this.viewMatrix, this.eye, this.center, this.up);
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
