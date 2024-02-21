import Phaser from 'phaser';

export default class LoadingScene extends Phaser.Scene {
  loadingTime: Phaser.Time.TimerEvent | undefined;
  loadingProgress: Phaser.GameObjects.Rectangle | undefined;
  loadingBarValue: integer | undefined;

  preload() {
    this.loadingProgress = this.add.rectangle(
      400,
      500,
      0,
      60,
      Phaser.Display.Color.GetColor(0, 0, 255),
      1,
    );
    this.loadingTime = this.time.delayedCall(5000, this.onLoadingComplete, [], this);
    this.loadingBarValue = 0;
    const text = this.add.text(620, 550, 'Loading..');
    text.setScale(2);
  }

  update() {
    this.loadingBarValue = this.loadingTime!.getProgress();
    if (this.loadingProgress!.width < 600) {
      this.loadingProgress!.width += this.loadingBarValue * 4;
      //* console.log(this.loadingProgress?.width);
    }
  }

  create() {}

  onLoadingComplete() {
    console.log(`Loading Complete.`);
  }
}
