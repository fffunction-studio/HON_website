import debounce from 'lodash/debounce'
import shortid from 'shortid'
import offset from 'document-offset'
//
import { CoreScrollScene } from './core-scroll-scene'
import { config } from './config'
import { eventBus } from './event-bus'
import { scrollController } from './scroll-controller'
import throttle from 'lodash/throttle'

class Core {
  constructor() {
    this.modules = []
    this.scenes = []
  }

  init() {
    this.modules.forEach((module) => {
      let init = module.init(module.options)
      if (!init.status) {
        console.error(init)
      }
    })

    this.createAnchors()
    this.createScenes()

    eventBus.$on('barba-after-enter', () => {
      this.modules.forEach((module) => {
        if (module.reinit) {
          module.destroy()
          module.init()
        }
      })

      this.scenes = []

      this.createAnchors()
      this.createScenes()
    })

    window.addEventListener(
      'resize',
      throttle((event) => {
        eventBus.$emit('window-resized', event)
      }, 250)
    )
  }

  attach(module, options = {}, reinit = false) {
    let id = shortid.generate()
    module.id = id
    module.reinit = reinit
    module.options = options

    this.modules.push(module)

    return id
  }

  detach(id) {
    if (shortid.isValid(id)) {
      this.modules.forEach((module) => {
        if (module.id === id) {
          module.destroy()
        }
      })
    }
  }

  createAnchors() {
    console.log('TCL: createAnchors -> this.scenes', this.scenes)
    let scrollAnchors = document.querySelectorAll('.scroll-anchor')
    let scrollActions = {
      showFilterToggle: () => {
        document.querySelector('.filter-toggle').classList.remove('disabled')
      },
      hideFilterToggle: () => {
        document.querySelector('.filter-toggle').classList.add('disabled')
        document.querySelector('.filter-overlay').classList.remove('active')
      }
    }

    scrollAnchors.forEach((anchor) => {
      let actionDown = anchor.getAttribute('data-action-down')
      let actionUp = anchor.getAttribute('data-action-up')
      this.scenes.push(
        new CoreScrollScene(
          () => {
            return Math.floor(offset(anchor).top + window.innerHeight / 2)
          },
          () => {
            console.log('show filter')
            scrollActions[actionDown]()
          },
          () => {
            console.log('hide filter')
            scrollActions[actionUp]()
          },
          false
        )
      )
      console.log('TCL: createAnchors -> this.scenes', this.scenes)
    })
  }

  createScenes() {
    this.scenes.push(
      new CoreScrollScene(
        () => {
          return 20
        },
        (event) => {
          eventBus.$emit('scrolled-from-top')
        },
        (event) => {
          eventBus.$emit('scrolled-to-top')
        },
        false
      )
    )

    this.scenes.push(
      new CoreScrollScene(
        () => {
          return document.body.clientHeight - window.innerHeight
        },
        (event) => {
          eventBus.$emit('scrolled-to-bottom')
        },
        (event) => {
          eventBus.$emit('scrolled-from-bottom')
        },
        true
      )
    )

    this.scenes.forEach((scene) => {
      scene.init()
    })
  }
}

const core = new Core()

export { core, config, eventBus, scrollController }
