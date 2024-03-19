import Phaser from 'phaser'
import MemeoryGameScene from './MemoryGameScene'
import GameOverScene from './GameOverScene'
import WinScene from './WinScene'

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
	scene: [MemeoryGameScene, GameOverScene, WinScene],
	scale:{
		mode: Phaser.Scale.FIT,
		autoeCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
