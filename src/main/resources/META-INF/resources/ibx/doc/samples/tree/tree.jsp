<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.70 $:
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
				$(".test-tree, .test-tree-browser").on("ibx_beforeexpand ibx_beforecollapse", function(e)
				{
					var eType = e.type;
					var browserTree = $(this).is(".ibx-tree-browser");
					var targetNode = $(e.target);
					targetNode.ibxWidget("remove");

					var xItem = targetNode.data("xItem");
					var xItems = xItem.children("children").children("item");
					xItems.each(function(idx, el)
					{
						el = $(el);
						if(browserTree || el.is("[container=true]"))
						{
							var treeNode = makeTreeNode(el, "ibfs_item", false, browserTree);
							targetNode.ibxWidget("add", treeNode);
						}
					});

					targetNode.ibxWidget("children").each(function(idx, el)
					{
						targetNode.ibxWidget("remove", el);
						targetNode.ibxWidget("add", el);
					});

				}).on("ibx_selchange", function(e)
				{
					e = e.originalEvent;
					var targetNode = e.data.selected ? e.data.items : null;
					if(!targetNode || !targetNode.length)
						return;

					var folderList = $(".folder-list");
					var fileList = $(".file-list");
					folderList.ibxWidget("remove");
					fileList.ibxWidget("remove");

					var xItem = targetNode.data("xItem");
					var xItems = xItem.children("children").children("item");
					xItems.each(function(idx, el)
					{
						el = $(el);
						var fileTile = makeFileTile(el);
						(el.attr("container") == "true") ? folderList.append(fileTile) : fileList.append(fileTile);
					});
				}).on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					if($(e.currentTarget).is(".ibx-tree-browser") && $(e.target).closest(".ibx-tree-node").ibxWidget("option", "container"))
					{
						e.preventDefault();
						return;
					}

					node = $(e.target).closest(".ibx-tree-node").children(".tnode-label");
					e = e.originalEvent;
					var dt = e.dataTransfer;
					if(e.type == "ibx_dragstart")
						dt.setData("ibxDragNode", $(e.target));
					else
					if(e.type == "ibx_dragover")
					{
						node.ibxAddClass("drag-target");
						dt.dropEffect = "copy";
						e.preventDefault();
					}
					else
					if(e.type == "ibx_dragleave")
						node.ibxRemoveClass("drag-target");
					else
					if(e.type == "ibx_drop")
					{
						var dragNode = dt.getData("ibxDragNode");
						var dropTarget = $(e.target).closest(".ibx-tree-node");
						dropTarget.ibxWidget("add", dragNode);
					}
				}).on("ibx_ctxmenu", function(e)
				{
					var treeNode = $(e.target).closest(".ibx-tree-node");
					var nodeInfo = treeNode.data("xItem");
					var isContainer = nodeInfo.attr("container") == "true";
					var menu = $(isContainer ? ".ctx-menu-container" : ".ctx-menu-item");
					e.menu = menu;
				}).on("click dblclick keydown", function(e)
				{
				});

				$(".test-files-box").on("dblclick keydown", function(e)
				{
					var eType = e.type;
					if(eType == "dblclick" || (e.type == "keydown" && (e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)))
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
									tree.ibxSelectionManager("selected", foundNode, true);
							}
							else
							{
								alert(sformat("Run the file: {1}", xItem.attr("fullPath")));
							}
						}
					}
				});

				$(".btn-load").on("click", function(e)
				{
					var src = $(".src-url").ibxWidget("value");
					$.get("./tree_sample_ibfs.xml").then(function(doc, status, xhr)
					{
						doc = $(doc);
						var xItem = doc.find("rootObject > item");
			
						var tree = $(".test-tree");
						tree.ibxWidget("remove");
						tree.data("xDoc", doc);
						var rootNode = makeTreeNode(xItem, "ibfs_root");
						tree.ibxWidget("add", rootNode);
						rootNode.ibxWidget("option", "expanded", true);
						tree.ibxSelectionManager("selected", rootNode, true);

						var treeMono = $(".test-tree-browser");
						treeMono.data("xDoc", doc);
						var rootNode = makeTreeNode(xItem, "ibfs_root", false, true).ibxWidget("option", "hasParent", false);
						treeMono.ibxWidget("add", rootNode);
					});
				}).dispatchEvent("click");
				$(".btn-wfstyle").on("ibx_change", function(e)
				{
					var checked = $(e.target).ibxWidget("checked");
					$("body").ibxToggleClass("wf-style", checked);
				}).ibxWidget("checked", false);
				$(".btn-single-click-expand").on("ibx_change", function(e)
				{
					var checked = $(e.target).ibxWidget("checked");
					$(".test-tree, .test-tree-browser").ibxWidget("option", "singleClickExpand", checked);
				});
				$(".btn-expand-all").on("click", function(e)
				{
					$(".test-tree .ibx-tree-node").ibxWidget("toggleExpanded", true);
				});
				$(".btn-collapse-allAll").on("click", function(e)
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

			makeTreeNode = function(xItem, itemClass, expanded, browserTree)
			{
				xItem = $(xItem);
				var sce = $(".btn-single-click-expand").ibxWidget("checked");
				var container = (xItem.attr("container") == "true");
				var options = 
				{
					"container":container,
					"draggable":true,
					"expanded":expanded,
					"labelOptions":{"text": xItem.attr("description") || xItem.attr("name"), "glyph": container ? "" : "insert_drive_file", "glyphClasses": container ? "" : "material-icons"}
				}
			
				if(browserTree)
				{
					options.labelOptions.glyph = container ? "folder" : options.labelOptions.glyph;
					options.labelOptions.glyphClasses = container ? "material-icons" : options.labelOptions.glyphClasses;
					var node = $("<div>").ibxTreeBrowserNode(options).ibxAddClass(container ? "folder" : "file").ibxAddClass(itemClass);
				}
				else
					var node = $("<div>").ibxTreeNode(options).ibxAddClass(container ? "folder" : "file").ibxAddClass(itemClass);

				node.attr("data-ibfs-path", xItem.attr("fullPath")).data("xItem", xItem);
				
				node.on("ibx_click ibx_dblclick ibx_keydown", function(e)
				{
					var node = $(this);
					if(node.ibxWidget("option", "container"))
					{
					}
				});
				return node;
			};
			makeFileTile = function(xItem, itemClass)
			{
				xItem = $(xItem);
				var container = xItem.attr("container");
				var options = 
				{
					"draggable":true,
					"text": xItem.attr("description") || xItem.attr("name"),
					"textWrap": container ? "nowrap" : "wrap",
					"textAlign": container ? "" : "center",
					"iconPosition": container ? "left" : "top",
					"justify": container ? "start" : "center",
					"glyph": container ? "folder" : "insert_drive_file",
					"glyphClasses":"material-icons"
				}
				var tile = $("<div tabindex='-1' class='file-tile'>").ibxLabel(options).ibxAddClass(container ? "folder" : "file").ibxAddClass(itemClass);
				tile.attr("data-ibfs-path", xItem.attr("fullPath")).data("xItem", xItem);
				tile.on("ibx_dragover", function(e)
				{
					e.preventDefault();
					var dt = e.originalEvent.dataTransfer;
					dt.dropEffect = "move";
				});
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
			border-top:1px solid #ccc;
			border-bottom:1px solid #ccc;
			margin:5px 0px 5px 0px;
		}
		.btn-bar > *
		{
			margin:5px;
		}
		.tree-type-label
		{
			font-weight:bold;
			font-size:1.25em;
			color:#ccc;
			margin-bottom:5px;
			margin-top:5px;
		}
		.content-box
		{
			flex:1 1 auto;

		}
		.trees-box
		{
			flex:0 0 auto;
			width:250px;
			min-width:50px;
		}
		.test-tree
		{
			flex:1 1 1px;
			height:25%;
			overflow:auto;
			border:1px solid #ccc;
			border-radius:5px;
			margin-bottom:3px;
		}
		.test-tree-browser
		{
			flex:1 1 1px;
			overflow:auto;
			border:1px solid #ccc;
			border-radius:5px;
			margin:3px 0px 5px 0px;
		}
		.test-splitter
		{
			width:7px;
			margin:0px 3px 0px 3px;
			border-radius:5px;
		}
		.test-files-box
		{
			flex:1 1 auto;
			overflow:auto;
			padding:10px;
			border:1px solid #aaa;
			border-radius:5px;
		}
		.test-files-box > .ibx-label
		{
			flex:0 0 auto;
			font-weight:bold;
			font-size:14px;
			margin-bottom:3px;
		}
		.folder-list
		{
			flex:0 0 auto;
			overflow:auto;
			padding-bottom:5px;
			margin-bottom:5px;
			border-bottom:2px solid #ccc;
		}
		.file-list
		{
			flex:1 1 auto;
			overflow:auto;
		}
		.file-tile
		{
			width:150px;
			height:100px;
			margin:5px;
			font-size:12px;
			border:1px solid #aaa;
			border-radius:5px;
			background-color:white;
			box-shadow:2px 2px 5px 0px #aaa;
		}
		.file-tile .ibx-label-glyph
		{
			font-size:24px;
		}
		.file-tile.folder
		{
			width:auto;
			height:auto;
			padding:2px 10px 2px 10px;
		}
		.folder .ibx-label-glyph
		{
		}

		.tnode-selection-anchor > .tnode-label
		{
			font-weight:bold;
		}
		
		.ibx-drag-source
		{
			outline:2px solid pink;
		}
		.ibx-drop-target:hover
		{
			outline:2px solid red;
		}
		.ibx-drag-image
		{
		}

		/*IBI WF Tree Styles*/
		.wf-style
		{
			font-family:roboto;
			font-size:12px;
		}
		.wf-style .crumb-box
		{
			color: rgb(102, 102, 102);
			font-size:14px;
		}
		.wf-style .crumb
		{
		}
		.crumb-marker:after
		{
			font-size:24px;
			font-weight:bold;
		}
		.wf-style .tnode-label
		{
			line-height:16px;
			color: rgb(85, 85, 85);
			padding:8px;
			border-bottom:1px solid rgba(0, 0 , 0, 0.05);
		}
		.wf-style .tnode-indent
		{
			padding-left:10px;
		}
		.wf-style .tnode-label:hover, .wf-style .tnode-label.ibx-nav-key-item-active
		{
			background-color:rgba(53, 184, 254, 0.1);
		}
		.wf-style .ibx-sm-selected.tnode-label
		{
			background-color:rgba(53, 184, 254, 0.4);
		}
		.wf-style .test-files-box
		{
			background-color:rgb(230, 248, 255);
		}
		.wf-style .files-box-label
		{
			color:gray;
		}
		.wf-style .file-tile
		{
			color:rgb(85, 85, 85);
			margin:8px;
		}
		.wf-style .file-tile.folder
		{
			font-weight:bold;
			color:gray;
		}
		.wf-style .file-tile.folder .ibx-label-glyph
		{
			color:gold;
		}

		.wf-style .ibx-tree-flat .ibx-label-icon
		{
			font-size:2em;
			color:silver;
		}
		.wf-style .ibx-tree-node-flat .tnode-btn
		{
			font-size:1.5em;
		}

		</style>
	</head>
	<body class="ibx-root">
		<div class="ctx-menu-item" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem">Item Context Item</div>
		</div>
		<div class="ctx-menu-container" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem">Container Context Item</div>
		</div>
		<div class="cmdTest" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div data-ibx-type="ibxLabel" data-ibxp-justify="center" style="flex:0 0 auto;color:#ccc;font-size:24px;font-weight:bold">Data is a Sample IBFS Repository</div>
			<div class="btn-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div tabindex="0" class="btn-load" data-ibx-type="ibxButton">Load Tree</div>
				<div tabindex="0" class="btn-wfstyle" data-ibx-type="ibxCheckBoxSimple">WebFOCUS Style (sorta)</div>
				<div tabindex="0" class="btn-single-click-expand" data-ibx-type="ibxCheckBoxSimple">Single Click Expand</div>
				<div tabindex="0" class="btn-expand-all" data-ibx-type="ibxButton">Expand All</div>
				<div tabindex="0" class="btn-collapse-allAll" data-ibx-type="ibxButton">Collapse All</div>
			</div>
			<div class="content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="trees-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div tabindex="0" class="test-select" data-ibx-type="ibxSelect" data-ibxp-multi-select="true" data-ibxp-user-value="item1">
						<div data-ibx-type="ibxSelectItem" data-ibxp-selected="true">Item</div>
						<div data-ibx-type="ibxSelectItem">Item</div>
						<div data-ibx-type="ibxSelectItem">Item</div>
						<div data-ibx-type="ibxSelectItem">Item</div>
						<div data-ibx-type="ibxSelectItem">Item</div>
						<div data-ibx-type="ibxSelectItem">Item</div>
					</div>
					<div tabindex="0" class="tree test-tree" data-ibx-type="ibxTree" data-ibxp-show-root-nodes="true"></div>
					<div data-ibx-type="ibxHSplitter"></div>
					<div tabindex="0" class="tree test-tree-browser" data-ibx-type="ibxTreeBrowser"></div>
				</div>
				<div class="test-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="test-files-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div class="files-box-label" data-ibxp-for=".folder-list" data-ibx-type="ibxLabel">Folders</div>
					<div tabindex="0" class="folder-list" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true" data-ibxp-nav-key-reset-focus-on-blur="false"></div>
					<div class="files-box-label" data-ibxp-for=".file-list" data-ibx-type="ibxLabel">Items</div>
					<div tabindex="0" class="file-list" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-nav-key-dir="horizontal" data-ibxp-focus-default="true" data-ibxp-nav-key-reset-focus-on-blur="false"></div>
				</div>
			</div>
		</div>
	</body>
</html>