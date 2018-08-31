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
				Ibfs.load().done(function()
				{
					Ibfs.ibfs.login("admin", "admin").done(function(e)
					{
					});

					$(".test-button").on("click", function(e)
					{
						var dlg = $(".test-editor-dialog");
						dlg.ibxWidget("open");

						var editor = $(".test-editor")
						editor.ibxWidget("text", "Test Editor");
					});
					$(".dlg-btn-popup").on("click", function(e)
					{
						$(".test-popup").ibxWidget("open");
					});
				});
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}

			.main-box
			{
				width:100%;
				height:100%;
				overflow:auto;
				background-color:white;
				box-sizing:border-box;
			}

			.test-editor
			{
				width:300px;
				height:200px;
				margin-top:5px;
				border:1px solid #ccc;
				border-radius:5px;
			}

			.test-popup
			{
				width:100px;
				height:100px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="test-button" data-ibx-type="ibxButton">Editor...</div>
		</div>

		<div class="test-editor-dialog" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false">
			<div tabindex="0" class="dlg-btn-popup" data-ibx-type="ibxButton">Show Popup...</div>
			<div tabindex="0" class="test-editor" data-ibx-type="ibxRichEdit">Julian's test rich edit!</div>
		</div>

		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-auto-close="true" data-ibxp-destroy-on-close="false" data-ibxp-opaque="true">
			Test Popup
		</div>
	</body>
</html>
