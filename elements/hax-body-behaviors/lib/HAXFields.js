/**
 * fields array of input methods to JSON schema object conversion configuration
 * that can be reused outside of Simple Fields
 */
export const HaxSchematizer = {
  defaultSettings: {
    type: "string",
  },
  format: {
    "simple-fields": {
      defaultSettings: {
        type: "object",
        format: "simple-fields",
      },
    },
  },
  inputMethod: {
    alt: {
      defaultSettings: {
        type: "string",
        format: "alt",
      },
    },
    array: {
      defaultSettings: {
        type: "array",
      },
      properties: {
        label: "itemLabel",
      },
    },
    boolean: {
      defaultSettings: {
        type: "boolean",
      },
    },
    code: {
      defaultSettings: {
        type: "markup",
      },
    },
    "code-editor": {
      defaultSettings: {
        type: "markup",
      },
    },
    color: {
      defaultSettings: {
        type: "string",
        format: "color",
      },
    },
    colorpicker: {
      defaultSettings: {
        type: "string",
        format: "colorpicker",
      },
    },
    "date-time": {
      defaultSettings: {
        type: "string",
        format: "date-time",
      },
    },
    datepicker: {
      defaultSettings: {
        type: "string",
        format: "date",
      },
    },
    fieldset: {
      defaultSettings: {
        type: "object",
      },
    },
    fileupload: {
      defaultSettings: {
        type: "string",
        format: "fileupload",
      },
    },
    haxupload: {
      defaultSettings: {
        type: "string",
        format: "fileupload",
      },
    },
    iconpicker: {
      defaultSettings: {
        type: "string",
        format: "iconpicker",
      },
    },
    markup: {
      defaultSettings: {
        type: "markup",
      },
    },
    "md-block": {
      defaultSettings: {
        type: "markup",
        format: "md-block",
      },
    },
    monthpicker: {
      defaultSettings: {
        type: "string",
        format: "month",
      },
    },
    number: {
      defaultSettings: {
        type: "number",
      },
    },
    object: {
      defaultSettings: {
        type: "object",
      },
    },
    select: {
      defaultSettings: {
        type: "string",
        format: "select",
      },
    },
    radio: {
      defaultSettings: {
        type: "string",
        format: "radio",
      },
    },
    slider: {
      defaultSettings: {
        type: "number",
        format: "slider",
      },
    },
    tabs: {
      defaultSettings: {
        type: "object",
        format: "tabs",
      },
    },
    collapse: {
      defaultSettings: {
        type: "object",
        format: "collapse",
      },
    },
    textarea: {
      defaultSettings: {
        type: "string",
        format: "textarea",
      },
    },
    timepicker: {
      defaultSettings: {
        type: "string",
        format: "time",
      },
    },
    weekpicker: {
      defaultSettings: {
        type: "string",
        format: "week",
      },
    },
  },
};

/**
 * JSON schema object to form element conversion configuration object
 * that can be reused outside of Simple Fields
 */
