<?php
/**
 * @file
 * Upload callback
 */

/**
 * Callback for apps/lrnapp-media-upload/data.
 */
function _webcomponent_app_lrnapp_media_upload($machine_name, $app_route, $params, $args) {
  $status = 403;
  // see if we had a file_wrapper defined, otherwise this is public
  if (isset($params['file_wrapper'])) {
    $file_wrapper = $params['file_wrapper'];
  }
  else {
    $file_wrapper = 'public';
  }
  // check for the uploaded file from our 1-page-uploader app
  // and ensure there are entity permissions to create a file of this type
  if (isset($_FILES['file-upload']) && entity_access('create', 'file', $_FILES['file-upload']['type'])) {
    $upload = $_FILES['file-upload'];
    // check for a file upload
    if (isset($upload['tmp_name']) && is_uploaded_file($upload['tmp_name'])) {
      // get contents of the file if it was uploaded into a variable
      $data = file_get_contents($upload['tmp_name']);
      // see if Drupal can load from this data source
      if ($file = file_save_data($data, $file_wrapper . '://' . $upload['name'])) {
        file_save($file);
        $file->url = file_create_url($file->uri);
        $return = array('file' => $file);
        $status = 200;
      }
    }
  }
  return array(
    'status' => $status,
    'data' => $return
  );
}