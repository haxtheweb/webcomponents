<?php
/**
 * @file
 * Media management callback
 */

/**
 * Callback for apps/lrnapp-media-management/data.
 */
function _webcomponent_app_lrnapp_media_management($machine_name, $app_route) {
  $return = array();
  // @todo need a better render method then this as this is lazy for now
  if (!empty(arg(3)) && is_numeric(arg(3))) {
    $node = node_load(arg(3));
    $node_view = node_view($node);
    $rendered_node = drupal_render($node_view);
    $return = $rendered_node;
  }
  else {
    // @todo need to pull just the most recent submissions, 1 per project
    // which might be too complex of logic for this efq to express
    // get all submissions
    // unique per project
    // sort by most recent
    // ... ugh... this is more complex then this
    // pull together all the submissions they should be seeing
    $data = _cis_connector_assemble_entity_list('node', array(array('section', 'cis_course'), 'NOT IN'), 'nid', '_entity');
    foreach ($data as $item) {
      $return[$item->nid] = new stdClass();
      $return[$item->nid]->title = $item->title;
      $return[$item->nid]->body = strip_tags($item->field_submission_text['und'][0]['safe_value']);
      $return[$item->nid]->url = base_path() . $app_route . '/data/' . $item->nid;
      $return[$item->nid]->edit_url = base_path() . 'node/' . $item->nid . '/edit?destination=' . $app_route;
    }
  }
  return array(
    'status' => 200,
    'data' => $return
  );
}