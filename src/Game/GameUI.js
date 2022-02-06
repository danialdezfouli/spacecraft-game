import {createDomNode, addDomNode} from '../utils'
import Star from '../Star'

export class GameUI {
  constructor(game) {
    this.DOM = {}
    this.DOM.canvas = document.querySelector('canvas')
    this.ctx = this.DOM.canvas.getContext('2d', {
      alpha: false,
    })

    this.stars = []
    this.createBottomRightIndicators()
    this.createBottomLeftIndicators()
    this.createMenu()
    this.createGameOver()
    this.createStars()

    this.addEvents()
  }

  addEvents() {
    const resize = () => {
      this.DOM.canvas.width = window.innerWidth
      this.DOM.canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()
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

  draw() {
    this.stars.forEach(star => star.draw())
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

  createMenu() {
    const el = createDomNode('modal game-menu')
    el.classList.add('hidden')
    this.DOM.menu = el

    const content = addDomNode(el, {className: 'content'})

    addDomNode(content, {
      className: 'title',
      tag: 'h1',
      text: 'Spacecraft Journey',
    })

    addDomNode(content, {
      className: 'subtitle',
      tag: 'h2',
      text: 'Press ENTER to start',
    })

    root.appendChild(el)
  }

  showMenu() {
    this.DOM.menu.classList.remove('hidden')
  }

  createGameOver() {
    const el = createDomNode('modal game-over')
    el.classList.add('hidden')
    this.DOM.gameOver = el

    const content = addDomNode(el, {className: 'content'})

    this.DOM.GAMEOVER_TITLE = addDomNode(content, {
      className: 'title',
      tag: 'h1',
      text: 'Game Over',
    })

    addDomNode(content, {
      className: 'subtitle',
      tag: 'h2',
      text: 'Press ENTER to start again',
    })

    this.DOM.GAMEOVER_SCORE = addDomNode(content, {
      className: 'score',
      tag: 'p',
      text: 'Your score: 0',
    })

    this.DOM.GAMEOVER_BEST = addDomNode(content, {
      className: 'score best',
      tag: 'p',
      text: 'Your Best: 0',
    })

    this.DOM.GAMEOVER_SHARE_TWITTER = addDomNode(
      addDomNode(content, {
        tag: 'div',
      }),
      {
        className: 'share-twitter',
        tag: 'a',
        text: 'Tweet it now',
      },
    )

    this.DOM.GAMEOVER_RESTART = addDomNode(
      addDomNode(content, {
        tag: 'div',
      }),
      {
        className: 'restart',
        tag: 'button',
        text: 'Start Again',
      },
    )

    this.DOM.GAMEOVER_SHARE_TWITTER.target = '_blank'

    root.appendChild(el)
  }

  showGameOver({level, score, best, is_new_record}) {
    this.DOM.GAMEOVER_TITLE.textContent = is_new_record
      ? 'New Record!'
      : 'Game Over'
    this.DOM.GAMEOVER_SCORE.textContent = `Your score: ${score}`
    this.DOM.GAMEOVER_BEST.textContent = `Your Best: ${best}`

    this.DOM.GAMEOVER_SHARE_TWITTER.href =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(
        `Spacecraft ${level}/${score}${
          is_new_record ? '\r\nNew Record!' : ''
        }\r\nhttps://spacecraft.vercel.app/`,
      )

    this.DOM.gameOver.classList.toggle('success', is_new_record)
    this.DOM.gameOver.classList.remove('hidden')
  }

  hideModals() {
    this.DOM.menu.classList.add('hidden')
    this.DOM.gameOver.classList.add('hidden')
  }
}
