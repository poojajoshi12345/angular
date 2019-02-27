$(".ibx-tree").css("overflow", "auto").ibxWidget("remove");

var tree = $(".ibx-tree.wfc-mdfp-dimension-tree");
for(var i = 0; i < 100; ++i)
{
	var item = $("<div>item</div>").ibxTreeNode();
	//tree.ibxWidget("add", item);
}

