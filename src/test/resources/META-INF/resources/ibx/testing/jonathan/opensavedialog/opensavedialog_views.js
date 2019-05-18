/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.9 $:


function buildviews(item_container, grid_container, folderlist, itemlist, columns, sortedorder, sortedvalue, sortedvaluetype,
			sortCallBack, selectedCallBack, setCallBack, bSearch,
			openFolderCallBack, runCallBack, isMobile, isPhone, foldermenu, filemenu, thisContext, fileSingleClick, sortFieldMenu, columnmenu)
{
	
	var divitem;	
	$(item_container).empty();
	$(grid_container).empty();
	// build the image view...
	
	// folders						
	var ilen=folderlist.length;
	if(ilen > 0)
	{
		var folderslabel = ibx.resourceMgr.getResource(".content-title-label-folders");			
		$(item_container).append(folderslabel);		
		
		for (i=0; i < ilen; i++)
		{								
			var ibfsitem=folderlist[i];	
			
			divitem = $("<div></div>");
			divitem.itembox({item: ibfsitem, mobile: isMobile, 
				context: foldermenu, 
				doubleclick: openFolderCallBack,
				toggleSelected: selectedCallBack,
				setCallBack: setCallBack,
				thisContext: thisContext				
			});		
			$(item_container).append(divitem);			
		}
		
		
	}	
	// files					
	ilen=itemlist.length;											
	if(ilen > 0)
	{
		var fileslabel = ibx.resourceMgr.getResource(".content-title-label-files");
		var flabel = $(fileslabel);		
		if(folderlist.length == 0)
		{					
			$(item_container).append(flabel);									
		}
		else
		{			
			$(flabel).find(".content-title-btn-name").hide();
			$(flabel).find(".content-title-btn-arrow").hide();
			$(item_container).append(flabel);				
		}
		for (i=0; i<ilen; i++)
		{								
			var ibfsitem=itemlist[i];
			var glyph = "ibx-icons ibx-glyph-file-unknown";	
			if(ibfsitem.clientInfo.typeInfo)
			{	
				glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;
			}			
			divitem = $("<div></div>");
			$(divitem).itembox(
						{
							item: ibfsitem,
							mobile: isMobile, 
							context: filemenu, 
							doubleclick: runCallBack,
							toggleSelected: selectedCallBack, 
							setCallBack: setCallBack,
							fileSingleClick: fileSingleClick,
							bSearch: bSearch,
							thisContext: thisContext
							
						}
					);				
			$(item_container).append(divitem);			
		}
	}						
	updateTitleButtons(item_container, sortedorder, sortedvalue, sortedvaluetype, columns, thisContext, sortFieldMenu, sortCallBack);						
	ibx.bindElements(item_container);	
	
	var showColumns = [];
	for(i=0; i < columns.length; i++)
	{	
		columns[i][4]="";
		if(columns[i][2].toLowerCase() == sortedvalue.toLowerCase())columns[i][4] = sortedorder;
		//if(coumns[i][1])=="menu" && !home_globals.isMobile)columns[i][3] = false;
		showColumns[i]=columns[i][3];
		if(!isMobile && columns[i][1] == "menu")showColumns[i] = false;
		else if(isPhone && i != 1 && columns[i][1] != "menu" && columns[i][1] != "icon")showColumns[i] = false;
		
	}
	
	
	// initialize the grid and add titles.
	var grid=new filegrid();

	grid.init(grid_container, columns, sortCallBack, selectedCallBack, setCallBack, 
			showColumns, openFolderCallBack, runCallBack, isMobile, thisContext, fileSingleClick, columnmenu );
	
	
	// add the folders
	ilen=folderlist.length;
	var glyph="fa fa-folder";
	var i=0;
	var row=0;
	
	if(ilen > 0)
	{
		for (i=0; i < ilen; i++)
		{								
			var ibfsitem=folderlist[i];										
			addgriditem(grid, ibfsitem, glyph, true, row);
			row++;
		}							
	}
	
	// add the files
	ilen=itemlist.length;
	
	if(ilen > 0)
	{						
		for (i=0; i<ilen; i++)
		{								
			var ibfsitem=itemlist[i];
			var glyph = "ibx-icons ibx-glyph-file-unknown";	
			if(ibfsitem.clientInfo.typeInfo)
			{	
				glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;
			}
			addgriditem(grid, ibfsitem, glyph, false, row);
			row++;
		}
	}
	
	
									
};
function addgriditem(grid, ibfsitem, glyph, folder, row)
{
	var summary = (ibfsitem.summary)? ibfsitem.summary : "N/A";
	var d = new Date(ibfsitem.lastModified);
	var ddate = d.toLocaleDateString() + "  " + d.toLocaleTimeString();
	d = new Date(ibfsitem.createdOn);
	var ddate2 = d.toLocaleDateString() + "  " + d.toLocaleTimeString();
	var data=
		[
		 glyph,
		 "",
		 ibfsitem.description,
		 ibfsitem.name,
		 summary,
		 ddate,
		 ddate2,
		 ibfsitem.length,
		 ibfsitem.createdBy,
		 "fa fa-ellipsis-v"	 
		];
	grid.addrow(data, ibfsitem, folder, row);	
};
function updateTitleButtons(item_container, sortedorder, sortedvalue, sortedvaluetype, columns, thisContext, sortFieldMenu, sortItems)
{
	var sortedvalueText = "";
	
	for(i=0; i < columns.length; i++)
	{	
		columns[i][4]="";
		if(columns[i][2].toLowerCase() == sortedvalue.toLowerCase())sortedvalueText = columns[i][0];		
	}	
	if(sortedorder == "up")sorticon="arrow_upward";
	else if(sortedorder == "down")sorticon="arrow_downward";
	
	$(".content-title-label-folders").find(".content-title-btn-arrow").ibxWidget("option", "disabled", sortedvalue == "default");
	$(".content-title-label-files").find(".content-title-btn-arrow").ibxWidget("option", "disabled", sortedvalue == "default");	
	
	$(".content-title-label-folders").find(".content-title-btn-name").ibxWidget("option", "text", sortedvalueText);
	$(".content-title-label-folders").find(".content-title-btn-arrow").ibxWidget("option", "glyph", sorticon);	
	$(".content-title-label-files").find(".content-title-btn-name").ibxWidget("option", "text", sortedvalueText);
	$(".content-title-label-files").find(".content-title-btn-arrow").ibxWidget("option", "glyph", sorticon);
	
	var theButton = $(".content-title-label-folders").find(".content-title-btn-name");
	$(theButton).on("click", sortFieldMenu.bind(thisContext,theButton));
	
	theButton = $(".content-title-label-files").find(".content-title-btn-name");
	$(theButton).on("click", sortFieldMenu.bind(thisContext,theButton));
	
	theButton = $(".content-title-label-folders").find(".content-title-btn-arrow");
	$(theButton).on("click", sortItems.bind(thisContext, sortedvalue, sortedvaluetype, true));
	
	theButton = $(".content-title-label-files").find(".content-title-btn-arrow");
	$(theButton).on("click", sortItems.bind(thisContext, sortedvalue, sortedvaluetype, true));
	
	
};
					
