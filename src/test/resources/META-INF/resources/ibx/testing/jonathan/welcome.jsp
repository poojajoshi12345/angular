<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>WebFOCUS Welcome Page</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<Script src="tree.pd2.js" type="text/javascript"></script>
		
		<script type="text/javascript">
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
						var rootItem = new IbfsRootItem(ibfs,path);
						$(".ibfs-tree").append(rootItem.getElement());			
					});
					
					$( document ).on( "addanitem", function(e, item)
					{						
						
						var divstring = itemdiv(item);						
						$(".files-box-files").append(divstring);															
					});	
					
					$( document ).on( "clearitems", function(e, item)
					{
						$( ".files-box-files" ).empty();										
					});	
					function itemdiv(item)
					{
						var jsonitem=JSON.stringify(item);
						var divstring='<div class="file-item" data-item = "' + jsonitem + '" <a><img class="item-image" src="' + item.thumbPath + '"></a>';
						divstring = divstring + '<p class="image-text">' + item.description + '</p></div>';
						
						return divstring;
					};	
				
			}, true);
			
		</script>
		<link rel="stylesheet" type="text/css" href="tree.pd.css">
		<style type="text/css">
			body
			{
				margin:0px;
				width:100%;
				height:100%;
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
				font-size:1.5em;
			}
			.toolbar
			{
				color:#aaa;
				flex:0 0 auto;
				padding:5px;
				border-bottom:1px solid #ccc;
			}
			.crumb-box
			{
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
				color:#aaa;
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
				flex:0 0 200px;
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
				border-bottom:1px solid #ccc;
			}
			.content-title-bar
			{
				margin:10px;
			}
			.content-title-label
			{
				font-size:14px;
				color:#aaa;
				font-family = 'Hind', sans-serif;
			}
			.content-title-spacer
			{
				flex:1 1 auto;
			}
			.content-title-btn
			{
				font-size:1.5em;
				color:#aaa;
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
				margin:10px;
				height:110px;
				width: 100px;
								
			}
			.create-new-item .ibx-label-glyph
			{
				font-size:4em;
			}
			.create-new-item .ibx-label-text
			{
				color:#aaa;
				font-size:11px;				
			}
			.create-new-item img
			{
				margin-top: 20px;				
			}
			.files-box
			{
				flex:1 1 auto;
				background-color:#e4f1f9

			}
			.files-box-files
			{
				padding:10px;
				overflow:auto;
			}
			.file-item
			{
				width:220px;
				height:200px;
				margin:10px;
				background-color:white;
				border-bottom:2px solid #ccc;
			}
			.item-image
			{
				height: 80%;
				width: 90%;
				object-fit: contain;				
			}
			.image-text
			{
				text-align: center;
				font-family = 'Hind', sans-serif;
				font-size = 14px;
				
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="title-label" data-ibx-type="ibxLabel" data-ibxp-text="Content"></div>
			</div>

			<div class="toolbar" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="crumb-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div data-ibx-type="ibxLabel" data-ibxp-text="Crumb1 >"></div>
					<div data-ibx-type="ibxLabel" data-ibxp-text="Crumb2 >"></div>
					<div data-ibx-type="ibxLabel" data-ibxp-text="Crumb3 >"></div>
				</div>
				<div class="toolbar-spacer"></div> 
				<div class="txt-search" data-ibx-type="ibxTextField" data-ibxp-placeholder="Search..."></div>
				<div class="btn-refresh" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="list" data-ibxp-glyph-classes="material-icons"></div>
				<div class="btn-how-view" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="autorenew" data-ibxp-glyph-classes="material-icons"></div>
			</div>

			<div class="explore-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="ibfs-tree"></div>
				<div class="content-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div class="create-new-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
						<div class="content-title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
							<div class="content-title-label" data-ibx-type="ibxLabel" data-ibxp-text="Create New"></div>
							<div class="content-title-spacer"></div>
							<div class="content-title-btn" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="keyboard_arrow_up" data-ibxp-glyph-classes="material-icons"></div>
						</div>
						<div class="create-new-items-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-wrap="true">
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Folder" data-ibxp-icon-position="top"
							data-ibxp-icon="images/folder.png" data-ibxp->  
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Data Set" data-ibxp-icon-position="top" 
							data-ibxp-icon="images/dataset.png" >  
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>							
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Chart" data-ibxp-icon-position="top"
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/chart.png" >
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Report" data-ibxp-icon-position="top" 
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/report.png" >
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Page" data-ibxp-icon-position="top" 
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/page.png" >
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Portal" data-ibxp-icon-position="top" 
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/portal.png" >
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="Alert" data-ibxp-icon-position="top" 
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/alert.png" >
							</div>
							<div class="create-new-item" data-ibx-type="ibxButtonSimple" data-ibxp-text="More" data-ibxp-icon-position="top" 
							<%--data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">--%>
							data-ibxp-icon="images/more.png" >
							</div>
						</div>
					</div>

					<div class="files-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
						<div class="content-title-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
							<div class="content-title-label" data-ibx-type="ibxLabel" data-ibxp-text="Files"></div>
							<div class="content-title-spacer"></div>
							<div class="content-title-btn" data-ibx-type="ibxButtonSimple" data-ibxp-text="Title" data-ibxp-icon-position="right" data-ibxp-glyph="keyboard_arrow_up" data-ibxp-glyph-classes="material-icons"></div>
						</div>
						<div class="files-box-files"  data-ibx-type="ibxHBox" data-ibxp-wrap="true">
						<%--
							<div class="file-item">1</div>
							<div class="file-item">2</div>
							<div class="file-item">3</div>
							<div class="file-item">4</div>
							<div class="file-item">5</div>
							<div class="file-item">6</div>
							<div class="file-item">7</div>
							<div class="file-item">8</div>
							<div class="file-item">9</div>
							<div class="file-item">10</div>
							<div class="file-item">11</div>
						--%>	
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>



