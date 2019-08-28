export class CoolDownBar extends g.E {
    current: number;

    maxWidth: number;

    surface: g.FilledRect;

    constructor(param: g.FilledRectParameterObject, public max: number) {
        super(param);
        this.surface = new g.FilledRect(param);
        this.maxWidth = param.width;
        this.append(this.surface);

    }

    initialize() {
        this.current = 0;
        this.updateWidth();
    }

    onUpdate() {
        if (this.current > 0) {
            this.current--;
        }

        this.updateWidth();
    }

    updateWidth() {
        this.surface.width = (this.current / this.max) * this.maxWidth;
        this.width = this.surface.width;
        this.modified();
    }


}
