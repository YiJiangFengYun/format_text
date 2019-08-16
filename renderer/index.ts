import * as core from "../core";
import { renderer, RendererInfo } from "./renderer";

let r = renderer;

export function init(info: RendererInfo) {
    return Promise.resolve()
    .then(() => {
        return core.init();
    })
    .then(() => {
        return r.init(info)
        .then(() => {
            return r;
        });
    });
}

export { ParticleSystem } from "./particle_system";
export { Renderer } from "./renderer";