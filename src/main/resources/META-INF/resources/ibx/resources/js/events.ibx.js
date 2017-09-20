/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

function ibxEventManager()
{
	window.addEventListener("touchstart", ibxEventManager._onTouchEvent.bind(this), true)
	window.addEventListener("touchend", ibxEventManager._onTouchEvent, true)
	window.addEventListener("touchmove", ibxEventManager._onTouchEvent, true)
	window.addEventListener("dragover", ibxEventManager._onDragEvent);
	window.addEventListener("drop", ibxEventManager._onDragEvent);
	window.addEventListener("contextmenu", ibxEventManager._onContextMenu);
	window.addEventListener("keydown", ibxEventManager._onKeyDown);
}
ibxEventManager.noBrowserCtxMenu = true;
ibxEventManager.noBackspaceNavigate = true;
ibxEventManager.msDblClick = 300;
ibxEventManager.msCtxMenu = 500;
ibxEventManager.createMouseEvent = function(eType, e)
{
	var touch = (e instanceof TouchEvent) ? e.touches[0] : null;
	var eLast = ((e instanceof TouchEvent) && ibxEventManager._eLast) ? ibxEventManager._eLast.touches[0] : null;
	var eInit = $.extend({}, e, touch);
	eInit.movementX = eLast ? (eInit.screenX - eLast.screenX) : 0;
	eInit.movementY = eLast ? (eInit.screenY - eLast.screenY) : 0;

	var event = new MouseEvent(eType, eInit);
	event.movementX = eInit.movementX;//for IOS...they don't allow arbitrary properties in new MouseEvent.
	event.movementY = eInit.movementY;//for IOS...they don't allow arbitrary properties in new MouseEvent.
	event.originalEvent = e;
	return event;
};


ibxEventManager._onTouchEvent = function(e)
{
	var eType = e.type;
	if(eType == "touchstart")
	{
		ibxEventManager._hasSwiped = false;
		if(ibxPlatformCheck.isIOS)
		{
			var me = ibxEventManager.createMouseEvent("mousedown", e);
			e.target.dispatchEvent(me);
			ibxEventManager._eLast = e;

			ibxEventManager._ctxMenuTimer = window.setTimeout(function(e)
			{
				var me = ibxEventManager.createMouseEvent("contextmenu", e);
				e.target.dispatchEvent(me);
				ibxEventManager._eLast = e;
			}.bind(ibxEventManager, e), ibxEventManager.msCtxMenu);
		}
		else
			ibxEventManager._eLast = e;
	}
	else
	if(eType == "touchend")
	{
		window.clearTimeout(ibxEventManager._ctxMenuTimer);//cancel context menu

		if(ibxPlatformCheck.isIOS)
		{
			var me = ibxEventManager.createMouseEvent("mouseup", e);
			e.target.dispatchEvent(me);
			ibxEventManager._eLast = e;
		}

		var dblClick = false;
		if(ibxEventManager._eLast.type != "contextmenu")
		{
			var dt = ibxEventManager._eLastClick ? (e.timeStamp - ibxEventManager._eLastClick.timeStamp) : Infinity;
			dblClick = (dt < ibxEventManager.msDblClick);
			ibxEventManager._eLast = e;
			ibxEventManager._eLastClick = e;
		}

		if(dblClick)
		{
			var me = ibxEventManager.createMouseEvent("dblclick", e);
			e.target.dispatchEvent(me);
		}

		ibxEventManager._eLast = null;
		ibxEventManager._hasMoved = false;
	}
	else
	if(eType == "touchmove")
	{
		window.clearTimeout(ibxEventManager._ctxMenuTimer);//cancel context menu

		//figure out swiping
		var touch = e.touches[0];
		if(!ibxEventManager._hasSwiped)
		{
			var tElapsed = e.timeStamp - ibxEventManager._eLast.timeStamp;
			var dx = touch.clientX - ibxEventManager._eLast.touches[0].clientX;
			var dy = touch.clientY - ibxEventManager._eLast.touches[0].clientY;
			var sEvent = null;
			if(dx > 30)
				sEvent = "swiperight";
			else
			if(dx < -30)
				sEvent = "swipeleft";

			if(sEvent && tElapsed <= 300)
			{
				var se = ibxEventManager.createMouseEvent(sEvent, e);
				ibxEventManager._hasSwiped = true
				e.target.dispatchEvent(se);
			}

			sEvent = null;
			if(dy > 30)
				sEvent = "swipedown";
			else
			if(dy < -30)
				sEvent = "swipeup";
			
			if(sEvent && tElapsed <= 300)
			{
				var se = ibxEventManager.createMouseEvent(sEvent, e);
				ibxEventManager._hasSwiped = true
				e.target.dispatchEvent(se);
			}
		}

		var me = ibxEventManager.createMouseEvent("mousemove", e);
		e.target.dispatchEvent(me);
		ibxEventManager._eLast = e;
		ibxEventManager._hasMoved = true;//stop possible dblclick on touchend
	}
};

ibxEventManager._onDragEvent = function(e)
{
	e.dataTransfer.dropEffect = "none";
	e.preventDefault();
};

ibxEventManager._onContextMenu = function(e)
{
	if(ibxEventManager.noBrowserCtxMenu)
		e.preventDefault();
};

//[HOME-183] stop backspace from navigating
//see: https://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
ibxEventManager._onKeyDown = function(event)
{
	if(ibxEventManager.noBackspaceNavigate && (event.keyCode === 8))
	{
		var doPrevent = true;
		var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
		var d = $(event.srcElement || event.target);
		var disabled = d.prop("readonly") || d.prop("disabled");

		if(!disabled)
		{
			if(d[0].isContentEditable)
				doPrevent = false;
			else
			if(d.is("input"))
			{
				var type = d.attr("type");
				if(type)
					type = type.toLowerCase();
				if(types.indexOf(type) > -1)
					doPrevent = false;
			}
			else
			if(d.is("textarea"))
				doPrevent = false;

			if(doPrevent)
			{
				event.preventDefault();
				return false;
			}
		}
	};
};

//singleton event manager object.
window["ibxEventMgr"] = new ibxEventManager();

//# sourceURL=events.ibx.js
