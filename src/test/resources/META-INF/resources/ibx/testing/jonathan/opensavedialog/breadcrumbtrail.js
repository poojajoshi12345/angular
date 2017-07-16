/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.breadCrumbTrail", $.ibi.ibxHBox,
{
    options:
    { 	
    	currentPath: "",    
        isPhone: false,
        items: null,
        refreshFolder: null,
        thisContext: null,
    },
    _widgetClass: "bread-crumb-trail",
    _caratChar: "",
    _create: function()
    {
    	this._super();
    	this._caratChar = ibx.resourceMgr.getResource(".right-carat");
    },
    _destroy:function()
    {    	
    	this._super();
    },
    refresh: function()
	{
		this._super();
		if(!this.options.items || !this.options.thisContext)return;
		this.element.empty();
		var currentPath = this.options.currentPath;
		if(currentPath.charAt(currentPath.length-1)=="/")
			currentPath=currentPath.substring(0, currentPath.length-1);
		var pathitems=currentPath.split("/");
		
		var ilen=pathitems.length;
		var start = 0;
		var xpath = "";
		var startItem = -1;		
		var caratChar = this._caratChar;
		
		if(this.options.isPhone && ilen > 3)
		{	
			startItem = ilen - 3;	
		}	
		var children = [];

		for(i=0; i < ilen; i++)
		{														
			var itemx = pathitems[i];
			xpath += itemx ;
			if(i < ilen - 1)xpath+="/";	
		
			if(start > 0 && i >= startItem)
			{
				// try to get the description...
				var item = this.options.items.findallFoldersByPath(xpath);
				var title = itemx;
				if(item)title = item.description
				if(i == startItem)itemx="...";
				else if(item)itemx = item.description;			
				var crumbitem=this._crumbbutton(xpath, itemx, title);			
				var carat = ' ';
				if(start > 1)carat = this._caratMenu(children);
				
				start++;								
				if(start > 1 && i < ilen)this.element.append(carat);
				this.element.append(crumbitem);
				
				// find all children of this path...
				children = this.options.items.findAllChildFoldersByPath(xpath);
				
												
			}
			else 
				if(itemx == "WFC")start=1;
		}
		
	},



	_crumbbutton: function(path, text, title)
	{
								
		var crumbitem = $("<div>").ibxButtonSimple({"text":text}).data("ibfsPath", path).addClass("crumb-button").prop("title",title);		
		
		$(crumbitem).on("click", this.options.refreshFolder.bind(this.options.thisContext,path));
		return crumbitem;
		
	},


	_caratMenu: function(ichildren)
	{
		
		var carat = ibx.resourceMgr.getResource(".right-carat");
		if(ichildren.length > 0)
		{
			$(carat).data("ichildren", ichildren);
			$(carat).data("options", this.options);	
			
			$(carat).click(function(e)
			{
				var options = 
				{
						my: "left top",
						at: "right bottom",
						collision: "fit",
						of:e
				};	
				
			
				// create the menu....
			
				var cmenu = $("<div>").ibxMenu();
				var ichildren = $(this).data("ichildren");
				var xoptions = $(this).data("options");				
				for (i=0; i < ichildren.length; i++)
				{			
					var cmenuitem = $("<div>").ibxMenuItem();
					cmenuitem.ibxMenuItem("option", "text", ichildren[i].description);	
					// is this item on the currentPath?
					var ii = xoptions.currentPath.indexOf(ichildren[i].fullPath);
					if(ii >= 0)cmenuitem.css("font-weight","bold");	
					//cmenuitem.data("ibfsPath",ichildren[i].fullPath);
					//cmenuitem.data("options", xoptions);	
					var path = ichildren[i].fullPath;					
					cmenuitem.on("ibx_menu_item_click", xoptions.refreshFolder.bind(xoptions.thisContext,path));
					cmenu.append(cmenuitem);							
				}			
				cmenu.ibxMenu("open").position(options);	
			});
		}	
		return carat;	
	}
});
