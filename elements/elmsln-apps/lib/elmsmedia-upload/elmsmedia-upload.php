<?php
/**
 * @file
 * Upload callback
 */

/**
 * Callback for apps/elmsmedia-upload/data.
 */
function _elmsln_core_elmsmedia_upload($machine_name, $app_route, $params, $args) {
  $status = 403;
  // check for the uploaded file from our 1-page-uploader app
  // and ensure there are entity permissions to create a file of this type
  if (isset($_FILES['file-upload'])) {
    $upload = $_FILES['file-upload'];
    // check for a file upload
    if (isset($upload['tmp_name']) && is_uploaded_file($upload['tmp_name'])) {
      $upload['type'] = explode('/', $upload['type']);
      if ($upload['type'][0] == 'application') {
        $upload['type'][0] = 'document';
      }
      // get contents of the file if it was uploaded into a variable
      if ($upload['type'][0] == 'video' || $upload['type'][0] == 'audio') {
        $data = $upload['tmp_name'];
      }
      else {
        $data = file_get_contents($upload['tmp_name']);
        $data = base64_encode($data);
      }
      // post against elmsmedia
      $request = array(
        'bucket' => 'elmsmedia',
        'path' => '/',
        'method' => 'POST',
        'api' => 1,
        'data' => array(
          'elmsln_module' => 'elmsmedia_helper',
          'elmsln_callback' => 'elmsmedia_upload',
          '__course_context' => _cis_connector_course_context(),
          'upload' => $upload,
          'file_data' => $data,
          'user' => $GLOBALS['user']->name,
          'file_wrapper' => 'public',
        ),
      );
      $return = _elmsln_api_request($request);
      // decode the response since it's double encoded json
      $return = json_decode($return);
      // look for a response code and set it as status if we find one
      if (isset($return->response->code)) {
        $status = $return->response->code;
      }
    }
  }
  return array(
    'status' => $status,
    'data' => $return
  );
}