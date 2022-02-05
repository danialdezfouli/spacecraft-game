import config from '../config'
import {GameEnemyService} from './GameEnemyService'
import {GameUI} from './GameUI'

const PLAYING = 'running'
const PAUSED = 'paused'
const GAME_OVER = 'game_over'

export default class Game {
  constructor({player}) {
    this.initialized = false
    this.state = PAUSED
    this.ui = new GameUI(this)
    this.enemy = new GameEnemyService({
      game: this,
      player,
    })

    this.initPlayer(player)
    this.addEvents()
    this.animate()
    this.ui.showMenu()
    // this.play()
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
      if (this.paused) {
        this.play()
      }
    })

    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'escape') {
        if (this.playing) {
          this.pause()
        } else {
          this.play()
        }
      }

      if (e.key.toLowerCase() === 'enter') {
        if (!this.playing) {
          this.play()
        }
      }
    })
  }

  play() {
    this.state = PLAYING
    this.enemy.start()
    this.animate()
    this.ui.hideModals()
  }

  pause() {
    cancelAnimationFrame(this.animation)
    this.state = PAUSED
    this.enemy.stop()
    this.ui.showMenu()
  }

  gameOver() {
    cancelAnimationFrame(this.animation)
    this.state = GAME_OVER
    this.enemy.stop()
    this.enemy.removeAll()

    this.ui.showGameOver({
      score: this.player.score,
      level: this.player.level,
      is_new_record: this.player.best < this.player.score,
      best: localStorage.getItem(config.BEST_SCORE) || 0,
    })

    this.player.fighter.bullets.forEach(bullet => bullet.destroy())

    this.player.reset()
    this.player.updateDom()
  }

  draw() {
    this.ui.draw()
    this.enemy.draw()
    this.player.draw()
  }

  animate = () => {
    this.ui.ctx.fillStyle = '#1e1a20'
    this.ui.ctx.fillRect(
      0,
      0,
      this.ui.DOM.canvas.width,
      this.ui.DOM.canvas.height,
    )

    if (this.state !== PLAYING) {
      return
    }

    this.draw()

    this.animation = requestAnimationFrame(this.animate)
  }
}
