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
		this.add(this.element.children(".ibx-accordion-page"));
	},
	children:function(selector)
	{
		return this._super(selector || ".ibx-accordion-page");
	},
	add:function(el, sibling, before, refresh)
	{
		this._super(el, sibling, before, false);

		el = $(el);
		el.filter(".ibx-accordion-page").each(function(idx, el)
		{
			el = $(el);
			var groupName = this._group.ibxWidget("option", "name");
			el.ibxAccordionPage("option", "groupName", groupName);
			this._group.ibxRadioGroup("addControl", el);
		}.bind(this));
		this.refresh();
	},
	remove:function(el, refresh)
	{
		el = $(el);
		el.filter(".ibx-accordion-page").each(function(idx, el)
		{
			el = $(el);
			el.ibxAccordionPage("option", "groupName", "");
			this._group.ibxRadioGroup("removeControl", el);
		}.bind(this));
		this._super(el, refresh);
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
		this._super();

		this.element.on("keydown", this._onPageKeyEvent.bind(this));
		this.element.on("focus", this._onPageFocus.bind(this));
		var content = this._content = $("<div class='ibx-accordion-page-content'>").ibxWidget(this.options.contentOptions);
		var btn = this._button = $("<div tabIndex='0' class='ibx-accordion-page-button'>").on("click", this._onBtnChange.bind(this));
		btn.data("accPage", this.element).ibxButton(this.options.btnOptions).addClass("ibx-accordion-button");
		this.element.append(btn, content)
		this.element.on("transitionend", this._onTransitionEnd.bind(this))
		this.add(this.element.children());
		
		//much as I hate timers, this refresh is needed so the accordion page will have the correct content when created
		//and so that the animations for open/close will work correctly.
		window.setTimeout(function(){this.refresh();}.bind(this), 0);
	},
	_destroy:function()
	{
		this.element.append(this._content.children());
		this._button.ibxWidget("destroy");
		this._content.ibxWidget("destroy");
		this._super();
	},
	button:function(){return this._button;},
	content:function(){return this._content;},
	children:function(selector)
	{
		return this._content.ibxWidget("children", selector);
	},
	add:function(el, sibling, before, refresh)
	{
		this._content.ibxWidget("add", $(el).not(".ibx-accordion-page-button, .ibx-accordion-page-content"), sibling, before, refresh);
	},
	remove:function(el, refresh)
	{
		this._content.ibxWidget("remove", el, refresh);
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
	_onTransitionEnd: function (e)
	{
		if (e.originalEvent.propertyName == "max-height")
		{
			// remove max-height at the end of the transition, so the page's content can grow as needed.
			// max-height is really used just for animation when page closed/opened.
			this._content.css("max-height", "");
		}
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


		/****
			Figure out the desired height of the content so we can apply the max-height property which triggers the transition animation.
			WE ONLY DO THIS WHEN HEIGHT IS NOT 0 AS 0 WILL NOT CAUSE THE ANIMATION TO BE TRIGGERED AND THE MAX-HEIGHT WILL NOT BE REMOVED.
		****/
		var nHeight = this._content.prop("scrollHeight") 
		if(nHeight != 0)
		{
			this._content.css("max-height", nHeight + "px"); 
			this.element[0].offsetHeight;//this causes the document to reflow and trigger the max-height animation
		}

		if(!selected)
			this._content.css("max-height", "");

		//DO NOT MOVE THIS CODE ABOVER THE max-height CALCULATION CODE ABOVE!!!!!!
		selected ? this.element.removeClass("acc-pg-closed") : this.element.addClass("acc-pg-closed");
		selected ? this._button.removeClass("acc-btn-closed") : this._button.addClass("acc-btn-closed");
		selected ? this._content.removeClass("acc-cnt-closed") : this._content.addClass("acc-cnt-closed");
	}
});
$.widget("ibi.ibxHAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"row"}, _widgetClass:"ibx-accordion-page-horizontal"});
$.widget("ibi.ibxVAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"column"}, _widgetClass:"ibx-accordion-page-vertical"});


//# sourceURL=accordion.ibx.js

