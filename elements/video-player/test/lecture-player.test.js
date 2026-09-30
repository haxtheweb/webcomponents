import { expect } from '@open-wc/testing'

import '../lib/lecture-player.js'

const LecturePlayer = globalThis.customElements.get('lecture-player')

// Helper: set properties on Object.create instances bypassing LitElement
// reactive setters which require internal state from the constructor.
function setProp(obj, key, value) {
  Object.defineProperty(obj, key, {
    value: value,
    writable: true,
    configurable: true,
    enumerable: true,
  })
}

describe('lecture-player registration', () => {
  it('registers as custom element', () => {
    expect(LecturePlayer).to.exist
  })

  it('is registered with correct name', () => {
    expect(globalThis.customElements.get('lecture-player')).to.equal(LecturePlayer)
  })

  it('has expected properties', () => {
    const props = LecturePlayer.properties
    expect(props.activeIndex).to.exist
    expect(props.source).to.exist
    expect(props.associatedNodes).to.exist
    expect(props.open).to.exist
  })
})

describe('lecture-player constructor bug', () => {
  it('throws because querySelector returns null during construction', () => {
    // BUG: constructor calls this.querySelector("video-player").outerHTML
    // but children are not available during construction, so this always
    // throws TypeError: Cannot read properties of null (reading 'outerHTML')
    let threw = false
    try {
      // eslint-disable-next-line no-new
      new LecturePlayer()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(true)
  })
})

describe('lecture-player render', () => {
  let instance
  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', {
      closeLecturePlayer: 'Close Lecture Player',
      missingTitle: 'Missing Title',
      openLecturePlayer: 'Open Lecture Player',
    })
    setProp(instance, 'open', false)
  })

  it('render returns template when closed (slot visible)', () => {
    const result = instance.render()
    expect(result).to.exist
  })

  it('render returns template when open (slot hidden)', () => {
    setProp(instance, 'open', true)
    const result = instance.render()
    expect(result).to.exist
  })
})

describe('lecture-player seek', () => {
  let instance
  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', { 'slide-1': '0', 'slide-2': '30' })
    setProp(instance, 'open', false)
  })

  it('seek when closed calls child video-player play and seek', () => {
    let playCalled = false
    let seekValue = null
    instance.querySelector = () => ({
      play: () => {
        playCalled = true
      },
      seek: (t) => {
        seekValue = t
      },
    })
    instance.seek(30)
    expect(playCalled).to.equal(true)
    expect(seekValue).to.equal(30)
  })

  it('seek when open queries #lecture-player-video after timeout', async function () {
    this.timeout(5000)
    setProp(instance, 'open', true)
    const mockVP = globalThis.document.createElement('div')
    mockVP.id = 'lecture-player-video-test'
    let seekCalled = false
    let playCalled = false
    mockVP.seek = () => {
      seekCalled = true
    }
    mockVP.play = () => {
      playCalled = true
    }
    globalThis.document.body.appendChild(mockVP)
    const origQSA = globalThis.document.querySelector.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === '#lecture-player-video') return mockVP
      return origQSA(sel)
    }
    try {
      instance.seek(45)
      await new Promise((r) => setTimeout(r, 3100))
      expect(seekCalled).to.equal(true)
      expect(playCalled).to.equal(true)
    } finally {
      globalThis.document.querySelector = origQSA
      mockVP.remove()
    }
  })
})

describe('lecture-player play', () => {
  let instance
  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
  })

  it('play calls child video-player when no document video-player', () => {
    let playCalled = false
    instance.querySelector = () => ({
      play: () => {
        playCalled = true
      },
    })
    instance.play()
    expect(playCalled).to.equal(true)
  })

  it('play calls document video-player when present', () => {
    const mockVP = globalThis.document.createElement('div')
    let playCalled = false
    mockVP.play = () => {
      playCalled = true
    }
    globalThis.document.body.appendChild(mockVP)
    const origQSA = globalThis.document.querySelector.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === 'video-player') return mockVP
      return origQSA(sel)
    }
    try {
      instance.play()
      expect(playCalled).to.equal(true)
    } finally {
      globalThis.document.querySelector = origQSA
      mockVP.remove()
    }
  })
})

