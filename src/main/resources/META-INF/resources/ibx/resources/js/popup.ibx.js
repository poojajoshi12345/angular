/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.65 $:

$.widget("ibi.ibxPopup", $.ibi.ibxWidget, 
{
	options:
	{
		"focusRoot":true,
		"focusDefault":".ibx-default-focused",
		"focusOnOpen":true,
		"modal":false,
		"autoClose":true,
		"movable":false,
		"moveHandle":null,
		"moveConstrainToWindow":true,
		"resizable":false,
		"resizeHandles":null,
		"escapeToClose":true,
		"destroyOnClose":true,
		"effect":"none",
		"closeOnTimer":-1,
		"refocusLastActiveOnClose":true,

		"autoPosition":true,
		"position":
		{
			/* for my/at position values see: http://api.jqueryui.com/position/ */
			"my":"center",
			"at":"center",
			"of":window,
			"collision":"flip",
			"using":null,
			"within":null,
		},
		"aria":
		{
		}
	},
	_widgetClass:"ibx-popup",
	_create:function()
	{
		var options = this.options;
		this.element.ibxAddClass("pop-closed").prop("tabIndex", -1).css("position", "absolute").on('click', this._onPopupMouseEvent.bind(this)).on("keydown", this._onPopupKeyEvent.bind(this));
		this._onPopupWindowResizeBound = this._onPopupWindowResize.bind(this);
		$(window).on("resize", this._onPopupWindowResizeBound);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.hidden = this.isOpen() ? false : true;
		return aria;
	},
	_destroy:function()
	{
		this._super();
		var options = this.options;
		this.element.ibxRemoveClass("pop-closed pop-modal pop-top").off("mousedown");
		this.element.ibxRemoveClass($.ibi.ibxPopup.statics.effect[options.effect]);
		if(options.movable)
			this.element.draggable("destroy");
		if(options.resizable)
			this.element.resizable("destroy");

		$(window).off("resize", this._onPopupWindowResizeBound);
	},
	_onPopupMouseEvent:function(e)
	{
		if(e.type === 'click')
			e.stopPropagation();//popup clicks shouldn't propagate.
	},
	_onPopupKeyEvent:function(e)
	{
		if(this.options.escapeToClose && e.keyCode == $.ui.keyCode.ESCAPE)
			this.close("cancel");
		e.stopPropagation();
	},
	_onPopupWindowResize:function(e)
	{
		if(this.isOpen() && this.options.autoPosition && (window === e.target))
			this.element.position(this.options.position);
	},
	isClosing:function()
	{
		return this.element.hasClass("pop-closing");
	},
	isOpening:function()
	{
		return this.element.hasClass("pop-opening");
	},
	isOpen:function()
	{
		return !this.element.hasClass("pop-closed");
	},
	open:function(openInfo)
	{
		//[IBX-121][PD-839]trying to open the popup when closing...this will cause an open from the close, when complete.
		if(this.isClosing())
		{
			this._openFromClose = true;
			return;
		}

		if(!this.isOpen() && this._trigger("beforeopen", null, openInfo))
		{
			//we are fully open...no longer interested in transition events.
			this.element.on("transitionend", function(e)
			{
				//we are now fully open.
				this.element.ibxRemoveClass("pop-opening").off("transitionend");
				this._openFromClose = false;

				//auto close the dialog after the specified time.
				if(options.closeOnTimer >= 0)
				{
					window.setTimeout(function()
					{
						this.close();
					}.bind(this), options.closeOnTimer);
				}
			
				if(this._closeFromOpen)
					this.close();

			}.bind(this));

			var options = this.options;

			//save currently active element for refocusing on close.
			//[IA-8479] IE11 (some installs) have a problem with activeElement in iframe documents.  So, the if check will basically
			//just force the activeElement to document.body if document.activeElement is not correct.
			if(document.activeElement instanceof HTMLElement)
				this._elPrevActive = document.activeElement;
			else
				this._elPrevActive = document.body;

			//move the popup to the body so it can be top level...and position it correctly.
			this.element.data("ibxPopupParent", this.element.parent()).appendTo(document.body);

			//if not autoPosition, first time position, next leave where last closed.
			var curPos = this.element.data("ibxPopupLastPos");
			if(!options.autoPosition && curPos)
				this.element.css({top:curPos.top, left:curPos.left});
			else
				this.element.position(options.position);

			//tell manager to open the popup.
			this.element.ibxAddClass("pop-opening");
			this._trigger("popup_mgr_open", null, this.element);

			//we're visible so focus...auto-focusing of children now happens in ibxWidget.
			this.setAccessibility();
			if(options.focusOnOpen)
				this.element.focus();

			//let people know we are fully open
			this._trigger("open");
		}
	},
	close:function(closeInfo)
	{
		/****
			[HOME-1073][IBX-121][PD-839]...see 'open' function above for corollary
			trying to close the popup when opening...this will cause a close from the open, when complete.
			this is needed because the popup is transitioning between open/close is happening, so the popup manager is trying to close
			this popup, but it can't because it's not fully open yet.  We stack the open/close so that when it has fully completed
			the transition, it will then do the stacked (open/close) action.
		****/
		if(this.isOpening())
		{
			this._closeFromOpen = true;
			return;
		}

		if(this.isOpen() && this._trigger("beforeclose", null, closeInfo))
		{
			//we are fully closed...no longer interested in transition events.
			this.element.on("transitionend", function(e)
			{
				this._closeFromOpen = false;

				//destroy on close, if desired, or put popup back under it's original parent.
				if(!this._destroyed && this.options.destroyOnClose)
				{
					this.destroy();
					this.element.remove();
				}
				else
				{
					this.element.data("ibxPopupLastPos", this.element.position()).css({top:"", left:""});
					this.element.appendTo(this.element.data("ibxPopupParent") || document.body);
					this.element.ibxRemoveClass("pop-closing").off("transitionend");
				}
				
				//allow popup to do cleanup
				this.popupClosed();
				
				//user tried to open popup while it was closing...open it now that it's fully closed.
				if(this._openFromClose)
					this.open();

			}.bind(this));

			//[IBX-87] Don't refocus if close is from a mouse event...let browser focus wherever was clicked on.
			//ALSO, check for pop-top, because if we aren't the topmost popup, then we shouldn't be resetting focus.  Think menu item opening dialog.
			if(!(closeInfo instanceof MouseEvent) && this.element.is(".pop-top") && this.options.refocusLastActiveOnClose && this._elPrevActive)
				this._elPrevActive.focus();
			delete this._elPrevActive;

			this.element.ibxAddClass("pop-closing");
			this._trigger("popup_mgr_close", null, this.element);
			this._trigger("close", null, closeInfo);
			this.setAccessibility();
		}
	},
	popupClosed:$.noop,
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.ibxAddClass($.ibi.ibxPopup.statics.effect[options.effect]);
		options.modal ? this.element.ibxAddClass("pop-modal") : this.element.ibxRemoveClass("pop-modal");

		//turn draggable on/off
		if(options.movable)
			this.element.draggable({handle:options.moveHandle, "containment": this.options.moveConstrainToWindow ? "window" : null});
		else
		if(this.element.is(".ui-draggable"))
			this.element.draggable("destroy");

		//turn resizable on/off
		if(options.resizable)
			this.element.resizable({handles:options.resizeHandles});
		else
		if(this.element.is(".ui-resizable"))
			this.element.resizable("destroy");

		this.element.on("resizestart resizestop dragstart dragstop", function(e)
		{
			//[IBX-78] make resize/move work when content has iframes...stop pointer events so they don't eat the events.
			var frames = this.element.find("iframe");
			frames.css("pointerEvents", (e.type == "resizestart" || e.type == "dragstart") ? "none" : "");
		}.bind(this));
	}
});


