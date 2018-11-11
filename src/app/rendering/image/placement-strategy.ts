import { vec3 } from "gl-matrix";

export interface PlacementStrategy {

    getPosition(): vec3;
}
