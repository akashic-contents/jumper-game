import {GameState} from "../states/GameState";

export class RoundTimer extends g.E {

    private roundLabel: g.Label;
    private timerLabel: g.Label;

    constructor(scene: g.Scene) {
        super({scene});
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Monospace, size: 30});
        this.timerLabel = new g.Label({scene, font, text: "0", fontSize: 30, textColor: "black"});
        this.roundLabel = new g.Label({scene, font, text: "Round 0", fontSize: 30, textColor: "black"});
        this.timerLabel.y = 30;
        const background = new g.FilledRect({scene, width: this.roundLabel.width, height: 64, cssColor: "white"});
        this.append(background);
        this.append(this.timerLabel);
        this.append(this.roundLabel);
    }

    onUpdate(state: GameState) {

        if (state.isFinished) {
            if (this.y > -100) {
                this.y -= 10;
                this.modified();
            }

            return;
        }


        const sec = Math.floor((state.timer / g.game.fps) * 10) / 10;
        if (Math.round(sec) === sec) { // 整数の時に少数第一位相当の.0を追加
            this.timerLabel.text = "" + sec + ".0";
        } else {
            this.timerLabel.text = "" + sec;
        }
        this.timerLabel.invalidate();

        this.roundLabel.text = `Round ${state.currentRoundIndex}`;
        this.roundLabel.invalidate();

        this.width = this.roundLabel.width;

    }
}