import {CoolDownBar} from "./CooldownBar";

declare var window: any;

export class JumpButton extends g.E {
    static COOLDOWN_FRAME: number = 35;

    surface: g.FrameSprite;
    cooldownBar: CoolDownBar;

    constructor(scene: g.Scene, image: g.ImageAsset) {
        super({scene: scene, local: true, touchable: true});

        this.surface = new g.FrameSprite({
            scene,
            src: image,
            srcHeight: 48,
            srcWidth: 48,
            frames: [12],
            height: 64,
            width: 64
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
            this.surface.frames = [13];
            this.surface.modified();
        }
        this.cooldownBar.onUpdate();
        if (this.cooldownBar.current <= 0 && this.surface.frames[0] === 13) {
            this.surface.frames = [12];
            this.surface.modified();
        }
    }

    initialize() {
        this.cooldownBar.initialize();
    }


}