export const HaxElementizer = {
  defaultSettings: {
    element: "simple-fields-field",
    errorProperty: "errorMessage",
    invalidProperty: "invalid",
    noWrap: true,
    attributes: {
      type: "text",
    },
    properties: {
      minLength: "minlength",
      maxLength: "maxlength",
    },
  },
  format: {
    radio: {
      defaultSettings: {
        element: "simple-fields-field",
        noWrap: true,
        attributes: {
          autofocus: true,
          type: "radio",
        },
        properties: {
          options: "options",
        },
        child: {
          element: "simple-fields-array-item",
          noWrap: true,
          descriptionProperty: "description",
          properties: {
            previewBy: "previewBy",
          },
        },
      },
    },
    select: {
      defaultSettings: {
        element: "simple-fields-field",
        noWrap: true,
        attributes: {
          autofocus: true,
          type: "select",
        },
        properties: {
          options: "options",
          items: "itemsList",
        },
      },
    },
    "simple-picker": {
      defaultSettings: {
        element: "simple-picker",
        attributes: {
          autofocus: true,
        },
        properties: {
          options: "options",
        },
      },
    },
  },
  type: {
    array: {
      defaultSettings: {
        element: "simple-fields-array",
        noWrap: true,
        descriptionProperty: "description",
        child: {
          element: "simple-fields-array-item",
          noWrap: true,
          descriptionProperty: "description",
          properties: {
            previewBy: "previewBy",
          },
        },
      },
    },
    boolean: {
      defaultSettings: {
        element: "simple-fields-field",
        noWrap: true,
        attributes: {
          autofocus: true,
          type: "checkbox",
          value: false,
        },
      },
    },
    file: {
      defaultSettings: {
        import: "@haxtheweb/hax-body/lib/hax-upload-field.js",
        element: "hax-upload-field",
        noWrap: true,
        attributes: {
          autofocus: true,
          type: "file",
          "show-sources": true,
        },
        properties: {
          accepts: "accepts",
        },
      },
    },
    integer: {
      defaultSettings: {
        element: "simple-fields-field",
        noWrap: true,
        attributes: {
          autofocus: true,
          step: 1,
          type: "number",
        },
        properties: {
          minimum: "min",
          maximum: "max",
          multipleOf: "step",
        },
      },
    },
    markup: {
      defaultSettings: {
        import: "@haxtheweb/simple-fields/lib/simple-fields-code.js",
        element: "simple-fields-code",
        setValueProperty: "editorValue",
        noWrap: true,
      },
      format: {
        "md-block": {
          defaultSettings: {
            element: "md-block",
            setValueProperty: "source",
            noWrap: true,
          },
        },
      },
    },
    number: {
      defaultSettings: {
        element: "simple-fields-field",
        noWrap: true,
        type: "number",
        attributes: {
          autofocus: true,
          type: "number",
        },
        properties: {
          minimum: "min",
          maximum: "max",
          multipleOf: "step",
        },
      },
    },
    object: {
      defaultSettings: {
        element: "simple-fields-fieldset",
        noWrap: true,
      },
      format: {
        cardlist: {
          defaultSettings: {
            element: "hax-element-card-list",
            noWrap: true,
          },
        },
        tabs: {
          defaultSettings: {
            import: "@haxtheweb/simple-fields/lib/simple-fields-tabs.js",
            element: "simple-fields-tabs",
            noWrap: true,
            child: {
              import: "@haxtheweb/simple-fields/lib/simple-fields-tab.js",
              element: "simple-fields-tab",
              noWrap: true,
              labelSlot: "label",
              descriptionSlot: "",
            },
            properties: {
              layoutBreakpoint: "layoutBreakpoint",
              iconBreakpoint: "iconBreakpoint",
              sticky: "sticky",
            },
          },
        },
        collapse: {
          defaultSettings: {
            import: "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js",
            element: "div", // @todo make this a11y-collapse-group when we get state management right on cascading props
            noWrap: true,
            attributes: {
              radio: true,
              "heading-button": true,
              accordion: true,
            },
            child: {
              import: "@haxtheweb/a11y-collapse/a11y-collapse.js",
              element: "a11y-collapse",
              noWrap: true,
              labelSlot: "heading",
              descriptionSlot: "",
            },
          },
        },
        fields: {
          defaultSettings: {
            element: "simple-fields",
            noWrap: true,
            descriptionProperty: "description",
            properties: {
              schema: "schema",
            },
          },
        },
      },
    },
    string: {
      format: {
        alt: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              required: true,
            },
          },
        },
        color: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "color",
            },
          },
        },
        colorpicker: {
          defaultSettings: {
            import: "@haxtheweb/simple-colors/lib/simple-colors-picker.js",
            element: "simple-colors-picker",
            attributes: {
              autofocus: true,
            },
          },
        },
        date: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "date",
            },
          },
        },
        "date-time": {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "datetime-local",
            },
          },
        },
        date: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "date",
            },
          },
        },
        email: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "email",
            },
          },
        },
        fileupload: {
          defaultSettings: {
            import: "@haxtheweb/hax-body/lib/hax-upload-field.js",
            element: "hax-upload-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              "show-sources": true,
            },
            properties: {
              accepts: "accepts",
            },
          },
        },
        iconpicker: {
          defaultSettings: {
            import: "@haxtheweb/simple-icon-picker/simple-icon-picker.js",
            element: "simple-icon-picker",
            attributes: {
              autofocus: true,
            },
            properties: {
              options: "icons",
            },
          },
        },
        month: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "month",
            },
          },
        },
        textarea: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "textarea",
            },
          },
        },
        time: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "time",
            },
          },
        },
        uri: {
          defaultSettings: {
            element: "simple-fields-field",
            noWrap: true,
            attributes: {
              autofocus: true,
              type: "file",
            },
            properties: {
              accepts: "accepts",
            },
          },
        },
      },
    },
  },
};
