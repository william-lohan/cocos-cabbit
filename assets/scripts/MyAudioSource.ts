
const { ccclass, property, requireComponent } = cc._decorator;

// export enum MyAudioState {
//     ERROR = -1,
//     INITIALZING = 0,
//     PLAYING = 1,
//     PAUSED = 2,
//     STOPPED = 3
// }

// export class MyAudio extends cc.EventTarget {

//     private _shouldRecycleOnEnded: boolean = false;

//     private _src: cc.AudioClip;

//     private _element = null;

//     private id: number = 0;

//     private _state: MyAudioState = MyAudioState.INITIALZING;

//     constructor(src?: cc.AudioClip) {
//         super();
//         this._src = src;
//     }

// }

/**
 * TODO not implemented
 * idea is to support pan and delay with web audio
 * // cc.sys.__audioSupport.context ???
 */
@ccclass
export class MyAudioSource extends cc.Component implements cc.AudioSource {

  private _clip: cc.AudioClip = null;

  private _volume: number = 1;

  private _mute: boolean = false;

  private _loop: boolean = false;

  private _pausedFlag: boolean = false;

  private _firstlyEnabled: boolean = true;

  private audio: any;

  public isPlaying: boolean;

  @property({
    type: cc.AudioClip,
    animatable: false
  })
  public get clip(): cc.AudioClip {
    return this._clip;
  }
  public set clip(value: cc.AudioClip) {
    if (value === this._clip) {
      return;
    }
    if (!(value instanceof cc.AudioClip)) {
      cc.error('Wrong type of AudioClip.');
      return;
    }
    this._clip = value;
    this.audio.stop();
    this.audio.src = this._clip;
    if (this.preload) {
      (this._clip as any)._ensureLoaded();
    }
  }

  @property({
    min: 0,
    max: 1
  })
  public get volume(): number {
    return this._volume;
  }
  public set volume(value: number) {
    value = value > 1 ? 1 : (value < 0 ? 0 : value);
    this._volume = value;
    if (!this._mute) {
      this.audio.setVolume(value);
    }
  }

  @property({
    animatable: false
  })
  public get mute(): boolean {
    return this._mute;
  }
  public set mute(value: boolean) {
    this._mute = value;
    this.audio.setVolume(value ? 0 : this._volume);
  }

  @property({
    animatable: false
  })
  public get loop(): boolean {
    return this._loop;
  }
  public set loop(value: boolean) {
    this._loop = value;
    this.audio.setLoop(value);
  }

  @property({
    animatable: false
  })
  public playOnLoad: boolean = false;

  @property({
    animatable: false
  })
  public preload: boolean = false;

  /**
   * The amount of panning to apply. The value can range between -1 (full left pan) and 1 (full right pan).
   * @type {Number}
   * @default 0
   */
  @property({
    min: -1,
    max: 1
  })
  public pan: number = 0;

  private _pausedCallback(): void {
    var state = this.audio.getState();
    if (state === 'cc._Audio.State.PLAYING') {
      this.audio.pause();
      this._pausedFlag = true;
    }
  }

  private _restoreCallback(): void {
    if (this._pausedFlag) {
      this.audio.resume();
    }
    this._pausedFlag = false;
  }

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    // this.audio.src is undefined, when the clip property is deserialized from the scene
    if (!this.audio.src) {
      this.audio.src = this._clip;
    }
    if (this.preload) {
      (this._clip as any)._ensureLoaded();
    }
  }

  protected onEnable(): void {
    if (this.playOnLoad && this._firstlyEnabled) {
      this._firstlyEnabled = false;
      this.play();
    }
    cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
  }

  protected onDisable(): void {
    this.stop();
    cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
  }

  protected onDestroy(): void {
    this.audio.destroy();
  }

  //#endregion

  public play(): void {
    if (!this._clip) return;

    var audio = this.audio;
    audio.setVolume(this._mute ? 0 : this._volume);
    audio.setLoop(this._loop);
    audio.setCurrentTime(0);
    audio.play();
  }

  public stop(): void {
    this.audio.stop();
  }

  public pause(): void {
    this.audio.pause();
  }

  public resume(): void {
    this.audio.resume();
  }

  public rewind(): void {
    this.audio.setCurrentTime(0);
  }

  public getCurrentTime(): number {
    return this.audio.getCurrentTime();
  }

  public setCurrentTime(time: number): number {
    this.audio.setCurrentTime(time);
    return time;
  }

  public getDuration(): number {
    return this.audio.getDuration();
  }

}

export default MyAudioSource;
