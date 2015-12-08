var options = {
    bg: '#9d2631',
    id: 'mynano'
};
var nanobar = new Nanobar(options);
var ver = '';

var statapiurl = 'https://phobos.toxme.se/stats/weekly.json'; //default
var stattype = 1; // 0 is month, 1 is week, 2 is hour

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

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

function newpage() {
    var hash = location.hash.replace('#!/','');
    nanobar.go(100);
    $("html, body").animate({ scrollTop: 0 }, "fast");
    if (hash == '') { //"https://" + document.domain +
        pageload('home');
    } else if (hash == '#') {
        pageload('home');
    } else {
        pageload(hash);
    }

    $("#ver").text(ver);
};

function pageload(url) {
  if (document.domain != "") {
    url = "//" + document.domain + '/' + url
  }
  $('#page-wrapper').load(url + ".html #page-wrapper", function(response, status, xhr) {
    if ( status == "error" ) {
      $('#page-wrapper').load("//" + document.domain + "fail.html #page-wrapper");
    } else {
      eval($("#js").text());
    }
  })
};

function sethour() {
  $("#opt-week, #opt-month").removeClass("special");
  $("#opt-hour").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/hourly.json';
  stattype = 2;
  setvar();
}

function setweek() {
  $("#opt-hour, #opt-month").removeClass("special");
  $("#opt-week").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/weekly.json';
  stattype = 1;
  setvar();
}

