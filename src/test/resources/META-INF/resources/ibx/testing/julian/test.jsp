<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.349 $:
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
				$(".ibx-menu-button").on("ibx_select", function(e)
				{
					var data = $(e.originalEvent.data);
					var userValue = $(e.target).ibxWidget("userValue");
					console.log(data, userValue);
				})
			},
			[{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			body
			{
				margin:0px;
				position:absolute;
				width:100%;
				height:100%;
				box-sizing: border-box;
			}
			.menu-btn
			{
				width:200px;
				padding:5px;
				margin:5px;
				border:1px solid #ccc;
			}
		</style>
	</head>
	<body class="ibx-root" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
		<select class="menu-btn">
			<option>Item 1</option>
			<option>Item 2</option>
			<option>Item 3</option>
		</select>
		<div tabindex="0" class="menu-btn no-select" data-ibx-type="ibxMenuButton" data-ibxp-show-arrow="true" data-ibxp-use-value-as-text="true">ibxMenuButton
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
		<div tabindex="0" class="menu-btn no-select" data-ibx-type="ibxVMenuButton" data-ibxp-show-arrow="true" data-ibxp-use-value-as-text="true">ibxMenuButton
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
		<div tabindex="0" class="menu-btn single-select" data-ibx-type="ibxSelectMenuButton" data-ibxp-editable="true" data-ibxp-use-value-as-text="true">ibxSelectMenuButton - single
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
		<div tabindex="0" class="menu-btn multi-select" data-ibx-type="ibxSelectMenuButton" data-ibxp-multi-select="true" data-ibxp-use-value-as-text="true">ibxSelectMenuButton - multi
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item1">Item 1</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item2">Item 2</div>
			<div data-ibx-type="ibxCheckMenuItem" data-ibxp-user-value="item3">Item 3</div>
		</div>
		<div tabindex="0" class="menu-btn date" data-ibx-type="ibxMenuButton" data-ibxp-show-arrow="true">Date...
			<div data-ibx-type="ibxDatePicker" data-ibxp-type="inline"></div>
		</div>

		<div class="test-menu" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem">Item</div>
			<div data-ibx-type="ibxMenuItem">Item</div>
			<div data-ibx-type="ibxMenuItem">Item</div>
		</div>
	</body>
</html>
