<?php

/**
 * Implements hook_entity_view_alter() for Media entities.
 *
 * Provides a fallback mechanism for accessing the Media entity
 * in preprocess functions by injecting it into the render array.
 */
function ukd8_entity_view_alter(array &$build, \Drupal\Core\Entity\EntityInterface $entity, $view_mode) {
  // Only process hosted video Media entities
  if ($entity->getEntityTypeId() !== 'media' || $entity->bundle() !== 'hosted_video') {
    return;
  }

  // Inject the Media entity for accessibility in preprocess hooks
  if (isset($build['field_media_video_embed_field']) && is_array($build['field_media_video_embed_field'])) {
    foreach ($build['field_media_video_embed_field'] as $delta => &$item) {
      if (is_numeric($delta) && is_array($item)) {
        $item['#media'] = $entity;
        $item['#media_entity'] = $entity;
        if (isset($item['#element'])) {
          $item['#element']['#media'] = $entity;
          $item['#element']['#media_entity'] = $entity;
        }
      }
    }
  }
}