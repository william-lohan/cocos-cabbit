
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.AudioSource)
export default class SoundOrigin extends cc.Component {

  @property(cc.Node)
  public listener: cc.Node = null;

  @property({
    min: 0
  })
  public radius: number = 0;

  private audioSource: cc.AudioSource;

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    this.audioSource = this.getComponent(cc.AudioSource);
  }

  protected update(dt: number): void {
    if (this.listener && this.radius) {
      const a = Math.abs(this.node.x - this.listener.x);
      const b = Math.abs(this.node.y - this.listener.y);
      const c = Math.sqrt(a ^ 2 + b ^ 2);
      const distance = Math.abs(c);
      if (distance >= this.radius) {
        this.audioSource.volume = 0;
      } else {
        this.audioSource.volume = 1 - (distance / this.radius);
      }
    }
  }

  //#endregion

}
