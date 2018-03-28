$.widget("ibi.mdTree", $.ibi.ibxWidget,
{
	options:
	{
		"root": "dataSourceId"
	},	
	_widgetClass: "md-tree",
	_create: function ()
	{
		this._super();
	},
	_getRoot: function(obj)
	{
		var root = $(obj).find("[dataSourceId]");
		return root;
	},
	load: function(obj)
	{
		if (obj instanceof Document)
		{
			this._isFromXMLSource = true;
			var root = this._getRoot(obj);
			this._buildTreeFromDom(this.element, root);
		}
		else //json
		{
			this._isFromXMLSource = false;
			for (var key in obj) 
			{
				if (obj.hasOwnProperty(key))
				{
					var root = obj[key];
					this._buildTreeFromJson(this.element, root);
					break;
				}
			}						
		}
	},
	level:"",
	_buildTreeFromJson: function (parent, obj)
	{
		var isFolder = obj.branch != undefined || obj.leaf != undefined;
		var typeAttr = obj.nodeType;
		var type = typeAttr ? typeAttr.toLowerCase() : "folder"; 
		var title = obj.title || obj.label;
		var node = $("<div>").mdTreeNode({"text" : title, "isFolder": isFolder, "fieldType": type});
		node.ibxWidget("setData", {"qualifiedName": obj.qualifiedName});
		node.ibxWidget("option", "draggable", this.allowDraggable(obj));
		parent.ibxWidget("add", node);
		
		var children = obj.leaf ? (obj.branch ? obj.leaf.concat(obj.branch) : obj.leaf) : obj.branch;
		var numberOfLeaves = children ? children.length : 0;  
		for (var i=0;i<numberOfLeaves;++i)
		{
			this._buildTreeFromJson(node, children[i]);
		}
		return node;
	},
	_buildTreeFromDom: function(parent, xmlNode)
	{
		var xmlNode = $(xmlNode);
		var isFolder = xmlNode.children().length > 0;
		var typeAttr = xmlNode.attr("nodeType");
		var type = typeAttr ? typeAttr.toLowerCase() : "folder";
		var title = xmlNode.attr("title") || xmlNode.attr("label"); 
		var node = $("<div>").mdTreeNode({"text" : title, "isFolder": isFolder, "fieldType": type});
		node.ibxWidget("setData", {"qualifiedName": xmlNode.attr("qualifiedName")});
		node.ibxWidget("option", "draggable", this.allowDraggable(xmlNode));
		parent.ibxWidget("add", node);
		xmlNode.children().each(function(node,i, el) {
			this._buildTreeFromDom(node, el);
		}.bind(this, node));

		return node;
	},
	allowDraggable: function()
	{
		return true;
	}
});

$.widget("ibi.genericTreeNode", $.ibi.ibxVBox,
{
	options:
	{
		"collapsedIcon": "ibx-icons ibx-glyph-plus-small",
		"expandedIcon" :"ibx-icons ibx-glyph-minus-small",
		"icons":"",
		"startExanded": true,
		"text":"",
		"glyphClasses":"",
		"isFolder": false,
		"draggable": false
	},
	_widgetClass: "generic-tree-node",
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
		
		this.element.on("ibx_dragstart", this.onDragEvent.bind(this)); 
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
		this.element.children(".generic-tree-node").each(function(idx, el)
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
		return this.element.children(".generic-tree-node").length > 0; 
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
	setData: function(data)
	{
		this._data = data;
	},
	select: function(add)
	{
		if (!add)
			$(".node-selected").removeClass("node-selected");		
		this._wrapper.addClass("node-selected");
	},
	onDragEvent: function(e) 
	{
		if (!this.options.draggable)
			return;
		var target = $(e.currentTarget);
		var dt = e.dataTransfer;
		if(e.type == "ibx_dragstart")
		{
			console.log(this.options.text);
			dt.setData("dragItem", this._data);
		}
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
				this.expanderIcon = $("<div>").ibxLabel({"glyphClasses": this._isOpen ? this.options.expandedIcon : this.options.collapsedIcon}).addClass("folder-icon");
				var beforeEl = this.nodeIcon ? this.nodeIcon : this.nodeLabel;
				this.expanderIcon.insertBefore(this._wrapper);
			}
			else
				this.expanderIcon.ibxWidget("option", "glyphClasses", this._isOpen ? this.options.expandedIcon : this.options.collapsedIcon);
		}
		
		this.element.children(".generic-tree-node").each(function(idx, el)
		{
			this._isOpen ? $(el).show() : $(el).hide();
		}.bind(this));		
	}
	
});

$.widget("ibi.mdTreeNode", $.ibi.genericTreeNode,
{
	options:
	{
		"fieldType": ""
	},
	_create: function ()
	{
		this._super();
		this.options.glyphClasses = "ibx-icons " + $.ibi.mdTreeNode.statics.ICONS[this.options.fieldType];
	}
});

$.ibi.mdTreeNode.statics = {
		
		ICONS:
		{
			"measure": "ibx-glyph-measure",
			"dimension": "ibx-glyph-dimension",
			"folder": "ibx-glyph-folder-o",
			"hierarchy": "ibx-glyph-hierarchy",
			"date": "ibx-glyph-date",
			"georole": "ibx-glyph-geo",
			"filter": "ibx-glyph-filter"
		}

};




//# sourceURL=mdTree.js