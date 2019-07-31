/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.105 $:

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
	_ieHasWarned:false,
	_refresh: function ()
	{
		this._super();
		var options = this.options;
		var cols = options.cols;
		var rows = options.rows;

		//Polyfill for IE repeats, just different syntax...coerce normal syntax.
		if(ibxPlatformCheck.isIE)
		{
			cols = cols.replace(/repeat\((\d+)\W+(.*?)\)/g, "($2)[$1]");			
			rows = rows.replace(/repeat\((\d+)\W+(.*?)\)/g, "($2)[$1]");	

			//can't use this stuff with IE.
			if((options.autoCols || options.autoRows || options.autoFlow  || options.areas || options.rowGap || options.colGap) && !this._ieHasWarned)
			{
				console.warn("[ibxGrid] IE does not support autoRows/autoCols/autoFlow/areas/rowGap/colGap for css grids.");
				this._ieHasWarned = true;
			}
		}

		var gridCss = 
		{
			//IE...do before so standard CSS can override in compliant browsers
			"-ms-grid-columns":			cols,
			"-ms-grid-rows":			rows,

			//Standard CSS
			"grid-template-columns":	cols,
			"grid-auto-columns":		options.autoCols,
			"grid-template-rows":		rows,
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
		"rowSelect":false,
		"focusDefault":true,
		"focusResetOnBlur":false,
		"navKeyRoot":true,
		"toggleSelection":false,
		"rubberBand":true,
		"rubberBandPartialSelect":true,
		"escClearSelection":true,
		"selectableChildren":".dgrid-cell", //can be elements/classes/etc.
		"cacheSelectableChildren":true,
	},
	_widgetClass:"ibx-data-grid-selection-manager",
	_onKeyDown:function(e)
	{
		var options = this.options;
		if(!options.rowSelect && options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var selector = options.selectableChildren;
			var cell = $(e.target).closest(selector).filter(":visible()");
			var row = cell.parent();
			if(e.keyCode == $.ui.keyCode.LEFT)
				cell = cell.prevAll(selector + ":visible()").first();
			else
			if(e.keyCode == $.ui.keyCode.RIGHT)
				cell = cell.nextAll(selector + ":visible()").first();
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
			e.preventDefault();
			e.stopPropagation();
		}
		else
			this._super(e);
	},
	mapToSelectable:function(el)
	{
		if(this.options.rowSelect)
			return $(el).closest(".dgrid-row");
		else
			return this._super(el);
	},
	option:function(key, value)
	{
		if(key == "rowSelect")
		{
			this.deselectAll();
			this.selectableChildren().ibxRemoveClass("ibx-sm-selectable");
			this.updateSelectableCache();
			this.options.selectableChildren = value ? ".dgrid-row" : ".dgrid-cell";
			this.element.ibxToggleClass("dgrid-sm-row-select", value);
		}
		this._super(key, value);
	},
});

