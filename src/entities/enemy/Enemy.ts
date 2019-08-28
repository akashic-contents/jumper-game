import {Jumper} from "../Jumper";

export class Enemy extends g.E {
    static JUSTZONE_FRAME: number = 6;

    surface: g.FrameSprite;
    private previewBar: PreviewBar;

    normalZone: number;
    justZone: number;

    isDead: boolean = true;

    constructor(scene: g.Scene, image: g.ImageAsset, public type: EnemyType) {
        super({scene});
        this.surface = new g.FrameSprite({
            scene,
            src: image,
            frames: [this.type],
            width: 64,
            height: 64,
            srcHeight: 48,
            srcWidth: 48
        });
        this.append(this.surface);
        this.width = this.surface.width;
        this.height = this.surface.height;
        this.previewBar = new PreviewBar(scene);
        this.append(this.previewBar);
    }

    initialize() {
        this.x = 900;
        this.y = 0;
        this.modified();
        this.hidePreview = false;
        this.isDead = true;
    }

    pop(x: number, y: number, speed: number, showPreviewBar: boolean = true) {
        this.x = x;
        this.y = y;
        this.hidePreview = !showPreviewBar;

        this.justZone = speed * Enemy.JUSTZONE_FRAME;
        this.normalZone = speed * Jumper.JUMP_FRAME - this.width - 20; // FIXME: この20は適当。Jumperの当たり判定の幅分が望ましい

        this.previewBar.initialize(this.normalZone, this.justZone);
        this.previewBar.y = this.height - (this.previewBar.height / 2);
        this.modified();

        this.isDead = false;
    }

    set hidePreview(flag: boolean) {
        this.previewBar.hidden = flag;
        this.modified();
    }

    onUpdate(speed: number) {
        if (this.isDead) {
            return;
        }
        this.x -= speed;
        this.modified();

        if (this.x < -this.width) {
            this.isDead = true;
        }
    }

    kill(): void {
        this.isDead = true;
        this.scene.remove(this);
    }

}

class PreviewBar extends g.E {
    nomalBar: g.FilledRect;
    justBar: g.FilledRect;


    constructor(scene: g.Scene) {
        super({scene});
        this.justBar = new g.FilledRect({scene: scene, width: 10, height: 10, cssColor: "lightgreen"});
        this.nomalBar = new g.FilledRect({scene: scene, width: 10, height: 10, cssColor: "yellow"});
        this.append(this.justBar);
        this.append(this.nomalBar);
    }

    initialize(normalZoneLength: number, justZoneLength: number) {
        this.justBar.width = normalZoneLength + justZoneLength;
        this.nomalBar.width = normalZoneLength;
        this.nomalBar.modified();
        this.justBar.modified();
        this.width = this.justBar.width;
        this.height = this.justBar.height;
        this.x = -this.width;
        this.y = -this.height;
        this.modified();
    }

    set hidden(flag: boolean) {
        this.justBar.opacity = (flag) ? 0 : 1;
        this.justBar.modified();
        this.nomalBar.opacity = (flag) ? 0 : 1;
        this.nomalBar.modified();
    }
}


export enum EnemyType {
    LOW,
    MIDDLE
}