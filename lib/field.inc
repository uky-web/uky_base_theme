<?php

function ukd8_preprocess_field(array &$variables) {
  // mark editoral paragraphs for later preprocessing
  if (($variables['element']['#bundle'] == 'page') && ($variables['field_name'] == 'field_paragraphs')) {
    foreach ($variables['items'] as $i => $item) {
      $variables['items'][$i]['content']['#editorial_column'] = TRUE;
    }
  }
}