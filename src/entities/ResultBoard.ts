export class ResultBoard extends g.E {

    rankLabel: g.Label;
    scoreLabel: g.Label;


    constructor(scene: g.Scene) {
        super({scene, local: true});
        const background = new g.FilledRect({scene, width: 400, height: 90, cssColor: "white", local: true});
        background.opacity = 0.7;
        this.append(background);

        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Monospace, size: 60});
        this.rankLabel = new g.Label({scene, font, text: "1位", fontSize: 60});
        this.scoreLabel = new g.Label({scene, font, text: "m", fontSize: 20});
        this.append(this.rankLabel);
        this.scoreLabel.y = this.rankLabel.height;
        this.append(this.scoreLabel);

        this.width = background.width;
        this.height = background.height;
    }

    initialize() {
        this.opacity = 0;
        this.modified();
    }

    showResult(rank: number, score: number) {
        this.rankLabel.text = `${rank}位`;
        this.rankLabel.invalidate();
        this.scoreLabel.text = `${score}mはしった`;
        this.scoreLabel.invalidate();
        this.opacity = 1;
    }


}