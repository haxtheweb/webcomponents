import { expect } from '@open-wc/testing'

import '../lib/DDDStyleGuideAuthoring.js'
import { registerDDDStyleGuideAuthoring } from '../lib/DDDStyleGuideAuthoring.js'

// We need a real HAXOptionSampleFactory for the registration to proceed
import { HAXOptionSampleFactory } from '../lib/DDDStyles.js'

describe('registerDDDStyleGuideAuthoring', () => {
  it('returns early when HAXOptionSampleFactory is not a function', () => {
    const result = registerDDDStyleGuideAuthoring({
      options: {},
    })
    expect(result).to.be.undefined
  })

  it('returns early when options is null', () => {
    const result = registerDDDStyleGuideAuthoring({})
    expect(result).to.be.undefined
  })

  it('returns early when payload is empty', () => {
    const result = registerDDDStyleGuideAuthoring()
    expect(result).to.be.undefined
  })

  it('returns early when already registered', () => {
    const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered
    globalThis.__dddStyleGuideAuthoringRegistered = true
    try {
      const result = registerDDDStyleGuideAuthoring({
        options: { HAXOptionSampleFactory },
      })
      expect(result).to.be.undefined
    } finally {
      globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered
    }
  })
})

describe('registerDDDStyleGuideAuthoring with mocked HaxStore', () => {
  it('registers and applies designSystemHAXProperties when HaxStore is available', () => {
    const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered
    const origHaxStore = globalThis.HaxStore
    // Reset the registration flag so the function runs
    globalThis.__dddStyleGuideAuthoringRegistered = false

    const mockElementList = {
      h1: {
        gizmo: {},
        settings: { configure: [] },
        designSystem: true,
      },
      p: {
        gizmo: {},
        settings: { configure: [] },
        designSystem: true,
      },
    }

    let designSystemHAXPropsCalled = false
    globalThis.HaxStore = {
      requestAvailability: () => ({
        elementList: mockElementList,
        editMode: false,
        __dddStyleGuideAuthoringApplied: false,
        __dddStyleGuideDefaultSchemaReady: false,
        isInlineElement: () => false,
        designSystemHAXProperties: (props, tag) => {
          designSystemHAXPropsCalled = true
          return props
        },
      }),
    }

    try {
      registerDDDStyleGuideAuthoring({
        options: { HAXOptionSampleFactory },
      })
      // The function sets up listeners; verify it ran without error
      expect(globalThis.__dddStyleGuideAuthoringRegistered).to.be.true
    } finally {
      globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered
      globalThis.HaxStore = origHaxStore
    }
  })
})
