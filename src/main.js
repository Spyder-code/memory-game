import Phaser from 'phaser'
import MemeoryGameScene from './MemoryGameScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 720,
	height: 680,
	physics: {
		default: 'arcade',
		arcade: {
			debug:true,
			gravity: { y: 0 },
		},
	},
	scene: [MemeoryGameScene],
	scale:{
		mode: Phaser.Scale.FIT,
		autoeCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
