/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	CSS GRID
******************************************************************************/
$.widget("ibi.ibxGrid", $.ibi.ibxWidget,
{
	options:
	{
		"inline":false,

		"cols":"",
		"autoCols":"",
		"colGap":"",

		"rows":"",
		"autoRows":"",
		"rowGap":"",

		"areas":"",
		"autoFlow":"",

		"justify":"",
		"justifyContent":"",
		
		"align":"",
		"alignContent":"",
	},
	_widgetClass: "ibx-grid",
	_create: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	_refresh: function ()
	{
		this._super();
		var options = this.options;

		var gridCss = 
		{
			//IE...do before so standard CSS can override in compliant browsers
			"-ms-grid-columns":			options.cols,
			"-ms-grid-rows":			options.rows,

			//Standard CSS
			"grid-template-columns":	options.cols,
			"grid-auto-columns":		options.autoCols,
			"grid-template-rows":		options.rows,
			"grid-auto-rows":			options.autoRows,
			"grid-template-areas":		options.areas,				//each line must be quoted, ex: " 'a1 a1 a1''a2 . a2''a3 . a3' "
			"grid-auto-flow":			options.autoFlow,
			"grid-column-gap":			options.colGap,
			"grid-row-gap":				options.rowGap,
			"justify-content":			options.justifyContent,		//stretch - default
			"justify-items":			options.justify,			//stretch - default
			"align-content":			options.alignContent,		//stretch - default
			"align-items":				options.align,				//stretch - default
		};
		this.element.css(gridCss);
		options.inline ? this.element.ibxAddClass("gd-inline") : this.element.ibxRemoveClass("gd-inline");

		this.element.children().each(function(options, idx, cell)
		{
			cell = $(cell);
			var cellData = cell.data();
			var colInfo = cellData.ibxCol ? cellData.ibxCol.toString().split("/") : [];
			var colStart = colInfo[0] || "";
			var colEnd = colInfo[1] || "";
			var rowInfo = cellData.ibxRow ? cellData.ibxRow.toString().split("/") : [];
			var rowStart = rowInfo[0] || "";
			var rowEnd = rowInfo[1] || "";
			var css = 
			{
				//IE Columns...do before so standard CSS can override in compliant browsers
				"-ms-grid-column":			colStart,
				"-ms-grid-column-span":		colEnd.replace(/\s*span\s*/, ""),
				"-ms-grid-column-align":	cell.data("ibxJustify") || options.justify,

				//IE Rows...do before so standard CSS can override in compliant browsers
				"-ms-grid-row":				rowStart,
				"-ms-grid-row-span":		rowEnd.replace(/\s*span\s*/, ""),
				"-ms-grid-row-align":		cell.data("ibxAlign") || options.align,

				//Standard CSS Columns
				"grid-column-start":		colStart,
				"grid-column-end":			colEnd,
				"justify-self":				cell.data("ibxJustify"),

				//Standard CSS Rows
				"grid-row-start":			rowStart,
				"grid-row-end":				rowEnd,
				"align-self":				cell.data("ibxAlign"),

				//Standard CSS not supported by IE
				"grid-area":				cell.data("ibxArea"),
			};
			cell.css(css).ibxAddClass("ibx-grid-cell");
		}.bind(this, options));		
	}
});

/****
	These extensions are what stops jQuery from adding 'px' to these properties when setting $(xxx).css(yyy, zzz).
	jQuery is also smart enough to check if these properties are vendor prefixed when setting them (-ms, -moz, -webkit)
****/
$.extend($.cssNumber, 
{
	gridColumn:true,
	gridColumnStart:true,
	gridColumnEnd:true,
	gridColumnSpan:true,
	gridRow:true,
	gridRowStart:true,
	gridRowEnd:true,
	gridRowSpan:true,
});

