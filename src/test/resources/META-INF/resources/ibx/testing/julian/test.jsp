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
						$(".test-editor-dialog").ibxWidget("open");
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

			.test-popup
			{
				border:1px solid #aaa;
				box-shadow:0px 0px 15px 0px #999;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="test-button" data-ibx-type="ibxButton">Editor...</div>
		</div>

		<div class="test-edit-dialog" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false">
			<div class="test-editor" data-ibx-type="ibxRichEdit">Julian's test rich edit!</div>
		</div>

		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-auto-close="false" data-ibxp-destroy-on-close="false" data-ibxp-opaque="true">
			<div class="test-slider" data-ibx-type="ibxHRange" data-ibx-options="{value:25, value2:75, valueTextPos:'end', minTextPos:'center', maxTextPos:'center'}"></div>
		</div>
	</body>
</html>
