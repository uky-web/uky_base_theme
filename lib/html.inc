<?php

/**
 * Implements hook_preprocess_HOOK() for html.html.twig.
 */
function ukd8_preprocess_html(array &$variables) {
  /* Add class to html tag */
  //$variables['html_attributes']->addClass('no-js');

  // Don't display the site name twice on the front page (and potentially others)
  /*if (isset($variables['head_title_array']['title']) && isset($variables['head_title_array']['name']) && ($variables['head_title_array']['title'] == $variables['head_title_array']['name'])) {
    $variables['head_title'] = $variables['head_title_array']['name'];
  }*/

  $request = \Drupal::request();

  // intercept some file wrappers and just put up the content
  if ($entity = $request->attributes->get('reusable_files')) {
    // check access - only do this for anon
    if (\Drupal::currentUser()->isAnonymous()) {
        $file_uri = FALSE;

        // if one file, put it up
        $file_field = $entity->field_file;
        if (count($file_field) == 1) {
            $file_uri = $file_field->entity->uri->value;
        }

        if ($file_uri) {
            $file = \Drupal::service('file_system')->realpath($file_uri);
            if (file_exists($file)) {
                $mime = \Drupal::service('file.mime_type.guesser')->guess($file);
                header('Content-Type: ' . $mime);
                header('Content-Length: ' . filesize($file));
                readfile($file);
                exit;
            }
        }
    }
  }

}