/******************************************************************************
	DATA GRID
******************************************************************************/
$.widget("ibi.ibxDataGridSelectionManager", $.ibi.ibxSelectionManager,
{
	"options":
	{
		"grid":null,
		"type":"multi",
		"focusDefault":true,
		"focusResetOnBlur":false,
		"navKeyRoot":true,
		"toggleSelection":true,
		"escClearSelection":true,
		"selectableChildren":"dgrid-selectable", //can be elements/classes/etc.
	},
	_widgetClass:"ibx-data-grid-selection-model",
	_onKeyDown:function(e)
	{
		var options = this.options;
		var cell = this.focus();
		if(cell && options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var row = cell.parent();
			var idxRow = row.parent().children().index(row[0]);
			var idxCol = row.children().index(cell[0]);
			if(e.keyCode == $.ui.keyCode.LEFT)
				cell = options.grid.getCell(idxRow, idxCol-1);
			else
			if(e.keyCode == $.ui.keyCode.RIGHT)
				cell = options.grid.getCell(idxRow, idxCol+1);
			else
			if(e.keyCode == $.ui.keyCode.UP)
				cell = options.grid.getCell(idxRow-1, idxCol);
			else
			if(e.keyCode == $.ui.keyCode.DOWN)
				cell = options.grid.getCell(idxRow+1, idxCol);

			cell ? this.focus(cell, true) : this._super(e);
			e.preventDefault();
		}
		else
			this._super(e);
	},
});

$.ibi.ibxDataGridRow = function()
{
	return this.each(function(args, idx, el)
	{
		el = $(el);
		var fn = args[0];
		var data = el.data("ibxDataGridRow");
		if(!data)
		{
			el.ibxAddClass(["dgrid-row", "ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-stretch", "fbx-align-content-center"]).attr("role", "row");
			var header = $("<div>").attr({"tabindex": -1, "role":"rowheader"}).ibxAddClass(["dgrid-row", "dgrid-header-row", "ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-center", "fbx-justify-content-center"]);
			data =
			{
				"rInfo":null,
				"el":this,
				"header":header,
				"splitter":null,
				"children":[],
			}
			el.data("ibxDataGridRow", data);
		}
		if(fn instanceof Object)
		{
			data.rInfo = fn;
			data.header.text(data.rInfo.title);
		}
		return this;
	}.bind(this, arguments));
};
$.fn.ibxDataGridRow = $.ibi.ibxDataGridRow;

