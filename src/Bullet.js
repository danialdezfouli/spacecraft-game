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
    const enemies = this.player.game.enemy.enemies
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
