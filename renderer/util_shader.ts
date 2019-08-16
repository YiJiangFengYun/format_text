import * as log from "loglevel";
import { context } from "./context";

export  function initShaderProgram(src: {
    vert: string; frag: string
}) {
    let gl = context.gl;

    const vertexShader = loadShader(gl.VERTEX_SHADER, src.vert);
    if (!vertexShader) return null;

    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, src.frag);
    if (!fragmentShader) return null;

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, return null

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        log.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
export function loadShader(type: number, source: string) {
    let gl = context.gl;
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        log.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}