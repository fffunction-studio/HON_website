import { CoreModule } from '../core/core-module'
import { CoreEvent } from '../core/core-event'

class Footer extends CoreModule {
  init() {
    this.element = document.querySelector('.footer-main')
    this.blurryContent = document.querySelectorAll('.blur-wrapper')

    this.events.push(
      new CoreEvent('scrolled-to-bottom', () => {
        this.addBlur()
      })
    )

    this.events.push(
      new CoreEvent('scrolled-from-bottom', () => {
        this.removeBlur()
      })
    )

    return super.init()
  }

  addBlur() {
    this.blurryContent.forEach(blur => {
      blur.classList.add('active')
    })
  }

  removeBlur() {
    this.blurryContent.forEach(blur => {
      blur.classList.remove('active')
    })
  }

  destroy() {
    super.destroy()
  }

  onToggle() {

  }
}

export const footer = new Footer()
