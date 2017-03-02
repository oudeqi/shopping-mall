(function(win,doc){
    var docEl = document.documentElement,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        dpr = win.devicePixelRatio;
        recalc = function() {
            var cw = docEl.clientWidth>750 ? 750 : docEl.clientWidth;
            docEl.style.fontSize = (cw / 7.5)*dpr + 'px';
        };
        console.log(docEl.clientWidth);
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window,document);
