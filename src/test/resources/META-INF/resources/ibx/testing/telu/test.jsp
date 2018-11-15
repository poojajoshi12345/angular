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

				$(".mybutton").on("click", function(){
					console.time("start");
					for (var i = 0; i < 2000; i++)
						$(".autoheight2").ibxWidget('addControlItem', $("<div>").ibxSelectItem({'text': 'Item' + i, 'userValue': 'item' + i}));
					console.timeEnd("start");

				});



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

		<div class="myslider" data-ibx-type="ibxHSlider"></div>
		<div class="myslider2" data-ibx-type="ibxVSlider"></div>

	</body>
</html>

