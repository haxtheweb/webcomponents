import {
  getDDDStyleGuideOptionsForTag,
  getDDDStyleGuidePresetByKey,
  getDDDStyleGuidePresetManagedAttributes,
  getDDDStyleGuideSchemaOverride,
} from "./DDDStyleGuidePresets.js";

function getFormElementBySuffix(form, suffix) {
  const keys = Object.keys(form.formElements || {});
  const key = keys.find((fieldKey) => fieldKey.endsWith(`.${suffix}`));
  return key ? form.formElements[key] : null;
}

function getStyleGuideDefaultDemoSchemaForTag(tag) {
  const schemaOverride = getDDDStyleGuideSchemaOverride(tag);
  if (
    schemaOverride &&
    schemaOverride.demoSchema &&
    schemaOverride.demoSchema[0]
  ) {
    return schemaOverride.demoSchema[0];
  }
  return null;
}

function applyStyleGuideDefaultsToProperties(tag, properties) {
  if (!properties || !tag) {
    return null;
  }
  const defaultDemoSchema = getStyleGuideDefaultDemoSchemaForTag(tag);
  if (!defaultDemoSchema) {
    return null;
  }
  const currentDemoSchema =
    properties.demoSchema && properties.demoSchema[0]
      ? properties.demoSchema[0]
      : {};
  const currentProperties = currentDemoSchema.properties
    ? currentDemoSchema.properties
    : {};
  properties.demoSchema = [
    {
      tag: currentDemoSchema.tag || defaultDemoSchema.tag || tag,
      content:
        typeof currentDemoSchema.content === "string"
          ? currentDemoSchema.content
          : typeof defaultDemoSchema.content === "string"
            ? defaultDemoSchema.content
            : "",
      properties: {
        ...(defaultDemoSchema.properties || {}),
        ...currentProperties,
      },
    },
  ];
  return defaultDemoSchema;
}

function applyStyleGuideDefaultsToStore(HAXStore, tag, properties) {
  if (!HAXStore || !tag) {
    return;
  }
  const defaultDemoSchema = applyStyleGuideDefaultsToProperties(
    tag,
    properties,
  );
  if (!defaultDemoSchema) {
    return;
  }
  if (!HAXStore.styleGuideSchema) {
    HAXStore.styleGuideSchema = {};
  }
  if (!HAXStore.styleGuideSchema[tag]) {
    HAXStore.styleGuideSchema[tag] = {};
  }
  HAXStore.styleGuideSchema[tag].demoSchema = [
    {
      tag: defaultDemoSchema.tag || tag,
      content:
        typeof defaultDemoSchema.content === "string"
          ? defaultDemoSchema.content
          : "",
      properties: {
        ...(defaultDemoSchema.properties || {}),
      },
    },
  ];
  if (
    HAXStore.elementList &&
    HAXStore.elementList[tag] &&
    HAXStore.elementList[tag] !== properties
  ) {
    applyStyleGuideDefaultsToProperties(tag, HAXStore.elementList[tag]);
  }
}

