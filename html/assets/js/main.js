var options = {
    bg: '#9d2631',
    id: 'mynano'
};
var nanobar = new Nanobar(options);

var statapiurl = 'https://phobos.toxme.se/stats/weekly.json'; //default

(function($) {

    "use strict";

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $banner = $('#banner');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Header.
        if (skel.vars.IEVersion < 9)
            $header.removeClass('alt');

        if ($banner.length > 0 && $header.hasClass('alt')) {

            $window.on('resize', function() {
                $window.trigger('scroll');
            });

            $banner.scrollex({
                bottom: $header.outerHeight(),
                terminate: function() {
                    $header.removeClass('alt');
                },
                enter: function() {
                    $header.addClass('alt');
                },
                leave: function() {
                    $header.removeClass('alt');
                }
            });

        }

        // Menu.
        var $menu = $('#menu');

        $menu._locked = false;

        $menu._lock = function() {

            if ($menu._locked)
                return false;

            $menu._locked = true;

            window.setTimeout(function() {
                $menu._locked = false;
            }, 350);

            return true;

        };

        $menu._show = function() {

            if ($menu._lock())
                $body.addClass('is-menu-visible');

        };

        $menu._hide = function() {

            if ($menu._lock())
                $body.removeClass('is-menu-visible');

        };

        $menu._toggle = function() {

            if ($menu._lock())
                $body.toggleClass('is-menu-visible');

        };

        $menu
            .appendTo($body)
            .on('click', function(event) {

                event.stopPropagation();

                // Hide.
                $menu._hide();

            })
            .find('.inner')
            .on('click', '.close', function(event) {

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                // Hide.
                $menu._hide();

            })
            .on('click', function(event) {
                event.stopPropagation();
            })
            .on('click', 'a', function(event) {

                var href = $(this).attr('href');

                event.preventDefault();
                event.stopPropagation();

                // Hide.
                $menu._hide();

                // Redirect.
                window.setTimeout(function() {
                    window.location.href = href;
                }, 350);

            });

        $body
            .on('click', 'a[href="#menu"]', function(event) {

                event.stopPropagation();
                event.preventDefault();

                // Toggle.
                $menu._toggle();

            })
            .on('keydown', function(event) {

                // Hide on escape.
                if (event.keyCode == 27)
                    $menu._hide();

            });

    });

})(jQuery);

window.onhashchange = newpage;
if (location.hash != '') {
    newpage();
}
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

function newpage() {
    nanobar.go(100)
    $("html, body").animate({ scrollTop: 0 }, "fast");
    alert(window.location.origin);
    if (location.hash == '') {
        $('#page-wrapper').load(window.location.origin + "index.html #page-wrapper");
    } else if (location.hash == '#') {
        $('#page-wrapper').load(window.location.origin + "index.html #page-wrapper");
    } else {
        $('#page-wrapper').load(location.hash.slice(1) + ".html #page-wrapper");
        if (location.hash.slice(1) == 'stats') {
          setvar();
        }
    }
};

function sethour() {
  $("#opt-week, #opt-month").removeClass("special");
  $("#opt-hour").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/hourly.json';
  setvar();
}

function setweek() {
  $("#opt-hour, #opt-month").removeClass("special");
  $("#opt-week").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/weekly.json';
  setvar();
}

function setmonth() {
  $("#opt-hour, #opt-week").removeClass("special");
  $("#opt-month").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/monthly.json';
  setvar();
}

