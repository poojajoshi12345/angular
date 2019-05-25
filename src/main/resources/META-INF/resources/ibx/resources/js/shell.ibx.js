/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

/*****************************************************************************/
/* ibxShellApp - container for ibxShellTools */
/*****************************************************************************/
function ibxShellApp(config)
{
	if(window._ibxShellApp)
		return window._ibxShellApp;

	this.config = config || {};
	this.runningTools = {};
	window._ibxShellApp = this;
	window.getIbxShellApp = function(){return window._ibxShellApp};
	window.addEventListener("message", this._onToolMessage.bind(this));
}
var _p = ibxShellApp.prototype = new Object();
ibxShellApp.msgActivateTool = "ibx_activatetool";
ibxShellApp.msgUpdateToolUI = "ibx_updatetoolui";
ibxShellApp.idTool = 0;

_p._onToolMessage = function(e)
{
	var mType = e.data.type;
	if(mType == ibxShellTool.msgToolLoaded)
	{
		var toolInfo = this.runningTools[e.data.id];
		var host = toolInfo.host;
		if($(toolInfo.host).is("iframe"))
		{
			var wnd = host.contentWindow;
			toolInfo.tool = wnd.getIbxShellTool();
			toolInfo.createDeferred.resolve(toolInfo);
		}
	}
	else
	if(mType == ibxShellTool.msgActivate)
		this.activateTool(e.data);
	else
	if(mType == ibxShellTool.msgUpdateUI)
		this.updateToolUI(e.data);
};

_p.config = null;
_p.runningTools = null;
_p.createTool = function(tType)
{
	var tool = this.config.tools[tType];
	if(!tool)
		return console.error("[ibxShellApp] No registered ibxShellTool type: " + tType);

	var host = null;
	var toolId = sformat("idShellTool{1}", ++ibxShellApp.idTool);
	if(tool.host == "iframe")
		host = $("<iframe tabindex='-1' class='ibx-shell-tool-frame'>").prop("src", tool.src + "?ibxShellToolId=" + toolId)[0];

	var toolInfo = this.runningTools[toolId] = {"id":toolId, "type":tType, "host":host, "createDeferred":new $.Deferred()};
	return toolInfo;
};

_p.activateTool = function(activateInfo)
{
	var event = $(window).dispatchEvent(ibxShellApp.msgActivateTool, activateInfo, true, false);
	if(activateInfo.updateUI)
		this.updateToolUI(activateInfo);
};

_p.updateToolUI = function(updateInfo)
{
	var event = $(window).dispatchEvent(ibxShellApp.msgUpdateToolUI, updateInfo, true, false);
};

/*****************************************************************************/
/* ibxShellTool - plugin for ibx shell application */
/*****************************************************************************/
function ibxShellTool(id)
{
	if(window._ibxShellTool)
		return window._ibxShellTool;

	this._id = id;
	ibx(this._onAppLoaded.bind(this));

	window._ibxShellTool = this;
	window.getIbxShellTool = function(){return window._ibxShellTool};
}
var _p = ibxShellTool.prototype = new Object();
ibxShellTool.msgToolLoaded = "ibx_shelltoolloaded";
ibxShellTool.msgGetShellToolResources = "ibx_shelltoolbindresources";
ibxShellTool.msgActivate = "ibx_shelltoolactivate";
ibxShellTool.msgUpdateUI = "ibx_shelltoolupdateui";
ibxShellTool.msgSerialize = "ibx_shelltoolserialize";

_p._id = null;
_p.resources = null;
_p.getResources = function(jqShell, shellUI, data)
{
	var curjQuery = window.jQuery;
	window.jQuery = window.$ = jqShell;
	var event = $(window).dispatchEvent(ibxShellTool.msgGetShellToolResources, {"shellUI":shellUI, "data":data}, true, false);
	window.jQuery = window.$ = curjQuery;
	this.shellUI = (event.data.shellUI || shellUI);
	return shellUI;
};
_p._onAppLoaded = function()
{
	window.parent.postMessage({"type":ibxShellTool.msgToolLoaded, "id":this._id}, "*");
};
_p.activate = function(activate, updateUI, data)
{
	updateUI = (updateUI != undefined) ? updateUI : activate;
	window.parent.postMessage({"type":ibxShellTool.msgActivate, "id":this._id, "activate":activate, "updateUI":updateUI, "data":data}, "*");
};
_p.updateUI = function(data)
{
	window.parent.postMessage({"type":ibxShellTool.msgUpdateUI, "id":this._id, "data":data}, "*");
};
_p.serialize = function(read, data)
{
	var event = $(window).dispatchEvent(ibxShellTool.msgSerialize, {"read":read, "data":data}, true, false);
	return !read ? event.data : this;
};

//# sourceURL=shell.ibx.js

