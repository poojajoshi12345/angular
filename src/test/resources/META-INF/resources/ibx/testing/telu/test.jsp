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

				var label = $(".mylabel");
				label[0].addEventListener("mousedown", function (e){

				}, true);
				label.on('dblclick', function (e){
					label.ibxWidget("startEditing");
				});

				label.draggable();
				//label.draggable("disable");

			}, packages, true);
		</script>

		<style type="text/css">
			.mytab
			{
				width:600px;
			}
			.mybutton
			{
				font-size: 24px;
				width: 50px;
				height: 50px;
			}
			.myslider
			{
				width: 200px;
			}

			.myslider2{
				height: 200px;
			}

			.ibx-slider-body-horizontal-start,
			.ibx-slider-body-vertical-start
			{
				background-color: blue;
				border-color: blue;
			}
			.ibx-slider-body-horizontal-end,
			.ibx-slider-body-vertical-end
			{
				background-color: red;
				border-color: red;
			}
		</style>
	</head>
	<body class="ibx-root">

		<div data-ibx-type="ibxLabel" class="mylabel">This is a label</div>

	</body>
</html>

