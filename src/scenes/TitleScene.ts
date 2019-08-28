import {CloseButton} from "../entities/button/CloseButton";
import {JoinButton} from "../entities/button/JoinButton";
import {JumperManager} from "../entities/JumperManager";
import {PlayerManager} from "../entities/player/PlayerManager";
import {Teacher} from "../entities/Teacher";
import {ManagedScene} from "./ManagedScene";
import {SceneManager} from "./SceneManager";

export class TitleScene extends ManagedScene {

    closeButton: CloseButton;
    joinButton: JoinButton;
    infoLabel: g.Label;
    teacher: Teacher;

    constructor(
        private gameMasterId: string,
        private gameMasterName: string,
        private sceneManager: SceneManager,
        private playerManager: PlayerManager,
        private isRPGAtsumaru: boolean = false
    ) {
        super({
            game: g.game, assetIds: [
                "rule1",
                "rule2",
                "rule3",
                "rule4",
                "rule5",
                "rule6",
                "rule7",
                "rule8",
            ]
        });

        this.loaded.addOnce(() => {
            this.setup();
        });
    }

    setup() {
        const background = new g.FilledRect({
            scene: this,
            cssColor: "rgba(255,255,255,0.4)",
            width: g.game.width,
            height: g.game.height
        });

        this.teacher = new Teacher(this, [
            <g.ImageAsset>this.assets["rule1"],
            <g.ImageAsset>this.assets["rule2"],
            <g.ImageAsset>this.assets["rule3"],
            <g.ImageAsset>this.assets["rule4"],
            <g.ImageAsset>this.assets["rule5"],
            <g.ImageAsset>this.assets["rule6"],
            <g.ImageAsset>this.assets["rule7"],
            <g.ImageAsset>this.assets["rule8"]
        ]);

        this.append(background);
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Monospace, size: 30});
        const title = new g.Label({scene: this, font, text: "Jumper", fontSize: 30, textColor: "black"});
        this.append(title);

        this.infoLabel = new g.Label({
            scene: this,
            font,
            text: "参加者受付中",
            fontSize: 20,
            textColor: "black"
        });
        this.append(this.infoLabel);
        this.infoLabel.y = g.game.height - 100;

        this.closeButton = new CloseButton(this, <g.ImageAsset>g.game.assets["UI"]);
        this.joinButton = new JoinButton(this, <g.ImageAsset>g.game.assets["UI"]);

        this.closeButton.pointDown.add((e) => {
            this.onCloseButtonClick(e);
        });

        this.joinButton.pointDown.add((e) => {
            this.onJoinButtonClick(e);
        });

        this.hadSetUp = true;
        this.initialize();

        this.message.add((e) => {
            this.onMessage(e);
        });

        this.update.add(() => {
            this.mainLoop();
        });
    }

    initialize() {

        this.teacher.initialize();
        this.teacher.x = g.game.width - this.teacher.width;
        this.teacher.y = 0;
        this.teacher.modified();
        this.append(this.teacher);
        this.playerManager.initialize();

        this.joinButton.initialize();
        this.closeButton.initialize();
        this.infoLabel.text = "参加者受付中";
        this.infoLabel.invalidate();

        // 放送者は参加必須という仕様のため、手で追加する
        this.playerManager.entry(this.gameMasterId, this.gameMasterName);

        if (this.gameMasterId === g.game.selfId) {
            this.append(this.closeButton);
            this.closeButton.x = (g.game.width / 2) - (this.closeButton.width / 2);
            this.closeButton.y = g.game.height - this.closeButton.height;
        } else {
            this.append(this.joinButton);
            this.joinButton.x = (g.game.width / 2) - (this.joinButton.width / 2);
            this.joinButton.y = g.game.height - this.closeButton.height;
        }

    }

    mainLoop() {
        this.teacher.onUpdate();
    }


    join(id: string, name: string) {
        g.game.raiseEvent(new g.MessageEvent({
            message: MessageEventMessages.JOIN
        }));
    }

    onCloseButtonClick(e: g.PointDownEvent) {
        this.infoLabel.text = "close";
        this.infoLabel.invalidate();
        g.game.raiseEvent(new g.MessageEvent({
            message: MessageEventMessages.CLOSE
        }));
    }

    onJoinButtonClick(e: g.PointDownEvent) {
        if (this.joinButton.disable) {
            return;
        }
        this.join(e.player.id, e.player.name);
        this.joinButton.disable = true;
    }

    onMessage(e: g.MessageEvent) {
        switch (e.data.message) {
        case MessageEventMessages.CLOSE:
            this.sceneManager.gotoGameScene();
            break;
        case MessageEventMessages.JOIN:
            if (this.playerManager.currentPlayerCount < JumperManager.MAXIMUM_JUMPER - 1) {
                this.playerManager.entry(e.player.id, e.player.name);
            }
            this.infoLabel.text = `待機中：${this.playerManager.currentPlayerCount}（放送者含）`;
            this.infoLabel.invalidate();
            break;
        }
    }

}

enum MessageEventMessages {
    JOIN,
    CLOSE
}