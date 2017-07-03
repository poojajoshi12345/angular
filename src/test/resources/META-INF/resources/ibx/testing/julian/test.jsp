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
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
			}
			.left-pane
			{
				flex:.1 1 auto;
				border:1px solid black;
			}
			.ibfs-tree
			{
				flex:1 1 auto;
				border:1px solid red;
			}
			.button-box
			{
				margin-left:3px;
			}
			.dlg-area
			{
				display:none;
			}
			.right-pane
			{
				flex:1 1 auto;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div class="left-pane" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="ibfs-tree"> I'm the left pane</div>
				<div class="button-box" data-ibx-type="ibxLabel" data-ibxp-icon-position="top" data-ibxp-glyph-classes="fa fa-arrow-left"></div>
			</div>
			<div data-ibx-type="ibxSplitter"></div>
			<div class="dlg-area" data-ibx-type="ibxWidget"></div>
			<div class="right-pane" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
				<div>I'm the right pane</div>
			</div>
		</div>
	</body>
</html>

