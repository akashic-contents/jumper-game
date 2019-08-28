import {SceneManager} from "./scenes/SceneManager";

function main(param: g.GameMainParameterObject): void {

    function onJoin(e: g.JoinEvent) {
        const sceneManager = new SceneManager(e.player.id, e.player.name);
    }

    g.game.join.addOnce((e) => {
        onJoin(e);
    });

    // joinを待ち受ける仮のシーン
    const dummyScene = new g.Scene({game: g.game});
    dummyScene.update.add(() => {
    });

    g.game.pushScene(new g.Scene({game: g.game}));
}


export = main;