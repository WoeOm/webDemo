!function (e, t) {
    var o = function () {
        var e = this;
        e.o = {
            direction: "horizontal",
            duration: .5,
            delay: 3,
            pause: !t,
            loop: !t,
            dots: t,
            arrows: t,
            prev: "",
            next: "",
            items: ">ul",
            item: ">li",
            easing: "swing",
            effect: "slide",
            playTotalCount: 0,
            playComplete: t,
            isSwipe: !t,
            arrowStyle: 0,
            arrowPrevPath: "",
            arrowNextPath: "",
            arrowPosition: "middle",
            arrowPositionValue: 0
        }
    };
    o.prototype = {
        constructor: o, init: function (t, o) {
            var i = this;
            i.o = e.extend(i.o, o), i.el = t, i.ul = t.find(i.o.items), i.max = [0 | t.outerWidth(), 0 | t.outerHeight()], i.li = i.ul.find(i.o.item).each(function () {
                var t = e(this), o = t.outerWidth(), n = t.outerHeight();
                o > i.max[0] && (i.max[0] = o), n > i.max[1] && (i.max[1] = n)
            }), i.len = i.li.length, i.i = 0, i.run = !0, i.playCount = 0, i.timer = null, i.o.duration = parseFloat(i.o.duration), i.o.delay = parseFloat(i.o.delay), i.o.playTotalCount = parseFloat(i.o.playTotalCount);
            {
                var o = i.o, n = i.ul, a = i.li;
                i.len, i.i
            }
            return t.css({
                width: i.max[0],
                height: a.first().outerHeight(),
                overflow: "hidden"
            }), n.css({
                position: "relative",
                left: 0,
                top: 0
            }), i.initEffectStyle(), o.dots && i.nav("dot"), o.arrows && i.nav("arrow"), "horizontal" === i.o.direction ? (touch.on(t, "swipeleft", function () {
                i.o.isSwipe && i.next()
            }), touch.on(t, "swiperight", function () {
                i.o.isSwipe && i.prev()
            })) : (touch.on(t, "swipeup", function () {
                i.o.isSwipe && i.next()
            }), touch.on(t, "swipedown", function () {
                i.o.isSwipe && i.prev()
            })), i
        }, initEffectStyle: function () {
            var e = this;
            switch (e.o.effect) {
                case"slide":
                    "horizontal" === e.o.direction ? (e.li.css({
                        position: "absolute",
                        top: 0,
                        left: e.max[0] + "px",
                        width: e.max[0] + "px"
                    }), e.li.eq(e.i).css({left: 0})) : (e.li.css({
                        position: "absolute",
                        top: e.max[0] + "px",
                        left: 0,
                        width: e.max[0] + "px"
                    }), e.li.eq(e.i).css({top: 0}));
                    break;
                case"fade":
                case"frame":
                    e.li.css({position: "absolute", top: 0, left: 0}).hide(), e.li.eq(e.i).show()
            }
        }, to: function (e, o, i, n) {
            function a(e) {
                e >= 2 && (r.run = !0)
            }

            var r = this, s = r.o, l = r.el, c = r.ul, u = r.li, d = r.len;
            if ((0 > e || e > d - 1) && s.loop === t)return void r.stop();
            0 > e ? e = d - 1 : e > d - 1 && (e = 0);
            var p = n ? 5 : s.duration, f = s.easing, h = u.eq(o), v = 0;
            if (!c.queue("fx").length)switch (r.run = !1, l.find(".dot").eq(o).addClass("active").siblings().removeClass("active"), s.effect) {
                case"slide":
                    "horizontal" === r.o.direction && ("next" === i ? (u.eq(e).animate({left: "-100%"}, 1e3 * p, f, function () {
                        v++, a(v)
                    }), h.css({left: "100%"}).animate({left: 0}, 1e3 * p, f, function () {
                        v++, a(v)
                    })) : "prev" === i && (u.eq(e).animate({left: "100%"}, 1e3 * p, f, function () {
                        v++, a(v)
                    }), h.css({left: "-100%"}).animate({left: 0}, 1e3 * p, f, function () {
                        v++, a(v)
                    })));
                    break;
                case"fade":
                    u.eq(e).hide(), h.fadeIn(1e3 * p, function () {
                        r.run = !0
                    });
                    break;
                case"frame":
                    setTimeout(function () {
                        u.eq(e).hide(), h.show(), r.run = !0
                    }, 1e3 * p)
            }
        }, play: function () {
            var e = this;
            e.timer = setInterval(function () {
                return 0 !== e.o.playTotalCount && e.playCount >= e.o.playTotalCount ? (e.stop(), e.o.playComplete && e.o.playComplete(), void(e.playCount = 0)) : void(e.run && e.changeTo("next", !0))
            }, 1e3 * (e.o.delay + e.o.duration))
        }, stop: function () {
            var e = this;
            return clearInterval(e.timer), e.timer = null, e
        }, next: function () {
            var e = this;
            e.run && e.changeTo("next")
        }, prev: function () {
            var e = this;
            e.run && e.changeTo("prev")
        }, changeTo: function (e, t) {
            var o = this, i = !0;
            "next" === e ? o.i++ : o.i--, o.o.loop ? (o.i === o.len - 1 && o.playCount++, o.i > o.len - 1 ? o.i = 0 : o.i < 0 && (o.i = o.len - 1)) : o.i > o.len - 1 ? (o.i = o.len - 1, i = !1) : o.i < 0 && (o.i = 0, i = !1), "undefined" == typeof t && o.stop(), i && ("next" === e ? o.to(o.i - 1, o.i, "next") : o.to(o.i + 1, o.i, "prev"))
        }, setIndex: function (e) {
            var t = this;
            t.i = e, t.initEffectStyle(), t.el.find(".dot").eq(e).addClass("active").siblings().removeClass("active")
        }, nav: function (t, o) {
            var i = this;
            if ("dot" == t)o = '<ol class="dots">', e.each(i.li, function (e) {
                o += '<li class="' + (e === i.i ? t + " active" : t) + '">' + ++e + "</li>"
            }), o += "</ol>"; else {
                var n = "", a = {prev: "", next: ""}, r = "", s = "";
                switch (i.o.arrowStyle) {
                    case"0":
                        n = "arrows0";
                        break;
                    case"1":
                        n = "arrows1";
                        break;
                    case"2":
                        n = "arrows2";
                        break;
                    case"3":
                        n = "arrows3", a = {
                            prev: "background:url(" + i.o.arrowPrevPath + ") no-repeat;background-size:100% 100%;",
                            next: "background:url(" + i.o.arrowNextPath + ") no-repeat;background-size:100% 100%;"
                        }
                }
                switch (i.o.arrowPosition) {
                    case"top":
                        r = "arrowTop";
                        break;
                    case"middle":
                        r = "arrowMiddle";
                        break;
                    case"bottom":
                        r = "arrowBottom";
                        break;
                    case"custom":
                        r = "arrowCustom", s = "top:" + i.o.arrowPositionValue + "px;"
                }
                o = '<div class="', o = o + t + "s " + n + '">' + o + t + " prev " + r + '" style="' + a.prev + s + '">' + i.o.prev + "</div>" + o + t + " next " + r + '" style="' + a.next + s + '">' + i.o.next + "</div></div>"
            }
            i.el.addClass("has-" + t + "s").append(o).find("." + t).click(function () {
                var t = e(this);
                t.hasClass("dot") ? i.stop().to(t.index()) : t.hasClass("prev") ? i.prev() : i.next()
            })
        }
    }, e.fn.unslider = function (t) {
        var i = this.length;
        return this.each(function (n) {
            var a = e(this), r = "unslider" + (i > 1 ? "-" + ++n : ""), s = (new o).init(a, t);
            a.data(r, s).data("key", r)
        })
    }, o.version = "1.0.0"
}(jQuery, !1);
