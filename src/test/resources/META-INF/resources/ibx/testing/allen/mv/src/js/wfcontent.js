var WFContent = (function () {
'use strict';

var Utils;
(function (Utils) {
    function parseParmPath(alias, webServiceRoute, webServiceParmPrefix) {
        var vars = {};
        vars["path"] = "";
        var path = window.location.href.replace("#", "");
        console.log(path);
        var splitIndex = path.indexOf("?");
        var hashes = path.slice(splitIndex + 1).split("&");
        hashes.map(function (hash, index) {
            var hashVals = hash.split("=");
            vars[hashVals[0]] = hashVals[1];
        });
        var returnURL = alias + webServiceRoute + "/ibfs/WFC/Repository/Public?" + webServiceParmPrefix + "_action=get&";
        var pathStub = (splitIndex > 0) ? path.substring(0, splitIndex) : path;
        if (pathStub.indexOf("/mobile/") > 0 || pathStub.indexOf("/m/") > 0) {
            returnURL = returnURL.replace("/Repository/Public", "/UserInfo/%23%23%7BWF_PersonalFolder%7D/MobileFavorites");
        }
        else if (vars["path"] !== "") {
            returnURL = returnURL.replace("Public", vars["path"]);
        }
        else if (pathStub.toLowerCase().indexOf(alias + "/pmf") !== -1) {
            returnURL = returnURL.replace("/Public", "/PMF");
            jQuery("title")
                .html("PMF");
        }
        else if ((pathStub.indexOf("slp.htm") !== -1 || pathStub.indexOf("mv.htm") !== -1) && pathStub.indexOf("slp.template.html") !== -1) {
            if (pathStub.indexOf("/slp") !== -1) {
                pathStub = pathStub.slice(pathStub.indexOf("slp") + 3);
            }
            else if (pathStub.indexOf("/mv")) {
                pathStub = pathStub.slice(pathStub.indexOf("mv") + 2);
            }
            else if (pathStub.indexOf("/p/")) {
                pathStub = pathStub.slice(pathStub.indexOf("/p/") + 2);
            }
            if (pathStub.length > 1) {
                if (pathStub.indexOf("IBFS:/") == 1) {
                    returnURL = returnURL.replace("WFC/Repository/Public", pathStub.substring(6));
                }
                else {
                    returnURL = returnURL.replace("/Public", pathStub);
                }
                jQuery("title")
                    .html(path);
            }
        }
        return returnURL;
    }
    Utils.parseParmPath = parseParmPath;
    function buildDashboardSaveObject(prefix, localStorageModelJSON) {
        var body = "<rootObject _jt='IBFSMRObject' description='slp.json' type='IBFSFile'><content _jt='IBFSByteContent' char_set='UTF-8'>";
        body += btoa(localStorageModelJSON);
        body += "</content><properties size='1'><entry key='hidden' /></properties></rootObject>";
        var returnStr = prefix + "_private=false&" + prefix + "_action=put&" + prefix + "_object=" + encodeURIComponent(body);
        return returnStr;
    }
    Utils.buildDashboardSaveObject = buildDashboardSaveObject;
    function parseIBFSPathsFromRESTCall(data) {
        var IBIRS_paths = [];
        var dataObj = $(data);
        var rootObject = dataObj.find("rootObject");
        var items = rootObject.find("children").children();
        for (var i = 0; i < items.length; i++) {
            var obj = jQuery(items[i]);
            var attr = obj.attr("type");
            var desc = obj.attr("description");
            var srtOrder = parseInt(obj.attr("srtorder"));
            if (isNaN(srtOrder)) {
                srtOrder = 0;
            }
            if (obj.find("properties").find("entry[key=hidden]").length == 0) {
                if (attr == "FexFile" || attr == "IBFSFile" || attr == "HtmlFile" || attr == "URLFile" || attr == "LinkItem" || attr == "PGXBundle") {
                    IBIRS_paths.push({
                        "IBFS_Path": obj.attr("fullPath").replace("IBFS:/", ""),
                        "name": desc,
                        "srtOrder": srtOrder
                    });
                }
                else {
                    console.error(desc + " Unknown file Type: " + attr);
                }
            }
            else {
            }
        }
        return IBIRS_paths;
    }
    Utils.parseIBFSPathsFromRESTCall = parseIBFSPathsFromRESTCall;
    function buildTabObjects(paths, alias, webServiceRoute, webServiceParmPrefix) {
        var tabs = [];
        var hrefStub = alias + webServiceRoute + "?" + webServiceParmPrefix + "_action=run&" + webServiceParmPrefix + "_service=ibfs&" + webServiceParmPrefix + "_path=";
        for (var i = 0; i < paths.length; i++) {
            var title = '';
            if (paths[i].name.indexOf('.fromPMF') > -1) {
                title = paths[i].name.split('.fromPMF')[0];
            }
            else {
                title = paths[i].name;
            }
            var _tempRefName = paths[i].IBFS_Path.split("/");
            var tabObject = {
                title: title,
                href: hrefStub + paths[i].IBFS_Path,
                id: i,
                sortOrder: (isNaN(paths[i].srtOrder)) ? 0 : paths[i].srtOrder,
                IBFS_Path: paths[i].IBFS_Path,
                referenceName: _tempRefName[_tempRefName.length - 1].split('.')[0],
                highlightStyle: {}
            };
            tabs.push(tabObject);
        }
        return tabs;
    }
    Utils.buildTabObjects = buildTabObjects;
})(Utils || (Utils = {}));

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
            if ((signedIn && this.isFirstTime) ||
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

return WFContent;

}());
