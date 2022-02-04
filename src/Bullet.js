import {lerp} from './utils'

export class Bullet {
  constructor({player, ctx, x, y, dx, onDestroy}) {
    this.onDestroy = onDestroy
    this.player = player
    this.ctx = ctx
    this.x = x
    this.y = y

    this.dx = dx / 4
    this.xx = 60
    this.dy = 7
    this.active = true

    this.width = 4
    this.height = 5
    this.dh = 0.2

    this.draw()
  }

  update() {
    if (!this.active) return
    this.y -= this.dy
    if (this.y < -30) {
      this.destroy()
      return
    }

    if (this.xx > 0) {
      this.xx -= 1
      this.x += this.dx
    }

    if (this.height < 24) {
      this.height = this.height + this.dh
    }

    if (this.y > 0) {
      this.findEnemies()
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.beginPath()

    ctx.shadowColor = '#1495ff'
    ctx.strokeStyle = '#1495ff'
    ctx.fillStyle = '#fff'

    ctx.shadowBlur = 20
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.fillRect(this.x, this.y, this.width, this.height, [])

    ctx.closePath()
  }

  findEnemies() {
    const enemies = this.player.game.enemies
    const len = enemies.length
    for (let i = 0; i < len; i++) {
      const enemy = enemies[i]
      if (
        this.y < enemy.y + enemy.height &&
        this.y + this.height > enemy.y &&
        this.x + this.height > enemy.x &&
        this.x < enemy.x + enemy.width
      ) {
        this.active = false
        this.destroy()
        let dead = enemy.hit()
        this.player.addScore(dead)
        break
      }
    }
  }

  destroy() {
    this.active = false
    this.onDestroy(this)
  }
}

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

    let timer = setInterval(() => {
      this.findEnemies()
    }, 50)

    setTimeout(() => {
      this.active = false
      this.DOM.el.classList.add('leaving')
      setTimeout(() => {
        clearInterval(timer)
        this.DOM.el.classList.remove('leaving')
        this.DOM.el.classList.add('leaved')
        setTimeout(() => {
          this.onDestroy(this)
          this.DOM.el.remove()
        }, 400)
      }, 600)
    }, this.ttl)
  }

  findEnemies() {
    const enemies = this.player.game.enemies
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
}
