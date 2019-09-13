import './css/style.css'

import 'zenscroll'

import { core } from './js/core'
import { header, nav, footer, barbaManager } from './js/layout'
import { images, filterToggle } from './js/components'

;(function() {
  document.body.style.zoom = screen.logicalXDPI / screen.deviceXDPI;

  core.attach(header, { element: document.querySelector('.header-main') })
  core.attach(nav, { element: document.querySelector('.nav-main') }, true)
  core.attach(barbaManager)

  core.attach(images, {}, true)
  core.attach(filterToggle, {}, true)

  core.init()
})()
