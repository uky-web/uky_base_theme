<?php

/**
 * Implements theme_preprocess_eck_entity().
 */
function ukd8_preprocess_eck_entity(&$variables) {
  $entity = $variables['eck_entity'];
  // Backwards compatibility.
  $variables['eck'] = $entity;
  $variables['plain_title'] = isset($variables['eck']->title) ?
      strip_tags((string)$variables['eck']->title[0]->value) :
      '';

  // Load up the theme settings; see theme.inc.
  _ukd8_add_theme_settings($variables);
}
