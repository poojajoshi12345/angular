/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	ACCORDION PANE
******************************************************************************/

$.widget("ibi.ibxAccordionPane", $.ibi.ibxFlexBox, 
{
	options:
	{
		focusDefault:true,
		navKeyRoot:true,
		direction:"column",
		align:"stretch",
		pageStretch:false,
		pageAutoSize:false,
		selected: "",
		wrap: false,

		aria:
		{
			role:"tablist"
		}

	},
	_widgetClass:"ibx-accordion-pane",
	_create:function()
	{
		this._super();
		var options = this.options;
		this._group = $("<div>").uniqueId().appendTo(this.element);
		this._group.ibxRadioGroup({name:this._group.prop("id")}).on("ibx_change", this._onPageChange.bind(this));
		this.add(this.element.children());
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		//setup the relationship between the accordion buttons and the accordion pane
		this.element.find(".ibx-accordion-page-button").each(function(idx, el)
		{
			var id = el.id;
			aria.owns += " " + id;
		}.bind(this));
		return aria;
	},
	children:function(selector)
	{
		return this._super(selector || ".ibx-accordion-page");
	},
	add:function(el, sibling, before, refresh)
	{
		el = $(el);
		el.filter(".ibx-accordion-page").each(function (idx, el)
		{
			this._group.ibxRadioGroup("addControl", el);
		}.bind(this));

		this._super(el, sibling, before, false);
	},
	remove:function(el, destroy, refresh)
	{
		var selIndex = this.selectedIndex();
		var options = this.options;
		var el = this.children().not(this._group).filter(el);
		el.filter(".ibx-accordion-page").each(function(options, idx, el)
		{
			el = $(el);
			this._group.ibxRadioGroup("removeControl", el[0]);
			if(el.is(options.selected))
				options.selected = null;
		}.bind(this, options));
		this._super(el, destroy, refresh);

		// If selected node was removed, select next / previous page, if available
		var newSelIndex = this.selectedIndex();
		if (newSelIndex < 0)
		{
			var pages = this.element.children(".ibx-accordion-page");
			if (pages.length > 0 && selIndex >= 0)
			{
				selIndex = Math.max(0, Math.min(selIndex, pages.length -1));
				this.selectedIndex(selIndex);
			}
		}
	},
	group:function(){return this._group;},
	userValue:function(value)
	{
		return this._group.ibxWidget("userValue", value);
	},
	selectedIndex: function (index)
	{
		if (index === undefined)
		{
			var page = this._group.ibxWidget("selected");
			if (page.length)
				return this.element.children(".ibx-accordion-page").index(page);
			else
				return -1;
		}
		else
		{
			var pages = this.element.children(".ibx-accordion-page");
			if (index >= 0 && index < pages.length)
				this._group.ibxWidget("selected", $(pages[index]));
			return this.element;
		}
	},
	selected: function (element)
	{
		if (element === undefined)
		{
			return this._group.ibxWidget("selected");
		}
		else
		{
			element = $(element);
			if (element.length > 0 && element.data("ibiIbxAccordionPage"))
				this._group.ibxWidget("selected", element);
			return this.element;
		}
	},
	_onPageChange:function(e)
	{
		this.options.selected = $(e.target).ibxWidget("selected");
		this._trigger("change");
	},
	_setOption: function (key, value)
	{
		this._super(key, value);
		if(key == "selected")
		{
			if (this.options.selected)
				this.selected(this.options.selected);
		}
		else if (key == "userValue")
		{		
			if (this.options.userValue)
				this.userValue(this.options.userValue);
		}
	},
	refresh:function(withChildren)
	{
		this._super();
		if(withChildren)
			this.children().ibxWidget("refresh");
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.children(".ibx-accordion-page").ibxToggleClass("acc-pg-stretch", options.pageStretch).ibxToggleClass("acc-pg-auto-size", options.pageAutoSize);
		this.element.data("ibiIbxSelectionManager").options.selectableChildren = ".ibx-accordion-page-button";
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
		autoClose:true,
		group:"",
		direction:"column",
		align:"stretch",
		wrap:false,
		selected:false,
		btnShow:true,
		btnPosition:"start",
		btnOptions:
		{
			text:"",
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
	},
	_widgetClass:"ibx-accordion-page",
	_create:function()
	{
		this._super();
		var options = this.options;

		var content = this._content = $("<div tabindex='0' class='ibx-accordion-page-content'>").ibxWidget(this.options.contentOptions);
		content.on("transitionend", this._onTransition.bind(this))

		var btn = this._button = $("<div tabIndex='-1' class='ibx-accordion-page-button'>").on("click", this._onBtnChange.bind(this));
		btn.data("accPage", this.element).ibxButton(this.options.btnOptions).ibxAddClass("ibx-accordion-button");

		this.element.on("focus", this._onPageFocus.bind(this));
		this.element.append(btn, content)
		this.element.ibxAddClass("accordion-page-no-animate");
		this.add(this.element.children());

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.btnOptions.text = options.btnOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		//need this on timer so we can stop the initial animation for selected pages.
		window.setTimeout(function(){this.element.ibxRemoveClass("accordion-page-no-animate");}.bind(this), 0);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		var options = this.options;
		var contentId = this._content.prop("id");
		btnOptions = 
		{
			role:"tab",
			expanded: options.selected,
			controls: contentId,
			owns: contentId,
		};
		this._button.ibxWidget("setAccessibility", options.aria.accessible, btnOptions);
		return aria;
	},
	_destroy:function()
	{
		$.ibi.ibxRadioGroup.removeControl(this.options.group, this.element[0]);
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
		this._content.ibxWidget("add",  $(el).not(".ibx-accordion-page-button, .ibx-accordion-page-content"), sibling, before, refresh);
	},
	remove:function(el, destroy, refresh)
	{
		this._content.ibxWidget("remove", el, destroy, refresh);
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
			var type = selected ? "open" : "close";
			var event = this.element.dispatchEvent("ibx_before" + type)
			if(!event.isDefaultPrevented())
			{
				this.options.selected = selected;
				this.refresh();
				this._trigger(type);
				if(this.options.autoClose)
					this._trigger("change");
			}
		}
		return this;
	},
	_onTransition: function (e)
	{
		if (e.originalEvent.propertyName == "max-height")
		{
			// remove max-height at the end of the transition, so the page's content can grow as needed.
			// max-height is really used just for animation when page closed/opened.
			this._content.css({"maxHeight": "", "overflow":""});
		}
	},
	_setOption: function (key, value)
	{
		if(key == "selected")
			this.selected(value);
		else
			this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var selected = options.selected;

		//disable the content, if desired
		this._content.ibxWidget("option", "disabled", !selected);

		//set the button options and also its position
		opts = $.extend({}, this.options.btnOptions, selected ? options.btnOptionsOpen : null);
		this._button.ibxButton("option", opts).css("order", (options.btnPosition == "end") ? 1 : -1);
		options.btnShow ? this._button.ibxRemoveClass("acc-btn-hide") : this._button.ibxAddClass("acc-btn-hide");

		/****
			Figure out the desired height of the content so we can apply the max-height property which triggers the transition animation.
			WE ONLY DO THIS WHEN HEIGHT IS NOT 0 AS 0 WILL NOT CAUSE THE ANIMATION TO BE TRIGGERED AND THE MAX-HEIGHT WILL NOT BE REMOVED.
			In create we set max-height to 0 to force the initial transition.
		****/
		var nHeight = selected ? this._content.prop("scrollHeight") : this._content.height();
		if(nHeight != 0 && !this.element.hasClass("accordion-page-no-animate"))
		{
			this._content.css("maxHeight", nHeight + "px");
			this.element[0].offsetHeight;//this causes the document to reflow and trigger the max-height animation
		}

		this._content.css({"maxHeight": (selected && nHeight) ? (nHeight + "px") : "", "overflow":"hidden"});
		this.element.css("minHeight", selected ? (this._button.outerHeight(true) + "px") : "");

		//DO NOT MOVE THIS CODE ABOVER THE max-height CALCULATION CODE ABOVE!!!!!!
		selected ? this.element.ibxRemoveClass("acc-pg-closed") : this.element.ibxAddClass("acc-pg-closed");
		selected ? this._button.ibxRemoveClass("acc-btn-closed") : this._button.ibxAddClass("acc-btn-closed");
		selected ? this._content.ibxRemoveClass("acc-cnt-closed") : this._content.ibxAddClass("acc-cnt-closed");
	}
});
$.widget("ibi.ibxHAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"row"}, _widgetClass:"ibx-accordion-page-horizontal"});
$.widget("ibi.ibxVAccordionPage", $.ibi.ibxAccordionPage, {options:{direction:"column"}, _widgetClass:"ibx-accordion-page-vertical"});


//# sourceURL=accordion.ibx.js

