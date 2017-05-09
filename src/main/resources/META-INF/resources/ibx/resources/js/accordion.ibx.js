/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	ACCORDION PANE
******************************************************************************/

$.widget("ibi.ibxAccordionPane", $.ibi.ibxFlexBox, 
{
	options:
	{
		direction:"column",
		align:"stretch",
		pageStretch:false,
		selected: "",
		wrap: false,
	},
	_widgetClass:"ibx-accordion-pane",
	_create:function()
	{
		this._super();
		this._group = $("<div>").uniqueId().appendTo(this.element);
		this._group.ibxRadioGroup({name:this._group.prop("id")}).on("ibx_change", this._onPageChange.bind(this));
		this.element.ibxMutationObserver(
		{
			listen:true,
			fnAddedNodes:this._onChildAdded.bind(this),
			fnRemovedNodes:this._onChildRemoved.bind(this),
			init:{childList:true}
		});
	},
	_destroy:function()
	{
		this.element.ibxMutationObserver('destroy');
		this._super();
	},
	_init:function()
	{
		this._super();
		this.element.children(".ibx-accordion-page").detach().appendTo(this.element);
	},
	_onChildAdded:function(node, mutation)
	{
		node = $(node);
		if(node.is(".ibx-accordion-page"))
		{
			var groupName = this._group.ibxWidget("option", "name");
			node.ibxAccordionPage("option", "groupName", groupName);
			this._group.ibxRadioGroup("addControl", node);
		}
		this.refresh();
	},
	_onChildRemoved:function(node, mutation)
	{
		node = $(node);
		if(node.is(".ibx-accordion-page"))
		{
			node.ibxAccordionPage("option", "groupName", "");
			this._group.ibxRadioGroup("removeControl", node);
		}
	},
	
	group:function(){return this._group;},
	next:function()
	{
		this._group.ibxRadioGroup("selectNext");
	},
	previous:function()
	{
		this._group.ibxRadioGroup("selectPrevious")
	},
	_onPageChange:function(e, page)
	{
		this.options.selected = page;
		this._trigger("change");
	},
	refresh:function()
	{
		this._super();
		if(this.options.pageStretch)
			this.element.children(".ibx-accordion-page").addClass("acc-pg-stretch");
		else
			this.element.children(".ibx-accordion-page").removeClass("acc-pg-stretch");
		this._group.ibxRadioGroup("selected", this.options.selected);
	}
});
$.widget("ibi.ibxHAccordionPane", $.ibi.ibxAccordionPane, {options:{direction:"row"}, _widgetClass:"ibx-accordion-pane-horizontal"});
$.widget("ibi.ibxVAccordionPane", $.ibi.ibxAccordionPane, {options:{direction:"column"}, _widgetClass:"ibx-accordion-pane-vertical"});
$.ibi.ibxAccordionPane.statics = 
{
};

