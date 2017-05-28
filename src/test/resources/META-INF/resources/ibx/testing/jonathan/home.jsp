<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>WebFOCUS Home Page</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<Script src="resources/js/tree_home.js" type="text/javascript"></script>
		
		

		<script type="text/javascript">
			var itemlist=[];
			var folderlist=[];
			var currentPath='';
			
			var newitemsboxsmall=true;
			var rootItem=null;
			var newitemsheight=["141px","282px","30px"];
			var boxItems='';
			var newitemsshown=true;
			var sortedvalue="description";
			var sortedorder="up";
			
			
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{		
				debugger;	
					var loaded = Ibfs.load("<%=request.getContextPath()%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val);
					loaded.done(function(ibfs)
					{
						var path="<%=request.getParameter("path")%>";
						if(path=="null")path="IBFS:/WFC/Repository";
						if(path.indexOf("IBFS:") == -1)
							path = "IBFS:/WFC/Repository/"+path;						
						rootItem = new IbfsRootItem(ibfs,path);
						$(".ibfs-tree").append(rootItem.getElement());			
					});
					
					// hide items on smaller windows...
					if ($(this).width() < 1100) {
						hideitems();										
  					}  					
    				$(window).resize(function() {
						if ($(this).width() < 1100) {						
							hideitems();						        
  						} 
  						else 
  						{
  							showitems();  							  
    					}
					});
					
					// hide tree and new items box
					function hideitems()
					{
						$('.ibfs-tree').hide();
    					$('.tree-button-box').hide(); 
    					$('.create-new-items-box').hide();    					
						$(".create-new-box").hide();	
						$(".content-title-btn").hide();
						$(".content-title-btn2").hide();		
							
					};
					// show tree and new items box
					function showitems()
					{
						$('.ibfs-tree').show();
						$('.tree-button-box').show();						
						$(".create-new-box").show();						
						if(newitemsshown)
						{									
							$('.create-new-items-box').show();					
							
							var size=(newitemsboxsmall)?newitemsheight[0]:newitemsheight[1];
							$(".create-new-box").css("height",size);
							
						}	
						$(".content-title-btn").show();
						$(".content-title-btn2").hide();   
					};
					
					$( document ).on( "addanitem", function(e, item)
					{																	
						itemlist.push(item);																					
					});	
					
					$( document ).on( "addafolderitem", function(e, item)
					{										
						folderlist.push(item);																				
					});	
					
					$(document).on("doneadding", function(e)
					{
						buildviews();
					});
					
					function buildviews()
					{
						debugger;
						
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
							//ibx.bindElements(".folders-box-folders");	
						}	
						// files					
						ilen=itemlist.length;											
						if(ilen > 0)
						{
							
							
								var fileslabel = ibxResourceMgr.getResource(".content-title-label-files");
								$(".files-box-files").append(fileslabel);
								//files_label = $(".content-title-label-files");					
																						
							for (i=0; i<ilen; i++)
							{								
								var ibfsitem=itemlist[i];
								var glyph = "ibx-icons ibx-glyph-file-unknown";	
								if(ibfsitem.clientInfo.typeInfo)
								{	
									glyph = ibfsitem.clientInfo.typeInfo.glyphClasses
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
									glyph = ibfsitem.clientInfo.typeInfo.glyphClasses
								}
								addgriditem(ibfsitem, glyph, false);											
							}
						}						
						ibx.bindElements(".grid-main");										
					};
					
					function addgriditem(ibfsitem, glyph, folder)
					{
							var d = new Date(ibfsitem.dateLastModified);
							var ddate = d.toLocaleDateString() + "  " + d.toLocaleTimeString();
							var summary = (ibfsitem.summary)? ibfsitem.summary : "None";
							var c = (folder)? " list-folder-icon ": "";
							var xfunction = (folder)? "foldermenu" : "filemenu";
							
							
							//var label1 = $("<div>").ibxLabel({ glyphClasses: glyph, col:1});							
							//label1.addClass("flex-grid-cell list-icon-col " + c);
							//var label2 = $("<div>").ibxLabel 
								
							var toadd = sformat("<div class='flex-grid-cell list-icon-col {1} ' data-ibx-col='1' ><div data-ibx-type='ibxLabel' data-ibxp-glyph-classes='	{2} '></div></div>", c, glyph);			
							toadd += sformat("<div class='flex-grid-cell' data-ibx-col='2'> {1} </div>", ibfsitem.description);	
							toadd += sformat("<div class='flex-grid-cell' data-ibx-col='3'> {1} </div>", summary);
							toadd += sformat("<div class='flex-grid-cell' data-ibx-col='4'> {1} </div>", ddate);
							toadd += sformat("<div class='flex-grid-cell cell-image' data-ibxp-glyph-classes='fa fa-ellipsis-v' data-ibx-type='ibxLabel' data-ibx-col='5' onclick= ' {1} (this, \"{2}\");'></div>",
								xfunction, ibfsitem.name);								
							$(".grid-main").append(toadd);												
					};
										
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
					
					// file item boxes	
					function itemdiv(item)
					{
						var glyphs = "ibx-icons ibx-glyph-file-unknown";	
						if(item.clientInfo.typeInfo)
						{	
							glyphs = item.clientInfo.typeInfo.glyphClasses
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
					
					
					// run an item
					function runIt(item)
					{
						// check the type						
						var uriExec;
						if(item.type == "BIPWFCPortalItem")
						{
							var pth = item.fullPath;
							var repstring = "IBFS:/WFC/Repository/"
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
					
					$(".files-listing").hide();
					$(".tree-showcollapse-button").hide();
					
					$(".btn-how-view").on("click", function(e)
					{
						$(".files-listing").toggle();
						$(".folders-box-folders").toggle();
						$(".files-box-files").toggle();
						var isVisible = $('.files-box-files').is(':visible');
						if (isVisible)
						{
							$(".files-box").css("background-color","#e4f1f9");
							//$(".content-title-bar").show();
						}	
						else
						{
							$(".files-box").css("background-color","white");
							//$(".content-title-bar").hide();
						}	
					});
					
					
					
					$(".content-title-btn2").hide();
					
					$(".content-title-btn").on("click", function(e)
					{
						//$(".create-new-items-box").toggle();
						$(".create-new-items-box").hide();
						$(".create-new-box").css("height",newitemsheight[2]);
						$(".content-title-btn").hide();
						$(".content-title-btn2").show();
						newitemsshown=false;		
					});	
					$(".content-title-btn2").on("click", function(e)
					{
						$(".create-new-items-box").show();
						$(".content-title-btn2").hide();
						$(".content-title-btn").show();					
					
						var size=(newitemsboxsmall)?newitemsheight[0]:newitemsheight[1];
						$(".create-new-box").css("height",size);
						newitemsshown=true;								
					});
					
					$(".tree-collapse-button").on("click", function(e)
					{
						$(".ibfs-tree").toggle();
						$(".tree-collapse-button").toggle();
						$(".tree-showcollapse-button").toggle();						
					});
					$(".tree-showcollapse-button").on("click", function(e)
					{
						$(".ibfs-tree").toggle();
						$(".tree-collapse-button").toggle();
						$(".tree-showcollapse-button").toggle();						
					});
					$(".btn-refresh").on("click", function(e)
					{
						if(currentPath != "")
						{
							clearitems(currentPath);
							rootItem._refresh(currentPath);
						}
					});
										
					$( document ).on( "showitemmenu", function(e, ibfsitem, contextitem)
					{					
						var options = 
						{
						my:"left top",
						at:"left bottom",
						of:contextitem
						}
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
						}
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
						
					// display the new items box
					newitemsbox(newitemsboxsmall);
					
						
			}, ["../testing/jonathan/resources/home_bundle.xml"], true);		
			
		</script>
		<script src="resources/js/home.js" type="text/javascript"></script>	
		
		
		<link rel="stylesheet" type="text/css" href="resources/css/tree_home.css">
		<link rel="stylesheet" type="text/css" href="resources/css/home.css">
	</head>
	<body class="ibx-root">		
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="title-label" data-ibx-type="ibxLabel" data-ibxp-text="Content"></div>
			</div>

			<div class="toolbar" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="crumb-box" data-ibx-type="ibxHBox" data-ibxp-align="center">				
					<div data-ibx-type="ibxLabel" data-ibxp-text="Repository >"></div>				
				</div>
				<div class="toolbar-spacer"></div> 
				<div class="txt-search" data-ibx-type="ibxTextField" data-ibxp-placeholder="Search..."></div>
				<div class="btn-how-view" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="list" data-ibxp-glyph-classes="material-icons"></div>
				<div class="btn-refresh" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="autorenew" data-ibxp-glyph-classes="material-icons"></div>
			</div>

			<div class="explore-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="ibfs-tree"></div>
				<div class="tree-button-box" data-ibxp-align="center">
					<div class="tree-button-spacer"></div>
					<div class="tree-collapse-button" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="keyboard_arrow_left" data-ibxp-glyph-classes="material-icons" ></div>
					<div class="tree-showcollapse-button" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="keyboard_arrow_right" data-ibxp-glyph-classes="material-icons" ></div>
				</div>								
				<div class="content-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div class="create-new-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					
			 			<div class="content-title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
							<div class="content-title-label" data-ibx-type="ibxLabel" data-ibxp-text="Create New"></div>
							<div class="content-title-spacer"></div>
							<div class="content-title-btn" data-ibx-type="ibxButtonSimple"  data-ibxp-glyph="keyboard_arrow_up" data-ibxp-glyph-classes="material-icons"></div>
							<div class="content-title-btn2" data-ibx-type="ibxButtonSimple"  data-ibxp-glyph="keyboard_arrow_down" data-ibxp-glyph-classes="material-icons"></div>
						</div>
						
						<div class="create-new-items-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-wrap="true">
							
						</div>						
					</div>

					<div class="files-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<%--
						<div class="content-title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
							<div class="content-title-label" data-ibx-type="ibxLabel" data-ibxp-text="Files"></div>
							<div class="content-title-spacer"></div>
							<div class="content-title-btn" data-ibx-type="ibxButtonSimple" data-ibxp-text="Title" data-ibxp-icon-position="right" data-ibxp-glyph="keyboard_arrow_up" data-ibxp-glyph-classes="material-icons"></div>
						</div>
					--%>
					
						<div class="files-box-files"  data-ibx-type="ibxHBox" data-ibxp-wrap="true" >
						
						</div>	
						
						
							<div class="files-listing" data-ibx-name="tabFlexGrid" >															
								<div class="grid-main" data-ibx-type="ibxGrid" data-ibxp-cols="30px auto auto auto auto" >
								
								
								<div class='flex-grid-cell-title grid-title-col1' data-ibx-col='1'></div>
								<div class='flex-grid-cell-title grid-title-col2' data-ibx-col='2' 								
								onclick="sortitems('description')" 
								data-ibxp-justify="left" data-ibxp-align="left"
								data-ibxp-glyph='keyboard_arrow_up' data-ibxp-glyph-classes='material-icons' data-ibx-type='ibxLabel'								 
								data-ibxp-text='Title' data-ibxp-icon-position='right' >
								</div>
								<div class='flex-grid-cell-title grid-title-col3' data-ibx-col='3' data-ibx-type="ibxLabel" data-ibxp-text="Summary"></div>
								<div class='flex-grid-cell-title grid-title-col4' data-ibx-col='4' onclick="sortitems('dateLastModified')"						
									data-ibxp-icon-position='right' data-ibxp-glyph='keyboard_arrow_up'
									data-ibxp-glyph-classes='material-icons' data-ibx-type='ibxLabel' 
									data-ibxp-text='Last Modified Date'>
								</div>						
								<div id="title-end" class='flex-grid-cell-title grid-title-col5' data-ibx-col='5'></div>
								
																			    
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</body>
</html>



