import {createDomNode, addDomNode} from './utils'
import Star from './Star'
import Enemy from './Enemy'

export const GAME_STATE = {
  RUN: 'running',
  PAUSE: 'paused',
  OVER: 'over',
}

export default class Game {
  constructor({player}) {
    this.stars = []
    this.ui = new GameUI(this)

    this.createStars()

    this.initPlayer(player)

    this.run()

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.wasPlaying = this.playing
        this.pause()
      } else if (this.wasPlaying) {
        setTimeout(() => {
          this.run()
        }, 300)
      }
    })

    window.addEventListener('click', e => {
      if (this.state === GAME_STATE.PAUSE) {
        this.run()
      }
    })

    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'escape') {
        if (this.state === GAME_STATE.RUN) {
          this.pause()
        } else {
          this.run()
        }
      }
    })
  }

  get playing() {
    return this.state === GAME_STATE.RUN
  }

  get paused() {
    return this.state === GAME_STATE.PAUSE
  }

  run() {
    this.state = GAME_STATE.RUN
    this.initEnemies()
    this.animate()
  }

  pause() {
    this.state = GAME_STATE.PAUSE
    clearInterval(this.enemiesTimer)
    cancelAnimationFrame(this.animation)
  }

  initPlayer(player) {
    this.player = player
    this.player.game = this
    this.player.init()
  }

  createEnemies() {
    if (this.state !== GAME_STATE.RUN) return

    const len = Math.random() * Math.min(1 + this.player.level / 6, 5)

    for (let i = 0; i < len; i++) {
      if (this.enemies.length > 10) break

      const enemy = new Enemy({
        game: this,
        speed: Math.random() * 1.4 + 0.3 + this.player.level * 0.07,
      })
      this.enemies.push(enemy)
    }
  }

  initEnemies() {
    if (!this.enemies) {
      this.enemies = []
      this.createEnemies()
    }

    this.enemiesTimer = setInterval(() => {
      this.createEnemies()
    }, 1500)
  }

  removeEnemy(enemy) {
    this.enemies = this.enemies.filter(e => e !== enemy)
  }

  enemyCrossOvered(enemy) {
    this.player.decreaseLife()
  }

  createStars() {
    for (let i = 0; i < 10; i++) {
      this.stars.push(
        new Star({
          ctx: this.ui.ctx,
        }),
      )
    }
  }

  draw() {
    this.stars.forEach(star => star.draw())
    this.enemies.forEach(enemy => enemy.draw())
    this.player.draw()
  }

  animate() {
    if (this.state !== GAME_STATE.RUN) {
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

    this.animation = requestAnimationFrame(this.animate.bind(this))
  }

  gameOver() {
    this.pause()
    this.state = GAME_STATE.OVER
    this.enemies.forEach(enemy => enemy.destroy())
    this.player.fighter.bullets.forEach(bullet => bullet.destroy())
    cancelAnimationFrame(this.animation)

    setTimeout(() => {
      alert('Game Over!')
      this.enemies = []
      this.state = GAME_STATE.RUN
      this.run()
      this.player.reset()
      this.player.updateDom()
    }, 50)
  }
}

class GameUI {
  constructor(game) {
    this.DOM = {}
    this.DOM.canvas = document.querySelector('canvas')
    this.ctx = this.DOM.canvas.getContext('2d', {
      alpha: false,
    })

    const resize = () => {
      this.DOM.canvas.width = window.innerWidth
      this.DOM.canvas.height = window.innerHeight
    }

    addEventListener('resize', resize)
    resize()

    this.createBottomRightIndicators()
    this.createBottomLeftIndicators()
  }

  createBottomRightIndicators() {
    const el = createDomNode('indicators-bottom-right')

    this.DOM.bulletsCounter = addDomNode(el, {
      className: 'bullets-counter',
    })

    this.DOM.bulletsLeft = addDomNode(this.DOM.bulletsCounter, {
      className: 'icon',
    })

    this.DOM.bulletsCapacity = addDomNode(this.DOM.bulletsCounter, {
      className: 'subtitle',
    })

    this.DOM.thunder = addDomNode(el, {className: 'thunder-indicator'})
    addDomNode(this.DOM.thunder, {className: 'icon', tag: 'span'})
    addDomNode(this.DOM.thunder, {
      className: 'subtitle',
      tag: 'kbd',
      text: 'ENTER',
    })

    root.appendChild(el)
  }

  createBottomLeftIndicators() {
    const el = createDomNode('indicators-bottom-left')

    const texts = addDomNode(el, {className: 'texts'})
    this.DOM.levelWrap = addDomNode(texts, {className: 'level'})
    addDomNode(this.DOM.levelWrap, {
      className: 'label',
      tag: 'span',
      text: 'Level: ',
    })

    this.DOM.level = addDomNode(this.DOM.levelWrap, {
      className: 'value',
      tag: 'span',
      text: '0',
    })

    this.DOM.scoreWrap = addDomNode(texts, {className: 'scores'})
    addDomNode(this.DOM.scoreWrap, {
      className: 'label',
      tag: 'span',
      text: 'Score: ',
    })

    this.DOM.score = addDomNode(this.DOM.scoreWrap, {
      className: 'value',
      tag: 'span',
    })

    this.DOM.lifeWrap = addDomNode(el, {className: 'life'})
    this.DOM.progress = addDomNode(this.DOM.lifeWrap, {
      className: 'progress',
    })
    this.DOM.life = addDomNode(this.DOM.progress, {
      className: 'value',
      tag: 'span',
    })

    this.DOM.lifeText = addDomNode(this.DOM.lifeWrap, {
      className: 'text',
      tag: 'span',
    })

    root.appendChild(el)
  }
}