function dddStyleGuideValueChanged(e, detail = {}) {
  if (!detail.form || !detail.form.formElements) {
    return;
  }
  const form = detail.form;
  const selectedPreset = e && e.detail ? e.detail.value : undefined;
  const presetConfig = getDDDStyleGuidePresetByKey(selectedPreset);
  const preset =
    presetConfig && presetConfig.properties ? presetConfig.properties : null;
  const dddFieldKeys = Object.keys(form.formElements).filter(
    (fieldKey) => fieldKey.indexOf("settings.configure.ddd-styles.") === 0,
  );
  dddFieldKeys.forEach((fieldKey) => {
    const fieldRef = form.formElements[fieldKey];
    const isStyleGuideField =
      fieldKey.indexOf(".ddd-styleguide") !== -1 ||
      fieldKey.indexOf(".data-style-guide") !== -1;
    if (!isStyleGuideField && fieldRef) {
      if (
        fieldRef.field &&
        typeof fieldRef.field.disabled !== typeof undefined
      ) {
        if (preset) {
          if (
            typeof fieldRef.field.__dddStyleGuidePrevDisabled ===
            typeof undefined
          ) {
            fieldRef.field.__dddStyleGuidePrevDisabled =
              !!fieldRef.field.disabled;
          }
          fieldRef.field.disabled = true;
        } else if (
          typeof fieldRef.field.__dddStyleGuidePrevDisabled !== typeof undefined
        ) {
          fieldRef.field.disabled = fieldRef.field.__dddStyleGuidePrevDisabled;
          delete fieldRef.field.__dddStyleGuidePrevDisabled;
        }
      }
      if (
        fieldRef.element &&
        typeof fieldRef.element.disabled !== typeof undefined
      ) {
        if (preset) {
          if (
            typeof fieldRef.element.__dddStyleGuidePrevDisabled ===
            typeof undefined
          ) {
            fieldRef.element.__dddStyleGuidePrevDisabled =
              !!fieldRef.element.disabled;
          }
          fieldRef.element.disabled = true;
        } else if (
          typeof fieldRef.element.__dddStyleGuidePrevDisabled !==
          typeof undefined
        ) {
          fieldRef.element.disabled =
            fieldRef.element.__dddStyleGuidePrevDisabled;
          delete fieldRef.element.__dddStyleGuidePrevDisabled;
        }
      }
    }
  });
  getDDDStyleGuidePresetManagedAttributes().forEach((attribute) => {
    const value =
      preset && typeof preset[attribute] !== typeof undefined
        ? preset[attribute]
        : undefined;
    const targetField = getFormElementBySuffix(form, attribute);
    if (targetField && targetField.element) {
      targetField.element.value = value;
    } else if (typeof form._setValue === "function") {
      form._setValue(`settings.configure.${attribute}`, value);
    }
  });
}

