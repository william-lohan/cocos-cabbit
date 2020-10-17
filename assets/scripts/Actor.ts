import { Collider, isBoxCollider, isCircleCollider, isPolygonCollider } from './collider-utils';
import { Input, InputButton } from './Input';

const { ccclass, property, requireComponent } = cc._decorator;

enum Direction {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT
}

@ccclass
export class Actor extends cc.Component {

  /**
   * Pixels per second
   */
  @property({
    type: cc.Integer,
    min: 0
  })
  public speed: number = 96;

  @property(Input)
  public input: Input = null;

  private animation: cc.Animation;

  private direction: Direction = Direction.DOWN;

  private walking: boolean = false;

  private isColliding: boolean = false;

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    this.animation = this.getComponent(cc.Animation);
  }

  protected onEnable(): void {
    cc.director.getCollisionManager().enabled = true;
  }

  protected update(dt: number): void {
    const moveAmount = this.speed * dt;
    const currentPos = cc.v2(this.node.position);
    const input = this.input.getCurrentInput();
    // console.log(input.toString(2));
    if (input != InputButton.NONE) {
      if (input & InputButton.UP) {
        currentPos.y += moveAmount;
        this.direction = Direction.UP;
      }
      if (input & InputButton.DOWN) {
        currentPos.y -= moveAmount;
        this.direction = Direction.DOWN;
      }
      if (input & InputButton.LEFT) {
        currentPos.x -= moveAmount;
        this.direction = Direction.LEFT;
      }
      if (input & InputButton.RIGHT) {
        currentPos.x += moveAmount;
        this.direction = Direction.RIGHT;
      }
      this.updatePosition(currentPos);
      this.walking = true;
    } else {
      this.walking = false;
    }
    this.updateAnimation();
  }

  //#endregion

  //#region Collision Manager Callback

  public onCollisionEnter(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = true;
    this.onCollisionEnterH(other, self);
  }

  public onCollisionEnterH(other: Collider, self: cc.BoxCollider): void {

    const playerAabb = self.world.aabb;
    const playerPreAabb = self.world.preAabb.clone();

    if (isBoxCollider(other)) {
      const otherAabb = other.world.aabb;
      const otherPreAabb = other.world.preAabb.clone();
      const intersection = new cc.Rect();
      playerAabb.intersection(intersection, otherAabb);
      if (intersection.width <= intersection.height) {
        // x clip
        if (playerPreAabb.x < otherPreAabb.x) {
          this.node.x -= intersection.width;
        } else {
          this.node.x += intersection.width;
        }
      } else {
        // y clip
        if (playerPreAabb.y < otherPreAabb.y) {
          this.node.y -= intersection.height;
        } else {
          this.node.y += intersection.height;
        }
      }
    }

    if (isCircleCollider(other)) {
      throw Error('CircleCollider not handled');
    }

    if (isPolygonCollider(other)) {
      throw Error('CircleCollider not handled');
    }

  }

  public onCollisionStay(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = true;
    this.onCollisionEnterH(other, self);
  }

  public onCollisionExit(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = false;
  }

  //#endregion

  public updatePosition(position: cc.Vec2): void {
    this.node.setPosition(position);
  }

  public updateAnimation(): void {
    const type: string = this.walking ? 'walk' : 'idle';
    switch (this.direction) {
      case Direction.NONE:
      case Direction.DOWN:
        this.animateClipIfNot(`${type}_down`);
        break;
      case Direction.UP:
        this.animateClipIfNot(`${type}_up`);
        break;
      case Direction.LEFT:
        this.animateClipIfNot(`${type}_left`);
        break;
      case Direction.RIGHT:
        this.animateClipIfNot(`${type}_right`);
        break;
    }
  }

  private animateClipIfNot(clip: string): void {
    if (!this.animation.currentClip || this.animation.currentClip.name !== clip) {
      this.animation.play(clip);
    }
  }

}

export default Actor;
