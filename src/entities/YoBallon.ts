export class YoBallon extends g.E {
    static DISPLAY_FRAME = 90;
    surface: g.FrameSprite;

    displayFrame: number;

    constructor(scene: g.Scene, image: g.ImageAsset) {
        super({scene});
        this.surface = new g.FrameSprite({
            scene,
            src: image,
            srcHeight: 48,
            srcWidth: 48,
            frames: [0],
            width: 48,
            height: 64
        });
        this.append(this.surface);
        this.width = this.surface.width;
        this.height = this.surface.height;
    }

    initialize() {
        this.displayFrame = 0;
        this.opacity = 0;
        this.modified();
    }

    show() {
        this.displayFrame = YoBallon.DISPLAY_FRAME;
        this.opacity = 1;
        this.modified();
    }

    hide() {
        this.displayFrame = 0;
        this.opacity = 0;
        this.modified();
    }

    onUpdate() {
        if (this.displayFrame > 0) {
            this.displayFrame--;
            if (this.displayFrame <= 0) {
                this.hide();
            }
        }
    }

}