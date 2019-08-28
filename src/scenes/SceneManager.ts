import {PlayerManager} from "../entities/player/PlayerManager";
import {GameScene} from "./GameScene";
import {TitleScene} from "./TitleScene";

export class SceneManager {

    titleScene: TitleScene;
    gameScene: GameScene;
    playerManager: PlayerManager;

    constructor(gameMasterId: string, gameMasterName: string) {
        this.playerManager = new PlayerManager();

        this.titleScene = new TitleScene(gameMasterId, gameMasterName, this, this.playerManager);
        this.gameScene = new GameScene(gameMasterId, gameMasterName, this, this.playerManager);

        g.game.replaceScene(this.titleScene);
    }

    gotoTitleScene() {
        g.game.replaceScene(this.titleScene, true);
    }

    gotoGameScene() {
        g.game.replaceScene(this.gameScene, true);
    }


}


