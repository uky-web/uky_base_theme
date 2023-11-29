'use strict';

/*
 * Image gallery has dependencies on jquery, slick, accessible-modal-window
 */

var fitCaption = function fitCaption($c) {
  var $image = $c.find('img');
  var $caption = $c.find('figcaption');
  var w = $image.width();
  if (w == 0) {
    return;
  }
  var h = $image.height();
  var r = w / h;
  var captionWidth = w < 300 ? '70vw' : w;

  $caption.css({
    maxWidth: captionWidth
  });

  if (r <= 1) {
    $c.addClass('mfp-portrait');
    $c.removeClass('mfp-landscape');
  } else {
    $c.addClass('mfp-landscape');
    $c.removeClass('mfp-portrait');
  }
};

var image_gallery = function image_gallery() {
  var $gallery = $('.image-gallery');
  if ($gallery.length < 1) return;

  // Fire up the masonry layout
  var $grid = $gallery.masonry({
    columnWidth: '.image-gallery__block-sizer',
    itemSelector: '.image-gallery__block'
  });

  // Reflow content in the layout as each image is loaded
  $grid.imagesLoaded().progress(function () {
    $grid.masonry('layout');
  });

  var $modals = $gallery.magnificPopup({
    delegate: '.image-gallery__popup-launcher',
    type: 'image',
    mainClass: 'mfp-fade',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true
    },
    navigateByImgClick: true,
    preload: [0, 1],
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      verticalFit: false,
      titleSrc: function titleSrc(item) {
        return $(item.el).find('figcaption').html();
      }
    }
  });

  $modals.on('mfpResize mfpImageLoadComplete mfpChange mfpOpen', function (e) {
    if ($.magnificPopup.instance) {
      fitCaption($.magnificPopup.instance.content);
    }
  });
};
//# sourceMappingURL=image-gallery.js.map
