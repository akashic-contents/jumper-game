// ゲームの参加者

declare var window: any;

import {GameState} from "../../states/GameState";
import {HitCheckResultType, Jumper} from "../Jumper";

export interface Player {
    id: string;
    name: string;
    type: PlayerType;
}


export class AIPlayer implements Player {
    type: PlayerType = "AI";

    static GOOD_JUMP_CHANCE = [0, 5, 10, 20, 20];
    static JUST_JUMP_CHANCE = [0, 3, 5, 10, 15];


    constructor(public id: string, public name: string, public level: AI_LEVEL) {
    }

    calcPushJumpButton(jumper: Jumper, state: GameState): boolean {
        if (jumper.lastHitCheckResult === HitCheckResultType.HIT) {
            return false;
        }

        // 試合終了してるなら何もしない
        if (state.isFinished) {
            return false;
        }

        // 低レベルAIはまったく関係ないタイミングでジャンプすることがある
        if (this.level === AI_LEVEL.LV1) {
            if (g.game.random.get(0, 299) === 0) {
                return true;

            }
        }

        // AIは一定の距離より前進すると脳死する（手加減してくれる）
        switch (this.level) {
        case AI_LEVEL.LV1:
            if (jumper.x > 150) {
                return false;
            }
        case AI_LEVEL.LV2:
            if (jumper.x > 350) {
                return false;
            }
        case AI_LEVEL.LV3:
            if (jumper.x > 400) {
                return false;
            }
        case AI_LEVEL.LV4:
            if (jumper.x > 450) {
                return false;
            }
        default:
        }


        // ジャンプして飛び越え可能な距離の時
        if (jumper.frontEnemyDistance > 0 && jumper.frontEnemyDistance < (Jumper.JUMP_FRAME * state.speed) + (Jumper.PRE_JUMP_FRAME * state.speed)) {
            switch (this.level) {
            case AI_LEVEL.LV1:
                return g.game.random.get(0, 99) < 15;
            case AI_LEVEL.LV2:
                return g.game.random.get(0, 99) < 20;
            case AI_LEVEL.LV3:
                return g.game.random.get(0, 99) < 25;
            case AI_LEVEL.LV4:
                return g.game.random.get(0, 99) < 30;
            default:
                return false;
            }
        }


        return false;
    }
}


export enum AI_LEVEL {
    NOUSHI, // 何もせず即死するAI。チュートリアル用途を兼ねゲームに一人だけ混ぜる
    LV1,
    LV2,
    LV3,
    LV4
}

export type PlayerType = "HUMAN" | "AI";