$.widget("ibi.ibxDataGrid", $.ibi.ibxGrid,
{
	options:
	{
		colMap:[],
		defaultColConfig: {title:"Column", size:"100px", flex:false, justify:"center", resizable:true, selectable:true, visible:true},
		defaultRowConfig: {},//not currently used.

		showColumnHeaders:true,
		showRowHeaders:true,
		
		/*frame stuff*/
		cols:"auto 1fr",
		rows:"auto 1fr",
		classes:
		{
			colHeaderBarClass:"dgrid-header-col-bar",
			colHeaderClass:"dgrid-header-col",
			colHeaderSplitterClass:"dgrid-header-col-splitter",
			rowHeaderBarClass:"dgrid-header-row-bar",
			rowHeaderClass:"dgrid-header-row",
			rowHeaderSplitterClass:"dgrid-header-row-splitter",
			gridClass:"dgrid-grid",
			gridRow:"dgrid-row",
			gridCell:"dgrid-cell",
		},

		/*accessibility stuff*/
		aria:
		{
			role:"grid"
		}
	},
	_widgetClass:"ibx-data-grid",
	_create:function()
	{
		var options = this.options;
		var classes = options.classes;
		var corner = this._corner = $("<div>").ibxAddClass("dgrid-corner").data({ibxCol:1, ibxRow:1});
		var colHeaderBar = this._colHeaderBar = $("<div tabindex='0'>").ibxHBox().ibxAddClass(classes.colHeaderBarClass).data({ibxCol:"2", ibxRow:"1"});
		var rowHeaderBar = this._rowHeaderBar = $("<div tabindex='0'>").ibxVBox({align:"stretch"}).ibxAddClass(classes.rowHeaderBarClass).data({ibxCol:"1", ibxRow:"2"});
		var grid = this._grid = $("<div tabindex='0'>").ibxVBox({align:"stretch"}).ibxAddClass(classes.gridClass).data({ibxCol:"2", ibxRow:"2"});
		grid.on("scroll", this._onGridScroll.bind(this)).ibxDataGridSelectionManager({grid:this});

		colHeaderBar.ibxWidget({navKeyRoot:true});
		rowHeaderBar.ibxWidget({navKeyRoot:true});

		this.add([corner[0], colHeaderBar[0], rowHeaderBar[0], grid[0]]);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		return aria;
	},
	updateHeaders:function(which)
	{
		which = which || "both";

		var options = this.options;
		var classes = options.classes;

		if(which == "column" || which == "both")
		{
			this._colHeaderBar.ibxWidget("remove");

			var colMap = options.colMap;
			for(var i = 0; i < colMap.length; ++i)
			{
				var cInfo = colMap[i];
				var size = sformat("width:{1};flex:{2} 0 auto;", cInfo.size, cInfo.flex ? 1 : 0);

				//make header
				var cHeading = $(sformat("<div tabindex='-1' class='{1}'>", classes.colHeaderClass))
				cHeading.ibxButtonSimple({justify:cInfo.justify || "start"}).attr("role", "columnheader");

				//make splitter
				var splitter = $(sformat("<div class='{1}'>", classes.colHeaderSplitterClass));
				splitter.ibxSplitter({locked:!cInfo.resizable || (i == colMap.length-1), resize:"first"}).on("ibx_resize ibx_reset", this._onSplitterResize.bind(this));

				//let people change the header before adding it to the bar...reasign because if they did we want to use that...if they didn't then nothing will have changed.
				var event = this.element.dispatchEvent("ibx_gridheaderupdate", {"grid":this.element, "type":"column", "info":cInfo, "idx": i, "header":cHeading[0], "splitter":splitter[0]});
				if(!event.isDefaultPrevented())
					cHeading.ibxWidget("option", "text", cInfo.title);
				
				//now add the column header and set the size as everything is in the dom.
				cInfo.ui = {"idx":i, "header":cHeading, "splitter":splitter, "curSize":null};
				cHeading.data("ibxDataGridInfo", cInfo);
				this._colHeaderBar.ibxWidget("add", [cHeading[0], splitter[0]]);
				this.setColumnWidth(i, cInfo.size);
			}

			var padding = $("<div style='flex:0 0 auto;'>").css({"width":"100px", height:"1px"});
			this._colHeaderBar.append(padding);
		}

		if(which == "row" || which == "both")
		{
			var rHeaders = this._rowHeaderBar.children(sformat(".{1}", options.classes.rowHeaderClass))
			for(var i = 0; i < rHeaders.length; ++i)
			{
				var rHeader = rHeaders[i];
				//let people change the header
				var event = this.element.dispatchEvent("ibx_gridheaderupdate", {"grid":this.element, "type":"row", "idx": i, "header":rHeader[0], "splitter":null});
				if(!event.isDefaultPrevented())
					rHeader.innerText = i;
			}
		}
	},
	getHeaders:function(row)
	{
		var headerBar = row ? this._rowHeaderBar : this._colHeaderBar;
		var headerClass = row ? this.options.classes.rowHeaderClass : this.options.classes.colHeaderClass;
		return headerBar.children("." + headerClass);
	},
	getCell:function(idxRow, idxCol)
	{
		var ret = null;
		var row = this.getRow(idxRow);
		return row.children(sformat(":nth-child({1})", idxCol + 1)) || null;
	},
	getColumnCount:function()
	{
		return this.options.colMap.length;
	},
	getColumnWidth:function(idxCol)
	{
		var cInfo = this.options.colMap[idxCol];
		return (cInfo && cInfo.ui && cInfo.ui.header) ? cInfo.ui.header.outerWidth() + cInfo.ui.splitter.outerWidth() : cInfo.size;
	},
	setColumnWidth:function(idxCol, width)
	{
		var cInfo = this.options.colMap[idxCol];
		if(cInfo && cInfo.ui)
		{
			//this looks weird because the 'width' parm can be a string like "100px", and that has to be set, then we need the 
			//actual width...AND THEN...we need to subtract out the splitter width...oy vey!
			cInfo.ui.curSize = width;
			cInfo.ui.header.outerWidth(width);
			cInfo.ui.header.outerWidth(cInfo.ui.header.outerWidth() - cInfo.ui.splitter.outerWidth());

			var cells = this.getColumn(idxCol);
			cInfo.flex ? cells.css({flex:"1 0 auto", width:width}) : cells.outerWidth(width);
		}
	},
	getColumn:function(col)
	{
		var filter = isNaN(col) ? col : sformat(".{1} > :nth-child({2})", this.options.classes.gridRow, col + 1);
		return this._grid.find(filter);
	},
	showColumn:function(idxCol, show)
	{
		var cells = this.getColumn(idxCol);
		var cInfo = this.options.colMap[idxCol];
		if(cInfo && cInfo.ui)
			cells = cells.add(cInfo.ui.header).add(cInfo.ui.splitter);
		cells.ibxToggleClass("dgrid-col-hidden", !show);
	},
	selectColumn:function(idxCol, select, addSelection)
	{
		var cells = this.getColumn(idxCol);
		if(!addSelection)
			this._grid.ibxDataGridSelectionManager("deselectAll", true);
		this._grid.ibxDataGridSelectionManager("selected", cells.toArray(), select);
	},
	getRowCount:function()
	{
		return this._grid.children("." + this.options.classes.gridRow).length;
	},
	getRow:function(row)
	{
		var filter = isNaN(row) ? row : sformat(".{1}:nth-child({2})", this.options.classes.gridRow, row + 1);
		return this._grid.children(filter);
	},
	showRow:function(row, show)
	{
		var row = this.getRow(row);
		row.each(function(idx, row)
		{
			row = $(row);
			rInfo = row.data("ibxDataGridInfo");
			row.ibxToggleClass("dgrid-row-hidden", !show);
			rInfo.ui.header.ibxToggleClass("dgrid-row-hidden", !show);
		}.bind(this));
	},
	selectRow:function(row, select, addSelection)
	{
		var cells = this.getRow(row).children();
		if(!addSelection)
			this._grid.ibxDataGridSelectionManager("deselectAll", true);
		this._grid.ibxDataGridSelectionManager("selected", cells.toArray(), select);
	},
	addRow:function(row, sibling, before)
	{
		var options = this.options;
		var selOptions = this._grid.ibxDataGridSelectionManager("option");
		var rowData = row.data("ibxDataGridRow");
		this._rowHeaderBar.ibxWidget("add", rowData.header);

		// padding has to be always added to the end of the bar.
		var padding = this._rowHeaderPadding = this._rowHeaderPadding || $("<div>").css({"flex":"flex:0 0 auto", "width":"1px", height:"100px"});
		this._rowHeaderBar.append(padding);

		//create extra cells if row has less than columns.
		while(row[0].children.length < options.colMap.length)
			row.append($("<div>"));

		//Happens a lot: DON'T USE JQUERY (VERY SLOW).
		var cells = row.children();
		for(var i = 0; i < cells.length; ++i)
		{
			var cell = cells[i];
			var cInfo = options.colMap[i];
			if(cInfo)
			{
				cell.style.width = isNaN(cInfo.ui.curSize) ? cInfo.ui.curSize : cInfo.ui.curSize + "px";//if size is just a number assume pixels.
				cell.setAttribute("tabindex", -1);
				cell.classList.toggle(selOptions.selectableChildren, cInfo.selectable);
				cell.classList.add(options.classes.gridCell);
			}
			else
				cell.ibxAddClass("dgrid-col-hidden");
		}
		this._grid.ibxWidget("add", row, sibling, before);
	},
	addRows:function(rows, sibling, before)
	{
		var ret = [];
		for(var i = 0; i < rows.length; ++i)
			ret.push(this.addRow(rows[i], sibling, before, false));
	},
	removeRow:function(row)
	{
		var row = this.getRow(row);
		row.each(function(idx, row)
		{
			$(row).detach().data("ibxDataGridRow").header.remove();
		}.bind(this));
	},
	removeAll:function()
	{
		this.removeRow("*");
	},
	_onSplitterResize:function(e, resizeInfo)
	{
		var sWidth = $(e.target).outerWidth();
		var el1Width = resizeInfo.el1.outerWidth();
		var cInfo = resizeInfo.el1.data("ibxDataGridInfo");
		this.setColumnWidth(cInfo.ui.idx, sWidth + el1Width);
	},
	_onGridScroll:function(e)
	{
		var scrollX = this._grid.prop("scrollLeft");
		var scrollY = this._grid.prop("scrollTop");
		this._colHeaderBar.prop("scrollLeft", scrollX);
		this._rowHeaderBar.prop("scrollTop", scrollY);
	},
	updateColMap:function(cols, refresh)
	{
		var colMap = this.options.colMap;
		for(var key in cols)
		{
			var colInfo = colMap[key];
			if(colInfo)
				$.extend(colInfo, cols[key]);
		}

		if(refresh !== false)
			this.refresh();
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "colMap" && value)
		{
			//make sure passed configs have all missing values with defaults, and update cell widths.
			var colMap = options.colMap = [];
			$.each(value, function(idx, colConfig)
			{
				colMap.push($.extend({}, options.defaultColConfig, colConfig));
			}.bind(this));
			this.updateHeaders("column");
			return;
		}
		else
		if(key == "defaultColConfig")
			value = $.extend({}, options.defaultColConfig, value);
		this._super(key, value);
	},
	_refresh:function()
	{
		var options = this.options;
		this._colHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showColumnHeaders);
		this._rowHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showRowHeaders);
		this._super();
	}
});


