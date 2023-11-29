<?php

/**
 * Implements hook_theme_suggestions_page_alter().
 */
function ukd8_theme_suggestions_page_alter(array &$suggestions, array $variables) {
  if ($view_id = \Drupal::routeMatch()->getParameter('view_id')) { 
    $suggestions[] = 'page__view';
    $suggestions[] = 'page__view__'.$view_id; 
  }
}