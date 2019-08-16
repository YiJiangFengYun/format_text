import * as core from "../core";
import * as glMatrix from "gl-matrix";

export interface RenderData {
    projectionMatrix: core.Matrix;
    projectionMatrix4x4: glMatrix.mat4;
    clearColor: core.Color;
    viewBounds: core.Bounds;
    showBounds: boolean;
}

export const renderData: RenderData = {
    projectionMatrix: core.Matrix.create(),
    projectionMatrix4x4: glMatrix.mat4.create(),
    clearColor: core.Color.create(),
    viewBounds: core.Bounds.create(),
    showBounds: true,
};