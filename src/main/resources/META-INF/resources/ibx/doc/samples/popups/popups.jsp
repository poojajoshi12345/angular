<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>IBX popups sample</title>
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
				$(".show-generic-popup").on("click", function(e)
				{
					$(".generic-popup").ibxPopup("open");
				});

				$(".show-standard-dialog").on("click", function(e)
				{
					var options = 
					{
						type:"std plain",
						buttons:"ok",
						messageOptions:
						{
							text:"This is just a standard dialog...not info, question, warning, or error, just plain!"
						}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");
				});

				$(".show-info-dialog").on("click", function(e)
				{
					var options = 
					{
						type:"std information",
						buttons:"ok",
						messageOptions:
						{
							text:"This is some information"
						}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");
				});

				$(".show-question-dialog").on("click", function(e)
				{
					var options = 
					{
						type:"std question",
						buttons:"okcancel",
						messageOptions:{text:"What is the meaning of life?"}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");
				});

				$(".show-warning-dialog").on("click", function(e)
				{
					var options = 
					{
						type:"std warning",
						buttons:"okcancel",
						messageOptions:{text:"Are you absolutely sure you want to continue down this path?"}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");
				});

				$(".show-error-dialog").on("click", function(e)
				{
					var options = 
					{
						type:"std error",
						buttons:"ok",
						messageOptions:{text:"Something bad appears to have happened?"}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");
				});

				$(".show-test-dialog").on("click", function(e)
				{
					var dlg = ibx.resourceMgr.getResource(".test-dlg");
					dlg.ibxDialog("open");
				});



				$(".show-timer-close-dialog").on("click", function(e)
				{
					var popup = ibx.resourceMgr.getResource(".test-notify-popup");
					popup.ibxWidget("open");
				});


				$(".thumb-label").ibxWidget("option", "icon", "./renstimpy.png");
			}, ["../doc/samples/popups/resources/popups_bundle.xml"], true);

		</script>
		<style type="text/css">
			.dummy-label
			{
				width:30%;
				height:10px;
				border:1px solid red;
			}

			.thumb-label
			{
				border:1px solid lime;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="show-generic-popup" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Generic Popup"></div>
		<div class="show-standard-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Standard Dialog"></div>
		<div class="show-info-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Info Dialog"></div>
		<div class="show-question-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Question Dialog"></div>

		<!--
		<svg>
			<foreignObject x="-19.5" y="3" cursor="default" transform="translate(705, 6)" class="title" width="41" height="20">
				<body xmlns="http://www.w3.org/1999/xhtml" marginwidth="0" marginheight="0" style="all: unset; color: black">
					<div style="width: 39px;">
						<span style="font-family:ARIAL; font-size:12pt; color:#200020">failed</span>
					</div>
				</body>
			</foreignObject>
		</svg>
		-->

		<div class="show-warning-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Warning Dialog"></div>
		<div class="show-error-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Error Dialog"></div>
		<div class="show-timer-close-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Timer Popup (Like a notification)"></div>
		<div class="show-test-dialog" tabIndex="0" data-ibx-type="ibxButton" data-ibxp-text="Test Custom Dialog"></div>
	</body>
</html>
