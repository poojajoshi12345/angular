/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.93 $:

$.widget("ibi.ibxTreeSelectionManager", $.ibi.ibxSelectionManager,
{
	"options":
	{
		"type":"single",
		"toggleSelection":false,
		"escClearSelection":true,
	},
	_onMouseEvent:function(e)
	{
		//clicking on the node's button...or if the node is editing...then don't do normal selection stuff!
		var target = $(e.target);
		var nodeBtn = target.is(".tnode-btn");
		var isEditing = this.mapToSelectable(e.target).ibxWidget("isEditing");
		if(!nodeBtn && !isEditing)
			this._super(e);
	},
	_onKeyDown:function(e)
	{
		if([$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT].indexOf(e.keyCode) == -1)
		{
			var nodeLabel = this.mapToSelectable(e.target);
			var isEditing = nodeLabel.ibxWidget("isEditing");
			if(!isEditing)
				this._super(e);
		}
	},
	mapToSelectable:function(el)
	{
		el = $(el).map(function(idx, el)
		{
			el = $(el);
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
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyResetFocusOnBlur":false,
		"focusDefault":true,
		"selType":"single",
		"showRootNodes":true,
		"singleClickExpand":false,
		"inline":true,
		"align":"stretch",
		"aria":
		{
			"role":"tree",
		}
	},
	_widgetClass:"ibx-tree",
	_create:function()
	{
		this._super();
		this.element.ibxMutationObserver({"listen":true, "subtree":true}).on("ibx_nodemutated", this._onChildrenChange.bind(this));
		this.element.ibxTreeSelectionManager();
		this.add(this.children());
	},
	_destroy:function()
	{
		this._super();
	},
	add:function(el, elSibling, before, refresh)
	{
		$(el).ibxAddClass("tnode-root");
		this._super(el, elSibling, before, refresh);
	},
	remove:function(el, destroy, refresh)
	{
		this.children().filter(el).ibxRemoveClass("tnode-root");
		this._super(el, destroy, refresh);
	},
	rootNodes:function()
	{
		return this.children(".tnode-root");
	},
	_onChildrenChange:function(e)
	{
		var mRecs = e.originalEvent.data;
		$(mRecs).each(function(idx, rec)
		{
			$(rec.addedNodes).each(function(idx, el)
			{
				var widget = $(el).data("ibxWidget");
				if(!widget || !widget.element.is(".ibx-tree-node"))
					return;
				widget.refreshIndent(null, true);
			}.bind(this));
		}.bind(this));
	},
	treeNodes:function(selector)
	{
		return this.element.find(selector || ".ibx-tree-node");
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
		this.element.ibxSelectionManager("option", "type", options.selType);
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
		"expanded":false,
		"container":false,
		"indent":null, //can override the default indent for this node

		"align":"stretch",

		"aria":{}
	},
	_widgetClass:"ibx-tree-node",
	_createWidget:function(options, element)
	{
		//set the static default tree indent...do it this way so we can define via css.
 		if($.ibi.ibxTreeNode.defaultIndent === null)
		{
			var tmp = $("<div class='tnode-indent' style='display:none'>");
			tmp.appendTo("body");
			$.ibi.ibxTreeNode.defaultIndent = parseFloat(tmp.css("paddingLeft"));
			tmp.remove();
		}
		this._super(options, element);
	},
	_create:function()
	{
		var options = this.options;
		this._super();
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element).data("ibxTreeNode", this.element);
		this.nodeLabel.on("keydown click dblclick", this._onNodeLabelEvent.bind(this));
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
		aria = this._super(accessible, aria);
		var options = this.options;
		var ariaOptions = 
		{
			"accessible": accessible,
			"role":"treeitem",
			"level": this.depth() + 1,
		}
		options.container ? (ariaOptions.expanded = this.expanded()) : null;
		this.nodeLabel.ibxWidget("option", "aria", ariaOptions);
		return aria;
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
		this._childBox.ibxWidget("add", el, elSibling, before, refresh);
		$(el).data("ibxTreeParent", this.element[0]);
		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		this.children().filter(el).removeData("ibxTreeParent");
		this._childBox.ibxWidget("remove", el, destroy, refresh);
		if(refresh)
			this.refresh();
	},
	isEditing:function()
	{
		return this.nodeLabel.is(".ibx-content-editing");
	},
	startEditing:function(editOptions)
	{
		this.nodeLabel.data("ibxWidget")._text.ibxEditable().ibxEditable("startEditing", editOptions);
	},
	stopEditing:function(revertToOriginal)
	{
		if(this.nodeLabel.is(".ibx-editable"))
			this.nodeLabel.ibxEditable("stopEditing", revertToOriginal);

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
		var parent = this.element.data("ibxTreeParent");
		return parent ? parent : null;
	},
	hasChildren:function()
	{
		return !!this._childBox.children(".ibx-tree-node").length;
	},
	singleClickExpand:function()
	{
		return $(this.tree()).ibxWidget("option", "singleClickExpand");
	},
	_onNodeLabelEvent:function(e)
	{
		var options = this.options;
		var eType = e.type;

		var ibxType = "ibx_" + eType;
		var ibxEvent = this.element.dispatchEvent(ibxType, e, true, true);
		if(!ibxEvent.isDefaultPrevented())
		{
			if(eType == "click" && this.singleClickExpand())
				this.toggleExpanded();
			else
			if(eType == "dblclick")
				this.toggleExpanded();
			else
			if(eType == "keydown")
			{
				if(this.nodeLabel.ibxWidget("isEditing"))
				{
					e.stopPropagation();
					return;
				}
				if(e.keyCode === $.ui.keyCode.RIGHT)
				{
					if(!this.expanded())
						this.toggleExpanded(true);
					else
						this.children().first().find(".tnode-label").first().focus();
				}
				else
				if(e.keyCode === $.ui.keyCode.LEFT)
				{
					if(this.expanded())
						this.toggleExpanded(false);
					else
						$(this.parentNode()).children(".tnode-label").first().focus();
				}
			}
		}
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
	_onExpanded:$.noop,
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
				this._onExpanded(value);
			}
		}
		else
			this._super(key, value);
	},
	isRoot:function()
	{
		return this.element.is(".tnode-root");
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
		this.setAccessibility();
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
		this.element.ibxToggleClass("tnode-virtual-parent", options.virtualParent).ibxToggleClass("tnode-is-container", options.container).ibxToggleClass("tnode-expanded", options.expanded);
		this.element.ibxToggleClass("tnode-has-parent", !!this.element.data("ibxTreeParent"));
		this.btnExpand.ibxToggleClass("tnode-btn-root", this.isRoot()).ibxRemoveClass([options.btnCollapsed, options.btnExpanded]);
		if(options.container)
			(options.expanded) ? this.btnExpand.ibxAddClass(options.btnExpanded) : this.btnExpand.ibxAddClass(options.btnCollapsed);
	}
});
$.ibi.ibxTreeNode.defaultIndent = null;


