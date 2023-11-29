<?php


/**
 * Implements hook_preprocess_page().
 */
function ukd8_preprocess_page(array &$variables) {
  _ukd8_add_theme_settings($variables);
}