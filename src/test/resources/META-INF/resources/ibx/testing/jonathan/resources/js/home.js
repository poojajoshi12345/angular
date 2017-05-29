/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$( document ).on( "addanitem", function(e, item)
{																	
	itemlist.push(item);																					
});	

$( document ).on( "addafolderitem", function(e, item)
{										
	folderlist.push(item);																				
});


function openfolder(item)
{					
	var path=item.fullPath;	
	clearitems(path);
	rootItem._refresh(path);
	
};
function deletefolder(item)
{
};
function changefoldertitle(item)
{
};
function refreshfolder(item)
{
};

// run an item
function runIt(item)
{
	// check the type						
var uriExec;
if(item.type == "BIPWFCPortalItem")
{
	var pth = item.fullPath;
	var repstring = "IBFS:/WFC/Repository/";
	var i = pth.indexOf(repstring);
	if(i>-1)pth=pth.substring(i+repstring.length);
	i = pth.indexOf(".");
	if(i>-1)pth=pth.substring(0,i); 
	uriExec = applicationContext + "/portal/" + pth;																	
}
else
{
	uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", applicationContext,
			encodeURIComponent(item.parentPath), encodeURIComponent(item.name));
	}									
	window.open(uriExec);		
};
// edit an item						
function editIt(item)
{					
	var toolProperties=item.clientInfo.properties.tool;						
	if(toolProperties && (toolProperties.indexOf("infoAssist")>-1 || toolProperties.indexOf("DataVisualization")>-1 || toolProperties.indexOf("rotool")>-1
	|| toolProperties.indexOf("alert")>-1))
{
	var tool="report";
	if(toolProperties.indexOf("rotool")>-1)tool="reportingobject";					
	var fullitem=item.parentPath + item.name;
	var uriExec = sformat("{1}/ia?is508=false&&item={2}&tool={3}", applicationContext,
		encodeURIComponent(fullitem),tool);									
	window.open(uriExec);
}
else
{
	if(toolProperties == "editor")
	{
		var uriExec = sformat("{1}/tools/portlets/resources/markup/sharep/SPEditorBoot.jsp?folderPath={2}&description={3}&itemName={4}&isReferenced=true&type=item",			
			applicationContext,	encodeURIComponent(currentPath), item.description, item.name);									
		window.open(uriExec);
	}
	else
	{ 
		if(!toolProperties)toolProperties="";
		var message="Tool not implemented: " + toolProperties;
			warningmessage(message);								
		}	
	}				
};


$(document).on("doneadding", function(e)
	{
		buildviews();
	});
	
function buildviews()
{
	newitemsbox(newitemsboxsmall);
	$(".files-box-files").empty();			
	// build the image view...
	
	// folders						
	var ilen=folderlist.length;
	if(ilen > 0)
	{
		var folderslabel = ibxResourceMgr.getResource(".content-title-label-folders");
		$(".files-box-files").append(folderslabel);		
		
		for (i=0; i < ilen; i++)
		{								
			var ibfsitem=folderlist[i];														
			divstring = folderdiv(ibfsitem);	
			//$(".folders-box-folders").append(divstring);
			$(".files-box-files").append(divstring);																
		}

	}	
	// files					
	ilen=itemlist.length;											
	if(ilen > 0)
	{
		var fileslabel = ibxResourceMgr.getResource(".content-title-label-files");
		$(".files-box-files").append(fileslabel);							
															
	for (i=0; i<ilen; i++)
	{								
		var ibfsitem=itemlist[i];
		var glyph = "ibx-icons ibx-glyph-file-unknown";	
		if(ibfsitem.clientInfo.typeInfo)
		{	
			glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;
		}
		divstring = itemdiv(ibfsitem);
													
		$(".files-box-files").append(divstring);																			
		}						
		
	}						
							
	ibx.bindElements(".files-box-files");
								
	// build the list view....
	
	var glyphdescription="";
	var glyphdate="";
	$('#title-end').nextAll('div').remove();
	if(sortedvalue=="description")
	{
		glyphdescription="keyboard_arrow_up";
		if(sortedorder=="up")glyphdescription="keyboard_arrow_down";
	}
	else if(sortedvalue=="dateLastModified")
	{
		glyphdate="keyboard_arrow_up";
		if(sortedorder=="up")glyphdate="keyboard_arrow_down";
	}
	// update the sort order icons..
	$(".grid-title-col2").ibxLabel("option", "glyph", glyphdescription);
	$(".grid-title-col4").ibxLabel("option", "glyph", glyphdate);
	// clear the grid...
	$('#title-end').nextAll('div').remove();
	// add the folders
	ilen=folderlist.length;
	var glyph="fa fa-folder";
	var i=0;						
	if(ilen > 0)
	{
		for (i=0; i < ilen; i++)
		{								
			var ibfsitem=folderlist[i];
			//if(ibfsitem.description == "SKO 2017")
			//	debugger;							
			addgriditem(ibfsitem, glyph, true);												
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
			addgriditem(ibfsitem, glyph, false);											
		}
	}						
	//ibx.bindElements(".grid-main");										
};

