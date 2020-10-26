"use strict";

(function ($) {
  $(document).ready(function () {
    $("form.geodir-listing-search").each(function (i) {
      var stype = $(this).find("input[name='stype']").val(); // add class to its form for easier styling and targeting

      $(this).closest("form").addClass(stype); // custom placeholder 

      $(".gd-search-field-search input").attr("placeholder", "Search By Name");
      $(".gd-search-field-near input").attr("placeholder", "e.g. Irvine, CA or 92606"); // default to LO search by geo

      if (stype == 'gd_loan_officer') {
        $('form.gd_loan_officer .gd-search-field-search, .searchBy-lo-name').hide();
      }
    });
    $(".chm-search").on('click', '.chm-toggle-lo-search', function (event) {
      event.preventDefault();
      var nearToggle = $('.searchBy-lo-near, form.gd_loan_officer .gd-search-field-near'),
          nameToggle = $('.searchBy-lo-name, form.gd_loan_officer .gd-search-field-search');

      if (this.id == 'search-toggle-lo-name') {
        nearToggle.hide();
        nearToggle.children("input").val("");
        nameToggle.show();
      } else {
        nearToggle.show();
        nameToggle.hide();
        nameToggle.children("input").val("");
      }
    });
    $("input.snear").focusout(function () {
      $(this).next(".gdlm-location-suggestions").hide();
    }); // IF Loan Officer Detail page

    if ($("body").hasClass("single-gd_loan_officer")) {
      // Make WPGeoDirectory social icons clickable
      $(".lo-single-socials .geodir_post_meta").each(function (i) {
        var icon = $(this).children('.geodir_post_meta_icon'),
            link = $(this).children('a');
        $(icon).prependTo(link);
      });
    } // IF Loan Officer Detail page


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