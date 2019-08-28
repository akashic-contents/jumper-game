export class Background extends g.E {

    sky: g.FilledRect;

    constructor(scene: g.Scene) {
        super({scene});
        this.sky = new g.FilledRect({scene, width: g.game.width, height: g.game.height, cssColor: "lightcyan"});
        this.append(this.sky);
    }

}