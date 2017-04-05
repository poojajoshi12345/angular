/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//////////////////////////////////////////////////////////////////////////
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
