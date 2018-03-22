$.widget("ibi.idMdTree", $.ibi.mdTree,
{
	options:
	{
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
	}
});

//# sourceURL=idMdTree.js