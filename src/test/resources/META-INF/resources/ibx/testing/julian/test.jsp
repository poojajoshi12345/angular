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
				$("#cmdClear").on("ibx_triggered", function(e)
				{
					console.clear();
				});
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.main-box
			{
				width:100%;
				height:100%;
				border:1px solid red;
				box-sizing:border-box;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div tabindex="0" class="main-box" data-ibx-type="ibxFlexBox" data-ibxp-inline="true" data-ibxp-align="center" data-ibxp-justify="center">
			<div data-ibx-type="ibxButtonGroup" data-ibxp-group-selection="true">
				<div tabindex="0" data-ibx-type="ibxRadioButton">Radio 1</div>
				<div tabindex="0" data-ibx-type="ibxRadioButton">Radio 2</div>
				<div tabindex="0" data-ibx-type="ibxRadioButton">Radio 3</div>
			</div>
		</div>
	</body>
</html>
