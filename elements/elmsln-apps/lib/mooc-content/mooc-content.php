<?php
/**
 * @file
 * Code for MOOC content app
 */
// hook up the book service
define('__ROOT__', dirname(dirname(dirname(__FILE__))));
require_once(__ROOT__.'/services/LRNAppBookService.php');

/**
 * Callback for apps/mooc-content/data.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _mooc_content_data($machine_name, $app_route, $params, $args) {
  $status = 404;
  $return = array();
  $ops = array();
  $node = _mooc_content_get_active();
  if (isset($node->nid)) {
    $navigation = _mooc_content_render_navigation();
    // render content
    $content = _mooc_content_render_content();
    // test for array meaning we have an advanced op going on
    if (is_array($content)) {
      $ops = $content;
      $content = '';
    }
    else{
      $content = preg_replace('~>\s+<~', '><', $content);
    }
    // render outline w/ array
    $outline = _mooc_nav_block_mooc_nav_block($node);
    // pull together the right side options
    $options = _mooc_content_render_options();
    // support custom colors / system level styling
    if (module_exists('cis_lmsless')) {
      $colors = _cis_lmsless_get_distro_classes(elmsln_core_get_profile_key());
      $css = _foundation_access_contextual_colors($colors);
    }
    $return = array(
      'title' => _mooc_content_get_title(),
      'topNavigation' => $navigation,
      'content' => $content,
      'bookOutline' => $outline,
      'styles' => $css,
      'options' => $options,
      'ops' => $ops,
    );
    $status = 200;
  }
  return array(
    'status' => $status,
    'data' => $return
  );
}

/**
 * Load blocks for initial paint.
 */
function _mooc_content_get_blocks() {
  // Get blocks from Drupal core, cause #reasons
  $blocks = block_get_blocks_by_region('highlighted');
  // Get blocks from the context module.
  module_invoke_all('context_page_condition');
  module_invoke_all('context_page_reaction');
  if ($plugin = context_get_plugin('reaction', 'block')) {
    $blocks += $plugin->block_get_blocks_by_region('highlighted');
    $blocks += $plugin->block_get_blocks_by_region('sidebar_first');
    drupal_static_reset('context_reaction_block_list');
  }
  $blocks += block_get_blocks_by_region('sidebar_first');
  $block_render = drupal_render($blocks);
  return $block_render;
}
/**
 * Return all aliases for comparison in the event of them being clicked
 * in the app so we know that routing should actually trigger a node id to load.
 */
function _mooc_content_get_aliases() {
  $aliases = &drupal_static(__FUNCTION__);
  if (!$aliases) {
    $result = db_query("SELECT alias,source FROM {url_alias} WHERE source LIKE 'node/%' AND language='und' ORDER BY pid ASC");
    $aliases = $result->fetchAllKeyed();
    $front = variable_get('site_frontpage', 'node');
    // special case for homepage that points to a node
    if (strpos($front, 'node/') === 0) {
      $aliases['/'] = $front;
      $aliases[''] = $front;
      $aliases[base_path()] = $front;
    }
  }
  return $aliases;
}

/**
 * Get active title
 */
function _mooc_content_get_title() {
  $node = _mooc_content_get_active();
  return $node->title;
}
/**
 * Get active nid
 */
function _mooc_content_get_nid() {
  $node = _mooc_content_get_active();
  return $node->nid;
}
/**
 * Get a single alias
 */
function _mooc_content_get_alias() {
  $node = _mooc_content_get_active();
  $aliases = array(drupal_get_path_alias('node/' . $node->nid) => 'node/' . $node->nid);
  return drupal_json_encode($aliases);
}

/**
 * Get the outline area title
 */
function _mooc_content_outline_title(){
  $node = _mooc_content_get_active();
  $tmp = _mooc_nav_block_get_nav($node);
  return $tmp['label'];
}

/**
 * Top navigation
 */
function _mooc_content_render_navigation() {
  $node = _mooc_content_get_active();
  // render navigation
  $vars = _mooc_helper_book_nav_build($node);
  // output contents by passing through the wrapper theme function
  $tmp = theme('book_sibling_nav_wrapper', $vars);
  return render($tmp);
}

/**
 * Oddly specific I know but it's one of the heaviest calls
 * in the entire system.
 */
function _mooc_content_get_outline_data() {
  $bookoutline = _mooc_helper_book_outline(TRUE);
  return array(
    'status' => 200,
    'data' => array(
      'outline' => drupal_render($bookoutline),
      'aliases' => _mooc_content_get_aliases(),
    )
  );
}

/**
 * Get the page options based on this user / path.
 */
