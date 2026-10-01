import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import { LrndesignChart } from '../lrndesign-chart.js'
import { SimpleColors } from '@haxtheweb/simple-colors/simple-colors.js'
// lib elements must be imported directly so their own files count in coverage
import { LrndesignBar } from '../lib/lrndesign-bar.js'
import { LrndesignLine } from '../lib/lrndesign-line.js'
import { LrndesignPie } from '../lib/lrndesign-pie.js'

// the chart base class bridges in the vendored chartist build (from the
// chartist-render package) at construct time; wait for that global and its
// plugins before asserting on rendered charts
async function waitForGlobal(check, label, timeoutMs = 10000) {
  const start = Date.now()
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(label + ' did not load in time')
    }
    await aTimeout(100)
  }
  await aTimeout(300)
}

const chartistLoaded = () =>
  typeof globalThis.Chartist !== 'undefined' &&
  typeof globalThis.Chartist === 'object'

const chartistPluginsLoaded = () =>
  chartistLoaded() &&
  globalThis.Chartist.plugins &&
  globalThis.Chartist.plugins.ctAxisTitle &&
  globalThis.Chartist.plugins.ctPointLabels &&
  globalThis.Chartist.plugins.fillDonut

const slottedTable = html`
  <table>
    <thead>
      <tr>
        <th scope="col">Q1</th>
        <th scope="col">Q2</th>
        <th scope="col">Q3</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>2</td><td>3</td></tr>
      <tr><td>4</td><td>5</td><td>6</td></tr>
    </tbody>
  </table>
`

describe('lrndesign-chart mixin', () => {
  const ChartBase = LrndesignChart(SimpleColors)

  it('composes a class extending the given super class', async () => {
    expect(ChartBase).to.be.a('function')
    expect(ChartBase.tag).to.equal('lrndesign-chart')
  })

  it('exposes base properties for data binding', async () => {
    const props = ChartBase.properties
    expect(props.accentColor.attribute).to.equal('accent-color')
    expect(props.dark.attribute).to.equal('dark')
    expect(props.dark.type).to.equal(Boolean)
    expect(props.height.type).to.equal(String)
    expect(props.width.type).to.equal(String)
    expect(props.reverseData.attribute).to.equal('reverse-data')
  })

  it('defines the shared haxProperties schema', async () => {
    const hax = ChartBase.haxProperties
    expect(hax.canScale).to.equal(true)
    expect(hax.canEditSource).to.equal(true)
    expect(hax.gizmo.description).to.equal(
      'Creates an accessible chart based on a CSV.',
    )
    const configure = hax.settings.configure.map((setting) => setting.property)
    expect(configure).to.include('accentColor')
    expect(configure).to.include('dark')
    expect(configure).to.include('dataSource')
    const slots = hax.settings.configure.map((setting) => setting.slot)
    expect(slots).to.include('heading')
    expect(slots).to.include('desc')
    const scale = hax.settings.configure.filter(
      (setting) => setting.property === 'scale',
    )[0]
    expect(scale.options['ct-square']).to.exist
    expect(scale.options['ct-golden-section']).to.exist
    // the double-octave label carries no stray backtick
    expect(scale.options['ct-double-octave']).to.equal(
      'ct-double-octave  (1:4)',
    )
    const advanced = hax.settings.advanced.map((setting) => setting.property)
    expect(advanced).to.include('reverseData')
  })

  it('shares line/bar hax settings groups', async () => {
    const lineBar = ChartBase.lineBarHaxProperties
    expect(Object.keys(lineBar)).to.deep.equal([
      'gridBackground',
      'padding',
      'minMax',
      'xAxis',
      'yAxis',
    ])
    expect(lineBar.gridBackground[0].property).to.equal('showGridBackground')
    expect(lineBar.padding.map((s) => s.property)).to.deep.equal([
      'chartPaddingTop',
      'chartPaddingBottom',
      'chartPaddingLeft',
      'chartPaddingRight',
    ])
    expect(lineBar.minMax.map((s) => s.property)).to.deep.equal([
      'low',
      'high',
    ])
    expect(lineBar.xAxis.map((s) => s.property)).to.include('axisXTitle')
    expect(lineBar.xAxis.map((s) => s.property)).to.include(
      'axisXTitleAnchor',
    )
    expect(lineBar.yAxis.map((s) => s.property)).to.include('axisYTitle')
    expect(lineBar.yAxis.map((s) => s.property)).to.include('axisYTitleFlip')
  })

  it('shares line/bar property definitions', async () => {
    const props = ChartBase.lineBarProperties
    expect(props.axisXLabelOffsetX.attribute).to.equal(
      'axis-x-label-offset-x',
    )
    expect(props.axisXTitle.type).to.equal(String)
    expect(props.axisYShowLabel.type).to.equal(Boolean)
    expect(props.chartPaddingTop.attribute).to.equal('chart-padding-top')
    expect(props.showGridBackground.attribute).to.equal(
      'show-grid-background',
    )
    expect(props.high.type).to.equal(Number)
    expect(props.low.type).to.equal(Number)
  })
})

