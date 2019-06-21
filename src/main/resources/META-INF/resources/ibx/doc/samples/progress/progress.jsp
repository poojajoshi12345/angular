<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx progress sample</title>
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
				window.getWaitSettings = function()
				{
					var options = 
					{
						customImage:$(".chk-wait-custom-image").ibxWidget("checked"),
						withMessage:$(".chk-wait-with-message").ibxWidget("checked"),
						withProgress:$(".chk-wait-with-progbar").ibxWidget("checked"),
						isGlobal:$(".chk-wait-global").ibxWidget("checked")
					}
					return options;
				};

				$(".btn-wait-start").on("click", function(e)
				{
					var settings = getWaitSettings();
					var options = 
					{
						text: settings.withMessage ? "Waiting Message..." : "",
						showProgress: settings.withProgress,
						curVal: 0,
					};
					if(settings.customImage)
						options.glyphClasses = "fa fa-anchor fa-spin";

					var waiting = ibx.waitStart(settings.isGlobal ? null : ".div-wait-inline", options).css("font-size", "3em");
					if(settings.isGlobal)
					{
						settings._startDate = new Date();
						settings._interval = window.setInterval(function(waiting, options, settings)
						{
							var curDate = new Date();
							if((curDate - settings._startDate) >= 2000)
							{
								ibx.waitStop();
								window.clearInterval(settings._interval);
							}
							if(settings.withMessage)
								options.text = new Date();
							if(settings.withProgress)
							{
								options.curVal += .2;
								options.progText = Math.round(options.curVal) + "%";
							}
							waiting.ibxWidget("option", options);
						}, 100, waiting, options, settings);
					}
				});

				$(".btn-wait-stop").on("click", function(e)
				{
					var settings = getWaitSettings();
					ibx.waitStop(settings.global ? null : ".div-wait-inline");
				});


				$(".btn-prog-start").on("click", function(e)
				{
					var progress = $(".div-progress");
					var options = progress.ibxWidget("option");
					options.minVal = Number($(".txt-prog-min").ibxWidget("option", "text"));
					options.maxVal = Number($(".txt-prog-max").ibxWidget("option", "text"));
					options.curVal = Number($(".txt-prog-val").ibxWidget("option", "text"));
					progress.ibxWidget(options);

					var showVal = $(".chk-show-val").ibxWidget("option", "checked");
					var duration = parseInt($(".txt-prog-time").ibxWidget("option", "text"), 10);
					var step = (options.maxVal - options.curVal)/duration;
					var startDate = new Date();

					window.clearInterval(window._progInterval);
					window._progInterval = window.setInterval(function(progress, options, duration, step, startDate)
					{
						var curDate = new Date();
						if((curDate - startDate) > duration)
							window.clearInterval(window._progInterval);

						
						options.curVal += step;
						options.progText = showVal ? Math.ceil(options.curVal) : "";
						progress.ibxWidget("option", options);
					}, 1, progress, options, duration, step, startDate);

				});

				var options = $(".div-progress").ibxWidget("option");
				$(".txt-prog-min").ibxWidget("option", "text", options.minVal);
				$(".txt-prog-max").ibxWidget("option", "text", options.maxVal);
				$(".txt-prog-val").ibxWidget("option", "text", options.curVal);

			}, true);
		</script>

		<style type="text/css">
			.ctrl-section
			{
				padding:1em;
				margin-bottom:5px;
				border-radius:3px;
				border:1px solid #ccc;
			}

			.ctrl-section > *
			{
				margin-right:7px;
			}

			.section-heading
			{
				min-width:99%;
				font-weight:bold;
				font-size:1.5em;
				margin-bottom:1em;
			}

			.menu-presets
			{
				padding:2px;
				border:1px solid #ccc;
			}

			.txt-wait-time, .txt-glyph, .txt-prog-min, .txt-prog-max, .txt-prog-val, .txt-prog-time
			{
				width:50px;
			}

			.div-wait-inline
			{
				flex:1 1 auto;
				height:100px;
				width:100%;
				margin-top:10px;
				margin-right:0px;
				overflow:hidden;
				border:1px solid black;
			}

			.div-progress
			{
				flex:1 1 100%;
				margin-top:10px;
				margin-right:0px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div style="font-weight:bold; font-size:18px">Under development...</div>
		<div class="ctrl-section" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-wrap="true">
			<div class="section-heading" data-ibx-type="ibxLabel">Waiting...</div>

			<div class="btn-wait-start" data-ibx-type="ibxButton" tab-index="0">Start</div>
			<div class="btn-wait-stop" data-ibx-type="ibxButton" tab-index="0">Stop</div>

			<div class="chk-wait-custom-image" data-ibx-type="ibxCheckBoxSimple" tabIndex="0">Custom Image</div>
			<div class="chk-wait-with-message" data-ibx-type="ibxCheckBoxSimple" tabIndex="0">With Message</div>
			<div class="chk-wait-with-progbar" data-ibx-type="ibxCheckBoxSimple" tabIndex="0">With ProgressBar</div>
			<div class="chk-wait-global" data-ibx-type="ibxCheckBoxSimple" tabIndex="0">Global to Body</div>
			<div class="div-wait-inline"></div>
		</div>

		<div class="ctrl-section" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-wrap="true">
			<div class="section-heading" data-ibx-type="ibxLabel">Progress...</div>

			<div class="btn-prog-start" data-ibx-type="ibxButton" tab-index="0">Start</div>
			<div data-ibx-type="ibxLabel">Min</div>
			<div class="txt-prog-min" data-ibx-type="ibxTextField" tabIndex="0"></div>
			<div data-ibx-type="ibxLabel">Max</div>
			<div class="txt-prog-max" data-ibx-type="ibxTextField" tabIndex="0"></div>
			<div data-ibx-type="ibxLabel">Value</div>
			<div class="txt-prog-val" data-ibx-type="ibxTextField" tabIndex="0"></div>
			<div data-ibx-type="ibxLabel">Time (ms):</div>
			<div class="txt-prog-time" data-ibx-type="ibxTextField" tabIndex="0">2000</div>
			<div class="chk-show-val" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Value</div>
			
			<div class="div-progress" data-ibx-type="ibxProgressBar" data-ibxp-min-val="0" data-ibxp-max-val="100" data-ibxp-cur-val="0" data-ibxp-val-label="0"></div>
		</div>
	</body>
</html>
