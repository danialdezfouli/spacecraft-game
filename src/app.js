import Player from './Player'
import Game from './Game/Game'
import Fighter from './Fighter'

const root = document.getElementById('root')
window.root = root

const fighter = new Fighter()

const player = new Player({
  fighter,
})

const game = new Game({player})

if (import.meta.env.DEV) {
  window.game = game
}
