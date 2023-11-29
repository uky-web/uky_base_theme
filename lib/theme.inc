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




  //get field values from yml configuration file.
  $theme_settings =  \Drupal::config('ukd8.settings');
  $form['#validate'][] = '_ukd8_form_system_theme_settings_validate';
  $form['site_identity'] = [
    '#type' => 'fieldset',
    '#title' => t('Site Logo'),
    '#weight' => -1
  ];

  $form['site_identity']['logo_option'] = [
    '#type' => 'select',
    '#title' => t('Logo source'),
    '#options' => [
      'wordmark' => t('Use text fields'),
      'uky_logo' => t('Use the University lockup image'),
      'unit_logo' => t('Upload a logo'),
    ],
    '#description'   => t("Select the site identity to be displayed in the site header. This can be the university lockup, a different uploaded graphic, or a title generated from text entered below."),
    '#default_value' => theme_get_setting('logo_option'),
    '#weight' => -1,
    '#attributes' => [
      'id'=> 'field_logo_option'
    ]
  ];

  //Upload logo
  unset($form['logo']['default_logo']);
  $logoArrayObject = new ArrayObject($form['logo']);
  $form['site_identity']['logo_upload_fields'] = $logoArrayObject->getArrayCopy();
  unset($form['logo']);
  $form['site_identity']['logo_upload_fields']['#title'] = t('Upload a graphic file.');
  $form['site_identity']['logo_upload_fields']['#type'] = 'container';
  $form['site_identity']['logo_upload_fields']['#states'] = [
    'visible' => [
      ':input[id="field_logo_option"]' => ['value' => 'unit_logo'],
    ]
    ];

  //Text fields for site identity component
  $form['site_identity']['site_identity_fields'] = _ukd8_site_identity_fields();
  $form['site_identity']['site_identity_fields']['#states'] = [
    'visible' => [
      ':input[id="field_logo_option"]' => ['value' => 'wordmark'],
    ]
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



function _ukd8_site_identity_fields(){

  $site_identity_fields  = [
    '#type' => 'container',
    '#title' => t('Enter Site Identity as text'),
    '#description' => t("Add text, which will be used to create a site title. The site title can be one or two lines, and either line can be set as a smaller subhead. To abbreviate either line of the site name on mobile, check 'remove on mobile'. "),
  ];


  $site_identity_fields['lockup_wordmark_1_group'] = [
    '#type' => 'fieldset',
  ];

  $site_identity_fields['lockup_wordmark_1_group']['lockup_wordmark_1'] = [
    '#type'          => 'textfield',
    '#title'         => t('Site identity line 1'),
    '#default_value' => theme_get_setting('lockup_wordmark_1'),
    '#description'   => t("Text shown as the first line of the site identity in the header."),
  ];

  $site_identity_fields['lockup_wordmark_1_group']['lockup_wordmark_1_subhead'] = [
    '#type' => 'checkbox',
    '#title' => t('Subhead'),
    '#default_value' => theme_get_setting('lockup_wordmark_1_subhead'),
    '#description' => t('Display this line as a smaller subheading'),
  ];

  $site_identity_fields['lockup_wordmark_1_group']['lockup_wordmark_1_no_mobile'] = [
    '#type' => 'checkbox',
    '#title' => t('Remove on mobile'),
    '#default_value' => theme_get_setting('lockup_wordmark_1_no_mobile'),
    '#description' => t('Remove this line on mobile devices.'),
  ];

  $site_identity_fields['lockup_wordmark_2_group'] = [
    '#type' => 'fieldset',
  ];

  $site_identity_fields['lockup_wordmark_2_group']['lockup_wordmark_2'] = [
    '#type'          => 'textfield',
    '#title'         => t('Site identity line 2'),
    '#default_value' => theme_get_setting('lockup_wordmark_2'),
    '#description'   => t("Text shown as the second line of the site identity in the header."),
  ];

  $site_identity_fields['lockup_wordmark_2_group']['lockup_wordmark_2_subhead'] = [
    '#type' => 'checkbox',
    '#title' => t('Subhead'),
    '#default_value' => theme_get_setting('lockup_wordmark_2_subhead'),
    '#description' => t('Display this line as a smaller subheading'),
  ];

  $site_identity_fields['lockup_wordmark_2_group']['lockup_wordmark_2_no_mobile'] = [
    '#type' => 'checkbox',
    '#title' => t('Remove on mobile'),
    '#default_value' => theme_get_setting('lockup_wordmark_2_no_mobile'),
    '#description' => t('Remove this line on mobile devices.'),
  ];

  return $site_identity_fields;
}




function _ukd8_form_system_theme_settings_validate(&$form, \Drupal\Core\Form\FormStateInterface $form_state) {

   // Check for a new uploaded logo. FROM SYSTEM
   if (isset($form['site_identity']['logo_upload_fields'])) {
    $file = _file_save_upload_from_form($form['site_identity']['logo_upload_fields']['settings']['logo_upload'], $form_state, 0);
    if ($file) {
      // Put the temporary file in form_values so we can save it on submit.
      $form_state->setValue('logo_upload', $file);
    }
  }

  // When intending to use the default logo, unset the logo_path.
  if ($form_state->getValue('logo_option') != 'unit_logo') {
    $form_state->unsetValue('logo_path');
  }

  // If the user provided a path for a logo or favicon file, make sure a file
  // exists at that path.
  // if ($form_state->getValue('logo_path')) {
  //   $path = $this->validatePath($form_state->getValue('logo_path'));
  //   if (!$path) {
  //     $form_state->setErrorByName('logo_path', $this->t('The custom logo path is invalid.'));
  //   }
  // }

}