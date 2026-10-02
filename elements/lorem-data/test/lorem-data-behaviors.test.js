import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'

import '../lorem-data.js'
import { LoremData } from '../lorem-data.js'
import { LoremDataBehaviors } from '../lib/lorem-data-behaviors.js'

// direct instance of the behaviors mixin so the lib's own method bodies
// (which the element shadows) still execute under coverage
class LoremDataBehaviorsDirect extends LoremDataBehaviors(class Base {}) {}

const SCHEMAS = {
  alpha: { type: 'word' },
  beta: { type: 'number', min: 5, max: 5 },
}

describe('lorem-data element', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('lorem-data')).to.exist
    expect(LoremData.tag).to.equal('lorem-data')
  })

  it('defaults schemas and download url state', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    expect(el.schemas).to.deep.equal({})
    expect(el.__downloadUrls).to.deep.equal({})
    // no schemas renders just the two Save All buttons
    expect(el.shadowRoot.querySelectorAll('button').length).to.equal(2)
    expect(el.shadowRoot.querySelectorAll('a').length).to.equal(0)
  })

  it('renders a textarea and download link per schema', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    el.schemas = SCHEMAS
    await el.updateComplete
    const links = el.shadowRoot.querySelectorAll('a')
    expect(links.length).to.equal(2)
    const hrefs = []
    links.forEach((a) => hrefs.push(a.getAttribute('href')))
    expect(hrefs[0]).to.contain('blob:')
    expect(hrefs[1]).to.contain('blob:')
    const textareas = el.shadowRoot.querySelectorAll('textarea')
    expect(textareas.length).to.equal(2)
    // textarea content is JSON of generated data
    const parsed = JSON.parse(textareas[1].value)
    expect(parsed).to.equal(5)
    // download attribute carries the schema key
    expect(links[1].getAttribute('download')).to.equal('beta')
  })

  it('getJson serializes generated data', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    const json = el.getJson({ type: 'number', min: 7, max: 7 })
    expect(JSON.parse(json)).to.equal(7)
  })

  it('data getter generates an object per schema', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    el.schemas = SCHEMAS
    await el.updateComplete
    const data = el.data
    expect(Object.keys(data).sort()).to.deep.equal(['alpha', 'beta'])
    expect(data.beta).to.equal(5)
    expect(el.words).to.include(data.alpha)
  })

  it('saveDataUrl creates and re-creates blob urls per key', async () => {
    const revokeSpy = sinon.spy(globalThis.URL, 'revokeObjectURL')
    try {
      const el = await fixture(html`<lorem-data></lorem-data>`)
      const url1 = el.saveDataUrl({ type: 'word' }, 'alpha')
      expect(url1).to.contain('blob:')
      expect(el.__downloadUrls.alpha).to.equal(url1)
      const url2 = el.saveDataUrl({ type: 'word' }, 'alpha')
      expect(url2).to.contain('blob:')
      // the previous url for the same key was revoked first
      expect(revokeSpy.calledWith(url1)).to.equal(true)
      expect(el.__downloadUrls.alpha).to.equal(url2)
    } finally {
      revokeSpy.restore()
    }
  })

  it('revokes urls for schemas removed on update', async () => {
    const revokeSpy = sinon.spy(globalThis.URL, 'revokeObjectURL')
    try {
      const el = await fixture(html`<lorem-data></lorem-data>`)
      el.schemas = SCHEMAS
      await el.updateComplete
      expect(Object.keys(el.__downloadUrls).sort()).to.deep.equal([
        'alpha',
        'beta',
      ])
      el.schemas = { alpha: { type: 'word' } }
      await el.updateComplete
      // only the still-active schema key keeps a url
      expect(Object.keys(el.__downloadUrls)).to.deep.equal(['alpha'])
      expect(revokeSpy.called).to.equal(true)
    } finally {
      revokeSpy.restore()
    }
  })

  it('revokes all download urls on disconnect', async () => {
    const revokeSpy = sinon.spy(globalThis.URL, 'revokeObjectURL')
    try {
      const container = globalThis.document.createElement('div')
      container.innerHTML = '<lorem-data></lorem-data>'
      globalThis.document.body.appendChild(container)
      const el = container.querySelector('lorem-data')
      el.schemas = SCHEMAS
      await el.updateComplete
      expect(Object.keys(el.__downloadUrls).length).to.equal(2)
      container.remove()
      expect(el.__downloadUrls).to.deep.equal({})
      expect(revokeSpy.called).to.equal(true)
    } finally {
      revokeSpy.restore()
    }
  })

  it('saveAll clicks every link only after confirm', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    el.schemas = SCHEMAS
    await el.updateComplete
    const clickStub = sinon.stub(HTMLAnchorElement.prototype, 'click')
    const confirmStub = sinon.stub(globalThis, 'confirm')
    try {
      confirmStub.returns(false)
      el.saveAll()
      expect(clickStub.callCount).to.equal(0)
      confirmStub.returns(true)
      el.saveAll()
      expect(clickStub.callCount).to.equal(2)
      // one confirm per saveAll invocation
      expect(confirmStub.callCount).to.equal(2)
    } finally {
      clickStub.restore()
      confirmStub.restore()
    }
  })

  it('filterQuery applies the filter callback to each record', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    // records.filter now receives a real (record, index) callback
    // (haxtheweb/issues#3102)
    expect(
      el.filterQuery([1, 2, 3], (record) => record > 1),
    ).to.deep.equal([2, 3])
    expect(
      el.filterQuery([1, 2, 3], (record, index) => index === 0),
    ).to.deep.equal([1])
  })

  it('randomIcon(true) returns a valid icon or an empty string', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    // includeNull now picks between the icon name and "" as array
    // options (haxtheweb/issues#3102) - never a stray single character
    let sawIcon = false
    let sawEmpty = false
    for (let i = 0; i < 30; i++) {
      const icon = el.randomIcon(true)
      expect(icon === '' || el.icons.includes(icon)).to.equal(true)
      if (icon === '') {
        sawEmpty = true
      } else {
        sawIcon = true
      }
    }
    expect(sawIcon).to.equal(true)
    expect(sawEmpty).to.equal(true)
    // without includeNull real icon names come back
    expect(el.icons).to.include(el.randomIcon(false))
  })

  it('colors and words and text and icons getters', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    expect(el.text).to.contain('Lorem ipsum')
    expect(el.words.length).to.be.above(0)
    el.words.forEach((w) => expect(w).to.equal(w.toLowerCase()))
    expect(el.icons.length).to.be.above(0)
    el.icons.forEach((i) => expect(typeof i).to.equal('string'))
    if (Array.isArray(el.colors)) {
      expect(el.colors.length).to.be.above(0)
      expect(el.colors).to.include(el.randomColor())
    } else {
      expect(el.colors).to.equal(false)
    }
  })

  it('passes the a11y audit with rendered schemas', async () => {
    const el = await fixture(html`<lorem-data></lorem-data>`)
    el.schemas = SCHEMAS
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('lorem-data generators (element)', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<lorem-data></lorem-data>`)
  })

  it('addDays/addHours/addMinutes/addSeconds/addWeeks/addYears add offsets', () => {
    const start = '2020-01-01T00:00:00Z'
    expect(el.addDays(start, 2).getTime()).to.equal(
      Date.parse(start) + 2 * 86400000,
    )
    expect(el.addHours(start, 3).getTime()).to.equal(
      Date.parse(start) + 3 * 3600000,
    )
    expect(el.addMinutes(start, 4).getTime()).to.equal(
      Date.parse(start) + 4 * 60000,
    )
    expect(el.addSeconds(start, 5).getTime()).to.equal(
      Date.parse(start) + 5 * 1000,
    )
    expect(el.addWeeks(start, 1).getTime()).to.equal(
      Date.parse(start) + 604800000,
    )
    expect(el.addYears(start, 1).getTime()).to.equal(
      Date.parse(start) + 31536000000,
    )
  })

  it('dateFormat formats long, short and default with year rules', () => {
    expect(el.dateFormat(null)).to.equal('')
    expect(el.dateFormat('2021-06-15', 'long')).to.contain('2021')
    expect(el.dateFormat('2021-06-15', 'short')).to.not.contain('2021')
    expect(el.dateFormat('2021-06-15')).to.contain('2021')
  })

  it('draw slices between min and max from a shuffled array', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8]
    const drawn = el.draw(source, 2, 2)
    expect(drawn.length).to.equal(2)
    drawn.forEach((item) => expect(source).to.include(item))
    expect(el.draw(source, 0, 0)).to.deep.equal([])
    const ranged = el.draw(source, 2, 4)
    expect(ranged.length).to.be.at.least(2)
    expect(ranged.length).to.be.at.most(3)
  })

  it('shuffle keeps the same members', () => {
    const shuffled = el.shuffle([1, 2, 3, 4, 5])
    expect(shuffled.sort().join('')).to.equal('12345')
  })

  it('sortDates sorts newest first or oldest first', () => {
    const records = [
      { date: '2020-06-01' },
      { date: '2021-01-01' },
      { date: 1600000000000 },
    ]
    const newest = el.sortDates(records.map((r) => r)).map((r) => r.date)
    expect(newest[0]).to.equal('2021-01-01')
    expect(newest[2]).to.equal('2020-06-01')
    const oldest = el
      .sortDates(records.map((r) => r), true)
      .map((r) => r.date)
    expect(oldest[0]).to.equal('2020-06-01')
    expect(oldest[2]).to.equal('2021-01-01')
  })

  it('titleCase uppercases each word', () => {
    expect(el.titleCase('hello world')).to.equal('Hello World')
  })

  it('randomNumber honors min, max and step', () => {
    expect(el.randomNumber(3, 3)).to.equal(3)
    for (let i = 0; i < 20; i++) {
      const n = el.randomNumber(0, 10, 2)
      expect(n % 2).to.equal(0)
      expect(n).to.be.at.least(0)
      expect(n).to.be.at.most(8)
      const d = el.randomNumber()
      expect(d).to.be.at.least(0)
      expect(d).to.be.at.most(99)
    }
  })

  it('randomDate covers every unit exactly with min == max', () => {
    const start = 1000
    expect(el.randomDate(start, 'milliseconds', 2, 2)).to.equal(1002)
    expect(el.randomDate(start, 'seconds', 1, 1)).to.equal(1000 + 1000)
    expect(el.randomDate(start, 'minutes', 1, 1)).to.equal(1000 + 60000)
    expect(el.randomDate(start, 'hours', 1, 1)).to.equal(1000 + 3600000)
    expect(el.randomDate(start, 'days', 1, 1)).to.equal(1000 + 86400000)
    expect(el.randomDate(start, 'weeks', 1, 1)).to.equal(1000 + 604800000)
    expect(el.randomDate(start, 'years', 1, 1)).to.equal(1000 + 31536000000)
    expect(el.randomDate(start, 'other', 1, 1)).to.equal(1000 + 31536000000)
  })

  it('randomHex makes six hex digits', () => {
    expect(el.randomHex()).to.match(/^#[0-9a-f]{6}$/)
  })

  it('randomAspect and default ranges', () => {
    expect(el.randomAspect(100, 100, 200, 200)).to.equal('100/200')
    expect(el.randomAspect()).to.match(/^\d+\/\d+$/)
  })

  it('randomBool returns a boolean', () => {
    expect(typeof el.randomBool()).to.equal('boolean')
  })

  it('randomArray builds the requested number of items', () => {
    const arr = el.randomArray({ type: 'number', min: 2, max: 2 }, 3, 3)
    expect(arr.length).to.equal(3)
    arr.forEach((item) => expect(item).to.equal(2))
  })

  it('randomObject maps every key through randomType', () => {
    const obj = el.randomObject({
      a: { type: 'number', min: 4, max: 4 },
      b: { type: 'boolean' },
    })
    expect(obj.a).to.equal(4)
    expect(typeof obj.b).to.equal('boolean')
  })

  it('randomOption picks from options or undefined', () => {
    expect(['a', 'b']).to.include(el.randomOption(['a', 'b']))
    expect(el.randomOption([])).to.equal(undefined)
    expect(el.randomOption()).to.equal(undefined)
    expect('abcdefghijklmnopqrstuvwxyz').to.contain(
      el.randomOption('abcdefghijklmnopqrstuvwxyz'),
    )
  })

  it('randomWeightedOption weights values', () => {
    expect(el.randomWeightedOption([{ value: 'only', weight: 1 }])).to.equal(
      'only',
    )
    expect(el.randomWeightedOption([])).to.equal(undefined)
    expect(el.randomWeightedOption()).to.equal(undefined)
  })

  it('randomWord and randomSentence and randomParagraph shapes', () => {
    expect(el.words).to.include(el.randomWord())
    const sentence = el.randomSentence(2, 4)
    expect(sentence).to.match(/^[A-Z].+[.?!]$/)
    const paragraph = el.randomParagraph(1, 2, 2, 4)
    expect(paragraph).to.match(/[.?!]$/)
  })

  it('randomLink builds url, text and type', () => {
    const pdf = el.randomLink('pdf', 2, 2)
    expect(pdf.url).to.match(/^http:\/\/[a-z]+\.com\/[a-z/]+\.pdf$/)
    expect(pdf.type).to.equal('pdf')
    expect(pdf.text.split(' ').length).to.equal(2)
    const any = el.randomLink()
    expect(['url', 'pdf']).to.include(any.type)
  })

  it('randomPlaceImg builds placeimg urls per filter and topic', () => {
    expect(el.randomPlaceImg('16/9', 'greyscale', 'cats')).to.equal(
      '//placeimg.com/16/9/cats/greyscale',
    )
    expect(el.randomPlaceImg('16/9', 'sepia')).to.equal(
      '//placeimg.com/16/9/any/sepia',
    )
    // an empty filter is falsy so it falls through to the weighted random
    // choice (same contract as randomPicsum); assert the url shape instead
    // of one weighted outcome so this is not a ~29% coin flip per run
    expect(el.randomPlaceImg('16/9', '')).to.match(
      /^\/\/placeimg\.com\/16\/9\/any(\/greyscale|\/sepia)?$/,
    )
    expect(el.randomPlaceImg('16/9')).to.match(
      /^\/\/placeimg\.com\/16\/9\/any(\/greyscale|\/sepia)?$/,
    )
  })

  it('randomPicsum builds picsum urls with params', () => {
    // well-formed url: no stray trailing slash before the query
    // (haxtheweb/issues#3102)
    expect(el.randomPicsum('16/9', true, 2, 5)).to.equal(
      'https://picsum.photos/id/5/16/9?greyscale&blur=2',
    )
    // greyscale false falls through to a weighted 3:1 random choice
    expect(el.randomPicsum('16/9', false, 0, 3)).to.match(
      /^https:\/\/picsum\.photos\/id\/3\/16\/9(\?greyscale)?$/,
    )
    // no id no longer leaves an empty segment / double slash
    expect(el.randomPicsum('16/9', false, 0)).to.match(
      /^https:\/\/picsum\.photos\/16\/9(\?greyscale)?$/,
    )
  })

  it('randomKitten returns a placehold.co url', () => {
    expect(el.randomKitten('4/3')).to.equal('https://placehold.co/4/3')
  })

  it('randomFlickr builds loremflickr urls', () => {
    expect(el.randomFlickr('16/9', ['cat', 'dog'], true, 7)).to.equal(
      'https://loremflickr.com/16/9/cat,dog/all?random=7',
    )
    expect(el.randomFlickr('16/9', ['cat'], false)).to.equal(
      'https://loremflickr.com/16/9/cat',
    )
    expect(el.randomFlickr('16/9', [])).to.equal('https://loremflickr.com/16/9')
  })

  it('randomProfileImage maps area to size and topic to person', () => {
    expect(el.randomProfileImage('100/100', 'man', 5)).to.equal(
      'https://randomuser.me/api/portraits/men/5.jpg',
    )
    expect(el.randomProfileImage('10/10', 'woman', 7)).to.equal(
      'https://randomuser.me/api/portraits/thumb/women/7.jpg',
    )
    expect(el.randomProfileImage('10/30', 'person', 9)).to.contain(
      'https://randomuser.me/api/portraits/med/',
    )
    expect(el.randomProfileImage('10/30', 'person', 9)).to.match(
      /\/(men|women)\/9\.jpg$/,
    )
  })

  it('randomImage routes by topic and multiple', () => {
    expect(el.randomImage('16/9', false, 'man')).to.contain(
      'https://randomuser.me/api/portraits/',
    )
    expect(el.randomImage('16/9', false)).to.contain('//placeimg.com/16/9/')
    expect(el.randomImage('16/9', true, 'any', 3)).to.equal(
      'https://picsum.photos/id/3/16/9?greyscale',
    )
    expect(el.randomImage('16/9', false, 'dog', 4)).to.equal(
      'https://loremflickr.com/16/9/dog?random=4',
    )
  })

  it('randomImageData bundles src, alt and longdesc', () => {
    const d = el.randomImageData('16/9', true, 'dog', 4)
    expect(d.src).to.equal('https://loremflickr.com/16/9/dog?random=4')
    expect(d.alt).to.equal('Random dog image #4')
    expect(d.longdesc).to.contain('This is a long description for image #4.')
    const bare = el.randomImageData()
    expect(bare.alt).to.equal('Random image')
    expect(bare.longdesc).to.contain('This is a long description for image.')
  })

  it('randomType covers every schema type', () => {
    expect(Array.isArray(el.randomType({ type: 'array', children: { type: 'number', min: 2, max: 2 }, min: 2, max: 2 }))).to.equal(true)
    expect(typeof el.randomType({ type: 'boolean' })).to.equal('boolean')
    expect(el.randomType({ type: 'data', data: ['fixed'] })).to.deep.equal([
      'fixed',
    ])
    expect(el.randomType({ type: 'date', start: 1000, units: 'days', min: 1, max: 1 })).to.equal(1000 + 86400000)
    expect(el.randomType({ type: 'hex' })).to.match(/^#[0-9a-f]{6}$/)
    expect(el.icons).to.include(el.randomType({ type: 'icon' }))
    expect(el.randomType({ type: 'image', aspect: '16/9', greyscale: false })).to.contain('//placeimg.com/16/9/')
    const imgData = el.randomType({ type: 'imageData', aspect: '16/9', greyscale: false, topic: 'dog', multiple: 4 })
    expect(imgData.alt).to.equal('Random dog image #4')
    expect(el.randomType({ type: 'letter' })).to.match(/^[a-z]$/)
    expect(el.randomType({ type: 'link', filetype: 'pdf', minPath: 2, maxPath: 2 }).url).to.contain('.pdf')
    expect(el.randomType({ type: 'number', min: 6, max: 6 })).to.equal(6)
    expect(el.randomType({ type: 'object', schema: { n: { type: 'number', min: 3, max: 3 } } }).n).to.equal(3)
    expect(['x', 'y']).to.include(el.randomType({ type: 'option', options: ['x', 'y'] }))
    expect(el.randomType({ type: 'option', weightedOptions: [{ value: 'w', weight: 1 }] })).to.equal('w')
    expect(el.randomType({ type: 'paragraph', min: 1, max: 2, wordMinPerSent: 2, wordMaxPerSent: 4 })).to.match(/[.?!]$/)
    expect(el.randomType({ type: 'sentence', min: 2, max: 4 })).to.match(/^[A-Z].+[.?!]$/)
    expect(el.words).to.include(el.randomType({ type: 'word' }))
    // unknown type falls back to a word
    expect(el.words).to.include(el.randomType({ type: 'bogus' }))
    // color schema pulls from the SimpleColors shared palette
    const colorVal = el.randomType({ type: 'color' })
    if (Array.isArray(el.colors)) {
      expect(el.colors).to.include(colorVal)
    } else {
      expect(colorVal).to.equal(undefined)
    }
    // no type at all yields undefined
    expect(el.randomType({})).to.equal(undefined)
    // the schema = {} default (haxtheweb/issues#3102) makes a
    // no-argument call return undefined instead of throwing
    expect(el.randomType()).to.equal(undefined)
  })
})

describe('lorem-data behaviors lib (direct instance)', () => {
  let lib
  beforeEach(() => {
    lib = new LoremDataBehaviorsDirect()
  })

  it('exposes lorem text, words, icons and colors', () => {
    expect(lib.text).to.contain('Lorem ipsum')
    expect(lib.words.length).to.be.above(0)
    expect(lib.words).to.include(lib.randomWord())
    expect(lib.icons.length).to.be.above(0)
    if (Array.isArray(lib.colors)) {
      expect(lib.colors).to.include(lib.randomColor())
    } else {
      expect(lib.colors).to.equal(false)
    }
  })

  it('camelToKebab and kebabToCamel convert names', () => {
    expect(lib.camelToKebab('fooBarBaz')).to.equal('foo-bar-baz')
    expect(lib.camelToKebab('')).to.equal(undefined)
    expect(lib.kebabToCamel('foo-bar-baz')).to.equal('fooBarBaz')
    expect(lib.kebabToCamel('')).to.equal(undefined)
  })

  it('add* date helpers match the offset math', () => {
    const start = '2020-01-01T00:00:00Z'
    expect(lib.addDays(start, 2).getTime()).to.equal(Date.parse(start) + 172800000)
    expect(lib.addHours(start, 2).getTime()).to.equal(Date.parse(start) + 7200000)
    expect(lib.addMinutes(start, 2).getTime()).to.equal(Date.parse(start) + 120000)
    expect(lib.addSeconds(start, 2).getTime()).to.equal(Date.parse(start) + 2000)
    expect(lib.addWeeks(start, 2).getTime()).to.equal(Date.parse(start) + 1209600000)
    expect(lib.addYears(start, 2).getTime()).to.equal(Date.parse(start) + 63072000000)
  })

  it('dateFormat long/short/default/null', () => {
    expect(lib.dateFormat(null)).to.equal('')
    expect(lib.dateFormat('2021-06-15', 'long')).to.contain('2021')
    expect(lib.dateFormat('2021-06-15', 'short')).to.not.contain('2021')
    expect(lib.dateFormat('2021-06-15')).to.contain('2021')
  })

  it('draw, shuffle, sortDates, titleCase', () => {
    const drawn = lib.draw([1, 2, 3, 4], 2, 2)
    expect(drawn.length).to.equal(2)
    expect(lib.draw([1], 0, 0)).to.deep.equal([])
    expect(lib.shuffle([1, 2, 3]).sort().join('')).to.equal('123')
    const sorted = lib.sortDates(
      [{ date: '2020-06-01' }, { date: '2021-01-01' }],
      true,
    )
    expect(sorted[0].date).to.equal('2020-06-01')
    expect(lib.titleCase('lorem ipsum')).to.equal('Lorem Ipsum')
  })

  it('random generators mirror the element surface', () => {
    expect(lib.randomNumber(3, 3)).to.equal(3)
    expect(lib.randomAspect(100, 100, 200, 200)).to.equal('100/200')
    expect(typeof lib.randomBool()).to.equal('boolean')
    expect(lib.randomHex()).to.match(/^#[0-9a-f]{6}$/)
    expect(lib.randomDate(1000, 'hours', 1, 1)).to.equal(1000 + 3600000)
    expect(['a', 'b']).to.include(lib.randomOption(['a', 'b']))
    expect(lib.randomOption([])).to.equal(undefined)
    expect(lib.randomWeightedOption([{ value: 'x', weight: 2 }])).to.equal('x')
    expect(lib.randomPicsum('16/9', true, 2, 5)).to.equal(
      'https://picsum.photos/id/5/16/9?greyscale&blur=2',
    )
    // greyscale unset falls to a weighted random choice
    expect(lib.randomPicsum('16/9', false, 0, 3)).to.match(
      /^https:\/\/picsum\.photos\/id\/3\/16\/9(\?greyscale)?$/,
    )
    // every date unit branch
    expect(lib.randomDate(1000, 'milliseconds', 2, 2)).to.equal(1002)
    expect(lib.randomDate(1000, 'seconds', 1, 1)).to.equal(1000 + 1000)
    expect(lib.randomDate(1000, 'minutes', 1, 1)).to.equal(1000 + 60000)
    expect(lib.randomDate(1000, 'days', 1, 1)).to.equal(1000 + 86400000)
    expect(lib.randomDate(1000, 'weeks', 1, 1)).to.equal(1000 + 604800000)
    expect(lib.randomDate(1000, 'years', 1, 1)).to.equal(1000 + 31536000000)
    expect(lib.randomDate(1000, 'other', 1, 1)).to.equal(1000 + 31536000000)
    expect(lib.randomPlaceImg('16/9', 'sepia', 'cats')).to.equal(
      '//placeimg.com/16/9/cats/sepia',
    )
    expect(lib.randomKitten('4/3')).to.equal('https://placehold.co/4/3')
    expect(lib.randomFlickr('16/9', ['cat'], true, 7)).to.equal(
      'https://loremflickr.com/16/9/cat/all?random=7',
    )
    expect(lib.randomProfileImage('100/100', 'man', 5)).to.equal(
      'https://randomuser.me/api/portraits/men/5.jpg',
    )
    expect(lib.randomImage('16/9', false, 'dog', 4)).to.equal(
      'https://loremflickr.com/16/9/dog?random=4',
    )
    const data = lib.randomImageData('16/9', false, 'dog', 4)
    expect(data.alt).to.equal('Random dog image #4')
    expect(lib.randomLink('pdf', 2, 2).url).to.match(/\.pdf$/)
    const arr = lib.randomArray({ type: 'number', min: 2, max: 2 }, 2, 2)
    expect(arr.length).to.equal(2)
    const obj = lib.randomObject({ n: { type: 'number', min: 3, max: 3 } })
    expect(obj.n).to.equal(3)
    expect(lib.randomSentence(2, 4)).to.match(/^[A-Z].+[.?!]$/)
    expect(lib.randomParagraph(1, 2, 2, 4)).to.match(/[.?!]$/)
  })

  it('randomPhrase and randomPassage are lib-only generators', () => {
    const phrase = lib.randomPhrase(1, 1, false, false)
    expect(phrase).to.match(/^[a-z]/)
    expect(phrase.split(' ').length).to.equal(2)
    const titled = lib.randomPhrase(2, 5, true, true)
    expect(titled).to.match(/^[A-Z]/)
    expect(titled.split(' ').length).to.be.at.least(3)
    expect(titled.split(' ').length).to.be.at.most(5)
    const passage = lib.randomPassage(2, 2, 1, 2, 2, 4)
    expect(passage.match(/<p>/g).length).to.equal(2)
    expect(passage).to.match(/^<p>.*<\/p>$/)
  })

  it('lib randomType covers every schema type', () => {
    expect(Array.isArray(lib.randomType({ type: 'array', children: { type: 'word' }, min: 1, max: 1 }))).to.equal(true)
    expect(typeof lib.randomType({ type: 'boolean' })).to.equal('boolean')
    const libColor = lib.randomType({ type: 'color' })
    if (Array.isArray(lib.colors)) {
      expect(lib.colors).to.include(libColor)
    } else {
      expect(libColor).to.equal(undefined)
    }
    expect(lib.randomType({ type: 'data', data: 'fixed' })).to.equal('fixed')
    expect(lib.randomType({ type: 'date', start: 1000, units: 'days', min: 1, max: 1 })).to.equal(1000 + 86400000)
    expect(lib.randomType({ type: 'hex' })).to.match(/^#[0-9a-f]{6}$/)
    expect(lib.icons).to.include(lib.randomType({ type: 'icon' }))
    expect(lib.randomType({ type: 'image' })).to.contain('placeimg')
    expect(lib.randomType({ type: 'imageData' }).alt).to.exist
    expect(lib.randomType({ type: 'letter' })).to.match(/^[a-z]$/)
    expect(lib.randomType({ type: 'link' }).url).to.match(/^http:\/\//)
    expect(lib.randomType({ type: 'number', min: 6, max: 6 })).to.equal(6)
    expect(lib.randomType({ type: 'object', schema: {} })).to.deep.equal({})
    expect(['x', 'y']).to.include(lib.randomType({ type: 'option', options: ['x', 'y'] }))
    expect(lib.randomType({ type: 'paragraph', min: 1, max: 1, wordMinPerSent: 2, wordMaxPerSent: 4 })).to.match(/[.?!]$/)
    expect(lib.randomType({ type: 'sentence', min: 2, max: 4 })).to.match(/^[A-Z].+[.?!]$/)
    expect(lib.words).to.include(lib.randomType({ type: 'word' }))
    expect(lib.words).to.include(lib.randomType({ type: 'bogus' }))
    expect(lib.randomType({})).to.equal(undefined)
    // the lib schema = {} default (haxtheweb/issues#3102) also makes a
    // no-argument call safe
    expect(lib.randomType()).to.equal(undefined)
  })
})
