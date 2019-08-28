export class Flash extends g.E {

    surface: g.FilledRect;

    sustainFrame: number;

    constructor(scene: g.Scene) {
        super({scene});

        this.surface = new g.FilledRect({scene, width: g.game.width, height: g.game.height, cssColor: "white"});
        this.append(this.surface);
        this.width = this.surface.width;
        this.height = this.surface.height;
    }

    initialize() {
        this.surface.opacity = 0;
        this.surface.modified();
    }


    doFlash(sustainFrame: number = 30) {
        this.sustainFrame = sustainFrame;
        this.surface.opacity = 1;
        this.surface.modified();
    }


    onUpdate() {
        if (this.surface.opacity > 0) {
            this.surface.opacity -= (1 / this.sustainFrame);
            if (this.surface.opacity < 0) {
                this.surface.opacity = 0;
            }
            this.surface.modified();
        }
    }


}