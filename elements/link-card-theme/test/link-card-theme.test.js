import { html, fixture, expect } from '@open-wc/testing'
import '../link-card-theme.js'

describe('LinkCardTheme test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html` <link-card-theme></link-card-theme> `)
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })
})