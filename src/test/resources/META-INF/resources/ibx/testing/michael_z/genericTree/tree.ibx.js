$.widget("ibi.ibxTreeNode", $.ibi.ibxVBox,
{
	options:
	{
		"expandedIcon":"ibx-icons ibx-glyph-minus-small",
		"collapsedIcon":"ibx-icons ibx-glyph-plus-small",
		"icons":"",
		"startExanded": true,
		"text":"",
		"glyphClasses":""
	},
	_widgetClass: "ibx-tree-node",
	_create: function ()
	{
		this._super();
		debugger;
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
		this.expanderIcon.on("click", function(e) {
			this.toggle();
		}.bind(this));		
		this.element.children(".ibx-tree-node").each(function(idx, el)
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
		return this.element.children(".ibx-tree-node").length > 0; 
	},
	isFolder: function()
	{
		return this.hasChildren();
	},
	_onDoubleClick: function(e)
	{
		if (this.isFolder)
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

		if (!this.expanderIcon)
		{
			this.expanderIcon = $("<div>").ibxLabel({"glyphClasses": this._isOpen ? this.options.expandedIcon : this.options.collapsedIcon}).addClass("folder-icon");
			var beforeEl = this.nodeIcon ? this.nodeIcon : this.nodeLabel;
			this.expanderIcon.insertBefore(this._wrapper);
		}
		else
			this.expanderIcon.ibxWidget("option", "glyphClasses", this._isOpen ? this.options.expandedIcon : this.options.collapsedIcon);
		
		if (this.hasChildren() && this.expanderIcon)
			this.expanderIcon.show();
		else if (this.expanderIcon)
			this.expanderIcon.hide();
			
		this.element.children(".ibx-tree-node").each(function(idx, el)
		{
			this._isOpen ? $(el).show() : $(el).hide();
		}.bind(this));		
	}
	
});