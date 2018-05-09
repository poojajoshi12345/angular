<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx tree sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			ibx(function()
			{
				//$(".test-tree").on("ibx_nodeselect ibx_nodedeselect ibx_nodeanchored ibx_nodeunanchored ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse", function(e)
				$(".test-tree").on("ibx_nodeanchored ibx_nodeunanchored", function(e)
				{
					//console.log(e.type, e.target);
				})
				$("body").on("dblclick", function(e)
				{
					//console.log("body", e.type);
				});
				$(".cmdTest").on("ibx_triggered", function(e)
				{
					var kids = $(".ibx-nav-key-child");
					console.log(kids);
				});

				$(".btnLoad").on("click", function(e)
				{
					var tree = $(".test-tree")
					tree.ibxWidget("remove");

					$.ibi.ibxWidget.noRefresh = true;
					var root = $("<div class='root-tree-node'>").ibxTreeNode({"expanded":true, "text":"Root Node", "labelOptions":{"glyph":"folder", "glyphClasses":"material-icons"}}).appendTo(tree);
					for(var i = 0; i < 10; ++i)
					{
						var parentNode = $("<div class='tree-parent'>").ibxTreeNode({"draggable":false, "text": sformat("Tree Node {1}", i), "labelOptions":{"glyph":"folder", "glyphClasses":"material-icons"}})
						root.ibxWidget("add", parentNode);
						for(var j = 0; j < 10; ++j)
						{
							var childNode = $("<div class='tree-child'>").ibxTreeNode({"text": sformat("Tree Node {1}-{2}", i, j), "labelOptions":{"glyph":"android", "glyphClasses":"material-icons"}})
							parentNode.ibxWidget("add", childNode);
						}
					}
					$.ibi.ibxWidget.noRefresh = false;
					tree.ibxWidget("refresh", true);
				});

				$(".btnHPStyle").on("ibx_change", function(e)
				{
					var checked = $(e.target).ibxWidget("checked");
					$(".test-tree").toggleClass("hp-style", checked);
				});
				$(".btnSingleClickExpand").on("ibx_change", function(e)
				{
					var checked = $(e.target).ibxWidget("checked");
					$(".test-tree .ibx-tree-node").ibxWidget("option", "singleClickExpand", checked, false);
				});
				$(".btnExpandAll").on("click", function(e)
				{
					$(".test-tree .ibx-tree-node").ibxWidget("toggleExpanded", true);
				});
				$(".btnCollapseAll").on("click", function(e)
				{
					$(".test-tree .ibx-tree-node").ibxWidget("toggleExpanded", false);
				});
			}, true);
		</script>

		<style type="text/css">
		.test-tree
		{
			xheight:300px;
			width:200px;
			overflow:auto;
			border:1px solid #ccc;
		}
		.btn-bar > *
		{
			margin:5px;
		}

		.tnode-selection-anchor > .tnode-label
		{
			font-weight:bold;
		}

		/*IBI WF Tree Styles*/
		.hp-style .tnode-label
		{
			font-family:roboto;
			font-size:12px;
			line-height:16px;
			color: rgb(85, 85, 85);
			border-bottom:1px solid rgba(0, 0 , 0, 0.05);
		}
		.hp-style .tnode-indent
		{
			padding-left:10px;
		}
		.hp-style .tnode-label:hover, .hp-style .tnode-label.ibx-nav-key-item-active
		{
			background-color:rgba(53, 184, 254, 0.1);
		}
		.hp-style .tnode-selected > .tnode-label
		{
			background-color:rgba(53, 184, 254, 0.4);
		}
		</style>
	</head>
	<body class="ibx-root">
		<div class="cmdTest" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div class="btn-bar" data-ibx-type="ibxHBox" data-ibxp-inline="false" data-ibxp-align="center">
			<div class="btnLoad" data-ibx-type="ibxButton">Load Tree</div>
			<div class="btnHPStyle" data-ibx-type="ibxCheckBoxSimple">Home Page Style</div>
			<div class="btnSingleClickExpand" data-ibx-type="ibxCheckBoxSimple">Single Click Expand</div>
			<div class="btnExpandAll" data-ibx-type="ibxButton">Expand All</div>
			<div class="btnCollapseAll" data-ibx-type="ibxButton">Collapse All</div>
		</div>
		<div tabindex="0" class="test-tree" data-ibx-type="ibxTree">
		</div>
	</body>
</html>