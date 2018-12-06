<?php
/**
 * @file
 * Upload callback
 */


/**
 * Callback for apps/open-studio/data.
*/
function _webcomponent_app_lrnapp_media_grid($machine_name, $app_route) {
  $return = array();
  // @todo need to pull just the most recent submissions, 1 per project
  // which might be too complex of logic for this efq to express
  // get all submissions
  // unique per project
  // sort by most recent
  // ... ugh... this is more complex then this
  // pull together all the submissions they should be seeing
  $data = _cis_connector_assemble_entity_list('file', 'file', 'fid', '_entity');
  foreach ($data as $item) {
    // only deliver images for this display
    if ($item->type == 'image') {
      $return[$item->fid] = $item;
      $return[$item->fid]->src = file_create_url($item->uri);
    }
  }
  return array(
    'status' => 200,
    'data' => $return
  );
}