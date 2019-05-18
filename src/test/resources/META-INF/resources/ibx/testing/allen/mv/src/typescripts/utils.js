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
        if (IBIRS_paths.length == 0) {
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
export { Utils };
