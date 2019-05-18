import { Utils } from './utils';
var WFContent = (function () {
    function WFContent(contextPath, WFRel) {
        this.isFirstTime = true;
        this.localStorageModel = {};
        this.currentStyle = {};
        this.canSaveToIBFS = false;
        this.tabs = [];
        this.swatches = [];
        this.route = "/wfirs";
        this.prefix = "IBFS";
        this.alias = (contextPath !== "") ? contextPath : "/ibi_apps";
        this.restWFUrl = Utils.parseParmPath(this.alias, this.route, this.prefix);
    }
    ;
    WFContent.prototype.loadContent = function () {
        var deferred = $.Deferred();
        $.ajax({
            url: this.restWFUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        }).done(function (response) {
            var $res = $(response);
            var temp = $res.find("html");
            var signedIn = false;
            if (typeof $res.find("ibfsrpc") !== 'undefined') {
                signedIn = ($res.find("ibfsrpc").attr("name") === "signOn");
            }
            console.log(signedIn);
            if ((!signedIn && this.isFirstTime) ||
                (temp !== undefined && temp !== null && temp.length > 0)) {
                alert("would shouw the login window");
                return [];
            }
            else {
                this._successCallBack($res, deferred);
            }
        }.bind(this)).fail(function (jqXHR, textStatus) {
            deferred.resolve(textStatus);
        }.bind(this));
        return deferred.promise();
    };
    WFContent.prototype.refreshIframe = function (iframeUrl) {
        var _randTime = ("&RND=" + (new Date()).getTime());
        if (iframeUrl.indexOf("&RND=") > -1) {
            return iframeUrl.replace(/&RND=\d*/, _randTime);
        }
        else {
            return iframeUrl + _randTime;
        }
    };
    WFContent.prototype._signInCallback = function () {
    };
    WFContent.prototype._successCallBack = function (data, dfd) {
        var temp = JSON.parse(localStorage.getItem(this.restWFUrl));
        this._retrieveStorageModel().then(function () {
            this.canSaveToIBFS = this._getWFPolicy(data);
            var paths = Utils.parseIBFSPathsFromRESTCall(data);
            if (paths.length > 0) {
                this.tabs = Utils.buildTabObjects(paths, this.alias, this.route, this.prefix);
                dfd.resolve(this);
            }
        }.bind(this));
    };
    WFContent.prototype._getWFPolicy = function (data) {
        return false;
    };
    ;
    WFContent.prototype._persistStorageModel = function () {
        this.localStorageModel.style = this.currentStyle;
        var bodyData = Utils.buildDashboardSaveObject(this.prefix, this.localStorageModel);
        var ibfsPath = this.restWFUrl.match(/.*\?/)[0].replace("?", "/slp.json");
        $.ajax({
            url: ibfsPath,
            method: 'POST',
            data: bodyData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).done(function (response) {
        }).fail(function (err, msg) {
        });
        if (localStorage) {
            localStorage.setItem(this.restWFUrl, JSON.stringify(this.localStorageModel));
        }
    };
    WFContent.prototype._retrieveStorageModel = function () {
        var tmp = JSON.parse(localStorage.getItem(this.restWFUrl));
        if (tmp !== null) {
            this.localStorageModel = tmp;
        }
        var ibfsPath = this.restWFUrl.match(/.*\?/)[0].replace("?", "/slp.json?" + this.prefix + "_action=run&");
        return $.get(ibfsPath).done(function (res) {
            if (typeof res.data !== 'undefined' && res.data.hasOwnProperty("sortOrder") && res.data.hasOwnProperty("style")) {
                this.localStorageModel = res.data;
            }
        }.bind(this));
    };
    WFContent.prototype._refreshCurrentStyle = function () {
        if (this.localStorageModel.style === temp) {
            this.currentStyle = this.localStorageModel.style;
            if (this.currentStyle.name.toLowerCase() === "custom") {
                var swatch = this.currentStyle;
                var temp = "<style>";
                temp += "." + swatch.name + "{background:" + swatch.normalStyle.background + "; \n color:" + swatch.normalStyle.color + ";}" + "\n";
                temp += "." + swatch.name + " .selected" + "{background:" + swatch.highlightStyle.background + "; \n color:" + swatch.highlightStyle.color + ";}" + "\n";
                temp += "." + swatch.name + " .navigation .image:active" + "{background:" + swatch.highlightStyle.background + "; \n color:" + swatch.highlightStyle.color + ";}" + "\n";
                temp += "</style>";
                jQuery("body").append(temp);
            }
        }
        else {
            this.currentStyle = this.swatches[0];
        }
    };
    return WFContent;
}());
export default WFContent;