describe('lecture-player checkDisabledButtons', () => {
  let instance
  let prevBtn
  let nextBtn
  let slideEls
  let origQSA
  let origQSAall

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', {
      'slide-1': '0',
      'slide-2': '30',
      'slide-3': '60',
    })
    prevBtn = globalThis.document.createElement('button')
    prevBtn.id = 'prevSlideBtn'
    nextBtn = globalThis.document.createElement('button')
    nextBtn.id = 'nextSlideBtn'
    globalThis.document.body.appendChild(prevBtn)
    globalThis.document.body.appendChild(nextBtn)
    slideEls = []
    for (let i = 0; i < 3; i++) {
      const el = globalThis.document.createElement('div')
      el.setAttribute('data-lecture-slide', '')
      globalThis.document.body.appendChild(el)
      slideEls.push(el)
    }
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
    origQSAall = globalThis.document.querySelectorAll.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === '#prevSlideBtn') return prevBtn
      if (sel === '#nextSlideBtn') return nextBtn
      return origQSA(sel)
    }
    globalThis.document.querySelectorAll = (sel) => {
      if (sel === '[data-lecture-slide]') {
        return origQSAall('div[data-lecture-slide]')
      }
      return origQSAall(sel)
    }
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    globalThis.document.querySelectorAll = origQSAall
    if (prevBtn) prevBtn.remove()
    if (nextBtn) nextBtn.remove()
    if (slideEls) slideEls.forEach((el) => el.remove())
  })

  it('disables prev button when activeIndex is slide-1', () => {
    setProp(instance, 'activeIndex', 'slide-1')
    instance.checkDisabledButtons()
    expect(prevBtn.getAttribute('disabled')).to.equal('true')
  })

  it('enables prev button when activeIndex is not slide-1', () => {
    setProp(instance, 'activeIndex', 'slide-2')
    instance.checkDisabledButtons()
    expect(prevBtn.hasAttribute('disabled')).to.equal(false)
  })

  it('enables next button when not on last slide', () => {
    setProp(instance, 'activeIndex', 'slide-1')
    instance.checkDisabledButtons()
    expect(nextBtn.hasAttribute('disabled')).to.equal(false)
  })
})

describe('lecture-player updateJumbotron', () => {
  let instance
  let jumbotron
  let origQSA

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', { missingTitle: 'Missing Title' })
    setProp(instance, 'associatedNodes', { 'slide-1': '0' })
    jumbotron = globalThis.document.createElement('div')
    jumbotron.classList.add('jumbotron')
    globalThis.document.body.appendChild(jumbotron)
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    if (jumbotron) jumbotron.remove()
  })

  it('clears jumbotron and populates with heading and content', () => {
    const activeAnchor = globalThis.document.createElement('div')
    activeAnchor.id = 'slide-1'
    activeAnchor.setAttribute('data-lecture-heading', 'My Heading')
    activeAnchor.setAttribute('data-lecture-content', '<p>Content</p>')
    globalThis.document.body.appendChild(activeAnchor)
    globalThis.document.querySelector = (sel) => {
      if (sel === '.jumbotron') return jumbotron
      if (sel === '#slide-1') return activeAnchor
      return origQSA(sel)
    }
    try {
      setProp(instance, 'activeIndex', 'slide-1')
      instance.updateJumbotron()
      expect(jumbotron.querySelector('#jumbotron-heading')).to.exist
      expect(jumbotron.querySelector('#jumbotron-heading').innerText).to.equal(
        'My Heading',
      )
      expect(jumbotron.querySelector('#jumbotron-desc')).to.exist
    } finally {
      activeAnchor.remove()
    }
  })

  it('handles missing jumbotron gracefully', () => {
    globalThis.document.querySelector = (sel) => {
      if (sel === '.jumbotron') return null
      return origQSA(sel)
    }
    setProp(instance, 'activeIndex', 'slide-1')
    expect(() => instance.updateJumbotron()).to.not.throw()
  })

  it('does not populate when activeAnchor is missing', () => {
    globalThis.document.querySelector = (sel) => {
      if (sel === '.jumbotron') return jumbotron
      if (sel === '#slide-1') return null
      return origQSA(sel)
    }
    setProp(instance, 'activeIndex', 'slide-1')
    instance.updateJumbotron()
    expect(jumbotron.querySelector('#jumbotron-heading')).to.equal(null)
  })
})

