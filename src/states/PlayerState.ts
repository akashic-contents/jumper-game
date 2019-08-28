import {Jumper} from "../entities/Jumper";

export class PlayerState {


    jumper: Jumper | undefined;

    initialize() {
        this.jumper = undefined;
    }
}