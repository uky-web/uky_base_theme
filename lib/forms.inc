<?php

/**
 * Implemements template_form_alter()
 */
function ukd8_form_alter(&$form, &$form_state, $form_id) {
  if ($form['#id'] == 'search-form') {
    $form['basic']['submit']['#attributes']['class'][] = 'show-for-sr';
    $form['basic']['keys']['#title'] = t('Search our Site');
  }
}

/**
 * Implemements template_preprocess_item_list()
 */
function ukd8_preprocess_item_list(&$variables) {
  if ($variables['context']['plugin'] == 'node_search') {
    $variables['list_type'] = 'ul';
    $variables['context']['list_style'] = 'search';
    $variables['attributes']['class'][] = 'no-decoration';
  }
}