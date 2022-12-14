<?php

use Drupal\block\Entity\Block;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Form\FormStateInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Url;
use Drupal\Core\Cache\CacheableMetadata;

function ukd8_form_system_theme_settings_alter(&$form, FormStateInterface &$form_state, $form_id = NULL) {
  // Work-around for a core bug affecting admin themes. See issue #943212.
  if (isset($form_id)) {
    return;
  }

  $form['is_main'] = ['#type' => 'checkbox',
    '#title' => t('Is the main uky.edu site'),
    '#default_value' => theme_get_setting('is_main'),
  ];

  $form['lockup_wordmark_1'] = [
    '#type'          => 'textfield',
    '#title'         => t('Lockup wordmark line 1'),
    '#default_value' => theme_get_setting('lockup_wordmark_1'),
    '#description'   => t("Text shown as the first line of the wordmark in the header."),
  ];
  $form['lockup_wordmark_2'] = [
    '#type'          => 'textfield',
    '#title'         => t('Lockup wordmark line 2'),
    '#default_value' => theme_get_setting('lockup_wordmark_2'),
  ];

  $form['college_url'] = [
    '#type'          => 'textfield',
    '#title'         => t('Parent unit URL'),
    '#default_value' => theme_get_setting('college_url'),
    '#description'   => t("URL for this site's parent unit (e.g., college), if applicable."),
  ];
  $form['college_title'] = [
    '#type'          => 'textfield',
    '#title'         => t('Parent unit title'),
    '#default_value' => theme_get_setting('college_title'),
    '#description'   => t("Link display name for this site's parent unit."),
  ];

  $form['show_college_under_lockup'] = [
    '#type'          => 'checkbox',
    '#title'         => t('Show parent unit under lockup'),
    '#default_value' => theme_get_setting('show_college_under_lockup'),
    '#description'   => t("Parent unit is shown in the universal header. Check if the name should also appear below the lockup."),
  ];
  
  $theme_settings =  \Drupal::config('ukd8.settings');

  $form['ukd8_settings']['color_schemes'] = [
    '#title' => t('Theme color settings'),
    '#type' => 'fieldset',
    '#description' => t('Set base theme styles for components. Editors with appropriate permissions may override these on individual components.'),
  ];

  $scheme_opts = $theme_settings->get('scheme_options');

  foreach ($theme_settings->get('scheme_settings') as $k => $v) {
    $form['ukd8_settings']['color_schemes'][$k] = [
      '#type' => 'select',
      '#title' => $v['name'],
      '#default_value' => $v['value'],
      '#options' => $scheme_opts,
    ];
    foreach ($v['disallowed'] as $d) {
      unset($form['ukd8_settings']['color_schemes'][$k]['#options'][$d]);
    }
  }

  $form['ukd8_settings']['layout'] = [
    '#title' => t('Layout settings'),
    '#type' => 'fieldset',
  ];

  foreach ($theme_settings->get('layout_boolean_settings') as $k => $v) {
    $form['ukd8_settings']['layout'][$k] = [
      '#type' => 'checkbox',
      '#title' => $v['name'],
      '#default_value' => $v['value'],
    ];
  }
}

function _ukd8_add_theme_settings(array &$variables) {
  $theme = \Drupal::theme()->getActiveTheme()->getName();
  $theme_settings = \Drupal::config($theme . '.settings');
  // Add cachability metadata.
  CacheableMetadata::createFromRenderArray($variables)
    ->addCacheableDependency($theme_settings)
    ->applyTo($variables);
  // Add theme setting variables to the twig template variables.
  $variables['theme_settings'] = $theme_settings->getOriginal();
}
