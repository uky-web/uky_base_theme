<?php

function ukd8_preprocess_field(array &$variables) {
  // mark editoral paragraphs for later preprocessing
  if (($variables['element']['#bundle'] == 'page') && ($variables['field_name'] == 'field_paragraphs')) {
    foreach ($variables['items'] as $i => $item) {
      $variables['items'][$i]['content']['#editorial_column'] = TRUE;
    }
  }

  // If chosen is active, load the accessibility fix library
  // NOTE: the module should always be active as it is platform-required, but this check helps ensure it
  if (\Drupal::service('module_handler')->moduleExists('chosen_field')) {
    $variables['#attached']['library'][] =  'ukd8/wcag-chosen-add-labels';
  }

  // For video embed fields, extract and store the Media entity label so nested
  // preprocesses can access it. This works even when the field is hidden in UI.
  if ($variables['field_name'] === 'field_media_video_embed_field') {
    $label = NULL;
    // Try to get the Media entity from the field items
    if (!empty($variables['element']['#items']) && is_object($variables['element']['#items']) && method_exists($variables['element']['#items'], 'getEntity')) {
      $entity = $variables['element']['#items']->getEntity();
      if (is_object($entity) && method_exists($entity, 'label')) {
        $label = $entity->label();
      }
    }

    // Fallback: Try via the object key
    if (empty($label) && !empty($variables['element']['#object']) && is_object($variables['element']['#object']) && method_exists($variables['element']['#object'], 'label')) {
      $label = $variables['element']['#object']->label();
    }

    // Fallback: Try via parent entity on field collection
    if (empty($label) && !empty($variables['element']['#items'])) {
      try {
        $items = $variables['element']['#items'];
        if (method_exists($items, 'getParent')) {
          $parent_entity = $items->getParent()->getEntity();
          if (is_object($parent_entity) && method_exists($parent_entity, 'label')) {
            $label = $parent_entity->label();
          }
        }
      }
      catch (\Exception $e) {
        // Silently fail on fallback
      }
    }

    if (!empty($label)) {
      // Store in request attribute for iframe preprocess to access
      \Drupal::request()->attributes->set('ukd8_video_title', $label);

      // Also inject title directly into iframe markup as primary injection point
      $escaped_label = \Drupal\Component\Utility\Html::escape($label);
      foreach ($variables['items'] as $i => $item) {
        if (!empty($variables['items'][$i]['content']['#markup']) && strpos($variables['items'][$i]['content']['#markup'], '<iframe') !== FALSE) {
          $markup = $variables['items'][$i]['content']['#markup'];
          // Skip if iframe already has a title attribute
          if (preg_match('/<iframe\b[^>]*\btitle=/i', $markup)) {
            continue;
          }
          // Insert title attribute after opening iframe tag
          $new_markup = preg_replace('/<iframe\b(?![^>]*\btitle=)/i', '<iframe title="' . $escaped_label . '"', $markup, 1);
          $variables['items'][$i]['content']['#markup'] = $new_markup;
        }
      }
    }
  }
}

/**
 * Implements template preprocess for the video embed iframe template.
 *
 * Adds a title attribute to iframe output using the Media entity label.
 */
function ukd8_preprocess_video_embed_iframe(array &$variables) {
  $label = NULL;

  // First, try to get title from request attribute set by field preprocess
  $request = \Drupal::request();
  if ($request->attributes->has('ukd8_video_title')) {
    $label = $request->attributes->get('ukd8_video_title');
  }

  // Fallback: Try to get from render element if available
  if (empty($label) && !empty($variables['element']) && is_array($variables['element'])) {
    if (!empty($variables['element']['#items']) && is_object($variables['element']['#items']) && method_exists($variables['element']['#items'], 'getEntity')) {
      $entity = $variables['element']['#items']->getEntity();
      if (is_object($entity) && method_exists($entity, 'label')) {
        $label = $entity->label();
      }
    }
    elseif (!empty($variables['element']['#object']) && is_object($variables['element']['#object']) && method_exists($variables['element']['#object'], 'label')) {
      $label = $variables['element']['#object']->label();
    }
    elseif (!empty($variables['element']['#media']) && is_object($variables['element']['#media']) && method_exists($variables['element']['#media'], 'label')) {
      $label = $variables['element']['#media']->label();
    }
    elseif (!empty($variables['element']['#media_entity']) && is_object($variables['element']['#media_entity']) && method_exists($variables['element']['#media_entity'], 'label')) {
      $label = $variables['element']['#media_entity']->label();
    }
  }

  if (!empty($label)) {
    $escaped_label = \Drupal\Component\Utility\Html::escape($label);

    // Ensure attributes object exists
    if (empty($variables['attributes']) || !is_object($variables['attributes'])) {
      $variables['attributes'] = new \Drupal\Core\Template\Attribute();
    }

    // Set element-level attributes for VideoEmbedIFrame preRender
    if (!empty($variables['element']) && is_array($variables['element'])) {
      if (!isset($variables['element']['#attributes']) || !is_array($variables['element']['#attributes'])) {
        $variables['element']['#attributes'] = [];
      }
      $variables['element']['#attributes']['title'] = $escaped_label;
    }

    // Set attributes for template rendering
    if (is_object($variables['attributes']) && method_exists($variables['attributes'], 'setAttribute')) {
      $variables['attributes']->setAttribute('title', $escaped_label);
    }

    // Make title available to template
    $variables['title'] = $escaped_label;
    $variables['media_label'] = $escaped_label;
  }
}