function isDDDActiveSystem(manager = null) {
  let activeManager = manager;
  if (
    !activeManager &&
    globalThis.DesignSystemManager &&
    typeof globalThis.DesignSystemManager.requestAvailability === "function"
  ) {
    activeManager = globalThis.DesignSystemManager.requestAvailability();
  }
  return !!activeManager && activeManager.active === "ddd";
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

/**
 * @note Gut all design settings in HAX core. this allows for design systems to hook in
 * by overriding the way the designSystemHAXProperties returns property definitions
 *
 * under standardAdvancedProps
 * review what should be removed but just about everything
 * also many of these generate events which can be removed as well!!!
 * this is core gutting, but we'll have to implement them in a uniform way
 * so that if hideDefaultSettings is there we should still respect that
 * Possibly changing it hideDesignLayoutSettings: [] which is an array
 * of keys to hide from this specific element. If the entire thing is there
 * then it'll remove all of them
 */
export function registerDDDStyleGuideAuthoring(payload = {}) {
  const manager = payload.manager || null;
  const HAXOptionSampleFactory =
    payload.options &&
    typeof payload.options.HAXOptionSampleFactory === "function"
      ? payload.options.HAXOptionSampleFactory
      : null;
  if (typeof HAXOptionSampleFactory !== "function") {
    return;
  }
  if (
    !globalThis ||
    !globalThis.addEventListener ||
    globalThis.__dddStyleGuideAuthoringRegistered
  ) {
    return;
  }
  globalThis.__dddStyleGuideAuthoringRegistered = true;
  const activateStoreIntegration = () => {
    if (
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
    ) {
      const HAXStore = globalThis.HaxStore.requestAvailability();
      if (HAXStore.__dddStyleGuideAuthoringApplied) {
        return;
      }
      HAXStore.__dddStyleGuideAuthoringApplied = true;
      if (!HAXStore.__dddStyleGuideDefaultSchemaReady) {
        HAXStore.__dddStyleGuideDefaultSchemaReady = true;
        globalThis.addEventListener("hax-register-properties", (event) => {
          if (
            isDDDActiveSystem(manager) &&
            event &&
            event.detail &&
            event.detail.tag &&
            event.detail.properties
          ) {
            applyStyleGuideDefaultsToStore(
              HAXStore,
              event.detail.tag,
              event.detail.properties,
            );
          }
        });
      }
      if (isDDDActiveSystem(manager)) {
        Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
          applyStyleGuideDefaultsToStore(
            HAXStore,
            registeredTag,
            HAXStore.elementList[registeredTag],
          );
        });
      }
      const previousDesignSystemHAXProperties =
        typeof HAXStore.designSystemHAXProperties === "function"
          ? HAXStore.designSystemHAXProperties.bind(HAXStore)
          : null;
      HAXStore.designSystemHAXProperties = (props, tag) => {
        if (!props) {
          return props;
        }
        if (previousDesignSystemHAXProperties) {
          props = previousDesignSystemHAXProperties(props, tag);
        }
        if (!props) {
          return props;
        }
        if (!props.settings) {
          props.settings = {};
        }
        if (!Array.isArray(props.settings.configure)) {
          props.settings.configure = [];
        }
        const designSystem =
          props.designSystem && typeof props.designSystem === "object"
            ? props.designSystem
            : {};
        props.settings.configure = props.settings.configure.filter(
          (item) => item && item.property !== "ddd-styles",
        );
        if (!isDDDActiveSystem(manager)) {
          return props;
        }
        // setup the props of the design system to populate based on matches below
        let spacingProps = [];
        let styleGuideProps = [];
        let designTreatmentProps = [];
        let fontProps = [];
        let cardProps = [];
        let colorProps = [];
        // test if this element can be scaled
        // we generally don't want people doing it this way
        if (props.canScale) {
          spacingProps.push({
            attribute: "data-width",
            title: "Width",
            description: "Scaled relative to width of container",
            inputMethod: "slider",
            min: props.canScale.min ? props.canScale.min : 25,
            max: props.canScale.max ? props.canScale.max : 100,
            step: props.canScale.step ? props.canScale.step : 25,
          });
        }
        // will catch prims and MIGHT catch tag
        let inline = HAXStore.isInlineElement(tag);
        // test for inline bc we are so early in bootstrap we might miss it
        if (props.gizmo && props.gizmo.meta && props.gizmo.meta.inlineOnly) {
          inline = true;
        }
        // everything that allows for advanced should be able to apply spacing
        // this stuff floats to the top of those options
        if (
          !props.hideDefaultSettings &&
          !inline &&
          props.designSystem !== false
        ) {
          const styleGuideOptions = getDDDStyleGuideOptionsForTag(tag);
          if (styleGuideOptions.length > 0) {
            styleGuideProps.push({
              attribute: "data-style-guide",
              title: "Style guide",
              description: "Preset style combinations from the style guide",
              inputMethod: "radio",
              onValueChanged: dddStyleGuideValueChanged,
              itemsList: styleGuideOptions,
            });
          }
          if (["media-image", "img"].includes(tag)) {
            spacingProps.push({
              attribute: "data-float-position",
              title: "Float Position",
              description: "Alignment relative to other items on large screens",
              inputMethod: "select",
              options: {
                "": "-- default --",
                left: "Left",
                center: "Center",
                right: "Right",
              },
            });
          } else {
            spacingProps.push({
              attribute: "data-text-align",
              title: "Text align",
              description: "Horizontal alignment of text",
              inputMethod: "select",
              options: {
                "": "-- default --",
                left: "Left",
                center: "Center",
                right: "Right",
                justify: "Justify",
              },
            });
          }
          spacingProps.push({
            attribute: "data-padding",
            title: "Padding",
            description: "Padding for added aesthetics",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("padding")],
          });
          spacingProps.push({
            attribute: "data-margin",
            title: "Margin",
            description: "Margin for added aesthetics",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("margin")],
          });
        }
        // design treatments are rather open ended but should be high up for things that have them
        if (
          props.designSystem === true ||
          designSystem.designTreatment === true
        ) {
          if (["p", "blockquote"].includes(tag)) {
            designTreatmentProps.push({
              attribute: "data-design-treatment",
              title: "Design treatment",
              description: "Minor aesthetic treatments for emphasis",
              inputMethod: "radio",
              itemsList: [
                ...HAXOptionSampleFactory("design-treatment").filter((item) =>
                  item && item.value.startsWith("dropCap") ? true : false,
                ),
              ],
            });
          } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
            // filter options to only NON-dropCap options
            designTreatmentProps.push({
              attribute: "data-design-treatment",
              title: "Design treatment",
              description: "Minor aesthetic treatments for emphasis",
              inputMethod: "radio",
              itemsList: [
                ...HAXOptionSampleFactory("design-treatment").filter((item) =>
                  item && !item.value.startsWith("dropCap") ? true : false,
                ),
              ],
            });
          }
        }
        // block elements can get accents which effectively implies that they
        // can get the other 'card' like configuration pieces
        if (props.designSystem === true || designSystem.accent === true) {
          colorProps.push({
            attribute: "data-accent",
            title: "Accent color",
            description: "Offset items visually for aesthetic purposes",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("accent")],
          });
        }
        if (props.designSystem === true || designSystem.primary === true) {
          colorProps.push({
            attribute: "data-primary",
            title: "Primary color",
            description:
              "Primary color to apply color, often for meaning or aesthetic",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("primary")],
          });
        }
        if (
          props.designSystem === true ||
          designSystem.designTreatment === true
        ) {
          if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
            designTreatmentProps.push({
              attribute: "data-instructional-action",
              title: "Instructional Context",
              description: "Indicated to users visually",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("instructional-action")],
            });
          }
        }
        if (props.designSystem === true || designSystem.text === true) {
          fontProps.push({
            attribute: "data-font-family",
            title: "Font family",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("font-family")],
          });

          fontProps.push({
            attribute: "data-font-weight",
            title: "Font weight",
            description: "Ensure it is only for aesthetic purposes",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("font-weight")],
          });

          fontProps.push({
            attribute: "data-font-size",
            title: "Font size",
            description: "Ensure sizing is only for aesthetic purposes",
            inputMethod: "radio",
            itemsList: [...HAXOptionSampleFactory("font-size")],
          });
        }
        if (props.designSystem === true || designSystem.card === true) {
          cardProps = [
            {
              attribute: "data-border-radius",
              title: "Border radius",
              description: "Border radius to apply",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("border-radius")],
            },
            {
              attribute: "data-border",
              title: "Border",
              description: "Thickness of the border",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("border")],
            },
            {
              attribute: "data-box-shadow",
              title: "Box shadow",
              description: "Subtly raises off the page",
              inputMethod: "radio",
              itemsList: [...HAXOptionSampleFactory("box-shadow")],
            },
          ];
        }
        props.settings.configure.push({
          inputMethod: "collapse",
          property: "ddd-styles",
          properties: [
            {
              title: "Style Guide",
              collapsed: true,
              accordion: true,
              property: "ddd-styleguide",
              disabled: styleGuideProps.length === 0,
              properties: styleGuideProps,
              hidden: styleGuideProps.length === 0,
            },
            {
              title: "Design treatment",
              collapsed: true,
              accordion: true,
              property: "ddd-designtreatment",
              disabled: designTreatmentProps.length === 0,
              properties: designTreatmentProps,
              hidden: designTreatmentProps.length === 0,
            },
            {
              title: "Colors",
              collapsed: true,
              accordion: true,
              property: "ddd-card",
              disabled: colorProps.length === 0,
              properties: colorProps,
              hidden: colorProps.length === 0,
            },
            {
              title: "Font",
              collapsed: true,
              accordion: true,
              property: "ddd-font",
              disabled: fontProps.length === 0,
              properties: fontProps,
              hidden: fontProps.length === 0,
            },
            {
              title: "Spacing",
              collapsed: true,
              accordion: true,
              property: "ddd-spacing",
              disabled: spacingProps.length === 0,
              properties: spacingProps,
              hidden: spacingProps.length === 0,
            },
            {
              title: "Box appearance",
              collapsed: true,
              accordion: true,
              property: "ddd-box",
              disabled: cardProps.length === 0,
              properties: cardProps,
              hidden: cardProps.length === 0,
            },
          ],
        });
        return props;
      };
      if (isDDDActiveSystem(manager)) {
        Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
          applyStyleGuideDefaultsToStore(
            HAXStore,
            registeredTag,
            HAXStore.elementList[registeredTag],
          );
        });
      }
      refreshDesignSystemProperties(HAXStore);
      if (!HAXStore.__dddDesignSystemSwitchListener) {
        HAXStore.__dddDesignSystemSwitchListener = true;
        globalThis.addEventListener("design-system-active-changed", () => {
          if (isDDDActiveSystem(manager)) {
            Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
              applyStyleGuideDefaultsToStore(
                HAXStore,
                registeredTag,
                HAXStore.elementList[registeredTag],
              );
            });
          }
          refreshDesignSystemProperties(HAXStore);
        });
      }
    }
  };
  activateStoreIntegration();
  globalThis.addEventListener("hax-store-ready", activateStoreIntegration, {
    once: true,
  });
}