function addgriditem(ibfsitem, glyph, folder)
{
		var d = new Date(ibfsitem.dateLastModified);
		var ddate = d.toLocaleDateString() + "  " + d.toLocaleTimeString();
		var summary = (ibfsitem.summary)? ibfsitem.summary : "None";
		var c = (folder)? " list-folder-icon ": "";
		var xfunction = (folder)? "foldermenu" : "filemenu";
		xfunction+="(this, '"+ ibfsitem.name +"');";
		
		
		//var label2 = $("<div>").ibxLabel 
		var gridcol1 = ibxResourceMgr.getResource(".cell-col1");
		if(c != "")$(gridcol1).addClass(c);
		var gridcol1_2= ibxResourceMgr.getResource(".cell-col1-2");							
		$(gridcol1_2).ibxLabel("option", "glyphClasses", glyph);
		$(gridcol1).append(gridcol1_2);
		var gridcol2 = ibxResourceMgr.getResource(".cell-col2");
		$(gridcol2).ibxLabel("option", "text", ibfsitem.description);
		var gridcol3 = ibxResourceMgr.getResource(".cell-col3");
		$(gridcol3).ibxLabel("option","text", summary);
		var gridcol4 = ibxResourceMgr.getResource(".cell-col4");
		$(gridcol4).ibxLabel("option","text", ddate);
		var gridcol5 = ibxResourceMgr.getResource(".cell-col5");
		$(gridcol5).attr('onClick', xfunction);
		$(".grid-main").append(gridcol1);
		$(".grid-main").append(gridcol2);
		$(".grid-main").append(gridcol3);
		$(".grid-main").append(gridcol4);
		$(".grid-main").append(gridcol5);													
};
					
// file item boxes	
function itemdiv(item)
{
	var glyphs = "ibx-icons ibx-glyph-file-unknown";	
	if(item.clientInfo.typeInfo)
	{	
		glyphs = item.clientInfo.typeInfo.glyphClasses;
	}
	var glyphdiv=sformat("<div class='image-icon' data-ibx-type='ibxLabel' data-ibxp-glyph-classes=' {1} '></div>", glyphs);							
	var divstring=sformat('<div class="file-item" <a><img class="item-image" src=" {1} "></a>', item.thumbPath);						
	var itemname = "'" + item.name + "'";
	divstring = divstring += sformat('<div data-ibx-type="ibxHBox" data-ibxp-align="stretch"> {1} <div class="image-text" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="{2}"></div> <div class="image-menu" 	onclick="filemenu(this,  {3} )" </div> </div></div>',
		glyphdiv, item.description, itemname);							
	
	return divstring;
};

// folder item boxes
function folderdiv(item)
{						
	var glyphdiv="<div class='folder-image-icon' data-ibx-type='ibxLabel'  data-ibxp-glyph-classes='fa fa-folder'></div>";
	var divstring='<div class="folder-item">';						
	var itemname = "'" + item.name + "'";
	divstring = divstring += sformat('<div data-ibx-type="ibxHBox" data-ibxp-align="stretch" class="folder-div"> {1} <div class="image-text" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="{2}"></div> <div class="image-menu" 	onclick="foldermenu(this,  {3} )" </div> </div></div>',
		glyphdiv, item.description, itemname);	
	return divstring;
}

$( document ).on( "clearitems", function(e, item)
{   
	clearitems(item.fullPath);
});

// clear all items and buld breadcrumb...
function clearitems(fullPath)
{
	//$(".files-box-files").empty();
//$(".folders-box-folders").empty();
//$(".grid-main").empty();
itemlist.length=0;
folderlist.length=0;						

// set the breadcrumb
currentPath=fullPath;
var pathitems=currentPath.split("/");
$(".crumb-box").empty();
var ilen=pathitems.length;
var start = 0;
var xpath = "";

for(i=0; i<ilen;i++)
{														
	var itemx = pathitems[i];
	xpath += itemx ;
	if(i < ilen-1)xpath+="/";							
if(start > 0)
{
	var crumbitem=crumbbutton(xpath,itemx);
	var carat = ' ';
	if(start > 1)carat = '&nbsp;>&nbsp;';							
	start++;								
	$(".crumb-box").append(carat);
	$(".crumb-box").append(crumbitem);
									
}
else 
	if(itemx == "WFC")start=1;
	}									
};

