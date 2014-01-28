function Domis86WebDebugDialogLoaderClass() {
    this.isJQueryUILoaded = false;
    this.isDataTablesLoaded = false;
    this.isJeditableLoaded = false;

    var that = this;

    this.startInit = function () {
        yepnope({
            test: (typeof jQuery !== 'undefined'),
            nope: document.getElementById('domis86_data_for_loadwebdebugdialogjs').getAttribute("data-asset_jquery_url"),
            complete: function () {
                consoleLog('jQuery loaded!');
                jQuery(document).ready(function () {
                    loadLibs();
                });
            }
        });
    };

    function loadLibs() {
        // TODO: pass asset urls as parameters from symfony

        // Now we load libraries if necessary
        // They are loaded asynchronously, so its potentially faster than loading "one after another"

        var assets = jQuery('#domis86_data_for_loadwebdebugdialogjs');

        that.isJQueryUILoaded = (typeof jQuery.ui !== 'undefined');
        yepnope({
            test: that.isJQueryUILoaded,
            nope: [assets.data('asset_jquery_ui_css_url'), assets.data('asset_jquery_ui_url')],
            complete: function () {
                that.isJQueryUILoaded = true;
                consoleLog('jQueryUI loaded!');
            }
        });

        that.isDataTablesLoaded = (typeof jQuery.fn.DataTable !== 'undefined');
        yepnope({
            test: that.isDataTablesLoaded,
            nope: [assets.data('asset_datatables_css_url'), assets.data('asset_datatables_url')],
            complete: function () {
                that.isDataTablesLoaded = true;
                consoleLog('DataTables loaded!');
            }
        });

        that.isJeditableLoaded = (typeof jQuery.fn.editable !== 'undefined');
        yepnope({
            test: that.isJeditableLoaded,
            nope: [assets.data('asset_jeditable_url')],
            complete: function () {
                that.isJeditableLoaded = true;
                consoleLog('Jeditable loaded!!');
            }
        });

        yepnope({
            test: false,
            nope: [assets.data('asset_webdebugdialog_url')],
            complete: function () {
                consoleLog('webDebugDialog.js loaded!!');
                that.tryToInitTranslatorDataCollector();
            }
        });
    }

    this.tryToInitTranslatorDataCollector = function () {
        var domis86_web_debug_dialog_container = jQuery('#domis86_web_debug_dialog_container');
        var isToolbarLoaded = false;
        var isDialogContainerLoaded = (domis86_web_debug_dialog_container.length > 0);

        if (isDialogContainerLoaded && this.isJQueryUILoaded && this.isDataTablesLoaded && this.isJeditableLoaded) {
            var backendMode = false;
            if ('on' === domis86_web_debug_dialog_container.data('backend_mode')) {
                backendMode = true;
            }

            isToolbarLoaded = (jQuery('.domis86_web_debug_dialog_toolbar_icon_img_edit').length > 0);
            if (isToolbarLoaded || backendMode) {
                // everything is loaded --> go!
                var domis86WebDebugDialog = new Domis86WebDebugDialogClass(backendMode);
                domis86WebDebugDialog.prepare();
                return true;
            }
        }

        consoleLog('Domis86WebDebugDialog requirements are not loaded yet...');
        setTimeout(function tryToInitTranslatorDataCollectorTimeoutCallback() {
            that.tryToInitTranslatorDataCollector();
        }, 200);
        return false;
    };
}

includeYepnopeJs();
var domis86WebDebugDialogLoader = new Domis86WebDebugDialogLoaderClass();
domis86WebDebugDialogLoader.startInit();


function consoleLog(x) {
    if (typeof console === 'undefined') {
        return false;
    }
    console.log(x);
    return true;
}

function includeYepnopeJs() {
    if (typeof yepnope !== 'undefined') {
        return;
    }
    // yepnope.js
    // Version - 1.5.4pre
    //
    // by
    // Alex Sexton - @SlexAxton - AlexSexton[at]gmail.com
    // Ralph Holzmann - @ralphholzmann - ralphholzmann[at]gmail.com
    //
    // http://yepnopejs.com/
    // https://github.com/SlexAxton/yepnope.js/
    //
    // Tri-license - WTFPL | MIT | BSD

    /*yepnope1.5.x|WTFPL*/
    (function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);

}