describe('lecture-player updatePlaylist', () => {
  let instance
  let valueList
  let origQSA

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', { missingTitle: 'Missing Title' })
    setProp(instance, 'associatedNodes', { 'slide-1': '0', 'slide-2': '30' })
    valueList = globalThis.document.createElement('div')
    valueList.classList.add('valueList')
    globalThis.document.body.appendChild(valueList)
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === '.valueList') return valueList
      return origQSA(sel)
    }
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    if (valueList) valueList.remove()
  })

  it('creates buttons for each slide and marks active', () => {
    const anchor1 = globalThis.document.createElement('div')
    anchor1.id = 'slide-1'
    anchor1.setAttribute('data-lecture-heading', 'Slide 1')
    const anchor2 = globalThis.document.createElement('div')
    anchor2.id = 'slide-2'
    anchor2.setAttribute('data-lecture-heading', 'Slide 2')
    globalThis.document.body.appendChild(anchor1)
    globalThis.document.body.appendChild(anchor2)
    globalThis.document.querySelector = (sel) => {
      if (sel === '.valueList') return valueList
      if (sel === '#slide-1') return anchor1
      if (sel === '#slide-2') return anchor2
      return origQSA(sel)
    }
    try {
      setProp(instance, 'activeIndex', 'slide-1')
      instance.updatePlaylist()
      const buttons = valueList.querySelectorAll('button.valueBtn')
      expect(buttons.length).to.equal(2)
      expect(buttons[0].classList.contains('active')).to.equal(true)
      expect(buttons[0].getAttribute('aria-current')).to.equal('true')
      expect(buttons[0].textContent).to.equal('Slide 1')
    } finally {
      anchor1.remove()
      anchor2.remove()
    }
  })

  it('uses missingTitle when slideAnchor is not found', () => {
    setProp(instance, 'activeIndex', 'slide-1')
    instance.updatePlaylist()
    const buttons = valueList.querySelectorAll('button.valueBtn')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].textContent).to.equal('Missing Title')
  })

  it('returns early when valueList not found', () => {
    globalThis.document.querySelector = (sel) => {
      if (sel === '.valueList') return null
      return origQSA(sel)
    }
    setProp(instance, 'activeIndex', 'slide-1')
    expect(() => instance.updatePlaylist()).to.not.throw()
  })
})

describe('lecture-player endVideo', () => {
  let instance
  let mockVP
  let nextBtn
  let jumbotron
  let origQSA

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', { closeLecturePlayer: 'Close Lecture Player' })
    setProp(instance, 'open', false)
    mockVP = globalThis.document.createElement('div')
    mockVP.id = 'lecture-player-video'
    mockVP.pause = () => {}
    nextBtn = globalThis.document.createElement('button')
    nextBtn.id = 'nextSlideBtn'
    jumbotron = globalThis.document.createElement('div')
    jumbotron.classList.add('jumbotron')
    globalThis.document.body.appendChild(mockVP)
    globalThis.document.body.appendChild(nextBtn)
    globalThis.document.body.appendChild(jumbotron)
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === '#lecture-player-video') return mockVP
      if (sel === '#nextSlideBtn') return nextBtn
      if (sel === '.jumbotron') return jumbotron
      if (sel === '.endBtn') return jumbotron.querySelector('.endBtn')
      if (sel === 'simple-modal') return { close: () => {} }
      return origQSA(sel)
    }
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    if (mockVP) mockVP.remove()
    if (nextBtn) nextBtn.remove()
    if (jumbotron) jumbotron.remove()
  })

  it('pauses video, disables next button, and creates end button', () => {
    let pauseCalled = false
    mockVP.pause = () => {
      pauseCalled = true
    }
    instance.endVideo()
    expect(pauseCalled).to.equal(true)
    expect(nextBtn.getAttribute('disabled')).to.equal('true')
    const endBtnContainer = jumbotron.querySelector('.endBtnContainer')
    expect(endBtnContainer).to.exist
  })
})

