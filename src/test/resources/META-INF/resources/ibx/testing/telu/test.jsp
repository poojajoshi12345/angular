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
			
			var packages=
			[
				{src: "../testing/telu/test_res.xml"},
			];
			
			ibx(function()
			{
				jQuery.event.special['ibx_change'] = { noBubble: true };

				this._dateRangePicker = ibx.resourceMgr.getResource('.date-range-picker', true);
				this._menuButton = $("<div class='menu-button'>").ibxHMenuButton({"menu": this._dateRangePicker, "justify":"start", "glyphClasses": "fa fa-calendar"});
				$("body").append(this._menuButton);
				this._dateRangePicker.on("ibx_change", function (e, data){
					$(".menu-button").ibxWidget("option", "text", data.text);
				});



			}, packages, true);
		</script>

		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>

