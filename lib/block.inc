<?php

use Drupal\Core\Entity\EntityInterface;
use Drupal\node\Entity\Node;

/**
 * Implements hook_preprocess_block()
 */
function ukd8_preprocess_block(&$variables) {
  // Convenience variable for block headers.
  $title_class = &$variables['title_attributes']['class'];

  // Generic block header class.
  $title_class[] = 'block-title';

  $region = isset($variables['configuration']['region']) ? $variables['configuration']['region'] : '';

  if ($region == 'header') {
    $title_class[] = 'visually-hidden';
  }

  // Add a unique class for each block for styling.
  if (isset($variables['attributes']['id'])) {
    $variables['attributes']['class'][] = $variables['attributes']['id'];
    // also save it for later
    $variables['content']['#attributes']['block_id'] = $variables['attributes']['id'];
  }

  // helper variable
  foreach ($variables['content'] as $k => $v) {
    if (strpos($k, 'field_')===0) {
      if (isset($v['#items'])) {
        $variables['block'][$k] = $v['#items'];
      }
    }
  }

  // inject parent for section nav block
  if ($variables['plugin_id'] == 'menu_block:main') {
    if ($node = \Drupal::request()->attributes->get('node')) {
      $node_id = $node->id();
      
      /** @var \Drupal\Core\Menu\MenuLinkManagerInterface $menu_link_manager */
      $menu_link_manager = \Drupal::service('plugin.manager.menu.link');
      $links = $menu_link_manager->loadLinksByRoute('entity.node.canonical', ['node' => $node_id]);

      /** @var \Drupal\Core\Menu\MenuLinkInterface $link */
      $link = array_pop($links);

      /** @var \Drupal\Core\Menu\MenuLinkInterface $parent */
      if ($link && $link->getParent() && $parent = $menu_link_manager->createInstance($link->getParent())) {
        $route = $parent->getUrlObject()->getRouteParameters();
        $variables['parent_link'] = [
          '#type' => 'link',
          '#title' => $parent->getTitle(),
          '#url' => $parent->getUrlObject(),
          '#attributes' => [
            'class' => [
              'link--fancy-reverse',
            ],
          ],
        ];
      }
    }
  }
}

/**
 * Implements hook_theme_suggestions_block_alter()
 */
function ukd8_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  // Block suggestions for custom block bundles.
  if (isset($variables['elements']['content']['#block_content'])) {
    array_splice($suggestions, 1, 0, 'block__bundle__' . $variables['elements']['content']['#block_content']->bundle());
  }
}