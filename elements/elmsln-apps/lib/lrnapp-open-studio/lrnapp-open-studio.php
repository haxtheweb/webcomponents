<?php

/**
 * Require the submission service.
 */
define('__ROOT__', dirname(dirname(dirname(__FILE__))));
require_once(__ROOT__.'/services/LRNAppOpenStudioSubmissionService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioProjectService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioAssignmentService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioFileService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioCommentService.php');

/**
 * Callback for apps/open-studio/data.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _cle_open_studio_app_data($machine_name, $app_route, $params, $args) {
  $status = 200;
  $data = array();
  // pull together all the submissions they should be seeing
  $options = new stdClass();
  // only show things marked ready for feedback
  $options->filter['state'] = array('submission_ready', '=');
  // @todo we need to pull only what we're asked for as a range
  // this way we don't destroy the UI in huge classes
  // invoke our submission service to get submissions
  $service = new LRNAppOpenStudioSubmissionService();
  $data['submissions'] = $service->getSubmissions($options);
  // snag projects
  $service = new LRNAppOpenStudioProjectService();
  $data['projects'] = $service->getProjects();
  return array(
    'status' => $status,
    'data' => $data
  );
}