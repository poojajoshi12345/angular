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
		<Script src="./ace/ace-builds-master/src/ace.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				$(".show-dlg1").on("click", function(e)
				{
					$(".dlg1").ibxWidget("open");	
				});
				$(".show-dlg2").on("click", function(e)
				{
					$(".dlg2").ibxWidget("open");	
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
				padding:5px;
				box-sizing:border-box;
			}
			.main-box
			{
				padding:3px;
				width:100%;
				height:100%;
				box-sizing:border-box;
			}
			.ibx-dialog .ibx-menu-button
			{
				border:1px solid black;
				margin:2px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="show-dlg1" data-ibx-type="ibxButton">Dialog...</div>
		</div>

		<div class="dlg1" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false">
			<div data-ibx-type="ibxMenuButton">Show Menu
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div class="show-dlg2" data-ibx-type="ibxButton">Second Dialog...</div>
		</div>

		<div class="dlg2" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false">
			<div data-ibx-type="ibxMenuButton">Show Menu
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
		</div>
	</body>
</html>
