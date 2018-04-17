///<reference path="./jquery.d.ts"/>
import { Utils } from './utils'

class WFContent {
    restWFUrl:string;
    isFirstTime:boolean = true;
    alias:string;
    localStorageModel:any = {};
    currentStyle:any = {};
    canSaveToIBFS:boolean = false;
    tabs:Array<any> = [];
    swatches:Array<any> = [];

    route:string = "/wfirs";
    prefix:string = "IBFS";

    /*******************/
    /* PUBLIC METHODS  */
    /*******************/
    public constructor(contextPath, WFRel) {
        this.alias = (contextPath !== "") ? contextPath : "/ibi_apps";
        /* overwrite the route and prefix if the wf version is greater that 8.2*/
        //if (WFRel !== undefined)
        //{
        //}
        /*else {
         // NOTE create defaults  for the text object
         }*/
        /* get the url from the parm path */
        this.restWFUrl = Utils.parseParmPath(this.alias, this.route, this.prefix);
    };

    //public signIn():void {
    //    console.log("signing in");
    //}

    public loadContent(): JQueryPromise <any> {
        var deferred: JQueryDeferred<any> = $.Deferred();
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
            if (typeof $res.find("ibfsrpc") !== 'undefined')
            {
                signedIn = ($res.find("ibfsrpc").attr("name") === "signOn");
            }
            console.log(signedIn)
            if ((!signedIn && this.isFirstTime) ||
                (temp !== undefined && temp !== null && temp.length > 0))
            {
                alert("would shouw the login window")
                // NOTE: implement the login window logic
                //showLoginWindow();
                return [];
            } else
            {
                this._successCallBack($res, deferred);
            }
        }.bind(this)).fail(function (jqXHR, textStatus) {
            deferred.resolve(textStatus)
        }.bind(this));

        return deferred.promise();
    }

    public refreshIframe(iframeUrl: string): string{
        var _randTime = ("&RND=" + (new Date()).getTime());
        if(iframeUrl.indexOf("&RND=") > -1){
            /* replace the iframe url */
            return iframeUrl.replace(/&RND=\d*/, _randTime);
        } else {
            return iframeUrl + _randTime;
        }

    }
    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _signInCallback():void {
        //console.log("signin callback");
        //console.log('check again')
    }

    public _successCallBack(data:any, dfd:JQueryDeferred<any>):void {
        var temp = JSON.parse(localStorage.getItem(this.restWFUrl));

        this._retrieveStorageModel().then(function () {
            //NOTE: _getWFPolicy determines wether or not we can save to ibfs
            this.canSaveToIBFS = this._getWFPolicy(data);

            /*TODO: implement processing to populate tabs*/
            var paths = Utils.parseIBFSPathsFromRESTCall(data);
            if (paths.length > 0)
            {

                /* TODO: implement sortPathsFromStorage in utils, adding sortOrder and alphabetic ordering*/
                this.tabs = Utils.buildTabObjects(paths, this.alias, this.route, this.prefix);
                dfd.resolve(this);
            }
        }.bind(this));
    }

    /**
     * load content on the initial load
     * @param contentUrl
     * @private
     */
    private _getWFPolicy(data:any):boolean {
        /* TODO: implement this._getWFPolicy() */
        /*
         * var IBIRS_paths = [];
         * var dataObj = $(data);
         * var rootObject = dataObj.find("rootObject");
         * var policyString = rootObject.attr("policy");
         */
        return false;
    };

    /* NOTE: finish implementing _persistStorageModel*/
    private _persistStorageModel():void {
        this.localStorageModel.style = this.currentStyle;
        //if (this.canSaveToIBFS)
        //{ /*NOTE: implement logic for setting this value*/

        var bodyData = Utils.buildDashboardSaveObject(this.prefix, this.localStorageModel);
        var ibfsPath = this.restWFUrl.match(/.*\?/)[0].replace("?", "/slp.json");
        $.ajax({
            url: ibfsPath,
            method: 'POST',
            data: bodyData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).done(function (response) {
            // NOTE: add funcatiolity for notifying the user about the results
        }).fail(function (err, msg) {
        })

        //}

        // store this item in local storage if it's available
        if (localStorage)
        {
            localStorage.setItem(this.restWFUrl, JSON.stringify(this.localStorageModel));
        }
    }

    private _retrieveStorageModel():JQueryPromise<any> {
        var tmp = JSON.parse(localStorage.getItem(this.restWFUrl));
        if (tmp !== null)
        {
            this.localStorageModel = tmp;
        }

        var ibfsPath = this.restWFUrl.match(/.*\?/)[0].replace("?", "/slp.json?" + this.prefix + "_action=run&");

        return $.get(ibfsPath).done(function (res) {
            if (typeof res.data !== 'undefined' && res.data.hasOwnProperty("sortOrder") && res.data.hasOwnProperty("style"))
            {
                this.localStorageModel = res.data;
            }
            //this._refreshCurrentStyle();
        }.bind(this));
    }

    private _refreshCurrentStyle():any {
        if (this.localStorageModel.style === temp)
        {
            this.currentStyle = this.localStorageModel.style;
            if (this.currentStyle.name.toLowerCase() === "custom")
            {
                var swatch = this.currentStyle;
                var temp = "<style>";
                temp += "." + swatch.name + "{background:" + swatch.normalStyle.background + "; \n color:" + swatch.normalStyle.color + ";}" + "\n";
                temp += "." + swatch.name + " .selected" + "{background:" + swatch.highlightStyle.background + "; \n color:" + swatch.highlightStyle.color + ";}" + "\n";
                temp += "." + swatch.name + " .navigation .image:active" + "{background:" + swatch.highlightStyle.background + "; \n color:" + swatch.highlightStyle.color + ";}" + "\n";
                temp += "</style>";
                jQuery("body").append(temp);
            }
        } else
        {
            /*TODO: set defaults for swatchees*/
            this.currentStyle = this.swatches[0];
        }
    }
}

export default WFContent;