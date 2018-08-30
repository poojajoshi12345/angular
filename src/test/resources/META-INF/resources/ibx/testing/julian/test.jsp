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
						
						var def1 = Ibfs.ibfs.listItems("IBFS:/WFC/Repository", {asJSON:true})
						def1.id = "def1";
						def1.done(function(exInfo)
						{
							console.log("def1 resolved");
						});

						var def2 = Ibfs.ibfs.listItems("IBFS:/WFC/Repository/Public", {asJSON:true})
						def2.id = "def2";
						def2.done(function(exInfo)
						{
							console.log("def2 resolved");
						});

						var arDefs = [def1.deferred, def2.deferred]
						$.when.apply($.Deferred, arDefs).done(function()
						{
							console.log("array resolved");
						});

						for(var i = 0; i < 5; ++i)
						{
							$(".dlg-menu").off("ibx_beforeopen").on("ibx_beforeopen", function(e, info)
							{
								console.log(e.type);
							});
						}
					});
				});
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">
		<div data-ibx-type="ibxMenuButton">Menu Here
			<div data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxMenuItem">Dialog Item
					<div class="dlg-menu" data-ibx-type="dialogMenuItem">
						<div data-ibx-type="ibxButton">Test Button</div>
					</div>
				</div>
				<div data-ibx-type="ibxMenuItem">Regular Item
					<div data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">Normal Menu Item</div>
					</div>
				</div>
			</div>
		</div>

		<

	</body>
</html>
