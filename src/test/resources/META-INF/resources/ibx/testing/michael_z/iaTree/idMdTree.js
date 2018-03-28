$.widget("ibi.idMdTree", $.ibi.mdTree,
{
	options:
	{
		"measuresOnly" : false,
		"dimensionsOnly": false,
		"filtersOnly" : false,
		"showTopLevel" : false,
		"expansionLevels" : 1
	},	
	_widgetClass: "id-md-tree",
	_create: function ()
	{
		this._super();
	},
	allowDraggable: function(node)
	{
		if (this._isFromXMLSource)
			return node.attr("dragType") == "levelhierarchy" || node.attr("colNumber") != undefined;
		else
			return node.dragType == "levelhierarchy" || node.colNumber != undefined; 
	},
	_getRoot: function(obj)
	{
		var root;
		if (this.options.measuresOnly)
			root = $(obj).find("[branchType='MEASURES']");
		else if (this.options.dimensionsOnly)
			root = $(obj).find("[branchType='DIMENSIONS']");
		else if (this.options.filtersOnly)
			root = $(obj).find("[branchType='FILTERS']");
		else
			root = this._super(obj);
		if (!this.options.showTopLevel)
			return root.children();
		else
			return root;
	}	
});

//# sourceURL=idMdTree.js