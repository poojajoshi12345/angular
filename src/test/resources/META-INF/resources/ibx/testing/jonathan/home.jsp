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
		<Script src="tree_home.js" type="text/javascript"></script>
		
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
						var initialized = $(".edit-menu").data("initialized");
						$(".edit-menu").data('ibxWidget').mimenuitemrun.data("ibfsitem",ibfsitem);
						$(".edit-menu").data('ibxWidget').mimenuitemedit.data("ibfsitem",ibfsitem);	
						if(!initialized)
						{				
							$(".edit-menu").data('ibxWidget').mimenuitemrun.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								runIt(ibfsitem);
								});									
							$(".edit-menu").data('ibxWidget').mimenuitemedit.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								editIt(ibfsitem);							
							});
							$(".edit-menu").data("initialized",true);
						}
						
						$(".edit-menu").ibxContextMenu("open").position(options);
					});	
						
					$( document ).on( "showfoldermenu", function(e, ibfsitem, contextitem)
					{					
						var options = 
						{
						my:"left top",
						at:"left bottom",
						of:contextitem
						}
						var initialized = $(".folder-menu").data("initialized");
						$(".folder-menu").data('ibxWidget').fomenuitemopen.data("ibfsitem",ibfsitem);
						$(".folder-menu").data('ibxWidget').fomenuitemdelete.data("ibfsitem",ibfsitem);	
						$(".folder-menu").data('ibxWidget').fomenuitemchangetitle.data("ibfsitem",ibfsitem);
						$(".folder-menu").data('ibxWidget').fomenuitemrefresh.data("ibfsitem",ibfsitem);
						if(!initialized)
						{				
							$(".folder-menu").data('ibxWidget').fomenuitemopen.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								openfolder(ibfsitem);
							});									
							$(".folder-menu").data('ibxWidget').fomenuitemdelete.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								deletefolder(ibfsitem);							
							});
							$(".folder-menu").data('ibxWidget').fomenuitemchangetitle.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								changefoldertitle(ibfsitem);							
							});
							$(".folder-menu").data('ibxWidget').fomenuitemrefresh.on("ibx_menu_item_click",function(e)
							{
								var ibfsitem = $(e.target).data("ibfsitem");
								refreshfolder(ibfsitem);							
							});
							$(".folder-menu").data("initialized",true);
						}
						
						$(".folder-menu").ibxContextMenu("open").position(options);
					});	
						
					// display the new items box
					newitemsbox(newitemsboxsmall);
					
						
			}, ["../testing/jonathan/resources/home_bundle.xml"], true);		
			
			
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
						["Folder", "fa fa-folder", "", "yellow"],
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
						["More","fa fa-ellipsis-h", "morebuttons()","black"]
					];					
					if(small)
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
				
		</script>
		<link rel="stylesheet" type="text/css" href="tree_home.css">
		<style type="text/css">
			body
			{
				margin:0px;
				width:100%;
				height:100%;
				font-family: 'Hind', sans-serif;
			}
			.main-box
			{
				position:absolute;
				border:1px solid #ccc;
				left:5px;
				top:5px;
				right:5px;
				bottom:5px;
			}
			.title-bar
			{
				flex:0 0 auto;
				height:4em;
				background-color:#337ab7
			}
			.title-label
			{
				margin-left:2em;
				color:white;
				font-size:1.8em;
			}
			.toolbar
			{
				color:rgb(102,102,102);
				flex:0 0 auto;
				padding:5px;
				border-bottom:1px solid #ccc;
			}
			.crumb-box
			{
				font-size: 14px;
			}
			.toolbar-spacer
			{
				flex:1 1 auto;
			}
			.txt-search
			{
				margin-right:20px;
			}
			.btn-refresh, .btn-how-view
			{
				color:rgb(102,102,102);
				font-size:1.5em;
				margin-right:20px;
			}
			.explore-box
			{
				flex:1 1 auto;
			}
			.ibfs-tree
			{				
				left:0px;
				bottom:0px;
				right:0px;
				top:0px;
				overflow:auto;			
				flex:0 0 250px;
				border-right:1px solid #ccc;
			}
			.content-box
			{
				flex:1 1 0px;
			}
			.create-new-box
			{
				flex:0 0 auto;
				height: 141px;
				//width: 1200px;
				width: 100%;
				//border-bottom:1px solid #ccc;
			}
			.content-title-bar
			{
				margin:10px;
			}
			.content-title-label
			{
				font-size:14px;
				color: rgb(102,102,102);
				font-family = 'Hind', sans-serif;
			}
			.content-title-spacer
			{
				flex:1 1 auto;
			}
			.content-title-btn
			{
				font-size:1.5em;
				color: rgb(102,102,102);
			}
			.content-title-btn2
			{
				font-size:1.5em;
				color: rgb(102,102,102);
			}
			.content-title-btn .ibx-label-text 
			{
				font-size:11px;
			}
			.create-new-items-box
			{
				margin-bottom:10px;
			}
			.create-new-item 
			{
				//margin:4px;
				height:110px;
				width: 100px;
				font-size: 12px;				
				color: rgb(102,102,102);
												
			}
			.create-new-item .ibx-label-glyph
			{
				font-size:20px;
				//background-color: red;
				margin-bottom: 6px;
				margin-top: 8px;
				color: white;
				border-radius:50%;
				border: 18px solid;
				//border-color: red;
			}
			.create-new-item-red .ibx-label-glyph
			{
				border-color: red;
				background-color: red;
			}
			.create-new-item-green .ibx-label-glyph
			{
				border-color: green;
				background-color: green;
			}
			.create-new-item-blue .ibx-label-glyph
			{
				border-color: blue;
				background-color: blue;
			}
			.create-new-item-yellow .ibx-label-glyph
			{
				border-color: rgb(250, 215, 50);
				background-color: rgb(250, 215, 50);
			}
			.create-new-item-teel .ibx-label-glyph
			{
				border-color: rgba(25,169,213,.7);
				background-color: rgba(25,169,213,.7);
			}
			.create-new-item-purple .ibx-label-glyph
			{
				border-color: rgb(114,102,186);
				background-color: rgb(114,102,186);
			}
			.create-new-item-black .ibx-label-glyph
			{
				border-color: black;
				background-color: black;
			}
			.create-new-item .ibx-label-text
			{
				color: rgb(102,102,102);
				font-size:11px;				
			}
			.create-new-item img
			{
				margin-top: 20px;				
			}
			.files-box
			{
				flex:1 1 auto;
				background-color:#e4f1f9;
				border-top:1px solid #ccc;
				

			}
			.files-box-files
			{
				padding:4px;
				overflow:auto;
				background-color:#e4f1f9;
			}
			.folders-box-folders
			{
				padding:4px;
				overflow:auto;
				background-color:#e4f1f9;
			}
			.file-item
			{
				width:220px;
				height:200px;
				margin:4px;
				background-color:white;
				border-bottom:2px solid #ccc;
			}
			.folder-item
			{
				width:220px;
				height:42px;
				margin:4px;
				background-color:white;
				border-bottom:2px solid #ccc;
			}
			
			.item-image
			{
				height: 80%;
				width: 90%;
				object-fit: contain;				
			}
			
			.image-icon
			{
				height:20px;
				width:24px;
				float:left;
				postion:relative;	
				font-size: 18px;
				margin-top: 6px;		
			}
				
			.image-text
			{
				text-align: center;
				font-family: 'Hind', sans-serif;
				font-size: 14px;
				margin-top:4px;
				height: 20px;
				text-overflow: ellipsis;
				overflow:hidden;
				white-space: nowrap;					
				flex: 1 1 auto;	
				margin-left:4px;		
				
			}
			.image-menu
			{
				height:20px;
				min-width:18px;
				float:right;
				position:relative;
				right:4px;
				margin-top:4px;				
				background:url(images/vertical.png);
				margin-right:4px;
				
				
			}
			
			.flex-grid-cell-title
			{
				font-size: 14px;
				font-weight: bold;
				padding-top: 10px;
				padding-bottom: 10px;
				padding-left: 15px;
				padding-right: 0px;				
				border-bottom:1px solid #ccc;
				text-align: left;
				
			}
			.flex-grid-cell
			{
				font-size: 14px;
				font-weight: normal;
				padding-top: 10px;
				padding-botton: 10px;
				padding-left: 15px;
				padding-right: 0px;
			}
			.files-listing
			{
				overflow: auto;
				background-color: white;
			}	
			.cell-image .ibx-label-glyph
			{
				//background-image:url(images/vertical.png);
				//background-repeat: no-repeat;				
				//background-size: 19px 28px;
				padding-top: 4px;
				padding-bottom: 4px;
				padding-left: 8px;
				padding-right: 8px;
				background-color:white;
				//align: bottom;	
				border: 1px solid #ccc;			
			}	
			.list-icon-col
			{
				font-size: 18px;
			}
			.tree-button-box
			{
				width:20px;
			}
			.tree-button-spacer
			{
				height:50%;
			}
			.tree-collapse-button 
			{
				font-size: 20px;
				border:1px solid #ccc;								
				
			}		
			.tree-showcollapse-button
			{
				font-size: 20px;
				border:1px solid #ccc;
						
				
			}
			.ibx-menu-item-label
			{
				font-size: 14px;
				margin-top: 2px;
				margin-bottom:2px;
			}	
			.folder-image-icon
			{			
				height:20px;
				width:24px;
				float:left;
				postion:relative;	
				font-size: 18px;
				margin-top: 6px;			
				color: rgb(250, 215, 50);
				margin-left: 4px;
			}
			.list-folder-icon
			{
				color: rgb(250, 215, 50);
			}
			.content-title-label-folders, .content-title-label-files
			{
				font-size: 14px;
				width:100%;
				margin-top: 5px;
				margin-bottom: 5px;
				margin-left: 4px;
			}
			.folder-div
			{
				margin-top: 4px;
			}
							
	}
	</style>
	</head>
	<body class="ibx-root">
		<div class="edit-menu" data-ibx-name-root="true" data-ibx-type="ibxContextMenu" data-ibxp-destroy-on-close="false">
			<div data-ibx-type="ibxMenuItem" data-ibx-name="mimenuitemrun" data-ibxp-text="Run/View" data-ibxp-glyph="content_cut" data-ibxp-glyph-classes="material-icons"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibx-name="mimenuitemedit" data-ibxp-text="Edit" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
		</div>
		<div class="folder-menu" data-ibx-name-root="true" data-ibx-type="ibxContextMenu" data-ibxp-destroy-on-close="false">
			<div data-ibx-type="ibxMenuItem" data-ibx-name="fomenuitemopen" data-ibxp-text="Open" data-ibxp-glyph="content_cut" data-ibxp-glyph-classes="material-icons"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibx-name="fomenuitemdelete" data-ibxp-text="Delete" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
	        <div data-ibx-type="ibxMenuItem" data-ibx-name="fomenuitemchangetitle" data-ibxp-text="Change Title" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
	        <div data-ibx-type="ibxMenuItem" data-ibx-name="fomenuitemrefresh" data-ibxp-text="Refresh" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>		
		</div>
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



