<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx test</title>
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
				$(".julian").on("click", function(e)
				{
					var foo = $("<div class='foo-bar'>").ibxSelectItem();
					debugger;
				});
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:relative;
			}
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				border:2px solid red;
				padding:5px;
			}
			.menu-bar
			{
			}
			.iframe-content
			{
				flex:1 1 auto;
				border:1px solid #ccc;
			}

			.test-widget
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="menu-bar" data-ibx-type="ibxHMenuBar" data-ibxp-align="center">
				<div data-ibx-type="ibxMenuButton">Menu
					<div data-ibx-type="ibxMenu">
						<div class="julian" data-ibx-type="ibxMenuItem">Julian</div>
						<div data-ibx-type="ibxMenuItem">James</div>
						<div data-ibx-type="ibxMenuItem">Charles</div>
						<div data-ibx-type="ibxMenuItem">
							<div data-ibx-type="ibxMenu">
								<div data-ibx-type="ibxMenuItem">Telu</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="iframe-content" data-ibx-type="ibxIFrame"></div>
			<div class="iframe-content" data-ibx-type="ibxIFrame"></div>
			<div class="iframe-content" data-ibx-type="ibxIFrame"></div>
		</div>
	</body>
</html>

