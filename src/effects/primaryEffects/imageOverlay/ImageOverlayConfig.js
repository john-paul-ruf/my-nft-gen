import { EffectConfig } from 'my-nft-gen';

export class ImageOverlayConfig extends EffectConfig {
    constructor(
        {
            folderName = '/imageOverlay/',
            layerOpacity = [0.95],
            buffer = [555],
        },
    ) {
        super();
        this.folderName = folderName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
    }
}
