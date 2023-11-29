<?php

use Drupal\Component\Utility\Html;
use Drupal\block\Entity\Block;

/**
 * Implements hook_preprocess_node().
 */
function ukd8_preprocess_node(array &$variables) {
    $node = $variables['node'];
    $type = $node->getType();

    $variables['plain_title'] = isset($node->title[0]->value) ?
    strip_tags((string)$node->title[0]->value) :
    '';
    $variables['is_front'] = \Drupal::service('path.matcher')->isFrontPage();
    $variables['base_path'] = base_path();

    // page block injection
    // Allowed view modes
    $current_view_mode = $variables['view_mode'];
    $allowed_view_modes = ['full']; 
    if (in_array($current_view_mode, $allowed_view_modes)) {
        // Allowed regions (for performance so as to not execute for unneeded region)
        $allowed_regions = ['sidebar', 'breadcrumb'];
        _ukd8_add_regions_to_node($allowed_regions, $variables);
    }
}

function _ukd8_add_regions_to_node($allowed_regions, &$variables) {
    $theme = \Drupal::theme()->getActiveTheme()->getName();
 
    // Retrieve theme regions
    $available_regions = system_region_list($theme, 'REGIONS_ALL');
   
    // Validate allowed regions with available regions
    $regions = array_intersect(array_keys($available_regions), $allowed_regions);
   
    // For each region
    foreach ($regions as $region) {
   
        // Load region blocks
        $blocks = \Drupal::entityTypeManager()
            ->getStorage('block')
            ->loadByProperties(array('theme' => $theme, 'region' => $region));

        // Sort ‘em
        uasort($blocks, 'Drupal\block\Entity\Block::sort');

        // Capture viewable blocks and their settings to $build
        $build = [];
        foreach ($blocks as $key => $block) {
            if ($block->access('view')) {
                $block = Block::load($key);
                $block_content = \Drupal::entityTypeManager()
                    ->getViewBuilder('block')
                    ->view($block);
                $build[$key] = $block_content;
            }
        }

        $variables['region'][$region] = $build;
    }
}