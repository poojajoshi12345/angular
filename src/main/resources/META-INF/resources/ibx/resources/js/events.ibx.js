/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.78 $:

function ibxEventManager()
{
	if(ibx.eventMgr)
		return;

	window.addEventListener("touchstart", ibxEventManager._onTouchEvent.bind(this), {passive:false, capture:true});
	window.addEventListener("touchend", ibxEventManager._onTouchEvent, {passive:false, capture:true});
	window.addEventListener("touchmove", ibxEventManager._onTouchEvent, {passive:false, capture:true});

	window.addEventListener("keydown", ibxEventManager._onKeyDown);
	window.addEventListener("contextmenu", ibxEventManager._onContextMenu);
	window.addEventListener("touchstart", ibxEventManager._onNoScrollTouchEvent, {passive:false, capture:true});
}
ibxEventManager.noBrowserCtxMenu = true;
ibxEventManager.noBackspaceNavigate = true;
ibxEventManager.noSpaceScroll = true;
ibxEventManager.noIOSBodyScroll = false;
ibxEventManager.msCtxMenu = 500;	//context menu timer length
ibxEventManager.msDblClick = 300;	//time between touches to trigger doubleclick
ibxEventManager.msSwipe = 300;		//time for touch movement before swipe event
ibxEventManager.deltaSwipe = 30;	//distance for touch move to trigger a swipe event

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
	//cancel any pending context menu by clearing the timer.
	window.clearTimeout(ibxEventManager._ctxMenuTimer);

	var eType = e.type;
	if(eType == "touchstart")
	{
		var me = ibxEventManager.createMouseEvent("mousedown", e);
		e.target.dispatchEvent(me);
		ibxEventManager._eLastTouch = e;
		ibxEventManager._ctxMenuTimer = window.setTimeout(function(e)
		{
			var me = ibxEventManager.createMouseEvent("contextmenu", e);
			e.target.dispatchEvent(me);
		}.bind(ibxEventManager, e), ibxEventManager.msCtxMenu);
	}
	else
	if(eType == "touchend")
	{
		//do mouseup
		var me = ibxEventManager.createMouseEvent("mouseup", e);
		e.target.dispatchEvent(me);

		//do click
		var me = ibxEventManager.createMouseEvent("click", e);
		e.target.dispatchEvent(me);

		//do double click
		var dt = ibxEventManager._eLastClick ? (e.timeStamp - ibxEventManager._eLastClick.timeStamp) : Infinity;
		if(dt < ibxEventManager.msDblClick)
		{
			var me = ibxEventManager.createMouseEvent("dblclick", e);
			e.target.dispatchEvent(me);
		}

		//save info, and prevent default so browser won't generate its own native mouse events.
		ibxEventManager._eLastClick = e;
		ibxEventManager._eLastTouch = null;
		ibxEventManager._hasSwiped = false;
		e.preventDefault();
	}
	else
	if(eType == "touchmove")
	{
		//do swiping - just put out one swipe message.
		//if(!ibxEventManager._hasSwiped)
		{
			var touch = e.touches[0];
			var tElapsed = e.timeStamp - ibxEventManager._eLastTouch.timeStamp;
			var dx = touch.clientX - ibxEventManager._eLastTouch.touches[0].clientX;
			var dy = touch.clientY - ibxEventManager._eLastTouch.touches[0].clientY;
			if(tElapsed <= ibxEventManager.msSwipe && (Math.abs(dx) >= ibxEventManager.deltaSwipe || Math.abs(dy) >= ibxEventManager.deltaSwipe))
			{
				var sEvent = "swipe";
				if(dy > ibxEventManager.deltaSwipe)
					sEvent += "down";
				if(dy < -ibxEventManager.deltaSwipe)
					sEvent += "up";
				if(dx > ibxEventManager.deltaSwipe)
					sEvent += "right";
				if(dx < -ibxEventManager.deltaSwipe)
					sEvent += "left";
				
				console.log(sEvent, dx, dy);

				if(sEvent != "swipe")
				{
					var se = ibxEventManager.createMouseEvent(sEvent, e);
					ibxEventManager._hasSwiped = true;
					e.target.dispatchEvent(se);
				}
			}
		}

		//do mouse move
		var me = ibxEventManager.createMouseEvent("mousemove", e);
		e.target.dispatchEvent(me);
	}
};

ibxEventManager._onContextMenu = function(e)
{
	if(ibxEventManager.noBrowserCtxMenu)
		e.preventDefault();
};

//[HOME-183] stop backspace from navigating
//see: https://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
ibxEventManager.isInputEventToIgnore = function(event)
{
	var ignore = true;
	var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
	var target = $(event.target);
	var disabled = target.prop("readonly") || target.prop("disabled");

	if(!disabled && target.length)
	{
		if(target[0].isContentEditable)
			ignore = false;
		else
		if(target.is("input"))
		{
			var type = target.attr("type");
			if(type)
				type = type.toLowerCase();
			if(types.indexOf(type) > -1)
				ignore = false;
		}
		else
		if(target.is("textarea"))
			ignore = false;
	}
	return ignore;
};

ibxEventManager._onKeyDown = function(event)
{
	if((ibxEventManager.noBackspaceNavigate && (event.keyCode === $.ui.keyCode.BACKSPACE)) || (ibxEventManager.noSpaceScroll && (event.keyCode === $.ui.keyCode.SPACE)))
	{
		var ignore = ibxEventManager.isInputEventToIgnore(event);
		if(ignore)
			event.preventDefault();
		return !ignore;
	}
};

//ios has an annoying habit of attempting to scroll the body element even when it has nothing to scroll.  This stops that!
ibxEventManager._onNoScrollTouchEvent = function(e)
{
	// THIS IS NOT WORKING CORRECTLY YET...DO NOT UNCOMMENT!!!!
	// if(ibxPlatformCheck.isIOS && ibxEventManager.noIOSBodyScroll && e.target === document.body)
	// 	e.preventDefault();
};

//singleton event manager object.
ibx.eventMgr = new ibxEventManager();

//# sourceURL=events.ibx.js
