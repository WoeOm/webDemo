var Main = function () {
    this.init()
};
Main.prototype = {
    constructor: Main, init: function () {
        this.requireFlg = "undefined" != typeof require ? !0 : !1, this.requireFlg && this.require(), this.curPage = 0, this.flag = !0, this.$window = $(window), this.$pageItem = $(".page-item"), this.pageLen = this.$pageItem.length, this.chartMap = {}, this.animationEndSet = [], this.animateSet = this.allAnimateSet(), this.animateSetTwo = this.animateHandle(), this.pageChangeData = $("#J_PageChangeData").val() ? $.parseJSON($("#J_PageChangeData").val()) : null, this.soundObj = {}, this.animType = {}, this.sliderSet = [], this.initTimer = null, this.pageChangeData.mode || (this.pageChangeData.mode = "slide"), this.adapter(), this.eventHandle(), this.curPageEventHandle(), this.addBgMusic(), this.interactionsHandle(), this.sliderHandle()
    }, require: function () {
        var t = jQuery("#J_StaticPath").val() || "";
        require.config({paths: {echarts: t + "/static/js/preview/echarts"}})
    }, isMobile: function () {
        for (var t = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"], a = navigator.userAgent, i = !1, e = 0; e < t.length; e++)if (a.indexOf(t[e]) > 0) {
            i = !0;
            break
        }
        return i
    }, adapter: function (t, a) {
        var i = {
            w: 640,
            h: 1008
        }, e = t ? t : this.$window.width(), n = a ? a : this.$window.height(), o = n >= e ? Math.max(e / i.w, n / i.h) : Math.min(e / i.w, n / i.h), s = Math.min(e / i.w, n / i.h);
        $(".page-bg-box").css({"-webkit-transform": "scale(" + o + ")"}), $(".page-item-content").css({"-webkit-transform": "scale(" + s + ")"})
    }, eventHandle: function () {
        var t = this, a = t.isMobile(), i = a ? "touchstart" : "mousedown", e = a ? "touchend" : "mouseup";
        this.$window.on("touchmove", function (t) {
            t.preventDefault()
        }), $("#J_DirList").on("touchmove", function (t) {
            t.stopPropagation()
        }), this.$window.on("resize", function () {
            t.adapter()
        }), $("#J_DirList li").on("click", function (a) {
            t.dirJump(a), t.hideDirPack(a)
        }), $("#J_DirBack").on(e, function (a) {
            t.hideDirPack(a)
        }), $("#J_NavBack").on(e, function (a) {
            t.hideNavPack(a)
        }), $(".J_DirBtn").on(e, function (a) {
            t.showDirPack(a)
        }), $(".J_NavBtn").on(e, function (a) {
            t.showNavPack(a)
        }), $(".page-item-content").on(i, function (a) {
            t.hideNavPack(a), t.hideDirPack(a)
        })
    }, curPageEventHandle: function () {
        var t = this;
        clearTimeout(this.initTimer), this.initTimer = setTimeout(function () {
            var a = t.$pageItem.eq(t.curPage);
            switch (t.pageChangeData.mode) {
                case"slide":
                    "vertical" === t.pageChangeData.direction ? t.animType = {
                        event: {prev: "swipedown", next: "swipeup"},
                        nextIn: "slideInUp",
                        nextOut: "slideOutUp",
                        prevIn: "slideInDown",
                        prevOut: "slideOutDown",
                        positionPrev: "translate3d(0, -100%, 0)",
                        positionCur: "translate3d(0, 0, 0)",
                        positionNext: "translate3d(0, 100%, 0)"
                    } : "horizontal" === t.pageChangeData.direction && (t.animType = {
                        event: {
                            prev: "swiperight",
                            next: "swipeleft"
                        },
                        nextIn: "slideInRight",
                        nextOut: "slideOutLeft",
                        prevIn: "slideInLeft",
                        prevOut: "slideOutRight",
                        positionPrev: "translate3d(-100%, 0, 0)",
                        positionCur: "translate3d(0, 0, 0)",
                        positionNext: "translate3d(100%, 0, 0)"
                    }), t.$pageItem.css({
                        "z-index": 1,
                        "-webkit-transform": t.animType.positionNext,
                        transform: t.animType.positionNext
                    }), a.css({
                        display: "block",
                        "z-index": 2,
                        "-webkit-transform": t.animType.positionCur,
                        transform: t.animType.positionCur
                    }).addClass("active"), a.next(".page-item").css("display", "block");
                    break;
                case"fade":
            }
            t.addAnimate(a.find(".show-anim"), "way0"), t.requireFlg && t.showCharts(a), t.sliderStop(t.curPage), t.sliderPlay(t.curPage), t.slidePage()
        }, 0)
    }, addBgMusic: function () {
        var t = this, a = $("#audioIcon"), i = a.attr("data-src"), e = a.attr("data-loop") ? a.attr("data-loop") : !0, n = a.attr("data-autoplay") ? a.attr("data-autoplay") : !0;
        a[0] && (t.bgAudio = t.audioFn(), $.extend(t.bgAudio, {
            switchId: "audioIcon",
            controlSwitchClass: "audio_icon_close",
            src: i,
            loop: e,
            autoplay: n
        }), t.bgAudio.autoPlayMusic().addEvent())
    }, slidePage: function () {
        var t = this;
        touch.on(".page-item", t.animType.event.next, function (a) {
            var i = $(a.currentTarget).index(), e = i + 1;
            if (i >= t.pageLen - 1) {
                if (!t.pageChangeData || !t.pageChangeData.loop)return !1;
                e = 0
            }
            t.nextTab(i, e)
        }), touch.on(".page-item", t.animType.event.prev, function (a) {
            var i = $(a.currentTarget).index(), e = i - 1;
            if (0 >= i) {
                if (!t.pageChangeData || !t.pageChangeData.loop)return !1;
                e = t.pageLen - 1
            }
            t.prevTab(i, e)
        })
    }, nextTab: function (t, a, i) {
        function e() {
            c >= 2 && (c = 0, s.removeClass("active").find(".init-hide").addClass("hide"), n.curPage = a, n.flag = !0, n.addAnimate(r.find(".show-anim"), "way0"), n.requireFlg && n.showCharts(r), d.each(function () {
                var t = $(this);
                t.attr("data-show") && ("true" === t.attr("data-visibility") ? t.css("display", "block") : "false" === t.attr("data-visibility") && t.css("display", "none"), t.removeAttr("data-show"))
            }), n.sliderPlay(a), n.sliderStop(t))
        }

        var n = this, o = n.$pageItem, s = o.eq(t), r = o.eq(a), d = s.find(".page-item-content").children(), c = 0;
        return !n.flag || "true" === s.attr("data-unslide") && !i ? !1 : (n.flag = !1, r.css("display", "block").addClass("active"), n.addAnimate(s.find(".show-anim"), "way1"), n.animateRun(s, {name: n.animType.nextOut}, {
            end: function () {
                s.css({
                    display: "none",
                    "-webkit-transform": n.animType.positionPrev,
                    transform: n.animType.positionPrev,
                    "z-index": 1
                }), this.clearCssAnimate(), c++, e()
            }
        }), n.animateRun(r, {name: n.animType.nextIn}, {
            end: function () {
                r.css({
                    "-webkit-transform": n.animType.positionCur,
                    transform: n.animType.positionCur,
                    "z-index": 2
                }), this.clearCssAnimate(), c++, e()
            }
        }), void r.next(".page-item").css("display", "block"))
    }, prevTab: function (t, a) {
        function i() {
            d >= 2 && (d = 0, o.removeClass("active").find(".init-hide").addClass("hide"), e.curPage = a, e.flag = !0, e.addAnimate(s.find(".show-anim"), "way0"), e.requireFlg && e.showCharts(s), r.each(function () {
                var t = $(this);
                t.attr("data-show") && ("true" === t.attr("data-visibility") ? t.css("display", "block") : "false" === t.attr("data-visibility") && t.css("display", "none"), t.removeAttr("data-show"))
            }), e.sliderPlay(a), e.sliderStop(t))
        }

        var e = this, n = e.$pageItem, o = n.eq(t), s = n.eq(a), r = o.find(".page-item-content").children(), d = 0;
        return e.flag ? (e.flag = !1, s.css("display", "block").addClass("active"), e.addAnimate(o.find(".show-anim"), "way1"), e.animateRun(o, {name: e.animType.prevOut}, {
            end: function () {
                o.css({
                    display: "none",
                    "-webkit-transform": e.animType.positionNext,
                    transform: e.animType.positionNext,
                    "z-index": 1
                }), this.clearCssAnimate(), d++, i()
            }
        }), e.animateRun(s, {name: e.animType.prevIn}, {
            end: function () {
                s.css({
                    "-webkit-transform": e.animType.positionCur,
                    transform: e.animType.positionCur,
                    "z-index": 2
                }), this.clearCssAnimate(), d++, i()
            }
        }), void s.prev(".page-item").css("display", "block")) : !1
    }, gotoPage: function (t, a, i) {
        switch (i) {
            case"prev":
                this.prevTab(t, a, i);
                break;
            case"next":
                this.nextTab(t, a, i);
                break;
            case"jump":
                t > a ? this.prevTab(t, a, i) : a > t && this.nextTab(t, a, i)
        }
    }, showCharts: function (t) {
        var a = this;
        $(t).find(".show-chart").each(function (t, i) {
            var e = i.id, n = $(i).attr("data-type"), o = $(i).find(".chart-data").html();
            a.chartMap[e] ? a.chartMap[e].restore() : require(["echarts/echarts", "echarts/chart/" + n], function (t) {
                a.chartMap[e] = t.init(document.getElementById(e)), a.chartMap[e].setOption(JSON.parse(o))
            })
        })
    }, shareTip: function () {
        var t = $('<div class="share-tip" id="shareTip" style="display: none;"><span></span></div>');
        $("#shareTip")[0] ? $("#shareTip").show() : t.appendTo($(document.body)).show(), touch.on("#shareTip", "tap", function () {
            $(this).hide()
        })
    }, videoTip: function (t) {
        function a() {
            var t = $("#videoTip");
            i.bgAudio && i.bgAudio.pauseMusic(), n.css({
                width: "98%",
                height: "100%"
            }), t.find(".video-content").html(n), t.show()
        }

        var i = this, e = '<div class="video-tip" id="videoTip" style="display: none;"><a href="javascript:;" class="close-btn"></a><div class="video-content"></div></div>', n = $(t);
        $(document.body).append(e), a(), touch.on("#videoTip .close-btn", "tap", function () {
            $("#videoTip").remove(), i.bgAudio && i.bgAudio.playMusic()
        })
    }, audioFn: function () {
        var t = {
            _isAutoPlayed: !1,
            src: "",
            obj: null,
            switchId: null,
            controlSwitchClass: "",
            volume: 1,
            isVolume: !1,
            loop: !0,
            autoplay: !0,
            timer: null,
            event: "touchstart",
            init: function () {
                var t = this;
                return t.obj = document.createElement("audio"), null != t.obj && t.obj.canPlayType && t.obj.canPlayType("audio/mpeg") && (t.obj.src = t.src, t.obj.volume = t.volume, t.obj.loop = t.loop, t.obj.autoplay = t.autoplay, document.body.appendChild(t.obj)), this
            },
            addEvent: function () {
                var t = this;
                t.switch = $("#" + t.switchId), t.switchId && touch.on("#" + t.switchId, t.event, function () {
                    t.obj.paused ? t.playMusic() : t.pauseMusic()
                })
            },
            playMusic: function () {
                var t = this;
                return t.switch && this.switch.removeClass(this.controlSwitchClass), this.isVolume && (this.obj.volume = 0, this.volumeFn()), this.obj.play(), this
            },
            pauseMusic: function () {
                return this.switch && this.switch.addClass(this.controlSwitchClass), this.obj.pause(), this
            },
            volumeFn: function () {
                var t = this;
                return t.volume += .1, t.volume >= 1 && (t.volume = 1, clearTimeout(t.timer)), t.obj.volume = t.volume, t.timer = setTimeout(function () {
                    t.volumeFn()
                }, 800), this
            },
            autoPlayMusic: function () {
                var t = this;
                return t._isautoplayed ? "" : function () {
                    t.init(), t._isautoplayed = !0, t.playMusic()
                }(), this
            },
            setCurrentTime: function (t) {
                return this.obj.currentTime = t, this
            },
            setSrc: function (t) {
                this.obj.src = t
            },
            setLoop: function (t) {
                this.obj.loop = t
            },
            getPaused: function () {
                return this.obj.paused
            }
        };
        return t
    }, audioInit: function (t, a) {
        var i = this.soundObj[a] ? this.soundObj[a] : [], e = 0;
        if (4 === t.type && t.data) {
            if (i.length) {
                for (var n = 0, o = i.length; o > n; n++)t.event === i[n].data.event && (t.data.path !== i[n].data.path && (i[n].data = t, i[n].audio.setSrc(t.data.path)), t.data.loop !== i[n].data.loop && (i[n].data = t, i[n].audio.setSrc(t.data.loop)), e++);
                if (0 === e) {
                    var s = this.audioFn();
                    $.extend(s, {src: t.data.path, loop: t.data.loop, autoplay: !1}), s.init(), i.push({
                        data: t,
                        audio: s
                    })
                }
            } else {
                var r = this.audioFn();
                $.extend(r, {src: t.data.path, loop: t.data.loop, autoplay: !1}), r.init(), i = [{data: t, audio: r}]
            }
            this.soundObj[a] = i
        }
    }, stopPlayAll: function () {
        var t = this.soundObj;
        for (var a in t)for (var i = 0, e = t[a].length; e > i; i++)t[a][i].audio.pauseMusic()
    }, interactionsHandle: function () {
        var t = this, a = $(".J_interactions");
        a.each(function () {
            function a(a) {
                t.audioInit(a, e), "animationend" !== a.event ? touch.on("#" + e, a.event, function (i) {
                    i.stopPropagation(), t.typeAction(a.type, a.data, a.event, e)
                }) : t.animationEndSet.push(a)
            }

            var i = $(this), e = i.attr("id"), n = i.attr("data-action") ? $.parseJSON(i.attr("data-action")) : null;
            if (n)for (var o = 0, s = n.length; s > o; o++)a(n[o])
        })
    }, typeAction: function (t, a, i, e) {
        function n(t) {
            return t ? void u.gotoPage(u.curPage, t.jumpPage, "jump") : !1
        }

        function o(t) {
            if (!t)return !1;
            for (var a = 0, i = t.length; i > a; a++)!function (a) {
                var i = t[a], e = $("#" + i.id), n = e.find(".show-anim"), o = e.attr("data-visibility") ? e.attr("data-visibility") : i.visibility.toString(), s = e.attr("data-show") ? e.attr("data-show") : o;
                "0" == i.property && "false" == s ? (e.css("display", "block"), u.addAnimate(n, "way2", function () {
                    e.attr("data-show", !0)
                })) : "1" == i.property && "true" == s ? u.addAnimate(n, "way3", function () {
                    e.css("display", "none").attr("data-show", !1)
                }) : "2" == i.property && ("true" == s ? u.addAnimate(n, "way3", function () {
                    e.css("display", "none").attr("data-show", !1)
                }) : "false" == s && (e.css("display", "block"), u.addAnimate(n, "way2", function () {
                    e.attr("data-show", !0)
                })))
            }(a)
        }

        function s(t, a, i) {
            if (!t)return !1;
            var e = u.soundObj[i];
            if (e)for (var n = 0, o = e.length; o > n; n++)e[n].data.event === a && (e[n].audio.getPaused() ? (u.stopPlayAll(), e[n].audio.playMusic()) : e[n].audio.pauseMusic())
        }

        function r(t) {
            return t ? void u.videoTip(t.code) : !1
        }

        function d(t) {
            for (var a = u.animateSet[u.curPage], i = 0, e = t.length; e > i; i++)for (var n = 0, o = a.length; o > n; n++)if (t[i].id === a[n].id) {
                u.animateRun("inset_" + a[n].elemId, a[n]);
                break
            }
        }

        function c(t) {
            for (var a = u.sliderCur(u.curPage), i = 0, e = t.length; e > i; i++)for (var n = 0, o = a.length; o > n; n++)if (t[i].id === a[n].id) {
                a[n].data.play();
                break
            }
        }

        var u = this;
        switch (t) {
            case 0:
                window.location.href = a.path;
                break;
            case 1:
                u.shareTip();
                break;
            case 2:
                n(a);
                break;
            case 3:
                o(a);
                break;
            case 4:
                s(a, i, e);
                break;
            case 5:
                r(a);
                break;
            case 6:
                d(a);
                break;
            case 7:
                c(a)
        }
    }, animateEndHandle: function (t) {
        for (var a = this, i = 0, e = a.animationEndSet.length; e > i; i++)a.animationEndSet[i].animateTag === t && a.typeAction(a.animationEndSet[i].type, a.animationEndSet[i].data)
    }, allAnimateSet: function () {
        for (var t = this, a = [], i = 0; i < t.pageLen; i++) {
            var e = t.$pageItem.eq(i).find(".show-anim"), n = [];
            e.each(function () {
                var t = $(this), a = t.attr("data-animates") ? $.parseJSON(t.attr("data-animates")) : null;
                if (a)for (var i = 0, e = a.length; e > i; i++)a[i].elemId = t.parent().attr("id"), n.push(a[i])
            }), a.push(n)
        }
        return a
    }, animateHandle: function () {
        for (var t = [], a = 0, i = this.animateSet.length; i > a; a++) {
            for (var e = {}, n = 0, o = this.animateSet[a].length; o > n; n++) {
                var s = this.animateSet[a][n];
                switch (s.handleWay) {
                    case"way0":
                    case"way1":
                    case"way2":
                    case"way3":
                        e[s.handleWay] || (e[s.handleWay] = {}), e[s.handleWay][s.elemId] || (e[s.handleWay][s.elemId] = s);
                        break;
                    case"way4":
                    case"way5":
                        e[s.handleWay] || (e[s.handleWay] = []), this.animateSet[a][n - 1] ? (s.prevAnimateId = this.animateSet[a][n - 1].id, e[s.handleWay].push(s)) : (e.way0 || (e.way0 = {}), e.way0[s.elemId] || (s.handleWay = "way0", e.way0[s.elemId] = s))
                }
            }
            t.push(e)
        }
        return t
    }, animateRun: function (t, a, i) {
        var e = "[object String]" === Object.prototype.toString.call(t) ? $("#" + t) : t, n = new Animate({
            element: e,
            cssAnimateAttr: {
                id: a.id ? a.id : "",
                name: a.subName || a.name,
                duration: a.duration ? a.duration : .6,
                count: a.count ? a.count : 1,
                delay: a.delay ? a.delay : 0,
                "function": a.function ? a.function : "linear"
            }
        });
        a.handleWay && "way0" === a.handleWay && e.removeClass("hide"), n.addCssAnimate({
            start: function (t) {
                i && i.start && (i.start.call(this, t), i.start = null)
            }, end: function (t) {
                i && i.end && (i.end.call(this, t), i.end = null, n = null)
            }
        })
    }, addAnimate: function (t, a, i) {
        function e(t, a, i) {
            function e(a) {
                var e = arguments.callee;
                d[r] ? d[r].prevAnimateId === a ? n.animateRun("inset_" + d[r].elemId, d[r], {
                    start: function (a) {
                        "way4" === t && ++r < c && e(a), s("way4", a, i)
                    }, end: function (a) {
                        "way5" === t && (++r < c ? e(a) : i && i()), s("way5", a, i), n.animateEndHandle(a)
                    }
                }) : ++r < c ? e(a) : i && i() : "way4" !== t && i && i()
            }

            var s = arguments.callee, r = 0, d = o[t], c = d ? d.length : 0;
            d ? e(a) : "way4" !== t && i && i()
        }

        var n = this, o = this.animateSetTwo[this.curPage], s = o[a];
        s && t.length ? t.each(function () {
            var t = $(this), a = t.parent().attr("id");
            s[a] ? n.animateRun("inset_" + a, s[a], {
                start: function (t) {
                    e("way4", t, i)
                }, end: function (t) {
                    e("way5", t, i), n.animateEndHandle(t)
                }
            }) : i && i()
        }) : i && i()
    }, sliderHandle: function () {
        var t = this, a = $(".show-slider");
        a.each(function () {
            var a = $(this), i = a.attr("data-config") ? $.parseJSON(a.attr("data-config")) : {}, e = a.parent().attr("data-action") ? $.parseJSON(a.parent().attr("data-action")) : {}, n = [];
            if (e)for (var o = 0, s = e.length; s > o; o++)"frameAnimationEnd" === e[o].event && n.push(e[o]);
            n.length && (i.playComplete = function () {
                for (var a = 0, i = n.length; i > a; a++)t.typeAction(n[a].type, n[a].data)
            });
            var r = a.unslider(i), d = r.data("unslider");
            t.sliderSet.push({
                id: a.parent().attr("id"),
                data: d,
                config: i,
                interactions: e,
                pageIndex: a.parents(".page-item").index()
            })
        })
    }, sliderCur: function (t, a) {
        for (var i = [], e = 0, n = this.sliderSet.length; n > e; e++)this.sliderSet[e].pageIndex === t && ("undefined" != typeof a && a ? this.sliderSet[e].config.autoplay && i.push(this.sliderSet[e]) : i.push(this.sliderSet[e]));
        return i
    }, sliderPlay: function (t) {
        for (var a = this.sliderCur(t, !0), i = 0, e = a.length; e > i; i++)a[i].data.play()
    }, sliderStop: function (t) {
        for (var a = this.sliderCur(t), i = 0, e = a.length; e > i; i++)a[i].data.stop(), a[i].data.setIndex(0)
    }, dirJump: function (t) {
        var a = parseInt($(t.currentTarget).attr("data-jump"));
        this.gotoPage(this.curPage, a - 1, "jump")
    }, hideDirPack: function () {
        $("#J_PreDir").animate({left: "-100%"}, function () {
            $(this).hide()
        })
    }, showDirPack: function (t) {
        t.stopPropagation(), $("#J_PreDir").css({
            display: "-webkit-box",
            left: "-100%",
            "pointer-events": "none"
        }).animate({left: 0}, function () {
            $(this).css({"pointer-events": "auto"})
        }), this.hideNavPack()
    }, hideNavPack: function () {
        $("#J_PreNav").animate({right: "-100%"}, function () {
            $(this).hide()
        })
    }, showNavPack: function (t) {
        t.stopPropagation(), $("#J_PreNav").css({
            display: "-webkit-box",
            right: "-100%",
            "pointer-events": "none"
        }).animate({right: 0}, function () {
            $(this).css({"pointer-events": "auto"})
        }), this.hideDirPack()
    }
}, function () {
    var t = function (t) {
        this.init(t)
    };
    t.prototype = {
        init: function (t) {
            var a = $.extend({
                element: null,
                cssAnimateAttr: {id: "", name: "", duration: 1, count: 1, delay: 0, "function": "linear"}
            }, t || {});
            this.element = a.element, this.cssAnimateAttr = a.cssAnimateAttr, this.nameQueue = this.element.attr("data-animateName") ? this.element.attr("data-animateName").split(" ") : []
        }, addCssAnimate: function (t) {
            var a = this, i = a.cssAnimateAttr.subName || a.cssAnimateAttr.name, e = a.cssAnimateAttr.duration + "s", n = "0" != a.cssAnimateAttr.count ? a.cssAnimateAttr.count : "infinite", o = a.cssAnimateAttr.delay + "s", s = a.cssAnimateAttr.function;
            a.clearCssAnimate(), a.element.css({
                "-webkit-animation-duration": e,
                "animation-duration": e,
                "-webkit-animation-iteration-count": n,
                "animation-iteration-count": n,
                "-webkit-animation-delay": o,
                "animation-delay": o,
                "-webkit-animation-timing-function": s,
                "animation-timing-function": s
            }).addClass("animated").addClass(i).one("webkitAnimationStart animationstart", function (i) {
                i.stopPropagation(), t && t.start && t.start.call(a, a.cssAnimateAttr.id)
            }).one("webkitAnimationIteration animationiteration", function (i) {
                i.stopPropagation(), t && t.iterate && t.iterate.call(a, a.cssAnimateAttr.id)
            }).one("webkitAnimationEnd animationend", function (i) {
                i.stopPropagation(), t && t.end && t.end.call(a, a.cssAnimateAttr.id)
            }), a.nameQueue.push(i), a.element.attr("data-animateName", a.nameQueue.join(" "))
        }, clearCssAnimate: function () {
            this.element.removeClass("animated").removeClass(this.nameQueue.join(" ")).css({
                "-webkit-animation-duration": "",
                "animation-duration": "",
                "-webkit-animation-iteration-count": "",
                "animation-iteration-count": "",
                "-webkit-animation-delay": "",
                "animation-delay": "",
                "-webkit-animation-timing-function": "",
                "animation-timing-function": ""
            }), this.nameQueue = [], this.element.removeAttr("data-animateName")
        }
    }, window.Animate = t
}();
