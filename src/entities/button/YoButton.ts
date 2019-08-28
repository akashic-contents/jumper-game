import {CoolDownBar} from "./CooldownBar";

export class YoButton extends g.E {
    static COOLDOWN_FRAME: number = 210;

    surface: g.FrameSprite;
    cooldownBar: CoolDownBar;

    constructor(scene: g.Scene, UIImage: g.ImageAsset) {
        super({scene, local: true, touchable: true});

        this.surface = new g.FrameSprite({
            scene,
            src: UIImage,
            srcWidth: 48,
            srcHeight: 48,
            height: 64,
            width: 64,
            frames: [14]
        });

        this.append(this.surface);
        this.width = this.surface.width;
        this.height = this.surface.height;

        this.cooldownBar = new CoolDownBar({
            scene: scene,
            width: this.width,
            height: 10,
            cssColor: "white",
            local: true
        }, g.game.fps * 1.5);
        this.append(this.cooldownBar);
        this.cooldownBar.y = this.surface.height - this.cooldownBar.height;
    }

    get isClickable(): boolean {
        return this.cooldownBar.current <= 0;
    }

    set coolDown(frame: number) {
        this.cooldownBar.max = frame;
        this.cooldownBar.current = frame;
    }

    onUpdate() {
        if (this.cooldownBar.max === this.cooldownBar.current) {
            this.surface.frames = [15];
            this.surface.modified();
        }
        this.cooldownBar.onUpdate();
        if (this.cooldownBar.current <= 0 && this.surface.frames[0] === 15) {
            this.surface.frames = [14];
            this.surface.modified();
        }
    }

    initialize() {
        this.cooldownBar.initialize();
    }
}