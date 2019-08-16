import * as core from "../core";
import * as log from "loglevel";
import { context } from "./context";
import { ParticleSystemData } from "./particle_system_data";
import { Texture } from "./texture";
import { renderData } from "./render_data";
import { Stats, stats } from "./stat";
import { initShaderProgram } from "./util_shader";

export const shaderLibs: { vert: string; frag: string }[] = [];

const normalShader = {
    vert: `
    precision lowp float;
    attribute vec2 aVertexPosition;
    attribute vec2 aVertexUV;
    attribute vec4 aVertexColor;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    varying vec2 vUV;
    varying vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0, 1.0);
      vUV = aVertexUV;
      vColor = aVertexColor;
    }
    `,
    frag: `
    precision lowp float;
    varying vec2 vUV;
    varying vec4 vColor;

    uniform vec4 uColor;

    uniform sampler2D uSampler;

    void main() {
        gl_FragColor = uColor * vColor * texture2D(uSampler, vUV);
    }
    `,
}

shaderLibs[core.MaterialType.UNDEFINED] = null;
shaderLibs[core.MaterialType.SPRITE] = normalShader;
shaderLibs[core.MaterialType.RIBBON] = normalShader;
shaderLibs[core.MaterialType.SPRITE_CONNECTED] = normalShader;

export function getGLTypeFromValueFormat(valueFormat: core.ValueFormat, gl: WebGLRenderingContext): number {
    let map = [];
    map[core.ValueFormat.UNDEFINED] = 0;
    map[core.ValueFormat.FLOAT32] = gl.FLOAT;
    map[core.ValueFormat.UINT32] = gl.UNSIGNED_INT;
    map[core.ValueFormat.UINT8] = gl.UNSIGNED_BYTE;
    return map[valueFormat];
}

export function getGLBlendEquation(blendOp: core.BlendOp, gl: WebGLRenderingContext) {
    switch (blendOp) {
        case core.BlendOp.ADD: {
            return gl.FUNC_ADD;
        }
        default: {
            return gl.FUNC_ADD;
        }
    }
}

export function getGLBlendFactor(factor: core.BlendFactor, gl: WebGLRenderingContext): number {
    let name = core.BlendFactor[factor];
    return (gl as any)[name];
}

export class Material {
    public inited: boolean;
    public matCore: core.Material;
    public shaderProgram: WebGLProgram;
    public particleSystemData: ParticleSystemData;
    protected _stats: Stats;
    public constructor() {
        this._stats = stats;
    }

    public init(materialCore: core.Material, particleSystemData: ParticleSystemData) {
        this.particleSystemData = particleSystemData;
        this.matCore = materialCore;
        this.shaderProgram = initShaderProgram(shaderLibs[materialCore.type]);
        if (this.shaderProgram) {
            this.inited = true;
        } else {
            this.inited = false;
        }
    }

    public render(cmd: core.DrawCmd) {
    }

   
}

export class MaterialSprite extends Material {
    public texture: Texture = new Texture();
    public locations: {
        aVertexPos?: number;
        avertexUV?: number;
        aVertexColor?: number;
        uProjectionMatrix?: WebGLUniformLocation;
        uModelViewMatrix?: WebGLUniformLocation;
        uColor?: WebGLUniformLocation;
        uSampler?: WebGLUniformLocation;
    } = {};

    public constructor() {
        super();
    }

    public init(materialCore: core.Material, particleSystemData: ParticleSystemData) {
        super.init(materialCore, particleSystemData);
        let gl = context.gl;
        let locations = this.locations;
        let shaderProgram = this.shaderProgram;
        if (shaderProgram) {
            locations.aVertexPos = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            locations.avertexUV = gl.getAttribLocation(shaderProgram, "aVertexUV");
            locations.aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
            locations.uProjectionMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
            locations.uModelViewMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
            locations.uColor = gl.getUniformLocation(shaderProgram, "uColor");
            locations.uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
        }
        this.texture.init({
            url: materialCore.texturePath
        });
    }

