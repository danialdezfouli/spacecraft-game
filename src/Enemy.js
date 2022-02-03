import {addDomNode, rand} from './utils'

const emojies = ['👽', '👾', '🚀', '💣', '🔥', '💀', '🤖']

export default class Enemy {
  constructor({game, speed}) {
    this.game = game
    this.active = true
    this.DOM = {}
    this.DOM.el = addDomNode(root, {className: 'enemy'})

    this.life = 100
    this.dy = Math.random() * 0.8 + 0.3 + speed
    this.height = 30
    this.width = 30
    this.x = rand(0.25, 0.75) * innerWidth
    this.y = -100
    this.DOM.el.style.left = `${this.x}px`

    this.DOM.el.innerHTML = emojies[Math.floor(rand(0, emojies.length - 1))]
  }

  draw() {
    if (this.y > innerHeight) {
      this.game.enemyCrossOvered(this)
      this.game.removeEnemy(this)
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
    this.game.removeEnemy(this)
    this.dy = 0

    setTimeout(() => {
      this.DOM.el.remove()
    }, 500)
  }
}
