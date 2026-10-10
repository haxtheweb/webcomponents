# SimpleRangeInput

Simple styling on a range input.

- Package `@haxtheweb/simple-range-input` 26.8.0

## Usage

```html
<!-- #3107: the bare default now resolves the DDD token fallbacks
             (the DDD base class registers the design system) -->
          <simple-range-input id="test"></simple-range-input>
          <simple-range-input accent-color="blue"style="--simple-range-input-track-height:15px"></simple-range-input>
          <simple-range-input accent-color="orange" dark style="--simple-range-input-pin-height:10px;--simple-range-input-track-height:2px"></simple-range-input>
          <simple-range-input disabled style="--simple-range-input-pin-height:30px;--simple-range-input-track-height:50px"></simple-range-input>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `dragging` | Boolean |
| `immediate-value` | Number |
| `value` | Number |
| `min` | Number |
| `step` | Number |
| `max` | Number |
| `label` | String |
| `disabled` | Boolean |

## DDD usage

Its source references 5 distinct design-system variables. By family: theme (26), simple-colors (13). Most used: `--ddd-theme-default-coalyGray`, `--simple-colors-default-theme-accent-2`, `--ddd-theme-default-limestoneLight`, `--simple-colors-default-theme-accent-8`, `--ddd-theme-default-white`.
