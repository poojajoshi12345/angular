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
				function log()
				{
					var str = sformat.apply(this, arguments);
					var txtOut = $(".txt-out");
					var txt = txtOut.ibxTextArea("option", "text");						
					txtOut.ibxWidget("option", "text", txt + "\n" + str);
					txtOut.find("textarea").scrollTop(1000000);
				};
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
			}
			.box-native
			{
				margin:5px;
				padding:5px;
			}
			.test-drag
			{
				width:125px;
				padding:5px;
				margin:5px;
				border:1px solid blue;
			}
			.test-drop
			{
				width:125px;
				padding:5px;
				margin:5px;
				border:1px solid red;
			}
			.txt-out
			{
				flex:1 1 auto;
				margin:5px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="box-native" data-ibx-type="ibxHBox">
				<div class="test-drag" data-ibx-type="testWidget" data-ibxp-draggable="true">Native UI Drag</div>
				<div class="test-drop" data-ibx-type="testWidget" data-ibxp-droppable="true">Native UI Drop</div>
			</div>

			<div class="txt-out" data-ibx-type="ibxTextArea"></div>
		</div>
	</body>
</html>

