<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Error Warning Messaging UI Tester</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
		<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
		<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />
		
		var resBundles = 
		[
			applicationContext + "/ibxtools/dm/actions/actionsRes.xml",
			applicationContext + "/ibxtools/shared_resources/shared_resource_bundle.xml",
		];
		
		ibx(function()
			{
				$(".open-test-dialog").on("click", function(e) {
					$('.test-dialog').ibxWidget('open').on('ibx_beforeclose', function(e)
                    {
                        e.preventDefault();
                    });
				});
				
				$(".show-single-message").on("click", function (e)
				{
					$('.ds-messaging-ui').remove();
					var options = {
						'type': 'information',
						'info': 'This is the information message.',
						'isMultiMessages': false,
						'displayCloseIcon': false
					};
					var info = $('<div tabIndex="0" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').errorWarningMessages();
					info.ibxWidget('option', options);
					$('.messaging-widget-container').append(info);
				});
				
				$(".show-single-message-with-close").on("click", function (e)
				{
					$('.ds-messaging-ui').remove();
					var options = {
						'type': 'success',
						'info': 'This is the success message.',
						'isMultiMessages': false,
						'displayCloseIcon': true
					};
					var info = $('<div tabIndex="0" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').errorWarningMessages();
					info.ibxWidget('option', options);
					$('.messaging-widget-container').append(info);
				});
				
				$(".show-multi-message").on("click", function (e)
				{
					$('.ds-messaging-ui').remove();
					var options = {
						'type': 'warning',
						'multiMessagesTitle': 'This is a new title',
						'info': ["This is an information message.", "This is a really long message. This is a made up multi-line message that continues on the next line since it wraps.", "This is another information message."],
						'isMultiMessages': true,
						'displayCloseIcon': false
					};
					var info = $('<div tabIndex="0" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').errorWarningMessages();
					info.ibxWidget('option', options);
					$('.messaging-widget-container').append(info);
					info.ibxWidget('updateMessage', ['New message', 'New message 1']);
				});
				$(".show-multi-with-details").on("click", function (e)
				{
					$('.ds-messaging-ui').remove();
					var options = {
						'type': 'error',
						'info': [
							"This is an error message.",
							{
								"label":"This is the error that never ends, and it goes on and on my friends.  Some server started sending it, just passing what it got, and it'll continue sending it forever just because:",
								"details":"This is the error that never ends, and it goes on and on my friends.\r\nSome server started sending it, just passing what it got, and it'll continue sending it forever just because..."
							},
							{
								"label":"This is the error that never ends, and it goes on and on my friends.",
								"details":"This is the error that never ends, and it goes on and on my friends.\r\nSome server started sending it, just passing what it got, and it'll continue sending it forever just because..."
							},
							"This is another error message."
						],
						'isMultiMessages': true,
						'displayCloseIcon': true
					};
					var info = $('<div tabIndex="0"data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').errorWarningMessages();
					info.ibxWidget('option', options);
					$('.messaging-widget-container').append(info);
					info.ibxWidget('addMessage', ['New message', 'New message 1', {"label": "Added Message", "details":"Details of added message"}]);
				});
			}, resBundles, true);
		</script>
		
		<style type="text/css">
			html, body
			{
				width:100%;
				height:80%;
				margin:10px;
				box-sizing:border-box;
			}
			.button
			{
				margin: 10px;
			}
			.messaging-widget-container
			{
				width: 100%;
				height: auto;
			}
			
		</style>
	</head>
	<body class="ibx-root">
		<div tabindex='0' data-ibx-type="ibxButton" class="button open-test-dialog" title="Open Test Dialog">Open Test Dialog</div>
		<div data-ibx-type="ibxDialog" class="test-dialog" title="Messaging Widget Test Dialog" style="width:800px;">
			<div data-ibx-type="ibxVBox" data-ibxp-align="stretch"> 
			    <div data-ibx-type="ibxHBox" class="messaging-widget-container" data-ibxp-align="stretch"></div>
				<div tabindex='0' data-ibx-type="ibxLabel" data-ibx-name="testDialogTextFieldLabel1" data-ibxp-for="testDialogTextField1" style="width:90%; margin: 10px;" data-ibxp-text="Field 1"></div>
				<div tabindex='0' data-ibx-type="ibxTextField" data-ibx-name="testDialogText1" data-ibxp-for="testDialogText1" style="width:90%; margin: 10px;"></div>
				<div tabindex='0' data-ibx-type="ibxLabel" data-ibx-name="testDialogTextFieldLabel2" data-ibxp-for="testDialogTextField2" style="width:90%; margin: 10px;" data-ibxp-text="Field 2"></div>
				<div tabindex='0' data-ibx-type="ibxTextField" data-ibx-name="testDialogText2" data-ibxp-for="testDialogText2" style="width:90%; margin: 10px;"></div>
				<div data-ibx-type="ibxHBox" class="group-btns-hbox" data-ibxp-align="stretch">
					<div tabindex='0' data-ibx-type="ibxButton" class="button show-single-message">Single Message</div>
					<div tabindex='0' data-ibx-type="ibxButton" class="button show-single-message-with-close">Closable Single Message</div>
					<div tabindex='0' data-ibx-type="ibxButton" class="button show-multi-message">Multiple Messages</div>
					<div tabindex='0' data-ibx-type="ibxButton" class="button show-multi-with-details">Multiple Detailed Messages</div>
				</div>
			</div>
		</div>
	</body>
</html>