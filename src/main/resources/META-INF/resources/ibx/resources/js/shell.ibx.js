/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

/*****************************************************************************/
/* ibxShellApp - container for ibxShellTools */
/*****************************************************************************/
function ibxShellApp(manifest)
{
	if(window._ibxShellApp)
		return window._ibxShellApp;

	this.manifest = manifest
	window.addEventListener("message", this._onToolMessage.bind(this));

	window._ibxShellApp = this;
	window.getIbxShellApp = function(){return window._ibxShellApp};
}
var _p = ibxShellApp.prototype = new Object();
ibxShellApp.idTool = 0;
ibxShellApp.tools = {};

_p._onToolMessage = function(e)
{
	var mType = e.data.type;
	if(mType == ibxShellTool.msgToolLoaded)
	{
		var toolInfo = ibxShellApp.tools[e.data.id];
		var host = toolInfo.host;
		if(toolInfo.manifest.host == "iframe")
		{
			var wnd = host.contentWindow;
			var tool = toolInfo.tool = wnd.getIbxShellTool();
			toolInfo.createDeferred.resolve(toolInfo);
		}
	}
	else
	if(mType == ibxShellTool.msgActivate)
		this.activateTool(e.data.id, e.data.activate, e.data.updateUI, e.data.data);
	else
	if(mType == ibxShellTool.msgUpdateUI)
		this.updateToolUI(e.data.id, e.data.data);
};

_p.createTool = function(tType)
{
	var manifest = this.manifest[tType];
	if(!manifest)
		return console.error("[ibxShellApp] No registered ibxShellTool type: " + tType);

	var tool = null;
	var toolId = sformat("idShellTool{1}", ++ibxShellApp.idTool);
	if(manifest.host == "iframe")
		tool = $("<iframe tabindex='-1' class='ibx-shell-tool-frame'>").prop("src", manifest.src + "?ibxShellToolId=" + toolId)[0];

	tool = ibxShellApp.tools[toolId] = {"id":toolId, "host":tool, "manifest":manifest, "createDeferred":new $.Deferred()};
	return tool;
};

_p.activateTool = function(id, activate, updateUI, data)
{
	var toolInfo = ibxShellApp.tools[id];
	activate ? toolInfo.host.focus() : toolInfo.host.blur();
	if(updateUI)
		this.updateToolUI(id, data);
};

_p.updateToolUI = function(id, data)
{
	/*DO SOMETHING*/
};

/*****************************************************************************/
/* ibxShellTool - plugin for ibx shell application */
/*****************************************************************************/
function ibxShellTool(id, resources)
{
	if(window._ibxShellTool)
		return window._ibxShellTool;

	this._id = id;
	this._resources = (typeof(resources) == "string") ? ibx.resourceMgr.getResource(resources, false) : resources;
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
_p.getResources = function(jqShell, data)
{
	var curjQuery = window.jQuery;
	window.jQuery = window.$ = jqShell;
	var event = $(window).dispatchEvent(ibxShellTool.msgGetShellToolResources, data, true, false);
	window.jQuery = window.$ = curjQuery;
	this.resources = event.data;
	return event.data;
};
_p._onAppLoaded = function()
{
	window.parent.postMessage({"type":ibxShellTool.msgToolLoaded, "id":this._id}, "*");
};
_p.activate = function(activate, updateUI, data)
{
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

