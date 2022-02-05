import {lerp} from './utils'

export class Thunder {
  constructor(player, fighter, onDestroy) {
    this.player = player
    this.fighter = fighter
    this.DOM = {
      el: document.createElement('div'),
    }
    this.DOM.el.classList.add('thunder')
    this.active = true
    this.ttl = 1500
    this.height = 0
    this.top = this.fighter.y.prev - this.height + 10

    this.settled = false

    setTimeout(() => {
      this.settled = true
    }, 300)

    root.appendChild(this.DOM.el)

    this.draw()
    this.onDestroy = onDestroy

    this.findEnemiesTimer = setInterval(() => {
      this.findEnemies()
    }, 50)

    setTimeout(() => {
      this.fadeOut()
    }, this.ttl)
  }

  findEnemies() {
    const enemies = this.player.game.enemy.enemies
    const len = enemies.length
    for (let i = 0; i < len; i++) {
      const enemy = enemies[i]
      if (Math.abs(enemy.x + enemy.width / 2 - this.fighter.x.prev) < 10) {
        enemy.destroy()
        this.player.addScore(true)
        break
      }
    }
  }

  draw() {
    if (this.settled) {
      this.top = 0
      this.height = this.fighter.y.prev + 2
    } else {
      this.top = lerp(this.top, 0, 0.1)
      this.height = lerp(this.height, this.fighter.y.prev + 2, 0.1)
    }

    this.DOM.el.style.cssText = `top: ${this.top}px; height: ${this.height}px; left: ${this.fighter.x.prev}px;`
  }

  fadeOut() {
    if (!this.active) return
    this.active = false
    this.DOM.el.classList.add('leaving')
    setTimeout(() => {
      clearInterval(this.findEnemiesTimer)
      this.DOM.el.classList.remove('leaving')
      this.DOM.el.classList.add('leaved')
      setTimeout(() => {
        this.onDestroy(this)
        this.DOM.el.remove()
      }, 400)
    }, 600)
  }
}
