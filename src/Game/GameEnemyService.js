import Enemy from '../Enemy'

export class GameEnemyService {
  constructor({game, player}) {
    this.game = game
    this.player = player
    this.enemies = []
    this.timer = null
  }

  start(generateOnMount = false) {
    if (generateOnMount) {
      this.enemies = []
      this.generate()
    }

    this.timer = setInterval(() => {
      this.generate()
    }, 1500)
  }

  stop() {
    clearInterval(this.timer)
  }

  generate() {
    if (!this.game.playing) return

    const len = Math.random() * Math.min(1 + this.player.level / 6, 5)

    for (let i = 0; i < len; i++) {
      if (this.enemies.length > 10) break

      const enemy = new Enemy({
        game: this.game,
        enemyService: this,
        speed: (0.3 + Math.random()) * 1.4 + this.player.level * 0.09,
      })
      this.enemies.push(enemy)
    }
  }

  draw() {
    this.enemies.forEach(enemy => enemy.draw())
  }

  remove(enemy) {
    this.enemies = this.enemies.filter(e => e !== enemy)
  }

  removeAll() {
    this.enemies.forEach(enemy => enemy.destroy())
  }

  crossOveredScreen(enemy) {
    this.player.decreaseLife()
    this.remove(enemy)
  }
}
