/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget( "ibi.itembox",
{
	options:
	{
		item: null,
		mobile: false,
		context: null,
		doubleclick: null,
		toggleSelected: null,
		setCallBack: null,
		fileSingleClick: null,
		bSearch: null,
		thisContext: null
	},	


	_create: function ()
	{		
		if(this.options.item.container && this.options.item.type != "PGXBundle")
		{			
			this._folderdiv();			
		}	
		else
		{	
			this._itemdiv();			
		}	
	},	

	//folder item boxes
	_folderdiv: function()
	{		
		var options = this.options;
		var item = options.item;
		this.element.addClass("folder-item");
		this.element.contextmenu(function() {	
			options.toggleSelected(item, 3);
			options.context(this, item);
		});
		
		var glyphdiv="<div class='folder-image-icon' data-ibx-type='ibxLabel'  data-ibxp-glyph-classes='fa fa-folder'></div>";
		
		var ellipsisdivstring="<div class='image-menu2'></div>";
		var ellipsisdiv;
		if(options.mobile)
		{	
			ellipsisdivstring='<div class="image-menu2" data-ibxp-glyph-classes="fa fa-ellipsis-v" data-ibx-type="ibxLabel"	</div>';
			ellipsisdiv = $(ellipsisdivstring);
			ellipsisdiv.click(function(){
				options.toggleSelected(item, 3);
				options.context(this, item);
			});
		}
		else ellipsisdiv = $(ellipsisdivstring);
				
		hboxdivstring = '<div data-ibx-type="ibxHBox" data-ibxp-align="stretch" class="folder-div"  ></div>';
		hboxdiv = $(hboxdivstring);
		hboxdiv.append(glyphdiv);
		
		imagetextstring = '<div class="image-text folder-image-text" data-ibx-type="ibxLabel" data-ibxp-justify="center"></div>';
		imagetext = $(imagetextstring);
		ibx.bindElements(imagetext);
		imagetext.ibxWidget("option", "text", item.description);
		hboxdiv.append(imagetext);
		hboxdiv.append(ellipsisdiv);
		this.element.append(hboxdiv);
		
		
		
		if(!options.mobile)this.element.on("dblclick", options.doubleclick.bind(this.options.thisContext,item));
		
		this.element.click(function(event)
		{
				var key=0;
				if (event.ctrlKey || event.metaKey)key=1;
				if (event.shiftKey)key=2;
				var isSelected = options.toggleSelected(item, key);
				
		});
		options.setCallBack(item.fullPath, this.element, false);
		
		this.element.on( "selectSet", function( event ) {
			$(this).addClass("folder-item-selected");
		});
		this.element.on( "selectUnset", function( event ) {
			
			$(this).removeClass("folder-item-selected");
		});
	},
	
	// file item boxes	
	_itemdiv: function()
	{
		var options = this.options;
		var item = options.item;
		var glyphs = "ibx-icons ibx-glyph-file-unknown";	
		if(item.clientInfo.typeInfo)
		{	
			glyphs = item.clientInfo.typeInfo.glyphClasses;
		}
		// is this a default image?
		
		var imageClass="item-image";
		if(item.thumbPath.indexOf("ibi_html") > 0)
			{			
				imageClass = "item-image-default";
			}
		
		
		var ellipsisdivstring="<div class='image-menu2'></div>";
		var ellipsisdiv;
		if(options.mobile)
		{	
			ellipsisdivstring = '<div class="image-menu2" data-ibxp-glyph-classes="fa fa-ellipsis-v" data-ibx-type="ibxLabel"	</div>';
			ellipsisdiv = $(ellipsisdivstring);
			ellipsisdiv.click(function(){
				options.toggleSelected(item, 3);
				options.context(this, item);
			});
		}
		else ellipsisdiv = $(ellipsisdivstring);		
		
		var d = new Date(item.lastModified);
		var ddate = d.toLocaleDateString() + "  " + d.toLocaleTimeString();
		var itemhbox = "<div class='file-item-hbox' data-ibx-type='ibxHBox' data-ibxp-align='stretch'></div>";
		var jitemhbox = $(itemhbox);
		var tooltip="";		
		if(options.bSearch)
		{	
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP1");
			tooltip = sformat(tooltipText, item.description, item.fullPath,ddate);
		}	
		else
		{
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP2");
			tooltip = sformat(tooltipText, item.description, ddate);			
		}
		var glyphdivstring = sformat("<div class='image-text' data-ibx-type='ibxLabel'  data-ibxp-text='{2}' data-ibxp-glyph-classes='{1}' {3} ></div>", 
				glyphs, item.description, tooltip);
		
		var jglyphdiv = $(glyphdivstring);	
		
		var summary = item.summary ? item.summary: "";
		var divstring=sformat('<div class="file-item" data-ibx-type="ibxWidget"  <a> <img  class="{2}" src=" {1} " ></a><div class="file-item-text-box">{3}</div></div>', 
					item.thumbPath, imageClass, summary);		
		var jitembox = $(divstring);
		$(jitemhbox).append(jglyphdiv);
		if(options.mobile)$(jitemhbox).append(ellipsisdiv);
		$(jitembox).append(jitemhbox);
		$(jitembox).find(".file-item-text-box").hide();
		
		this.element.append(jitembox);	

		if(item.summary)
		{	
			this.element.hover(function()
			{
				
				$(this).find(".file-item-text-box").show();
			    
			    }, function(){	    	
			    
			    $(this).find(".file-item-text-box").hide();	
			});
		}
		
		
		
		
		this.element.on("click", function(event)				
		{
			var key=0;
			if (event.ctrlKey || event.metaKey)key=1;
			if (event.shiftKey)key=2;		
			options.toggleSelected(item,key);
		});
		if(options.fileSingleClick)this.element.on("click", options.fileSingleClick.bind(this.options.thisContext,item));		
		this.element.contextmenu(function() {
			options.toggleSelected(item, 3);
			options.context(this, item);
		});
		if(!options.mobile)this.element.on("dblclick", options.doubleclick.bind(this.options.thisContext,item));
		//if(!options.mobile)this.element.dblclick(function() {			
		//	  options.doubleclick.bind(options.thisContext,item);
		//});
		options.setCallBack(item.fullPath, this.element, false);
		
		this.element.on( "selectSet", function( event ) {			
			$(this).find(".file-item-hbox").addClass("folder-item-selected");
		});
		this.element.on( "selectUnset", function( event ) {
			
			$(this).find(".file-item-hbox").removeClass("folder-item-selected");
		});
				
	}
});
