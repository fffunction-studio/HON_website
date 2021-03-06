import { CoreModule } from '../core/core-module';
import { eventBus } from '../core/event-bus';
import { CoreEvent } from '../core/core-event';

class FilterToggle extends CoreModule {
  init() {
    this.element = document.querySelector('.filter-toggle')

    if (this.element) {
      this.element.addEventListener('click', this.onClick)
    }
    
    this.events.push(
      new CoreEvent('toggle-filter-overlay', () => {
        if (document.querySelector('.filter-overlay')) {
          document.querySelector('.filter-overlay').classList.toggle('active')
        }
      })
    )
    
    this.events.push(
      new CoreEvent('scrolled-from-top', () => {
        if (document.querySelector('.filter-toggle')) {
          document.querySelector('.filter-toggle').classList.remove('disabled')
        }
      })
    )
    
    this.events.push(
      new CoreEvent('scrolled-to-top', () => {
        if (document.querySelector('.filter-toggle')) {
          document.querySelector('.filter-toggle').classList.add('disabled')
        }
      })
    )

    return super.init()
  }

  destroy() {
    if (this.element) {
      this.element.removeEventListener('click', this.onClick)
    }
  }

  onClick() {
    if (!this.classList.contains('disabled')) {
      eventBus.$emit('toggle-filter-overlay')
    }
  }
}

export const filterToggle = new FilterToggle()