//Super light weight jQuery widget wrapper around ibxDataGrid rows.
$.fn.ibxDataGridRow = $.ibi.ibxDataGridRow = function(opts, el)
{
	var ret = this;
	var els = $();
	if(this instanceof jQuery)
		els = this;
	else
	if(el instanceof jQuery)
		els = el;

	els.each(function ibxDataGridRow_widget(args, idx, el)
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
				cellContainerClasses:["ibx-flexbox", "fbx-inline", "fbx-row", "fbx-align-items-center"],
				expanded:0,
				singleClickExpand:false,
				
				getGrid:function(){return this.element.closest(".ibx-data-grid");},
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
					this.refresh();
				},
				addRow:function(row)
				{
					var row = $(row).ibxDataGridRow("setParent", this.element);
					this.container = !!row.length || this.container;
					row.ibxDataGridRow("show", this.isVisible() && this.isExpanded());
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
					this.updateAccessibility();
					if(this.isExpanded())
						this.element.dispatchEvent(show ? "ibx_expand" : "ibx_collapse", null, false, false);
				},
				isVisible:function()
				{
					return !this.element.ibxHasClass("dgrid-row-hidden");
				},
				isExpanded:function()
				{
					return this.element.is(".dgrid-row-expanded");
				},
				expand:function(expand)
				{
					if(this.isExpanded() == expand)
						return;

					var evt = this.element.dispatchEvent( expand ? "ibx_beforeexpand" : "ibx_beforecollapse", null, true, true);
					if(!evt.isDefaultPrevented())
					{
						this.expanded = expand;
						this.element.ibxToggleClass("dgrid-row-expanded", expand);
						this.updateAccessibility();
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
				setIndentColumn:function(indentColumn)
				{
					if(this._indentColumn != indentColumn)
					{
						//remove the current indent cell config.
						var indentCell = this.getIndentCell();
						indentCell.off("dblclick click keydown", this._onIndentCellEventBound);

						if(!indentCell.is(".ibx-flexbox"))				
							indentCell.ibxRemoveClass(this.cellContainerClasses)
						indentCell.ibxRemoveClass("dgrid-cell-indent-column dgrid-cell-indent-padding").css("paddingLeft", "");

						//now get and configure the NEW indent cell.
						indentCell = this.getCell(indentColumn);
						if(indentCell.length)
						{
							this._indentColumn = indentColumn;

							//save new indentColumn
							this._indentColumn = indentColumn;
							indentCell.on("dblclick click keydown", this._onIndentCellEventBound);
							indentCell.ibxAddClass("dgrid-cell-indent-column").ibxToggleClass("dgrid-cell-indent-padding", !this.container);
							if(!indentCell.is(".ibx-flexbox"))
								indentCell.ibxAddClass(this.cellContainerClasses);

							if(this.container)
							{
								//create the expand button, and move it to the current indent cell.
								var expandButton = this._expandButton = this._expandButton || $("<div class='material-icons dgrid-cell-expand-button'></div>").on("click", this._onExpandButtonClick.bind(this));
								expandButton.detach();
								indentCell.prepend(expandButton);
							}
							indentCell.ibxToggleClass("dgrid-cell-indent-padding", !this.container);

							//update our indent
							indentCell.css("paddingLeft", (this.depth() + "em"));
							
							//then update all our children...and so on.
							$(this.childRows()).ibxDataGridRow("setIndentColumn", indentColumn);
						}
					}
				},
				getIndentCell:function(){return this.getCell(this._indentColumn);},
				getCell:function(nCol){return this.element.children(sformat(":nth-child({1})", nCol+1));},
				updateAccessibility:function()
				{
					var ariaOpts = 
					{
						"role":"row",
						"aria-level":this.depth() + 1,
						"aria-hidden":!this.isVisible(),
						"aria-owns":this.header.prop("id")
					};
					this.container ? ariaOpts["aria-expanded"] = this.isExpanded() : null;
					this.element.attr(ariaOpts);
					//this.getIndentCell().attr(ariaOpts);
					this.header.attr({"role":"rowheader", "aria-hidden":ariaOpts["aria-hidden"]});
				},
				refresh:function(options)
				{
					$.extend(this, options);
					this.element.ibxAddClass(widget.rowClasses).data("ibxDataGridRow", widget);
					this.header.ibxAddClass(widget.headerClasses).data("ibxDataGridRow", widget).ibxAriaId().text(this.title == null ? "." : this.title);

					//setup the indent column stuff.
					var grid = this.getGrid();
					var indentColumn = grid.length ? grid.ibxDataGrid("option", "indentColumn") : -1;
					this.setIndentColumn(indentColumn);
					this.expand(this.expanded);
					this.updateAccessibility();

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
			title:"Column",
			size:"100px", //the last column can have a size of 'flex' indicating that column should take up empty space at end.
			justify:"center",
			resizable:true,
			selectable:true,
			visible:true,
			ui:null,
		},

		//selection manager option passthroughs.
		selType:"multi",
		rowSelect:false, 
		toggleSelection:false,

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
		var grid = this._grid = $("<div tabindex='0'>").ibxVBox({align:"start", selType:"custom"}).ibxAddClass(classes.gridClass).data({ibxCol:"2", ibxRow:"2"});
		grid.on("ibx_beforeselchange", this._onGridSelChange.bind(this));
		grid.on("scroll", this._onGridScroll.bind(this));

		this._sm = grid.ibxDataGridSelectionManager({grid:this});
		this._sm = grid.ibxDataGridSelectionManager("instance");

		var colHeaderBar = this._colHeaderBar = $("<div tabindex='0'>").ibxHBox({navKeyRoot:true, focusDefault:true}).ibxAddClass(classes.colHeaderBarClass);
		var colHeaderBarGroup = this._colHeaderBarGroup = $("<div class='dgrid-header-col-bar-group'>").append(colHeaderBar).data({ibxCol:"2", ibxRow:"1"});
		var rowHeaderBar = this._rowHeaderBar = $("<div tabindex='0'>").ibxVBox({navKeyRoot:true, focusDefault:true, align:"stretch"}).ibxAddClass(classes.rowHeaderBarClass).data({ibxCol:"1", ibxRow:"2"});

		this.add([corner[0], colHeaderBarGroup[0], rowHeaderBar[0], grid[0]]);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		var options = this.options;
		this.element.attr("role", (options.indentColumn == -1) ? "grid" : "treegrid");
		this._colHeaderBarGroup.attr("role", "rowgroup");
		this._colHeaderBar.ibxWidget("setAccessibility", undefined, {"role":"row"});
		this._grid.ibxWidget("setAccessibility", undefined, {"role":"rowgroup"});
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

		//make the rows from markup...these are just divs with inner cell...I'll construct the ibxDataGridRow object.
		var rows = this.element.children("[data-grid-row]").detach();
		for(var i = 0; i < rows.length; ++i)
		{
			var row = rows[i];
			var opts = ibx.getIbxMarkupOptions(row);
			$(row).ibxDataGridRow(opts);
			this.addRow(row);
			this._buildTreeFromMarkup(row);
		}

		//make yet more rows from markup...these are already constructed ibxDataGridRow objects.
		row = this.element.children(".ibx-data-grid-row").detach();
		this.addRow(row);

		//now visually clean up the grid.
		this.refresh();
	},
	_buildTreeFromMarkup:function(parentRow)
	{
		parentRow = $(parentRow);
		var children = !parentRow.length ? this.element.children("[data-grid-row]") : parentRow.children("[data-grid-row]");
		children.detach();
		for(var i = 0; i < children.length; ++i)
		{
			var childRow = children[i];
			var opts = ibx.getIbxMarkupOptions(childRow);
			$(childRow).ibxDataGridRow(opts);
			this.addRow(childRow);
			parentRow.ibxDataGridRow("addRow", childRow);
			this._buildTreeFromMarkup(childRow);
		}
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
			var row = $("<div>").ibxDataGridRow({"title":i+1});
			for(var j = 0; j < nCols; ++j)
			{
				var cell = $("<div>");
				row.append(cell);

				//only need to build the colMap for the first row.
				if(i > 0)
					continue;
				var curColConfig = $.extend({}, colConfig);
				curColConfig.title = "C " + (j+1);
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
		return this._sm;
	},
	updateHeaders:function(which)
	{
		which = which || "both";

		var options = this.options;
		var classes = options.classes;

		if(which == "column" || which == "both")
		{
			//this._colHeaderBar.empty();
			this._colHeaderBar.ibxWidget("remove");

			var flexing = false;
			var colMap = options.colMap;
			for(var i = 0; i < colMap.length; ++i)
			{
				var cInfo = colMap[i];
				
				//make default header if one isn't supplied
				var cHeading = $(cInfo.ui);
				if(!cHeading.length)
					cHeading = $("<div>").ibxButtonSimple({justify:cInfo.justify, text:cInfo.title});
				cHeading.ibxAddClass(classes.colHeaderClass).attr({tabindex:-1, role:"columnheader"});

				//make splitter
				var splitter = $(sformat("<div class='{1}'>", classes.colHeaderSplitterClass));
				splitter.ibxSplitter({locked:!cInfo.resizable, resize:"first", el1:cHeading}).on("ibx_resize ibx_reset", this._onSplitterResize.bind(this));
				splitter.on("click", function(e){e.stopPropagation()});//click on splitter not click on header!

				//now add the column header and set the size as everything is in the dom.
				cInfo._ui = {"idx":i, "header":cHeading, "curSize":null};
				cHeading.append(splitter).data("ibxDataGridCol", cInfo);
				this._colHeaderBar.ibxWidget("add", cHeading[0]);
				if(cInfo.size == "flex")
				{
					cHeading.css("flex", "1 1 auto");
					this.getColumn(i).css("flex", "1 1 auto");
					splitter.detach(); //flex columns don't have splitters
					flexing = true;
				}
				else
				{
					cHeading.css("flex", "");
					this.setColumnWidth(i, cInfo.size);
				}

				this.showColumn(i, cInfo.visible);
			}

			//adjust the grid options and padding based on flexing.
			this._grid.ibxWidget("option", "align", flexing ? "stretch" : "start").ibxToggleClass("dgrid-grid-flexing", flexing);
			if(!flexing)
			{
				var padding = $("<div>").css({"flex":"0 0 auto", "width":"50px", height:"1px"});
				this._colHeaderBar.append(padding);
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
		return (cInfo && cInfo._ui && cInfo._ui.header) ? cInfo._ui.header.outerWidth() : cInfo.size;
	},
	setColumnWidth:function(idxCol, width)
	{
		var cInfo = this.options.colMap[idxCol];
		if(cInfo && cInfo._ui)
		{
			//this looks weird because the 'width' parm can be a string like "100px", and that has to be set, then we need the 
			//actual width...AND THEN...we need to subtract out the splitter width...oy vey!
			cInfo._ui.curSize = width;
			cInfo._ui.header.outerWidth(width);
			cInfo._ui.header.outerWidth(cInfo._ui.header.outerWidth());

			var cells = this.getColumn(idxCol);
			cells.outerWidth(cInfo._ui.header.outerWidth());
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
		if(cInfo)
		{
			cInfo.visible = show;
			if(cInfo._ui)
				cells = cells.add(cInfo._ui.header);
		}
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
	getRowIndex:function(row)
	{
		return this.getRow().index(row);
	},
	showRow:function(row, show)
	{
		var rows = this.getRow(row);
		rows.ibxDataGridRow("show", show);
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
		if(!row.length)
			return;

		var options = this.options;

		//create extra cells if row has less than columns.
		while(row.children().length < options.colMap.length)
			row.append($("<div>"));

		//Happens a lot: DON'T USE JQUERY (VERY SLOW).
		var cells = row.children();
		for(var i = 0; i < cells.length; ++i)
		{
			var cell = cells[i];
			var cInfo = options.colMap[i] || options.defaultColConfig;
			cell.style.width = isNaN(cInfo._ui.curSize) ? cInfo._ui.curSize : cInfo._ui.curSize + "px";//if size is just a number assume pixels.
			cell.classList.add(options.classes.gridCell);
			
			//if the tabindex hasn't been set outside, then default to -1 (navkey/click access only...no tabbing between cells).
			if(!cell.getAttribute("tabindex"))
				cell.setAttribute("tabindex", -1);

			//aria stuff
			cell.setAttribute("role", "gridcell");
			cell.id = "dgrid-cell-id-" + (++$.ibi.ibxDataGrid._cellId);
		}

		//set row options and add to grid...refresh so columnIndent is correct.
		var rowData = row.data("ibxDataGridRow");
		row.attr("tabindex", -1);
		this._grid.ibxWidget("add", row, sibling, before);

		//add header in correct location.
		var sibData = $(sibling).data("ibxDataGridRow") || {header:null};
		this._rowHeaderBar.ibxWidget("add", rowData.header, sibData.header, before);

		//padding has to be always added to the end of the bar.
		var padding = this._rowHeaderPadding = this._rowHeaderPadding || $("<div>").css({"flex":"0 0 auto", "width":"1px", "height":"100px"});
		this._rowHeaderBar.append(padding);
		
		//next time a selection happens on grid, reacquire the selectable children.
		this._sm.updateSelectableCache();
	},
	addRows:function(rows, sibling, before)
	{
		for(var i = 0; i < rows.length; ++i)
			this.addRow(rows[i], sibling, before, false);
	},
	removeRow:function(row)
	{
		var row = (row instanceof Object) ? row : this.getRow(row);
		$(row).each(function(idx, row)
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
		var el1Width = resizeInfo.el1.outerWidth();
		var cInfo = resizeInfo.el1.data("ibxDataGridCol");
		if(cInfo)
			this.setColumnWidth(cInfo._ui.idx, el1Width);
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
		var eType = e.type;
		var selInfo = e.originalEvent.data;
		if((eType == "ibx_beforeselchange") && !this.options.rowSelect && (selInfo.anchor !== selInfo.focus) && selInfo.selected)
		{
			//Handle selection in rows and columns...not done for rowSelect (obviously).
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
			//merge existing with new and default col info.
			var colMap = [];
			$.each(value, function(idx, colConfig)
			{
				var curColConfig = options.colMap[idx];
				colMap.push($.extend({}, options.defaultColConfig, curColConfig, colConfig));
			}.bind(this));
			options.colMap = colMap;
			this.updateHeaders("column");
			return;
		}
		else
		if(key == "defaultColConfig")
			value = $.extend({}, options.defaultColConfig, value);
		else
		if(key == "selType")
		{
			this._sm.option("type", value);
			value = "none";
		}
		else
		if(key == "rowSelect")
			this._sm.option("rowSelect", value);
		else
		if(key == "toggleSelection")
			this._sm.option("toggleSelection", value);
		this._super(key, value);
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
$.ibi.ibxDataGrid._cellId = 0;

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
