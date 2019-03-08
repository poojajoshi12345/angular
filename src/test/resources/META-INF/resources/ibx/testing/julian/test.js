
//$(".ibxtool-toolbar, .ides-pane-container, .ides-tool-canvas-cp-box, .top-splitter, .measure-tree-box").remove()
var tree = $(".wfc-mdfp-dimension-tree").css({"overflow":"auto", "fontSize":"1em"}).ibxWidget("remove").ibxWidget("destroy");
var items = [];
for(var i = 0; i < 50; ++i)
{
	var item = $("<div>item</div>").ibxTreeNode();
	items.push(item[0]);
}
tree.ibxWidget("add", items);