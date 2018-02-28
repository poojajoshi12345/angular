<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx samples</title>
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


			}, ["/ibi_apps/ibx/testing/michael_z/genericTree/tree-res.xml"], true);
		</script>

		<style type="text/css">
			.select, .list { margin: 10px; border: 1px solid red; padding: 10px;}
		</style>
	</head>
	<body class="ibx-root">

<!-- 		<div data-ibx-type="ibxLabel" data-ibxp-glyph-classes="ibx-icons ibx-glyph-fex-alert"></div>
		<div data-ibx-type="ibxLabel" data-ibxp-glyph-classes="ibx-icons ibx-glyph-key">Hello</div>
		
		<br><br> 
 -->		
		<div data-ibx-type="ibxTreeNode" data-ibxp-text="Car">
 			<div data-ibx-type="ibxTreeNode" data-ibxp-text="Measures">
 				<div data-ibx-type="ibxTreeNode" data-ibxp-text="RETAIL_COST" data-ibxp-glyph-classes="ibx-icons ibx-glyph-key"></div>
				<div data-ibx-type="ibxTreeNode" data-ibxp-text="DEALER_COST" data-ibxp-glyph-classes="ibx-icons ibx-glyph-fex-alert"></div>
			</div>
			<div data-ibx-type="ibxTreeNode" data-ibxp-text="Dimensions" data-ibxp-glyph-classes="ibx-icons ibx-glyph-hierarchy">
	 			<div data-ibx-type="ibxTreeNode" data-ibxp-text="COUNTRY"></div>
				<div data-ibx-type="ibxTreeNode" data-ibxp-text="MODEL"></div>
			</div>			
 		</div>
		
			
	</body>
</html>

