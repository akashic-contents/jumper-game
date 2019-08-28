export class CloseButton extends g.E {


    surface: g.FrameSprite;

    disabled: boolean;

    constructor(scene: g.Scene, UIImage: g.ImageAsset) {
        super({scene, touchable: true, local: true});

        this.surface = new g.FrameSprite({
            scene,
            srcWidth: 96,
            srcHeight: 48,
            frames: [0],
            src: UIImage,
            width: 144,
            height: 72
        });


        this.append(this.surface);

        this.width = this.surface.width;
        this.height = this.surface.height;
    }

    initialize() {
        this.disabled = false;
        this.modified();
    }

    set disable(flag: boolean) {
        this.disabled = flag;

        if (!this.disabled) {
            this.initialize();
        }
        this.modified();

    }
}