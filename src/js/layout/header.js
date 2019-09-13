import { CoreModule } from '../core/core-module'
import { CoreEvent } from '../core/core-event'

class Header extends CoreModule {
  init(options) {
    this.element = options.element
    this.toggleBackButton()

    if (this.element) {
      this.events.push(
        new CoreEvent('scrolled-from-top', () => {
          this.pin()
        })
      )

      this.events.push(
        new CoreEvent('scrolled-to-top', () => {
          this.unpin()
        })
      )

      this.events.push(
        new CoreEvent('barba-after-enter', () => {
          this.toggleBackButton()
        })
      )
    } else {
      return { id: this.id, status: false, message: 'no .header-main element' }
    }

    return super.init()
  }

  toggleBackButton() {
    let main = document.querySelector('.main')
    if (main.getAttribute('data-header-barba-back')) {
      this.element
        .querySelector('.header-barba-back')
        .classList.add('active')
    } else {
      this.element.querySelector('.header-barba-back').classList.remove('active')
    }
  }

  pin() {
    this.element.classList.add('pinned')
  }

  unpin() {
    this.element.classList.remove('pinned')
  }
}

export const header = new Header()
