export default class MemeoryGameScene extends Phaser.Scene{
  constructor(){
    super('memory-game-scene')
  }

  init(){
    this.halfWidth = this.scale.width * .5
    this.halfHeight = this.scale.height * .5
    this.boxGrouop = undefined
    this.player = undefined
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload(){
    this.load.image('bg','bg.jpg')
    this.load.image('chicken','chicken.png')
    this.load.image('duck','duck.png')
    this.load.image('bear','bear.png')
    this.load.image('parrot','parrot.png')
    this.load.image('penguin','penguin.png')
    this.load.image('play','play.png')
    this.load.spritesheet('tilesheet','sokoban_tilesheet.png',{frameWidth:64, frameHeight:64})
  }

  create(){
    this.add.image(this.halfWidth, this.halfHeight,'bg').setScale(3)

    this.boxGrouop = this.physics.add.staticGroup()

    this.createBoxes()
    this.player = this.createPlayer()
  }

  update(){
    this.movePlayer()
  }

  createBoxes(){
    const width = this.scale.width
    let xPer = .25
    let y = 150
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.boxGrouop.get(width * xPer,y,'tilesheet',7)
        xPer += .25
      }
      xPer = .25
      y += 150
    }
  }

  createPlayer(){
    const player = this.physics.add.sprite(this.halfWidth, this.halfHeight + 30, 'tilesheet').setSize(40,16).setOffset(12,38)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key : 'standby',
      frames:[{
        key : 'tilesheet',
        frame : 52
      }]
    })

    this.anims.create({
      key : 'down',
      frames: this.anims.generateFrameNumbers('tilesheet',{
        start: 52, end: 54
      }),
      frameRate: 10,
      repeat : -1
    })
  
    this.anims.create({
      key : 'up',
      frames: this.anims.generateFrameNumbers('tilesheet',{
        start: 55, end: 57
      }),
      frameRate: 10,
      repeat : -1
    })

    this.anims.create({
      key : 'left',
      frames: this.anims.generateFrameNumbers('tilesheet',{
        start: 81, end: 83
      }),
      frameRate: 10,
      repeat : -1
    })

    this.anims.create({
      key : 'right',
      frames: this.anims.generateFrameNumbers('tilesheet',{
        start: 78, end: 80
      }),
      frameRate: 10,
      repeat : -1
    })

    return player
  }

  movePlayer(){
    const speed = 200
    if(this.cursors.left.isDown){
      this.player.setVelocity(-speed,0)
      this.player.anims.play('left',true)
    }else if(this.cursors.right.isDown){
      this.player.setVelocity(speed,0)
      this.player.anims.play('right',true)
    }else if(this.cursors.up.isDown){
      this.player.setVelocity(0,-speed)
      this.player.anims.play('up',true)
    }else if(this.cursors.down.isDown){
      this.player.setVelocity(0,speed)
      this.player.anims.play('down',true)
    }else{
      this.player.setVelocity(0,0)
      this.player.anims.play('standby',true)
    }
  }
}