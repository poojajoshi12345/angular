﻿<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision$--%>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx grid sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				var gridTabs = ibx.resourceMgr.getResource(".grid-tabs").data("ibxWidget");
				$("body").append(gridTabs.element);

				gridTabs.rgCellsJustify.on("ibx_change", function(e, rg)
				{
					rg = $(rg);
					var value = rg.ibxWidget("userValue");
					$(".grid").ibxWidget("option", "justify", value);
				});
				gridTabs.rgCellsAlign.on("ibx_change", function(e, rg)
				{
					rg = $(rg);
					var value = rg.ibxWidget("userValue");
					$(".grid").ibxWidget("option", "align", value);
				});
				gridTabs.rgGridJustify.on("ibx_change", function(e, rg)
				{
					rg = $(rg);
					var value = rg.ibxWidget("userValue");
					$(".grid").ibxWidget("option", "justifyContent", value);
				});
				gridTabs.rgGridAlign.on("ibx_change", function(e, rg)
				{
					rg = $(rg);
					var value = rg.ibxWidget("userValue");
					$(".grid").ibxWidget("option", "alignContent", value);
				});	

				gridTabs.chkInline.on("ibx_change", function(e, chkBox)
				{
					var checked = $(chkBox).ibxWidget("checked");
					$(".grid").ibxWidget("option", "inline", checked);
				});

				var gridMenu = ibx.resourceMgr.getResource(".grid-menu").data("ibxWidget");
				gridMenu.rgSelfJustify.on("ibx_change", function(e, target)
				{
					rg = $(e.target);
					var value = rg.ibxWidget("userValue");
					var cell = rg.data("gridCell");
					$(cell).data("ibxJustify", value);
					$(".grid").ibxWidget("refresh");
				});
				gridMenu.rgSelfAlign.on("ibx_change", function(e, target)
				{
					rg = $(e.target);
					var value = rg.ibxWidget("userValue");
					var cell = rg.data("gridCell");
					$(cell).data("ibxAlign", value);
					$(".grid").ibxWidget("refresh");
				});
				$(".grid").on("ibx_ctxmenu", function(e)
				{
					gridMenu.rgSelfJustify.data("gridCell", e.target);
					gridMenu.rgSelfAlign.data("gridCell", e.target);
					e.result = gridMenu.element;
				});


				$(".flex-grid-cell").on("click", function(e)
				{
					var cell = $(e.target);
					var row = cell.data("gridRow");
					var col = cell.data("gridCol");
					alert(sformat("You clickd on - row: {1} column: {2}", row, col));
				});
			}, ["../testing/samples/grid/resources/grid_res_bundle.xml"], true);
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>
