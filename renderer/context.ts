export const context: {
    gl: WebGLRenderingContext;
    init(canvas: HTMLCanvasElement): Promise<void>;
} = {
    gl: null,
    init: function(canvas: HTMLCanvasElement) {
        return Promise.resolve()
        .then(() => {
            // Initialize the GL context
            const gl = canvas.getContext("webgl");
            // Only continue if WebGL is available and working
            if (gl === null) {
                return Promise.reject("Unable to initialize WebGL. Your browser or machine may not support it.");
            }
            this.gl = gl;
            return Promise.resolve();
        });
    }
}