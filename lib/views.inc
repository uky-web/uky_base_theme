<?php

/**
 * Implemements template_preprocess_views_view()
 */
function ukd8_preprocess_views_view(&$variables) {
    if (isset($variables['more'])) {
        $variables['more']['#options']['attributes']['class'][] = 'link--fancy';
    }
}

/**
 * Implemements template_form_views_exposed_form_alter()
 */
function ukd8_form_views_exposed_form_alter(&$form, &$form_state, $form_id) {
}