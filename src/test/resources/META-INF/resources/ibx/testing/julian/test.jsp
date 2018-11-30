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
					var grid = $(".test-grid");
					var colMap = 
					[
						{"title":"displayName", "size":"100px", "justify":"start"},
						{"title":"displayValue", "size":"100px", "justify":"start"},
						{"title":"name", "size":"75px", "justify":"start"},
						{"title":"value", "size":"75px", "justify":"start"},
						{"title":"type", "size":"75px", "justify":"start"},
						{"title":"uiType", "size":"75px", "justify":"start"},
						{"title":"expanded", "size":"*", "justify":"start"},
					];
					grid.ibxWidget("option", {"colMap":colMap});

					grid.ibxWidget("removeAll");
					var rowCount = 1;
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
									var cell = $("<div tabindex='0'>").ibxLabel({text:(prop[key]).toString()})[0];
									row.push(cell);
								}
							}
							var row = grid.ibxWidget("addRow", row);
							row.classList.add("row" + rowCount++);
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
				margin:10px;
			}
			.dgrid-row:hover
			{
				background-color:#efefef;
			}
			.dgrid-cell:hover
			{
				background-color:thistle;
			}
			.dgrid-cell:focus
			{
				background-color:black;
				color:white;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="center" data-ibxp-command="cmdDelete">
			<div class="btn-load" data-ibx-type="ibxButton">Load Grid</div>
			<div class="test-grid" data-ibx-type="ibxDataGrid"></div>
		</div>
	</body>
</html>