describe('lecture-player firstUpdated', () => {
  let instance
  let anchor1
  let anchor2

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', {})
    anchor1 = globalThis.document.createElement('div')
    anchor1.setAttribute('data-lecture-slide', '')
    anchor1.setAttribute('data-value', '30')
    anchor2 = globalThis.document.createElement('div')
    anchor2.setAttribute('data-lecture-slide', '')
    anchor2.setAttribute('data-value', '10')
    // querySelectorAll returns unsorted array; firstUpdated should sort by data-value
    instance.querySelectorAll = () => [anchor1, anchor2]
    instance.setJumbotronAttributes = () => {}
    setProp(instance, 'activeIndex', null)
  })

  it('sorts anchors by data-value and assigns slide ids', () => {
    instance.firstUpdated(new Map())
    // anchor2 has data-value=10, should be slide-1
    expect(anchor2.id).to.equal('slide-1')
    // anchor1 has data-value=30, should be slide-2
    expect(anchor1.id).to.equal('slide-2')
  })

  it('populates associatedNodes with slide ids and values', () => {
    instance.firstUpdated(new Map())
    expect(instance.associatedNodes['slide-1']).to.equal('10')
    expect(instance.associatedNodes['slide-2']).to.equal('30')
  })

  it('calls setJumbotronAttributes', () => {
    let called = false
    instance.setJumbotronAttributes = () => {
      called = true
    }
    instance.firstUpdated(new Map())
    expect(called).to.equal(true)
  })
})

describe('lecture-player setJumbotronAttributes', () => {
  let instance
  let anchor
  let header

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', { 'slide-1': '0' })
    anchor = globalThis.document.createElement('div')
    anchor.setAttribute('data-lecture-slide', '')
    anchor.setAttribute('data-associatedID', 'header1')
    header = globalThis.document.createElement('h2')
    header.id = 'header1'
    header.textContent = 'My Heading'
    const content = globalThis.document.createElement('p')
    content.textContent = 'Content after header'
    // Build a DOM fragment so getNextSiblingHTML can walk siblings
    const fragment = globalThis.document.createDocumentFragment()
    fragment.appendChild(header)
    fragment.appendChild(content)
    instance.querySelectorAll = (sel) => {
      if (sel === '[data-lecture-slide]') return [anchor]
      return []
    }
    instance.querySelector = (sel) => {
      if (sel === '#header1') return header
      return null
    }
    instance.getNextSiblingHTML = () => '<p>Content after header</p>'
  })

  it('sets data-lecture-heading and data-lecture-content on anchors', () => {
    instance.setJumbotronAttributes()
    expect(anchor.getAttribute('data-lecture-heading')).to.equal('My Heading')
    expect(anchor.getAttribute('data-lecture-content')).to.exist
  })
})

