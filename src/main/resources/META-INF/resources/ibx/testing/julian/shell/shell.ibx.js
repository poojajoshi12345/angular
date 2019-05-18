/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.6 $:

/*****************************************************************************/
/* ibxShellApp - container for ibxShellTools */
/*****************************************************************************/
function ibxShellApp(manifest)
{
	this.manifest = manifest
	window.addEventListener("message", this._onToolMessage.bind(this));
}
var _p = ibxShellApp.prototype = new Object();
ibxShellApp.mTypeToolLoaded = "ibx_shelltoolloaded";
ibxShellApp.mTypeToolActivate = "ibx_shelltoolactivate";
ibxShellApp.mTypeBindShellToolResources = "ibx_bindshelltoolresources";
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
			toolInfo.ui = tool.getResources(jQuery);
			toolInfo.createDeferred.resolve();
		}
	}
	else
	if(mType == ibxShellTool.msgActivateShellTool)
	{
		var toolInfo = ibxShellApp.tools[e.data.id];
		toolInfo.host.focus();
		if(e.data.updateUI)
			toolInfo.tool.getResources(jQuery, e.data.data);
	}
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

/*****************************************************************************/
/* ibxShellTool - plugin for ibx shell application */
/*****************************************************************************/
function ibxShellTool(id, resources)
{
	this._id = id;
	this._resources = (typeof(resources) == "string") ? ibx.resourceMgr.getResource(resources, false) : resources;
	ibx(this._onAppLoaded.bind(this));
	window.getIbxShellTool = function(){return this}.bind(this);
}
var _p = ibxShellTool.prototype = new Object();
ibxShellTool.msgToolLoaded = "ibx_shelltoolloaded";
ibxShellTool.msgGetShellToolResources = "ibx_shelltoolbindresources";
ibxShellTool.msgActivateShellTool = "ibx_shelltoolactivate";
ibxShellTool.msgSerialize = "ibx_shelltoolserialize";

_p._id = null;
_p._onAppLoaded = function()
{
	window.parent.postMessage({"type":ibxShellTool.msgToolLoaded, "id":this._id}, "*");
}
_p.getResources = function(jqShell, data)
{
	//have to create widgets in context of shell.
	var curjQuery = window.jQuery;
	window.jQuery = window.$ = jqShell;
	var event = $(window).dispatchEvent(ibxShellTool.msgGetShellToolResources, data, true, false);
	window.jQuery = window.$ = curjQuery;
	this.resources = event.data;
	return event.data;
};
_p.activate = function(activate, updateUI, data)
{
	window.parent.postMessage({"type":ibxShellTool.msgActivateShellTool, "id":this._id, "activate":activate, "updateUI":updateUI, "data":data}, "*");
};
_p.serialize = function(read, data)
{
	var event = $(window).dispatchEvent(ibxShellTool.msgSerialize, {"read":read, "data":data}, true, false);
	return !read ? event.data : this;
};
//# sourceURL=shell.ibx.js

