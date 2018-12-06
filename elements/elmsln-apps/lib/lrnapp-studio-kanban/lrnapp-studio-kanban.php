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
 * Callback for apps/lrnapp-studio-kanban/project-data.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _cle_studio_kanban_kanban_data($machine_name, $app_route, $params, $args) {
  $data = array();
  $status = 200;
  $data = [];
  // see if we're doing updates from the app
  if (isset($params['submissionid'])) {
    // load the submission node, typecasting
    $submission = node_load($params['submissionid']);
    // ensure they have access to this
    if (entity_access('update', 'node', $submission)) {
      // simple toggle of true / false on submission state
      if ($params['status'] == 'true') {
        $submission->field_submission_state[LANGUAGE_NONE][0]['value'] = 'submission_ready';
      }
      else {
        $submission->field_submission_state[LANGUAGE_NONE][0]['value'] = 'submission_in_progress';
      }
      // save the node
      node_save($submission);
      // load the assignment this was related to
      $assignment = node_load($submission->field_assignment[LANGUAGE_NONE][0]['target_id']);
      // rebuild the part of the metadata array for the front-end and ship it off
      $data = _cle_submission_submission_status($assignment);
      $status = 200;
    }
    else {
      $status = 403;
    }
  }
  else {
    $data = array(
      'canCreateProjects' => user_access('create cle_project content'),
      'projects' => array(),
    );
    $options = new stdClass();
    $options->order = array();
    $service = new LRNAppOpenStudioProjectService();
    $assignmentservice = new LRNAppOpenStudioAssignmentService();
    $data['projects'] = $service->getProjects($options);
    if (!empty($data['projects'])) {
      $status = 200;
      foreach ($data['projects'] as $key => &$project) {
        $project->relationships->assignments = array();
        // loop through the steps and pull in all the assignments
        foreach ($project->attributes->steps as $step) {
          $assignment = $assignmentservice->getAssignment($step->id);
          if ($assignment) {
            $encoded_assignment = $assignmentservice->encodeAssignment($assignment, $app_route);
            if ($encoded_assignment) {
              $project->relationships->assignments['assignment-' . $encoded_assignment->id] = $encoded_assignment;
            }
          }
        }
      }
    }
  }
  return array(
    'status' => $status,
    'data' => $data
  );
}

function _cle_studio_kanban_project_findone($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'GET' || $method == 'PUT' || $method == 'DELETE') {
    if (isset($args[2])) {
      $nid = $args[2];
      if ($nid) {
        // if it's a GET method then we can return the node.
        switch ($method) {
          case 'GET':
            $service = new LRNAppOpenStudioProjectService();
            $return['data'] = $service->getProject($args[2]);
            break;
          case 'PUT':
            $service = new LRNAppOpenStudioProjectService();
            $post_data = file_get_contents("php://input");
            $post_data = json_decode($post_data);
            // try to update the node
            try {
              $update = $service->updateProject($post_data, $args[2]);
              $return['data'] = $update;
            }
            // if it fails we'll add errors and return 500
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
            break;
          case 'DELETE':
            $service = new LRNAppOpenStudioProjectService();
            try {
              $delete = $service->deleteProject($args[2]);
            }
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
            break;
          default:
            # code...
            break;
        }
      }
      else {
        $return['status'] = 404;
      }
    }
  }

  return $return;
}

function _cle_studio_kanban_project_create_stub($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'POST') {
    $service = new LRNAppOpenStudioProjectService();
    try {
      $project = $service->createStubProject();
      if ($project) {
        $return['status'] = 201;
        $return['data'] = $project;
      }
      else {
        $return['errors'][] = t('Could not create project.');
      }
    }
    // if it fails we'll add errors and return 422 to indicate that it couldn't be completed
    // based off of what was sent.
    catch (Exception $e) {
      $return['status'] = 422;
      $return['errors'][] = $e->getMessage();
    }
  }
  else {
    $return['status'] = 400;
    $return['errors'][] = t('Bad request. Method not allowed.');
  }

  return $return;
}

function _cle_studio_kanban_project_index($machine_name, $app_route, $params, $args) {
  $return = array();
  $status = 200;
  $service = new LRNAppOpenStudioProjectService();

  $return = $service->getProjects();

  return array(
    'status' => 200,
    'data' => $return
  );
}

function _cle_studio_kanban_assignment_findone($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'GET' || $method == 'PUT' || $method == 'DELETE') {
    if (isset($args[2])) {
      $nid = $args[2];
      if ($nid) {
        // if it's a GET method then we can return the node.
        switch ($method) {
          case 'GET':
            $service = new LRNAppOpenStudioAssignmentService();
            $return['data'] = $service->getAssignment($nid);
            break;
          case 'PUT':
            $service = new LRNAppOpenStudioAssignmentService();
            $post_data = file_get_contents("php://input");
            $post_data = json_decode($post_data);
            // try to update the node
            try {
              $update = $service->updateAssignment($post_data, $nid);
              $return['data'] = $update;
            }
            // if it fails we'll add errors and return 500
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
            break;
          case 'DELETE':
            $service = new LRNAppOpenStudioAssignmentService();
            try {
              $delete = $service->deleteAssignment($nid);
              $return['data'] = $delete;
            }
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
            break;
          default:
            # code...
            break;
        }
      }
      else {
        $return['status'] = 404;
      }
    }
  }

  return $return;
}

function _cle_studio_kanban_assignment_create_stub($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'POST') {
    $post_data = file_get_contents("php://input");
    if ($post_data) {
      $post_data = json_decode($post_data);
      $service = new LRNAppOpenStudioAssignmentService();
      try {
        $assignment = $service->createStubAssignment($post_data);
        if (isset($assignment->nid)) {
          $return['status'] = 201;
          $return['data'] = $service->encodeAssignment($assignment, $app_route);
        }
        else {
          $return['errors'][] = t('Could not create assignment.');
        }
      }
      // if it fails we'll add errors and return 500
      catch (Exception $e) {
        $return['status'] = 422;
        $return['errors'][] = $e->getMessage();
      }
    }
    else {
      $return['status'] = 422;
      $return['errors'][] = t('No project id defined.');
    }
  }
  else {
    $return['status'] = 400;
    $return['errors'][] = t('Bad request. Method not allowed.');
  }

  return $return;
}

function _cle_studio_kanban_assignment_index($machine_name, $app_route, $params, $args) {
  $return = array();
  $status = 200;
  $service = new LRNAppOpenStudioAssignmentService();

  $return = $service->getAssignments();
  $items = $this->encodeAssignments($items, $app_route);
  foreach ($items as $key => $data) {
    $return['assignment-' . $key] = $data;
  }
  return $return;

  return array(
    'status' => 200,
    'data' => $return
  );
}
