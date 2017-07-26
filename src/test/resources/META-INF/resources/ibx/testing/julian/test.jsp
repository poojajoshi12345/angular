<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx test</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{
				$(".drop-target").on("dragover ibx_dragover ibx_drop", function(e)
				{
					if(e.type == "dragover" || e.type == "drop")
					{
						console.log(e.type);
						e.originalEvent.dataTransfer.dropEffect = "copy";
						e.preventDefault();
					}
				});

				var menuItems = $();
				for(var i = 0; i < 10; ++i)
				{
					var mi = $("<div>").ibxMenuItem({"text":"MenuItem " + i});
					menuItems = menuItems.add(mi);
				}
				var menu = $("<div>").ibxMenu({"text":"Menu"});
				menu.ibxWidget("add", menuItems);

				$(".menu-button").ibxWidget("option", "ctxMenu", menu);
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:relative;
			}
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				border:2px solid red;
				padding:5px;
			}

			.drop-target
			{
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="menu-button" data-ibx-type="ibxLabel">Menu</div>
			<div class="drag-source" data-ibx-type="ibxLabel" data-ibxp-draggable="true">Drag Here!</div>
			<div class="drop-target" data-ibx-type="ibxLabel" data-ibxp-droppable="true">Drop Here!</div>
		</div>
	</body>
</html>

