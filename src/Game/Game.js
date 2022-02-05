import {GameEnemyService} from './GameEnemyService'
import {GameUI} from './GameUI'

const PLAYING = 'running'
const PAUSED = 'paused'
const GAME_OVER = 'game_over'

export default class Game {
  constructor({player}) {
    this.initialized = false
    this.ui = new GameUI(this)
    this.enemy = new GameEnemyService({
      game: this,
      player: player,
    })

    this.initPlayer(player)
    this.addEvents()
    this.play()
  }

  get playing() {
    return this.state === PLAYING
  }

  get paused() {
    return this.state === PAUSED
  }

  get over() {
    return this.state === GAME_OVER
  }

  initPlayer(player) {
    this.player = player
    this.player.init({
      game: this,
    })
  }

  addEvents() {
    let wasPlaying = false
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        wasPlaying = this.playing
        this.pause()
      } else if (wasPlaying) {
        const timeout_play_after_return = 300
        setTimeout(() => {
          this.play()
        }, timeout_play_after_return)
      }
    })

    window.addEventListener('click', e => {
      if (this.state === PAUSED) {
        this.play()
      }
    })

    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'escape') {
        if (this.state === PLAYING) {
          this.pause()
        } else {
          this.play()
        }
      }
    })
  }

  start() {
    this.play()
    this.player.reset()
    this.player.updateDom()
  }

  play() {
    this.state = PLAYING
    this.enemy.start()
    this.animate()
  }

  pause() {
    cancelAnimationFrame(this.animation)
    this.state = PAUSED
    this.enemy.stop()
  }

  gameOver() {
    cancelAnimationFrame(this.animation)
    this.state = GAME_OVER
    this.enemy.stop()
    this.enemy.removeAll()

    this.player.fighter.bullets.forEach(bullet => bullet.destroy())

    setTimeout(() => {
      alert('Game Over!')
      this.start()
    }, 50)
  }

  draw() {
    this.ui.draw()
    this.enemy.draw()
    this.player.draw()
  }

  animate = () => {
    if (this.state !== PLAYING) {
      return
    }

    this.ui.ctx.fillStyle = '#1e1a20'
    this.ui.ctx.fillRect(
      0,
      0,
      this.ui.DOM.canvas.width,
      this.ui.DOM.canvas.height,
    )

    this.draw()

    this.animation = requestAnimationFrame(this.animate)
  }
}
