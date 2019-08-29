import {Background} from "../entities/Background";
import {JumpButton} from "../entities/button/JumpButton";
import {YoButton} from "../entities/button/YoButton";
import {EnemyType} from "../entities/enemy/Enemy";
import {EnemyManager} from "../entities/enemy/EnemyManager";
import {Ground} from "../entities/ground/Ground";
import {HitCheckResultType, Jumper} from "../entities/Jumper";
import {JumperManager} from "../entities/JumperManager";
import {LeftMan} from "../entities/LeftMan";
import {AIPlayerFactory} from "../entities/player/AIPlayerFactory";
import {PlayerManager} from "../entities/player/PlayerManager";
import {RankTable} from "../entities/RankTable";
import {ResultBoard} from "../entities/ResultBoard";
import {RoundTimer} from "../entities/RoundTimer";
import {ScoreBoard} from "../entities/ScoreBoard";
import {Flash} from "../Flash";
import {GameState, GameStatus} from "../states/GameState";
import {ManagedScene} from "./ManagedScene";
import {SceneManager} from "./SceneManager";
import MessageEvent = g.MessageEvent;

export class GameScene extends ManagedScene {
    gameState: GameState;
    background: Background;
    ground: Ground;
    leftMan: LeftMan;
    enemyManager: EnemyManager;
    jumperManager: JumperManager;
    jumpButton: JumpButton;
    yoButton: YoButton;
    roundTimer: RoundTimer;

    aiPlayerFactory: AIPlayerFactory;

    rankTable = new RankTable();

    scoreBoard: ScoreBoard;
    resultBoard: ResultBoard;
    flashEffect: Flash;

    localJumper: Jumper | undefined;

    enemyPopCoolDownTime: number = 0;

    constructor(
        private gameMasterId: string,
        private gameMasterName: string,
        private sceneManager: SceneManager,
        private playerManager: PlayerManager,
        private isRPGAtsumaru: boolean = false
    ) {
        super({
            game: g.game,
            assetIds: [
                "jumper",
                "alarm",
                "jump",
                "hit",
                "leftman",
                "ground",
                "left",
                "enemy",
                "yo"
            ]
        });

        this.aiPlayerFactory = new AIPlayerFactory();

        this.loaded.addOnce(() => {
            this.setup();
        });
    }

    // 初回の処理。sceneが作られてから一度しか呼ばれない
    setup() {
        this.background = new Background(this);
        this.scoreBoard = new ScoreBoard(this);
        this.resultBoard = new ResultBoard(this);

        this.flashEffect = new Flash(this);

        this.jumpButton = new JumpButton(this, <g.ImageAsset>g.game.assets["UI"]);
        this.yoButton = new YoButton(this, <g.ImageAsset>g.game.assets["UI"]);
        this.roundTimer = new RoundTimer(this);
        this.enemyManager = new EnemyManager(this, <g.ImageAsset>this.assets["enemy"]);


        this.gameState = new GameState(<g.AudioAsset>this.assets["alarm"]);
        this.jumperManager = new JumperManager(
            this,
            <g.ImageAsset>this.assets["jumper"],
            <g.AudioAsset>this.assets["jump"],
            this.playerManager,
            this.aiPlayerFactory,
            <g.ImageAsset>this.assets["yo"]
        );
        this.leftMan = new LeftMan(this, <g.ImageAsset>this.assets["left"], <g.AudioAsset>this.assets["leftman"]);
        this.ground = new Ground(this, <g.ImageAsset>this.assets["ground"]);
        this.ground.setup();
        this.enemyManager.setup();

        this.jumpButton.pointDown.add((e) => {
            this.onJumpButtonClick(e);
        });
        this.yoButton.pointDown.add((e) => {
            this.onYoButtonClick(e);
        });

        this.update.add(() => {
            this.mainLoop();
        });
        this.message.add((e: MessageEvent) => {
            this.onMessage(e);
        });
        this.hadSetUp = true;

        this.initialize();
    }

