import { html, fixture, expect } from '@open-wc/testing'
import '../twenty-six-theme.js'

describe('TwentySixTheme test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html` <twenty-six-theme></twenty-six-theme> `)
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })
})
