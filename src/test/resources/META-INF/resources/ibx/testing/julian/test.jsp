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
				$("#cmdClear").on("ibx_triggered", function(e)
				{
					console.clear();
				});
				Ibfs.load().done(function()
				{
					Ibfs.ibfs.login("admin", "admin").done(function(e)
					{
						console.log("ibfs logged in.");
					});
				});

				window.setInterval(function()
				{
					var itemBoxLabel = $(".item-box-label");
					itemBoxLabel.text(sformat("tabIndex = {1}", $(".item-box").prop("tabindex")));
					$(".item").each(function(idx, el)
					{
						el = $(el);
						el.text(sformat("tabIndex = {1}", el.prop("tabindex")));
					});
				}, 100);

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
			.item-box
			{
				border:1px solid black;
				margin:10px;
			}
			.item-box-label
			{
				flex:1 1 90%;
			}
			.item
			{
				xwidth:25px;
				height:25px;
				border:1px solid black;
				margin:5px;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="item" tabindex="0" data-ibx-type="ibxWidget">Item</div>
		<div tabindex="0" class="item-box" data-ibx-type="ibxFlexBox" data-ibxp-inline="true" data-ibxp-focus-root="false" data-ibxp-focus-default="true">
			<div class="item-box-label" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
			<div class="item" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
			<div class="item" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
			<div class="item" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
			<div class="item" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
			<div class="item" tabindex="-1" data-ibx-type="ibxWidget">Item</div>
		</div>
		<div class="item" tabindex="0" data-ibx-type="ibxWidget">Item</div>
	</body>
</html>