function setmonth() {
  $("#opt-hour, #opt-week").removeClass("special");
  $("#opt-month").addClass("special");
  statapiurl = 'https://phobos.toxme.se/stats/monthly.json';
  stattype = 0;
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

    if (stattype == 0) { //month
      var req_stats = {
        labels: [data.request.a0.date, data.request.a1.date, data.request.a2.date, data.request.a3.date, data.request.a4.date, data.request.a5.date, data.request.a6.date, data.request.a7.date, data.request.a8.date, data.request.a9.date, data.request.a10.date, data.request.a11.date, data.request.a12.date, data.request.a13.date, data.request.a14.date, data.request.a15.date, data.request.a16.date, data.request.a17.date, data.request.a18.date, data.request.a19.date, data.request.a20.date, data.request.a21.date, data.request.a22.date, data.request.a23.date, data.request.a24.date, data.request.a25.date, data.request.a26.date, data.request.a27.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.request.a0.count, data.request.a1.count, data.request.a2.count, data.request.a3.count, data.request.a4.count, data.request.a5.count, data.request.a6.count, data.request.a7.count, data.request.a8.count, data.request.a9.count, data.request.a10.count, data.request.a11.count, data.request.a12.count, data.request.a13.count, data.request.a14.count, data.request.a15.count, data.request.a16.count, data.request.a17.count, data.request.a18.count, data.request.a19.count, data.request.a20.count, data.request.a21.count, data.request.a22.count, data.request.a23.count, data.request.a24.count, data.request.a25.count, data.request.a26.count, data.request.a27.count]
            }
        ]
      };
    } else if (stattype == 1) { //week
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
    } else if (stattype == 2) { //hour
      var req_stats = {
        labels: [data.request.a0.date, data.request.a1.date, data.request.a2.date, data.request.a3.date, data.request.a4.date, data.request.a5.date, data.request.a6.date, data.request.a7.date, data.request.a8.date, data.request.a9.date, data.request.a10.date, data.request.a11.date, data.request.a12.date, data.request.a13.date, data.request.a14.date, data.request.a15.date, data.request.a16.date, data.request.a17.date, data.request.a18.date, data.request.a19.date, data.request.a20.date, data.request.a21.date, data.request.a22.date, data.request.a23.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.request.a0.count, data.request.a1.count, data.request.a2.count, data.request.a3.count, data.request.a4.count, data.request.a5.count, data.request.a6.count, data.request.a7.count, data.request.a8.count, data.request.a9.count, data.request.a10.count, data.request.a11.count, data.request.a12.count, data.request.a13.count, data.request.a14.count, data.request.a15.count, data.request.a16.count, data.request.a17.count, data.request.a18.count, data.request.a19.count, data.request.a20.count, data.request.a21.count, data.request.a22.count, data.request.a23.count]
            }
        ]
      };
    }

    if (stattype == 0) { //month
      var unique_stats = {
        labels: [data.unique.a0.date, data.unique.a1.date, data.unique.a2.date, data.unique.a3.date, data.unique.a4.date, data.unique.a5.date, data.unique.a6.date, data.unique.a7.date, data.unique.a8.date, data.unique.a9.date, data.unique.a10.date, data.unique.a11.date, data.unique.a12.date, data.unique.a13.date, data.unique.a14.date, data.unique.a15.date, data.unique.a16.date, data.unique.a17.date, data.unique.a18.date, data.unique.a19.date, data.unique.a20.date, data.unique.a21.date, data.unique.a22.date, data.unique.a23.date, data.unique.a24.date, data.unique.a25.date, data.unique.a26.date, data.unique.a27.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.unique.a0.count, data.unique.a1.count, data.unique.a2.count, data.unique.a3.count, data.unique.a4.count, data.unique.a5.count, data.unique.a6.count, data.unique.a7.count, data.unique.a8.count, data.unique.a9.count, data.unique.a10.count, data.unique.a11.count, data.unique.a12.count, data.unique.a13.count, data.unique.a14.count, data.unique.a15.count, data.unique.a16.count, data.unique.a17.count, data.unique.a18.count, data.unique.a19.count, data.unique.a20.count, data.unique.a21.count, data.unique.a22.count, data.unique.a23.count, data.unique.a24.count, data.unique.a25.count, data.unique.a26.count, data.unique.a27.count]
            }
        ]
      };
    } else if (stattype == 1) { //week
      var unique_stats = {
        labels: [data.unique.a0.date, data.unique.a1.date, data.unique.a2.date, data.unique.a3.date, data.unique.a4.date, data.unique.a5.date, data.unique.a6.date],
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
    } else if (stattype == 2) { //hour
      var unique_stats = {
        labels: [data.unique.a0.date, data.unique.a1.date, data.unique.a2.date, data.unique.a3.date, data.unique.a4.date, data.unique.a5.date, data.unique.a6.date, data.unique.a7.date, data.unique.a8.date, data.unique.a9.date, data.unique.a10.date, data.unique.a11.date, data.unique.a12.date, data.unique.a13.date, data.unique.a14.date, data.unique.a15.date, data.unique.a16.date, data.unique.a17.date, data.unique.a18.date, data.unique.a19.date, data.unique.a20.date, data.unique.a21.date, data.unique.a22.date, data.unique.a23.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.unique.a0.count, data.unique.a1.count, data.unique.a2.count, data.unique.a3.count, data.unique.a4.count, data.unique.a5.count, data.unique.a6.count, data.unique.a7.count, data.unique.a8.count, data.unique.a9.count, data.unique.a10.count, data.unique.a11.count, data.unique.a12.count, data.unique.a13.count, data.unique.a14.count, data.unique.a15.count, data.unique.a16.count, data.unique.a17.count, data.unique.a18.count, data.unique.a19.count, data.unique.a20.count, data.unique.a21.count, data.unique.a22.count, data.unique.a23.count]
            }
        ]
      };
    }

    if (stattype == 0) { //month
      var bandwidth_stats = {
        labels: [data.bandwidth.a0.date, data.bandwidth.a1.date, data.bandwidth.a2.date, data.bandwidth.a3.date, data.bandwidth.a4.date, data.bandwidth.a5.date, data.bandwidth.a6.date, data.bandwidth.a7.date, data.bandwidth.a8.date, data.bandwidth.a9.date, data.bandwidth.a10.date, data.bandwidth.a11.date, data.bandwidth.a12.date, data.bandwidth.a13.date, data.bandwidth.a14.date, data.bandwidth.a15.date, data.bandwidth.a16.date, data.bandwidth.a17.date, data.bandwidth.a18.date, data.bandwidth.a19.date, data.bandwidth.a20.date, data.bandwidth.a21.date, data.bandwidth.a22.date, data.bandwidth.a23.date, data.bandwidth.a24.date, data.bandwidth.a25.date, data.bandwidth.a26.date, data.bandwidth.a27.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.bandwidth.a0.mb, data.bandwidth.a1.mb, data.bandwidth.a2.mb, data.bandwidth.a3.mb, data.bandwidth.a4.mb, data.bandwidth.a5.mb, data.bandwidth.a6.mb, data.bandwidth.a7.mb, data.bandwidth.a8.mb, data.bandwidth.a9.mb, data.bandwidth.a10.mb, data.bandwidth.a11.mb, data.bandwidth.a12.mb, data.bandwidth.a13.mb, data.bandwidth.a14.mb, data.bandwidth.a15.mb, data.bandwidth.a16.mb, data.bandwidth.a17.mb, data.bandwidth.a18.mb, data.bandwidth.a19.mb, data.bandwidth.a20.mb, data.bandwidth.a21.mb, data.bandwidth.a22.mb, data.bandwidth.a23.mb, data.bandwidth.a24.mb, data.bandwidth.a25.mb, data.bandwidth.a26.mb, data.bandwidth.a27.mb]
            }
        ]
      };
    } else if (stattype == 1) { //week
      var bandwidth_stats = {
        labels: [data.bandwidth.a0.date, data.bandwidth.a1.date, data.bandwidth.a2.date, data.bandwidth.a3.date, data.bandwidth.a4.date, data.bandwidth.a5.date, data.bandwidth.a6.date],
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
    } else if (stattype == 2) { //hour
      var bandwidth_stats = {
        labels: [data.bandwidth.a0.date, data.bandwidth.a1.date, data.bandwidth.a2.date, data.bandwidth.a3.date, data.bandwidth.a4.date, data.bandwidth.a5.date, data.bandwidth.a6.date, data.bandwidth.a7.date, data.bandwidth.a8.date, data.bandwidth.a9.date, data.bandwidth.a10.date, data.bandwidth.a11.date, data.bandwidth.a12.date, data.bandwidth.a13.date, data.bandwidth.a14.date, data.bandwidth.a15.date, data.bandwidth.a16.date, data.bandwidth.a17.date, data.bandwidth.a18.date, data.bandwidth.a19.date, data.bandwidth.a20.date, data.bandwidth.a21.date, data.bandwidth.a22.date, data.bandwidth.a23.date],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [data.bandwidth.a0.mb, data.bandwidth.a1.mb, data.bandwidth.a2.mb, data.bandwidth.a3.mb, data.bandwidth.a4.mb, data.bandwidth.a5.mb, data.bandwidth.a6.mb, data.bandwidth.a7.mb, data.bandwidth.a8.mb, data.bandwidth.a9.mb, data.bandwidth.a10.mb, data.bandwidth.a11.mb, data.bandwidth.a12.mb, data.bandwidth.a13.mb, data.bandwidth.a14.mb, data.bandwidth.a15.mb, data.bandwidth.a16.mb, data.bandwidth.a17.mb, data.bandwidth.a18.mb, data.bandwidth.a19.mb, data.bandwidth.a20.mb, data.bandwidth.a21.mb, data.bandwidth.a22.mb, data.bandwidth.a23.mb]
            }
        ]
      };
    }

    $('#req').empty();
    $('#req').append('<canvas id="req_graph" name="req_graph" style="width:100%;" height="100"></canvas>');

    $('#uniq').empty();
    $('#uniq').append('<canvas id="unique_graph" name="unique_graph" style="width:100%;" height="100"></canvas>');

    $('#bandw').empty();
    $('#bandw').append('<canvas id="bandwidth_graph" name="unique_graph" style="width:100%;" height="100"></canvas>');

    try {
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

  } catch(err) {
    console.log("Err: unable to set charts")
  }

   }, 'text').error(function() { stat_error_show(); });

}

