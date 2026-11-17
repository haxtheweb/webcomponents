/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
function isBootstrapActiveSystem(manager = null) {
  let activeManager = manager;
  if (
    !activeManager &&
    globalThis.DesignSystemManager &&
    typeof globalThis.DesignSystemManager.requestAvailability === "function"
  ) {
    activeManager = globalThis.DesignSystemManager.requestAvailability();
  }
  if (!activeManager) {
    return false;
  }
  if (activeManager.active === "bootstrap") {
    return true;
  }
  if (
    activeManager.activeSystem &&
    activeManager.activeSystem.name === "bootstrap"
  ) {
    return true;
  }
  return false;
}

function bootstrapSelectField(
  attribute,
  title,
  description,
  options,
  icon = "icons:style",
) {
  return {
    attribute,
    title,
    description,
    inputMethod: "select",
    options,
    icon,
  };
}

/**
 * Bootstrap is a DDD dialect, so DDD's authoring already offers text
 * alignment, float, padding, margin, radius and shadow (the same data
 * attributes). This section adds only what DDD has no attribute for.
 */
function getBootstrapConfigureSections(_HAXStore, _tag, props) {
  const surfaceProps = [];
  const textProps = [];

  if (props.designSystem === false) {
    return [];
  }
  surfaceProps.push(
    bootstrapSelectField(
      "data-bootstrap-surface",
      "Surface",
      "Apply bootstrap surface style",
      {
        "": "-- default --",
        subtle: "Subtle",
        strong: "Strong",
        outline: "Outline",
      },
      "editor:format-color-fill",
    ),
  );
  textProps.push(
    bootstrapSelectField(
      "data-bootstrap-emphasis",
      "Emphasis",
      "Apply text emphasis treatment",
      {
        "": "-- default --",
        lead: "Lead",
        small: "Small",
        muted: "Muted",
        strong: "Strong",
      },
      "editor:format-bold",
    ),
  );

  return [
    {
      title: "Surface",
      collapsed: true,
      accordion: true,
      property: "bootstrap-surface",
      properties: surfaceProps,
    },
    {
      title: "Typography",
      collapsed: true,
      accordion: true,
      property: "bootstrap-typography",
      properties: textProps,
    },
  ].filter(
    (section) =>
      Array.isArray(section.properties) && section.properties.length > 0,
  );
}

function refreshDesignSystemProperties(HAXStore) {
  if (!HAXStore || typeof HAXStore.designSystemHAXProperties !== "function") {
    return;
  }
  Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
    if (HAXStore.elementList[registeredTag]) {
      HAXStore.elementList[registeredTag] = HAXStore.designSystemHAXProperties(
        HAXStore.elementList[registeredTag],
        registeredTag,
      );
    }
  });
}

function applyBootstrapAuthoring(HAXStore, manager) {
  if (!HAXStore || HAXStore.__bootstrapStyleGuideAuthoringApplied) {
    return;
  }
  const previousDesignSystemHAXProperties =
    typeof HAXStore.designSystemHAXProperties === "function"
      ? HAXStore.designSystemHAXProperties.bind(HAXStore)
      : null;
  HAXStore.designSystemHAXProperties = (props, tag) => {
    if (!props) {
      return props;
    }
    let nextProps = props;
    if (typeof previousDesignSystemHAXProperties === "function") {
      nextProps = previousDesignSystemHAXProperties(nextProps, tag);
    }
    if (!nextProps) {
      return nextProps;
    }
    if (!nextProps.settings || typeof nextProps.settings !== "object") {
      nextProps.settings = {};
    }
    if (!Array.isArray(nextProps.settings.configure)) {
      nextProps.settings.configure = [];
    }
    nextProps.settings.configure = nextProps.settings.configure.filter(
      (setting) => !setting || setting.property !== "bootstrap-styles",
    );
    if (!isBootstrapActiveSystem(manager)) {
      return nextProps;
    }
    const bootstrapConfigureSections = getBootstrapConfigureSections(
      HAXStore,
      tag,
      nextProps,
    );
    if (bootstrapConfigureSections.length > 0) {
      nextProps.settings.configure.push({
        inputMethod: "collapse",
        property: "bootstrap-styles",
        title: "Bootstrap styles",
        collapsed: true,
        accordion: true,
        properties: bootstrapConfigureSections,
      });
    }
    return nextProps;
  };
  HAXStore.__bootstrapStyleGuideAuthoringApplied = true;
  refreshDesignSystemProperties(HAXStore);
  if (!HAXStore.__bootstrapDesignSystemSwitchListener) {
    HAXStore.__bootstrapDesignSystemSwitchListener = true;
    globalThis.addEventListener("design-system-active-changed", () => {
      refreshDesignSystemProperties(HAXStore);
    });
  }
}

export function registerBootstrapStyleGuideAuthoring(payload = {}) {
  let manager = payload.manager;
  if (
    !manager &&
    globalThis.DesignSystemManager &&
    typeof globalThis.DesignSystemManager.requestAvailability === "function"
  ) {
    // resolve the holder's singleton instance so isBootstrapActiveSystem
    // sees the active design system instead of the bare holder object
    manager = globalThis.DesignSystemManager.requestAvailability();
  }
  if (
    globalThis.HaxStore &&
    typeof globalThis.HaxStore.requestAvailability === "function"
  ) {
    applyBootstrapAuthoring(globalThis.HaxStore.requestAvailability(), manager);
  }
  globalThis.addEventListener(
    "hax-store-ready",
    () => {
      if (
        globalThis.HaxStore &&
        typeof globalThis.HaxStore.requestAvailability === "function"
      ) {
        applyBootstrapAuthoring(
          globalThis.HaxStore.requestAvailability(),
          manager,
        );
      }
    },
    { once: true },
  );
}
