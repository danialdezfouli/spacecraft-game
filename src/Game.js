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
    this.state = GAME_STATE.RUN
    this.stars = []

    this.DOM = {}
    this.DOM.canvas = document.querySelector('canvas')
    this.ctx = this.DOM.canvas.getContext('2d')

    const resize = () => {
      this.DOM.canvas.width = window.innerWidth
      this.DOM.canvas.height = window.innerHeight
    }

    addEventListener('resize', resize)
    resize()

    this.createStars()
    this.createBottomRightIndicators()
    this.createBottomLeftIndicators()
    this.initPlayer(player)
    this.initEnemies(true)
    this.animate()

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.pause()
      } else {
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

  pause() {
    this.state = GAME_STATE.PAUSE
    clearInterval(this.enemiesTimer)
    cancelAnimationFrame(this.animation)
  }

  run() {
    this.state = GAME_STATE.RUN
    this.initEnemies(false)
    this.animate()
  }

  initPlayer(player) {
    this.player = player
    this.player.game = this
    this.player.init()
  }

  createEnemies() {
    if (this.state !== GAME_STATE.RUN) return

    const len = Math.random() * Math.min(2 + this.player.level / 3, 10)

    for (let i = 0; i < len; i++) {
      const enemy = new Enemy({
        game: this,
        speed: this.player.level * 0.03,
      })
      this.enemies.push(enemy)
    }
  }

  initEnemies(first) {
    if (first) {
      this.enemies = []
      this.createEnemies()
    }

    this.enemiesTimer = setInterval(this.createEnemies.bind(this), 3000)
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
          ctx: this.ctx,
        }),
      )
    }
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

  draw() {
    this.stars.forEach(star => star.draw())
    this.enemies.forEach(enemy => enemy.draw())
  }

  animate() {
    this.ctx.fillStyle = '#1e1a20'
    // this.ctx.clearRect(0, 0, this.DOM.canvas.width, this.DOM.canvas.height)
    this.ctx.fillRect(0, 0, this.DOM.canvas.width, this.DOM.canvas.height)

    this.draw()

    this.animation = requestAnimationFrame(this.animate.bind(this))
  }

  gameOver() {
    this.state = GAME_STATE.OVER
    this.enemies.forEach(enemy => enemy.destroy())
    cancelAnimationFrame(this.animation)

    setTimeout(() => {
      alert('Game Over!')
      this.player.reset()
      this.state = GAME_STATE.RUN
      this.animate()
    }, 50)
  }
}
