import {CoolDownBar} from "./button/CooldownBar";

export class Teacher extends g.E {
    static IMAGE_SHOW_FRAME = 240;

    surfaces: g.Sprite[] = [];
    bar: CoolDownBar;

    currentSurfaceIndex: number = 0;

    constructor(scene: g.Scene, ruleImages: g.ImageAsset[]) {
        super({scene});

        ruleImages.forEach((image) => {
            const sprite = new g.Sprite({scene, src: image});
            this.surfaces.push(sprite);
            this.append(sprite);
        });

        this.width = this.surfaces[0].width;
        this.height = this.surfaces[0].height;

        this.bar = new CoolDownBar({
            scene,
            width: this.width,
            height: 20,
            cssColor: "rgba(0,0,0,0.3)"
        }, Teacher.IMAGE_SHOW_FRAME);
        this.append(this.bar);
    }

    initialize() {
        this.currentSurfaceIndex = 0;
        this.bar.initialize();
        this.bar.current = Teacher.IMAGE_SHOW_FRAME;
        this.surfaces.forEach((surface) => {
            surface.opacity = 0;
        });
        this.surfaces[0].opacity = 1.0;
    }

    onUpdate() {
        if (this.currentSurfaceIndex >= this.surfaces.length) {
            return;
        }
        this.bar.onUpdate();
        if (this.bar.current === 0) {
            this.bar.current = Teacher.IMAGE_SHOW_FRAME;
            this.surfaces[this.currentSurfaceIndex].opacity = 0;
            this.currentSurfaceIndex++;
            this.currentSurfaceIndex %= this.surfaces.length;
            this.surfaces[this.currentSurfaceIndex].opacity = 1;

        }
    }

}