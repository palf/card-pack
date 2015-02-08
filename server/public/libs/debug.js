var Example = Example || {};
Example.Analytics = Example.Analytics || {};
var _gaq = _gaq || [];
Example.Analytics.isDebug = window.location.href.match(/\?debug$/);
$(function () {
    if (Example.Analytics.isDebug) {
        $("#debug").show();
    }
});
Example.Analytics.push = function () {
    _gaq.push.apply(_gaq, arguments);
    if (Example.Analytics.isDebug) {
        var args = arguments[0];
        $(function () {
            var li = $("<li/>").text(JSON.stringify(args));
            $("#debug ol").append(li);
        });
    }
};
Example.Analytics.push(['_setAccount', 'UA-INVALID']);
Example.Analytics.push(['_setDomainName', document.domain]);
Example.Analytics.push(['_setAllowLinker', true]);

Example.Analytics.push(['_trackEvent', 'Contract', 'scrollToEnd', 'landLine']);