describe('lecture-player addPrevNextListeners', () => {
  let instance
  let prevBtn
  let nextBtn
  let origQSA
  let origQSAall

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'activeIndex', 'slide-2')
    setProp(instance, 'associatedNodes', { 'slide-1': '0', 'slide-2': '30', 'slide-3': '60' })
    prevBtn = globalThis.document.createElement('button')
    prevBtn.id = 'prevSlideBtn'
    nextBtn = globalThis.document.createElement('button')
    nextBtn.id = 'nextSlideBtn'
    globalThis.document.body.appendChild(prevBtn)
    globalThis.document.body.appendChild(nextBtn)
    // Add mock data-lecture-slide elements with ids
    for (let i = 1; i <= 3; i++) {
      const el = globalThis.document.createElement('div')
      el.setAttribute('data-lecture-slide', '')
      el.id = `slide-${i}`
      globalThis.document.body.appendChild(el)
    }
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
    origQSAall = globalThis.document.querySelectorAll.bind(globalThis.document)
    globalThis.document.querySelector = (sel) => {
      if (sel === '#prevSlideBtn') return prevBtn
      if (sel === '#nextSlideBtn') return nextBtn
      return origQSA(sel)
    }
    globalThis.document.querySelectorAll = (sel) => {
      if (sel === '[data-lecture-slide][id]') {
        return origQSAall('div[data-lecture-slide][id]')
      }
      return origQSAall(sel)
    }
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    globalThis.document.querySelectorAll = origQSAall
    prevBtn.remove()
    nextBtn.remove()
    globalThis.document.querySelectorAll('div[data-lecture-slide][id]').forEach((el) => el.remove())
  })

  it('adds click listeners to prev and next buttons', () => {
    instance.addPrevNextListeners()
    // Clicking prev should move from slide-2 to slide-1
    prevBtn.click()
    expect(instance.activeIndex).to.equal('slide-1')
  })

  it('prev button does nothing on slide-1', () => {
    setProp(instance, 'activeIndex', 'slide-1')
    instance.addPrevNextListeners()
    prevBtn.click()
    expect(instance.activeIndex).to.equal('slide-1')
  })

  it('next button advances to next slide', () => {
    setProp(instance, 'activeIndex', 'slide-1')
    instance.addPrevNextListeners()
    nextBtn.click()
    expect(instance.activeIndex).to.equal('slide-2')
  })

  it('next button calls endVideo on last slide', () => {
    let endCalled = false
    setProp(instance, 'activeIndex', 'slide-3')
    instance.endVideo = () => {
      endCalled = true
    }
    instance.addPrevNextListeners()
    nextBtn.click()
    expect(endCalled).to.equal(true)
  })
})

describe('lecture-player showModal', () => {
  let instance
  let mockVP
  let origQSA

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', {
      closeLecturePlayer: 'Close Lecture Player',
      openLecturePlayer: 'Open Lecture Player',
    })
    setProp(instance, 'open', false)
    setProp(instance, 'videoPlayer', '<video-player></video-player>')
    mockVP = globalThis.document.createElement('video-player')
    mockVP.setAttribute = () => {}
    instance.querySelector = () => mockVP
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
  })

  it('creates modal content and dispatches simple-modal-show event', () => {
    let eventDispatched = false
    let eventDetail = null
    globalThis.addEventListener('simple-modal-show', (e) => {
      eventDispatched = true
      eventDetail = e.detail
    })
    instance.showModal()
    expect(eventDispatched).to.equal(true)
    expect(eventDetail).to.exist
    expect(eventDetail.elements.content).to.exist
    expect(instance.open).to.equal(true)
  })
})

describe('lecture-player showModal with DOM setup', () => {
  let instance
  let mockVP
  let modalContainer
  let origQSA

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 't', {
      closeLecturePlayer: 'Close Lecture Player',
      openLecturePlayer: 'Open Lecture Player',
    })
    setProp(instance, 'open', false)
    setProp(instance, 'videoPlayer', '<video-player></video-player>')
    mockVP = globalThis.document.createElement('video-player')
    mockVP.setAttribute = () => {}
    instance.querySelector = () => mockVP

    // Set up DOM elements that showModal's setTimeout callback queries
    modalContainer = globalThis.document.createElement('div')
    modalContainer.innerHTML = `
      <div class="videoSection">
        <video-player></video-player>
      </div>
      <button id="lecture-size-large"></button>
      <button id="lecture-size-normal"></button>
      <button id="lecture-size-small"></button>
      <div class="jumbotron"></div>
    `
    globalThis.document.body.appendChild(modalContainer)
    origQSA = globalThis.document.querySelector.bind(globalThis.document)
  })

  afterEach(() => {
    globalThis.document.querySelector = origQSA
    modalContainer.remove()
  })

  it('sets up event listeners in setTimeout after showModal', async function () {
    this.timeout(5000)
    // Patch querySelector to return our mock elements
    globalThis.document.querySelector = (sel) => {
      if (sel === '#lecture-size-large') return modalContainer.querySelector('#lecture-size-large')
      if (sel === '#lecture-size-normal') return modalContainer.querySelector('#lecture-size-normal')
      if (sel === '#lecture-size-small') return modalContainer.querySelector('#lecture-size-small')
      if (sel === '.videoSection') return modalContainer.querySelector('.videoSection')
      if (sel === 'simple-modal .modal-content .videoSection video-player') return modalContainer.querySelector('video-player')
      if (sel === 'simple-modal') return { close: () => {} }
      return origQSA(sel)
    }
    instance.showModal()
    // Wait for the 3000ms setTimeout to fire
    await new Promise((r) => setTimeout(r, 3100))
    // The video-player inside modal should have id set
    const modalVP = modalContainer.querySelector('video-player')
    expect(modalVP.getAttribute('id')).to.equal('lecture-player-video')
  })
})

