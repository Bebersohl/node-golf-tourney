
//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

$(function(){
  console.log('test');
     $('.datepicker').datepicker();
     var navMain = $("#nav-main");

     navMain.on("click", "a", null, function () {
         navMain.collapse('hide');
     });
 });

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Photo Gallery JavaScript
$(function() {
    // Set blueimp gallery options.
    $.extend(blueimp.Gallery.prototype.options, {
        useBootstrapModal: false,
        hidePageScrollbars: false
    });

    // Engage gallery.
    $('.gallery');
});

//Change Icon On Mobile Menu
$('.navbar-collapse').on('shown.bs.collapse', function () {
   $(".navbar-toggle .fa").removeClass("fa-bars").addClass("fa-times");
});

$('.navbar-collapse').on('hidden.bs.collapse', function () {
   $(".navbar-toggle .fa").removeClass("fa-times").addClass("fa-bars");
});