function crumbbutton(path, text)
{						
	var crumbitem = $("<div>").ibxLabel({"text":text}).data("ibfsPath", path).addClass("crumb-button");

$(crumbitem).on("click", function(e)
{							
	var path = $(this).data("ibfsPath");
		clearitems(path);
		rootItem._refresh(path);							
	});	
	return crumbitem;
};					

$( document ).on( "showitemmenu", function(e, ibfsitem, contextitem)
{					
	var options = 
	{
	my:"left top",
	at:"left bottom",
	of:contextitem
	};
	var edit_menu = ibxResourceMgr.getResource(".edit-menu");
	var initialized = $(edit_menu).data("initialized");
	$(edit_menu).data('ibxWidget').mimenuitemrun.data("ibfsitem",ibfsitem);
	$(edit_menu).data('ibxWidget').mimenuitemedit.data("ibfsitem",ibfsitem);	
	if(!initialized)
	{				
		$(edit_menu).data('ibxWidget').mimenuitemrun.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			runIt(ibfsitem);
			});									
		$(edit_menu).data('ibxWidget').mimenuitemedit.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			editIt(ibfsitem);							
		});
		$(edit_menu).data("initialized",true);
	}
	
	$(edit_menu).ibxContextMenu("open").position(options);
});	
	
$( document ).on( "showfoldermenu", function(e, ibfsitem, contextitem)
{					
	var options = 
	{
	my:"left top",
	at:"left bottom",
	of:contextitem
	};
	var folder_menu = ibxResourceMgr.getResource(".folder-menu");
	var initialized = $(folder_menu).data("initialized");
	$(folder_menu).data('ibxWidget').fomenuitemopen.data("ibfsitem",ibfsitem);
	$(folder_menu).data('ibxWidget').fomenuitemdelete.data("ibfsitem",ibfsitem);	
	$(folder_menu).data('ibxWidget').fomenuitemchangetitle.data("ibfsitem",ibfsitem);
	$(folder_menu).data('ibxWidget').fomenuitemrefresh.data("ibfsitem",ibfsitem);
	if(!initialized)
	{				
		$(folder_menu).data('ibxWidget').fomenuitemopen.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			openfolder(ibfsitem);
		});									
		$(folder_menu).data('ibxWidget').fomenuitemdelete.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			deletefolder(ibfsitem);							
		});
		$(folder_menu).data('ibxWidget').fomenuitemchangetitle.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			changefoldertitle(ibfsitem);							
		});
		$(folder_menu).data('ibxWidget').fomenuitemrefresh.on("ibx_menu_item_click",function(e)
		{
			var ibfsitem = $(e.target).data("ibfsitem");
			refreshfolder(ibfsitem);							
		});
		$(folder_menu).data("initialized",true);
	}
	
	$(folder_menu).ibxContextMenu("open").position(options);
});

function filemenu(contextitem, name)
{
	ilen=itemlist.length;						
	
	//find the name in itemlist...
	for (i=0; i<ilen; i++)
	{
		ibfsitem=itemlist[i];
		if(ibfsitem.name == name)	
		{					
			
			$(document).trigger( "showitemmenu", [ ibfsitem, contextitem] );
			break;
		}
	}	
};
function foldermenu(contextitem, name)
{
	ilen=folderlist.length;						
	
	//find the name in folderlist...
	for (i=0; i<ilen; i++)
	{
		ibfsitem=folderlist[i];
		if(ibfsitem.name == name)	
		{					
			
			$(document).trigger( "showfoldermenu", [ ibfsitem, contextitem] );
			break;
		}
	}	
};
				
function newIA(tool)
{
	if(currentPath == "")
	{
		warningmessage("This action requires that a folder be selected");						
	}
	else
	{
		var uriExec = sformat("{1}/ia?is508=false&&item={2}&tool={3}", applicationContext,
			encodeURIComponent(currentPath),tool);									
		window.open(uriExec);		
	}
};
function warningmessage(message)
{
	var options = 
		{
			type:"std information",
			caption: "New",
			buttons:"ok",
			messageOptions:
			{
				text: message
			}
		};
		var dlg = $.ibi.ibxDialog.createMessageDialog(options);
		dlg.ibxDialog("open");						
};
function newFolder()
{
		warningmessage("Not Implemented");
};
function newDomain()
{
		warningmessage("Not Implemented");
};
function newEditor()
{
		if(currentPath == "")
			warningmessage("This action requires that a folder be selected");
		else
		{	
			var uriExec = sformat("{1}/tools/portlets/resources/markup/sharep/SPEditorBoot.jsp?folderPath={2}&description=&itemName=&isReferenced=true&type=folder",			
				applicationContext,	encodeURIComponent(currentPath));									
			window.open(uriExec);
		}				
};
function newPage2()
{
		var uriExec = sformat("{1}/tools/pd/pd.jsp",applicationContext);
		window.open(uriExec);
};
	
