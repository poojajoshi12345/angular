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
					
					$(".files-listing").hide();
					$(".tree-showcollapse-button").hide();
					$(".content-title-btn2").hide();
					
					// display the new items box
					newitemsbox(newitemsboxsmall);			
					
					
					
					
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



