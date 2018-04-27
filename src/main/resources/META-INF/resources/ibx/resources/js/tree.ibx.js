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
	_create:function()
	{
		this._super();
		this.element.on("ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse", this._onNodeExpandEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	navKeyChildren:function(selector)
	{
		return this.element.find(".tnode-label:ibxFocusable(-1)").filter(selector || "*");
	},
	activeNode:function()
	{
		return this.navKeyChildren().filter(".ibx-nav-key-item-active")[0] || null;
	},
	selectedNode:function()
	{
		return this.navKeyChildren().filter(".tnode-selected")[0] || null;
	},
	_onNodeExpandEvent:function(e)
	{
		//don't let the events bubble past the tree.
		e.stopPropagation();
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
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
		"aria":
		{
			"role":"listitem",
		}
	},
	_widgetClass:"ibx-tree-node",
	_create:function()
	{
		var options = this.options;
		this._super();
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element);
		this.nodeLabel.on("dblclick", this._onLabelDblClick.bind(this)).on("keydown", this._onLabelKeyEvent.bind(this));
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-button'>").prependTo(this.nodeLabel).on("click", this._onBtnExpandClick.bind(this));

		this._childBox = $("<div class='tnode-children'>").ibxVBox().appendTo(this.element);
		var childNodes = this.element.children(".ibx-tree-node");
		childNodes.appendTo(this._childBox);
	},
	_destroy:function()
	{
		this._super();
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
		{
		}
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
		var container = (options.container == "auto") ? this.hasChildren() : options.container;

		this.nodeLabel.ibxWidget("option", options.labelOptions);
		this.element.toggleClass("tnode-is-container", options.container).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.toggleClass(options.btnCollapsed, container && !options.expanded).toggleClass(options.btnExpanded, container && options.expanded)
	}
});
$.widget("ibi.ibxTreeRootNode", $.ibi.ibxTreeNode, {"_widgetClass":"ibx-tree-root-node"}); 

//# sourceURL=tree.ibx.js

