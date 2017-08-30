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
				$(".test-drop").on("ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					console.log(e.type, e);
				});
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			.label
			{
				width:50%;
				border:1px solid purple;
			}

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
			.test-btn, .test-select
			{
				flex:0 0 auto;
			}
			.test-widget, .test-drop, .test-frame
			{
				flex: 1 1 auto;
				border:1px solid lime;
			}
			.test-item
			{
				width:100px;
				height:100px;
				border:1px solid blue;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center">
			<div class="split-button" data-ibx-type="ibxHSplitMenuButton" data-ibxp-default-menu-item=".def-item" data-ibxp-btn-options="{glyphClasses:'fa fa-18 fa-cog'}">
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div class="def-item" data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div class="split-button" data-ibx-type="ibxVSplitMenuButton" data-ibxp-default-menu-item=".def-item" data-ibxp-btn-options="{glyphClasses:'fa fa-18 fa-cog'}">
				<div data-ibx-type="ibxMenu">
					<div class="def-item" data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div class="test-drag" data-ibx-type="ibxLabel" data-ibxp-draggable="true">Drag Me!</div>
			<div class="test-frame" data-ibx-type="ibxIFrame" data-ibxp-droppable="true" data-ibxp-src="./test.html">This is a test</div>		
			<div class="test-drop" data-ibx-type="ibxWidget" data-ibxp-droppable="true">This is a test</div>		
		</div>
	</body>
</html>

