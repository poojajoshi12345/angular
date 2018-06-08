/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTreeSelectionManager", $.ibi.ibxSelectionManager,
{
	"options":
	{
		"type":1,
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"focusDefault":true,
		"escClearSelection":true,
		"focusResetOnBlur":false,
	},
	selectableChildren:function(selector)
	{
		var nodes = this.element.find(".tnode-label:visible");
		return selector ? nodes.filter(selector) : nodes;
	},
	mapToSelectable:function(el)
	{
		el = $(el).map(function(idx, el)
		{
			el = $(el)
			el = el.is(".ibx-tree-node") ? el.children(".tnode-label") : el.closest(".tnode-label", this.element);
			return el[0];
		}.bind(this));
		return el;
	},
	mapFromSelectable:function(el)
	{
		return $(el).closest(".ibx-tree-node", this.element);
	},
});

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
		"showRootNodes":true,
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
		var nodeEvents = "keydown keyup mousedown dblclick ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse ibx_selected";
		this.element.on(nodeEvents, this._onNodeEvent.bind(this));
		this.element.ibxMutationObserver({"listen":true, "subtree":true}).on("ibx_nodemutated", this._onChildrenChange.bind(this));
		this.element.ibxTreeSelectionManager();
	},
	_destroy:function()
	{
		this._super();
	},
	_onChildrenChange:function(e)
	{
		var mRecs = e.originalEvent.data;
		$(mRecs).each(function(idx, rec)
		{
			$(rec.addedNodes).each(function(idx, el)
			{
				var widget = $(el).data("ibxWidget");
				if(!widget)
					return;
				widget.refreshIndent(null, true);
			}.bind(this));
		}.bind(this));
	},
	treeNodes:function(selector)
	{
		return this.element.find(selector || ".ibx-tree-node");
	},
	active:function()
	{
		return this.navKeyActiveChild()[0];
	},
	anchor:function()
	{
		var anchor = this.treeNodes(".tnode-anchor");
		return anchor[0] || null;
	},
	_onNodeClickEvent:function(e)
	{
		if(!$(e.target).closest(".ibx-tree-node").is(this.element))
			return;

		var singleClickExpand = this.options.singleClickExpand;
		if(e.type == "dblclick" && !singleClickExpand)
			this.toggleExpanded();
		else
		if(e.type == "mousedown" && this.options.singleClickExpand)
			this.toggleExpanded();
	},
	_onNodeEvent:function(e)
	{
		var targetNode = $(e.target).closest(".ibx-tree-node");
		if(!targetNode.length)
			return;

		var options = this.options;
		var eType = e.type;

		if(eType == "ibx_collapse")
		{
			var selNodes = targetNode.ibxTreeNode("children").find(".ibx-sm-selected");
			this.element.ibxSelectionManager("selected", selNodes, false);
		}
	},
	refresh:function(withChildren)
	{
		this._super();
		if(withChildren)
			this.element.find(".ibx-tree-node").ibxWidget("refresh");
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var children = this.children();
		children.each(function(idx, child)
		{
			var childWidget = $(child).data("ibxWidget");
			childWidget.option("virtualParent", !options.showRootNodes);
		}.bind(this));
	}
});

