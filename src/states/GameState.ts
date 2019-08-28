// ゲームに関する状態を持つ

export class GameState {
    currentState: GameStatus = GameStatus.WAITING_SETUP;

    jumpers: g.Player[];

    speed: number = 0;

    currentRoundIndex: number = 0;
    rounds: GameRound[] = [];
    isInterval: boolean = false;

    timer: number = 0;

    private _score: number = 0;


    frameCount: number = 0;

    constructor(private alermSound: g.AudioAsset) {

    }


    initialize() {
        this.currentState = GameStatus.WAITING_SETUP;
        this.speed = 5;
        this.timer = 0;
        this.frameCount = 0;
        this.currentRoundIndex = 0;
        this.isInterval = false;

        this._score = 0;

        this.rounds = [
            {
                groundSpeed: 6,
                length: g.game.fps * 10,
                leftManDistance: 0,
                intervalLength: g.game.fps * 15,
                enemyCreateChance: 0
            },
            {
                groundSpeed: 7,
                length: g.game.fps * 10,
                leftManDistance: 20,
                intervalLength: g.game.fps * 5,
                enemyCreateChance: 15
            },
            {
                groundSpeed: 8,
                length: g.game.fps * 10,
                leftManDistance: 60 + g.game.random.get(-10, 10),
                intervalLength: g.game.fps * 10,
                enemyCreateChance: 20,
            },
            {
                groundSpeed: 9,
                length: g.game.fps * 10,
                leftManDistance: 160 + g.game.random.get(-20, 20),
                intervalLength: g.game.fps * 20,
                enemyCreateChance: 22
            },
            {
                groundSpeed: 10,
                length: g.game.fps * 10,
                leftManDistance: 220 + g.game.random.get(-30, 30),
                intervalLength: g.game.fps * 10,
                enemyCreateChance: 25
            },
            {
                groundSpeed: 12,
                length: g.game.fps * 10,
                leftManDistance: 300 + g.game.random.get(-10, 10),
                intervalLength: g.game.fps * 5,
                enemyCreateChance: 30
            },
            {
                groundSpeed: 13,
                length: g.game.fps * 5,
                leftManDistance: 340,
                intervalLength: g.game.fps * 10,
                enemyCreateChance: 32
            },
            {
                groundSpeed: 15,
                length: g.game.fps * 10,
                leftManDistance: 400,
                intervalLength: g.game.fps * 15,
                enemyCreateChance: 34
            },
            {
                groundSpeed: 16,
                length: g.game.fps * 5,
                leftManDistance: 550,
                intervalLength: g.game.fps * 20,
                enemyCreateChance: 40
            },
            {
                groundSpeed: 17,
                length: g.game.fps * 5,
                leftManDistance: 700,
                intervalLength: g.game.fps * 20,
                enemyCreateChance: 45
            },
        ];
    }

    onUpdate() {
        this.frameCount++;
        if (this.isFinished) {
            return;
        }

        this._score += this.speed;

        if (this.timer <= 0) {
            if (this.isInterval) { // 次のラウンドへ
                if (this.rounds.length > this.currentRoundIndex) {
                    this.currentRoundIndex++;
                    this.alermSound.play();
                }
                this.timer = this.rounds[this.currentRoundIndex].length;
                this.speed = this.rounds[this.currentRoundIndex].groundSpeed;
                this.isInterval = false;
            } else {
                this.isInterval = true;
                this.timer = this.rounds[this.currentRoundIndex].intervalLength;
            }
        }
        this.timer--;
    }

    // インターバル中にタイマーの進み具合に応じてdistanceまで進む
    get leftManXByRoundProgress(): number {
        if (this.currentRoundIndex === 0) {
            return 0;
        }
        const currentRound = this.rounds[this.currentRoundIndex];
        const previousRound = this.rounds[this.currentRoundIndex - 1];

        // インターバル前なら一つ前のラウンドの位置を返す
        if (!this.isInterval) {
            return previousRound.leftManDistance;
        }

        return previousRound.leftManDistance + ((currentRound.leftManDistance - previousRound.leftManDistance) * ((currentRound.intervalLength - this.timer) / currentRound.intervalLength));
    }

    get currentRound(): GameRound {
        return this.rounds[this.currentRoundIndex];
    }

    get isFinished(): boolean {
        return this.currentState === GameStatus.FINISH;
    }

    get score(): number {
        return Math.floor(this._score / 10);
    }
}


export enum GameStatus {
    WAITING_SETUP,
    SETUP,
    INITIALIZE,
    START_GAME,
    PLAYING_GAME,
    FINISH
}

export interface GameRound {
    groundSpeed: number;
    length: number;
    leftManDistance: number;
    intervalLength: number;
    enemyCreateChance: number;
}