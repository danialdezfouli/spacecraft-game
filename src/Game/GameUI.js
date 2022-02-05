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
          ctx: this.ui.ctx,
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
}
