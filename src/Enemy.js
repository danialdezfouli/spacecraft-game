import {addDomNode, rand} from './utils'

const emojies = ['👽', '👾', '🚀', '💣', '🔥', '💀', '🤖', '🌌', '🎃', '🌠']

export default class Enemy {
  constructor({game, speed, enemyService}) {
    this.game = game
    this.service = enemyService
    this.active = true

    this.life = 100
    this.dy = speed
    this.height = 30
    this.width = 30
    this.x = rand(0.25, 0.75) * innerWidth
    this.y = -50

    this.DOM = {}
    this.DOM.el = addDomNode(root, {className: 'enemy'})
    this.DOM.el.style.left = `${this.x}px`
    this.DOM.el.innerHTML = emojies[Math.floor(rand(0, emojies.length))]
  }

  draw() {
    if (this.y > innerHeight) {
      this.service.crossOveredScreen(this)
      this.DOM.el.remove()
      return
    }

    // collision detection
    const fighter = this.game.player.fighter
    const fighterX = fighter.x.prev - fighter.bounds.width / 2
    const fighterY = fighter.y.prev

    if (
      fighterX + fighter.bounds.width > this.x &&
      fighterX < this.x + this.width &&
      this.y + this.height > fighterY &&
      this.y < fighterY + fighter.bounds.height
    ) {
      this.game.player.decreaseLife(true)
      this.destroy()
      return
    }

    this.y += this.dy
    this.DOM.el.style.top = `${this.y}px`
  }

  hit() {
    this.life -= 50
    this.DOM.el.classList.add('damaged')
    if (this.life <= 0) {
      this.destroy()
      return true
    }
  }

  destroy() {
    this.active = false
    this.DOM.el.classList.add('destroy')
    this.game.enemy.remove(this)
    this.dy = 0

    setTimeout(() => {
      this.DOM.el.remove()
    }, 500)
  }
}