/******************************************************************************
	ACCORDION PAGE
******************************************************************************/
$.widget("ibi.ibxAccordionPage", $.ibi.ibxFlexBox, 
{
	options:
	{
		focusRoot:false,
		autoClose:true,
		groupName:"",
		direction:"column",
		align:"stretch",
		wrap:false,
		selected:false,
		btnShow:true,
		btnPosition:"start",
		btnOptions:
		{
			text:"Accordion Page",
			textElClass:"ibx-label-text ibx-accordion-button-text",
			justify:"start",
			iconPosition:"right",
			glyph:"chevron_right",
			glyphClasses:"material-icons"
		},
		btnOptionsOpen:
		{
			glyphClasses:"material-icons acc-rotate-glyph"
		},
		contentOptions:
		{
		},

		optionsMap:
		{
			text:"btnOptions.text",
			iconPosition:"btnOptions.iconPosition",
			glyph:"btnOptions.glyph",
			glyphClasses:"btnOptions.glyphClasses",

			textOpen:"btnOptionsOpen.text",
			IconPositionOpen:"btnOptionsOpen.iconPosition",
			glyphOPen:"btnOptionsOpen.glyph",
			glyphClassesOpen:"btnOptionsOpen.glyphClasses",
		}
	},
	_widgetClass:"ibx-accordion-page",
	_create:function()
	{

		this.element.on("keydown", this._onPageKeyEvent.bind(this));
		this.element.on("focus", this._onPageFocus.bind(this));
		this.element.ibxMutationObserver(
		{
			listen:true,
			fnAddedNodes:this._onChildAdded.bind(this),
			init:{childList:true}
		});

		var content = this._content = $("<div class='ibx-accordion-page-content'>").ibxWidget(this.options.contentOptions);
		var btn = this._button = $("<div tabIndex='0'>").on("click", this._onBtnChange.bind(this));
		btn.data("accPage", this.element).ibxButton(this.options.btnOptions).addClass("ibx-accordion-button");

		this.element.append(btn, content)
		this._super();
	},
	_destroy:function()
	{
		this.element.ibxMutationObserver('destroy');
		this.element.append(this._content.children());
		this._button.ibxWidget("destroy");
		this._content.ibxWidget("destroy");
		this._super();
	},
	button:function(){return this._button;},
	content:function(){return this._content;},
	_init:function()
	{
		this._super();
		this.element.children(":not(.ibx-accordion-button, .ibx-accordion-page-content)").detach().appendTo(this.element);
		this.element.on("transitionend", this._onTransitionEnd.bind(this))
	},
	_onTransitionEnd: function (e)
	{
		if (e.originalEvent.propertyName == "max-height")
		{
			// remove max-height at the end of the transition, so the page's content can grow as needed.
			// max-height is really used just for animation when page closed/opened.
			this._content.css("max-height", "");
		}
	},
	children:function(selector)
	{
		return this._content.ibxWidget("children", selector);
	},
	add:function(el, sibling, before)
	{
		this._onChildAdded(el);
	},
	remove:function(el)
	{
		this._content.ibxWidget("remove", el);
	},
	_onChildAdded: function (node, mutation)
	{
		node = $(node);
		if(!node.is(this._content) && !node.is(this._button))
		{
			this._content.append(node);
			this.refresh();
		}
	},
	/*Needed so this object can be part of an ibxRadioGroup.*/
	getValue:$.noop,
	checked:function(checked)
	{
		return (this.options.autoClose) ? this.selected(checked) : this;
	},
	_onBtnChange:function(e)
	{
		this.selected(!this.options.selected);
	},
	_onPageFocus:function(e)
	{
		this._button.focus();
	},
	_onPageKeyEvent:function(e)
	{
		var keyCode = e.keyCode;
		if(keyCode == 37 || keyCode == 38)
		{
			this.element.prev(".ibx-accordion-page").focus();
			e.stopPropagation();
		}
		else
		if(keyCode == 39 || keyCode == 40)
		{
			this.element.next(".ibx-accordion-page").focus();
			e.stopPropagation();
		}
	},
	selected:function(selected)
	{
		/****
			The pane's group listens for the 'change' event below and adjusts all pages accordingly.
			This WILL TRIGGER a call to 'checked', which will call this function...the if statement
			stops recurssion.
		****/
		if(typeof(selected) === "undefined")
			return this.options.selected;
		else
		if(this.options.selected != selected)
		{
			this.options.selected = selected;
			this.refresh();
			this._trigger( selected ? "open" : "close");
			if(this.options.autoClose)
				this._trigger("change");
		}
		return this;
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		var selected = options.selected;

		//disable the content, if desired
		this._content.ibxWidget("option", "disabled", !selected);

		//set the button options and also its position
		opts = $.extend({}, this.options.btnOptions, selected ? options.btnOptionsOpen : null);
		this._button.ibxButton("option", opts).css("order", (options.btnPosition == "end") ? 1 : -1);
		options.btnShow ? this._button.removeClass("acc-btn-hide") : this._button.addClass("acc-btn-hide");

		//DO NOT MOVE THIS, MUST BE DONE BEFORE CLASS ADJUSTMENTS BELOW!
		//Here's what's going on here...we need to set the max-height so the transition effect will work
		//when the 'closed' css class is added/removed below.
		//THE CALL TO 'offsetHeight' will force the browser to reflow the document.
		var nHeight = this._content.prop("scrollHeight")
		this._content.css("max-height", nHeight + "px");
		this.element[0].offsetHeight;
		if (!selected)
			this._content.css("max-height", "");

		//DO NOT MOVE THIS, MUST BE DONE AFTER HEIGHT ADJUSTMENT ABOVE!
		selected ? this.element.removeClass("acc-pg-closed") : this.element.addClass("acc-pg-closed");
		selected ? this._button.removeClass("acc-btn-closed") : this._button.addClass("acc-btn-closed");
		selected ? this._content.removeClass("acc-cnt-closed") : this._content.addClass("acc-cnt-closed");
	}
});
$.widget("ibi.ibxHAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"row"}, _widgetClass:"ibx-accordion-page-horizontal"});
$.widget("ibi.ibxVAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"column"}, _widgetClass:"ibx-accordion-page-vertical"});
$.ibi.ibxAccordionPage.statics = 
{
};

//# sourceURL=accordion.ibx.js

