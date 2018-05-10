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
					targetNode.ibxWidget("remove");

					var xItem = targetNode.data("xItem");
					var xItems = xItem.children("children").children("item");
					xItems.each(function(idx, el)
					{
						el = $(el);
						if(el.is("[container=true]"))
						{
							var treeNode = makeTreeNode(el, "ibfs_item");
							targetNode.ibxWidget("add", treeNode);
						}
					});
					$.ibi.ibxWidget.noRefresh= false;
					targetNode.ibxWidget("refresh", true);
				}).on("ibx_nodeselect", function(e)
				{
					var fileList = $(".test-file-list");
					fileList.ibxWidget("remove");

					var targetNode = $(e.target);
					var xItem = targetNode.data("xItem");
					var xItems = xItem.children("children").children("item");
					xItems.each(function(idx, el)
					{
						el = $(el);
						var fileTile = makeFileTile(el);
						fileList.append(fileTile);
					});
				});
				
				$(".test-file-list").on("dblclick", function(e)
				{
					var targetItem = $(e.target).closest(".file-tile");
					if(targetItem.length)
					{
						var xItem = targetItem.data("xItem");
						if(targetItem.is(".folder"))
						{
							var tree = $(".test-tree");
							var itemPath = xItem.attr("fullPath");
							var rootNodes = tree.ibxWidget("children");
							var foundNode = $(searchTree(rootNodes, itemPath));
							if(foundNode.length)
								foundNode.ibxTreeNode("selected", true);
						}
						else
						{
							alert(sformat("Run the file: {1}", xItem.attr("fullPath")));
						}
					}
				});

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
				$(".btnHPStyle").on("ibx_change", function(e)
				{
					var checked = $(e.target).ibxWidget("checked");
					$("body").toggleClass("hp-style", checked);
				}).ibxWidget("checked", true);
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

			makeTreeNode = function(xItem, itemClass, expanded)
			{
				xItem = $(xItem);
				var sce = $(".btnSingleClickExpand").ibxWidget("checked");
				var container = xItem.attr("container");
				var glyph = container ? "" : "insert_drive_file";
				var glyphClasses = container ? "" : "material-icons";
				var node = $("<div>").ibxTreeNode({"expanded":expanded, "singleClickExpand":sce, "container":container, "text": xItem.attr("description"), "labelOptions":{"glyph": glyph, "glyphClasses":glyphClasses}});
				node.attr("data-ibfs-path", xItem.attr("fullPath")).data("xItem", xItem).addClass(container ? "folder" : "file").addClass(itemClass);
				return node;
			};
			makeFileTile = function(xItem, itemClass)
			{
				xItem = $(xItem);
				var container = xItem.attr("container");
				var glyph = container ? "folder" : "insert_drive_file";
				var tile = $("<div tabindex='-1' class='file-tile'>").ibxLabel({"text": xItem.attr("description"), textWrap:"wrap", textAlign:"center", iconPosition:"top", justify:"center", "glyph": glyph, "glyphClasses":"material-icons"});
				tile.data("xItem", xItem).addClass(container ? "folder" : "file").addClass(itemClass);
				return tile;
			};
			searchTree = function(treeNodes, path)
			{
				for(var i = 0; i < treeNodes.length; ++i)
				{
					var treeNode = $(treeNodes[i]);
					var nodePath = treeNode.data("ibfsPath");
					if(path == nodePath)
						return treeNode[0];
					else
					if(0 == path.search(nodePath))
					{
						treeNode.ibxTreeNode("toggleExpanded", true);
						var retNode = searchTree(treeNode.ibxWidget("children"), path);
						if(retNode)
							return retNode;
					}
				}
			};
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
			flex:0 0 auto;
			width:150px;
			min-width:50px;
			padding:5px;
			overflow:auto;
			border:1px solid #ccc;
			border-radius:5px;
			background-color:#fafafa;
		}
		.tree-folder
		{
		}
		.test-splitter
		{
			margin:0px 3px 0px 3px;
		}
		.test-file-list
		{
			flex:1 1 auto;
			border:1px solid #ccc;
			border-radius:5px;
			background-color:#fafafa;
			overflow:auto;
		}
		.file-tile
		{
			width:150px;
			height:150px;
			margin:5px;
			font-size:14px;
			border:1px solid #aaa;
			border-radius:5px;
			background-color:white;
			box-shadow:3px 3px 10px 0px #bbb;
		}
		.file-tile .ibx-label-glyph
		{
			font-size:18px;
		}
		.folder .ibx-label-glyph
		{
			color:gold;
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
		.hp-style .file-tile
		{
			font-family:roboto;
			font-size:14px;
			color:rgb(85, 85, 85);
		}
		.hp-style .file-tile.folder
		{
			font-weight:bold;
		}
		</style>
	</head>
	<body class="ibx-root">
		<div class="cmdTest" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="btn-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div tabindex="0" class="btnLoad" data-ibx-type="ibxButton">Load Tree</div>
				<div tabindex="0" class="btnHPStyle" data-ibx-type="ibxCheckBoxSimple">Home Page Style</div>
				<div tabindex="0" class="btnSingleClickExpand" data-ibx-type="ibxCheckBoxSimple">Single Click Expand</div>
				<div tabindex="0" class="btnExpandAll" data-ibx-type="ibxButton">Expand All</div>
				<div tabindex="0" class="btnCollapseAll" data-ibx-type="ibxButton">Collapse All</div>
				<div tabindex="0" class="btnDetails" data-ibx-type="ibxCheckBoxSimple">Details View</div>
			</div>
			<div class="content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div tabindex="0" class="test-tree" data-ibx-type="ibxTree"></div>
				<div class="test-splitter" data-ibx-type="ibxVSplitter"></div>
				<div tabindex="0" class="test-file-list" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true"></div>
			</div>
		</div>
	</body>
</html>