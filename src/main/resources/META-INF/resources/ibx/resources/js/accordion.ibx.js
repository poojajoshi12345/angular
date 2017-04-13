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
		selected:"",
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
$.widget("ibi.ibxHAccordionPane", $.ibi.ibxAccordionPane, {options:{direction:"row",wrap:false}, _widgetClass:"ibx-accordion-horizontal"});
$.widget("ibi.ibxVAccordionPane", $.ibi.ibxAccordionPane, {options:{direction:"column",wrap:false}, _widgetClass:"ibx-accordion-vertical"});
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
		btnOptions:
		{
			text:"Accordion Page",
			textElClass:"ibx-label-text ibx-accordion-button-text",
			justify:"start",
			iconPosition:"right",
			glyph:"chevron_right",
			glyphClasses:"material-icons md-24"
		},
		btnOptionsOpen:
		{
			glyphClasses:"material-icons md-24 acc-rotate-glyph"
		},
		contentOptions:
		{
			mutationObserver:true
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
	},
	_onChildAdded:function(node, mutation)
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
		return this.selected(checked);
	},
	_onBtnChange:function(e)
	{
		this.checked(!this.options.selected);
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
			this._trigger("change");
		}
		return this;
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		var selected = options.selected;

		//DO NOT MOVE THIS, MUST BE DONE BEFORE CLASS ADJUSTMENTS BELOW!
		//add max-height first, so transition will work when acc-cnt-closed is removed.
		var nHeight = this._content.prop("scrollHeight")
		this._content.css("max-height", selected ? nHeight+"px" : "");
		this._content.ibxWidget("option", "disabled", !selected);

		//DO NOT MOVE THIS, MUST BE DONE AFTER HEIGHT ADJUSTMENT ABOVE!
		selected ? this.element.removeClass("acc-pg-closed") : this.element.addClass("acc-pg-closed");
		selected ? this._button.removeClass("acc-btn-closed") : this._button.addClass("acc-btn-closed");
		selected ? this._content.removeClass("acc-cnt-closed") : this._content.addClass("acc-cnt-closed");

		opts = $.extend({}, this.options.btnOptions, selected ? options.btnOptionsOpen : null);
		this._button.ibxButton("option", opts);
	}
});
$.ibi.ibxAccordionPage.statics = 
{
};

//# sourceURL=accordion.ibx.js

