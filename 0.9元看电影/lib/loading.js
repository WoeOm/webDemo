
var imageLoad = new ImageLoad, $loading = $("#loading"), _attr = $loading.attr("data-loading"), base = {
    w: 640,
    h: 1008
}, _w = $(window).width(), _h = $(window).height(), _maxScale = _h >= _w ? Math.max(_w / base.w, _h / base.h) : Math.min(_w / base.w, _h / base.h), _minScale = Math.min(_w / base.w, _h / base.h);
$(".loading-effect").css({"-webkit-transform": "scale(" + _minScale + ")"}).show(), imageLoad.queueImage(loadImgArr).preLoad(function (a) {
    if (_attr) {
        var e = $.parseJSON(_attr);
        "default" == e.mode || "0" == e.effect ? ($loading.find(".progress_text span").html(a + "%"), $loading.find(".progress_bar span").css({width: a + "%"})) : ("1" == e.effect || "2" == e.effect) && ($loading.find(".progress_text").html(a + "%"), 50 >= a ? ($loading.find(".circle2").css({
            "-webkit-transform": "rotate(" + 3.6 * a + "deg)",
            transform: "rotate(" + 3.6 * a + "deg)"
        }), $loading.find(".circle4").css("display", "none")) : ($loading.find(".circle2").css({
            "-webkit-transform": "rotate(180deg)",
            transform: "rotate(180deg)"
        }), $loading.find(".circle4").css({
            display: "block",
            "-webkit-transform": "rotate(" + 3.6 * (a - 50) + "deg)",
            transform: "rotate(" + 3.6 * (a - 50) + "deg)"
        })))
    } else $loading.find(".progress span").html(a + "%"), $loading.find(".progress_bar span").css({width: a + "%"})
}, function () {
    $loading.remove();
    var a = new Main, e = {
        getLen: function () {
            return a.pageLen
        }, getPageChangeData: function () {
            return a.pageChangeData
        }, getFlag: function () {
            return a.flag
        }, getCurPage: function () {
            return a.curPage
        }, setCurPage: function (e) {
            a.curPage = e
        }, gotoPage: function (e, n, t) {
            a.gotoPage(e, n, t)
        }, curPageEventHandle: function () {
            a.curPageEventHandle()
        }, adapter: function (e, n) {
            a.adapter(e, n)
        }
    };
    "undefined" != typeof parent.PREVIEW_CUR_PAGE && (e.setCurPage(parent.PREVIEW_CUR_PAGE), e.curPageEventHandle()), window.mainExport = e, parent.LOADING_SUC && parent.LOADING_SUC(), this.loadImages()
});
