import { CoreModule } from '../core/core-module';
import { eventBus } from '../core/event-bus';
import { CoreEvent } from '../core/core-event';

class FilterToggle extends CoreModule {
  init() {
    this.element = document.querySelector('.filter-toggle')

    if (this.element) {
      this.element.addEventListener('click', this.onClick.bind(this))
    }
    
    this.events.push(
      new CoreEvent('toggle-filter-overlay', () => {
        if (document.querySelector('.filter-overlay')) {
          document.querySelector('.filter-overlay').classList.toggle('active')
        }
      })
    )

    return super.init()
  }

  destroy() {
    if (this.element) {
      this.element.removeEventListener('click', this.onClick.bind(this))
    }
  }

  onClick() {
    if (!this.element.classList.contains('disabled')) {
      eventBus.$emit('toggle-filter-overlay')
    }
  }
}

export const filterToggle = new FilterToggle()