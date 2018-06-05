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
				var tree = $(".test-tree");
				tree.on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					node = $(e.target).closest(".ibx-tree-node").children(".tnode-label");
					e = e.originalEvent;
					var dt = e.dataTransfer;
					if(e.type == "ibx_dragstart")
						dt.setData("ibxDragNode", $(e.target));
					else
					if(e.type == "ibx_dragover")
					{
						node.addClass("drag-target");
						dt.dropEffect = "copy";
						e.preventDefault();
					}
					else
					if(e.type == "ibx_dragleave")
						node.removeClass("drag-target");
					else
					if(e.type == "ibx_drop")
					{
						var dragNode = dt.getData("ibxDragNode");
						var dropTarget = $(e.target).closest(".ibx-tree-node");
						dropTarget.ibxWidget("add", dragNode);
					}
				});

				$.get("./retail_lite.xml").done(function(doc, status, xhr)
				{
					tree._xDoc = $(doc);
				}.bind(tree));

				$(".btnLoadFlat").on("click", function(e)
				{
					var date = new Date();
					var xRoot = tree._xDoc.children().first();
					var tRoot = makeTreeNode(xRoot, true).addClass("root");
					tree.ibxWidget("remove").ibxWidget("add", tRoot);
					xRoot.find("leaf").each(function(idx, el)
					{
						var tChild = makeTreeNode(el, true);
						tRoot.ibxWidget("add", tChild);
					});
					console.log(sformat("loaded in: {1}", (new Date() - date)));
				});

				$(".btnLoadHierarchical").on("click", function(e)
				{
					var date = new Date();
					var xRoot = tree._xDoc.children().first();
					var tRoot = makeTreeNode(xRoot).addClass("root");
					tree.ibxWidget("remove").ibxWidget("add", tRoot);
				});

				$(".btnExpandAll").on("click", function(e)
				{
					var tNodes = tree.find(".ibx-tree-node").ibxWidget("toggleExpanded", true);
				});

				function makeTreeNode(xNode, flat)
				{
					xNode = $(xNode);
					var type = xNode.prop("nodeName");
					var icon = xNode.attr("icon");
					var options =
					{
						draggable:true,
						container: (type == "Master_SegmentTree" || type == "branch"),
						labelOptions:
						{
							icon: icon ? sformat("{1}../../dhtml/images/{2}", ibx.getPath(), icon) : "",
							text: xNode.attr("label")
						}
					};
					var treeNode = $("<div>").ibxTreeNode(options).data("xNode", xNode).on("ibx_expand", function(e)
					{
						if(flat)
							return;
						var tNode = $(this);
						var xNode = tNode.data("xNode");

						tNode.ibxWidget("remove");
						$(xNode).children().each(function(idx, el)
						{
							var tChild = makeTreeNode(el);
							tNode.ibxWidget("add", tChild);
						});
						e.stopPropagation();
					});
					return treeNode;
				};
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				position:absolute;
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.test-tree
			{
				position:absolute;
				left:50px;
				top:50px;
				bottom:50px;
				width:300px;
				overflow:auto;
				border:2px solid #ccc;
			}
			.drag-target:hover
			{
				background-color:thistle;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="btnLoadFlat" data-ibx-type="ibxButton">Load Flat</div>
		<div class="btnLoadHierarchical" data-ibx-type="ibxButton">Load Hierarchical</div>
		<div class="btnExpandAll" data-ibx-type="ibxButton">Expand All Collapsed</div>
		<div class="test-tree" data-ibx-type="ibxTree"></div>
	</body>
</html>
