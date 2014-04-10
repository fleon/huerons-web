var huerons = angular.module('huerons', [])

huerons.controller('MainController', function MainController($scope, $timeout) {
    $scope.screenHeight = $(window).height();
    $scope.images = [
        'screens/photo1.jpg',
        'screens/photo2.jpg',
        'screens/photo3.jpg',
        'screens/photo4.jpg',
        'screens/photo5.jpg',
        'screens/photo6.jpg',
        'screens/photo7.jpg',
        'screens/photo8.jpg'
    ];

    var currentImage = 0;

    setInterval(function () {
        $('.carousel div').css('position', 'relative').animate({
            left: currentImage ++*- 270
        });
        if (currentImage >= $scope.images.length) {
            currentImage = 0;
        }
    }, 5000);

    var pts = {};
    var r = [], l = 15;
    adjCreate(pt(0, 0));

    $scope.r = r;

    var clamp = $scope.clamp = function clamp(value, min, max) {
        if (typeof min !== 'number') { min = -Infinity; }
        if (typeof max !== 'number') { max = Infinity; }
        return Math.max(min, Math.min(max, value));
    };

    function pt(x, y) {
        return {x: x, y: y, toString: function () {
            return [this.x, this.y].join('-');
        }};
    }

    function adj(p) {
        return [
            pt(p.x, p.y + 1),
            pt(p.x + 1, p.y),
            pt(p.x, p.y - 1),
            pt(p.x - 1, p.y)
        ];
    }

    function adjCreate(pt, m) {
        m = Math.abs(pt.x) + Math.abs(pt.y);
        if (pts[pt] || m > l) return;
        (r[m] = r[m] || []).push(pt);
        pts[pt] = 1;
        adj(pt).map(adjCreate);
    }

    function clampAdd(n, a, min, max) {
        a = clamp(a, min, max);
        return n + a - clamp(n + a, min, max);
    }

    var lastScrollTop = 0;
    function onScroll(e) {
        var animateCircles = true;
        var step = 0;
        var scrollTop = $(window).scrollTop();
        scrollTop = clamp(scrollTop, 0.01, $(document).height() - 0.01);
        var ratio = scrollTop / $scope.screenHeight;
        var reachedGameplay = ratio >= 6 && ratio < 7;
        if (reachedGameplay && !autoScroll && lastScrollTop < scrollTop) {
            $scope.scrollTo(13.5, 9e3, 'linear');
        }
        lastScrollTop = scrollTop;

        var niceRatio = ratio % 1;
        var reverse = false;
        if (Math.floor(ratio) % 4 === 1) {
            niceRatio = 1 - niceRatio;
        }
        if (Math.floor(ratio) % 4 === 2) {
            reverse = true;
        }
        if (Math.floor(ratio) % 4 === 3) {
            reverse = true;
            niceRatio = 1 - niceRatio;
        }
        if (Math.ceil(ratio) / 3 > 1) {
            step = 1;
        }
        if (Math.ceil(ratio) / 4 > 1) {
            step = 2;
        }
        if (Math.ceil(ratio) / 5 > 1) {
            animateCircles = false;
        }

        if (animateCircles) {
            for (var i = 0, l = r.length; i < l; i++) {
                $('.r-' + i).css({
                    opacity: clampAdd(niceRatio, (reverse ? i : l - i) / l, 0, 1)
                });
            }
            $('.hueron--letter').css({
                background: 'rgba(255,255,255,0.05)',
                top: - 50,
                opacity: 1,
                width: 100
            }).each(function (i) {
                $('.hueron--letter').eq(i).css({
                    left: (i - 3) * 100 - 50,
                });
            });
        }

        if (step === 0) {
            $('.iphone-container').css({
                top: $(window).height() / 2 + 327 + 10,
                left: -162
            });
        }

        $('.hueron--arrow').css({
            opacity: ratio < 1 ? 1 - niceRatio : 0,
            display: ratio < 1 ? 'block' : 'none'
        });

        var j = 30;
        var k = (100 - j) / 100;
        if (step === 1) {
            $('.hueron--letter').css({
                width: Math.max(niceRatio * 100, j),
                background: 'rgba(255,255,255,0)',
                top: Math.max(-300 * (1 - niceRatio), -300 * k) - 50 - 30
            }).each(function (i) {
                var w = Math.max(niceRatio * 100, 30);
                $('.hueron--letter').eq(i).css({
                    left: Math.min(200 * (1 - niceRatio), 200 * k) + (i - 3) * w - w / 2
                });
            });
            $('.iphone-container').css({
                top: ($(window).height() / 2 + 327 + 10) * niceRatio
            });
        }

        if (step === 2) {
            for (var i = 0, l = r.length; i < l; i++) {
                $('.r-' + i).css({
                    opacity: 0
                });
            }
            $('.hueron--letter').css({
                width: 30,
                background: 'rgba(255,255,255,0)',
                top: -300 * k - 50 - 30
            }).each(function (i) {
                var w = 30;
                $('.hueron--letter').eq(i).css({
                    left: 200 * k + (i - 3) * w - w / 2
                });
            });
            $('.iphone-container').css({
                top: 0
            });
        }
    }

    var autoScroll = false;

    $scope.scrollTo = function (h, duration, easing) {
        autoScroll = true;
        $('html, body').animate({scrollTop: $scope.screenHeight * h}, {
            duration: duration,
            easing: easing || 'easeOutQuad',
            queue: false,
            complete: function () {
                autoScroll = false;
            }
        });
    };

    function fadeOut(obj, duration, delay, cb) {
        $(obj).delay(delay).animate({
            opacity: 0.3
        }, 1000, function () {
            cb && cb(obj, duration, 1500 / 2, fadeOut);
        });
    }

    function fadeIn(obj, duration, delay, cb) {
        $(obj).delay(delay).animate({
            opacity: 1
        }, 1000, function () {
            cb && cb(obj, duration, 1500 / 2, fadeIn);
        });
    }

    $('.portal').each(function (i) {
        var portal = $(this);
        $('.circle-portal', this).each(function (j) {
            if (portal.hasClass('portal--inwards')) {
                fadeOut(this, 1000, j * 300, fadeIn);
            } else {
                fadeIn(this, 1000, (5 - j) * 300, fadeOut);
            }
        });
    });

    $(window).scroll(onScroll);
    setTimeout(function () {
        onScroll();
    }, 4);

    skrollr.init();
});