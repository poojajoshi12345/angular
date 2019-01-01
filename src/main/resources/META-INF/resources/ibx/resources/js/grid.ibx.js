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
		"cacheSelectableChildren":true,
	},
	_widgetClass:"ibx-data-grid-selection-model",
	_onKeyDown:function(e)
	{
		var options = this.options;
		if(options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var selector = sformat(".{1}:visible()", options.selectableChildren);
			var cell = $(e.target).closest(selector);
			var row = cell.parent();
			if(e.keyCode == $.ui.keyCode.LEFT)
				cell = cell.prevAll(selector).first();
			else
			if(e.keyCode == $.ui.keyCode.RIGHT)
				cell = cell.nextAll(selector).first();
			else
			if(e.keyCode == $.ui.keyCode.UP)
			{
				var cellIdx = row.children(selector).index(cell[0]);
				row = cell.parent().prevAll(".dgrid-row:visible()").first();
				cell = row.children(sformat(":nth-child({1})", cellIdx+1));
			}
			else
			if(e.keyCode == $.ui.keyCode.DOWN)
			{
				var cellIdx = row.children(selector).index(cell[0]);
				row = cell.parent().nextAll(".dgrid-row:visible()").first();
				cell = row.children(sformat(":nth-child({1})", cellIdx+1));
			}

			cell.focus();
			//cell.length ? this.focus(cell, true) : this._super(e);
			e.preventDefault();
		}
		else
			this._super(e);
	},
});

