<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>test</title>
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
				var props = $(".ibx-property-sheet");
				props.ibxWidget("props", testProps);
			},
			[
				{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.test-props
			{
				width:400px;
				height:400px;
				border:1px solid black;
				padding:5px;
			}
			.grid-cell
			{
				border:1px solid black;
				xwidth:100px;
				xheight:100px;
			}

			.test-map
			{
				width:500px;
				height:500px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibxp-command="cmdDelete">

			<div class="test-props" data-ibx-type="ibxPropertySheet"></div>

			<!-- <div class="test-grid" data-ibx-type="ibxGrid" data-ibx-options='{"cols":"1fr 1fr", "xjustify":"center", "xalign":"stretch"}'>

				<div class="grid-cell" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="1">Grid Item</div>
				<div class="grid-cell" data-ibx-type="ibxLabel" data-ibx-col="2" data-ibx-row="1">Grid Item</div>
				<div class="grid-cell" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="2">Grid Item</div>
				<div class="grid-cell" data-ibx-type="ibxLabel" data-ibx-col="2" data-ibx-row="2">Grid Item</div>

			</div> -->
		</div>
	</body>
</html>
