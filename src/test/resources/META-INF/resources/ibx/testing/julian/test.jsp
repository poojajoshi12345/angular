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
				$(".text-entry").ibxWidget("startEditing", {selectAll:false, cancelKey:null, commitOnBlur:false});
				document.activeElement.blur();

				$(".btn-load-props").on("click", function(e)
				{
					var grid = $(".ibx-data-grid");
					grid.ibxWidget("removeAll");

					var rowCount = 0;
					buildTree(testProps);
					function buildTree(props, parentRow)
					{
						var rows = [];
						for(var i = 0; props && i < props.length; ++i)
						{
							var row = $("<div>").ibxDataGridRow({"title":rowCount++}).on("dblclick", function(e)
							{
								var row = $(e.currentTarget);
								row.ibxDataGridRow("toggleExpand"); 
							});
							row.ibxDataGridRow("setParent", parentRow);
							rows.push(row);

							prop = props[i];
							for(var key in prop)
							{
								if(!(prop[key] instanceof Object))
								{
									var cell = $("<div>").text(prop[key]);
									row.append(cell);
								}
							}
							grid.ibxWidget("addRow", row, null, null, false);
							var childRows = buildTree(prop.props, row);
							if(childRows.length)
								row.ibxDataGridRow({"container":true});
							row.ibxDataGridRow("refresh");
						}
						return rows;
					}

					var colMap = 
					[
						{"title":"displayName", "size":"150px"},
						{"title":"displayValue"},
						{"title":"name"},
						{"title":"value"},
						{"title":"type", "size":"50px"},
						{"title":"uiType", "size":"75px"},
						{"title":"expanded", "size":"100px", "flex":true, "justify":"center"},
					];
					grid.ibxWidget("option", {"defaultColConfig":{justify:"start", resizable:true}, "colMap":colMap});
				});

				$(".btn-load-grid").on("click", function(e)
				{
					var colMap = [];
					var rows = [];
					var nRows = parseInt($(".num-rows").text(), 10);
					var nCols = parseInt($(".num-cols").text(), 10);

					console.time("totalLoad");
					console.time("genRows");
					for(var i = 0; i < nRows; ++i)
					{
						var row = $("<div></div>").ibxDataGridRow({"container":false, "title":i, "size":null}).ibxAddClass("row-" + i).on("dblclick", function(e)
						{
							var row = $(e.currentTarget);
							row.ibxDataGridRow("toggleExpand"); 
						});

						for(var j = 0; j < nCols; ++j)
						{
							var cell = $(sformat("<div style='user-select:none;'>Cell ({1},{2})</div>", i+1, j+1));
							row.append(cell)
							if(i == 0)
								colMap.push($.extend({}, {"title":"Column " + j, "resizable":true}))
						}
						rows.push(row);

						var childRow = $("<div></div>").ibxDataGridRow({"title":"CHILD"+i, "size":null}).ibxAddClass("child-row-" + i);
						childRow.ibxDataGridRow("setParent", row);
						rows.push(childRow);

					}
					console.timeEnd("genRows");

					var showRowH = $(".btn-row-headers").ibxWidget("checked");
					var showColH = $(".btn-col-headers").ibxWidget("checked");
					var grid = $(".ibx-data-grid");

					console.time("popGrid");
					grid.ibxWidget("removeAll");
					grid.ibxWidget("option", {"colMap":colMap, "showColumnHeaders":showColH, "showRowHeaders":showRowH});
					grid.ibxWidget("addRows", rows);
					grid.ibxWidget("refresh");
					console.timeEnd("popGrid");
					console.timeEnd("totalLoad");

					var headers = grid.ibxWidget("getHeaders");
					$(headers).on("click", function(headers, grid, e)
					{
						var colIdx = headers.index(e.currentTarget);
						grid.ibxWidget("selectColumn", colIdx, true);
					}.bind(this, headers, grid));

					var headers = grid.ibxWidget("getHeaders", "row");
					$(headers).on("click", function(headers, grid, e)
					{
						var rowIdx = headers.index(e.currentTarget);
						grid.ibxWidget("selectRow", rowIdx, true);
					}.bind(this, headers, grid));

				});
			},
			[{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.tool-bar
			{
				padding:5px;
				border-bottom:1px solid #ccc;
			}
			.tool-bar > div
			{
				margin:3px;
			}
			.text-entry
			{
				min-width:25px;
				padding:3px;
				border:1px solid #ccc;
				border-radius:5px;
			}
			.test-grid
			{
				height:500px;
				border:1px solid black;
				margin:100px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="start" data-ibxp-command="cmdDelete">
			<div class="tool-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div tabindex="0" class="btn-load-props" data-ibx-type="ibxButton">Load Properties</div>
				<div tabindex="0" class="btn-load-grid" data-ibx-type="ibxButton">Load Grid</div>
				<div class="" data-ibx-type="ibxLabel" data-ibxp-for=".num-rows">Rows:</div>
				<div tabindex="0" class="text-entry num-rows" data-ibx-type="ibxLabel" data-ibxp-justify="center">100</div>
				<div data-ibx-type="ibxLabel" data-ibxp-for=".num-cols">Cols:</div>
				<div tabindex="0" class="text-entry num-cols" data-ibx-type="ibxLabel" data-ibxp-justify="center">10</div>
				<div tabindex="0" class="btn-col-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Column Headings</div>
				<div tabindex="0" class="btn-row-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Row Headings</div>
			</div>

			<div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid" data-ibxp-show-row-headers="true" data-ibxp-indent-column="0">
				<div data-ibxp-grid-col-map>
					<div data-ibxp-size="200px">First Name</div>
					<div>Middle Name</div>
					<div>Last Name</div>
					<div>Sex</div>
					<div>Age</div>
				</div>
				<div data-grid-row data-ibxp-title="1">
					<div>Julian</div><div>Alexander</div><div>Hyman</div><div>Male</div><div>54</div>
				</div>
				<div data-grid-row data-ibxp-title="2">
					<div>James</div><div>Edward</div><div>Hyman</div><div>Male</div><div>59</div>
				</div>
				<div data-grid-row data-ibxp-title="3">
					<div>Charles</div><div>Lewis</div><div>Hyman</div><div>Male</div><div>63</div>
				</div>
			</div>
		</div>
	</body>
</html>
