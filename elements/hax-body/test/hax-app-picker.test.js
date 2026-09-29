import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/hax-app-picker.js'
import { HaxAppPicker } from '../lib/hax-app-picker.js'

describe('hax-app-picker', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-app-picker></hax-app-picker>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-app-picker')
    expect(el.title).to.equal('Select an option')
  })

  it('has static tag', () => {
    expect(HaxAppPicker.tag).to.equal('hax-app-picker')
  })

  it('has windowControllers', () => {
    expect(el.windowControllers).to.exist
  })

  describe('presentOptions', () => {
    it('stores options on the element', () => {
      const elements = [{ tag: 'test' }]
      el.presentOptions(elements, 'element', 'Pick', 'gizmo', null)
      expect(el.elements).to.equal(elements)
      expect(el.type).to.equal('element')
      expect(el.title).to.equal('Pick')
      expect(el.pickerType).to.equal('gizmo')
    })

    it('uses defaults when params omitted', () => {
      const elements = [{ tag: 'test' }]
      el.presentOptions(elements)
      expect(el.type).to.equal('element')
      expect(el.title).to.equal('Select an option')
      expect(el.pickerType).to.equal('gizmo')
    })
  })

  describe('modalToggle', () => {
    it('calls buildOptions on picker when id matches hax-picker', async () => {
      let buildCalled = false
      let receivedArgs = null
      const fakeContent = {
        children: [
          {
            buildOptions: (...args) => {
              buildCalled = true
              receivedArgs = args
            },
          },
        ],
      }
      el.elements = [{ tag: 'x' }]
      el.type = 'element'
      el.title = 'Test'
      el.pickerType = 'gizmo'
      el.target = null
      el.modalToggle({
        detail: { id: 'hax-picker', elements: { content: fakeContent } },
      })
      expect(buildCalled).to.equal(true)
      expect(receivedArgs[0]).to.equal(el.elements)
      expect(receivedArgs[1]).to.equal(el.type)
      expect(receivedArgs[2]).to.equal(el.title)
      expect(receivedArgs[3]).to.equal(el.pickerType)
    })

    it('does not call buildOptions when id does not match', () => {
      let buildCalled = false
      const fakeContent = {
        children: [
          {
            buildOptions: () => {
              buildCalled = true
            },
          },
        ],
      }
      el.modalToggle({
        detail: { id: 'other', elements: { content: fakeContent } },
      })
      expect(buildCalled).to.equal(false)
    })
  })
})
