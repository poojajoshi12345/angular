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

				$(".test-button").on("click", function(e)
				{
					$(".test-popup").ibxWidget("open");

				}.bind(this));
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

			.ibx-popup.test-popup.pop-effect-fade, .ibx-popup.test-popup.pop-effect-fade.pop-closed
			{
				transition:opacity 1s, visibility 1s;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="test-button" data-ibx-type="ibxButtonSimple" data-ibxp-text="Press for Popup..."></div>
		<div class="test-widget" data-ibx-type="ibxSelect" data-ibxp-multi-select="true">
		</div>
		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-destroy-on-close="false" data-ibxp-effect="fade" data-ibxp-close-on-timer="750">
			<div>Juian</div>
			<div>Alexander</div>
			<div>Hyman</div>
		</div>
	</body>
</html>

