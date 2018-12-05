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
			
			function testLoad()
			{
				var rows = [];
				for(var i = 0; i < 100; ++i)
				{
					var cols = [];
					for(var j = 0; j < 20; ++j)
						cols.push($(sformat("<div tabindex='0'>Cell {1}/{2}</div>", i, j))[0]);
					rows.push(cols);
				}

				var grid = $(".ibx-data-grid");

				//grid.ibxWidget("removeAll");
				grid.ibxWidget("option", "defaultColConfig", {resizable:true})
				grid.ibxWidget("addRows", rows);
				grid.ibxWidget("refresh");


				var headers = grid.ibxWidget("getHeaders");
				$(headers).on("click", function(headers, grid, e)
				{
					var col = headers.indexOf(e.currentTarget);
					var header = $(e.currentTarget);
					var col = grid.ibxWidget("getColumn", col);
					$(col).ibxToggleClass("dgrid-cell-selected");


				}.bind(this, headers, grid));
			}

			ibx(function()
			{
				$(".btn-load").on("click", function(e)
				{
					var grid = $(".test-grid");
					var colMap = 
					[
						{"title":"displayName"},
						{"title":"displayValue"},
						{"title":"name"},
						{"title":"value",},
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
							var row = grid.ibxWidget("addRow", row);
							buildTree(prop.props);
						}
					}
					grid.ibxWidget("refresh");
					

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
			.btn-load
			{
				margin:10px;
			}
			.test-grid
			{
				height:400px;
				border:1px solid black;
				margin:100px;
			}
			.dgrid-row:hover
			{
				background-color:#efefef;
			}
			.dgrid-cell:hover
			{
				background-color:thistle;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="center" data-ibxp-command="cmdDelete">
			<div tabindex="0" class="btn-load" data-ibx-type="ibxButton">Load Grid</div>
			<div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid">
			</div>
		</div>
	</body>
</html>
