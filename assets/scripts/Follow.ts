
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Camera)
default class Follow extends cc.Component {

  @property(cc.Node)
  public target: cc.Node = null;

  //#region LIFE-CYCLE CALLBACKS:

  protected update(dt: number): void {
    if (this.target) {
      const position = cc.v2(
        this.target.position.x - this.target.parent.position.x - this.node.parent.width / 2,
        this.target.position.y - this.target.parent.position.y - this.node.parent.height / 2
      );
      this.node.setPosition(position);
    }
  }

  //#endregion

}

export default Follow;
