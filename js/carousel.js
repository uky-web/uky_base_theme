'use strict';

var carousel_single = {
  cssEase: 'ease-in-out',
  dots: true,
  lazyLoad: 'progressive'
};

var carousel_center = {
  cssEase: 'ease-in-out',
  lazyLoad: 'progressive',
  centerMode: true,
  dots: true,
  centerPadding: '110px',
  sidesToShow: 3,
  arrows: true,
  responsive: [{
    breakpoint: 768,
    settings: {
      centerMode: false,
      slidesToShow: 1
    }
  }, {
    breakpoint: 480,
    settings: {
      centerMode: false,
      slidesToShow: 1
    }
  }]
};

var carousel = function carousel() {
  var $carousels = $('.carousel');
  var config = carousel_single; // default configuration
  if ($carousels.length < 1) return;

  var positionArrowsSingle = function positionArrowsSingle(slick) {
    var $currentSlide = $(slick.$slides[slick.currentSlide]);
    var $currentImage = $currentSlide.find('img');
    var imgHeight = $currentImage.height();
    var buttonTop = imgHeight / 2;
    var buttons = slick.$nextArrow.add(slick.$prevArrow);
    buttons.css({
      top: buttonTop
    });
  };

  var positionArrowsCentered = function positionArrowsCentered(slick) {
    console.log("PosArrowCenter");
    var $currentSlide = $(slick.$slides[slick.currentSlide]);
    var $currentImage = $currentSlide.find('img');
    var $currentTrack = slick.$slideTrack;
    var imgHeight = $currentImage.height();
    var containerHeight = imgHeight * 1.105; // magic number matches the scale factor from the scss

    if (imgHeight > 0) {
      var padding = (containerHeight - imgHeight) / 2;
      var buttonTop = containerHeight * .5;
      var buttons = slick.$nextArrow.add(slick.$prevArrow);
      buttons.css({
        top: buttonTop
      });
      $currentTrack.css({
        paddingTop: padding
      });
    }
  };

  $carousels.on('init setPosition afterChange', function (e, slick) {
    var cl = e.currentTarget.classList;
    if (cl.contains('carousel--single')) {
      positionArrowsSingle(slick);
    } else if (cl.contains('carousel--center')) {
      positionArrowsCentered(slick);
    }
  });

  $carousels.map(function (index, elem) {
    if (elem.classList.contains('carousel--center')) {
      config = carousel_center;
    } else {
      config = carousel_single;
    }
    $(elem).slick(config);
  });
};
//# sourceMappingURL=carousel.js.map
