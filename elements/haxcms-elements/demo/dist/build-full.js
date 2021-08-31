// the base line build that's used to setup everything in a production environment
import "./build.js";
import "./app.js";
import "./build-home.js";
import "./build-install.js";
import "./build-haxcms.js";
// we build elmsln dependency trees from here since there's so much overlap.
import "./build-elmsln.js";
// important in smaller builds
import "@lrnwebcomponents/baseline-build-hax/baseline-build-hax.js";
window.process = { env: { NODE_ENV: 'production' } };
// supported backends
import "@lrnwebcomponents/haxcms-elements/lib/core/backends/haxcms-backend-beaker.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/backends/haxcms-backend-demo.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/backends/haxcms-backend-php.js";
// core HAXcms
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-editor-builder.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-builder.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-editor-ui.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-editor.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/site-list/haxcms-site-listing.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-router.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";

// pieces of UI
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-render-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";

// themes are dynamically imported and without directly being mentioned
import "@lrnwebcomponents/haxcms-elements/lib/development/haxcms-dev-theme.js";
import "@lrnwebcomponents/haxcms-elements/lib/development/haxcms-theme-developer.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-slide-theme.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-minimalist-theme.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-basic-theme.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-custom-theme.js";
import "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-user-theme.js";
import "@lrnwebcomponents/outline-player/outline-player.js";
import "@lrnwebcomponents/simple-blog/simple-blog.js";
import "@lrnwebcomponents/learn-two-theme/learn-two-theme.js";
import "@lrnwebcomponents/haxor-slevin/haxor-slevin.js";

// these should all be dynamically imported as well
import "@lrnwebcomponents/voice-recorder/voice-recorder.js";
import "@lrnwebcomponents/h5p-element/h5p-element.js";
import "@lrnwebcomponents/hax-logo/hax-logo.js";
import "@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js";
import "@lrnwebcomponents/citation-element/citation-element.js";
import "@lrnwebcomponents/hero-banner/hero-banner.js";
import "@lrnwebcomponents/image-compare-slider/image-compare-slider.js";
import "@lrnwebcomponents/license-element/license-element.js";
import "@lrnwebcomponents/lrn-aside/lrn-aside.js";
import "@lrnwebcomponents/lrn-math/lrn-math.js";
import "@lrnwebcomponents/lrn-table/lrn-table.js";
import "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";
import "@lrnwebcomponents/md-block/md-block.js";
import "@lrnwebcomponents/lrndesign-blockquote/lrndesign-blockquote.js";
import "@lrnwebcomponents/magazine-cover/magazine-cover.js";
import "@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "@lrnwebcomponents/media-image/media-image.js";
import "@lrnwebcomponents/meme-maker/meme-maker.js";
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";
import "@lrnwebcomponents/paper-audio-player/paper-audio-player.js";
import "@lrnwebcomponents/person-testimonial/person-testimonial.js";
import "@lrnwebcomponents/place-holder/place-holder.js";
import "@lrnwebcomponents/q-r/q-r.js";
import "@lrnwebcomponents/full-width-image/full-width-image.js";
import "@lrnwebcomponents/self-check/self-check.js";
import "@lrnwebcomponents/simple-concept-network/simple-concept-network.js";
import "@lrnwebcomponents/stop-note/stop-note.js";
import "@lrnwebcomponents/tab-list/tab-list.js";
import "@lrnwebcomponents/task-list/task-list.js";
import "@lrnwebcomponents/video-player/video-player.js";
import "@lrnwebcomponents/wave-player/wave-player.js";
import "@lrnwebcomponents/wikipedia-query/wikipedia-query.js";
import "@lrnwebcomponents/lrndesign-timeline/lrndesign-timeline.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/html-block/html-block.js";
import "@lrnwebcomponents/user-action/user-action.js";
import "@lrnwebcomponents/rss-items/rss-items.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/r-coder/r-coder.js";
import "@lrnwebcomponents/simple-pages/simple-pages.js";