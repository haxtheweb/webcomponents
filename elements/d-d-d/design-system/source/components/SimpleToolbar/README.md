# SimpleToolbar

A customizable toolbar.

- Package `@haxtheweb/simple-toolbar` 26.8.0

## Usage

```html
<simple-toolbar style="width:200px;border:1px solid #ddd">
            <div class="group">
              <simple-toolbar-field class="button" label="User Name" icon="icons:account-circle">
                <input type="text" aria-label="User Name">
              </simple-toolbar-field>
              <simple-toolbar-button class="button" icon="save" label="Save" shortcut-keys="ctrl+s"></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="cancel" label="Cancel"></simple-toolbar-button>
              <simple-toolbar-field class="button" label="volume" icon="av:volume-up">
                <input type="range" min="0" step="10" max="100" value="50">
              </simple-toolbar-field>
            </div>
            <div class="group">
              <simple-toolbar-button class="button" icon="undo" label="Undo" shortcut-keys="ctrl+z"></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="redo" label="Redo" shortcut-keys="ctrl+shift+z"></simple-toolbar-button>
            </div>
            <simple-toolbar-button-group aria-label="Text Alignment">
              <simple-toolbar-button class="button" icon="editor:format-align-left" label="Align Left" radio></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="editor:format-align-center" label="Align Center" radio></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="editor:format-align-right" label="Align Right" radio></simple-toolbar-button>
            </simple-toolbar-button-group>
            <simple-toolbar-button-group allow-null aria-label="List Type">
              <simple-toolbar-button class="button" icon="editor:format-list-bulleted" label="Bulleted List" radio></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="editor:format-list-bulleted" label="Numbered List" radio></simple-toolbar-button>
            </simple-toolbar-button-group>
            <div class="group">
              </simple-toolbar-menu>
              <simple-toolbar-button class="button" icon="editor:format-bold" label="Bold" shortcut-keys="ctrl+b" toggles></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="editor:format-italic" label="Italics" shortcut-keys="ctrl+i" toggles></simple-toolbar-button>
            </div-->
            <simple-toolbar-button class="button" icon="star" label="Favorite" toggles show-text-label></simple-toolbar-button>
            <simple-toolbar-menu label="Visibility" show-text-label align-horizontal="left">
              <simple-toolbar-menu-item id="show">
                <simple-toolbar-button role="menuitem" icon="visibility" label="Show" show-text-label align-horizontal="left"></simple-toolbar-button>
              </simple-toolbar-menu-item>
              <simple-toolbar-menu-item id="hide">
                <simple-toolbar-button role="menuitem" icon="visibility-off" label="Hide" show-text-label align-horizontal="left"></simple-toolbar-button>
              </simple-toolbar-menu-item>
            </simple-toolbar-menu>
          </simple-toolbar>
<simple-toolbar style="width:200px;border:1px solid #ddd" always-expanded>
            <div class="group">
              <simple-toolbar-button class="button" icon="save" label="Save" shortcut-keys="ctrl+s"></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="cancel" label="Cancel"></simple-toolbar-button>
            </div>
            <div class="group">
              <simple-toolbar-button class="button" icon="undo" label="Undo" shortcut-keys="ctrl+z"></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="redo" label="Redo" shortcut-keys="ctrl+shift+z"></simple-toolbar-button>
            </div>
            <div class="group">
              <simple-toolbar-button class="button" icon="editor:format-bold" label="Bold" shortcut-keys="ctrl+b" toggles></simple-toolbar-button>
              <simple-toolbar-button class="button" icon="editor:format-italic" label="Italics" shortcut-keys="ctrl+i" toggles></simple-toolbar-button>
            </div>
            <simple-toolbar-button class="button" icon="star" label="Favorite" toggles show-text-label></simple-toolbar-button>
          </simple-toolbar>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `align-horizontal` | String |
| `align-vertical` | String |
| `disabled` | Boolean |
| `hidden` | Boolean |
| `icon` | String |
| `icon-position` | String |
| `label` | String |
| `show-text-label` | Boolean |
| `show-tooltip` | Boolean |
| `toggled-icon` | String |
| `toggled-label` | String |
| `toggled-tooltip` | String |
| `tooltip-direction` | String |
| `always-expanded` | Boolean |

## DDD usage

Its source references 1 distinct design-system variables. By family: font (1). Most used: `--ddd-font-navigation`.
