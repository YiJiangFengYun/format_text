import * as glMatrix from "gl-matrix";
import * as core from "../core";
import { ParticleSystem } from "./particle_system";
import { context } from "./context";
import { renderData } from "./render_data";
import { stats } from "./stat";
import { emitterBoundsOutline } from "./emitter_bounds_outline";

export interface RendererInfo {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    depth?: number;
    clearColor?: { r: number; g: number; b: number; a: number; }
    frameRate?: number;
}

export class Renderer {
    public particleSystems: ParticleSystem[] = [];

    public constructor() {
    }

    public init(info: RendererInfo) {
        return context.init(info.canvas)
            .then(() => {
                let rD = renderData;
                let projectionMatrix = rD.projectionMatrix;
                let projectionMatrix4x4 = rD.projectionMatrix4x4;
                core.Matrix4x4.identity(projectionMatrix4x4);
                core.Matrix.fromScaling(
                    projectionMatrix,
                    [2 / info.width || 2, 2 / info.height || 2],
                );
                glMatrix.mat4.fromScaling(
                    projectionMatrix4x4,
                    [2 / (info.width || 2), 2 / (info.height || 2), 2 / (info.depth || 2)],
                );
                let infoClearColor = info.clearColor;
                if (info.clearColor) {
                    glMatrix.vec4.copy(
                        rD.clearColor,
                        [infoClearColor.r, infoClearColor.g, infoClearColor.b, infoClearColor.a],
                    );
                }

                let wHalf = info.width / 2;
                let hHalf = info.height / 2;

                core.Bounds.set(rD.viewBounds, -wHalf, -hHalf, wHalf, hHalf);

                stats.init(info.frameRate);
            })
            .then(() => {
                return emitterBoundsOutline.init();
            });

    }

    public addParticleSystem(ps: ParticleSystem) {
        let index = this.particleSystems.indexOf(ps);
        if (index < 0) {
            this.particleSystems.push(ps);
        }
    }

    public removeParticleSystem(ps: ParticleSystem) {
        let index = this.particleSystems.indexOf(ps);
        if (index >= 0) {
            this.particleSystems.splice(index, 1);
        }
    }

    public begin() {
        stats.begin();
    }

    public update(dt: number) {
        this.particleSystems.forEach(ps => {
            ps.update(dt);
        });
    }

    public render() {
        let gl = context.gl;
        let rData = renderData;
        let clearColor = rData.clearColor;
        gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        // gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        // gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.particleSystems.forEach(ps => {
            ps.render();
        });
    }

    public end() {
        stats.end();
    }
}

export const renderer = new Renderer();