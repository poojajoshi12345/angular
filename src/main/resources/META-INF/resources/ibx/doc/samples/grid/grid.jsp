<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
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

				$(".text-entry").on("ibx_widgetfocus ibx_widgetblur", function(e)
				{
					var input = $(e.target);
					if(e.type == "ibx_widgetfocus")
						input.ibxWidget("startEditing");
					else
					if(e.type == "ibx_widgetblur")
						input.ibxWidget("stopEditing");
				})

				$(".ibx-data-grid").on("ibx_gridheaderupdate", function(e)
				{
					var grid = $(".ibx-data-grid");
					var data = e.originalEvent.data;
					if(data.type == "column")
					{
						$(data.header).on("click", function(e)
						{
							grid.ibxWidget("selectColumn", data.idx, true);
						});
					}
					else
					if(data.type == "row")
					{
						$(data.header).on("click", function(e)
						{
							grid.ibxWidget("selectRow", data.idx, true);
						});
					}
				});

				$(".btn-col-headers, .btn-row-headers, .btn-hide-cols, .btn-hide-rows").on("ibx_change", function(e)
				{
					updateDataGridSettings();
				});

				$(".btn-load").on("click", function(e)
				{
					var rows = [];
					var nRows = parseInt($(".num-rows").text(), 10);
					var nCols = parseInt($(".num-cols").text(), 10);
					for(var i = 0; i < nRows; ++i)
					{
						var cols = [];
						for(var j = 0; j < nCols; ++j)
						{
							var cell = $(sformat("<div style='user-select:none;'>Cell {1}/{2}</div>", i, j));
							cell.ibxAddClass("ibx-flexbox fbx-inline fbx-row fbx-align-items-center fbx-aligncontent-center").on("dblclick", function(e)
							{
								$(e.target).ibxEditable("startEditing");
							})
							cols.push(cell[0]);
						}
						var row = $("<div>").ibxDataGridRow();
						row.append(cols)
						rows.push(row);
					}

					var grid = $(".ibx-data-grid");
					console.time("totalLoad");
					updateDataGridSettings();
					grid.ibxWidget("removeAll");
					grid.ibxWidget("addRows", rows, null, null);
					console.timeEnd("totalLoad");
				});

				function updateDataGridSettings()
				{
					var grid = $(".ibx-data-grid");
					var hideCols = $(".btn-hide-cols").ibxWidget("checked");
					var hideRows = $(".btn-hide-rows").ibxWidget("checked");
					var colMap = [];
					var nCols = parseInt($(".num-cols").text(), 10);
					for(var i = 0; i < nCols; ++i)
						colMap.push({"title":"Column " + i, "size":"100px"});

					var grid = $(".ibx-data-grid").ibxWidget("option",
					{
						"colMap":colMap,
						"showColumnHeaders":$(".btn-col-headers").ibxWidget("checked"),
						"showRowHeaders":$(".btn-row-headers").ibxWidget("checked"),
						"defaultColConfig":{"resizable":true}
					});
				}

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
			}, [{"src":"./resources/grid_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>
