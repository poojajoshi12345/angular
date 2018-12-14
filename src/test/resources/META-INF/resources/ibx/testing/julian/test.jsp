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
				$(".btn-load").on("click", function(e)
				{
					var colMap = [];
					var rows = [];
					var nRows = 500;//parseInt($(".num-rows").text(), 10);
					var nCols = parseInt($(".num-cols").text(), 10);

					console.time("totalLoad");
					console.time("genRows");
					for(var i = 0; i < nRows; ++i)
					{
						var row = $("<div></div>").ibxDataGridRow({"title":i, "size":null});
						for(var j = 0; j < nCols; ++j)
						{
							var cell = $(sformat("<div style='user-select:none;'>Cell ({1},{2})</div>", i+1, j+1));
							row.append(cell)
							if(i == 0)
								colMap.push($.extend({}, {"title":"Column " + j, "resizable":true}))
						}
						rows.push(row);
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

					/*
					var grid = $(".test-grid");
					var colMap = 
					[
						{"title":"displayName"},
						{"title":"displayValue"},
						{"title":"name"},
						{"title":"value"},
						{"title":"type", "size":"50px"},
						{"title":"uiType", "size":"75px"},
						{"title":"expanded", "size":"100px", "flex":true, "justify":"center"},
					];
					grid.ibxWidget("option", {"defaultColConfig":{justify:"start", resizable:true}, "colMap":colMap});
					
					//grid.ibxWidget("removeAll");
					buildTree(testProps);
					function buildTree(props)
					{
						for(var i = 0; props && i < props.length; ++i)
						{
							var row = [];
							prop = props[i];
							for(var key in prop)
							{
								if(!(prop[key] instanceof Object))
								{
									var cell = $("<div>").ibxLabel({text:(prop[key]).toString()})[0];
									row.push(cell);
								}
							}
							var row = grid.ibxWidget("addRow", row, null, null, false);
							buildTree(prop.props);
						}
					}

					grid.ibxWidget("refresh");
					*/
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
				<div tabindex="0" class="btn-load" data-ibx-type="ibxButton">Load Grid</div>
				<div data-ibx-type="ibxLabel" data-ibxp-for=".num-cols">Cols:</div>
				<div tabindex="0" class="text-entry num-cols" data-ibx-type="ibxLabel" data-ibxp-justify="center">10</div>
				<div class="" data-ibx-type="ibxLabel" data-ibxp-for=".num-rows">Rows:</div>
				<div tabindex="0" class="text-entry num-rows" data-ibx-type="ibxLabel" data-ibxp-justify="center">100</div>
				<div tabindex="0" class="btn-col-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Column Headings</div>
				<div tabindex="0" class="btn-row-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Row Headings</div>
			</div>

			<div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid">
			</div>
		</div>
	</body>
</html>
