<?php 
/** 
 * Update site identity-related theme settings.
 */
// function ukd8_post_update_9001(&$sandbox = NULL) {
//     // Load the configuration for the active configuration.
//     $config_factory = \Drupal::configFactory();
//     $theme_settings = $config_factory->getEditable('ukd8.settings');
  
//     // Get the value of the is_main field from the active configuration.
//     $is_main_value = $theme_settings->get('is_main');
  
//     // Check if is_main field is set.
//     if ($is_main_value === '0') {
//         // Set the value of the logo_option field to a use the uky_logo.
//         $theme_settings->set('logo_option', 'uky_logo');

//         // Delete is_main field setting from the active configuration.
//         $theme_settings->clear('is_main');

//         // Delete is_main field from configuration
//         $theme_settings->delete('is_main');

//         // Save the changes to the active configuration.
//         $theme_settings->save();

//     }
//     else{
//         // Delete is_main field from the active configuration.
//         $theme_settings->clear('is_main');

//         // Delete is_main field from configuration
//         $theme_settings->delete('is_main');

//         // Save the changes to the active configuration.
//         $theme_settings->save();
        
//     }

//     // Delete show_college_under_lockup from configuration
//     $theme_settings->delete('show_college_under_lockup');

//     // Save the changes to the active configuration.
//     $theme_settings->save();
    
//   }