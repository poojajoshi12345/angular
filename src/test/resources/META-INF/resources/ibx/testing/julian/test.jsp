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
				var listBox = $(".list-box");
				var itemBox = $(".item-box");
				for(var i = 0; i < 50; ++i)
				{
					var listItem = $("<div class='list-item'>");
					listItem.text("List Item " + i);
					listBox.ibxWidget("add", listItem);

					var testItem = $("<div class='test-item'>");
					testItem.text("Test Item " + i);
					itemBox.ibxWidget("add", testItem);

				}
			}, null, true);
		</script>
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				border:1px solid red;
			}
			.menu-bar
			{
				flex:0 0 auto;
				border:1px solid black;
			}
			.content-box
			{
				flex:1 1 auto;
				border:1px solid lime;
			}
			.list-box
			{
				flex:1 0 auto;
				overflow:auto;
				border:2px solid magenta;
			}
			.list-item
			{
				padding:5px;
				margin:2px;
				border:1px solid cyan;
			}
			.item-box
			{
				flex:1 1 auto;
				overflow:auto;
				border:2px solid yellow;
			}
			.test-item
			{
				flex:0 0 auto;
				width:100px;
				height:100px;
				margin:5px;
				border:1px solid orange;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="menu-bar" data-ibx-type="ibxHMenuBar">
				<div data-ibx-type="ibxMenuButton">File
					<div data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">Open...</div>
						<div data-ibx-type="ibxMenuItem">Close...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem">Save</div>
						<div data-ibx-type="ibxMenuItem">Save As...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem">Quit</div>
					</div>
				</div>
			</div>
		
			<div class="content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="list-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				</div>
				<div data-ibx-type="ibxVSplitter"></div>
				<div class="item-box" data-ibx-type="ibxHBox" data-ibxp-wrap="true">
				</div>
			</div>
		</div>
	</body>
</html>





