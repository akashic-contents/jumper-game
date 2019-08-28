import {GameState} from "../states/GameState";
import {Enemy} from "./enemy/Enemy";
import {Ground} from "./ground/Ground";
import {GroundBlock} from "./ground/GroundBlock";
import {Player, AIPlayer} from "./player/Player";
import {YoBallon} from "./YoBallon";

export class Jumper extends g.E {
    static PRE_JUMP_FRAME = 7;
    static JUMP_FRAME = 20;
    static SIZE: g.CommonSize = {width: 64, height: 96};

    speed: number = 0;
    isDead: boolean = false;

    surface: g.FrameSprite;

    preJumpCounter: number = 0;
    jumpCounter: number = 0;
    isJumpStartFrame: boolean = false;
    isPreJumpStartFrame: boolean = false;

    boostCounter: number = 0;

    hitCounter: number = 0;

    player: Player | undefined;

    runningFrames: number[];

    rank: number = 0;
    score: number = 0;

    // AIの判断に使う
    lastHitCheckResult: HitCheckResultType | undefined;
    frontEnemyDistance: number | undefined;


    constructor(scene: g.Scene, image: g.ImageAsset, private jumpSound: g.AudioAsset, private yoBallon: YoBallon) {
        super({scene: scene, local: true});
        this.runningFrames = [0, 1, 2, 3];


        this.surface = new g.FrameSprite({
            scene: scene,
            src: image,
            srcWidth: 64,
            srcHeight: 96,
            frames: this.runningFrames,
            width: Jumper.SIZE.width,
            height: Jumper.SIZE.height,
            interval: 70
        });
        this.append(this.surface);
        this.append(this.yoBallon);
        this.yoBallon.x = 20;
        this.yoBallon.y = -this.yoBallon.height;
        this.yoBallon.modified();
        this.width = this.surface.width;
        this.height = this.surface.height;
        this.surface.start();
    }

    initialize(startLine: number, startLineBlockY: number, player: Player, speed: number = 0) {
        this.speed = speed;
        this.hitCounter = 0;
        this.isDead = false;
        this.player = player;

        // もし自分のJumperでないなら透明にして画像も変える
        if (this.isSelfJumper) {
            this.surface.opacity = 1;
            this.runningFrames = [7, 8, 9, 10];
        } else {
            this.surface.opacity = 0.2;
            this.runningFrames = [0, 1, 2, 3];
        }
        this.surface.frames = this.runningFrames;
        this.surface.frameNumber = g.game.random.get(0, 3);
        this.surface.modified();

        this.yoBallon.initialize();

        this.preJumpCounter = 0;
        this.jumpCounter = 0;
        this.isJumpStartFrame = false;
        this.isPreJumpStartFrame = false;
        this.lastHitCheckResult = undefined;
        this.frontEnemyDistance = undefined;

        this.rank = 0;
        this.score = 0;

        this.boostCounter = 0;

        this.x = startLine;
        this.y = startLineBlockY - this.height;
        this.modified();
    }

    get isJumping(): boolean {
        return this.jumpCounter > 0;
    }

    get isPreJumping(): boolean {
        return this.preJumpCounter > 0;
    }

    onUpdate(ground: Ground, state: GameState) {
        this.isJumpStartFrame = false;
        this.isPreJumpStartFrame = false;

        this.yoBallon.onUpdate();

        if (this.hitCounter > 0) {
            if (this.isSelfJumper) {
                this.surface.frames = [11, -1];
            } else {
                this.surface.frames = [4, -1];
            }
            if (this.surface.frameNumber > 1) {
                this.surface.frameNumber = 0;
            }
            this.surface.modified();
        } else {
            if (this.surface.frames !== this.runningFrames && !this.isPreJumping && !this.isJumping) {
                this.surface.frames = this.runningFrames;
                this.surface.frameNumber = 0;
                this.surface.modified();
            }
        }

        if (this.player.type === "AI") {
            if ((<AIPlayer>this.player).calcPushJumpButton(this, state)) {
                this.doJump();
            }
        }

        const underBlock: GroundBlock | undefined = ground.getBlockByX(this.x);
        if (underBlock) {
            this.y = underBlock.y - this.height;
        }

        if (this.preJumpCounter > 0) {
            this.preJumpCounter--;
            if (this.preJumpCounter === 0) {
                this.jumpCounter = Jumper.JUMP_FRAME;
                this.isJumpStartFrame = true;

                if (this.isSelfJumper) {
                    this.surface.frames = [13];
                } else {
                    this.surface.frames = [6];
                }
                this.surface.frameNumber = 0;
                this.surface.modified();

                if (this.player.id === g.game.selfId) {
                    this.jumpSound.play();
                }
            }
        }

        if (this.jumpCounter > 0) {
            this.jumpCounter--;
            this.y -= 50;
        }

        if (this.hitCounter > 0) {
            this.hitCounter--;
        }

        if (this.speed !== 0) {
            if (this.speed > 0) {
                if (this.boostCounter === 0) {
                    this.speed--;
                } else {
                    this.boostCounter--;
                }
            } else {
                this.speed++;
            }
            this.x += this.speed;
            if (this.x > g.game.width - this.width) {
                this.x = g.game.width - this.width;
            }
            this.modified();
        }

        this.modified();
    }

    doYo() {
        if (this.yoBallon.displayFrame > 0) {
            return;
        }

        this.yoBallon.show();
    }

    doJump() {
        if (this.preJumpCounter > 0 || this.jumpCounter > 0) {
            return;
        }

        if (this.hitCounter > 0) {
            return;
        }

        this.preJumpCounter = Jumper.PRE_JUMP_FRAME;
        this.isPreJumpStartFrame = true;
        this.surface.frameNumber = 0;
        if (this.isSelfJumper) {
            this.surface.frames = [12];
        } else {
            this.surface.frames = [5];
        }

    }

    doBoost() {
        this.boostCounter = 20;
        this.speed = 2;
    }

    dealDamage() {
        if (this.preJumpCounter > 0) {
            this.preJumpCounter = 0;
            this.hitCounter = 40;
            this.speed = -15;
        } else {
            this.hitCounter = 30;
            this.speed = -11;
        }
    }

    checkHitEnemy(enemy: Enemy): { type: HitCheckResultType, distance: number } {
        const hitbox = this.getHitbox();

        let type: HitCheckResultType = HitCheckResultType.NONE;
        const distance = enemy.x - hitbox.width - hitbox.x;

        if (!this.isJumping && this.hitCounter <= 0 && hitbox.x >= enemy.x - hitbox.width && hitbox.x <= enemy.x + enemy.width) {
            type = HitCheckResultType.HIT;
        } else if (hitbox.x >= enemy.x - (enemy.justZone + enemy.normalZone) && hitbox.x < enemy.x - (enemy.justZone)) {
            type = HitCheckResultType.ON_GOOD;
        } else if (hitbox.x >= enemy.x - enemy.justZone && hitbox.x < enemy.x) {
            type = HitCheckResultType.ON_JUST;
        }
        return {type, distance};
    }

    getHitbox(): g.CommonArea {
        return {x: this.x + (this.width / 2), y: this.y, width: this.width / 2, height: this.height};
    }

    get isSelfJumper(): boolean {
        if (!this.player) {
            return false;
        }

        return this.player.id === g.game.selfId;
    }
}

export enum HitCheckResultType {
    NONE,
    ON_GOOD,
    ON_JUST,
    HIT
}