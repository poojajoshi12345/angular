$.widget("ibi.idMdTree", $.ibi.mdTree,
{
	options:
	{
		"measuresOnly" : false,
		"dimensionsOnly": false,
		"filtersOnly" : false
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
		if (this.options.measuresOnly)
			return $(obj).find("[branchType='MEASURES']");
		else if (this.options.dimensionsOnly)
			return $(obj).find("[branchType='DIMENSIONS']");
		else if (this.options.filtersOnly)
			return $(obj).find("[branchType='FILTERS']");
		else
			return this._super(obj);
	}	
});

//# sourceURL=idMdTree.js