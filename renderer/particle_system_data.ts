import * as core from "../core";
import { context } from "./context";

export class ParticleSystemData {
    public psCore: core.ParticleSystem = new core.ParticleSystem();
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;

    public init(info: core.ParticleSystemInfo) {
        let psCore = this.psCore;
        //Initialize the core particle system.
        psCore.init(info);

        //Initialize the buffers from the draw data of the particle system.
        this._initBuffers();
    }

    public changePos(pos: core.Vector) {
        this.psCore.data.setPosition(pos);
    }

    public refreshBuffers() {
        this._refreshBuffers();
    }

    //
    // initBuffers
    //
    private _initBuffers() {
        let gl = context.gl;
        let drawData = this.psCore.drawData;

        //Vertex buffer.
        const vertexBuffer = gl.createBuffer();
        this.vertexBuffer = vertexBuffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


        gl.bufferData(gl.ARRAY_BUFFER, drawData.vtxBuffer, gl.DYNAMIC_DRAW);

        //Index buffer
        const indexBuffer = gl.createBuffer();
        this.indexBuffer = indexBuffer;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawData.idxBuffer, gl.DYNAMIC_DRAW);

    }

    private _refreshBuffers() {
        let gl = context.gl;
        let drawData = this.psCore.drawData;
        if (drawData.totalIdxCount > 0) {
            //Vertex buffer.
            let vertexBuffer = this.vertexBuffer;
    
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    
            gl.bufferData(gl.ARRAY_BUFFER, drawData.vtxBuffer, gl.DYNAMIC_DRAW);
    
            //Index buffer
            let indexBuffer = this.indexBuffer;
    
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawData.idxBuffer, gl.DYNAMIC_DRAW);
        }
    }
}