/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
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

		this.nodeLabel = $("<div class='ibx-tree-node-label'>").ibxLabel().appendTo(this.element);
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		this.btnExpand = $("<div class='ibx-tree-node-button'>").ibxButtonSimple().prependTo(this.nodeLabel);

		this._childBox = $("<div class='ibx-tree-node-children'>").ibxVBox().appendTo(this.element);
		var childNodes = this.element.children(".ibx-tree-node");
		childNodes.appendTo(this._childBox);
		options.hasChildren = !!childNodes.length;
	},
	_destroy:function()
	{
		this._super();
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();

		this.nodeLabel.ibxWidget("option", options.labelOptions);
		this.element.toggleClass("ibx-tree-node-has-children", options.hasChildren);
		this.element.toggleClass("ibx-tree-node-expanded", options.expanded);

		var glyph = options.expanded ? "remove" : "add";
		this.btnExpand.ibxWidget("option",{"glyph":glyph, "glyphClasses":"material-icons"}).css("visibility", options.hasChildren ? "visible" : "hidden");

	}
});
$.widget("ibi.ibxTreeRootNode", $.ibi.ibxTreeNode, {"_widgetClass":"ibx-tree-root-node"}); 

//# sourceURL=tree.ibx.js

