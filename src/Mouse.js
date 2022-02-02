const mouse = {
  x: undefined,
  y: undefined,
  percentage: {
    x: 0,
    y: 0,
  },
}

addEventListener('mousemove', function (event) {
  mouse.x = event.clientX
  mouse.y = event.clientY

  mouse.percentage.x = mouse.x / innerWidth
  mouse.percentage.y = mouse.y / innerHeight
})

export default mouse