function loadgh() {
  var ghurl = new RegExp("https:\/\/raw.githubusercontent.com\/[a-zA-Z]+\/[a-zA-Z]+");
  var ghlazy = new RegExp("https:\/\/github.com\/.+\/.+\/blob\/[a-zA-Z]+\/");
  var bburl = new RegExp("https:\/\/bitbucket.org\/.+\/.+\/raw\/.+\/.*");
  var bblazy = new RegExp("https:\/\/bitbucket.org\/.+\/.+\/src\/.+\/.*");
  var url = document.forms["redirect"]["url"].value;

  if (ghlazy.test(url)) {
    //https://github.com/ToxMe/raw-github/blob/master/html/index.html
    //https://raw.githubusercontent.com/ToxMe/raw-github/master/html/index.html
    var repo = url.split("https://github.com")[1].split("/blob")[0];
    var file = url.split(repo + "/blob")[1];
    url = "https://raw.githubusercontent.com" + repo + file;
  }

  if (bblazy.test(url)) {
    //https://bitbucket.org/{{user}}/{{repo}}/src/{{branch}}/{{file}}
    //https://bitbucket.org/{{user}}/{{repo}}/raw/{{branch}}/{{file}}
    try {
        url = url.split("?")[0];
    } catch(err) {
      console.log("URL lacks ?")
    }
    var repo = url.split("/src")[0] + "/raw/";
    var file = url.split("/src")[1];
    url = repo + file;
  }

  if (ghurl.test(url)) {
    var url = "https://raw-github.toxme.se" + url.split("raw.githubusercontent.com")[1];
    updateurl(url);
  } else if (bburl.test(url)) {
    var url = "https://raw-bitbucket.toxme.se" + url.split("bitbucket.org")[1];
    updateurl(url);
  } else {
    $("#url").blur();
    open_error_show();
  }
}

function updateurl(url) {
  var modeurl = $("#mode-url").prop('checked');
  var newtab = $("#newtab").prop('checked');

  if (modeurl == true) {
    $("#url").val(url);
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
      window.open(url, '_blank');
    } else {
        window.location = url;
    }
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

function stat_error_hide() {
  $("#errmsg").fadeOut();
}

function stat_error_show() { //being lazy
        $("#errmsg").fadeIn();
        setTimeout(stat_error_hide, 5000); //150% longer
}

$(window).load(function(){
  newpage();

  $.get('manifest.appcache', function(txt) {
      ver = txt.split('\n')[1].split('#')[1];
    $("#ver").text(ver);
  });
});
