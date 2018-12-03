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
 * Callback for getting comment data out of Drupal
 */
function _lrnapp_studio_dashboard_recent_comments($machine_name, $app_route, $params, $args) {
  $data = array();
  $options = new stdClass();
  $options->order = array('property' => array(array('changed', 'DESC')));
  $options->filter = array('author' => array($GLOBALS['user']->uid, '<>'));
  $options->limit = array(0, 3);
  // invoke our submission service to get submissions
  $service = new LRNAppOpenStudioCommentService();
  $data = $service->getComments($options);
  $status = 200;
  return array(
    'status' => $status,
    'data' => $data
  );
}
/**
 * Callback to get details of the recent project
 */
function _lrnapp_studio_dashboard_recent_project($machine_name, $app_route, $params, $args) {
  $data = array();
  $status = 200;
  // get the last thing they touched of their own creation
  $options = new stdClass();
  $options->order = array('property' => array(array('changed', 'DESC')));
  $options->limit = array(0, 1);
  $options->filter = array('author' => $GLOBALS['user']->uid);
  // invoke our submission service to get submissions
  $service = new LRNAppOpenStudioSubmissionService();
  $data = $service->getSubmissions($options);
  // make sure we got something
  if (!empty($data)) {
    $submission = array_pop($data);
    // invoke our project service to get assignments
    $service = new LRNAppOpenStudioProjectService();
    $project = $service->getProject($submission->relationships->project->data->id);
    if (!empty($project)) {
      $project->relationships->assignments = array();
      // loop through the steps and pull in all the assignments
      foreach ($project->attributes->steps as $step) {
        $assignment = node_load($step->id);
        if (isset($assignment->nid) && $assignment->status) {
          $project->relationships->assignments['assignment-' . $assignment->nid] = _cle_assignment_v1_assignment_output($assignment, $app_route);
        }
      }
    }
    $data = $project;
  }
  return array(
    'status' => $status,
    'data' => $data
  );
}
/**
 * Get recent submission info
 */
function _lrnapp_studio_dashboard_recent_submissions($machine_name, $app_route, $params, $args) {
  $data = array();
  $status = 200;
  $options = new stdClass();
  $options->filter['state'] = array('submission_ready', '=');
  $options->order = array('property' => array(array('changed', 'DESC')));
  $options->limit = array(0, 3);
  // invoke our submission service to get submissions
  $service = new LRNAppOpenStudioSubmissionService();
  $data = $service->getSubmissions($options);
  return array(
    'status' => $status,
    'data' => $data
  );
}

/**
 * Get recent submission info
 */
function _lrnapp_studio_dashboard_need_feedback($machine_name, $app_route, $params, $args) {
  $data = array();
  $status = 200;
  $options = new stdClass();
  $options->filter['state'] = array('submission_ready', '=');
  $options->order = array('property' => array(array('changed', 'DESC')));
  // don't show student's own submissions in needing feedback column
  $options->filter['author'] = array($GLOBALS['user']->uid, '<>');
  $options->limit = array(0, 3);
  $options->tags = array('nocomments');
  // invoke our submission service to get submissions
  $service = new LRNAppOpenStudioSubmissionService();
  $data = $service->getSubmissions($options);
  return array(
    'status' => $status,
    'data' => $data
  );
}