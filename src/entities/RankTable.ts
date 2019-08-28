import {Jumper} from "./Jumper";

export class RankTable {

    jumpers: Jumper[];
    maxJumpers: number = 0;

    initialize(maxPlayers: number) {
        this.jumpers = [];
        this.maxJumpers = maxPlayers;
    }


    rankIn(jumpers: Jumper[]) {
        this.jumpers = this.jumpers.concat(jumpers);
    }


    get currentRank(): number {
        return this.maxJumpers - this.jumpers.length;
    }
}