/******************************************************************************
	MANAGER OF HIDING/SHOWING POPUPS...STACKING MODALS, ETC.
******************************************************************************/
function ibxPopupManager()
{
	$(window).on("ibx_popup_mgr_open ibx_popup_mgr_close", ibxPopupManager.onPopupEvent.bind(this));
	window.addEventListener("mousedown", ibxPopupManager.onWindowEvent.bind(this), true);
	window.addEventListener("keydown", ibxPopupManager.onWindowEvent.bind(this), true);
	this._gp = $("<div class='ibx-popup-glass-pane'>").on("mousedown mouseup click", function(e){e.preventDefault();e.stopPropagation();});
}
ibxPopupManager._openPopups = $();//array of currently open ixbPoups
ibxPopupManager.autoDisableIFrames = true;//no pointer events for iframes
ibxPopupManager.onPopupEvent = function(e, popup)
{
	var popup = $(popup);

	//remove existing .pop-top as we're going to reset it
	$(".ibx-popup").ibxRemoveClass("pop-top");

	var topPop = ibxPopupManager.getOpenPopups().not(popup).first();//find the top popup excluding the one in question
	var eType = e.type;
	if(eType == "ibx_popup_mgr_open")
	{
		var topZ = topPop.zIndex() || popup.zIndex();
		popup.ibxAddClass("pop-top");
		popup.css("zIndex", topZ + 1000);
		popup.ibxRemoveClass("pop-closed");
		topPop = popup;

		//manage the currently open popups
		ibxPopupManager._openPopups = ibxPopupManager._openPopups.add(popup);
	}
	else
	if(eType == "ibx_popup_mgr_close")
	{
		popup.ibxAddClass("pop-closed");
		topPop.ibxAddClass("pop-top");

		//manage the currently open popups
		ibxPopupManager._openPopups = ibxPopupManager._openPopups.not(popup);
	}

	//now, find the topmost modal popup...if there is one, stick the glass pane behind it, and stop mouse events
	var topModal = ibxPopupManager.getOpenPopups(".pop-modal").first();
	if(topModal.length)
	{
		var zIndex = topModal.zIndex() - 10;
		this._gp.css("zIndex", zIndex);
		$("html > body").append(this._gp);
	}
	else
		this._gp.css("zIndex", "").detach();

	//[IBX-66]if desired, kill all pointer events on background iframes.
	if(ibxPopupManager.autoDisableIFrames)
	{
		//[IBX-198] have to turn pointer-events back on for topmost popup iframes.
		$("iframe").ibxToggleClass("ibx-popup-disabled-iframe", !!topPop.length);
		topPop.find("iframe").ibxRemoveClass("ibx-popup-disabled-iframe");
	}
};
ibxPopupManager.onWindowEvent = function(e)
{
	if(e.eventPhase == 1)
	{
		if(e.type == "mousedown")
		{
			//if we clicked on a popup, then close all higher zIndex popups
			var popup = $(e.target).closest(".ibx-popup");
			if(popup.length)
			{
				var zMin = popup.zIndex() + 1;
				ibxPopupManager.closeOpenPopups("", zMin, Infinity, false, e);
				return;
			}

			//otherwise, if any modals are open, then attempt to close any popups above the top modal, or
			//the modal itself if it's autoClose
			var modal = ibxPopupManager.getOpenPopups(":openModalPopup").first();
			if(modal.length)
			{
				var zMin = modal.zIndex() + 1;//add one so the modal isn't included in the get open popups.
				popup = ibxPopupManager.getOpenPopups(":autoClose", zMin);
				if(popup.length)
					popup.ibxWidget("close", e);
				else
				if(modal.ibxWidget("option", "autoClose"))
					modal.ibxWidget("close", e);
				return;
			}

			//finally, close all open autoClose popups
			//[IBX-527] don't close popups that are opening.
			ibxPopupManager.closeOpenPopups(":not(.pop-opening)", null, null, false, e);
		}
		else
		if(e.type == "keydown")
		{
		}
	}
};
ibxPopupManager.getOpenPopups = function(filter, zMin, zMax)
{
	var pattern = sformat("{1}:openPopup({2}, {3})", (filter || ""), zMin, zMax);
	var popups = ibxPopupManager._openPopups.filter(pattern).sort(fnSortZIndex);
	return popups;
};
ibxPopupManager.closeOpenPopups = function(filter, zMin, zMax, forceClose, closeData)
{
	//close all open popups within z limits...and only do autoClose unless forceClose is specified.
	var openPopups = ibxPopupManager.getOpenPopups((!forceClose ? ":autoClose" : "") + (filter || ""), zMin, zMax);
	if(openPopups.length)
		openPopups.ibxWidget("close", closeData);
};

$.ibi.ibxPopup.statics = 
{
	effect:
	{
		none:"pop-effect-none",
		fade:"pop-effect-fade",
		scale:"pop-effect-scale",
		blind:"pop-effect-blind"
	},
	popupManager:new ibxPopupManager(),
};

//# sourceURL=popup.ibx.js