//Super light weight jQuery widget wrapper around ibxDataGrid rows.
$.fn.ibxDataGridRow = $.ibi.ibxDataGridRow = function()
{
	var ret = this;
	this.each(function ibxDataGridRow_widget(args, idx, el)
	{
		el = $(el);
		var widget = el.data("ibxDataGridRow");
		if(!widget)
		{
			widget =
			{
				element:el,
				parent:null,
				container:false,
				size:null,
				header:$("<div>").attr({"tabindex": -1}),
				dynamicHeaderSize:false,//calculate row header size on refresh...VERY SLOW, USE WITH CAUTION!
				splitter:null,
				title:null,
				size:null,
				rowClasses:["ibx-data-grid-row", "dgrid-row", "ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-stretch", "fbx-align-content-stretch"],
				headerClasses:["dgrid-header-row", "dgrid-row", "ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-center", "fbx-justify-content-center"],
				cellContainerClasses:["dgrid-cell-expandable", "ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-center"],
				expanded:-1,
				singleClickExpand:false,
				
				depth:function()
				{
					var depth = 0;
					var parent = this.element;
					while(parent = $(parent).data("ibxDataGridRow").parent)
						depth++;
					return depth;
				},
				setParent:function(parent)
				{
					$(this.parent).off("ibx_expand ibx_collapse ibx_get_row_children", this._boundParentEvent);
					this.parent = parent;
					this._boundParentEvent = this._onParentEvent.bind(this);
					$(this.parent).on("ibx_expand ibx_collapse ibx_get_row_children", this._boundParentEvent);
					this.updateIndent();
				},
				addRow:function(row)
				{
					var row = $(row).ibxDataGridRow("setParent", this.element);
					row.ibxDataGridRow("show", this.isVisible());
					this.container = row.length || this.container;
				},
				removeRow:function(row)
				{
					var row = $(row).ibxDataGridRow("setParent", null);
				},
				childRows:function(filter)
				{
					filter = filter || "*";
					var event = this.element.dispatchEvent("ibx_get_row_children", {"filter":filter, "children":[]}, false, false);
					return event.data.children;
				},
				show:function(show)
				{
					this.element.ibxToggleClass("dgrid-row-hidden", !show);
					this.header.ibxToggleClass("dgrid-row-hidden", !show);
					this._updateAccessibility();
					if(this.isExpanded())
						this.element.dispatchEvent(show ? "ibx_expand" : "ibx_collapse", null, false, false);
				},
				isVisible:function()
				{
					return this.element.ibxHasClass("dgrid-row-hidden");
				},
				isExpanded:function()
				{
					return this.element.ibxHasClass("dgrid-row-expanded");
				},
				expand:function(expand)
				{
					if(!this.container || (this.isExpanded() == expand))
						return;

					var evt = this.element.dispatchEvent( expand ? "ibx_beforeexpand" : "ibx_beforecollapse", null, true, true);
					if(!evt.isDefaultPrevented())
					{
						this.expanded = expand;
						this.element.ibxToggleClass("dgrid-row-expanded", expand);
						this.element.dispatchEvent(expand ? "ibx_expand" : "ibx_collapse", null, true, false);
					}
				},
				toggleExpand:function()
				{
					this.expand(!this.expanded);
				},
				_onExpandButtonClick:function(e)
				{
					this.toggleExpand();
				},
				_onIndentCellEvent:function(e)
				{
					var eType = e.type;
					if((eType == "click" && this.singleClickExpand) || eType == "dblclick")
						this.toggleExpand();
					else
					if(eType == "keydown" && this.container)
					{
						if(e.keyCode === $.ui.keyCode.ENTER)
							this.toggleExpand();
						else
						if(e.keyCode === $.ui.keyCode.RIGHT && e.ctrlKey && !this.expanded)
						{
							if(!this.expanded)
							{
								this.toggleExpand(true);
								e.stopPropagation();
								e.preventDefault();
							}
						}
						else
						if(e.keyCode === $.ui.keyCode.LEFT && e.ctrlKey && this.expanded)
						{
							if(this.expanded)
							{
								this.toggleExpand(false);
								e.stopPropagation();
								e.preventDefault();
							}
						}

					}
				},
				_onParentEvent:function(e)
				{
					if(e.type == "ibx_get_row_children")
					{
						var data = e.originalEvent.data;
						if(this.element.is(data.filter))
							data.children.push(this.element[0]);
					}
					else
						this.show(e.type == "ibx_expand");
				},
				_indentColumn:-1,
				updateIndent:function(indentCell)
				{
					//update our indent
					var indentCell = (indentCell === undefined) ? this.element.children(sformat(":nth-child({1})", this._indentColumn+1)) : indentCell;
					indentCell.css("paddingLeft", (this.depth() + "em"));
					
					//then update all our children...and so on.
					$(this.childRows()).ibxDataGridRow("updateIndent");
				},
				_updateAccessibility:function()
				{
					//THIS IS NOT CORRECT, OR FINISHED...MORE LIKE A STARTING POINT PLACEHOLDER!
					var ariaOpts = 
					{
						"role":"row",
						"aria-level":this.depth(),
						"aria-hidden":this.element.ibxHasClass("dgrid-row-hidden"),
					};
					var el = this.element[0];
					ariaOpts["aria-hidden"] = (el.style.display == "none" || el.style.visibility == "hidden");
					this.element.attr(ariaOpts);
					this.header.attr({"role":"rowheader", "aria-hidden":ariaOpts["aria-hidden"]});
				},
				refresh:function(options)
				{
					$.extend(this, options);
					this.element.ibxAddClass(widget.rowClasses).data("ibxDataGridRow", widget);
					this.header.ibxAddClass(widget.headerClasses).data("ibxDataGridRow", widget).text(this.title == null ? "." : this.title);

					//configure the indent column (if changed) and cell...expand button/classes etc.
					var indentColumn = this.element.closest(".ibx-data-grid").ibxDataGrid("option", "indentColumn");
					if(!isNaN(indentColumn) && (indentColumn != this._indentColumn))
					{
						//remove the current indent cell config.
						var indentCell = this.element.children(sformat(":nth-child({1})", this._indentColumn+1));
						indentCell.off("dblclick click keydown", this._onIndentCellEventBound);
						indentCell.ibxRemoveClass("dgrid-cell-indent-padding");
						indentCell.ibxRemoveClass(this.cellContainerClasses).ibxRemoveClass("dgrid-cell-indent-column").css("paddingLeft", "");

						//config the new indent cell.
						var indentCell = this.element.children(sformat(":nth-child({1})", indentColumn+1));
						indentCell.on("dblclick click keydown", this._onIndentCellEventBound);
						indentCell.ibxAddClass("dgrid-cell-indent-column").ibxToggleClass(this.cellContainerClasses, this.container);
						if(this.container)
						{
							//create the expand button, and move it to the current indent cell.
							var expandButton = this._expandButton = this._expandButton || $("<div class='material-icons dgrid-cell-expand-button'></div>").on("click", this._onExpandButtonClick.bind(this));
							expandButton.detach();
							indentCell.prepend(expandButton);
						}
						indentCell.ibxToggleClass("dgrid-cell-indent-padding", !this.container);
						this._indentColumn = indentColumn;
						this.updateIndent(indentCell);
					}

					this.expand(this.expanded);
					this._updateAccessibility();

					//Much as I HATE timers...There are times when the height of a row can be dynamic (text wrapping)
					//So, in that case, you can make the row calculate its header size dynamically.
					if(this.dynamicHeaderSize)
					{
						window.setTimeout(function()
						{
							this.header.outerHeight(this.element.outerHeight()).css("visibility", "");
						}.bind(this), 0);
					}
				},
			};

			widget._onIndentCellEventBound = widget._onIndentCellEvent.bind(widget);//need to save for event binding.
			widget.refresh(args[0]);//when constructing, only an 'options' object can be passed.
		}
		else
		{
			var val = this;
			var fn = args[0];
			if(fn instanceof Object)
				widget.refresh(fn);
			else
			if(widget[fn] instanceof Function)
			{
				var fnArgs = $(args).toArray().slice(1);
				val = widget[fn].apply(widget, fnArgs);
			}
			else
				console.error("[ibxDataGridRow] No such method '" + fn + "'.");

			if(val != this && val !== undefined)
			{
				ret = val;
				return false;
			}
		}
		return this;
	}.bind(this, arguments));
	return ret;
};