    initialize() {
        this.rankTable.initialize(JumperManager.MAXIMUM_JUMPER + 1);
        this.scoreBoard.initialize(JumperManager.MAXIMUM_JUMPER + 1);
        this.scoreBoard.x = g.game.width - this.scoreBoard.width;
        this.resultBoard.initialize();
        this.resultBoard.x = (g.game.width / 2) - (this.resultBoard.width / 2);
        this.resultBoard.y = (g.game.height / 2) - (this.resultBoard.height / 2);
        this.resultBoard.modified();

        this.flashEffect.initialize();

        this.localJumper = undefined;

        this.gameState.initialize();

        this.roundTimer.x = g.game.width / 2 - 50;
        this.roundTimer.y = 10;
        this.roundTimer.modified();
        this.enemyPopCoolDownTime = 0;
        this.ground.initialize();

        this.jumperManager.initialize(260, this.ground.getBlockByX(260).y, this.playerManager.entriedPlayers);

        this.localJumper = this.jumperManager.getByPlayerId(g.game.selfId);

        this.enemyManager.initialize();
        this.leftMan.initialize();

        this.jumpButton.initialize();
        this.jumpButton.x = 15;
        this.jumpButton.y = g.game.height - this.jumpButton.height - 5;
        this.gameState.currentState = GameStatus.START_GAME;

        this.yoButton.initialize();
        this.yoButton.x = g.game.width - this.yoButton.width - 15;
        this.yoButton.y = g.game.height - this.jumpButton.height - 5;

        // ここで表示順序を決める
        this.append(this.background);
        this.append(this.ground);

        this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
            this.append(jumper);
        });

        // 自分のJumperがいる場合は手前に表示するためもう一回append
        if (this.localJumper) {
            this.append(this.localJumper);
        }

        this.enemyManager.initialize();

        this.append(this.leftMan);
        this.append(this.jumpButton);
        this.append(this.yoButton);
        this.append(this.roundTimer);
        this.append(this.scoreBoard);
        this.append(this.resultBoard);
        this.append(this.flashEffect);
    }


    gameMainLoop() {
        this.gameState.onUpdate();

        if (!this.localJumper || this.localJumper.isDead) {
            this.remove(this.jumpButton);
            this.remove(this.yoButton);
        }
        this.roundTimer.onUpdate(this.gameState);
        this.ground.onUpdate(this.gameState.speed);
        this.leftMan.onUpdate(this.gameState);
        this.jumperManager.onUpdate(this.ground, this.gameState);
        this.flashEffect.onUpdate();

        this.popEnemy(this.gameState);

        this.enemyManager.getAllLivingEnemies().forEach((enemy) => {
            enemy.onUpdate(this.gameState.speed);
        });

        this.jumpButton.onUpdate();
        this.yoButton.onUpdate();

        // 敵との当たり判定
        if (!this.gameState.isFinished) {
            this.enemyManager.getAllLivingEnemies().forEach((enemy, index) => {
                this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
                    if (index === 0) {
                        jumper.lastHitCheckResult = HitCheckResultType.NONE;
                        jumper.frontEnemyDistance = undefined;
                    }
                    const result = jumper.checkHitEnemy(enemy);
                    if (result.type !== HitCheckResultType.NONE) {
                        jumper.lastHitCheckResult = result.type;
                        jumper.frontEnemyDistance = result.distance;
                    }
                });
            });

            // このフレームで死んだJumperを保持する
            const deadJumpers: Jumper[] = [];

            // 左端との当たり判定
            this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
                const hitbox = jumper.getHitbox();
                if (hitbox.x < this.leftMan.x) {
                    jumper.isDead = true;
                    this.remove(jumper);
                    deadJumpers.push(jumper);
                    jumper.rank = this.rankTable.currentRank;
                    jumper.score = this.gameState.score;

                    // もし自分のJumperが死んだなら、結果画面を出す
                    if (jumper.isSelfJumper) {
                        this.resultBoard.showResult(jumper.rank, jumper.score);
                    }

                }
            });

            // ランクイン処理
            if (deadJumpers.length > 0) {
                this.rankTable.rankIn(deadJumpers);
            }


            // 判定系の情報を反映するループ
            this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
                switch (jumper.lastHitCheckResult) {
                case HitCheckResultType.HIT:
                    jumper.dealDamage();
                    break;
                case HitCheckResultType.ON_JUST:
                    if (jumper.isJumpStartFrame) {
                        jumper.doBoost();
                    }
                    break;
                }
            });
        }

        // このフレームに生き残ったJumper

        const livingJumpers = this.jumperManager.getAllLivingJumpers();
        this.scoreBoard.onUpdate(livingJumpers.length, this.gameState.score);

        // ゲーム終了判定
        if (livingJumpers.length < 2 && this.gameState.currentState !== GameStatus.FINISH) {
            this.gameState.currentState = GameStatus.FINISH;

            this.rankTable.rankIn(livingJumpers);
            livingJumpers.forEach((jumper) => {
                jumper.score = this.gameState.score;
                jumper.rank = 1;
            });

            this.flashEffect.doFlash(60);
            if (this.localJumper) {
                this.resultBoard.showResult(this.localJumper.rank, this.localJumper.score);
            }
            this.setTimeout(() => {
                if (this.gameState.isFinished) {
                    this.sceneManager.gotoTitleScene();
                }
            }, 5000);
        }
    }


    popEnemy(gameState: GameState) {
        if (gameState.isFinished) {
            return;
        }

        if (this.enemyPopCoolDownTime > 0) {
            this.enemyPopCoolDownTime--;
        }

        if (g.game.random.get(0, 99) < this.gameState.currentRound.enemyCreateChance && this.gameState.timer % Math.floor(g.game.fps / 2) === 0 && this.enemyPopCoolDownTime <= 0) {
            this.enemyPopCoolDownTime = JumpButton.COOLDOWN_FRAME;

            const enemy = this.enemyManager.pop(EnemyType.LOW);
            if (enemy) {
                const rightEdgeBlock = this.ground.getRightEdgeBlock();
                enemy.pop(rightEdgeBlock.x, rightEdgeBlock.y - enemy.height, this.gameState.speed);
            }
        }
    }


    // ハンドラ ---------------------------------------------------------

    mainLoop() {
        switch (this.gameState.currentState) {
        case GameStatus.START_GAME:
            this.gameState.currentState = GameStatus.PLAYING_GAME;
            break;
        case GameStatus.PLAYING_GAME:
            this.gameMainLoop();
            break;
        case GameStatus.FINISH:
            this.gameMainLoop();
            break;
        }
    }


    onJumpButtonClick(e: g.PointDownEvent) {
        if (!this.jumpButton.isClickable) {
            return;
        }


        g.game.raiseEvent(new g.MessageEvent({
            message: MessageEventMessages.CLICK_JUMP_BUTTON
        }));

        this.jumpButton.coolDown = JumpButton.COOLDOWN_FRAME;
    }

    onYoButtonClick(e: g.PointDownEvent) {
        if (!this.yoButton.isClickable) {
            return;
        }

        g.game.raiseEvent(new g.MessageEvent({
            message: MessageEventMessages.CLICL_YO_BUTTON
        }));

        this.yoButton.coolDown = YoButton.COOLDOWN_FRAME;
    }

    onMessage(e: MessageEvent) {
        switch (e.data.message) {
        case MessageEventMessages.CLICK_JUMP_BUTTON:
            this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
                if (jumper.player.id === e.player.id) {
                    jumper.doJump();
                }
            });
            break;
        case MessageEventMessages.CLICL_YO_BUTTON:
            this.jumperManager.getAllLivingJumpers().forEach((jumper) => {
                if (jumper.player.id === e.player.id) {
                    jumper.doYo();
                }
            });
            break;

        }
    }


}

enum MessageEventMessages {
    CLICK_JUMP_BUTTON = "jump",
    CLICL_YO_BUTTON = "yo"
}