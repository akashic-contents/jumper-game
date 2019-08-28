import {GameState} from "../states/GameState";
import {GroundBlock} from "./ground/GroundBlock";

export class LeftMan extends g.E {
    body: g.FilledRect;
    edge: g.Sprite;

    beforeX: number;

    private soundTimer: number = 0;

    constructor(scene: g.Scene, image: g.ImageAsset, private moveSound: g.AudioAsset) {
        super({scene});
        this.body = new g.FilledRect({
            scene,
            width: -g.game.width,
            height: g.game.height - GroundBlock.HEIGHT + 10,
            cssColor: "black",
        });
        this.edge = new g.Sprite({scene, height: g.game.height - GroundBlock.HEIGHT + 10, srcHeight: 120, src: image});
        this.append(this.body);
        this.append(this.edge);
    }

    initialize() {
        this.x = 0;
        this.beforeX = 0;
        this.soundTimer = 0;
        this.modified();
    }

    onUpdate(game: GameState) {

        if (game.isFinished) {
            if (this.x > -50) {
                this.x -= 10;
                this.modified();
            }
        } else {

            this.beforeX = this.x;
            this.x = game.leftManXByRoundProgress;
            if (this.soundTimer > 0) {
                this.soundTimer--;
            }
            if (this.x !== this.beforeX && this.soundTimer === 0) {
                this.moveSound.play();
                this.soundTimer = Math.floor(g.game.fps / 2);
            }

            this.modified();
        }
    }

}