$.widget("ibi.ibxDataGrid", $.ibi.ibxGrid,
{
	options:
	{
		colMap:[],
		defaultColConfig:
		{
			title:"",
			size:"100px",
			justify:"center",
			resizable:true,
			selectable:true,
			visible:true,
			ui:{},
		},

		defaultRowConfig: {},//not currently used.
		showColumnHeaders:true,
		showRowHeaders:true,
		indentColumn:-1,
		
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
			gridSelectable:"dgrid-selectable",
			gridClass:"dgrid-grid",
			gridRow:"dgrid-row",
			gridCell:"dgrid-cell",
		},

		/*accessibility stuff*/
		aria:
		{
			role:"treegrid"
		}
	},
	_widgetClass:"ibx-data-grid",
	_create:function()
	{
		var options = this.options;
		var classes = options.classes;
		var corner = this._corner = $("<div>").ibxAddClass("dgrid-corner").data({ibxCol:1, ibxRow:1});
		var colHeaderBar = this._colHeaderBar = $("<div tabindex='0'>").ibxHBox({navKeyRoot:true}).ibxAddClass(classes.colHeaderBarClass).data({ibxCol:"2", ibxRow:"1"});
		var rowHeaderBar = this._rowHeaderBar = $("<div tabindex='0'>").ibxVBox({navKeyRoot:true, align:"stretch"}).ibxAddClass(classes.rowHeaderBarClass).data({ibxCol:"1", ibxRow:"2"});
		var grid = this._grid = $("<div tabindex='0'>").ibxVBox({align:"start"}).ibxAddClass(classes.gridClass).data({ibxCol:"2", ibxRow:"2"});
		grid.on("scroll", this._onGridScroll.bind(this));
		grid.ibxDataGridSelectionManager({grid:this, selectableChildren:options.classes.gridSelectable}).on("ibx_beforeselchange", this._onGridSelChange.bind(this));

		this.add([corner[0], colHeaderBar[0], rowHeaderBar[0], grid[0]]);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		return aria;
	},
	_init:function()
	{
		//call super first so grid options are set correctly before adding rows.
		this._super();

		//make the columns from markup.
		var colMap = [];
		var cols = this.element.children("[data-ibxp-grid-col-map]").detach().children();
		for(var i = 0; i < cols.length; ++i)
		{
			var col = cols[i];
			var opts = ibx.getIbxMarkupOptions(cols[i]);
			opts.title = col.innerText || opts.title;
			colMap.push(opts);
		}

		if(colMap.length)
			this.option("colMap", colMap);

		//make the rows from markup.
		var rows = this.element.children("[data-grid-row]").detach();
		for(var i = 0; i < rows.length; ++i)
		{
			var row = rows[i];
			var opts = ibx.getIbxMarkupOptions(row);
			$(row).ibxDataGridRow(opts);
		}

		//add rows and do another refresh so they will be configured correctly.
		this.addRows(rows);
		this.refresh();
	},
	initGrid:function(nRows, nCols, colConfig)
	{
		nRows = nRows || 0;
		nCols = nCols || 0;
		colConfig = colConfig || this.options.defaultColConfig;

		var colMap = [];
		var rows = [];
		for(var i = 0; i < nRows; ++i)
		{
			var row = $("<div>").ibxDataGridRow({"title":i});
			for(var j = 0; j < nCols; ++j)
			{
				var cell = $("<div tabindex='0'>");
				row.append(cell);

				//only need to build the colMap for the first row.
				if(i > 0)
					continue;
				var curColConfig = $.extend({}, colConfig);
				curColConfig.title = "Column " + j;
				colMap.push(curColConfig);
			}
			this.options.colMap = colMap;
			rows.push(row);
		}
		this.updateHeaders();
		this.removeRow();
		this.addRows(rows);
	},
	getSelectionManager:function()
	{
		return this._grid.data("ibiIbxDataGridSelectionManager");
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
				
				//make header if one isn't supplied
				var cHeading = $(sformat("<div tabindex='-1' class='{1}'>", classes.colHeaderClass));
				cHeading.ibxButtonSimple({justify:cInfo.justify});
				cHeading.ibxWidget("option", "text", cInfo.title);
				cHeading.attr("role", "columnheader");

				//make splitter
				var splitter = $(sformat("<div class='{1}'>", classes.colHeaderSplitterClass));
				splitter.ibxSplitter({locked:!cInfo.resizable, resize:"first"}).on("ibx_resize ibx_reset", this._onSplitterResize.bind(this));

				//now add the column header and set the size as everything is in the dom.
				cInfo.ui = {"idx":i, "header":cHeading, "splitter":splitter, "curSize":null};
				cHeading.data("ibxDataGridCol", cInfo);
				this._colHeaderBar.ibxWidget("add", [cHeading[0], splitter[0]]);
				this.setColumnWidth(i, cInfo.size);
			}

			var padding = $("<div>").css({"flex":"0 0 auto", "width":"100px", height:"1px"});
			this._colHeaderBar.append(padding);
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
	getCellPos:function(cell)
	{
		cell = $(cell);
		var options = this.options;
		var row = cell.closest("." + options.classes.gridRow);
		return {"column":cell.index(), "row":row.index()};
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
			cells.outerWidth(width);
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
		var rows = this.getRow(row);
		for(var i = 0; i < rows.length; ++i)
		{
			row = $(rows[i]);
			rInfo = row.data("ibxDataGridRow");
			row.ibxToggleClass("dgrid-row-hidden", !show);
			rInfo.header.ibxToggleClass("dgrid-row-hidden", !show);
		}
	},
	selectRow:function(row, select, addSelection)
	{
		var cells = this.getRow(row).children();
		if(!addSelection)
			this._grid.ibxDataGridSelectionManager("deselectAll", true);
		this._grid.ibxDataGridSelectionManager("selected", cells.toArray(), select);
	},
	expandRow:function(row, expand)
	{
		if(this.options.indentColumn != -1)
		{
			row = row || "*";
			this.getRow(row).ibxDataGridRow("expand", expand);
		}
	},
	addRow:function(row, sibling, before)
	{
		row = $(row);
		var options = this.options;

		//create extra cells if row has less than columns.
		while(row.children().length < options.colMap.length)
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
				cell.setAttribute("tabindex", cell.tabIndex);
				cell.classList.toggle(options.classes.gridSelectable, cInfo.selectable);
				cell.classList.add(options.classes.gridCell);
			}
			else
				cell.classList.add("dgrid-col-hidden");
		}

		//set row options and add to grid.
		var rowData = row.data("ibxDataGridRow");
		this._grid.ibxWidget("add", row, sibling, before);

		//add header in correct location.
		var sibData = $(sibling).data("ibxDataGridRow") || {header:null};
		this._rowHeaderBar.ibxWidget("add", rowData.header, sibData.header, before);

		//padding has to be always added to the end of the bar.
		var padding = this._rowHeaderPadding = this._rowHeaderPadding || $("<div>").css({"flex":"0 0 auto", "width":"1px", "height":"100px"});
		this._rowHeaderBar.append(padding);
		
		//next time a selection happens on grid, reacquire the selectable children.
		this.getSelectionManager().invalidateSelectableCache();
	},
	addRows:function(rows, sibling, before)
	{
		for(var i = 0; i < rows.length; ++i)
			this.addRow(rows[i], sibling, before, false);
	},
	removeRow:function(row)
	{
		var row = this.getRow(row);
		row.each(function(idx, row)
		{
			var widget = $(row).detach().data("ibxDataGridRow");
			widget.header.detach();
			widget.indentColumn = -1;
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
		var cInfo = resizeInfo.el1.data("ibxDataGridCol");
		this.setColumnWidth(cInfo.ui.idx, sWidth + el1Width);
	},
	_onGridScroll:function(e)
	{
		var scrollX = this._grid.prop("scrollLeft");
		var scrollY = this._grid.prop("scrollTop");
		this._colHeaderBar.prop("scrollLeft", scrollX);
		this._rowHeaderBar.prop("scrollTop", scrollY);
	},
	_onGridSelChange:function(e)
	{
		//Handle selction in rows and columns.
		var eType = e.type;
		var selInfo = e.originalEvent.data;
		if((eType == "ibx_beforeselchange") && (selInfo.anchor !== selInfo.focus) && selInfo.selected)
		{
			var posAnchor = this.getCellPos(selInfo.anchor);
			var posFocus = this.getCellPos(selInfo.focus);
			var selCol = (posAnchor.column == posFocus.column) && (posAnchor.column != -1) && (posFocus.column != -1);
			var selRow = (posAnchor.row == posFocus.row) && (posAnchor.row != -1) && (posFocus.row != -1);
			if(selCol || selRow)
			{
				selInfo.items = selInfo.items.map(function(idx, el)
				{
					var ret = null;
					if(selCol && (this.getCellPos(el).column == posAnchor.column))
						ret = el;
					else
					if(selRow  && (this.getCellPos(el).row == posAnchor.row))
						ret = el;
					return ret;
				}.bind(this));
			}
		}
	},
	_setOption:function(key, value)
	{
		var changed = this.options[key] != value;
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
	refresh:function()
	{
		this._super();
	},
	_refresh:function()
	{
		var options = this.options;
		this._colHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showColumnHeaders);
		this._rowHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showRowHeaders);
		this._super();
		this.getRow().ibxDataGridRow("refresh");
	},
});

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		colMap:[{title:"Property", size:"150px", justify:"start"}, {title:"Value", size:"100px", justify:"start"}],
		showRowHeaders:false,
		indentColumn:0,
		props:null,
		triggerKey:$.ui.keyCode.ENTER,
		triggerEvent:"dblclick",
	},
	_widgetClass:"ibx-property-grid",
	_create:function()
	{
		this._super();
		this.element.data("ibiIbxDataGrid", this);
		this.getSelectionManager().options.type = "nav";
		this._boundEditTrigger = this._onEditTrigger.bind(this);
	},
	_buildPropTree:function(props, parentRow)
	{
		var rows = [];
		for(var i = 0; props && i < props.length; ++i)
		{
			var prop = props[i];
			var row = $("<div>").ibxDataGridRow().ibxAddClass("pgrid-prop-row").data("ibxProp", prop);
			rows.push(row);

			var ui = prop.ui = this._createUI(prop);
			row.append([ui.nameCell, ui.valueCell, ui.editorCell]);

			this.addRow(row);
			var childRows = this._buildPropTree(prop.props, row);
			row.ibxDataGridRow("addRow", childRows).ibxDataGridRow({"expanded":prop.expanded});
		}
		return rows;
	},
	_createUI:function(prop)
	{
		var ui = prop.ui = {"prop":prop, "nameCell":null, "valueCell":null, "editorCell":null};
		var event = this.element.dispatchEvent("ibx_prop_create_ui", ui, false, false);	
		if(!event.isDefaultPrevented())
		{
			var type = (-1 == $.ibi.ibxPropertyGrid.uiTypes.indexOf(prop.uiType)) ? null : prop.uiType;
			switch(type)
			{
				case "xcolorPicker":
				{
					console.log("color");
					break;
				}
				default://create the default UI if built in type
				{
					ui.nameCell = $("<div>").text(prop.displayName);
					ui.valueCell = $("<div>").text(prop.displayValue);
					ui.editorCell = $("<div>").text(prop.displayValue + " EDITING");
				}
			}
		}

		$(ui.nameCell).ibxAddClass("pgrid-cell-name").attr("tabindex", 0).data("ibxProp", prop);
		$(ui.valueCell).ibxAddClass("pgrid-cell-value").attr("tabindex", 0).data("ibxProp", prop);
		$(ui.editorCell).ibxAddClass("pgrid-cell-editor").attr("tabindex", 0).data("ibxProp", prop);
		return ui;
	},
	_onEditTrigger:function(e)
	{
		var cell = $(e.target).closest(".dgrid-cell");
		var startEdit = (e.type == "keypress") ?  (e.keyCode == this.options.triggerKey) : cell.is(".pgrid-cell-value");
		if(cell.length && startEdit)
			this.startEditing(cell.data("ibxProp"));
	},
	startEditing:function(prop)
	{
		var event = this.element.dispatchEvent("ibx_prop_edit_start", prop, false, true);
		if(!event.isDefaultPrevented())
		{
			var ui = prop.ui;
			this._editCell = ui.editorCell;
			ui.editorCell.ibxAddClass("pgrid-editing-cell").insertBefore(ui.valueCell);
		}
	},
	stopEditing:function()
	{
		var event = this.element.dispatchEvent("ibx_prop_edit_end", {"cell":cell, "prop":prop}, false, false);
		this.editCell.ibxRemoveClass("pgrid-editing-cell");
		delete this._editCell;
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "props")
		{
			this.removeRow();
			this._buildPropTree(value, null);
		}
		else
		if(key == "triggerEvent")
		{
			this.element.off(options.triggerEvent);
			this.element.on(value, this._onEditTrigger.bind(this));
		}			
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
	},
});
$.ibi.ibxPropertyGrid.uiTypes = ["text", "radio", "check", "select", "colorPicker", "borderSelector"];

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
			cell.ibxAddClass(cellClasses).css("width", sformat("{1}%", width));
			cell.attr({"data-grid-row": curRow, "data-grid-col": spanCount, "data-grid-span": colSpan});
			spanCount += colSpan;
		}.bind(this));
	}
});
$.ibi.ibxFlexGrid.statics = 
{
};
//# sourceURL=grid.ibx.js
