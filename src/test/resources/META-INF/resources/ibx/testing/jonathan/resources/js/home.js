
			
			
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
				

