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
						console.log("ibfs logged in.");
					});
				});
				$(".show-dlg").on("click", function(e)
				{
					$(".test-dlg").ibxWidget("open");

					url = "http://localhost:8080/ibi_apps/tools/ibfs_explore/resources/markup/ibfs_explore_app.htm";
					$(".test-frame").on("load", function(e)
					{
						var wnd = $(this).ibxWidget("contentWindow");
						$(wnd).on("ibfs_explore_loaded", function(e)
						{
							var oConfig = {};
							oConfig.strCaption = "Open";
							oConfig.strRootPath = "IBFS:/WFC/Repository";
							oConfig.strContextPath = "";
							oConfig.strDefaultName = "";
							oConfig.strDefaultExt = "";
							oConfig.typeDefaultExplore = "details";
							oConfig.nFilterIndex = 0;
							oConfig.arFilters = [["All Files", "*.*"]];
							oConfig.arShortcuts = [];

							var dlgArgs = 
							{
								"oConfig":oConfig,
								"customClassName":null,
								"customScriptFilename":null,
								"theme":null,
							};
							wnd.dialogArguments = dlgArgs;
							e.originalEvent.data._args = dlgArgs;
							e.originalEvent.data._init();

						});
					}).ibxWidget("option", "src", url);
				})
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
			.test-dlg
			{
				width:600px;
				height:400px;
			}
			.test-frame
			{
				flex:1 1 auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="show-dlg" data-ibx-type="ibxButton">Dialog...</div>
		
		<div class="test-dlg" data-ibx-type="ibxDialog" data-ibxp-auto-size="false" data-ibxp-resizable="true" data-ibxp-destroy-on-close="false" data-ibxp-caption-options.text="Open">
			<div class="test-frame" data-ibx-type="ibxIFrame" data-ibxp-src=""></div>
		</div>
	</body>
</html>