$.widget("ibi.ibxTreeBrowser", $.ibi.ibxVBox, 
{
	options:
	{
		"swipeNavigation":true,
		"scrollChildren":true,
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyResetFocusOnBlur":false,
		"focusDefault":true,
		"selType":"single",
		"inline":true,
		"align":"stretch",
		"aria":
		{
			"role":"tree",
		}
	},
	_widgetClass:"ibx-tree-browser",
	_create:function()
	{
		this._super();
		var options = this.options;
		this.element.ibxMutationObserver({"listen":true, "subtree":true}).on("ibx_nodemutated", this._onChildrenChange.bind(this));
		this.element.ibxAddClass("ibx-tree").on("swiperight", this._onTreeSwipeEvent.bind(this)).ibxTreeSelectionManager();
		this.add(this.children());
	},
	_destroy:function()
	{
		this._super();
	},
	add:function(el, elSibling, before, refresh)
	{
		var curRoot = this.children(".tnode-root").ibxRemoveClass("tnode-root");
		this.remove(curRoot);
		
		$(el).ibxAddClass("tnode-root");
		this._super(el, elSibling, before, refresh);
		this.element.ibxSelectionManager("deselectAll", true, true).ibxSelectionManager("selected", el, true).ibxSelectionManager("focus", el, true);
		$(el).ibxTreeNode("expanded", true).ibxTreeNode("refreshIndent", 0, true);
		this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		this.children().ibxRemoveClass("tnode-root");
		this._super(el, destroy, refresh);
	},
	_onChildrenChange:function(e)
	{
		var mRecs = e.originalEvent.data;
		$(mRecs).each(function(idx, rec)
		{
			$(rec.addedNodes).each(function(idx, el)
			{
				var widget = $(el).data("ibxWidget");
				if(!widget || !widget.element.is(".ibx-tree-node"))
					return;
				widget.refreshIndent(null, true);
			}.bind(this));
		}.bind(this));
	},
	_onTreeSwipeEvent:function(e)
	{
		if(this.options.swipeNavigation)
			this.children(".tnode-root").ibxWidget("expanded", false);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.children(".tnode-root").ibxToggleClass("tnode-scroll-children", options.scrollChildren);
	}
});

$.widget("ibi.ibxTreeBrowserNode", $.ibi.ibxTreeNode, 
{
	options:
	{
	},
	_widgetClass:"ibx-tree-browser-node",
	_create:function()
	{
		var options = this.options;
		this._super();
		this.element.data("ibiIbxTreeNode", this);
		this.nodeLabel.on("swipeleft", this._onNodeLabelEvent.bind(this));
		this.add(this.children());
	},
	_destroy:function()
	{
	},
	_onNodeLabelEvent:function(e)
	{
		var tree = $(this.tree());
		if(e.type == "dblclick" && this.options.isRoot)
			return;
		else
		if(e.type == "swipeleft" && tree.ibxWidget("option", "swipeNavigation"))
			this.expanded("false");
		this._super(e);
	},
	_onExpanded:function(expanded)
	{
		var tree = $(this.tree()).data("ibxWidget");
		if(expanded)
		{
			this.element.after("<div class='ibx-tree-node-placeholder'>");//replace this node with a placeholder
			tree.add(this.element);//make this node the tree root
		}
		else
		{
			tree.remove(this.element);//correctly removes this from tree...like .tnode-root
			var parent = this.element.data("ibxTreeParent");//get it's current  parent
			$(parent).ibxWidget("add", this.element, ".ibx-tree-node-placeholder").ibxWidget("remove", ".ibx-tree-node-placeholder");//add back and kill placeholder.
			tree.add(parent);//move up a level...make parent the root.
		}
	},
	_setOption:function(key, value)
	{
		//can't collapse the top tree node...nowhere to run to, baby...nowhere to hide!
		if(key == "expanded" && this.isRoot() && !this.parentNode())
			value = true;
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var isRoot = this.isRoot();

		///move the expand/collapse button depending on whether it's the root node.
		isRoot ? this.btnExpand.prependTo(this.nodeLabel) : this.btnExpand.appendTo(this.nodeLabel);
	}
});

//# sourceURL=tree.ibx.js
