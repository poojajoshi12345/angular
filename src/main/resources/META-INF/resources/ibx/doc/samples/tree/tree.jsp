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
				$(".test-tree").on("ibx_beforeexpand", function(e)
				{
					$.ibi.ibxWidget.noRefresh = true;
					var targetNode = $(e.target);
					var xItem = targetNode.data("xItem");
					targetNode.ibxWidget("remove");
					var xItems = xItem.children("children").children("item");
					xItems.each(function(idx, el)
					{
						var treeNode = makeTreeNode(el, "ibfs_item");
						targetNode.ibxWidget("add", treeNode);
						
					});
					$.ibi.ibxWidget.noRefresh= false;
					targetNode.ibxWidget("refresh", true);
				})

				$(".btnLoad").on("click", function(e)
				{
					var tree = $(".test-tree")
					tree.ibxWidget("remove");
					$.get("./tree_sample.xml").then(function(doc, status, xhr)
					{
						doc = $(doc);
						tree.data("xDoc", doc);
						var item = doc.find("rootObject > item");
						var rootNode = makeTreeNode(item, "ibfs_root");
						tree.ibxWidget("add", rootNode, null, null, true);
						rootNode.ibxWidget("option", "expanded", true);
					});
				});

				function makeTreeNode(xItem, itemClass, expanded)
				{
					xItem = $(xItem);
					var container = xItem.attr("container");
					var glyph = container ? "folder" : "android";
					var node = $("<div>").ibxTreeNode({"expanded":expanded, "container":container, "text": xItem.attr("description"), "labelOptions":{"glyph": glyph, "glyphClasses":"material-icons"}});
					node.data("xItem", xItem).addClass(itemClass);
					return node;
				}

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
				$(".cmdTest").on("ibx_triggered", function(e)
				{
					console.clear();
					var kids = $(".ibx-nav-key-item-active");
					console.log(kids);
				});
			}, true);
		</script>

		<style type="text/css">
		html, body
		{
			width:100%;
			height:100%;
			margin:0px;
			box-sizing:border-box;
		}
		.main-box
		{
			width:100%;
			height:100%;
			padding:5px;
			box-sizing:border-box;
		}
		.btn-bar
		{
			flex:0 0 auto;
		}
		.btn-bar > *
		{
			margin:5px;
		}
		.content-box
		{
			flex:1 1 auto;

		}
		.test-tree
		{
			width:15%;
			min-width:50px;
			overflow:auto;
			border:1px solid #ccc;
			border-radius:5px;
			padding:5px;
		}
		.test-splitter
		{
			margin:0px 2px 0px 2px;
		}
		.test-content
		{
			flex:1 1 auto;
			border:1px solid #ccc;
			border-radius:5px;
			background-color:#eee;
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
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="btn-bar" data-ibx-type="ibxHBox" data-ibxp-inline="false" data-ibxp-align="center">
				<div class="btnLoad" data-ibx-type="ibxButton">Load Tree</div>
				<div class="btnHPStyle" data-ibx-type="ibxCheckBoxSimple">Home Page Style</div>
				<div class="btnSingleClickExpand" data-ibx-type="ibxCheckBoxSimple">Single Click Expand</div>
				<div class="btnExpandAll" data-ibx-type="ibxButton">Expand All</div>
				<div class="btnCollapseAll" data-ibx-type="ibxButton">Collapse All</div>
			</div>
			<div class="content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div tabindex="0" class="test-tree" data-ibx-type="ibxTree"></div>
				<div tabindex="-1" class="test-splitter" data-ibx-type="ibxVSplitter"></div>
				<div tabindex="0" class="test-content" data-ibx-type="ibxLabel" data-ibxp-align="center" data-ibxp-justify="center">CONTENT AREA</div>
			</div>
		</div>
	</body>
</html>