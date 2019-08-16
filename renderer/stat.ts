export interface Stats {
    /**
     * The average count of draw call of a frame.
     */
    drawCall: number;

    /**
     * The average cost time (ms) of a frame.
     */
    costTime: number;

    drawCallBuffer: number[];
    drawCallBufferIndex: number;

    costTimeBuffer: number[];
    costTimeBufferIndex: number;

    /**
     * The count of draw call of a frame.
     */
    drawCallFrame: number;

    /**
     * The cost time (ms) of a frame.
     */
    costTimeFrame: number;

    /**
     * The begin time of a frame.
     */
    beginTime: number;

    init(frameRate: number): void;

    /**
     * Calling this function means a frame begin.
     * It will clear all statistics of a frame for a new begin.
     */
    begin(): void;

    /**
     * Calling this function means a frame end.
     * It will caculate the cost time of a frame.
     * It will use the statistics of a frame to cacluate the relevant avarage result.
     */
    end(): void;

    /**
     * When renderer call WebGL draw, it call this function to add a draw call to the count of draw call.
     */
    addDrawCall(): void;

}

export const stats: Stats = {
    drawCall: 0,

    costTime: 0,

    drawCallBuffer: [],
    drawCallBufferIndex: 0,

    costTimeBuffer: [],
    costTimeBufferIndex: 0,

    drawCallFrame: 0,

    costTimeFrame: 0,

    beginTime: 0,

    init: function(frameRate: number) {
        let bufferLen = Math.round(frameRate);
        stats.costTimeBuffer.length = bufferLen;
        stats.drawCallBuffer.length = bufferLen;
        stats.costTimeBufferIndex = 0;
        stats.drawCallBufferIndex = 0;
    },
    
    begin: function() {
        stats.drawCallFrame = 0;
        stats.costTimeFrame = 0;
        stats.beginTime = new Date().getTime();
    },

    end: function() {
        // Get cost time of a frame.
        let now = new Date().getTime();
        stats.costTimeFrame = now - stats.beginTime;

        // Get the avarage values
        let costTimeBuffer = stats.costTimeBuffer;
        let drawCallBuffer = stats.drawCallBuffer;
        costTimeBuffer[stats.costTimeBufferIndex % costTimeBuffer.length] = stats.costTimeFrame;
        drawCallBuffer[stats.drawCallBufferIndex % drawCallBuffer.length] = stats.drawCallFrame;
        ++stats.costTimeBufferIndex;
        ++stats.drawCallBufferIndex;

        let len = Math.min(stats.costTimeBufferIndex, costTimeBuffer.length);
        let total = 0;
        for (let i = 0; i < len; ++i) {
            total += costTimeBuffer[i];
        }
        stats.costTime = total / len;

        len = Math.min(stats.drawCallBufferIndex, drawCallBuffer.length);
        total = 0;
        for (let i = 0; i < len; ++i) {
            total += drawCallBuffer[i];
        }
        stats.drawCall = Math.round(total / len);
    },

    addDrawCall: function() {
        stats.drawCallFrame += 1;
    }
}