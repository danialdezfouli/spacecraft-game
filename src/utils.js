export const lerp = (a, b, n) => (1 - n) * a + n * b

export const rand = (min = 0, max = 1) => Math.random() * (max - min) + min

export const createDomNode = (className, tag = 'div') => {
  const el = document.createElement(tag)

  if (className) {
    el.classList.add(...className.split(' '))
  }

  return el
}

export const styleObjectToCssText = style => {
  return Object.entries(style)
    .map(s => s.join(':'))
    .join(';')
}

export const addDomNode = (parent, {className, tag, text}) => {
  const child = createDomNode(className, tag)
  if (text) {
    child.textContent = text
  }
  parent.appendChild(child)
  return child
}
