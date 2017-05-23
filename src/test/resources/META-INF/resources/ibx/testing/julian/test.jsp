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
			var packages =
			[
				"../testing/julian/test_res_bundle.xml",
				"../testing/samples/ibfs/resources/ibfs_bundle.xml",
				"../testing/samples/popups/resources/popups_bundle.xml",
				"../testing/samples/ibxhier/resources/ibxhier_res_bundle.xml",
				"../testing/samples/grid/resources/grid_res_bundle.xml",
				"../testing/samples/res_bundle/resources/res_bundle.xml",
			];
			ibx(function()
			{
			}, packages, true);
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>