describe('lrndesign-bar', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<lrndesign-bar chart-title="Bar test">${slottedTable}</lrndesign-bar>`,
    )
    await waitForGlobal(chartistLoaded, 'Chartist')
  })

  it('is an instance of LrndesignBar with defaults', async () => {
    expect(element).to.be.instanceOf(LrndesignBar)
    expect(LrndesignBar.tag).to.equal('lrndesign-bar')
    expect(element.type).to.equal('bar')
    expect(element.dark).to.equal(false)
    expect(element.scale).to.equal('ct-minor-seventh')
    expect(element.reverseData).to.equal(false)
    expect(element.rawData).to.equal('')
    expect(element.referenceValue).to.equal(0)
    expect(element.seriesBarDistance).to.equal(15)
    expect(element.distributeSeries).to.equal(false)
    expect(element.horizontalBars).to.equal(false)
    expect(element.stackBars).to.equal(false)
    expect(element.stackMode).to.equal(true)
    expect(element.axisXOnlyInteger).to.equal(false)
    expect(element.axisXScaleMinSpace).to.equal(30)
    expect(element.axisXPosition).to.equal('end')
    expect(element.axisYPosition).to.equal('start')
    expect(element.chartPaddingBottom).to.equal(15)
  })

  it('derives chart data from the slotted table', async () => {
    expect(element.data).to.deep.equal([
      ['Q1', 'Q2', 'Q3'],
      [1, 2, 3],
      [4, 5, 6],
    ])
    expect(element.chartData).to.deep.equal({
      labels: ['Q1', 'Q2', 'Q3'],
      series: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    })
  })

  it('renders a chart once chartist is bridged in', async () => {
    expect(element.chart).to.exist
    expect(element.chart.on).to.be.a('function')
    expect(element.shadowRoot.querySelector('#chart svg')).to.exist
  })

  it('labels the chart for assistive technology', async () => {
    const chart = element.shadowRoot.querySelector('#chart')
    expect(chart.getAttribute('role')).to.equal('img')
    expect(chart.getAttribute('aria-label')).to.equal('Bar test')
    expect(chart.className).to.include('ct-minor-seventh')
    expect(element.shadowRoot.querySelector('slot[name="heading"]')).to.exist
    expect(element.shadowRoot.querySelector('slot[name="desc"]')).to.exist
  })

  it('builds bar options from properties', async () => {
    const options = element.options
    expect(options.reverseData).to.equal(false)
    expect(options.distributeSeries).to.equal(false)
    expect(options.horizontalBars).to.equal(false)
    expect(options.referenceValue).to.equal(0)
    expect(options.seriesBarDistance).to.equal(15)
    expect(options.stackBars).to.equal(false)
    expect(options.stackMode).to.equal(true)
    expect(options.axisX.onlyInteger).to.equal(false)
    expect(options.axisX.scaleMinSpace).to.equal(30)
    // the inherited lineBarOptions.axisX survives; only the bar-specific
    // onlyInteger and scaleMinSpace settings override it
    expect(options.axisX.showGrid).to.equal(true)
    expect(options.axisX.position).to.equal('end')
    expect(options.axisX.showLabel).to.equal(true)
    expect(options.axisX.labelOffset.x).to.equal(0)
    expect(options.axisX.labelOffset.y).to.equal(0)
    expect(options.axisX.labelOffset.offset).to.equal(30)
    expect(options.axisY.showGrid).to.equal(true)
    expect(options.axisY.position).to.equal('start')
    expect(options.showGridBackground).to.equal(false)
  })

  it('derives axis titles with validated anchors', async () => {
    expect(element.axisTitles).to.be.undefined
    element.axisXTitle = 'Time'
    element.axisXTitleAnchor = 'start'
    element.axisYTitle = 'Goals'
    element.axisYTitleAnchor = 'diagonal'
    await element.updateComplete
    const axisTitles = element.axisTitles
    expect(axisTitles.axisX.axisTitle).to.equal('Time')
    expect(axisTitles.axisX.textAnchor).to.equal('start')
    expect(axisTitles.axisX.offset.x).to.equal(0)
    expect(axisTitles.axisX.offset.y).to.equal(50)
    expect(axisTitles.axisY.axisTitle).to.equal('Goals')
    // invalid anchors fall back to middle
    expect(axisTitles.axisY.textAnchor).to.equal('middle')
  })

  it('wires the axis title plugin when titles change', async () => {
    await waitForGlobal(chartistPluginsLoaded, 'Chartist plugins')
    element.pluginPointLabels = undefined
    element.axisXTitle = 'Time'
    await element.updateComplete
    await aTimeout(100)
    expect(element.pluginAxisTitle.axisX.axisTitle).to.equal('Time')
    expect(element.fullOptions.plugins.length).to.equal(1)
  })

  it('pads the chart drawing area for axis titles', async () => {
    expect(element.lineBarOptions.chartPadding.bottom).to.equal(15)
    expect(element.lineBarOptions.chartPadding.left).to.equal(15)
    element.axisXTitle = 'Time'
    element.axisYTitle = 'Goals'
    await element.updateComplete
    expect(element.lineBarOptions.chartPadding.bottom).to.equal(55)
    expect(element.lineBarOptions.chartPadding.left).to.equal(45)
    expect(element.lineBarOptions.chartPadding.right).to.equal(30)
    expect(element.lineBarOptions.chartPadding.top).to.equal(35)
  })

  it('reflects dark and accent-color attributes', async () => {
    element.dark = true
    element.accentColor = 'red'
    await element.updateComplete
    expect(element.hasAttribute('dark')).to.equal(true)
    expect(element.getAttribute('accent-color')).to.equal('red')
  })

  it('extends the haxProperties schema for bars', async () => {
    const hax = LrndesignBar.haxProperties
    expect(hax.gizmo.title).to.equal('Bar Chart')
    expect(hax.gizmo.icon).to.equal('editor:insert-chart')
    const configure = hax.settings.configure.map((s) => s.property)
    expect(configure).to.include('horizontalBars')
    expect(configure).to.include('stackBars')
    expect(configure).to.include('distributeSeries')
    expect(configure).to.include('chartPaddingTop')
    expect(configure).to.include('showGridBackground')
    const advanced = hax.settings.advanced.map((s) => s.property)
    expect(advanced).to.include('low')
    expect(advanced).to.include('high')
    expect(advanced).to.include('axisXTitle')
    expect(advanced).to.include('axisYTitle')
    expect(advanced).to.include('referenceValue')
    expect(advanced).to.include('seriesBarDistance')
    expect(advanced).to.include('stackMode')
    expect(LrndesignBar.properties.axisXOnlyInteger.attribute).to.equal(
      'axis-x-only-integer',
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('lrndesign-line', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<lrndesign-line chart-title="Line test">${slottedTable}</lrndesign-line>`,
    )
    await waitForGlobal(chartistLoaded, 'Chartist')
  })

  it('is an instance of LrndesignLine with defaults', async () => {
    expect(element).to.be.instanceOf(LrndesignLine)
    expect(LrndesignLine.tag).to.equal('lrndesign-line')
    expect(element.type).to.equal('line')
    expect(element.areaBase).to.equal(0)
    expect(element.fullWidth).to.equal(false)
    expect(element.lineSmooth).to.equal(true)
    expect(element.showArea).to.equal(false)
    expect(element.showLine).to.equal(true)
    expect(element.showPoint).to.equal(true)
    expect(element.showPointLabels).to.equal(false)
    expect(element.pointLabelsAnchor).to.equal('middle')
    expect(element.pointLabelsOffsetX).to.equal(0)
    expect(element.pointLabelsOffsetY).to.equal(-10)
  })

  it('renders a line chart once chartist is bridged in', async () => {
    expect(element.chart).to.exist
    expect(element.shadowRoot.querySelector('#chart svg')).to.exist
    const options = element.options
    expect(options.areaBase).to.equal(0)
    expect(options.fullWidth).to.equal(false)
    expect(options.lineSmooth).to.equal(true)
    expect(options.showArea).to.equal(false)
    expect(options.showLine).to.equal(true)
    expect(options.showPoint).to.equal(true)
  })

  it('derives point label options with validated anchors', async () => {
    expect(element.pointLabels).to.be.undefined
    element.showPointLabels = true
    await element.updateComplete
    let labels = element.pointLabels
    expect(labels.labelOffset.x).to.equal(0)
    expect(labels.labelOffset.y).to.equal(-10)
    expect(labels.textAnchor).to.equal('middle')
    expect(labels.labelInterpolationFnc).to.be.undefined
    element.pointLabelsAnchor = 'end'
    await element.updateComplete
    labels = element.pointLabels
    expect(labels.textAnchor).to.equal('end')
    element.pointLabelsAnchor = 'diagonal'
    await element.updateComplete
    labels = element.pointLabels
    expect(labels.textAnchor).to.equal('middle')
    const fn = () => 'x'
    element.pointLabelFunction = fn
    await element.updateComplete
    expect(element.pointLabels.labelInterpolationFnc).to.equal(fn)
  })

  it('wires the point labels plugin when labels change', async () => {
    await waitForGlobal(chartistPluginsLoaded, 'Chartist plugins')
    element.pluginAxisTitle = undefined
    element.showPointLabels = true
    await element.updateComplete
    await aTimeout(100)
    expect(element.pluginPointLabels.labelOffset.y).to.equal(-10)
    expect(element.fullOptions.plugins.length).to.equal(1)
    // the plugin defaults its interpolation function to Chartist.noop
    expect(element.pluginPointLabels.labelInterpolationFnc).to.be.a(
      'function',
    )
  })

  it('extends the haxProperties schema for lines', async () => {
    const hax = LrndesignLine.haxProperties
    expect(hax.gizmo.title).to.equal('Link Chart')
    expect(hax.gizmo.icon).to.equal('editor:show-chart')
    const configure = hax.settings.configure.map((s) => s.property)
    expect(configure).to.include('showArea')
    expect(configure).to.include('showLine')
    expect(configure).to.include('showPoint')
    expect(configure).to.include('fullWidth')
    expect(configure).to.include('showPointLabels')
    const advanced = hax.settings.advanced.map((s) => s.property)
    expect(advanced).to.include('pointLabelsAnchor')
    expect(advanced).to.include('pointLabelsOffsetX')
    expect(advanced).to.include('pointLabelsOffsetY')
    expect(advanced).to.include('lineSmooth')
    expect(advanced).to.include('areaBase')
    expect(LrndesignLine.properties.showPointLabels.attribute).to.equal(
      'show-point-labels',
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('lrndesign-pie', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<lrndesign-pie chart-title="Pie test">${slottedTable}</lrndesign-pie>`,
    )
    await waitForGlobal(chartistLoaded, 'Chartist')
  })

  it('is an instance of LrndesignPie with defaults', async () => {
    expect(element).to.be.instanceOf(LrndesignPie)
    expect(LrndesignPie.tag).to.equal('lrndesign-pie')
    expect(element.type).to.equal('pie')
    expect(element.scale).to.equal('ct-square')
    expect(element.startAngle).to.equal(0)
    expect(element.chartPadding).to.equal(5)
    expect(element.donut).to.equal(false)
    expect(element.donutSolid).to.equal(false)
    expect(element.donutWidth).to.equal(20)
    expect(element.showLabel).to.equal(true)
    expect(element.labelOffset).to.equal(0)
    expect(element.labelPosition).to.equal('inside')
    expect(element.labelDirection).to.equal('neutral')
    expect(element.ignoreEmptyValues).to.equal(false)
    // chartist treats 0 as falsy and computes the sum internally, so 0 is
    // the safe default that keeps donut-style totals numeric
    expect(element.total).to.equal(0)
  })

  it('renders a pie chart once chartist is bridged in', async () => {
    expect(element.chart).to.exist
    expect(element.shadowRoot.querySelector('#chart svg')).to.exist
    expect(element.shadowRoot.querySelector('#chart').className).to.include(
      'ct-square',
    )
  })

  it('builds pie options from properties', async () => {
    const options = element.options
    expect(options.startAngle).to.equal(0)
    expect(options.chartPadding).to.equal(5)
    expect(options.donut).to.equal(false)
    expect(options.donutSolid).to.equal(false)
    expect(options.donutWidth).to.equal(20)
    expect(options.showLabel).to.equal(true)
    expect(options.labelOffset).to.equal(0)
    expect(options.labelPosition).to.equal('inside')
    expect(options.labelDirection).to.equal('neutral')
    expect(options.ignoreEmptyValues).to.equal(false)
    expect(options.reverseData).to.equal(false)
  })

  it('wires the fill donut plugin for donut pies', async () => {
    await waitForGlobal(chartistPluginsLoaded, 'Chartist plugins')
    element.pluginAxisTitle = undefined
    element.pluginPointLabels = undefined
    element.donut = true
    element.pluginFillDonutItems = [{ content: 'center', position: 'center' }]
    await element.updateComplete
    await aTimeout(100)
    expect(element.fullOptions.plugins.length).to.equal(1)
  })

  it('extends the haxProperties schema for pies', async () => {
    const hax = LrndesignPie.haxProperties
    expect(hax.gizmo.title).to.equal('Pie Chart')
    expect(hax.gizmo.icon).to.equal('editor:pie-chart')
    const configure = hax.settings.configure.map((s) => s.property)
    expect(configure).to.include('donut')
    expect(configure).to.include('showLabel')
    expect(configure).to.include('startAngle')
    expect(configure).to.include('chartPadding')
    expect(configure).to.include('total')
    expect(configure).to.include('ignoreEmptyValues')
    const advanced = hax.settings.advanced.map((s) => s.property)
    expect(advanced).to.include('donutWidth')
    expect(advanced).to.include('donutSolid')
    expect(advanced).to.include('labelDirection')
    expect(advanced).to.include('labelOffset')
    expect(advanced).to.include('labelPosition')
    expect(LrndesignPie.properties.labelPosition.attribute).to.equal(
      'label-position',
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})