function setvar() {

  $.getJSON(statapiurl, function(data) {
    $("#req_cur").text(data.request.current.ps + ' Req/s')
    $("#req_avg").text(data.request.a0.ps + ' Req/s')

    $("#uniq_cur").text(data.unique.current.ps + ' Req/s')
    $("#uniq_avg").text(data.unique.a0.ps + ' Req/s')

    $("#bps_cur").text(data.bandwidth.current.kbps + ' KB/s')
    $("#bps_avg").text(data.bandwidth.a0.kbps + ' KB/s')

    var req_stats = {
      labels: [data.request.a0.date, data.request.a1.date, data.request.a2.date, data.request.a3.date, data.request.a4.date, data.request.a5.date, data.request.a6.date],
      datasets: [
          {
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: [data.request.a0.count, data.request.a1.count, data.request.a2.count, data.request.a3.count, data.request.a4.count, data.request.a5.count, data.request.a6.count]
          }
      ]
    };

    var unique_stats = {
      labels: [data.request.a0.date, data.request.a1.date, data.request.a2.date, data.request.a3.date, data.request.a4.date, data.request.a5.date, data.request.a6.date],
      datasets: [
          {
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: [data.unique.a0.count, data.unique.a1.count, data.unique.a2.count, data.unique.a3.count, data.unique.a4.count, data.unique.a5.count, data.unique.a6.count]
          }
      ]
    };

    var bandwidth_stats = {
      labels: [data.request.a0.date, data.request.a1.date, data.request.a2.date, data.request.a3.date, data.request.a4.date, data.request.a5.date, data.request.a6.date],
      datasets: [
          {
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: [data.bandwidth.a0.mb, data.bandwidth.a1.mb, data.bandwidth.a2.mb, data.bandwidth.a3.mb, data.bandwidth.a4.mb, data.bandwidth.a5.mb, data.bandwidth.a6.mb]
          }
      ]
    };

    var ct_req = $("#req_graph").get(0).getContext("2d");
     //This will get the first returned node in the jQuery collection.
    var requests = new Chart(ct_req).Line(req_stats, {
      bezierCurveTension : 0.2
    });

    var ct_uniq = $("#unique_graph").get(0).getContext("2d");
     //This will get the first returned node in the jQuery collection.
    var requests = new Chart(ct_uniq).Line(unique_stats, {
      bezierCurveTension : 0.2
    });

    var ct_bt = $("#bandwidth_graph").get(0).getContext("2d");
     //This will get the first returned node in the jQuery collection.
    var bandwidth = new Chart(ct_bt).Line(bandwidth_stats, {
      bezierCurveTension : 0.2
    });

   }, 'text');

}

function loadgh() {
  var ghurl = new RegExp("https:\/\/raw.githubusercontent.com\/[a-zA-Z]+\/[a-zA-Z]+");
  var ghlazy = new RegExp("https:\/\/github.com\/.+\/.+\/blob\/[a-zA-Z]+\/");
  var url = document.forms["redirect"]["url"].value;
  var modeurl = $("#mode-url").prop('checked');
  var newtab = $("#newtab").prop('checked');

  if (ghlazy.test(url)) {
    //https://github.com/ToxMe/raw-github/blob/master/html/index.html
    //https://raw.githubusercontent.com/ToxMe/raw-github/master/html/index.html
    var repo = url.split("https://github.com")[1].split("/blob")[0];
    var file = url.split(repo + "/blob")[1];
    url = "https://raw.githubusercontent.com" + repo + file;
  }

  if (ghurl.test(url)) {
    var ghproxy = "https://raw-github.toxme.se" + url.split("raw.githubusercontent.com")[1];
    if (modeurl == true) {
      $("#url").val(ghproxy);
      $("#url").select();
      if (newtab == true && document.queryCommandSupported("copy") == true) {
        document.execCommand('copy');
        $("#copymsg").html("New URL copied to clipboard");
      } else {
        $("#copymsg").html("New URL selected, please copy it"); //todo: not this
      }
      open_copy_show();
    } else {
      if (newtab == true) {
        window.open(ghproxy, '_blank');
      } else {
          window.location = ghproxy;
      }
    }
  } else {
    $("#url").blur();
    open_error_show();
  }
}

function open_copy_hide() {
  $("#copymsg").fadeOut();
}

function open_copy_show() { //being lazy
        $("#copymsg").fadeIn();
        setTimeout(open_copy_hide, 2000);
}

function newtab_hide() {
  if (document.queryCommandSupported("copy") == true) {
    $("#newtab-text").html("Copy URL");
  } else {
    $("#newtab").fadeOut();
    $("#newtab-text").fadeOut();
  }
}

function newtab_show() {
  $("#newtab").fadeIn();
  $("#newtab-text").fadeIn();
  $("#newtab-text").html("Open in new tab");
}

function open_error_hide() {
  $("#errmsg").fadeOut();
}

function open_error_show() { //being lazy
        $("#errmsg").fadeIn();
        setTimeout(open_error_hide, 2000);
}

$(window).load(function(){
  setvar();
});
