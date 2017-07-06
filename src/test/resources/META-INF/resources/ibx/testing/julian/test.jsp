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
				$(".drag-source").on("ibx_dragstart ibx_dragend", function(e)
				{
					console.dir(e.type);
				});

				$(".drop-target").on("ibx_dragover ibx_dragout ibx_dragmove ibx_drop", function(e)
				{
					console.dir(e.type);
				});
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
				position:fixed;
			}
			body
			{
			}

			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.drag-source
			{
				flex:0 1 100px;
				height:50px;
				margin:20px;
				border:2px solid red;
			}
			.drop-target
			{
				flex:0 1 100px;
				height:50px;
				margin:20px;
				border:2px solid green;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="drag-source" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-draggable="true">Drag me</div>
			<div class="drop-target" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-droppable="true">Drop here</div>
		</div>
	</body>
</html>

