/**
 * Created by aw14286 on 11/29/2017.
 */


namespace Utils {
    interface LocalStorageModel {
        sortOrder?: number,
        style?: string
    }

    /**
     * shape of the objects that will be used by the sidebar
     * @see _loadContent in wfcontent.ts
     */
    interface TabObject {
        title: string,
        href: string,
        id: number,
        sortOrder: number,
        IBFS_Path: string,
        referenceName: string,
        highlightStyle: any
    }

    export function parseParmPath(alias:string, webServiceRoute:string, webServiceParmPrefix:string):string {
        var vars = {};
        vars["path"] = "";
        var path = window.location.href.replace("#", "");
console.log(path)
        /*grab parameters from the url in the url*/
        var splitIndex = path.indexOf("?");
        var hashes = path.slice(splitIndex + 1).split("&");
        hashes.map(function (hash, index) {
            var hashVals = hash.split("=");
            vars[hashVals[0]] = hashVals[1];
        });

        var returnURL:string = alias + webServiceRoute + "/ibfs/WFC/Repository/Public?" + webServiceParmPrefix + "_action=get&";
        var pathStub:string = (splitIndex > 0) ? path.substring(0, splitIndex) : path;

        if (pathStub.indexOf("/mobile/") > 0 || pathStub.indexOf("/m/") > 0)
        { /*processing for mobile viewer*/
            returnURL = returnURL.replace(
                "/Repository/Public",
                "/UserInfo/%23%23%7BWF_PersonalFolder%7D/MobileFavorites"
            );
        }
        else if (vars["path"] !== "")
        { /*default processing*/
            returnURL = returnURL.replace("Public", vars["path"]);
            /*TODO : add functionality to change the title to match the path*/
        }
        else if (pathStub.toLowerCase().indexOf(alias + "/pmf") !== -1)
        { /*special processing for pmf */
            returnURL = returnURL.replace("/Public", "/PMF");
            jQuery("title")
                .html("PMF");
        }
        else if ((pathStub.indexOf("slp.htm") !== -1 || pathStub.indexOf("mv.htm") !== -1) && pathStub.indexOf("slp.template.html") !== -1)
        { /*processing for static files */
            if (pathStub.indexOf("/slp") !== -1)
            {
                pathStub = pathStub.slice(pathStub.indexOf("slp") + 3);
            } else if (pathStub.indexOf("/mv"))
            {
                pathStub = pathStub.slice(pathStub.indexOf("mv") + 2);
            } else if (pathStub.indexOf("/p/"))
            {
                pathStub = pathStub.slice(pathStub.indexOf("/p/") + 2);
            }

            /**/
            if (pathStub.length > 1)
            {
                if (pathStub.indexOf("IBFS:/") == 1)
                {
                    returnURL = returnURL.replace(
                        "WFC/Repository/Public",
                        pathStub.substring(6)
                    );
                } else
                {
                    returnURL = returnURL.replace("/Public", pathStub);
                }
                jQuery("title")
                    .html(path);
            }
        }

        return returnURL;
    }

    /**
     * builds uri-encoded call to save dashboard model
     * @see {@link persistStorageModel}
     * @param prefix
     * @param localStorageModelJSON
     * @returns {string}
     */
    export function buildDashboardSaveObject(prefix:string, localStorageModelJSON:string):string {
        var body = "<rootObject _jt='IBFSMRObject' description='slp.json' type='IBFSFile'><content _jt='IBFSByteContent' char_set='UTF-8'>";
        body += btoa(localStorageModelJSON);
        body += "</content><properties size='1'><entry key='hidden' /></properties></rootObject>";
        var returnStr = prefix + "_private=false&" + prefix + "_action=put&" + prefix + "_object=" + encodeURIComponent(body);
        return returnStr;
    }

    export function parseIBFSPathsFromRESTCall(data) {
        var IBIRS_paths = [];
        var dataObj = $(data);
        var rootObject = dataObj.find("rootObject");

        var items = rootObject.find("children").children();
        for (var i = 0; i < items.length; i++)
        {
            var obj = jQuery(items[i]);
            var attr = obj.attr("type");
            var desc = obj.attr("description");
            var srtOrder = parseInt(obj.attr("srtorder"));
            if (isNaN(srtOrder))
            {
                srtOrder = 0;
            }
            if (obj.find("properties").find("entry[key=hidden]").length == 0)
            {
                if (attr == "FexFile" || attr == "IBFSFile" || attr == "HtmlFile" || attr == "URLFile" || attr == "LinkItem" || attr == "PGXBundle")
                {
                    IBIRS_paths.push({
                        "IBFS_Path": obj.attr("fullPath").replace("IBFS:/", ""),
                        "name": desc,
                        "srtOrder": srtOrder
                    });
                } else
                {
                    console.error(desc + " Unknown file Type: " + attr);
                }
            } else
            {
                //console.info("Object hidden in IBFS properties: " + desc);
            }
        }
        //NOTE: IE login bug breaks here
        if (IBIRS_paths.length == 0)
        {
            /* note: i'M NOT sure what this does:  return to it later */
            //alert(decodeEntities(txtNoContentFound));
        }
        return IBIRS_paths;
    }

    /**
     * builds and reattunjs the tabobjects for the WFContent class
     * @param paths
     * @param alias
     * @param webServiceRoute
     * @param webServiceParmPrefix
     */
    export function buildTabObjects(paths: Array<any>,alias:string, webServiceRoute:string, webServiceParmPrefix:string ): Array<TabObject>{
        var tabs: Array<TabObject> = [];
        var hrefStub: string = alias + webServiceRoute + "?" + webServiceParmPrefix + "_action=run&" + webServiceParmPrefix + "_service=ibfs&" + webServiceParmPrefix + "_path=" ;
        for (var i = 0; i < paths.length; i++) {
            // set the title var
            var title = '';
            if(paths[i].name.indexOf('.fromPMF') > -1) {
                title = paths[i].name.split('.fromPMF')[0];
            } else {
                title = paths[i].name;
            }

            var _tempRefName = paths[i].IBFS_Path.split("/");

            let tabObject: TabObject = {
                title: title,
                href: hrefStub + paths[i].IBFS_Path,
                id: i,
                sortOrder: (isNaN(paths[i].srtOrder))? 0 : paths[i].srtOrder,
                IBFS_Path: paths[i].IBFS_Path,
                referenceName: _tempRefName[_tempRefName.length - 1].split('.')[0],
                highlightStyle: {}
            }
            tabs.push(tabObject);
        }
        return tabs;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/
}

export {Utils}