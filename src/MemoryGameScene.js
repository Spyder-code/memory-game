let level = [[1,0,3],[2,4,1],[3,4,2]]

const result = [];
  for (let i = 0; i < 3; i++) {
    result.push([]);
    for (let j = 0; j < 3; j++) {
      let num = Math.floor(Math.random() * 4) + 1;
      if (result[i].includes(num)) {
        j--;
      } else {
        result[i].push(num);
      }
    }
  }

  level = result;

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
    this.add.image(this.halfWidth, 150,'bg').setScale(3)

    this.group = this.physics.add.staticGroup()

    this.createBoxes()
    this.player = this.createPlayer()
    this.physics.add.collider(this.player,this.group,this.handlePlayerBoxCollide,null,this)
    this.itemsGroup = this.add.group()

  }

  update(){
    this.movePlayer()

    this.children.each(c => {
      const child = c
      child.setDepth(child.y)
    })

    this.updateActiveBox()
  }

  createBoxes(){
    const width = this.scale.width
    let xPer = .25
    let y = 150
    for (let row = 0; row < 3; row++) {
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
    }

    if(!item){
      return
    }

    box.setData('opened',true)
  }
}