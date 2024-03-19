export default class GameOverScene extends Phaser.Scene{
  constructor(){
    super('game-over-scene')
  }

  preload(){
    this.load.image('bg','bg.jpg')
  }

  create(){
    const bg = this.add.image(this.scale.width * .5, this.scale.height * .5,'bg').setScale(3)
    this.add.text(5, (bg.y * .5) + 100,'GAME OVER', {fontSize:60}).setScale(2)
  }
}