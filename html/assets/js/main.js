var options = {
    bg: '#9d2631',
    id: 'mynano'
};
var nanobar = new Nanobar(options);

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
    if (location.hash == '') {
        $('#page-wrapper').load("index.html #page-wrapper");
    } else {
        $('#page-wrapper').load(location.hash.slice(1) + ".html #page-wrapper");
        if (location.hash.slice(1) == 'stats') {
          setvar();
        }
    }
};

function setvar() {
$.get('https://raw-github.toxme.se/stats/req-current', function(data) {
 $("#req_cur").text(data)
}, 'text');
$.get('https://raw-github.toxme.se/stats/req-average', function(data) {
 $("#req_avg").text(data)
}, 'text');
$.get('https://raw-github.toxme.se/stats/bps-current', function(data) {
 $("#bps_cur").text(data)
}, 'text');
$.get('https://raw-github.toxme.se/stats/bps-average', function(data) {
 $("#bps_avg").text(data)
}, 'text');
}

function loadgh() {
  var ghurl = new RegExp("https:\/\/raw.githubusercontent.com\/[a-zA-Z]+\/[a-zA-Z]+");
  var ghlazy = new RegExp("https:\/\/github.com\/.+\/.+\/blob\/[a-zA-Z]+\/");
  var url = document.forms["redirect"]["url"].value;
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
    if (newtab == true) {
      window.open(ghproxy);
    } else {
      window.location = ghproxy;
    }
  } else {
    $("#url").blur()
    $.snackbar({content: "Please enter a valid github raw file URL"});
  }
}