    public render(cmd: core.DrawCmd) {
        super.render(cmd);
        if (!this.inited) {
            log.warn(`The material was not initialized successfully, so it can't be used for render.`);
            return;
        }
        let gl = context.gl;
        let rData = renderData;
        let psData = this.particleSystemData;
        let modelViewMatrix = cmd.matrixModel;
        let locations = this.locations;
        let materialCore = this.matCore;
        let drawData = psData.psCore.drawData;
        let vFSizes = core.valueFormatSizes;

        //Tell WebGL vertex info and assembly info.
        gl.bindBuffer(gl.ARRAY_BUFFER, psData.vertexBuffer);
        let offset = cmd.vertexBufferByteOffset;
        let vertexInfo = drawData.vertexInfo;
        // Position
        gl.vertexAttribPointer(
            locations.aVertexPos,
            vertexInfo[0].count,
            getGLTypeFromValueFormat(vertexInfo[0].format, gl),
            false,
            drawData.vtxSize,
            offset
        );
        offset += vFSizes[vertexInfo[0].format] * vertexInfo[0].count;
        gl.enableVertexAttribArray(locations.aVertexPos);
        // UV
        gl.vertexAttribPointer(
            locations.avertexUV,
            vertexInfo[1].count,
            getGLTypeFromValueFormat(vertexInfo[1].format, gl),
            false,
            drawData.vtxSize,
            offset
        );
        offset += vFSizes[vertexInfo[1].format] * vertexInfo[1].count;
        gl.enableVertexAttribArray(locations.avertexUV);
        // Color
        gl.vertexAttribPointer(
            locations.aVertexColor,
            vertexInfo[2].count,
            getGLTypeFromValueFormat(vertexInfo[2].format, gl),
            true,
            drawData.vtxSize,
            offset
        );
        gl.enableVertexAttribArray(locations.aVertexColor);

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, psData.indexBuffer);

        //Use program
        gl.useProgram(this.shaderProgram);

        // Set the shader uniforms
        gl.uniformMatrix4fv(
            locations.uProjectionMatrix,
            false,
            rData.projectionMatrix4x4
        );
        gl.uniformMatrix4fv(
            locations.uModelViewMatrix,
            false,
            modelViewMatrix
        );
        gl.uniform4fv(
            locations.uColor,
            materialCore.color
        );

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(locations.uSampler, 0);

        gl.enable(gl.BLEND);
        gl.blendEquation(getGLBlendEquation(materialCore.blendOp, gl));
        gl.blendFunc(
            getGLBlendFactor(materialCore.srcBlendFactor, gl),
            getGLBlendFactor(materialCore.dstBlendFactor, gl),
        );

        gl.drawElements(gl.TRIANGLES, cmd.indexCount, gl.UNSIGNED_SHORT, cmd.indexOffset * core.indexSize);
        this._stats.addDrawCall();
    }
}

export type MaterialRibbon = MaterialSprite;
export const MaterialRibbon = MaterialSprite;
export type MaterialSpriteConnected = MaterialSprite;
export const MaterialSpriteConnected = MaterialSprite;

const materials: (typeof Material)[] = []
materials[core.MaterialType.UNDEFINED] = null;
materials[core.MaterialType.SPRITE] = MaterialSprite;
materials[core.MaterialType.RIBBON] = MaterialRibbon;
materials[core.MaterialType.SPRITE_CONNECTED] = MaterialSpriteConnected;

export function createMaterial(materialCore: core.Material, particleSystemData: ParticleSystemData) {
    let materialClass = materials[materialCore.type];
    if (materialClass) {
        let mat: Material = new materialClass();
        mat.init(materialCore, particleSystemData);
        return mat;
    } else {
        log.error(`The material type (${materialCore.type}) of the creating material is invalid.`);
        return null;
    }
}