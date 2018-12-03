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

function _cle_open_studio_app_submission_findone($machine_name, $app_route, $params, $args) {
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
            $service = new LRNAppOpenStudioSubmissionService();
            $return['data'] = $service->getSubmission($args[2]);
            // update the last viewed history timestamp
            if ($GLOBALS['user']->uid && $return['data']->id) {
              db_merge('history')
                ->key(array(
                  'uid' => $GLOBALS['user']->uid,
                  'nid' => $return['data']->id,
                ))
                ->fields(array('timestamp' => REQUEST_TIME))
                ->execute();
             }
            break;
          case 'PUT':
            $service = new LRNAppOpenStudioSubmissionService();
            $post_data = file_get_contents("php://input");
            $post_data = json_decode($post_data);
            // try to update the node
            try {
              $update = $service->updateSubmission($post_data, $args[2]);
              $return['data'] = $update;
            }
            // if it fails we'll add errors and return 500
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
            break;
          case 'DELETE':
            $service = new LRNAppOpenStudioSubmissionService();
            try {
              $delete = $service->deleteSubmission($args[2]);
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

function _cle_open_studio_app_submission_create_stub($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'POST') {
    $post_data = file_get_contents("php://input");
    if ($post_data) {
      $post_data = json_decode($post_data);
      $service = new LRNAppOpenStudioSubmissionService();
      try {
        $submission = $service->createStubSubmission($post_data);
        $return['status'] = 201;
        $return['data'] = $submission;
      }
      // if it fails we'll add errors and return 500
      catch (Exception $e) {
        $return['errors'][] = $e->getMessage();
      }
    }
    else {
      $return['status'] = 422;
      $return['errors'][] = t('No assignment id defined.');
    }
  }
  else {
    $return['status'] = 400;
    $return['errors'][] = t('Bad request. Method not allowed.');
  }

  return $return;
}

function _cle_open_studio_app_submission_index($machine_name, $app_route, $params, $args) {
  $return = array();
  $status = 200;
  $service = new LRNAppOpenStudioSubmissionService();

  $return = $service->getSubmissions();

  return array(
    'status' => 200,
    'data' => $return
  );
}

function _cle_open_studio_app_file_index($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];
  $file_service = new LRNAppOpenStudioFileService();

  if ($method == 'POST') {
    // check for a file upload
    if (isset($_FILES['file-upload']) && isset($_FILES['file-upload']['type']) && isset($_FILES['file-upload']['tmp_name'])) {
      // find out what the file type is. It's often separated by a '/'
      $type = explode('/', $_FILES['file-upload']['type']);
      $type = $type[0];
      $tmp_name = $_FILES['file-upload']['tmp_name'];
      $options = array();
      if (isset($params['file_wrapper'])) {
        $options['file_wrapper'] = $params['file_wrapper'];
      }
      if (isset($_FILES['file-upload']['name'])) {
        $options['name'] = $_FILES['file-upload']['name'];
      }
      $file = $file_service->create($type, $tmp_name, $options);
      $return['data'] = array('file' => $file);
    }
  }
  return $return;
}

function _cle_open_studio_app_video_index($machine_name, $app_route, $params, $args) {
  return array('status' => 403);
}

function _cle_open_studio_app_video_generate_source_url($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method == 'POST') {
    $post_data = file_get_contents("php://input");
    $submission_service = new LRNAppOpenStudioSubmissionService;
    $src_url = $submission_service->videoGenerateSourceUrl($post_data);
    if ($src_url) {
      $return['data'] = $src_url;
      return $return;
    }
  }
  else {
    return array('status' => 400, 'errors' => array(t('No video url was provided')));
  }
  return array('status' => 422, 'errors' => array(t('Unprocessable entity')));
}

function _cle_open_studio_app_submission_comments($machine_name, $app_route, $params, $args) {

  $comments_service = new LRNAppOpenStudioCommentService();
  $submission_id = $args[2];
  $options = new stdClass();
  $options->filter = array('submission' => $submission_id);
  $data = $comments_service->getComments($options);

  return array('status' => 200, 'data' => $data);
}

function _cle_open_studio_app_submission_comments_findone($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];
  // Find out if there is a nid specified
  if ($method == 'POST' || $method == 'GET' || $method == 'PATCH' || $method == 'PUT' || $method == 'DELETE') {
    if (isset($args[2])) {
      $nid = $args[2];
      if ($nid) {
        // if it's a GET method then we can return the node.
        switch ($method) {
          case 'POST':
            // ensure this is a post to make a stub
            if ($args[count($args)-1] == 'create-stub') {
              $post_data = file_get_contents("php://input");
              if ($post_data) {
                $data = array(
                  'nid' => $args[2],
                  'pid' => json_decode($post_data)
                );
              }
              else {
                $data = array(
                  'nid' => $args[2],
                  'pid' => 0
                );
              }
              $service = new LRNAppOpenStudioCommentService();
              try {
                $comment = $service->createStubComment($data);
                $return['data'] = $comment;
              }
              // if it fails we'll add errors and return 500
              catch (Exception $e) {
                $return['status'] = 500;
                $return['errors'][] = $e->getMessage();
              }
            }
          break;
          case 'GET':
            $service = new LRNAppOpenStudioCommentService();
            $return['data'] = $service->getComment($args[4]);
          break;
          case 'PUT':
            $service = new LRNAppOpenStudioCommentService();
            $post_data = file_get_contents("php://input");
            $post_data = json_decode($post_data);
            // try to update the node
            try {
              $update = $service->updateComment($post_data, $args[4]);
              $return['data'] = $update;
            }
            // if it fails we'll add errors and return 500
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
          break;
          case 'DELETE':
            $service = new LRNAppOpenStudioCommentService();
            try {
              $delete = $service->deleteComment($args[4]);
              $return['data'] = $delete;
            }
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
          break;
          // treat patch like a like statement
          case 'PATCH':
            $service = new LRNAppOpenStudioCommentService();
            try {
              $like = $service->likeComment($args[4]);
              $return['data'] = $like;
            }
            catch (Exception $e) {
              $return['status'] = 500;
              $return['errors'][] = $e->getMessage();
            }
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

// function cle_open_studio_app_cle_open_studio_app_encode_submission_alter(&$submissions) {
//   if (_assignment_is_open()) {
//     $action = new stdClass();
//     $action->title = 'Make a Submission';
//     $action->url = '/lrnapp-submission/create';
//     $submissions->actions[] = $action;
//   }
// }