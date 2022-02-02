import Player from './Player.js'
import Game from './Game.js'
import SpaceCraft from './SpaceCraft.js'

const root = document.getElementById('root')

const fighter = new SpaceCraft()

const player = new Player({
  fighter,
})

const game = new Game({player})
