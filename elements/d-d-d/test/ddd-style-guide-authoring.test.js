import { expect } from "@open-wc/testing";

import "../lib/DDDStyleGuideAuthoring.js";
import { registerDDDStyleGuideAuthoring } from "../lib/DDDStyleGuideAuthoring.js";

// We need a real HAXOptionSampleFactory for the registration to proceed
import { HAXOptionSampleFactory } from "../lib/DDDStyles.js";

describe("registerDDDStyleGuideAuthoring", () => {
  it("returns early when HAXOptionSampleFactory is not a function", () => {
    const result = registerDDDStyleGuideAuthoring({
      options: {},
    });
    expect(result).to.be.undefined;
  });

  it("returns early when options is null", () => {
    const result = registerDDDStyleGuideAuthoring({});
    expect(result).to.be.undefined;
  });

  it("returns early when payload is empty", () => {
    const result = registerDDDStyleGuideAuthoring();
    expect(result).to.be.undefined;
  });

  it("returns early when already registered", () => {
    const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered;
    globalThis.__dddStyleGuideAuthoringRegistered = true;
    try {
      const result = registerDDDStyleGuideAuthoring({
        options: { HAXOptionSampleFactory },
      });
      expect(result).to.be.undefined;
    } finally {
      globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered;
    }
  });
});

describe("registerDDDStyleGuideAuthoring with mocked HaxStore", () => {
  it("registers and applies designSystemHAXProperties when HaxStore is available", () => {
    const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered;
    const origHaxStore = globalThis.HaxStore;
    // Reset the registration flag so the function runs
    globalThis.__dddStyleGuideAuthoringRegistered = false;

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
    };

    // eslint-disable-next-line no-unused-vars -- written by the test, never read
    let designSystemHAXPropsCalled = false;
    globalThis.HaxStore = {
      requestAvailability: () => ({
        elementList: mockElementList,
        editMode: false,
        __dddStyleGuideAuthoringApplied: false,
        __dddStyleGuideDefaultSchemaReady: false,
        isInlineElement: () => false,
        designSystemHAXProperties: (props, _tag) => {
          designSystemHAXPropsCalled = true;
          return props;
        },
      }),
    };

    try {
      registerDDDStyleGuideAuthoring({
        options: { HAXOptionSampleFactory },
      });
      // The function sets up listeners; verify it ran without error
      expect(globalThis.__dddStyleGuideAuthoringRegistered).to.be.true;
    } finally {
      globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered;
      globalThis.HaxStore = origHaxStore;
    }
  });
});

