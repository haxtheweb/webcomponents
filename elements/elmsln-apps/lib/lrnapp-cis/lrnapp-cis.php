<?php

define('__ROOT__', dirname(dirname(dirname(__FILE__))));
require_once(__ROOT__.'/services/ELMSLNCourseService.php');
require_once(__ROOT__.'/services/ELMSLNServiceService.php');
/**
 * Callback for apps/lrnapp-cis/data.
 */
function _lrnapp_cis_app_data($machine_name, $app_route, $params, $args) {
  $options = array();
  $courseService = new ELMSLNCourseService();
  $serviceService = new ELMSLNServiceService();
  // get the courses this user has access to and display
  $courses = $courseService->getCourses($options);
  // get a list of services that exist
  $services = $serviceService->getItems($options);
  return array(
    'status' => 200,
    'data' => array(
      'courses' => $courses,
      'services' => $services,
    ),
  );
}

/**
 * Callback for apps/lrnapp-cis/course.
 */
function _lrnapp_cis_course_data($machine_name, $app_route, $params, $args) {
  $options = array();
  $courseService = new ELMSLNCourseService();
  $course = null;
  // get the courses this user has access to and display
  if (is_numeric($params['id'])) {
    // bool tells service to load network topology
    $course = $courseService->getCourse($params['id'], TRUE);
  }
  return array(
    'status' => 200,
    'data' => array('course' => $course),
  );
}


/**
 * Callback for apps/lrnapp-cis/make-service.
 */
function _lrnapp_cis_make_service($machine_name, $app_route, $params, $args) {
  $options = array();
  $data = array();
  $status = 500;
  $serviceService = new ELMSLNServiceService();
  if (isset($params['course']) && isset($params['service'])) {
    $data['service_instance'] = $serviceService->createServiceInstance($params['course'], $params['service']);
    // test for success on creation of the node
    if ($data['service_instance']) {
      $status = 200;
      $course_id = $data['service_instance']->field_course['und'][0]['target_id'];
      // you might find yourself in a beautiful cache bin clear
      // and you may ask yourself? How did I get here?
      // You may say to yourself. This is not my beautiful cache bin clear function!?
      // And you may wonder... how did we do anything without this level of pin prick
      // granularity. As the days go by.. pin pricks flowing from the network.
      cache_clear_all('elmsln:cis:node:type=service_instance:field_course=' . $course_id, 'cache_cis_connector', TRUE);
      // now we get the updated course record
      $courseService = new ELMSLNCourseService();
      $data['course'] = $courseService->getCourse($course_id, TRUE);
    }
  }
  return array(
    'status' => $status,
    'message' => t('@service is currently being built for @course.', array('@service' => $params['service'], '@course' => $params['course'])),
    'data' => $data,
  );
}
