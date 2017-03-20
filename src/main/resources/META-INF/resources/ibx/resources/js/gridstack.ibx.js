/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//////////////////////////////////////////////////////////////////////////
function IbxGridStack()
{
	if (_biInPrototype) return;
	IbxWidget.call(this);
	this._widgetCtor = $.ibi.ibxGridStack;
}
var _p = _biExtend(IbxGridStack, IbxWidget, "IbxGridStack");
IbxGridStack.base = IbxWidget.prototype;
IbxWidget.addWidgetProperty(IbxGridStack, "width");
IbxWidget.addWidgetProperty(IbxGridStack, "height");
IbxWidget.addWidgetProperty(IbxGridStack, "cellHeight");
IbxWidget.addWidgetProperty(IbxGridStack, "verticalMargin");
IbxWidget.addWidgetProperty(IbxGridStack, "auto");
IbxWidget.addWidgetProperty(IbxGridStack, "minWidth");
IbxWidget.addWidgetProperty(IbxGridStack, "float");
IbxWidget.addWidgetProperty(IbxGridStack, "staticGrid");
IbxWidget.addWidgetProperty(IbxGridStack, "animate");
IbxWidget.addWidgetProperty(IbxGridStack, "alwaysShowResizeHandle");
IbxWidget.addWidgetProperty(IbxGridStack, "resizable");
IbxWidget.addWidgetProperty(IbxGridStack, "draggable");
IbxWidget.addWidgetProperty(IbxGridStack, "disableDrag");
IbxWidget.addWidgetProperty(IbxGridStack, "disableResize");
IbxWidget.addWidgetProperty(IbxGridStack, "rtl");
IbxWidget.addWidgetProperty(IbxGridStack, "removable");
IbxWidget.addWidgetProperty(IbxGridStack, "removeTimeout");
IbxWidget.addWidgetProperty(IbxGridStack, "verticalMarginUnit");
IbxWidget.addWidgetProperty(IbxGridStack, "cellHeightUnit");
IbxWidget.addWidgetProperty(IbxGridStack, "minHeight");


$.widget("ibi.ibxGridStack", $.ibi.ibxWidget,
{
	options:
		{
			minHeight: 300,
			width: 12,
			float: false,
			acceptWidgets: '.grid-stack-item',
			resizable: {
				handles: 'se, s, sw'
			},
		},
	_widgetClass: "ibx-grid-stack",
	_create: function ()
	{
		this.element.gridstack(this.options);
		this.element.addClass("grid-stack");
		this.element.css('min-height', this.options.minHeight + "px");
		this._super();

	},
	addCell: function (cell, x, y, width, height, autoPosition, minWidth, maxWidth)
	{
		this.element.css('min-height', "initial");
		var grid = this.element.data('gridstack');
		var outercell = $("<div class='grid-stack-item'>");
		var innercell = $("<div class='grid-stack-item-content' style='overflow:hidden;'>");
		outercell.append(innercell);
		innercell.append(cell);
		grid.addWidget(outercell, x, y, width, height, autoPosition, minWidth, maxWidth);
	},
	removeCell: function (cell, detachNode)
	{
		var el = $(cell).parents('.grid-stack-item');
		if (el)
		{
			el.fadeOut(200, function ()
			{
				var grid = this.element.data('gridstack');
				grid.removeWidget(el, detachNode);
				if (this.element.children().length == 0)
					this.element.css('min-height', this.options.minHeight + "px");
			}.bind(this));
		}
	},
	_destroy: function ()
	{
		this._super();
	},
	refresh: function ()
	{
		this._super();
	}
});


//# sourceURL=gridstack.ibx.js