$.widget("ibi.ibxTreeNode", $.ibi.ibxVBox, 
{
	options:
	{
		"virtualParent":false, //used for root nodes mostly...hides this node and makes children look like peers (not indented).
		"labelOptions":{},
		"btnCollapsed":"tnode-btn-collapsed",
		"btnExpanded":"tnode-btn-expanded",
		"singleClickExpand":false,
		"expanded":false,
		"container":false,
		"indent":null, //can override the default indent for this node

		"align":"stretch",

		"aria":
		{
			"role":"treeitem",
		}
	},
	_widgetClass:"ibx-tree-node",
	_createWidget:function(options, element)
	{
		//set the static default tree indent...do it this way so we can define via css.
		if($.ibi.ibxTreeNode.defaultIndent === null)
		{
			var rules = FindStyleRules(".tnode-indent");
			$.ibi.ibxTreeNode.defaultIndent = parseFloat(rules[rules.length-1].style.paddingLeft);
		}
		this._super(options, element);
	},
	_create:function()
	{
		var options = this.options;
		this._super();
		this.element.on("keydown", this._onNodeKeyEvent.bind(this)).on("mousedown click dblclick", this._onNodeMouseEvent.bind(this));
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element).data("ibxTreeNode", this.element);
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-btn'>").prependTo(this.nodeLabel).on("mousedown click", this._onBtnExpandClick.bind(this));

		//add the markup children correctly.
		this._childBox = $("<div class='tnode-children'>").ibxVBox().appendTo(this.element);
		var nodes = this.element.children(".ibx-tree-node");
		options.container = options.container || nodes.length;//children from markup turn this into a container by default.
		this.add(nodes);
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		this.hasChildren() ? this._childBox.attr("role", "group") : this._childBox.removeAttr("role");
		this.element.attr("aria-expanded", options.expanded);
		return aria
	},
	_destroy:function()
	{
		this._super();
	},
	children:function(selector)
	{
		return this._childBox.ibxWidget("children", selector || ".ibx-tree-node");
	},
	add:function(el, elSibling, before, refresh)
	{
		this._childBox.ibxWidget("add", el, elSibling, before, refresh)
		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		this._childBox.ibxWidget("remove", el, destroy, refresh);
		if(refresh)
			this.refresh();
	},
	depth:function()
	{
		return this.element.parents(".ibx-tree-node:not(.tnode-virtual-parent)").length;	
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
	_onNodeKeyEvent:function(e)
	{
		if(e.keyCode === $.ui.keyCode.RIGHT)
		{
			if(!this.expanded())
				this.toggleExpanded(true);
			else
				this.children().first().find(".tnode-label").focus();
			e.stopPropagation();
		}
		else
		if(e.keyCode === $.ui.keyCode.LEFT)
		{
			if(this.expanded())
				this.toggleExpanded(false);
			else
				$(this.parentNode()).children(".tnode-label").focus();
			e.stopPropagation();
		}
	},
	_onNodeMouseEvent:function(e)
	{
		var eType = e.type;
		if(eType == "click" && this.options.singleClickExpand)
			this.toggleExpanded();
		else
		if(eType == "dblclick")
			this.toggleExpanded();
	},
	_onBtnExpandClick:function(e)
	{
		if(e.type == "click")
			this.toggleExpanded();
		e.stopPropagation();//click/mousedown on button should not change tree selection...this stops that
	},
	toggleExpanded:function(expand)
	{
		expand = (expand === undefined) ? !this.options.expanded : expand;
		this.expanded(expand);
	},
	expanded:function(expanded)
	{
		if(expanded === undefined)
			return this.options.expanded;

		//only expand containers...stops unneeded refreshes!
		if(this.options.container)
			this.option("expanded", expanded);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = (this.options[key] != value);
		if(key == "expanded" && changed && options.container)
		{
			var tree = this.tree();
			var eType = value ? "ibx_beforeexpand" : "ibx_beforecollapse";
			var evt = this.element.dispatchEvent(eType, null, true, true, tree);
			if(!evt.defaultPrevented)
			{
				this._super(key, value);
				eType = value ? "ibx_expand" : "ibx_collapse";
				this.element.dispatchEvent(eType, null, true, false, tree);
			}
		}
		else
			this._super(key, value);
	},
	refresh:function(withChildren)
	{
		this._super();
		if(withChildren && this.options.expanded)
			this.children().ibxWidget("refresh", true);
	},
	refreshIndent:function(depth, withChildren)
	{
		var newDepth = depth || this.depth();
		var options = this.options;
		var indent = (options.indent !== null) ? options.indent : $.ibi.ibxTreeNode.defaultIndent;
		this.nodeLabel.css("paddingLeft", newDepth * indent);
		if(withChildren)
			this.children().ibxWidget("refreshIndent", depth, withChildren);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var children = this.children();
		var showLabel = (options.container && options.virtualParent) ? false : true;

		this.refreshIndent();//indent this node correctly under parent.

		this.nodeLabel.ibxWidget("option", options.labelOptions).css("display", !showLabel ? "none" : "");
		this.element.toggleClass("tnode-virtual-parent", options.virtualParent).toggleClass("tnode-is-container", options.container).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.removeClass(options.btnCollapsed).removeClass(options.btnExpanded);
		if(options.container)
			(options.expanded) ? this.btnExpand.addClass(options.btnExpanded) : this.btnExpand.addClass(options.btnCollapsed);
	
	}
});
$.ibi.ibxTreeNode.defaultIndent = null;
//# sourceURL=tree.ibx.js
