import {Player} from "./Player";

export class PlayerManager {
    entriedPlayers: Player[] = [];


    rankOrderdPlayerIds: string[];


    initialize() {
        this.entriedPlayers = [];
        this.rankOrderdPlayerIds = [];
    }

    entry(id: string, name: string) {
        this.entriedPlayers.push({id: id, name: name, type: "HUMAN"});
    }

    get currentPlayerCount(): number {
        return this.entriedPlayers.length;
    }
}