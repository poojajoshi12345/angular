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
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{
				var tree = $(".ibfs-tree");

				tree.ibxCollapsible();
				for(var i = 0; i < 100; ++i)
					tree.append($("<div>").text("item_" + i));

				$(".tree-btn").on("click", function(e)
				{
					$(".ibfs-tree").ibxCollapsible("toggle");
				});
			}, true);
		</script>
		<style type="text/css">
			body
			{
				margin:0px;
				width:100%;
				height:100%;
			}
			.main-grid
			{
				position:absolute;
				left:5px;
				top:5px;
				right:5px;
				bottom:5px;
			}
			.layout-block
			{
				margin:4px;
				border:1px solid #ccc;
				border-radius:3px;
			}
			.title-box
			{
				padding:10px;
			}

			.tree-btn
			{
				font-size:18px;
			}

			.ibfs-tree-container
			{
				position:relative;
				width:200px;
				overflow:auto;
			}
			.ibfs-tree
			{
				position:absolute;
				left:0px;
				bottom:0px;
				right:0px;
				top:0px;
				overflow:auto;
			}

			.wf-output
			{
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-grid" data-ibx-type="ibxGrid" data-ibxp-cols="auto 1fr" data-ibxp-rows="auto 1fr">
			<div class="title-box layout-block" data-ibx-type="ibxHBox" data-ibx-col="1/span 2" data-ibx-row="1/span 1" data-ibxp-align="center">
				<div class="tree-btn" data-ibx-type="ibxButtonSimple" data-ibxp-glyph="menu" data-ibxp-glyph-classes="material-icons"></div>
			</div>
			<div class="ibfs-tree-container layout-block" data-ibx-type="ibxWidget" data-ibx-col="1/span 1" data-ibx-row="2/span 200">
				<div class="ibfs-tree"></div>
			</div>
			<div class="wf-output layout-block" data-ibx-type="ibxIFrame" data-ibx-col="2/span 1" data-ibx-row="2/span 200" data-ibxp-src="about:blank"></div>
		</div>
	</body>
</html>



