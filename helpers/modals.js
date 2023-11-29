Drupal.behaviors.ukd8_modals = {
  attach: function (context, settings) {
    modals();

    // focus for the search popup
    jQuery('.modal-control.search-control').on('mfpOpen', function(e) {
      setTimeout(function() {
        jQuery.magnificPopup.instance.container.find('input').first().focus();
      }, 100);
    });
  }
};