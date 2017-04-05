/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxPopup", $.ibi.ibxWidget, 
{
	options:
	{
		"focusRoot":true,
		"modal":false,
		"autoClose":true,
		"draggable":false,
		"dragHandle":null,
		"escapeToClose":true,
		"destroyOnClose":true,
		"autoFocus":true,
		"effect":"none",
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

		"optionsMap":
		{
			"posMy":"position.my",
			"posAt":"position.at",
			"posOf":"position.of",
			"posCollision":"position.collision",
			"posUsing":"position.using",
			"posWithin":"position.within"
		}
	},
	_widgetClass:"ibx-popup",
	_create:function()
	{
		var options = this.options;
		this.element.addClass("pop-closed").css("position", "absolute").on("keydown", this._onPopupCloseKeyEvent.bind(this));
		$(window).resize(this._onPopupWindowResize.bind(this));
		this._super();
	},
	_destroy:function()
	{
		this._super();
		this.element.removeClass("pop-closed").off("mousedown");
	},
	_onPopupCloseKeyEvent:function(e)
	{
		if(this.options.escapeToClose && e.keyCode == 27)
			this.close();
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
			this._elPrevActive = document.activeElement;
			if(!this.element.parent().length)
				this.element.appendTo(document.body);

			this.element.position(this.options.position);
			this.element.on("transitionend", function(e)
			{
				if(e.originalEvent.propertyName == "visibility" && this.isOpen())
				{
					this.element.off("transitionend");
					if(this.options.autoFocus)
					{
						//only do focusing if allowed.
						this.element.find("[tabindex]:not([tabindex=-1])").first().focus();//then the first focusable item
						this.element.find(".ibx-default-focused").first().focus();//then the first default focused item specified
					}
					this._trigger("open");
				}
			}.bind(this));
			this._trigger("popup_mgr_open", null, this.element);
		}
	},
	close:function(closeInfo)
	{
		if(this._trigger("beforeclose", null, closeInfo))
		{
			if(this._elPrevActive)
				this._elPrevActive.focus();
			delete this._elPrevActive;

			this.element.on("transitionend", function(closeInfo, e)
			{
				if(e.originalEvent.propertyName == "visibility" && !this.isOpen())
				{

					this.element.off("transitionend");//.css({top:"", left:""});//remove event handler, and jQueryUI position info.
					this._trigger("close", null, closeInfo);
					if(!this._destroyed && this.options.destroyOnClose)
					{
						this.destroy();
						this.element.remove();
					}
				}
			}.bind(this, closeInfo));
			this._trigger("popup_mgr_close", null, this.element);
		}
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.addClass($.ibi.ibxPopup.statics.effect[options.effect]);
		options.modal ? this.element.addClass("pop-modal") : this.element.removeClass("pop-modal");
		this.element.draggable({disabled:!options.draggable, handle:options.dragHandle});
	}
});


/******************************************************************************
	MANAGER OF HIDING/SHOWING POPUPS...STACKING MODALS, ETC.
******************************************************************************/
function ibxPopupManager()
{
	$(window).on("ibx_popup_mgr_open ibx_popup_mgr_close", ibxPopupManager.onPopupEvent.bind(this));
	window.addEventListener("mousedown", ibxPopupManager.onWindowEvent.bind(this), true);
	this._gp = $("<div class='ibx-popup-glass-pane'>");
};
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
	}
	else
	if(eType == "ibx_popup_mgr_close")
	{
		popup.addClass("pop-closed")
		topPop.addClass("pop-top");
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
};
ibxPopupManager.onWindowEvent = function(e)
{
	if(e.eventPhase == 1)
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
};
ibxPopupManager.getOpenPopups = function(filter, zMin, zMax)
{
	var pattern = sformat("{1}:openPopup({2}, {3})", (filter || ""), zMin, zMax);
	var popups = $($(pattern).sort(fnSortZIndex));
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
