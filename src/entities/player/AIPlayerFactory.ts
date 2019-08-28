import {AIPlayer, AI_LEVEL} from "./Player";

export class AIPlayerFactory {


    createZakoAIPlayer(): AIPlayer {
        return new AIPlayer("AI_ZAKO", "いけにえ", AI_LEVEL.NOUSHI);
    }

    createAIPlayers(num: number): AIPlayer[] {
        const players: AIPlayer[] = [];

        for (let i = 0; i < num; i++) {
            players.push(new AIPlayer(`AI${i + 1}`, "AI_TARO", g.game.random.get(1, 4)));
        }

        return players;
    }


}