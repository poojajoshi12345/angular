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
				$(".test-tree").on("ibx_nodeactivate ibx_nodeactivate ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse", function(e)
				{
					console.log("tree", e.type, e.target);
				})
			}, true);


		</script>

		<style type="text/css">
		.test-tree
		{
			height:200px;
			width:200px;
			overflow:auto;
			border:1px solid #ccc;
			padding:5px;
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
			padding:8px;
		}
		.tnode-label:hover
		{
			background-color:rgba(53, 184, 254, 0.1);
		}

		.ibx-nav-key-item-active > .tnode-label
		{
			background-color:rgba(53, 184, 254, 0.4);
		}

		</style>
	</head>
	<body class="ibx-root">
		<div tabindex="0" class="test-tree" data-ibx-type="ibxTree">
			<div class="root-node" data-ibx-type="ibxTreeRootNode" data-ibxp-expanded="true">Root Node
				<div data-ibx-type="ibxTreeNode">Tree Item
					<div data-ibx-type="ibxTreeNode">Tree Item</div>
				</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
				<div data-ibx-type="ibxTreeNode">Tree Item</div>
			</div>
		</div>
	</body>
</html>