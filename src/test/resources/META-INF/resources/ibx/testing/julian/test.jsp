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
			];
			
			ibx(function()
			{
				var select = $(".test-widget");
				for(var i = 0; i < 10; ++i)
				{
					var selectItem = $("<div>").ibxSelectItem({text:sformat("Item{1}", i), selected:i%2, userValue:i});
					select.ibxWidget("add", selectItem);
				}

			}, packages, true);
		</script>
		<style type="text/css">
			.test-widget
			{
				position:absolute;
				left:50px;
				top:50px;
				width:500px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="test-widget" data-ibx-type="ibxSelect" data-ibxp-multi-select="true">
		</div>
	</body>
</html>

