<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx datepicker & daterange sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ibx/resources/etc/slick/slick.css"/>
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ibx/resources/etc/slick/slick-theme.css"/>
		-->

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			var current = 100;

			ibx(init, true);

			function init()
			{
				var dateFrom = $("#myinlinerange").ibxWidget('option', 'dateFrom');
				var dateTo = $("#myinlinerange").ibxWidget('option', 'dateTo');
				$("#myrangelabel").ibxWidget('option', 'text', 'You selected a range from: ' + dateFrom + ' to: ' + dateTo);

				$("#myinlinerange").on("ibx_change", function (event, info)
				{
					$("#myrangelabel").ibxWidget('option', 'text', 'You selected a range from: ' + info.dateFrom + ' to: ' + info.dateTo);
				});


				var date = $("#myinlinepicker").ibxWidget('option', 'date');
				$("#mypickerlabel").ibxWidget('option', 'text', 'You selected ' + date);

				$("#myinlinepicker").on("ibx_change", function (event, info)
				{
					$("#mypickerlabel").ibxWidget('option', 'text', 'You selected ' + info.date);
				});
				$("#myinlinepicker").on("ibx_changemonthyear", function (event, info)
				{
					var picker = $(event.target);
					$("#mypickerlabel").ibxWidget('option', 'text', 'You selected ' + info.newDate);
				});

				$(".ibx-datepicker").ibxWidget("option", {"changeYear":true, "changeMonth":true});
			};
		</script>

		<style type="text/css">

		body, html
		{
			height: 100%; margin: 0px; padding: 0px;
		}

		.control
		{
			margin: 10px;
		}

		.box
		{
			margin: 10px;
		}

		.innerbox
		{
			border: 1px solid black;
			border-radius: 3px;
		}

		.label
		{
			margin: 10px;
			margin-bottom: 0px;
		}

		.inline
		{
			margin: 10px;
			margin-top: 5px;
		}

		</style>
	</head>
	<body class="ibx-root">

		<div style="font-weight: bold; font-size: 1.5em;" class="control" data-ibx-type="ibxLabel">Under construction: still working on styling and options.</div>

		<div class="box" data-ibx-type="ibxHBox">
			<div class="innerbox" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div id="mypickerlabel" class="label" data-ibx-type="ibxLabel"></div>
				<div id="myinlinepicker" class="inline" data-ibx-type="ibxDatePickerInline" data-ibxp-date="February 5, 2017" data-ibxp-adjust-for-month-year="true"></div>
			</div>
			<div class="control" data-ibx-type="ibxDatePickerSimple"></div>
			<div id="mydate" class="test-picker control" data-ibx-type="ibxDatePicker" data-ibxp-adjust-for-month-year="true"></div>
		</div>

		<div class="box" data-ibx-type="ibxHBox">
			<div class="innerbox" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div id="myrangelabel" class="label" data-ibx-type="ibxLabel"></div>
				<div id="myinlinerange" class="inline" data-ibx-type="ibxDateRangeInline"></div>
			</div>
			<div class="control" data-ibx-type="ibxDateRangeSimple" data-ibxp-date-from="May 5, 2017" data-ibxp-date-to="May 20, 2017"></div>
			<div class="control" data-ibx-type="ibxDateRange"></div>
		</div>
	</body>
</html>
