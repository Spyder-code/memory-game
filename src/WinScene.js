export default class WinScene extends Phaser.Scene{
  constructor(){
    super('win-scene')
  }

  preload(){
    this.load.image('bg','bg.jpg')
  }

  create(){
    const bg = this.add.image(this.scale.width * .5, this.scale.height * .5,'bg').setScale(3)
    this.add.text(5, (bg.y * .5) + 100,'YOU WIN', {fontSize:60}).setScale(2)
  }
}