// the base line build that's used to setup everything in a production environment
import "./build.js";
import "./app.js";
import "./build-home.js";
import "./build-install.js";
import "./build-haxcms.js";
// we build elmsln dependency trees from here since there's so much overlap.
import "./build-elmsln.js";
// important in smaller builds
import "@haxtheweb/baseline-build-hax/baseline-build-hax.js";
window.process = { env: { NODE_ENV: "production" } };
// supported backends
import "@haxtheweb/haxcms-elements/lib/core/backends/haxcms-backend-beaker.js";
import "@haxtheweb/haxcms-elements/lib/core/backends/haxcms-backend-demo.js";
import "@haxtheweb/haxcms-elements/lib/core/backends/haxcms-backend-php.js";
// core HAXcms
import "@haxtheweb/haxcms-elements/lib/core/haxcms-editor-builder.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-outline-editor-dialog.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-builder.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-router.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/core/HAXCMSThemeWiring.js";

// pieces of UI
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-render-query.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";

// themes are dynamically imported and without directly being mentioned
import "@haxtheweb/haxcms-elements/lib/development/haxcms-dev-theme.js";
import "@haxtheweb/haxcms-elements/lib/development/haxcms-theme-developer.js";
import "@haxtheweb/haxcms-elements/lib/core/themes/haxcms-slide-theme.js";
import "@haxtheweb/haxcms-elements/lib/core/themes/haxcms-minimalist-theme.js";
import "@haxtheweb/haxcms-elements/lib/core/themes/haxcms-basic-theme.js";
import "@haxtheweb/haxcms-elements/lib/core/themes/haxcms-custom-theme.js";
import "@haxtheweb/haxcms-elements/lib/core/themes/haxcms-user-theme.js";
import "@haxtheweb/outline-player/outline-player.js";
import "@haxtheweb/simple-blog/simple-blog.js";
import "@haxtheweb/learn-two-theme/learn-two-theme.js";
import "@haxtheweb/haxor-slevin/haxor-slevin.js";

// these should all be dynamically imported as well
import "@haxtheweb/voice-recorder/voice-recorder.js";
import "@haxtheweb/h5p-element/h5p-element.js";
import "@haxtheweb/hax-logo/hax-logo.js";
import "@haxtheweb/a11y-gif-player/a11y-gif-player.js";
import "@haxtheweb/citation-element/citation-element.js";
import "@haxtheweb/hero-banner/hero-banner.js";
import "@haxtheweb/image-compare-slider/image-compare-slider.js";
import "@haxtheweb/license-element/license-element.js";
import "@haxtheweb/lrn-aside/lrn-aside.js";
import "@haxtheweb/lrn-math/lrn-math.js";
import "@haxtheweb/lrn-table/lrn-table.js";
import "@haxtheweb/lrn-vocab/lrn-vocab.js";
import "@haxtheweb/md-block/md-block.js";
import "@haxtheweb/lrndesign-blockquote/lrndesign-blockquote.js";

import "@haxtheweb/media-behaviors/media-behaviors.js";
import "@haxtheweb/media-image/media-image.js";
import "@haxtheweb/meme-maker/meme-maker.js";
import "@haxtheweb/multiple-choice/multiple-choice.js";
import "@haxtheweb/person-testimonial/person-testimonial.js";
import "@haxtheweb/place-holder/place-holder.js";
import "@haxtheweb/q-r/q-r.js";
import "@haxtheweb/full-width-image/full-width-image.js";
import "@haxtheweb/self-check/self-check.js";

import "@haxtheweb/stop-note/stop-note.js";
import "@haxtheweb/video-player/video-player.js";
import "@haxtheweb/wikipedia-query/wikipedia-query.js";
import "@haxtheweb/lrndesign-timeline/lrndesign-timeline.js";
import "@haxtheweb/html-block/html-block.js";
import "@haxtheweb/user-action/user-action.js";
import "@haxtheweb/rss-items/rss-items.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import "@haxtheweb/r-coder/r-coder.js";
import "@haxtheweb/simple-pages/simple-pages.js";
