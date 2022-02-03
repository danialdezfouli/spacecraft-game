import Player from './Player.js'
import Game from './Game.js'
import Fighter from './Fighter.js'

const root = document.getElementById('root')
window.root = root

const fighter = new Fighter()

const player = new Player({
  fighter,
})

const game = new Game({player})

window.game = game
