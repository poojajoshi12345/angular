/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:


$.widget("ibi.ibxPopup", $.ibi.ibxWidget, 
{
	options:
	{
		"focusRoot":true,
		"modal":false,
		"autoClose":true,
		"moveable":false,
		"moveHandle":null,
		"escapeToClose":true,
		"destroyOnClose":true,
		"autoFocus":true,
		"effect":"none",
		"closeOnTimer":-1,
		"refocusLastActiveOnClose":true,

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
		"aria":{"role":"alert"}
	},
	_widgetClass:"ibx-popup",
	_create:function()
	{
		var options = this.options;
		this.element.addClass("pop-closed").prop("tabIndex", -1).css("position", "absolute").on("keydown", this._onPopupKeyEvent.bind(this));
		$(window).resize(this._onPopupWindowResize.bind(this));
		this._super();
	},
	_destroy:function()
	{
		this._super();
		this.element.removeClass("pop-closed").off("mousedown");
	},
	_onPopupKeyEvent:function(e)
	{
		if(this.options.escapeToClose && e.keyCode == $.ui.keyCode.ESCAPE)
			this.close("cancel");
	},
	_onPopupWindowResize:function(e)
	{
		if(this.isOpen() && (window === e.target))
			this.element.position(this.options.position);
	},
	isOpen:function()
	{
		return !(this.element.hasClass("pop-closed"));
	},
	open:function(openInfo)
	{
		if(this._trigger("beforeopen", null, openInfo))
		{
			//save currently active element for refocusing on close.
			this._elPrevActive = document.activeElement;
			this.element.data("ibxPopupParent", this.element.parent()).appendTo(document.body);

			this.element.position(this.options.position);
			this.element.on("transitionend", function(e)
			{
				if(e.originalEvent.propertyName == "visibility" && this.isOpen())
				{
					this.element.off("transitionend");//no longer interested in transition events.
					if(this.options.autoFocus)
					{
						//focus the popup first.				
						this.element.focus();

						//focus default item...otherwise find first focusable item (ARIA needs SOMETHING to be focused on the popup)
						var defItem = this.element.find(".ibx-default-focused");
						defItem = defItem.length ? defItem : this.element.find(":ibxFocusable").first();
						defItem.focus();
					}

					//let people know we are fully open
					this._trigger("open");

					//auto close the dialog after the specified time.
					if(this.options.closeOnTimer >= 0)
					{
						window.setTimeout(function()
						{
							this.close();
						}.bind(this), this.options.closeOnTimer);
					}

				}
			}.bind(this));

			if(!this.isOpen())
				this._trigger("popup_mgr_open", null, this.element);
		}
	},
	close:function(closeInfo)
	{
		if(this._trigger("beforeclose", null, closeInfo))
		{
			this.element.on("transitionend", function(closeInfo, e)
			{
				if(e.originalEvent.propertyName == "visibility")
				{
					this.element.removeClass("ibx-popup-closing");
					if(!this.isOpen())
					{
						//remove the transition event listener...put popup back under original parent..remove current position info.
						var parent = this.element.data("ibxPopupParent") || document.body;
						this.element.appendTo(parent);
						this.element.off("transitionend").css({top:"", left:""});
						this._trigger("close", null, closeInfo);
					
						//destroy on close, if desired
						if(!this._destroyed && this.options.destroyOnClose)
						{
							this.destroy();
							this.element.remove();
						}

						/****[IBX-29]
							Refocus the previously active element. The check for body being focused is because if the user has clicked on something else to dismiss
							the popup, then that should retain focus and WE DON'T WANT TO MOVE IT TO THE ORIGINAL FOCUSED ELEMENT!!!
						****/
						if(this._elPrevActive && this.options.refocusLastActiveOnClose && document.body === document.activeElement)
							this._elPrevActive.focus();
						delete this._elPrevActive;
					}
				}
			}.bind(this, closeInfo));

			if(this.isOpen())
			{
				this.element.addClass("ibx-popup-closing");
				this._trigger("popup_mgr_close", null, this.element);
			}
		}
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.addClass($.ibi.ibxPopup.statics.effect[options.effect]);
		options.modal ? this.element.addClass("pop-modal") : this.element.removeClass("pop-modal");
		this.element.draggable({disabled:!options.moveable, handle:options.moveHandle});
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
	this._gp = $("<div class='ibx-popup-glass-pane'>").on("mousedown mouseup click", function(e){e.stopPropagation();});
};
ibxPopupManager._openPopups = $();//array of currently open ixbPoups
ibxPopupManager.autoDisableIFrames = true;//no pointer events for iframes
ibxPopupManager.onPopupEvent = function(e, popup)
{
	var popup = $(popup);

	//remove existing .pop-top as we're going to reset it
	$(".ibx-popup").removeClass("pop-top");

	var topPop = ibxPopupManager.getOpenPopups().not(popup).first();//find the top popup excluding the one in question
	var eType = e.type;
	if(eType == "ibx_popup_mgr_open")
	{
		var topZ = topPop.zIndex() || popup.zIndex();
		popup.addClass("pop-top")
		popup.css("zIndex", topZ + 1000);
		popup.removeClass("pop-closed");
		topPop = popup;

		//manage the currently open popups
		ibxPopupManager._openPopups = ibxPopupManager._openPopups.add(popup);
	}
	else
	if(eType == "ibx_popup_mgr_close")
	{
		popup.addClass("pop-closed")
		topPop.addClass("pop-top");

		//manage the currently open popups
		ibxPopupManager._openPopups = ibxPopupManager._openPopups.not(popup);
	}

	//now, find the topmost modal popup...if there is one, stick the glass pane behind it, and stop mouse events
	var topModal = ibxPopupManager.getOpenPopups(".pop-modal").first()
	if(topModal.length)
	{
		var zIndex = topModal.zIndex() - 10;
		this._gp.css("zIndex", zIndex);
		$("body").append(this._gp);
	}
	else
		this._gp.css("zIndex", "").detach();

	//[IBX-66]if desired, kill all pointer events on background iframes.
	if(ibxPopupManager.autoDisableIFrames)
		$("iframe:not(.pop-top iframe)").toggleClass("ibx-popup-disabled-iframe", !!topPop.length);
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

			//otherwise, close all open menus
			var menus = ibxPopupManager.getOpenPopups(":openMenuPopup");
			if(menus.length)
			{
				menus.ibxWidget("close", e);
				return;
			}

			//otherwise, if any modals are open, then attempt to close any popups abover the top modal, or
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
			ibxPopupManager.closeOpenPopups(null, null, null, false, e);
		}
		else
		if(e.type = "keydown")
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
		none:"",
		fade:"pop-effect-fade",
		scale:"pop-effect-scale",
		blind:"pop-effect-blind"
	},
	popupManager:new ibxPopupManager(),
};

//# sourceURL=popup.ibx.js
