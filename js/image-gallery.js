"use strict";

/*
 * Image gallery has dependencies on jquery, slick, accessible-modal-window
 */

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
    items.push({
      src: src,
      type: type,
      title: $this.find("figcaption").html(),
    });
  });

  console.log(items);
  var $modals = $gallery.magnificPopup({
    items: items,
    mainClass: "mfp-fade",
    tLoading: "Loading #%curr%...",
    gallery: {
      enabled: true,
    },
    navigateByImgClick: true,
    preload: [0, 1],
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      verticalFit: false,
      titleSrc: function titleSrc(item) {
        return item.title;
      },
    },
    iframe: {
      tError: '<a href="%url%">The iframe #%curr%</a> could not be loaded.',
      patterns: {
        youtube: {
          index: "youtube.com/", // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

          id: null, // String that splits URL in a two parts, second part should be %id%
          // Or null - full URL will be returned
          // Or a function that should return %id%, for example:
          // id: function(url) { return 'parsed id'; }

          src: "%id%", // URL that will be set as a source for iframe.
        },
        // vimeo: {
        //   index: 'vimeo.com/',
        //   id: '/',
        //   src: '//player.vimeo.com/video/%id%?autoplay=1'
        // },
        // gmaps: {
        //   index: '//maps.google.',
        //   src: '%id%&output=embed'
        // }
      },
    },
  });

  $modals.on("mfpResize mfpImageLoadComplete mfpChange mfpOpen", function (e) {
    if ($.magnificPopup.instance) {
      fitCaption($.magnificPopup.instance.content);
    }
  });
};
