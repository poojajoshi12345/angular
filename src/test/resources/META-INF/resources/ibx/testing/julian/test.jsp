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
				$(".right-side").ibxCollapsible(
				{
					direction:"right",
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
				overflow:hidden;
				background-color:white;
				box-sizing:border-box;
			}

			.side
			{
				border:1px solid black;
				margin:2px;
			}
			.left-side
			{
				flex:1 1 auto;
			}
			.right-side
			{
				width:200px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="cmd-files" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+F"></div>
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch" data-ibxp-justify="start">

			<div class="side left-side" data-ibx-type="ibxVBox">
				<div data-ibx-type="ibxLabel">Left Side</div>
			</div>

			<div class="side right-side" data-ibx-type="ibxVBox">
				<div tabindex="0" data-ibx-type="ibxLabel">Right Side</div>
			</div>
		</div>
	</body>
</html>
