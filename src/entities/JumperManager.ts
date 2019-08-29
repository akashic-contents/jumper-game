import {GameState} from "../states/GameState";
import {Ground} from "./ground/Ground";
import {Jumper} from "./Jumper";
import {AIPlayerFactory} from "./player/AIPlayerFactory";
import {Player} from "./player/Player";
import {PlayerManager} from "./player/PlayerManager";
import {YoBallon} from "./YoBallon";

export class JumperManager {
    static MAXIMUM_JUMPER = 30;

    jumpers: Jumper[] = [];
    playerManager: PlayerManager;

    constructor(
        private scene: g.Scene,
        jumperSprite: g.ImageAsset,
        jumperSound: g.AudioAsset,
        playerManager: PlayerManager,
        private aiFactory: AIPlayerFactory,
        yoSprite: g.ImageAsset
    ) {
        for (let i = 0; i < JumperManager.MAXIMUM_JUMPER + 1; i++) {
            this.jumpers.push(new Jumper(scene, jumperSprite, jumperSound, new YoBallon(this.scene, yoSprite)));
        }
        this.playerManager = playerManager;
    }

    initialize(startLineX: number, startLineBlockY: number, humanPlayers: Player[]) {
        const zakoPlayer = this.aiFactory.createZakoAIPlayer();
        const aiPlayers = this.aiFactory.createAIPlayers(JumperManager.MAXIMUM_JUMPER - humanPlayers.length);
        const allPlayers = humanPlayers.concat([zakoPlayer], aiPlayers);

        // 全プレイヤーの順番をシャッフル
        for (let i = allPlayers.length - 1; i > 0; i--) {
            const r = g.game.random.get(0, i);
            const tmp = allPlayers[i];
            allPlayers[i] = allPlayers[r];
            allPlayers[r] = tmp;
        }

        // ローカルのプレイヤーIDと等しい（つまり各端末で操作対象の）Jumper
        let localJumper: Jumper | undefined = undefined;


        this.jumpers.forEach((jumper, index) => {
            jumper.initialize(startLineX - index * 4, startLineBlockY, allPlayers[index]);
            if (jumper.player && jumper.player.id === g.game.selfId) {
                localJumper = jumper;
            }
        });
    }

    getAllLivingJumpers(): Jumper[] {
        return this.jumpers.filter(jumper => !jumper.isDead);
    }

    getByPlayerId(id: string): Jumper | undefined {
        let result: Jumper | undefined = undefined;
        this.jumpers.forEach((jumper) => {
            if (jumper.player && jumper.player.id === id) {
                result = jumper;
            }
        });

        return result;
    }


    onUpdate(ground: Ground, state: GameState) {
        this.jumpers.forEach((jumper) => {
            if (jumper.isDead) {
                return;
            }
            jumper.onUpdate(ground, state);
        });
    }
}