function morebuttons()
{
		$(".create-new-box").css("height",newitemsheight[1]);
		newitemsboxsmall=false;
		newitemsbox(newitemsboxsmall);
};
function lessbuttons()
{
		$(".create-new-box").css("height",newitemsheight[0]);
		newitemsboxsmall=true;
		newitemsbox(newitemsboxsmall);
};
// sort all items
function sortitems(key)
{						
	  if(itemlist.length > 1 || folderlist.length > 1)
	  {	
	  	if(itemlist.length > 1)
	  		itemlist=sortit(key, itemlist);
		if(folderlist.length > 1)
			folderlist=sortit(key, folderlist);				  		
	  				  	
	  	$(document).trigger("doneadding");
	  }
}; 

function sortit(key, list)
{
	if(key == sortedvalue && sortedorder == "down")
	{
		// sort up...	
		if(key=="description")
		{								
			list.sort(function(a, b) 
			{								
				var nameA = a.description; 
				nameA=nameA.toLowerCase();
				var nameB = b.description;
				nameB=nameB.toLowerCase();									
				if (nameA < nameB)return -1;									
				if (nameA > nameB)return 1;  																			
				return 0;
			});
		}
		else if(key=="dateLastModified")
		{
			list.sort(function(a, b) 
			{								
				var nameA = a.dateLastModified; 
				var nameB = b.dateLastModified; 
				if (nameA < nameB)return -1;
				if (nameA > nameB)return 1;  																		
				return 0;
			});							
		}
		sortedorder = "up";							
	}
	else
	{
		// sort down....								
		if(key=="description")
		{								
			list.sort(function(a, b) 
			{								
				var nameA = a.description; 
				nameA=nameA.toLowerCase();
				var nameB = b.description;
				nameB=nameB.toLowerCase();										
				if (nameA < nameB)return 1;									
				if (nameA > nameB)return -1;  																			
				return 0;
			});
		}
		else if(key=="dateLastModified")
		{
			list.sort(function(a, b) 
			{								
				var nameA = a.dateLastModified; 
				var nameB = b.dateLastModified; 
				if (nameA < nameB)return 1;
				if (nameA > nameB)return -1;  																		
				return 0;
			});							
		}
		sortedorder = "down";
		sortedvalue = key;															
	}
	return list;
};

function newitemsbox(small)				
{
	// The 'create new' box...
	var buttonlist=[];
	var buttons = [
		["Folder", "fa fa-folder", "newFolder()", "yellow"],
		["Data Set","fa fa-upload", "", "green"],
		["Connect","fa fa-database", "","green"],
		["Chart","ibx-icons ibx-glyph-fex-chart", "newIA(\"chart\")", "purple"],
		["Visualization","fa fa-line-chart", "newIA(\"idis\")","purple"],
		["Report","ibx-icons ibx-glyph-fex", "newIA(\"report\")", "purple"],
		["Reporting Object","fa fa-cube", "newIA(\"reportingobject\")","purple"],
		["Sample Content","fa fa-pie-chart", "","purple"],
		["Page","ibx-icons ibx-glyph-page","newPage2()","teel"],
		["Portal","ibx-icons ibx-glyph-portal","", "teel"],
		["Alert","fa fa-bell","newIA(\"alert\")", "red"],
		["Text Editor","fa fa-pencil-square-o","newEditor()", "teel"],
		["URL","fa fa-external-link-square","","teel"],
		["Shortcut", "fa fa-link","","teel"],
		["Less","fa fa-ellipsis-h", "lessbuttons()","black"],
		["More","fa fa-ellipsis-h", "morebuttons()","black"],
		["Domain", "fa fa-folder", "newDomain()", "yellow"]
	];	
	if(currentPath=="" || currentPath.endsWith("Repository"))
	{
		buttonlist=[0,16];
	}	
	else if(small)
		buttonlist=[0,1,3,5,8,9,10,15];
	else
		buttonlist=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];

	
	$(".create-new-items-box").empty();
	
	var ilen = buttonlist.length;
	for (i=0; i<ilen; i++)
	{
		var k=buttonlist[i];
		divtext=createnewitembutton(buttons[k][0], buttons[k][1], buttons[k][2], buttons[k][3]);
		$(".create-new-items-box").append(divtext);
	}
	ibx.bindElements(".create-new-items-box");		
	
};
function createnewitembutton(text,image,clickevent,color)
{
	var divtext = sformat("<div class='create-new-item create-new-item-{1}' data-ibx-type='ibxButtonSimple' data-ibxp-text='{2}' data-ibxp-icon-position='top'  data-ibxp-glyph-classes='{3}' onclick='{4}' ></div>",
		color,text,image,clickevent);					
	return divtext;														
};				