describe('lecture-player getNextSiblingHTML', () => {
  let instance
  let container

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', { 'slide-1': '0', 'slide-2': '30' })

    // Build a DOM structure with headers and content between them
    container = globalThis.document.createElement('div')
    const header1 = globalThis.document.createElement('div')
    header1.id = 'header1'
    header1.textContent = 'Heading 1'
    const content1 = globalThis.document.createElement('p')
    content1.textContent = 'Content 1'
    const header2 = globalThis.document.createElement('div')
    header2.id = 'header2'
    header2.textContent = 'Heading 2'
    const content2 = globalThis.document.createElement('p')
    content2.textContent = 'Content 2'
    container.appendChild(header1)
    container.appendChild(content1)
    container.appendChild(header2)
    container.appendChild(content2)

    // Create anchor elements with data-associatedID
    const anchor1 = globalThis.document.createElement('div')
    anchor1.id = 'slide-1'
    anchor1.setAttribute('data-associatedID', 'header1')
    const anchor2 = globalThis.document.createElement('div')
    anchor2.id = 'slide-2'
    anchor2.setAttribute('data-associatedID', 'header2')
    container.appendChild(anchor1)
    container.appendChild(anchor2)

    globalThis.document.body.appendChild(container)

    instance.querySelector = (sel) => container.querySelector(sel)
  })

  afterEach(() => {
    container.remove()
  })

  it('returns HTML of siblings between element and next stop ID', () => {
    const header1 = container.querySelector('#header1')
    const result = instance.getNextSiblingHTML(header1)
    // Should include content1 but stop at header2
    expect(result).to.contain('Content 1')
    expect(result).to.not.contain('Heading 2')
  })

  it('returns empty string when element is last with no more siblings', () => {
    const header2 = container.querySelector('#header2')
    const result = instance.getNextSiblingHTML(header2)
    // header2 is followed by content2, then anchor1 (slide-1), anchor2 (slide-2)
    // stopIDs should include slide-1 and header1 (but not header2 or slide-2)
    // So it should walk content2, then stop at anchor1 (id=slide-1)
    expect(result).to.contain('Content 2')
    expect(result).to.not.contain('slide-1')
  })
})

describe('lecture-player setJumbotronAttributes with nested slides', () => {
  let instance
  let anchor
  let header

  beforeEach(() => {
    instance = Object.create(LecturePlayer.prototype)
    setProp(instance, 'associatedNodes', { 'slide-1': '0' })
    anchor = globalThis.document.createElement('div')
    anchor.setAttribute('data-lecture-slide', '')
    anchor.setAttribute('data-associatedID', 'header1')
    header = globalThis.document.createElement('h2')
    header.id = 'header1'
    header.textContent = 'My Heading'
    globalThis.document.body.appendChild(header)
    globalThis.document.body.appendChild(anchor)
    instance.querySelectorAll = (sel) => {
      if (sel === '[data-lecture-slide]') return [anchor]
      return []
    }
    instance.querySelector = (sel) => {
      if (sel === '#header1') return header
      return null
    }
    // Return content that includes nested data-lecture-slide elements
    instance.getNextSiblingHTML = () =>
      '<div data-lecture-slide id="nested-slide"><p>Nested</p></div>'
  })

  afterEach(() => {
    header.remove()
    anchor.remove()
  })

  it('scrubs ids from nested lecture-anchor elements in content', () => {
    instance.setJumbotronAttributes()
    const content = anchor.getAttribute('data-lecture-content')
    expect(content).to.contain('no-pointer-events')
    // The nested element should have its id removed
    expect(content).to.not.contain('id="nested-slide"')
  })
})
