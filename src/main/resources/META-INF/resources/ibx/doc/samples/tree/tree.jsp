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
				$(".test-tree").on("dblclick ibx_nodeselect ibx_nodedeselect ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse", function(e)
				{
					//console.log("fnMain", e.type, e.target);
				})
				$("body").on("dblclick", function(e)
				{
					//console.log("body", e.type);
				});

				var date = new Date();
				var tree = $(".test-tree")
				var root = $("<div class='root-tree-node'>").ibxTreeNode({"expanded":true, "text":"Root Node", "labelOptions":{"glyph":"folder", "glyphClasses":"material-icons"}}).appendTo(tree);
				for(var i = 0; i < 5; ++i)
				{
					var parentNode = $("<div class='test-tree-node'>").ibxTreeNode({"text": sformat("Tree Node {1}", i), "labelOptions":{"glyph":"folder", "glyphClasses":"material-icons"}})
					root.ibxWidget("add", parentNode);
					for(var j = 0; j < 5; ++j)
					{
						var childNode = $("<div class='test-tree-node'>").ibxTreeNode({"text": sformat("Tree Node {1}-{2}", i, j), "labelOptions":{"glyph":"android", "glyphClasses":"material-icons"}})
						if(i == 0 && j == 1)
							childNode.addClass("xxx");
						parentNode.ibxWidget("add", childNode);
					}
				}
				console.log(new Date() - date);
				tree.ibxWidget("refresh");

				$(".cmdTest").on("ibx_triggered", function(e)
				{
					var node = $("<div class='zzz'>Julian</div>").ibxTreeNode();
					var parent = $(".xxx");
					parent.ibxWidget("add", node).ibxWidget("toggleExpanded", true);
					node.ibxWidget("refresh");
				});
			}, true);
		</script>

		<style type="text/css">
		.test-tree
		{
			height:300px;
			width:200px;
			overflow:auto;
			border:1px solid #ccc;
		}
		.root-node
		{
		}
		.ibx-tree-node
		{
		}
		.tnode-label
		{
			font-family:roboto;
			font-size:12px;
			line-height:16px;
			color: rgb(85, 85, 85);
			border-bottom:1px solid rgba(0, 0 , 0, 0.05);
		}
		.tnode-indent
		{
			padding-left:10px;
		}
		.tnode-label:hover, .tnode-label.ibx-nav-key-item-active
		{
			background-color:rgba(53, 184, 254, 0.1);
		}
		.tnode-label.tnode-selected
		{
			background-color:rgba(53, 184, 254, 0.4);
		}
		/*
		*/
		</style>
	</head>
	<body class="ibx-root">
		<div class="cmdTest" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div tabindex="0" class="test-tree" data-ibx-type="ibxTree">
		</div>
	</body>
</html>