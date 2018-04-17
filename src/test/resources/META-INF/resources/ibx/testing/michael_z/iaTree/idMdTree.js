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
		if (obj instanceof Document)
		{
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
		else
		{
			var type;
			if (this.options.measuresOnly)
				type = 'MEASURES';
			else if (this.options.dimensionsOnly)
				type = 'DIMENSIONS';
			else if (this.options.filtersOnly)
				type = 'FILTERS';
			var root;
			if (type)
			{
				root = walk(obj, type);
				if (root == null)
					console.log("Could not find " + type);
			}
			if (root == null)
				root = this._super(obj);
			if (!this.options.showTopLevel)
				return root.branch;
			else
				return root;
			function walk(obj, type)
			{
				for (var key in obj) 
				{
					if (obj.hasOwnProperty(key))
					{
						if (key == "branchType" && obj[key] == type)
							return obj;
						if (typeof obj[key] == 'object')
						{
							var root = walk(obj[key], type);
							if (root)
								return root;
						}
					}
				}
				return null;
			}
		}
	}
});

//# sourceURL=idMdTree.js