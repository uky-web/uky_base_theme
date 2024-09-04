"use strict";

/*
 * Image gallery has dependencies on jquery, slick, accessible-modal-window
 */

// Function to adjust caption size and layout
var fitCaption = function fitCaption($c) {
  var $image = $c.find("img");
  var $caption = $c.find("figcaption");
  var w = $image.width();
  if (w == 0) {
    return;
  }
  var h = $image.height();
  var r = w / h;
  var captionWidth = w < 300 ? "70vw" : w;

  $caption.css({
    maxWidth: captionWidth,
  });

  if (r <= 1) {
    $c.addClass("mfp-portrait");
    $c.removeClass("mfp-landscape");
  } else {
    $c.addClass("mfp-landscape");
    $c.removeClass("mfp-portrait");
  }
};

// Main function to initialize the image gallery
var image_gallery = function image_gallery() {
  var $gallery = $(".image-gallery");
  if ($gallery.length < 1) return;

  // Fire up the masonry layout
  var $grid = $gallery.masonry({
    columnWidth: ".image-gallery__block-sizer",
    itemSelector: ".image-gallery__block",
  });

  // Reflow content in the layout as each image is loaded
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });

  var items = [];
  $gallery.find(".image-gallery__popup-launcher").each(function () {
    var $this = $(this);
    var $iframe = $this.find("iframe");

    var type = $iframe.length ? "iframe" : "image";
    var src = type === "iframe" ? $iframe.attr("src") : $this.attr("href");

    var $captionElement = $this.find("figcaption");

    // Strip out HTML comments and retain only necessary HTML content
    var title = $captionElement.length > 0 ? $captionElement.html().replace(/<!--[\s\S]*?-->/g, '').trim() : '';

    items.push({
      src: src,
      type: type,
      title: title || '', // Default to an empty string if title is not found
    });
  });

  // Initialize Magnific Popup
  $gallery.magnificPopup({
    delegate: '.image-gallery__popup-launcher', // Ensure correct event delegation
    type: 'image',
    gallery: {
      enabled: true,
    },
    navigateByImgClick: true,
    preload: [0, 1],
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      verticalFit: false,
      titleSrc: function titleSrc(item) {
        return item.title || ''; // Ensure the title is returned, even if empty
      },
    },
    callbacks: {
      beforeOpen: function() {
        // Calculate the index of the clicked element
        var index = $(this.st.el).index('.image-gallery__popup-launcher');
        
        // Dynamically set the items and the starting index for Magnific Popup
        this.items = items; // Set the items array
        this.index = index; // Set the index of the clicked element
      }
    },
    iframe: {
      tError: '<a href="%url%">The iframe #%curr%</a> could not be loaded.',
      patterns: {
        youtube: {
          index: "youtube.com/",
          id: null,
          src: "%id%",
        },
      },
    },
  });

  // Fit captions on various popup events
  $gallery.on("mfpResize mfpImageLoadComplete mfpChange mfpOpen", function (e) {
    if ($.magnificPopup.instance) {
      fitCaption($.magnificPopup.instance.content);
    }
  });
};

// Run the image gallery function when document is ready
$(document).ready(function () {
  image_gallery();
});
