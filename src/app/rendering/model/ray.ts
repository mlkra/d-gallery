import { vec3 } from 'gl-matrix';

export class Ray {

    constructor(
        public start: vec3,
        public direction: vec3
    ) { }

    intersect(p0: vec3, n: vec3) {
        let de = vec3.dot(n, this.direction);
        if (de > 1e-6) {
            const d = vec3.create();
            vec3.sub(d, p0, this.start);
            const t = vec3.dot(d, n) / de;
            if (t >= 0) {
                return vec3.add(
                    vec3.create(),
                    this.start,
                    vec3.scale(vec3.create(), this.direction, t)
                );
            }
        }
        vec3.negate(n, n);
        de = vec3.dot(n, this.direction);
        if (de > 1e-6) {
            const d = vec3.create();
            vec3.sub(d, p0, this.start);
            const t = vec3.dot(d, n) / de;
            if (t >= 0) {
                return vec3.add(
                    vec3.create(),
                    this.start,
                    vec3.scale(vec3.create(), this.direction, t)
                );
            }
        }
        return null;
    }
}
