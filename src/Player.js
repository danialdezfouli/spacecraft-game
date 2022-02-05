import mouse from './Mouse'
import {lerp} from './utils'
import config from './config'

export default class Player {
  constructor({fighter}) {
    this.fighter = fighter
    this.reset()
  }

  start() {
    this.reset()
    this.updateDom()
    this.addEvents()

    setTimeout(() => {
      this.updateDom()
    }, 2050)
  }

  init({game}) {
    this.game = game
    this.fighter.init({
      player: this,
      game,
    })
    this.updateDom()
  }

  reset() {
    this.best = Number(localStorage.getItem(config.BEST_SCORE) || 0)
    this.lastShootedBullet = 0
    this.lastShootedThunder =
      Date.now() - config.thunderTimeGap + config.firstAvailableThunderAt

    this.bulletCapacity = config.bulletCpacity
    this.bulletsLeft = this.bulletCapacity

    this.reloading = false

    this.score = 0
    this.level = 1
    this.life = 100
  }

  addEvents() {
    if (this.eventsInit) return
    this.eventsInit = true
    window.addEventListener('click', event => {
      if (this.game.over) return

      if (this.canShootBullet()) {
        this.shootBullet()
      }
    })

    window.addEventListener('keydown', event => {
      if (this.game.over) return
      if (event.keyCode === 32 && this.canShootBullet()) {
        this.shootBullet()
      }

      if (event.key.toLowerCase() === 'enter' && this.canShootThunder()) {
        this.shootThunder()
      }

      if (event.key.toLowerCase() === 'r' && this.canReload()) {
        this.reload()
      }
    })

    this.game.ui.DOM.thunder.addEventListener('click', () => {
      if (this.canShootThunder()) {
        this.shootThunder()
      }
    })
  }

  draw() {
    this.fighter.draw()
  }

  addScore(dead) {
    this.score += dead ? 20 : 5

    const best = Number(localStorage.getItem(config.BEST_SCORE) || 0)

    if (this.score > best) {
      localStorage.setItem(config.BEST_SCORE, this.score)
    }

    if (this.score >= this.level * 100) {
      this.life += 15
      if (this.life > 100) this.life = 100

      this.level++
      this.bulletCapacity = Math.floor(8 + this.level / 2)
      this.bulletsLeft = this.bulletCapacity
    }

    this.updateDom()
  }

  decreaseLife(high) {
    this.life -= high ? 30 : 10
    if (this.life <= 0) {
      this.life = 0
      this.game.gameOver()
    }

    this.updateDom()
  }

  canReload() {
    return !this.reloading && this.bulletsLeft < this.bulletCapacity
  }

  reload() {
    this.reloading = true
    this.bulletsLeft = this.bulletCapacity
    this.updateDom()

    setTimeout(() => {
      this.reloading = false
      this.updateDom()
    }, config.reloadTime)
  }

  shootBullet() {
    this.bulletsLeft--
    this.fighter.shootBullet()
    this.lastShootedBullet = Date.now()
    this.updateDom()
    if (this.bulletsLeft <= 0 && this.canReload()) {
      this.reload()
    }
  }

  shootThunder() {
    this.fighter.shootThunder()
    this.lastShootedThunder = Date.now()
    this.updateDom()
  }

  updateDom() {
    const ui = this.game.ui.DOM

    if (this.reloading) {
      ui.bulletsLeft.innerHTML = '<small>Reloading</small>'
    } else {
      ui.bulletsLeft.innerText = this.bulletsLeft
    }

    ui.bulletsCapacity.innerText = '∞'

    ui.thunder.classList.toggle('active', this.canShootThunder())

    ui.score.innerText = this.score
    ui.level.innerText = this.level

    ui.life.style.width = `${this.life}%`
    ui.lifeText.innerText = `${Math.floor(this.life)}%`
  }

  canShootBullet() {
    if (!this.game.playing) return false

    if (this.bulletsLeft <= 0 || this.reloading) {
      return false
    }

    let bullet_time_gap
    if (this.fighter.thunder) {
      bullet_time_gap = 200
    } else {
      bullet_time_gap = 200 - Math.min(this.level, 20) * 8
    }
    return Date.now() - this.lastShootedBullet > bullet_time_gap
  }

  canShootThunder() {
    if (!this.game.playing) return false
    if (this.fighter.thunder) return false

    if (Date.now() - this.lastShootedThunder < config.thunderTimeGap) {
      return false
    }

    return true
  }
}
