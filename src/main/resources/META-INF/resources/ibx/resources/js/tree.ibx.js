/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyResetFocusOnBlur":false,
		"focusDefault":".ibx-tree-node",
		"inline":true,
		"align":"stretch",
		"aria":
		{
			"role":"tree",
			"readonly":true
		}
	},
	_widgetClass:"ibx-tree",
	NODE_EVENTS: "ibx_nodeactivate ibx_nodedeactivate ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse",
	_create:function()
	{
		this._super();
		this.element.on(this.NODE_EVENTS, this._onNodeEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	add:function()
	{
	},
	remove:function()
	{
	},
	navKeyChildren:function(selector)
	{
		return this.element.find(".ibx-tree-node:ibxFocusable(-1)").filter(selector || "*");
	},
	rootNode:function()
	{
	},
	selectedNode:function()
	{
		return this.navKeyChildActive();
	},
	activeNode:function()
	{
		return this.navKeyChildren().find(".ibx-tnode-active")[0] || null;
	},
	_onNodeEvent:function(e)
	{
		//don't let the events bubble past the tree.
		e.stopPropagation();
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
		this.element.find(".ibx-tree-node").ibxWidget("refresh");
	}
});

$.widget("ibi.ibxTreeNode", $.ibi.ibxVBox, 
{
	options:
	{
		"labelOptions":{},
		"btnCollapsed":"tnode-btn-collapsed",
		"btnExpanded":"tnode-btn-expanded",
		"expanded":false,
		"container":"auto",
		"indent":null,

		"align":"stretch",
		"aria":
		{
			"role":"listitem",
		}
	},
	_widgetClass:"ibx-tree-node",
	_createWidget:function(options, element)
	{
		//set the static default tree indent...do it this way so we can define via css.
		if($.ibi.ibxTreeNode.defaultIndent === null)
			$.ibi.ibxTreeNode.defaultIndent = parseFloat(FindStyleRules(".tnode-indent")[0].style.paddingLeft);
		this._super(options, element);
	},
	_create:function()
	{
		var options = this.options;
		this._super();
		this.element.attr("tabindex", -1).on("ibx_widgetfocus", this._onWidgetFocsusIn.bind(this));
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element);
		this.nodeLabel.on("dblclick", this._onLabelDblClick.bind(this)).on("keydown", this._onLabelKeyEvent.bind(this));
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-button'>").prependTo(this.nodeLabel).on("click", this._onBtnExpandClick.bind(this));

		//add the markup children correctly.
		this._childBox = $("<div class='tnode-children'>").ibxVBox().appendTo(this.element);
		this.add(this.element.children(".ibx-tree-node"));
	},
	_destroy:function()
	{
		this._super();
	},
	add:function(el, elSibling, before, refresh)
	{
		this._childBox.ibxWidget("add", el, elSibling, before, refresh)
	},
	remove:function(el, destroy, refresh)
	{
		this._childBox.ibxWidget("remove", el, destroy, refresh);
	},
	_onWidgetFocsusIn:function(e)
	{
		this.nodeLabel.focus();
	},
	depth:function()
	{
		return this.element.parents(".ibx-tree-node").length;	
	},
	tree:function()
	{
		return this.element.closest(".ibx-tree")[0];
	},
	parentNode:function()
	{
		return this.element.parents(".ibx-tree-node").first()[0];
	},
	hasChildren:function()
	{
		return !!this._childBox.children(".ibx-tree-node").length;
	},
	_onLabelKeyEvent:function(e)
	{
		var options = this.options;
		if(e.keyCode === $.ui.keyCode.RIGHT)
		{
			if(!options.expanded)
				this._toggleExpanded(true);
			else
				this._childBox.children(":first-child").focus();
		}
		else
		if(e.keyCode === $.ui.keyCode.LEFT)
		{
			if(options.expanded)
				this._toggleExpanded(false);
		}
		else
		if(e.keyCode === $.ui.keyCode.ENTER)
			this._activate(true);
	},
	_onLabelDblClick:function(e)
	{
		this._toggleExpanded();
	},
	_onBtnExpandClick:function(e)
	{
		this._toggleExpanded();
	},
	_toggleExpanded:function(expand)
	{
		expand = (expand === undefined) ? !this.options.expanded : expand;
		this.option("expanded", expand);
	},
	active:function()
	{
		return this.element.is(".ibx-tnode-active");
	},
	_activate:function(activate)
	{
		var tree = this.tree();
		if(this.active() && !active)
			this.element.dispatchEvent("ibx_nodeactivate", null, true, true, tree);
		this.element.toggleClass("ibx-tnode-active", activate).dispatchEvent("ibx_nodeactivate", null, true, true, tree);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = (this.options[key] != value);
		if(changed && key == "expanded")
		{
			var tree = this.tree();
			var eType = value ? "ibx_beforeexpand" : "ibx_beforecollapse";
			var evt = this.element.dispatchEvent(eType, null, true, true, tree);
			if(!evt.defaultPrevented)
			{
				this._super(key, value);
				eType = value ? "ibx_expand" : "ibx_collapse";
				this.element.dispatchEvent(eType, null, true, true, tree);
			}
		}
		else
			this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var children = this.children();
		var container = (options.container == "auto") ? this.hasChildren() : options.container;
		var indent = options.indent || $.ibi.ibxTreeNode.defaultIndent;
		
		this.nodeLabel.ibxWidget("option", options.labelOptions).css("padding-left", this.depth() * indent);
		this.element.toggleClass("tnode-is-container", options.container).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.toggleClass(options.btnCollapsed, container && !options.expanded).toggleClass(options.btnExpanded, container && options.expanded)
	}
});
$.ibi.ibxTreeNode.defaultIndent = null;

$.widget("ibi.ibxTreeRootNode", $.ibi.ibxTreeNode, {"_widgetClass":"ibx-tree-root-node"}); 

//# sourceURL=tree.ibx.js

