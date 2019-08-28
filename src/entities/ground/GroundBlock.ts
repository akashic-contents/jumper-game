export class GroundBlock extends g.E {
    static HEIGHT: number = 64;

    surface: g.FrameSprite;

    constructor(scene: g.Scene, image: g.ImageAsset) {
        super({scene: scene});
        this.surface = new g.FrameSprite({
            scene: scene,
            src: image,
            srcWidth: 64,
            srcHeight: 64,
            frames: [g.game.random.get(0, 2)],
            width: 64,
            height: 64,
            interval: 70
        });
        this.append(this.surface);

        this.width = this.surface.width;
        this.height = this.surface.height;
    }
}