
const { ccclass, property } = cc._decorator;

@ccclass
export class Exit extends cc.Component {

  @property
  public destinationScene: string = '';

  @property(cc.Node)
  public target: cc.Node = null;

  @property
  public preload: boolean = true;

  private isLoading: boolean = false;

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    if (this.destinationScene && this.preload) {
      cc.director.preloadScene(this.destinationScene);
    }
  }

  protected update(dt: number): void {
    if (this.destinationScene && this.target) {
      const targetRect = cc.rect(this.target.x, this.target.y, this.target.width, this.target.height);
      const exitRect = cc.rect(this.node.x, this.node.y, this.node.width, this.node.height);
      if (cc.Intersection.rectRect(targetRect, exitRect) && !this.isLoading) {
        this.isLoading = true;
        // cc.game.addPersistRootNode(this.target);
        cc.director.loadScene(this.destinationScene, () => {
          this.isLoading = false;
        });
      }
    }
  }

  //#endregion

}

export default Exit;
