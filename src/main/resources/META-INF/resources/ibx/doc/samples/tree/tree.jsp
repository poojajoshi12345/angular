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
				//var tree = $(".test-tree");
				//var treeNode = $("<div>").ibxTreeRootNode({"text":"root node"});
				//tree.ibxWidget("add", treeNode);
			}, true);
		</script>

		<style type="text/css">
		.test-tree
		{
			height:300px;
			width:200px;
			overflow:auto;
			border:1px solid #ccc;
			padding:5px;
		}
		</style>
	</head>
	<body class="ibx-root">
		<div tabindex="0" class="test-tree" data-ibx-type="ibxTree">
			<div data-ibx-type="ibxTreeRootNode" data-ibxp-expanded="true">Root Node
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