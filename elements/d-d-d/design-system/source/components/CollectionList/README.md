# CollectionList

Container that groups and displays multiple collection items.

- Package `@haxtheweb/collection-list` 26.8.0
- HAX block "Collection" (Layout, collection, list, items)

## Usage

```html
<collection-list responsive-size="xs">
  <collection-item image="media/card-1.jpg" alt="Students" line1="Astro 140" icon="courseicons:astro140" line2="Life in the Universe" line3="Dr. Eric Feigelson" url="#"></collection-item>
  <collection-item tags="cool,fun" accent-color="orange" image="media/card-2.jpg" alt="Campus" line1="Chem 110" icon="courseicons:chem110" line2="Chemical Principles" line3="Dr. Joseph Houck" url="#"></collection-item>
  <collection-item image="media/campus.jpg" alt="University" line1="Phys 211" icon="courseicons:phys2" line2="Mechanics" line3="Dr. Louis Leblond" url="#"></collection-item>
</collection-list>
```

## DDD usage

Its source references 36 distinct design-system variables. By family: spacing (42), theme (24), font (12), icon (6), simple-colors (5), border (5). Most used: `--ddd-theme-default-white`, `--ddd-icon-xs`, `--ddd-theme-default-nittanyNavy`, `--ddd-spacing-2`, `--ddd-spacing-30`, `--ddd-spacing-6`.