/******************************************************************************
	FLEX GRID
******************************************************************************/
$.widget("ibi.ibxFlexGrid", $.ibi.ibxHBox, 
{
	options:
	{
		"columnCount":12,
		"wrap":true,
		"childSizing":"border"
	},
	_widgetClass:"ibx-flex-grid",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this.remove(".ibx-flex-grid-cell");
		this._super();
	},
	remove:function(el, destroy, refresh)
	{
		this.children().removeAttr("data-grid-row data-grid-col data-grid-span").ibxRemoveClass("ibx-flex-grid-cell");
		this._super(el, destroy, refresh);
	},
	_colSize:-1,
	colSize:function()
	{
		return this._colSize;
	},
	row:function(row)
	{
		return this.children(sformat("[data-grid-row='{1}']", row));
	},
	column:function(col)
	{
		return this.children(sformat("[data-grid-col='{1}']", col));
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var colSize = this._colSize = (100/options.columnCount);
		var curRow = 0;
		var spanCount = 0;
		this.element.children().each(function(idx, cell)
		{
			cell = $(cell);
			if(spanCount >= options.columnCount)
			{
				curRow++;
				spanCount = 0;
			}
			colSpan = cell.data("ibxColSpan") || 1;
			var cellClasses = sformat("ibx-flex-grid-cell ibx-flex-grid-span-{1}", colSpan);
			var width = (colSpan * colSize);
			cell.ibxAddClass(cellClasses).css("width", sformat("{1}%", width))
			cell.attr({"data-grid-row": curRow, "data-grid-col": spanCount, "data-grid-span": colSpan});
			spanCount += colSpan;
		}.bind(this));
	}
});
$.ibi.ibxFlexGrid.statics = 
{
};
//# sourceURL=grid.ibx.js
