function isBootstrapActiveSystem(manager = null) {
  let activeManager = manager
  if (
    !activeManager &&
    globalThis.DesignSystemManager &&
    typeof globalThis.DesignSystemManager.requestAvailability === 'function'
  ) {
    activeManager = globalThis.DesignSystemManager.requestAvailability()
  }
  if (!activeManager) {
    return false
  }
  if (activeManager.active === 'bootstrap') {
    return true
  }
  if (
    activeManager.activeSystem &&
    activeManager.activeSystem.name === 'bootstrap'
  ) {
    return true
  }
  return false
}

function bootstrapSelectField(
  attribute,
  title,
  description,
  options,
  icon = 'icons:style'
) {
  return {
    attribute,
    title,
    description,
    inputMethod: 'select',
    options,
    icon,
  }
}

function getBootstrapConfigureSections(HAXStore, tag, props) {
  const layoutProps = []
  const spacingProps = []
  const surfaceProps = []
  const textProps = []
  const boxProps = []

  let inline = false
  if (HAXStore && typeof HAXStore.isInlineElement === 'function') {
    inline = HAXStore.isInlineElement(tag)
  }
  if (props.gizmo && props.gizmo.meta && props.gizmo.meta.inlineOnly) {
    inline = true
  }

  if (!props.hideDefaultSettings && !inline && props.designSystem !== false) {
    layoutProps.push(
      bootstrapSelectField(
        'data-text-align',
        'Text align',
        'Control text alignment',
        {
          '': '-- default --',
          left: 'Left',
          center: 'Center',
          right: 'Right',
          justify: 'Justify',
        },
        'icons:format-align-left'
      )
    )
    if (['media-image', 'img'].includes(tag)) {
      layoutProps.push(
        bootstrapSelectField(
          'data-float-position',
          'Float',
          'Float block alignment (desktop)',
          {
            '': '-- default --',
            left: 'Left',
            right: 'Right',
            center: 'Center',
          },
          'editor:insert-photo'
        )
      )
    }
    spacingProps.push(
      bootstrapSelectField(
        'data-padding',
        'Padding',
        'Apply consistent interior spacing',
        {
          '': '-- default --',
          xs: 'XS',
          s: 'S',
          m: 'M',
          l: 'L',
          xl: 'XL',
        },
        'editor:format-indent-increase'
      ),
      bootstrapSelectField(
        'data-margin',
        'Margin',
        'Apply exterior spacing',
        {
          '': '-- default --',
          center: 'Center',
          xs: 'XS',
          s: 'S',
          m: 'M',
          l: 'L',
          xl: 'XL',
        },
        'editor:format-indent-decrease'
      )
    )
  }

  if (props.designSystem !== false) {
    surfaceProps.push(
      bootstrapSelectField(
        'data-bootstrap-surface',
        'Surface',
        'Apply bootstrap surface style',
        {
          '': '-- default --',
          subtle: 'Subtle',
          strong: 'Strong',
          outline: 'Outline',
        },
        'editor:format-color-fill'
      )
    )
    textProps.push(
      bootstrapSelectField(
        'data-bootstrap-emphasis',
        'Emphasis',
        'Apply text emphasis treatment',
        {
          '': '-- default --',
          lead: 'Lead',
          small: 'Small',
          muted: 'Muted',
          strong: 'Strong',
        },
        'editor:format-bold'
      )
    )
    boxProps.push(
      bootstrapSelectField(
        'data-border-radius',
        'Border radius',
        'Round edges with bootstrap-like scale',
        {
          '': '-- default --',
          xs: 'XS',
          sm: 'S',
          md: 'M',
          lg: 'L',
        },
        'image:crop-free'
      ),
      bootstrapSelectField(
        'data-box-shadow',
        'Shadow',
        'Apply depth',
        {
          '': '-- default --',
          sm: 'S',
          md: 'M',
          lg: 'L',
        },
        'icons:flip-to-front'
      )
    )
  }

  return [
    {
      title: 'Layout',
      collapsed: true,
      accordion: true,
      property: 'bootstrap-layout',
      properties: layoutProps,
    },
    {
      title: 'Spacing',
      collapsed: true,
      accordion: true,
      property: 'bootstrap-spacing',
      properties: spacingProps,
    },
    {
      title: 'Surface',
      collapsed: true,
      accordion: true,
      property: 'bootstrap-surface',
      properties: surfaceProps,
    },
    {
      title: 'Typography',
      collapsed: true,
      accordion: true,
      property: 'bootstrap-typography',
      properties: textProps,
    },
    {
      title: 'Box appearance',
      collapsed: true,
      accordion: true,
      property: 'bootstrap-box',
      properties: boxProps,
    },
  ].filter(
    (section) => Array.isArray(section.properties) && section.properties.length > 0
  )
}

