# image-gallery

A HAX-compatible web component that presents images in multiple layouts. It accepts `media-image` and plain `<img>` elements in light DOM and supports drag-and-drop editing in HAX.

## Display modes

- **Grid** — Responsive CSS grid of thumbnails. Click to open a full-size modal.
- **Masonry** — Column-based layout that adapts to image aspect ratios.
- **Gallery** — Instagram-style viewer with a large main image, side arrow navigation, and a horizontal thumbnail strip below. Alt text is shown as the caption.

## HAX editing

- Toggle **edit mode** to expose light DOM children for direct editing (drag-and-drop, alt text changes).
- **Add image** button injects a placeholder `media-image`.
- **Remove last image** button removes the last child.
- **Break out** button unwraps all images from the gallery into the page.

## Usage

```html
<script type="module" src="image-gallery.js"></script>

<image-gallery mode="grid">
  <media-image source="image1.jpg" alt="First image"></media-image>
  <media-image source="image2.jpg" alt="Second image"></media-image>
</image-gallery>
```

## License

Apache-2.0
