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
				$(".text-entry").ibxWidget("startEditing", {selectAll:false, cancelKey:null, commitOnBlur:false, commitKey:null});
				$(".btn-col-headers").on("ibx_change", function(e){$(".ibx-data-grid").ibxWidget("option", "showColumnHeaders", $(e.target).ibxWidget("checked"));});
				$(".btn-row-headers").on("ibx_change", function(e){$(".ibx-data-grid").ibxWidget("option", "showRowHeaders", $(e.target).ibxWidget("checked"));});
				$(".btn-expand-all").on("click", function(e){$(".ibx-data-grid").ibxWidget("expandRow", null, true);});
				$(".btn-collapse-all").on("click", function(e){$(".ibx-data-grid").ibxWidget("expandRow", null, false);});
				$(".indent-col").on("ibx_widgetblur", function(e)
				{
					//var val = parseInt($(e.target).text(), 10);
					//$(".ibx-data-grid").ibxWidget("option", "indentColumn", val);
				});

				$(".btn-load-ibfs").on("click", function(e)
				{
					var listing = $.get("./test_ibfs_listing.html", null, null, "xml").done(function(xDoc, status, xhr)
					{
						var colMap = 
						[
							{"title":"Title","size":"200px","attr":"description","hasIcon":true},
							{"title":"Name","size":"200px","attr":"name"},
							//{"title":"Summary","attr":""},
							//{"title":"Tags","attr":""},
							{"title":"Last Modified","size":"150px","attr":"lastModified","type":"date"},
							{"title":"Created On","size":"150px","attr":"createdOn","type":"date"},
							{"title":"Size","attr":"length","type":"size"},
							//{"title":"Owner","attr":"ownerName"},
							//{"title":"Published","attr":""},
							//{"title":"Shown","attr":""},
						];

						var grid = $(".test-grid");
						grid.ibxWidget("removeAll");
						grid.ibxWidget("option", {"defaultColConfig":{justify:"start", resizable:true}, "indentColumn":0, "colMap":colMap});

						var rootItems = xDoc.querySelectorAll("rootObject > item");
						var rows = $(buildTree(rootItems));
						grid.ibxWidget("addRows", rows).ibxWidget("updateHeaders", "both");
						grid.ibxWidget("refresh");
						console.warn("You were figuring out why the files have a different line height than the folders?!");
						function buildTree(items)
						{
							var rows = [];
							for(var i = 0; i < items.length; ++i)
							{
								var item = items[i];
								var container = item.hasAttribute("container");
								var row = $("<div>").data("ibfsItem", item).ibxDataGridRow({"title":"IBFS Item", "container":container, "expanded":false});
								row.on("ibx_beforeexpand", function(grid, e)
								{
									var row = $(e.target);
									$(row.ibxDataGridRow("childRows")).detach();
									
									var item = row.data("ibfsItem");
									var rows = buildTree(item.querySelectorAll("children > item"));
									row.ibxDataGridRow("addRow", rows);
									grid.ibxWidget("addRows", rows, row);
									grid.ibxWidget("refresh");
								}.bind(null, grid));
								rows.push(row);

								var cells = [];
								$(colMap).map(function(idx, col)
								{
									var cell = $("<div tabindex='0'></div>").ibxAddClass("ibfs-item-cell");
									var attr = item.getAttribute(col.attr);
									if(col.type == "date")
									{
										date = new Date(Number(attr));
										attr = sformat("{4}:{5} {1}/{2}/{3}", date.getMonth(), date.getDay(), date.getYear(), date.getHours(), date.getMinutes());
									}
									else
									if(col.type == "size")
										attr = container ? "" : Math.round((Math.max(Number(attr), 1024)/1024)) + "KB";
									cell.text(attr);

									if(col.hasIcon)
									{
										var icon = $("<div>").ibxAddClass("material-icons ibfs-item-icon");
										icon.text(container ? "folder" : "insert_drive_file");
										cell.prepend(icon);
									}

									cells.push(cell);
								});
								row.append(cells);
							}
							return rows;
						}
					});
				});

				$(".btn-load-props").on("click", function(e)
				{
					var grid = $(".test-prop-grid");
					grid.on("ibx_start_prop_edit ibx_end_prop_edit ibx_ ibx_prop_create_ui", function(e)
					{
						var eType = e.type;
						var prop = e.originalEvent.data;
						if(eType == "ibx_end_prop_edit")
							$(".test-grid").css(prop.name, prop.value);
					}).ibxWidget("option", "props", testProps);
				});

				$(".btn-load-grid").on("click", function(e)
				{
					var colMap = [];
					var rows = [];
					var nRows = parseInt($(".num-rows").text(), 10);
					var nCols = parseInt($(".num-cols").text(), 10);
					var grid = $(".test-grid");

					console.time("totalLoad");
					grid.ibxWidget("initGrid", nRows, nCols);
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

				document.activeElement.blur();
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
				min-width:30px;
				padding:3px;
				border:1px solid #ccc;
				border-radius:5px;
			}
			.text-entry > .ibx-label-text
			{
				flex:1 1 auto;
			}
			.test-grid, .test-prop-grid
			{
				height:500px;
				border:1px solid black;
				margin:10px;
			}
			.ibfs-item-cell
			{
			}
			.ibfs-item-icon
			{
				flex:0 0 auto;
				padding-right:3px;
				font-size:inherit;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="start" data-ibxp-command="cmdDelete">
			<div class="tool-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div tabindex="0" class="btn-load-ibfs" data-ibx-type="ibxButton">Load IBFS</div>
				<div tabindex="0" class="btn-load-props" data-ibx-type="ibxButton">Load Properties</div>
				<div tabindex="0" class="btn-load-grid" data-ibx-type="ibxButton">Load Grid</div>
				<div class="" data-ibx-type="ibxLabel" data-ibxp-for=".num-rows">Rows:</div>
				<div tabindex="0" class="text-entry num-rows" data-ibx-type="ibxLabel" data-ibxp-justify="center">500</div>
				<div data-ibx-type="ibxLabel" data-ibxp-for=".num-cols">Cols:</div>
				<div tabindex="0" class="text-entry num-cols" data-ibx-type="ibxLabel" data-ibxp-justify="center">10</div>
				<div tabindex="0" class="btn-col-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Column Headings</div>
				<div tabindex="0" class="btn-row-headers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Show Row Headings</div>
				<div tabindex="0" class="btn-expand-all" data-ibx-type="ibxButton">Expand All</div>
				<div tabindex="0" class="btn-collapse-all" data-ibx-type="ibxButton">Collapse All</div>
				<div class="" data-ibx-type="ibxLabel" data-ibxp-for=".indent-col">Indent Column:</div>
				<div tabindex="0" class="text-entry indent-col" data-ibx-type="ibxLabel" data-ibxp-justify="center">0</div>

			</div>

			<div tabindex="0" class="test-prop-grid" data-ibx-type="ibxPropertyGrid"></div>


			<div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid" data-ibxp-show-row-headers="true">
				<div data-ibxp-grid-col-map>
					<div data-ibxp-size="200px" data-ibxp-flex="true">First Name</div>
					<div>Middle Name</div>
					<div>Last Name</div>
					<div>Sex</div>
					<div>Age</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Jane</div><div tabindex="0">Susan</div><div tabindex="0">Aimes</div><div tabindex="0">Female</div><div tabindex="0">54</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Bruce</div><div tabindex="0">John</div><div tabindex="0">Aimes</div><div tabindex="0">Male</div><div tabindex="0">54</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Robert</div><div tabindex="0">Michael</div><div tabindex="0">Aimes</div><div tabindex="0">Male</div><div tabindex="0">63</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Elizabeth</div><div tabindex="0">Ruth</div><div tabindex="0">Aimes</div><div tabindex="0">Female</div><div tabindex="0">59</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Erica</div><div tabindex="0">Betty</div><div tabindex="0">Barry</div><div tabindex="0">Female</div><div tabindex="0">54</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Donald</div><div tabindex="0">Jackson</div><div tabindex="0">Michaels</div><div tabindex="0">Male</div><div tabindex="0">54</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Jeanette</div><div tabindex="0">Rose</div><div tabindex="0">Smith</div><div tabindex="0">Male</div><div tabindex="0">59</div>
				</div>
				<div data-grid-row data-ibxp-title="Person">
					<div tabindex="0">Achilles</div><div tabindex="0">Agamemmnon</div><div tabindex="0">Zavetakis</div><div tabindex="0">Male</div><div tabindex="0">63</div>
				</div>
			</div>
		</div>
	</body>
</html>
