export class ScoreBoard extends g.E {
    maxJumpers: number;

    // invalidate()やるやら判断するためのキャッシュ的値
    livingJumpers: number;
    score: number;

    playerCountLabel: g.Label;
    scoreLabel: g.Label;

    constructor(scene: g.Scene) {
        super({scene});

        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Monospace, size: 30});
        this.playerCountLabel = new g.Label({scene, font, text: "0/0", fontSize: 30, textColor: "black"});
        this.scoreLabel = new g.Label({scene, font, text: "0m", fontSize: 15, textColor: "black"});
        const background = new g.FilledRect({scene, width: 150, height: 50, cssColor: "white"});

        this.append(background);
        this.append(this.playerCountLabel);
        this.append(this.scoreLabel);
        this.scoreLabel.y = 30;
        this.width = background.width;
        this.height = background.height;

    }

    initialize(maxJumpers: number) {

        this.maxJumpers = maxJumpers;
        this.livingJumpers = maxJumpers;
        this.updatePlayerCountLabel(maxJumpers);

        this.score = 0;


    }

    onUpdate(livingJumpers: number, score: number) {
        if (livingJumpers !== this.livingJumpers) {
            this.livingJumpers = livingJumpers;
            this.updatePlayerCountLabel(livingJumpers);
        }

        if (score !== this.score) {
            this.score = score;
            this.updateScoreLabel(score);
        }
    }

    updatePlayerCountLabel(count: number) {
        this.playerCountLabel.text = `${count}/${this.maxJumpers}`;
        this.playerCountLabel.invalidate();
    }

    updateScoreLabel(score: number) {
        this.scoreLabel.text = `${score}mはしった`;
        this.scoreLabel.invalidate();
    }
}