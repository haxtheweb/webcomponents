<?php
/**
 * Require the submission service.
 */
define('__ROOT__', dirname(dirname(dirname(__FILE__))));
require_once(__ROOT__.'/services/LRNAppOpenStudioSubmissionService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioProjectService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioAssignmentService.php');
require_once(__ROOT__.'/services/LRNAppOpenStudioCommentService.php');

// Start with list of students in active section
// select student, return

/**
 * Callback for apps/open-studio/project.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_studio_instructor_project_data($machine_name, $app_route, $params, $args) {
  $status = 200;
  $data = array();
  // get projects assembled
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
  return array(
    'status' => $status,
    'data' => $data
  );
}

/**
 * Callback for apps/open-studio/student.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_studio_instructor_student_data($machine_name, $app_route, $params, $args) {
  $status = 403;
  $data = array();
  $numComments = 0;
  $numSubmissions = 0;
  $stats = array(
    'byassignment' => array(
      'comments' => array(),
      'submissions' => array(),
      'commenters' => array(),
    ),
    'bystudent' => array(
      'assignments' => array(),
      'comments' => array(),
    ),
    'bysubmission' => array(
      'comments' => array(),
    ),
  );
  if (is_numeric($params['projectId'])) {
    $status = 200;
    $options = new stdClass();
    $submissionService = new LRNAppOpenStudioSubmissionService();
    $commentService = new LRNAppOpenStudioCommentService();
    $assignmentService = new LRNAppOpenStudioAssignmentService();
    $projectService = new LRNAppOpenStudioProjectService();
    // load project
    $project = $projectService->getProject($params['projectId']);
    // make sure 0 is for all these to start off
    foreach ($project->attributes->steps as $step) {
      $stats['byassignment']['comments'][$step->id] = 0;
    }
    // load section
    $section_id = _cis_connector_section_context();
    // try and load by id since og_context wants a node id not our primary key
    $nid = _cis_section_load_section_by_id($section_id);
    // roster of current section
    $roster = _cis_section_load_users_by_gid($nid);
    // student centric data to return
    $students = Array();
    $options = new stdClass();
    // walk the roster and build from there
    foreach ($roster as $uid) {
      $students[$uid] = new stdClass();
      $students[$uid]->assignmentComments = array();
      $students[$uid]->assignments = array();
      $students[$uid]->id = $uid;
      $tmp = user_load($uid);
      $students[$uid]->name = $tmp->name;
      $students[$uid]->display_name = _elmsln_core_get_user_name('full', $uid);
      $students[$uid]->avatar = _elmsln_core_get_user_picture('avatar', $uid);
      $students[$uid]->visual = _elmsln_core_get_user_extras($uid);
      $students[$uid]->sis = _elmsln_core_get_sis_user_data($uid);
      // establish 0 for all assignment commenting and either submission
      // data or FALSE to indicate if they have submitted the assignment
      foreach ($project->attributes->steps as $assignment) {
        $students[$uid]->assignmentComments[$assignment->id] = array();
        $submission = $submissionService->getSubmissionByAssignment($assignment->id, $uid, TRUE);
        $students[$uid]->assignments[$assignment->id] = $submission;
        if ($submission) {
          $numSubmissions++;
          $stats['byassignment']['submissions'][$assignment->id]++;
          $stats['bystudent']['assignments'][$uid]++;
        }
      }
      // change service to get things per user
      $options = new stdClass();
      $options->filter['author'] = $uid;
      // load comments for this user
      $comments = $commentService->getComments($options);
      // regroup based on assignment, related to the submission
      foreach ($comments as $id => $comment) {
        $submission = node_load($comment->relationships->node->data->id);
        $students[$uid]->assignmentComments[$submission->field_assignment['und'][0]['target_id']][$submission->nid] = $submission->nid;
        // helps ensure we're only capturing info about assignments in the
        // active project since prior filtering is rather complex ahead of time
        if (isset($students[$uid]->assignments[$submission->field_assignment['und'][0]['target_id']])) {
          $numComments++;
          // ensure we have 0s here to start
          if (!isset($stats['byassignment']['comments'][$submission->field_assignment['und'][0]['target_id']])) {
              $stats['byassignment']['comments'][$submission->field_assignment['und'][0]['target_id']] = 0;
            }
          // only comment comments NOT to their own submission
          // these we don't even care if it's back and forth as
          // we are looking for trends in people talking to each other
          // or discussing work not their own
          if ($submission->uid != $comment->relationships->author->data->id) {
            $stats['byassignment']['comments'][$submission->field_assignment['und'][0]['target_id']]++;
            $stats['bysubmission']['comments'][$submission->nid]++;
            if (!isset($stats['byassignment']['commenters'][$submission->field_assignment['und'][0]['target_id']])) {
              $stats['byassignment']['commenters'][$submission->field_assignment['und'][0]['target_id']] = array();
            }
            // we can pull count from this point to see how many unique there are
            $stats['byassignment']['commenters'][$submission->field_assignment['und'][0]['target_id']][$submission->uid] = $submission->uid;
            $stats['bystudent']['comments'][$submission->uid]++;
          }
        }
      }
    }
    $data['students'] = $students;
    $steps = array();
    // ensure assignments come across as a simple object
    foreach ($project->attributes->steps as $step) {
      $steps[$step->id] = $step;
    }
    // normalize the unique commenters data
    foreach ($stats['byassignment']['commenters'] as $nid => $counter) {
      $stats['byassignment']['commenters'][$nid] = count($stats['byassignment']['commenters'][$nid]);
    }
    $data['assignments'] = $steps;
    $data['stats'] = new stdClass();
    $data['stats']->stats = $stats;
    // return some nice simple stats for reference
    $data['stats']->overview = t('@stucount students that have produced @subcount submissions and made @ccount comments across @acount assignments.', array('@acount' => count($steps), '@stucount' => count($students), '@subcount' => $numSubmissions, '@ccount' => $numComments));
  }
  return array(
    'status' => $status,
    'data' => $data
  );
}

function _lrnapp_studio_instructor_active_student() {
  $node = FALSE;
  $arg = arg(3);
  $argfallback = arg(4);
  // check for node expressed directly via URL; less optimal
  if (!empty($_GET['node']) && is_numeric($_GET['node'])) {
    $node = node_load($_GET['node']);
  }
  // check for arg 3 for pattern apps/lrnapp-book/node/{id}
  else if (!empty($arg) && is_numeric($arg) ) {
    $node = node_load($arg);
  }
  // check for arg 4 for pattern apps/lrnapp-book/api/page/{id}
  else if (!empty($argfallback) && is_numeric($argfallback) ) {
    $node = node_load($argfallback);
  }
  else {
    $node = menu_get_object();
  }
  return $node;
}