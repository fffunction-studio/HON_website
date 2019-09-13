import { eventBus } from '../core'
import { CoreModule } from '../core/core-module'
import { CoreEvent } from '../core/core-event'

class Nav extends CoreModule {
  init(options) {
    this.element = this.options.element
    this.burger = document.querySelector('.burger')
    this.blurryContent = document.querySelectorAll('.blur-wrapper')
    this.addEventListeners()

    this.toggles = document.querySelectorAll('.toggle-menu')
    this.toggles.forEach((toggle) => {
      toggle.addEventListener('click', this.onToggle)
    })

    this.closers = document.querySelectorAll('.close-menu')
    this.closers.forEach((closer) => {
      closer.addEventListener('click', this.onClose)
    })


    this.events.push(
      new CoreEvent('barba-before-enter', () => {
        this.removeBlur()
      })
    )

    return super.init()
  }

  destroy() {
    super.destroy()

    this.toggles.forEach((toggle) => {
      toggle.removeEventListener('click', this.onToggle)
    })

    this.closers.forEach((closer) => {
      closer.removeEventListener('click', this.onClose)
    })
  }

  removeBlur() {
    this.blurryContent.forEach(blur => {
      blur.classList.remove('active')
    })
  }

  onToggle(event, options) {
    eventBus.$emit('toggle-menu', event)
  }

  onClose(event) {
    eventBus.$emit('close-menu', event)
  }

  addEventListeners() {
    this.events.push(
      new CoreEvent('toggle-menu', () => {
        this.toggleMenu()
      })
    )

    this.events.push(
      new CoreEvent('close-menu', () => {
        this.closeMenu()
      })
    )

    this.events.push(
      new CoreEvent('window-resized', () => {
        if (window.innerWidth >= 1024) {
          this.closeMenu()
        }
      })
    )
  }

  closeMenu() {
    if (this.element.classList.contains('animating')) {
      return
    }

    if (this.element.classList.contains('active')) {
      this.element.classList.remove('active')
      this.burger.classList.remove('active')
      this.element.classList.add('animating')
      setTimeout(() => {
        this.element.classList.remove('animating')
      }, 400)
    }
  }

  toggleMenu() {
    if (this.element.classList.contains('animating')) {
      return
    }

    if (this.element.classList.contains('active')) {
      this.blurryContent.forEach(blur => {
        blur.classList.remove('active')
      })
      this.burger.classList.remove('active')
      this.element.classList.remove('active')
      this.element.classList.add('animating')
      setTimeout(() => {
        this.element.classList.remove('animating')
      }, 400)
    } else {
      this.blurryContent.forEach(blur => {
        blur.classList.add('active')
      })
      this.burger.classList.add('active')
      this.element.classList.add('active')
      this.element.classList.add('animating')
      setTimeout(() => {
        this.element.classList.remove('animating')
      }, 400)
    }
  }
}

export const nav = new Nav()