function refreshDesignSystemProperties(HAXStore) {
  if (!HAXStore || typeof HAXStore.designSystemHAXProperties !== 'function') {
    return
  }
  Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
    if (HAXStore.elementList[registeredTag]) {
      HAXStore.elementList[registeredTag] = HAXStore.designSystemHAXProperties(
        HAXStore.elementList[registeredTag],
        registeredTag
      )
    }
  })
}

function applyBootstrapAuthoring(HAXStore, manager) {
  if (!HAXStore || HAXStore.__bootstrapStyleGuideAuthoringApplied) {
    return
  }
  const previousDesignSystemHAXProperties =
    typeof HAXStore.designSystemHAXProperties === 'function'
      ? HAXStore.designSystemHAXProperties.bind(HAXStore)
      : null
  HAXStore.designSystemHAXProperties = (props, tag) => {
    if (!props) {
      return props
    }
    let nextProps = props
    if (typeof previousDesignSystemHAXProperties === 'function') {
      nextProps = previousDesignSystemHAXProperties(nextProps, tag)
    }
    if (!nextProps) {
      return nextProps
    }
    if (!nextProps.settings || typeof nextProps.settings !== 'object') {
      nextProps.settings = {}
    }
    if (!Array.isArray(nextProps.settings.configure)) {
      nextProps.settings.configure = []
    }
    nextProps.settings.configure = nextProps.settings.configure.filter(
      (setting) => !setting || setting.property !== 'bootstrap-styles'
    )
    if (!isBootstrapActiveSystem(manager)) {
      return nextProps
    }
    const bootstrapConfigureSections = getBootstrapConfigureSections(
      HAXStore,
      tag,
      nextProps
    )
    if (bootstrapConfigureSections.length > 0) {
      nextProps.settings.configure.push({
        inputMethod: 'collapse',
        property: 'bootstrap-styles',
        title: 'Bootstrap styles',
        collapsed: true,
        accordion: true,
        properties: bootstrapConfigureSections,
      })
    }
    return nextProps
  }
  HAXStore.__bootstrapStyleGuideAuthoringApplied = true
  refreshDesignSystemProperties(HAXStore)
  if (!HAXStore.__bootstrapDesignSystemSwitchListener) {
    HAXStore.__bootstrapDesignSystemSwitchListener = true
    globalThis.addEventListener('design-system-active-changed', () => {
      refreshDesignSystemProperties(HAXStore)
    })
  }
}

export function registerBootstrapStyleGuideAuthoring(payload = {}) {
  const manager = payload.manager || globalThis.DesignSystemManager
  if (
    globalThis.HaxStore &&
    typeof globalThis.HaxStore.requestAvailability === 'function'
  ) {
    applyBootstrapAuthoring(globalThis.HaxStore.requestAvailability(), manager)
  }
  globalThis.addEventListener(
    'hax-store-ready',
    () => {
      if (
        globalThis.HaxStore &&
        typeof globalThis.HaxStore.requestAvailability === 'function'
      ) {
        applyBootstrapAuthoring(
          globalThis.HaxStore.requestAvailability(),
          manager
        )
      }
    },
    { once: true }
  )
}