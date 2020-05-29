/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.14 $:

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
			defaultCellWidth: 4,
			defaultCellHeight: 4,
			animate: true,
		},
	_widgetClass: "ibx-grid-stack",
	_create: function ()
	{
		this.element.gridstack(this.options);
		this.element.ibxAddClass("grid-stack");
		this.element.css('min-height', this._getMinHeight());
		this._super();
		// Stop bubbling of jquery ui events "resize", "drag", "drop"
		this.element.on('resize', function (event) { event.stopPropagation(); });
		this.element.on('drag', function (event) { event.stopPropagation(); });
		this.element.on('drop', function (event) { event.stopPropagation(); });
		this.element.on('resizestart', function (event, ui)
		{
			$("iframe").css("pointer-events", "none");
		});
		this.element.on('resizestop', function (event, elem)
		{
			$("iframe").css("pointer-events", "");
		});
	},
	addCell: function (cell, x, y, width, height)
	{
		if (this.element.children('.grid-stack-item').length == 0)
			this.element.css('min-height', "");
		width = width || this.options.defaultCellWidth;
		height = height || this.options.defaultCellHeight;
		var grid = this.element.data('gridstack');
		var outercell = $("<div class='grid-stack-item'>");
		var innercell = $("<div class='grid-stack-item-content'>");
		outercell.append(innercell);
		innercell.append(cell);
		grid.addWidget(outercell, x, y, width, height, false);
	},
	removeCell: function (cell, detachNode)
	{
		var el = $(cell).closest('.grid-stack-item');
		if (el)
		{
			el.fadeOut(200, function ()
			{
				var grid = this.element.data('gridstack');
				grid.removeWidget(el, detachNode);
				if (this.element.children('.grid-stack-item').length == 0)
					this.element.css('min-height', this._getMinHeight());
			}.bind(this));
		}
	},
	_getMinHeight: function ()
	{
		return this.options.minHeight + "px";
	},
	_destroy: function ()
	{
		this._super();
	},
	_refresh: function ()
	{
		this._super();
	}
});


//# sourceURL=gridstack.ibx.js