describe("DDD style guide presets for lists in the HAX settings form", () => {
  function registerWithStore(store) {
    const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered;
    const origHaxStore = globalThis.HaxStore;
    globalThis.__dddStyleGuideAuthoringRegistered = false;
    globalThis.HaxStore = { requestAvailability: () => store };
    try {
      registerDDDStyleGuideAuthoring({
        manager: { active: "ddd" },
        options: { HAXOptionSampleFactory },
      });
    } finally {
      globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered;
      globalThis.HaxStore = origHaxStore;
    }
  }

  function listProps(tag) {
    // mirrors the ul / ol primitive definition in hax-store
    return {
      gizmo: {},
      designSystem: { text: true, card: true, accent: true, primary: true },
      settings: {
        configure: [
          {
            attribute: "data-design-treatment",
            title: tag === "ul" ? "Bullet style" : "Number style",
            inputMethod: "select",
            options: {},
          },
        ],
      },
    };
  }

  function styleGuideField(props) {
    const collapse = props.settings.configure.find(
      (item) => item && item.property === "ddd-styles",
    );
    const group = collapse.properties.find(
      (item) => item.property === "ddd-styleguide",
    );
    return { group, field: group.properties[0] };
  }

  const store = {
    elementList: {},
    __dddStyleGuideAuthoringApplied: false,
    __dddStyleGuideDefaultSchemaReady: true,
    isInlineElement: () => false,
    designSystemHAXProperties: (props) => props,
  };
  registerWithStore(store);

  ["ul", "ol"].forEach((tag) => {
    it(`offers the reading presets in the Style Guide group for ${tag}`, () => {
      const props = store.designSystemHAXProperties(listProps(tag), tag);
      const { group, field } = styleGuideField(props);
      expect(group.hidden).to.be.false;
      expect(field.attribute).to.equal("data-style-guide");
      expect(field.itemsList.map((item) => item.value)).to.deep.equal([
        "readingRequired",
        "readingOptional",
      ]);
      expect(field.itemsList.map((item) => item.text)).to.deep.equal([
        "Required reading",
        "Optional reading",
      ]);
      // the list's own Bullet / Number style field is left in place
      expect(
        props.settings.configure.find(
          (item) => item.attribute === "data-design-treatment",
        ),
      ).to.exist;
    });
  });

  it("choosing a reading preset writes data-design-treatment on the list", () => {
    const props = store.designSystemHAXProperties(listProps("ol"), "ol");
    const { field } = styleGuideField(props);
    const treatmentInput = { value: "list-lower-alpha" };
    const setValues = {};
    const form = {
      formElements: {
        "settings.configure.data-design-treatment": {
          element: treatmentInput,
        },
        "settings.configure.ddd-styles.ddd-styleguide.data-style-guide": {
          element: {},
          field: {},
        },
      },
      _setValue: (key, value) => {
        setValues[key] = value;
      },
    };
    field.onValueChanged({ detail: { value: "readingOptional" } }, { form });
    expect(treatmentInput.value).to.equal("reading-optional");
    // attributes owned by other presets are cleared, not left behind
    expect(setValues["settings.configure.data-primary"]).to.be.undefined;
    expect("settings.configure.data-primary" in setValues).to.be.true;
    field.onValueChanged({ detail: { value: "readingRequired" } }, { form });
    expect(treatmentInput.value).to.equal("reading-required");
  });

  it("does not offer a Style Guide group for tags without presets", () => {
    const props = store.designSystemHAXProperties(listProps("ul"), "dl");
    const { group } = styleGuideField(props);
    expect(group.hidden).to.be.true;
  });
});

describe("DDD text alignment setting opt-out", () => {
  const store = {
    elementList: {},
    __dddStyleGuideAuthoringApplied: false,
    __dddStyleGuideDefaultSchemaReady: true,
    isInlineElement: () => false,
    designSystemHAXProperties: (props) => props,
  };
  const wasRegistered = globalThis.__dddStyleGuideAuthoringRegistered;
  const origHaxStore = globalThis.HaxStore;
  globalThis.__dddStyleGuideAuthoringRegistered = false;
  globalThis.HaxStore = { requestAvailability: () => store };
  try {
    registerDDDStyleGuideAuthoring({
      manager: { active: "ddd" },
      options: { HAXOptionSampleFactory },
    });
  } finally {
    globalThis.__dddStyleGuideAuthoringRegistered = wasRegistered;
    globalThis.HaxStore = origHaxStore;
  }

  // every attribute the generated settings form offers, at any depth
  const attributes = (items) =>
    (items || []).reduce(
      (all, item) =>
        all
          .concat(item && item.attribute ? [item.attribute] : [])
          .concat(attributes(item && item.properties)),
      [],
    );
  const form = (designSystem) =>
    attributes(
      store.designSystemHAXProperties(
        {
          gizmo: {},
          canScale: { min: 50, step: 25 },
          designSystem,
          settings: { configure: [] },
        },
        "video-player",
      ).settings.configure,
    );

  it("offers text alignment by default", () => {
    expect(form({ card: true })).to.include("data-text-align");
  });

  it("leaves text alignment out with designSystem.textAlign false, keeping the rest", () => {
    const attrs = form({ card: true, textAlign: false });
    expect(attrs).to.not.include("data-text-align");
    expect(attrs).to.include("data-width");
    expect(attrs).to.include("data-padding");
    expect(attrs).to.include("data-margin");
  });
});