function _mooc_content_render_options() {
  $node = _mooc_content_get_active();
  if (node_access('update', $node)) {
    $node_path = base_path() . 'node/' . $node->nid;
  }
  $cis_lmsless = _cis_lmsless_get_distro_classes();
  $distro = elmsln_core_get_profile_key();
  // ok, get all that ugly content together
  $content = '';
  if (isset($node_path)) {
    $content .= '
      <lrnsys-button id="edit-tip" href="' . $node_path . '/edit" class="r-header__icon elmsln-edit-button" data-jwerty-key="e" data-voicecommand="edit" hover-class="' . $cis_lmsless[$distro]['text'] . '" inner-class="no-padding" icon="editor:mode-edit" icon-class="blue-text" alt="' . t('Edit page') . '"><span class="element-invisible">' . t('Edit page') . '</span>
      </lrnsys-button>';
    // show hax link if you have access to it
    if (user_access('use hax')) {
      $content .= '
      <lrnsys-button id="hax-edit-tip" href="' . $node_path . '/hax" class="r-header__icon elmsln-edit-button" data-jwerty-key="h" data-voicecommand="hax" hover-class="' . $cis_lmsless[$distro]['text'] . '" inner-class="no-padding" icon="maps:layers" icon-class="blue-text" alt="' . t('HAX editor') . '"><span class="element-invisible">' . t('HAX editor') . '</span>
      </lrnsys-button>';
    }
    $content .= '
      <paper-menu-button dynamic-align>
        <paper-icon-button id="outlineoptions" class="blue-text" icon="editor:linear-scale" slot="dropdown-trigger" alt="' . t('Edit outline') . '" title="' . t('Edit outline') . '"></paper-icon-button>
        <simple-tooltip for="outlineoptions" animation-delay="200" offset="0">' . t('Outline options') . '</simple-tooltip>
        <paper-listbox slot="dropdown-content">
          <a tabindex="-1" href="' . $node_path . '/outline/children" class="accessible-grey-text"><paper-item>' . t('Child outline') . '</paper-item></a>
          <a tabindex="-1" href="' . base_path() . 'admin/content/book/' . $node->book['bid'] . '" class="accessible-grey-text"><paper-item>' . t('Course outline') . '</paper-item></a>
        </paper-listbox>
      </paper-menu-button>';
  }
  $content .= '<paper-menu-button dynamic-align>
    <paper-icon-button id="printoptions" icon="print" slot="dropdown-trigger" alt="' . t('Print options') . '" title="' . t('Print options') . '"></paper-icon-button>
    <simple-tooltip for="printoptions" animation-delay="200" offset="0">' . t('Print options') . '</simple-tooltip>
    <paper-listbox slot="dropdown-content">
      <a tabindex="-1" target="_blank" href="' . base_path() . 'book/export/html/' . $node->nid . '" class="accessible-grey-text"><paper-item>' . t('Page') . '</paper-item></a>';
  // support print / book printing
  if (user_access('access printer-friendly version')) {
    $bid = $node->book['bid'];
    if ($bid) {
      $content .= '<a tabindex="-1" target="_blank" href="' . base_path() . 'book/export/html/' . $bid . '" class="accessible-grey-text"><paper-item>' . t('Outline') . '</paper-item></a>';
    }
  }
  // print to pdf
  if (user_access('access PDF version') && module_exists('print_pdf')) {
    $content .= '<a tabindex="-1" target="_blank" href="' . base_path() . 'printpdf/' . $node->nid . '" class="accessible-grey-text"><paper-item>' . t('PDF') . '</paper-item></a>';
  }
  $content .='</paper-listbox></paper-menu-button>';
  return $content;
}

/**
 * Render content; stinking weird but basically the entire page.tpl.php
 */
function _mooc_content_render_content() {
  $node = _mooc_content_get_active();
  $content = '';
  // support for banner block
  if (isset($node->body) && !empty($node->body['und'][0]['value'])) {
    if (module_exists('mooc_content_theming')) {
      $content .= _mooc_content_theming_banner_block($node);
    }
    $content_ary = node_view($node);
    // ax contextual links as we don't use this paradigm :)
    unset($content_ary['#contextual_links']);
    $content .= drupal_render($content_ary);
  }
  else {
    // try to skip to the next item if they don't have edit rights
    $next = book_next($node->book);
    // ensure we have a next item and it's in this one
    if ($next && $node->book['mlid'] == $next['plid']) {
      if (entity_access('update', 'node', $node)) {
        $node->body = array(
          'und' => array(
            0 => array(
              'value' => '<div class="blue-text"><em>' . t('This page is empty, so students will automatically be taken to the next page. You have not been redirected so you can edit this content if desired.') . '</em></div>',
              'format' => 'textbook_editor',
            ),
          ),
        );
        $content .= drupal_render(node_view($node));
      }
      else {
      // if the user is a standard user then take them to the next book page
        $content = array(
          'redirect' => base_path() . $next['link_path'],
        );
      }
    }
    else {
      if (module_exists('mooc_content_theming')) {
        $content .= _mooc_content_theming_banner_block($node);
      }
      $content .= drupal_render(node_view($node));
    }
  }
  return $content;
}

/**
 * Simple fast node load.
 */
function _mooc_content_get_active() {
  $node = &drupal_static(__FUNCTION__);
  if (!$node) {
    if (isset($GLOBALS['moocappbook'])) {
      $node = $GLOBALS['moocappbook'];
    }
    else {
      $service = new LRNAppBookService();
      $node = $service->loadActiveNode();
      $GLOBALS['moocappbook'] = $node;
    }
  }
  return $node;
}