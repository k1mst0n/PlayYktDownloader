// ==UserScript==
// @name Play.Ykt.Ru Video Downloader
// @description Extension detects video from http://play.ykt.ru service on the page and shows a download link.
// @namespace k1mst0n.ru
// @author k1mst0n
// @license MIT
// @version 1.2
// @include http://joker.ykt.ru/ http://kinocenter.ykt.ru/
// @match http://joker.ykt.ru/ http://kinocenter.ykt.ru/
// ==/UserScript==
(function (window, undefined) {
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }

    if (w.self != w.top) {
        return;
    }

    if (/http:\/\/joker.ykt.ru/.test(w.location.href) || /http:\/\/kinocenter.ykt.ru/.test(w.location.href)) {
        var readyStateCheckInterval = setInterval(function () {
            if (document.readyState == "complete") {
                generateLinks();
                clearInterval(readyStateCheckInterval);
            }
        }, 10);
    }

    function addVideoLinkStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.video-link-container { margin: 1em 0 0; } .video-link-container > .video-link { display: block; padding: 0.5em; line-height: 20px; color: #333333; border: 1px solid #cccccc; border-color: #e6e6e6 #e6e6e6 #bfbfbf; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05); font-size: 14px; background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(0%, #ffffff), color-stop(100%, #e6e6e6)); width: 20%; border-radius: 5px; margin: 0 38%; text-decoration: none; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); cursor: pointer; } .video-link:hover { background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(0%, #ffffff), color-stop(100%, #dfdfdf)); }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function getDownloadVideoLinkElement(href, width, position) {
        var container = document.createElement('div');
        if (position == 'center')
            container.style.width = '100%';
        else
            container.style.width = width;
        container.className = 'video-link-container';
        var element = document.createElement('a');
        element.className = 'video-link';
        element.href = href;
        element.title = 'Скачать видео ' + document.title;
        element.innerHTML = 'Скачать видео';
        container.appendChild(element);
        return container;
    }

    function generateLinks() {
        var embeds = document.getElementsByTagName('embed');
        var videos = document.getElementsByTagName('video');
        if (embeds.length > 0 || videos.length > 0)
            addVideoLinkStyle();
        for (var i = 0; i < embeds.length; i++) {
            var flashvars = embeds[i].attributes['flashvars'];
            if (flashvars != undefined) {
                flashvars = flashvars.value;
                var startIndex = flashvars.indexOf('file=');
                if (startIndex != -1) {
                    flashvars = flashvars.substring(5 + startIndex);
                    var endIndex = flashvars.indexOf('&');
                    if (endIndex != -1) {
                        flashvars = flashvars.substring(0, endIndex);
                        var width = embeds[i].attributes['width'].value;
                        var parent = embeds[i].parentNode;
                        var parentPosition = parent.style.textAlign;
                        parent.insertBefore(getDownloadVideoLinkElement(flashvars, width, parentPosition), embeds[i].nextSibling);
                    }
                }
            }
        }
        for (var i = 0; i < videos.length; i++) {
            for (var child in videos[i].childNodes) {
                var object = videos[i].childNodes[child];
                if (object.tagName == 'SOURCE') {
                    var src = object.attributes['src'].value;
                    if (src != undefined) {
                        var parent = videos[i].parentNode;
                        var parentPosition = parent.style.textAlign;
                        parent.insertBefore(getDownloadVideoLinkElement(src, '640px', parentPosition), videos[i].nextSibling);
                    }
                }
            }
        }
    }
})(window);