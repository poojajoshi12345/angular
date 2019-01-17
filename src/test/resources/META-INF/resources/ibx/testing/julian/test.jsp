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
				$(".ibx-menu-select").on("ibx_change", function(e)
				{
					console.log(e.type, e.originalEvent.data);
				})
			},
			[{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			body
			{
				margin:0px;
				position:absolute;
				width:100%;
				height:100%;
				box-sizing: border-box;
			}
			.menu-btn
			{
				padding:5px;
				margin:5px;
				border:1px solid #ccc;
			}
		</style>
	</head>
	<body class="ibx-root" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
		<div class="menu-btn single-select" data-ibx-type="ibxSelectMenuButton">ibxMenuSelect-single
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
		<div class="menu-btn multi-select" data-ibx-type="ibxSelectMenuButton" data-ibxp-multi-select="true">ibxMenuSelect-multi
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
	</body>
</html>
