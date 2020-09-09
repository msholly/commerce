"use strict";

(function ($) {

    // Make WPGeoDirectory social icons clickable
    if ($("body").hasClass("single-gd_loan_officer")) {

        $(".lo-single-socials .geodir_post_meta").each(function (i) {
            var icon = $(this).children('.geodir_post_meta_icon'),
                link = $(this).children('a');
    
            $(icon).prependTo(link);
        });
        
    }

})(jQuery);
