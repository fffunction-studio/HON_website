import anime from 'animejs'

let swapperFrom = document.querySelector('.background-swapper > .from')
let swapperTo = document.querySelector('.background-swapper > .to')
let toggles = document.querySelectorAll('a[data-toggle-background]')
let sources = document.querySelectorAll('.background-source')
let backgrounds = []

sources.forEach((source) => {
  let background = source.getAttribute('src')
  backgrounds.push(background)
})

if (toggles) {
  swapperFrom.style.backgroundImage = 'url(' + backgrounds[0] + ')'

  toggles.forEach((toggle) => {
    toggle.addEventListener('mouseover', (event) => {
      if (swapperTo.classList.contains('animating')) {
        return
      }
      let index = toggle.getAttribute('data-toggle-background')

      swapperTo.classList.add('animating')
      swapperTo.style.backgroundImage = 'url(' + backgrounds[index] + ')'
      swapperTo.style.opacity = 0

      anime({
        targets: swapperTo,
        opacity: 1,
        duration: 200,
        easing: 'easeInOutExpo',
        complete: () => {
          swapperFrom.style.backgroundImage = 'url(' + backgrounds[index] + ')'
          swapperTo.classList.remove('animating')
        }
      })
    })
  })
}
