"use strict";

(function ($) {

	$(document).ready(function () {

		$("form.geodir-listing-search").each(function (i) {
			// If CPT Select is not active, look for stype in an input
			var stype = $(this).find("input[name='stype']").val();

			if (typeof stype == 'undefined') {
				// If CPT Select is active (like on /search page), look for stype in select 
				stype = $(this).find("select[name='stype']").val();
			}

			// Remove Philanthopies, Team Members, Licenses from CPT Select
			removeGdCpt();

			// add class to its form for easier styling and targeting
			$('.geodir-search-container').addClass("stype-" + stype)

			// custom placeholder 
			$(".gd-search-field-search input").attr("placeholder", "Search By Name");
			$(".gd-search-field-near input").attr("placeholder", "Search by City, State, or Zip");

			// default to LO search by geo
			if (stype == 'gd_loan_officer' && !$("body").hasClass("geodir-page-search")) {
				$('.stype-gd_loan_officer .gd-search-field-search, .searchBy-lo-name').hide();
			}
		});



		// Toggle LO search visibility
		$(".chm-search").on('click', '.chm-toggle-lo-search', function (event) {
			event.preventDefault();
			var nearToggle = $('.searchBy-lo-near, .stype-gd_loan_officer .gd-search-field-near'),
				nameToggle = $('.searchBy-lo-name, .stype-gd_loan_officer .gd-search-field-search')

			if (this.id == 'search-toggle-lo-name') {
				nearToggle.hide();
				// Mimcis Geodir's native clear input fields
				$(".gd-icon-hover-swap").click();
				nameToggle.show();
			} else {
				nearToggle.show();
				nameToggle.hide();
				// Mimcis Geodir's native clear input fields
				$(".gd-icon-hover-swap").click();
			}
		});

		// Always removes GD Suggestions on focus out
		// Temp disable, pending ticket with vendor. This function currently prevents auto-fill of location input (bug)
		// $("input.snear").focusout(function () {
		// 	$(this).next(".gdlm-location-suggestions").hide();
		// });

		// page-id-3621 is /about/branches/ 
		// Anchor link scrolls to state listings
		if ($("body").hasClass("page-id-3621")) {
			$(".geodir-listings .widgettitle").each(function (i) {
				var heading = $(this);
				var headingtext = heading.text().toLowerCase().trim().replace(/[\.,-\/#!?$%\^&\*;:{}=\-_`~()]/g, "").replace(' ', '-');
				heading.attr("id", headingtext);
			});

			$("#select2-ajax-branch").on("select2:select", function (e) {
				scrollToAnchor("#" + e.params.data.id);
				// Add hash for shareable URL that auto-scrolls to state
				window.location.hash = e.params.data.id;
			});

			// Get Branches
			chmGetStates();

			if (window.location.hash) {
				// Support shareable URL for specific State (scrollTo)
				scrollToAnchor(window.location.hash);
			}
		}

		// IF Loan Officer Detail page
		if ($("body").hasClass("single-gd_loan_officer")) {

			// Make WPGeoDirectory social icons clickable
			$(".lo-single-socials .geodir_post_meta").each(function (i) {
				var icon = $(this).children('.geodir_post_meta_icon'),
					link = $(this).children('a');

				$(icon).prependTo(link);
			});

		}

		// IF Branch Detail page
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

		if (typeof Handlebars !== 'undefined') {
			// MAP SVG Handlebar template to show states in Alpha order
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


	$('.geodir-search-container').on('change', 'select', function () {
		removeGdCpt();
		// On /search page, watch CPT Select and update wrapper with current active search type
		var stype = $(".search_by_post option:selected").val();
		$('.geodir-search-container').removeClass(function (index, className) {
			// Remove previously active stype
			return (className.match(/\bstype-\S+/g) || []).join(' ');
		});
		$('.geodir-search-container').addClass("stype-" + stype)
	});

	$(document).ajaxComplete(function () {
		removeGdCpt();
	});

	function removeGdCpt() {
		$("form.geodir-listing-search .search_by_post option[value='gd_lo_team']").remove();
		$("form.geodir-listing-search .search_by_post option[value='gd_philanthropy']").remove();
		$("form.geodir-listing-search .search_by_post option[value='gd_license']").remove();
	}

	function formatState(state) {
		if (!state.id) {
			return state.text;
		}
		var state1 = state.title;
		return state1;
	};

	function selection(state) {
		if (state.id === '') { // adjust for custom placeholder values
			return 'Search by State';
		}
		return state.title;
	}

	function makeSelect2(data) {
		// Local search needs non-ajax select2 instance
		$('#select2-ajax-branch').select2({
			data: data,
			templateSelection: selection,
			templateResult: formatState,
			escapeMarkup: function (state) {
				return state;
			},
			placeholder: 'Search by State'
		});
	}

	function scrollToAnchor(hash) {
		var target = $(hash),
			headerHeight = $('#main-header').outerHeight() + 20; // Get fixed header height

		target = target.length ? target : $('[name=' + hash.slice(1) + ']');

		if (target.length) {
			$('html,body').animate({
				scrollTop: target.offset().top - headerHeight
			}, 100);
			return false;
		}
	}

	function chmGetStates() {
		$.ajax({
			type: "GET",
			dataType: "json",
			async: true,
			url: "https://chmretaildev.wpengine.com/wp-json/geodir/v2/locations/regions",
			data: ({}),
			success: function (data) {
				var formatted = $.map(data, function (obj) {
					obj.id = obj.id || obj.slug; // unique ID needed for select2
					obj.text = obj.title // title needed for proper search
					return obj;
				});

				// Alpha sort
				var sorted = formatted.sort(function (a, b) {
					if (a.title < b.title) {
						return -1;
					}
					if (a.title > b.title) {
						return 1;
					}
					return 0;
				});
				makeSelect2(sorted);
			}
		});
	}

})(jQuery);
