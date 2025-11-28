/**
 * @name AdeTolomacuStereo
 * @description Stereo Plugin for Me
 * @version 1.0.0
 * @author AdeTolomacu 
 * @authorId 572516501743992872
 * @invite
 * @website https://guns.lol/adelin.adi
 */

module.exports = class LightcordStereo {
    constructor() {
        this.voiceModule = null;
    }

    start() {
        this.voiceModule = BdApi.Webpack.getModule(m => m.prototype && "setLocalVolume" in m.prototype);
        if (!this.voiceModule) return;
        
        BdApi.Patcher.before("LightcordStereo", this.voiceModule.prototype, "setLocalVolume", (thisObj) => {
            if (!thisObj || !thisObj.conn || !thisObj.conn.setTransportOptions) return;
            
            const conn = thisObj.conn;
            const setTransportOptions = conn.setTransportOptions.bind(conn);
            
            conn.setTransportOptions = (options) => {
                if (!options || typeof options !== "object") return setTransportOptions(options);
                
                Object.assign(options, {
                    audioEncoder: {
                        ...options.audioEncoder,
                        channels: 2,
                        freq: 48000,
                        rate: 512000,
                        pacsize: 960,
                    },
                    packetLossRate: 0,
                    encodingBitRate: 512000,
                });
                
                setTransportOptions(options);
            };
        });
    }

    stop() {
        BdApi.Patcher.unpatchAll("LightcordStereo");
    }
};

