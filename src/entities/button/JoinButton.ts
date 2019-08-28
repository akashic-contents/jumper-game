export class JoinButton extends g.E {


    surface: g.FrameSprite;

    private disabled: boolean = false;

    constructor(scene: g.Scene, UIImage: g.ImageAsset) {
        super({scene, touchable: true, local: true});

        this.surface = new g.FrameSprite({
            scene,
            srcWidth: 96,
            srcHeight: 48,
            frames: [1],
            src: UIImage,
            width: 144,
            height: 72
        });
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Monospace, size: 100});

        this.append(this.surface);

        this.width = this.surface.width;
        this.height = this.surface.height;
    }

    initialize() {
        this.surface.frames = [1];
        this.disabled = false;
        this.surface.modified();
    }

    get disable(): boolean {
        return this.disabled;
    }

    set disable(flag: boolean) {
        this.disabled = flag;

        if (!this.disabled) {
            this.initialize();
        } else {
            this.surface.frames = [2];
            this.surface.modified();
        }
        this.modified();
    }


}