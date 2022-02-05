/**
 * a class template for future classes implementations
 * should be improved to be more generic
 */

class ClassTemplate {
  constructor(options) {
    this.DOM = {}
    this.init()
  }

  init() {
    this.x = 0
    this.y = 0
    this.dx = Math.random()
    this.dy = Math.random()
    this.active = true
  }

  destroy() {
    this.active = false
  }

  reset() {}

  // add event listeners
  addEvents() {}
  removeEvents() {}

  animate() {}
  run() {
    this.addEvents()
  }

  // pause animation and events
  pause() {
    this.removeEvents()
  }

  createDom() {
    this.DOM.el = document.createElement('div')
  }

  // update Dom UI
  updateDom() {}

  /**
   * @return {Boolean}
   */
  canDoSomething() {}

  doSomething() {}
}
