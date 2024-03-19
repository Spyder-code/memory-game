function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let array = [[1,0,3],[2,4,1],[3,4,2],[5,5,0]];
let level = shuffle(array)


export default class MemeoryGameScene extends Phaser.Scene{
  constructor(){
    super('memory-game-scene')
  }

  init(){
    this.halfWidth = this.scale.width * .5
    this.halfHeight = this.scale.height * .5
    this.group = undefined
    this.player = undefined
    this.cursors = this.input.keyboard.createCursorKeys()
    this.activeBox = undefined
    this.itemsGroup = undefined
    this.selectedBox = []
    this.matchesCount = 0
    this.soundChoice = undefined
    this.soundCorrect = undefined
    this.soundIncorrect = undefined
    this.timerLabel = undefined
    this.countDownTimer = 60
    this.timeEvent = undefined
  }

  preload(){
    this.load.image('bg','bg.jpg')
    this.load.image('chicken','chicken.png')
    this.load.image('duck','duck.png')
    this.load.image('bear','bear.png')
    this.load.image('parrot','parrot.png')
    this.load.image('penguin','penguin.png')
    this.load.image('ship','ship.png')
    this.load.image('play','play.png')
    this.load.spritesheet('tilesheet','sokoban_tilesheet.png',{frameWidth:64, frameHeight:64})
    this.load.audio('soundChoice','choice.mp3')
    this.load.audio('soundCorrect','false.mp3')
    this.load.audio('soundIncorrect','true.mp3')
  }

  create(){
    this.soundChoice = this.sound.add('soundChoice', {volume:0.5})
    this.soundCorrect = this.sound.add('soundCorrect', {volume:0.5})
    this.soundIncorrect = this.sound.add('soundIncorrect', {volume:0.5})
    this.add.image(this.halfWidth, 150,'bg').setScale(3)

    this.group = this.physics.add.staticGroup()

    this.createBoxes()
    this.player = this.createPlayer()
    this.physics.add.collider(this.player,this.group,this.handlePlayerBoxCollide,null,this)
    this.itemsGroup = this.add.group()

    this.timerLabel = this.add.text(0, this.halfHeight + 250,null).setDepth(100)
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.gameOver,
      callbackScope: this,
      loop: true
    })
    
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update(){
    this.movePlayer()

    this.children.each(c => {
      const child = c
      if(child.getData('sorted')){
        return
      }
      child.setDepth(child.y)
    })

    this.updateActiveBox()
  }

  createBoxes(){
    const width = this.scale.width
    let xPer = .25
    let y = 150
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        this.group.get(width * xPer,y,'tilesheet',7).setSize(64,32).setOffset(0,32).setData('itemType',level[row][col])
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
    if(!this.player.active){
      return
    }
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

    const spaceJustPress = Phaser.Input.Keyboard.JustUp(this.cursors.space)
    if(spaceJustPress && this.activeBox){
      this.openBox(this.activeBox)
      this.activeBox.setFrame(7)
      this.activeBox = undefined
    }
  }

  handlePlayerBoxCollide(player, box){
    if(this.activeBox){
      return
    }

    this.activeBox = box
    this.activeBox.setFrame(9)

    const opened = box.getData('opened')
    if(opened){
      return
    }
  }

  updateActiveBox(){
    if(!this.activeBox){
      return
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.activeBox.x, this.activeBox.y
    )
    
    if(distance < 64){
      return
    }

    this.activeBox.setFrame(7)
    this.activeBox = undefined
  }

  openBox(box){
    if(!box){
      return
    }

    const itemType = box.getData('itemType')
    let item

    switch (itemType) {
      case 0:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('bear')
        break;
      case 1:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('chicken')
        break;
      case 2:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('duck')
        break;
      case 3:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('parrot')
        break;
      case 4:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('penguin')
        break;
      case 5:
        item = this.itemsGroup.get(box.x,box.y)
        item.setTexture('ship')
        break;
    }

    if(!item){
      return
    }

    box.setData('opened',true)

    item.setData('sorted',true)
    item.setDepth(2000)
    item.setActive(true)
    item.setVisible(true)

    item.scale = 0
    item.alpha = 0

    this.soundChoice.play()
    this.tweens.add({
      targets : item,
      y : '-=50',
      alpha : 1,
      scale : 1,
      duration : 500,
      onComplete:() => {
        // if(itemType == 0){
        //   this.handleBearSelected()
        //   return
        // }
        if(this.selectedBox.length < 2){
          return
        }

        this.checkForMatch()
      }
    })

    this.selectedBox.push({box,item})
  }

  handleBearSelected(){
    const { box, item } = this.selectedBox.pop()
    item.setTint(0xff0000)
    box.setFrame(20)

    this.player.active = false
    this.player.setVelocity(0,0)

    this.time.delayedCall(1000, ()=>{
      item.setTint(0xffffff)
      box.setFrame(7)
      box.setData('opened',false)

      this.tweens.add({
        targets: item,
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () =>{
          this.player.active = true
        }
      })
    })
  }

  checkForMatch(){
    const second = this.selectedBox.pop()
    const first = this.selectedBox.pop()
    if(first.item.texture != second.item.texture){
      this.soundIncorrect.play()
      this.tweens.add({
        targets: [first.item, second.item],
        y: '+=50',
        alpha: 0,
        scale: 0,
        duration: 300,
        delay:1000,
        onComplete: () =>{
          this.itemsGroup.killAndHide(first.item)
          this.itemsGroup.killAndHide(second.item)

          first.box.setData('opened', false)
          second.box.setData('opened', false)
        }
      })
      return
    }

    this.soundCorrect.play()
    this.time.delayedCall(1000, () => {
      first.box.setFrame(8)
      second.box.setFrame(8)

      if(this.matchesCount >= 6){
        this.player.active = false
        this.player.setVelocity(0,0)
        this.scene.start('win-scene')
        // window.location.reload()
      }
    })

    this.matchesCount++

  }

  gameOver(){
    this.countDownTimer -= 1
    this.timerLabel.setStyle({
      fontSize: 60,
      fontStyle: 'bold',
      align: 'center',
    }).setText(`${this.countDownTimer}`)
    if(this.countDownTimer <= 0){
      this.add.text(this.halfWidth, this.halfHeight + 250, 'You Loose!', {fontSize:60}).setOrigin(.5)
      this.countDownTimer = undefined
      this.player.active = false
      this.player.setVelocity(0,0)
      this.scene.start('game-over-scene')
    }
  }
}