/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

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
ibxShellApp.attrShellToolId = "data-ibx-shell-tool-id";
ibxShellApp.idTool = 0;

_p._onToolMessage = function(e)
{
	var mType = e.data.type;
	if(mType == ibxShellTool.msgToolLoaded)
	{
		var toolInfo = this.runningTools[e.data.id];
		var host = $(toolInfo.host);
		if(host.is("iframe"))
		{
			var wnd = host[0].contentWindow;
			toolInfo.tool = wnd.ibxShellTool.getShellTool();
		}
		toolInfo.createDeferred.resolve(toolInfo);
	}
	else
	if(mType == ibxShellTool.msgActivate)
		this._activateTool(e.data);
	else
	if(mType == ibxShellTool.msgUpdateUI)
		this._updateToolUI(e.data);
};

_p.config = null;
_p.runningTools = null;
_p.createTool = function(tType)
{
	var tool = this.config.tools[tType];
	if(!tool)
		return console.error("[ibxShellApp] No registered ibxShellTool type: " + tType);

	var toolId = sformat("ibxShellToolId{1}", ++ibxShellApp.idTool);
	var host = $().data("ibxShellToolId", toolId);
	if(tool.host == "iframe")
		host = $("<iframe tabindex='-1' class='ibx-shell-tool-host'>").attr(ibxShellApp.attrShellToolId, toolId).attr("src", tool.src);
	else
	if(tool.host == "div")
	{
		var shellTool = tool.shellType ? toolShellType.call() : new ibxShellTool(toolId);
		host = $("<div tabindex='1' class='ibx-shell-tool-host'>").data("ibxShellTool", tool);
	}

	var toolInfo = this.runningTools[toolId] = {"id":toolId, "type":tType, "tool":shellTool, "host":host[0], "createDeferred":new $.Deferred()};
	return toolInfo;
};
_p._activateTool = function(activateInfo)
{
	var event = $(window).dispatchEvent(ibxShellApp.msgActivateTool, activateInfo, true, false);
	if(activateInfo.updateUI)
		this._updateToolUI(activateInfo);
};
_p._updateToolUI = function(updateInfo)
{
	var event = $(window).dispatchEvent(ibxShellApp.msgUpdateToolUI, updateInfo, true, false);
};
_p.manageCss = function(toolId, add)
{
	var tool = this.runningTools[toolId];
	if(tool && tool.shellUI && tool.shellUI.css)
	{
		var css = tool.shellUI.css;
		if(add)
		{
			var style = $("<style type='text/css'>").ibxAddClass(toolId).text(css);
			$(document.head).append(style);
		}
		else
			$("."+toolId).remove();
	}
};
/*****************************************************************************/
/* ibxShellTool - plugin for ibx shell application */
/*****************************************************************************/
function ibxShellTool(id)
{
	var singletonTool = ibxShellTool.getShellTool();
	if(singletonTool)
		return singletonTool;
	this._id = id;
	this._jqTool = window.jQuery;
}
var _p = ibxShellTool.prototype = new Object();
ibxShellTool.msgToolLoaded = "ibx_shelltoolloaded";
ibxShellTool.msgGetShellToolResources = "ibx_shelltoolbindresources";
ibxShellTool.msgActivate = "ibx_shelltoolactivate";
ibxShellTool.msgUpdateUI = "ibx_shelltoolupdateui";



//statically manage the shell tool.
ibxShellTool.msgSerialize = "ibx_shelltoolserialize";
ibxShellTool._shellTool = undefined;
ibxShellTool.getShellTool = function()
{
	var tool = ibxShellTool._shellTool;
	if(ibxShellTool._shellTool === undefined)
	{
		var ibxShellToolId = (window.frameElement) ? window.frameElement.getAttribute(ibxShellApp.attrShellToolId) : null;
		if(ibxShellToolId != null && !this._inctor)
		{
			this._inctor = true;
			tool = ibxShellTool._shellTool = new ibxShellTool(ibxShellToolId);
			this._inctor = false;
			window.parent.postMessage({"type":ibxShellTool.msgToolLoaded, "id":ibxShellToolId}, "*");
		}
	}
	return tool;	
};

_p.shellUI = null;
_p._id = null;
_p._jqTool = null;
_p._jqShell = null;
_p.getResources = function(jqShell, shellUI, data)
{
	shellUI = $.extend(true, {}, shellUI);
	this.setResContext(true, jqShell);
	shellUI = this._getResources(shellUI, data);
	this.setResContext(false);
	return shellUI;
};
_p._getResources = function(shellUI, data)
{
	var event = $(window).dispatchEvent(ibxShellTool.msgGetShellToolResources, {"shellUI":shellUI, "data":data}, true, false);
	return event.data.shellUI;
};
_p.setResContext = function(shell, jqShell)
{
	if(shell)
		this._jqShell = window.jQuery = window.$ = (jqShell || this._jqShell);
	else
		window.jQuery = window.$ = this._jqTool;		
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

