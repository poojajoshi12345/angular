$.widget("ibi.mdTree", $.ibi.ibxWidget,
{
	options:
	{
		"expandedIcon":"ibx-icons ibx-glyph-minus-small",
		"collapsedIcon":"ibx-icons ibx-glyph-plus-small"		
	},	
	_widgetClass: "md-tree",
	_create: function ()
	{
		this._super();
		$.ibi.mdTreeNode.statics.expandedIcon =  this.options.expandedIcon;
		$.ibi.mdTreeNode.statics.collapsedIcon =  this.options.collapsedIcon;		
	},
	load: function(xmlObj)
	{
		var root = $(xmlObj).find("Master_DimensionTree");
		var node = this._buildTree(this.element, root);	
	},
	level:"",
	_buildTree: function(parent, xmlNode)
	{
		var xmlNode = $(xmlNode);
		var node = $("<div>").mdTreeNode({"text" : xmlNode.attr("label"), "isFolder": xmlNode.children().length > 0});
		parent.ibxWidget("add", node);		
		xmlNode.children().each(function(node,i, el) {
			this._buildTree(node, el);
		}.bind(this, node));

		return node;
	}
});


$.widget("ibi.mdTreeNode", $.ibi.ibxVBox,
{
	options:
	{
		"icons":"",
		"startExanded": true,
		"text":"",
		"glyphClasses":"",
		"isFolder": false
	},
	_widgetClass: "md-tree-node",
	_create: function ()
	{
		this._super();
		this._isOpen = this.options.startExanded;
		this._lineWrapper = $("<div>").ibxHBox().addClass("line-wrapper");
		this._wrapper = $("<div>").ibxHBox().addClass("node-wrapper");
		this._lineWrapper.ibxWidget("add", this._wrapper);
		this.nodeLabel = $("<div>").ibxLabel().addClass("node-label");
		this._wrapper.ibxWidget("add", this.nodeLabel);
		this.add(this._lineWrapper);
		this._wrapper.on("dblclick", this._onDoubleClick.bind(this));
		this._wrapper.on("click", this._onClick.bind(this));
	},
	_init: function ()
	{
		this._super();
		this._isOpen = this.options.startExanded;
		if (this.expanderIcon)
		{
			this.expanderIcon.on("click", function(e) {
				this.toggle();
			}.bind(this));
		}
		this.element.children(".md-tree-node").each(function(idx, el)
		{
			this.add(el);
		}.bind(this));
		this.refresh();
	},
	toggle: function()
	{
		this._isOpen = !this._isOpen;
		this.refresh();
	},
	hasChildren: function()
	{
		return this.element.children(".md-tree-node").length > 0; 
	},
	_onDoubleClick: function(e)
	{
		if (this.hasChildren())
			this.toggle();
	},
	_onClick: function(e)
	{
		this.select();
	},
	select: function(add)
	{
		if (!add)
			$(".node-selected").removeClass("node-selected");		
		this._wrapper.addClass("node-selected");
	},
	refresh: function()
	{
		this._super();		
		this.nodeLabel.ibxWidget("option", "text", this.options.text);
		
		if (this.options.glyphClasses != "")
		{
			if (!this.nodeIcon)
				this.nodeIcon = $("<div>").ibxLabel({"glyphClasses": this.options.glyphClasses}).addClass("node-icon");
			this._wrapper.ibxWidget("add", this.nodeIcon, this.nodeLabel, true, false);
		}	

		if (this.options.isFolder)
		{
			if (!this.expanderIcon)
			{
				this.expanderIcon = $("<div>").ibxLabel({"glyphClasses": this._isOpen ? $.ibi.mdTreeNode.statics.expandedIcon : $.ibi.mdTreeNode.statics.collapsedIcon}).addClass("folder-icon");
				var beforeEl = this.nodeIcon ? this.nodeIcon : this.nodeLabel;
				this.expanderIcon.insertBefore(this._wrapper);
			}
			else
				this.expanderIcon.ibxWidget("option", "glyphClasses", this._isOpen ? $.ibi.mdTreeNode.statics.expandedIcon : $.ibi.mdTreeNode.statics.collapsedIcon);
		}
		
		this.element.children(".md-tree-node").each(function(idx, el)
		{
			this._isOpen ? $(el).show() : $(el).hide();
		}.bind(this));		
	}
	
});
$.ibi.mdTreeNode.statics = {};
$.ibi.mdTreeNode.statics.expandedIcon = "ibx-icons ibx-glyph-minus-small";
$.ibi.mdTreeNode.statics.collapsedIcon = "ibx-icons ibx-glyph-plus-small";

//# sourceURL=mdTree.js