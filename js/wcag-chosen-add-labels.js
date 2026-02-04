/**
 * @file
 * Provides an accessibility fix for input fields created by Chosen, that by default have no associated label.
 * Finds the label for the parent field that Chosen is taking over and applies it as an aria-label attribute, or
 * defaults to a simple "Search" label.
 */
(function ($, Drupal, once) {
  Drupal.behaviors.wcagChosenAddLabels = {
    attach: function (context, settings) {
      once('wcagChosenAddLabels', '.js-form-item.js-form-type-select', context).forEach(function (element) {
        let inputLabel = $.trim($(element).find('label').text());
        if (!inputLabel) {
          inputLabel = Drupal.t('Search');
        }
        $(element).find('input.chosen-search-input').attr('aria-label', inputLabel);
      });
    }
  };
})(jQuery, Drupal, once);
