import {GroundBlock} from "./GroundBlock";

export class Ground extends g.E {
    readonly MAXIMUM_GROUND_BLOCK = 20;

    blocks: GroundBlock[] = [];

    constructor(scene: g.Scene, private blockImage: g.ImageAsset) {
        super({scene});
    }

    setup() {
        for (let i = 0; i < this.MAXIMUM_GROUND_BLOCK; i++) {
            const block = new GroundBlock(this.scene, this.blockImage);
            this.append(block);
            this.blocks[i] = block;
        }
    }

    initialize() {
        this.blocks.forEach((block, index) => {
            block.x = 0 + (index * block.width);
            block.y = this.calcBlockY();
            block.modified();
        });
    }

    onUpdate(speed: number) {
        this.blocks.forEach((block) => {
            block.x -= speed;
            if (block.x <= -block.width) {
                block.x = this.getRightEdgeBlock().x + block.width - speed;
                block.y = this.calcBlockY();
            }
            block.modified();
        });
    }

    // 画面の右端にいるブロックを取得する
    getRightEdgeBlock(): GroundBlock {
        let rightEdgeBlock: GroundBlock | undefined = undefined;
        this.blocks.forEach((block) => {
            if (!rightEdgeBlock || rightEdgeBlock.x < block.x) {
                rightEdgeBlock = block;
            }
        });
        return rightEdgeBlock;
    }

    // ゲーム上のX座標を与えるとその位置でヒットするブロックを返す
    getBlockByX(x: number): GroundBlock | undefined {
        let result: GroundBlock | undefined = undefined;
        this.blocks.forEach((block) => {
            if (x >= block.x && x <= (block.x + block.width)) {
                result = block;
                return;
            }
        });
        return result;
    }

    private calcBlockY(): number {
        return (g.game.height - GroundBlock.HEIGHT + 3) + g.game.random.get(-3, 3);
    }


}