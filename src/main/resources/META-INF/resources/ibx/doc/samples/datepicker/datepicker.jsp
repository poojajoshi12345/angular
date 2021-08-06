<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
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

				$("#date-time").on("ibx_change", (_, data) => $("#date-time-text").ibxWidget("option", "text", data.dateTime.toISOString()));
				$("#date-time-show-time").on("ibx_change", (e)=> $("#date-time").ibxWidget("option", "showTime", $(e.target).ibxWidget("checked")));
				$("#date-time-show-time-mil").on("ibx_change", (e)=> $("#date-time").ibxWidget("option", "timeOptions", {showMillisecond: $(e.target).ibxWidget("checked")}));
				$("#date-time-show-time-zone").on("ibx_change", (e)=> $("#date-time").ibxWidget("option", "showTimeZone", $(e.target).ibxWidget("checked")));
				$("#date-time-show-time-text").on("ibx_change", (e)=> $("#date-time").ibxWidget("option", "showTimeText", $(e.target).ibxWidget("checked")));

				$("#date-range-time").on("ibx_change", (_, data) => {
					$("#date-range-time-text").ibxWidget("option", "text", data.dateTimeFrom.toISOString());
					$("#date-range-time-text2").ibxWidget("option", "text", data.dateTimeTo.toISOString());
				});
				$("#date-range-time-show-time").on("ibx_change", (e)=> $("#date-range-time").ibxWidget("option", "showTime", $(e.target).ibxWidget("checked")));
				$("#date-range-time-show-time-mil").on("ibx_change", (e)=> $("#date-range-time").ibxWidget("option", "timeOptions", {showMillisecond: $(e.target).ibxWidget("checked")}));
				$("#date-range-time-show-time-zone").on("ibx_change", (e)=> $("#date-range-time").ibxWidget("option", "showTimeZone", $(e.target).ibxWidget("checked")));
				$("#date-range-time-show-time-text").on("ibx_change", (e)=> $("#date-range-time").ibxWidget("option", "showTimeText", $(e.target).ibxWidget("checked")));
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
			padding: 4px;
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

		.date-time-options,
		.date-range-time-options{
			margin: 8px;
			align-self: stretch;
		}

		.date-time-options > *,
		.date-range-time-options > *{
			padding-bottom: 4px;
		}

		#date-time-text,
		.date-time-range-time-wrapper
		{
			align-self: stretch;
		}

		#date-range-time-text,
		#date-range-time-text2{
			flex: 1 1 auto;
		}

		/* .date-time-innerbox{
			min-width: 400px;
		}

		.date-range-innerbox{
			min-width: 700px;
		} */

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
			<div class="innerbox date-time-innerbox" data-ibx-type="ibxVBox" data-ibxp-align="center">
				<div id="date-time-label" class="label" data-ibx-type="ibxLabel">Date Picker Simple with time/time zone options.</div>
				<div class="date-time-options" data-ibx-type="ibxVBox">
					<div id="date-time-text" data-ibx-type="ibxTextField"></div>
					<div id="date-time-show-time" data-ibx-type="ibxCheckBoxSimple">Show time</div>
					<div id="date-time-show-time-mil" data-ibx-type="ibxCheckBoxSimple">Show milliseconds</div>
					<div id="date-time-show-time-text" data-ibx-type="ibxCheckBoxSimple">Add time to label</div>
					<div id="date-time-show-time-zone" data-ibx-type="ibxCheckBoxSimple">Show time zone</div>
				</div>
				<div id="date-time" class="inline" data-ibx-type="ibxDatePickerSimple"></div>
			</div>
		</div>

		<div class="box" data-ibx-type="ibxHBox">
			<div class="innerbox" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div id="myrangelabel" class="label" data-ibx-type="ibxLabel"></div>
				<div id="myinlinerange" class="inline" data-ibx-type="ibxDateRangeInline"></div>
			</div>
			<div class="control" data-ibx-type="ibxDateRangeSimple" data-ibxp-date-from="May 5, 2017" data-ibxp-date-to="May 20, 2017"></div>
			<div class="control" data-ibx-type="ibxDateRange"></div>
			<div class="innerbox date-range-innerbox" data-ibx-type="ibxVBox" data-ibxp-align="center">
				<div id="date-range-time-label" class="label" data-ibx-type="ibxLabel">Date Range Simple with time/time zone options.</div>
				<div class="date-range-time-options" data-ibx-type="ibxVBox">
					<div class="date-time-range-time-wrapper" data-ibx-type="ibxHBox" data-ibxp-justify="stretch">
						<div id="date-range-time-text" data-ibx-type="ibxTextField"></div>
						<div id="date-range-time-text2" data-ibx-type="ibxTextField"></div>
					</div>
					<div id="date-range-time-show-time" data-ibx-type="ibxCheckBoxSimple">Show time</div>
					<div id="date-range-time-show-time-mil" data-ibx-type="ibxCheckBoxSimple">Show milliseconds</div>
					<div id="date-range-time-show-time-text" data-ibx-type="ibxCheckBoxSimple">Add time to label</div>
					<div id="date-range-time-show-time-zone" data-ibx-type="ibxCheckBoxSimple">Show time zone</div>
				</div>
				<div id="date-range-time" class="control" data-ibx-type="ibxDateRangeSimple" data-ibxp-date-from="May 5, 2017" data-ibxp-date-to="May 20, 2017" data-ibxp-time-from="1628136000000" data-ibxp-time-to="1628222399999"></div>
			</div>
		</div>
	</body>
</html>
