// シーン遷移に必要ないくつかのメソッドを持つ抽象クラス。
declare var window: any;

export abstract class ManagedScene extends g.Scene {
    hadSetUp: boolean = false;

    abstract setup(): void;

    abstract initialize(): void;

    protected constructor(param: g.SceneParameterObject) {
        super(param);
        this.stateChanged.add((state) => {
            this.onSceneStateChange(state);
        });
    }

    onSceneStateChange(state: g.SceneState): void {
        if (state === g.SceneState.Active) {
            this.onActive();
        } else if (state === g.SceneState.Deactive) {
            this.onDeactive();
        }

    }

    onActive(): void {
        // 初回アクティブ時にはloadedからsetup -> initializeの流れに入るので何もしない
        if (!this.hadSetUp) {
            return;
        }

        // 初回じゃなかったら手でinitializeする
        this.initialize();
    }

    onDeactive(): void {

    }
}
