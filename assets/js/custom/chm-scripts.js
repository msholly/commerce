"use strict";

(function ($) {

	$(document).ready(function () {

		// IF Loan Officer Detail page
		if ($("body").hasClass("single-gd_loan_officer")) {

			// Make WPGeoDirectory social icons clickable
			$(".lo-single-socials .geodir_post_meta").each(function (i) {
				var icon = $(this).children('.geodir_post_meta_icon'),
					link = $(this).children('a');

				$(icon).prependTo(link);
			});

		}

		// IF Loan Officer Detail page
		if ($("body").hasClass("single-gd_place")) {

			// Hides a Regional Manager's profile in Our Team if they exist in both Regional Manager and Our Team sections
			var ourTeamLOs = $(".branch-lo-our-team li.type-gd_loan_officer"),
				regionalMg = $('.branch-regional-manager li');
			var teamArray = [];

			if (regionalMg.length > 0) {
				var rmPostID = parseInt(regionalMg.data("postId"));
				$(ourTeamLOs).each(function (i) {
					var rteamPostID = $(this).data('postId');
					teamArray.push(rteamPostID);
				});

				var rmLOindex = $.inArray(rmPostID, teamArray);
				if (rmLOindex > -1) {
					$(".branch-lo-our-team li.post-" + teamArray[rmLOindex]).hide();
				}
			}

		}

        if (typeof Handlebars !== 'undefined' ) {
            Handlebars.registerHelper('each_with_sort', function (array, key, opts) {
                var data, e, i, j, len, s;
                if (opts.data) {
                    data = Handlebars.createFrame(opts.data);
                }
                array = array.sort(function (a, b) {
                    a = a[key];
                    b = b[key];
                    if (a > b) {
                        return 1;
                    }
                    if (a === b) {
                        return 0;
                    }
                    if (a < b) {
                        return -1;
                    }
                });
                s = '';
                for (i = j = 0, len = array.length; j < len; i = ++j) {
                    e = array[i];
                    if (data) {
                        data.index = i;
                    }
                    s += opts.fn(e, {
                        data: data
                    });
                }
                return s;
            });
        }
		
	});





})(jQuery);
