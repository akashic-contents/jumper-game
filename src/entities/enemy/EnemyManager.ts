import {Enemy, EnemyType} from "./Enemy";

declare var window: any;

export class EnemyManager {

    enemies: Enemy[] = [];

    constructor(private scene: g.Scene, private image: g.ImageAsset) {

    }

    setup() {
        for (let i = 0; i < 5; i++) {
            this.enemies.push(new Enemy(this.scene, this.image, EnemyType.LOW));
        }
        for (let i = 0; i < 5; i++) {
            this.enemies.push(new Enemy(this.scene, this.image, EnemyType.MIDDLE));
        }
    }

    initialize() {
        this.enemies.forEach((enemy) => {
            this.scene.append(enemy);
            enemy.initialize();
        });
    }

    pop(type: EnemyType): Enemy | undefined {
        let livingEnemy: Enemy | undefined = undefined;
        this.enemies.forEach((enemy) => {
            if (enemy.type === type && enemy.isDead) {
                livingEnemy = enemy;
                return;
            }
        });

        if (!livingEnemy) {
            return undefined;
        } else {
            livingEnemy.isDead = false;
            return livingEnemy;
        }
    }

    getAllLivingEnemies(): Enemy[] {
        return this.enemies.filter(enemy => !enemy.isDead);
    }


}