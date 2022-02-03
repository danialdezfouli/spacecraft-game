import mouse from './Mouse'
import {lerp} from './utils'
import config from './config'

export default class Player {
  constructor({fighter}) {
    this.fighter = fighter
    this.reset()
    this.initEvents()
    this.fighter.init({player: this})

    setInterval(() => {
      this.updateDom()
    }, 1000)
  }

  reset() {
    this.lastShootedBullet = 0
    this.lastShootedThunder = Date.now() - 7000

    this.bulletCapacity = config.bulletCpacity
    this.bulletsLeft = this.bulletCapacity

    this.reloading = false

    this.score = 0
    this.level = 1

    this.life = 100
  }

  init() {
    this.updateDom()
  }

  initEvents() {
    window.addEventListener('click', event => {
      if (this.game.state === 'over') return

      if (this.canShootBullet()) {
        this.shootBullet()
      }
    })

    window.addEventListener('keydown', event => {
      if (this.game.state === 'over') return
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
  }

  addScore(dead) {
    this.score += dead ? 20 : 5

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
    if (this.reloading) {
      this.game.DOM.bulletsLeft.innerHTML = '<small>Reloading</small>'
    } else {
      this.game.DOM.bulletsLeft.innerText = this.bulletsLeft
    }

    this.game.DOM.bulletsCapacity.innerText = '∞'

    // this.game.DOM.thunderCounter.innerText = '0'
    this.game.DOM.thunder.classList.toggle('active', this.canShootThunder())

    this.game.DOM.score.innerText = this.score
    this.game.DOM.level.innerText = this.level

    this.game.DOM.life.style.width = `${this.life}%`
    this.game.DOM.lifeText.innerText = `${Math.floor(this.life)}%`
  }

  canShootBullet() {
    if (this.bulletsLeft <= 0 || this.reloading) {
      return false
    }

    const BULLET_TIME_GAP = this.fighter.thunder ? 300 : 100
    return Date.now() - this.lastShootedBullet > BULLET_TIME_GAP
  }

  canShootThunder() {
    if (this.fighter.thunder) return false

    if (Date.now() - this.lastShootedThunder < config.thunder_time_gap) {
      return false
    }

    return true
  }
}
