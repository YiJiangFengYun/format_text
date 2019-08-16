import { context } from "./context";


export class Texture {

    public glTexture: WebGLTexture;

    public constructor() {
        this._createTexture();
    }

    public init(info: {
        url?: string
    }) {
        this._loadTexture(info.url);
    }

    private _createTexture() {
        let gl = context.gl;
        let texture = this.glTexture;
        if (! texture) 
            this.glTexture = texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Initialize the default pixels and size.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([255, 255, 255, 255]);  // whilte
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);
    }

    private _loadTexture(url: string) {
        if (url) {
            let gl = context.gl;
            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            let texture = this.glTexture;
            const image = new Image();
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                
                // Other texture parameters use they default values.
            };
            image.src = url;
        }

        function isPowerOf2(value: number) {
            return (value & (value - 1)) == 0;
        }
    }
}