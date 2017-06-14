<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx test</title>
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
			}, ["../testing/julian/test_res_bundle.xml"], true);
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">

		<div style="border:1px solid black;" class="ibx-title-bar-close-button" data-ibxp-glyph-classes="" tabIndex="1" data-ibx-type="ibxButton" data-ibx-name="titleClose"></div>

	</body>
</html>

