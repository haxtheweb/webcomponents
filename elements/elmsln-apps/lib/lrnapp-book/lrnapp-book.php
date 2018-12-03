<?php
/**
 * @file
 * Code for LRNApp book
 */
// hook up the book service
define('__ROOT__', dirname(dirname(dirname(__FILE__))));
require_once(__ROOT__.'/services/LRNAppBookService.php');
require_once(dirname(__FILE__).'/LRNAppBookProperties.php');

/**
 *  * Callback for apps/lrnapp-book/api/page/%.
 */
function _lrnapp_book_findone($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];
  $service = new LRNAppBookService();
  // Find out if there is a nid specified
  if ($method == 'GET' || $method == 'PUT' || $method == 'DELETE') {
    // load up active based on the two spots it could be
    $node = $service->loadActiveNode();
    if (isset($node->nid)) {
      // if it's a GET method then we can return the node.
      switch ($method) {
        case 'GET':
          $return['data'] = $service->getPage($node->nid);
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
          $post_data = file_get_contents("php://input");
          $post_data = json_decode($post_data);
          // try to update the node
          try {
            $update = $service->updatePage($post_data, $post_data->id);
            $return['data'] = $update;
          }
          // if it fails we'll add errors and return 500
          catch (Exception $e) {
            $return['status'] = 500;
            $return['errors'][] = $e->getMessage();
          }
        break;
        case 'DELETE':
          try {
            $delete = $service->deletePage($node->nid);
          }
          catch (Exception $e) {
            $return['status'] = 500;
            $return['errors'][] = $e->getMessage();
          }
        break;
      }
    }
    else {
      $return['status'] = 404;
    }
  }

  return $return;
}

/**
 * Callback for apps/lrnapp-book/api/page/create-stub
 */
function _lrnapp_book_create_stub($machine_name, $app_route, $params, $args) {
  $return = array('status' => 200);
  $method = $_SERVER['REQUEST_METHOD'];

  // Find out if there is a nid specified
  if ($method == 'POST') {
    $post_data = file_get_contents("php://input");
    if ($post_data) {
      $post_data = json_decode($post_data);
      $service = new LRNAppBookService();
      try {
        $page = $service->createStubPage($post_data);
        $return['status'] = 201;
        $return['data'] = $page;
      }
      // if it fails we'll add errors and return 500
      catch (Exception $e) {
        $return['errors'][] = $e->getMessage();
      }
    }
    else {
      $return['status'] = 422;
      $return['errors'][] = t('Parent or book id missing');
    }
  }
  else {
    $return['status'] = 400;
    $return['errors'][] = t('Bad request. Method not allowed.');
  }

  return $return;
}

/**
 * Callback for apps/lrnapp-book/api/outline.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_book_outline_data($machine_name, $app_route, $params, $args) {
  $return = array();
  $items = array();
  $status = 404;
  $service = new LRNAppBookService();
  $node = $service->loadActiveNode();
  if (isset($node->nid)) {
    $page = $service->getPage($node->nid);
    $outline = $service->getOutline($node->nid);
    foreach ($outline as $key => $page) {
      $items[$key] = array(
        'title' => $page->attributes->title,
        'url' => base_path() . $app_route . '/' . $page->meta->link,
        'status' => 'available',
        'value' => 0,
        'max' => 100,
        'icon' => $page->meta->icon,
        'iconComplete' => 'check',
        'type' => 'node',
        'id' => $page->id,
        'hasChildren' => $page->relationships->has_children,
      );
    }
    $return['outlineTitle'] = $page->attributes->title;
  }
  $return['items'] = $items;
  // verify this is a node
  if (isset($node->nid)) {
    $status = 200;
  }

  return array(
    'status' => $status,
    'data' => $return
  );
}

/**
 * Callback for apps/lrnapp-book/api/progress-dashboard.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_book_progress_dashboard_data($machine_name, $app_route, $params, $args) {
  $return = array();
  $items = array();
  $userdata = array();
  $status = 404;
  $service = new LRNAppBookService();
  $node = $service->loadActiveNode();
  if (isset($node->nid)) {
    $items = $service->getOutline($node->nid);
    $userdata = $service->getUserData($GLOBALS['user']->uid, $items);
  }
  $return['items'] = $items;
  $return['userdata'] = $userdata;
  // verify this is a node
  if (isset($node->nid)) {
    $status = 200;
  }

  return array(
    'status' => $status,
    'data' => $return
  );
}

/**
 * Callback for apps/lrnapp-book/api/book.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_book_book_data($machine_name, $app_route, $params, $args) {
  $return = array();
  $items = array();
  $status = 404;
  $service = new LRNAppBookService();
  $node = $service->loadActiveNode();
  if (isset($node->nid)) {
    $tmp = menu_tree_all_data($node->book['menu_name']);
    $menu = array_pop($tmp);
    // treat as a book outline instead of in depth outline
    $outline = $service->getOutline($node->nid, TRUE);
    $items = $service->encodeOutline($outline, $menu['below'], $app_route . '/');
    $render = $service->renderOutline($items);
  }
  $return = array(
    'items' => $items,
    'outline' => $outline,
    'render' => $render,
  );
  // verify this is a node
  if (isset($node->nid)) {
    $status = 200;
  }

  return array(
    'status' => $status,
    'data' => $return
  );
}

/**
 * Callback for apps/lrnapp-book/api/book.
 * @param  string $machine_name machine name of this app
 * @return array               data to be json encoded for the front end
 */
function _lrnapp_book_page_data($machine_name, $app_route, $params, $args) {
  $status = 404;
  $return = array();
  $service = new LRNAppBookService();
  $node = $service->loadActiveNode();
  if (isset($node->nid)) {
    $return = array(
      'title' => _lrnapp_book_render_active_title(),
      'content' => _lrnapp_book_render_active_node(),
      'page' => $service->getPage($node->nid),
    );
    $status = 200;
  }
  return array(
    'status' => $status,
    'data' => $return
  );
}
