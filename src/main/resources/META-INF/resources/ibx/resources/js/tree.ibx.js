/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
		"navKeyRoot":true,
		"navKeyDir":"vertical",
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
	},
	_destroy:function()
	{
		this._super();
	},
	navKeyChildren:function(selector)
	{
		return this.element.find(".ibx-tree-node-label:ibxFocusable(-1)");
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
		"buttonOptionsCollapsed":{"glyphClasses":"ibx-tree-node-btn-collapsed"},
		"buttonOptionsExpanded":{"glyphClasses":"ibx-tree-node-btn-expanded"},
		"hasChildren":false,
		"expanded":false,
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
		this.element.attr("tabindex", -1);

		this.nodeLabel = $("<div tabindex='-1' class='ibx-tree-node-label'>").ibxLabel().appendTo(this.element);
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='ibx-tree-node-button'>").ibxButtonSimple().prependTo(this.nodeLabel).on("click", this._toggleExpanded.bind(this));

		this._childBox = $("<div tabindex='-1' class='ibx-tree-node-children'>").ibxVBox({"focusDefault":true}).appendTo(this.element);
		var childNodes = this.element.children(".ibx-tree-node");
		childNodes.appendTo(this._childBox);
		options.hasChildren = !!childNodes.length;
	},
	_destroy:function()
	{
		this._super();
	},
	_toggleExpanded:function(e)
	{
		this.option("expanded", !this.options.expanded);
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();

		this.nodeLabel.ibxWidget("option", options.labelOptions);
		this.element.toggleClass("ibx-tree-node-has-children", options.hasChildren);
		this.element.toggleClass("ibx-tree-node-expanded", options.expanded);
		this.btnExpand.ibxWidget("option", options.expanded ? options.buttonOptionsExpanded : options.buttonOptionsCollapsed);
		this.btnExpand.toggleClass("ibx-tree-node-btn-hidden", !options.hasChildren);
	}
});
$.widget("ibi.ibxTreeRootNode", $.ibi.ibxTreeNode, {"_widgetClass":"ibx-tree-root-node"}); 

//# sourceURL=tree.ibx.js

