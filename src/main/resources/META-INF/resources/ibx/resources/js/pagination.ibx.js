/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.25 $:

/******************************************************************************
	PAGINATION
******************************************************************************/
$.widget("ibi.ibxPagination", $.ibi.ibxHBox, 
{
	options:
	{
		'count':0,
		'current':0,
		'wrap':false,
		'align':'center',
		'aria':{}
	},
	_widgetClass:"ibx-pagination",
	_create:function()
	{
		this._super();
		this._btnFirst = $('<div class="ibx-pagination-btn-first">').ibxButtonSimple({glyph:'first_page', glyphClasses:'material-icons'}).on('click', this._onFirstPage.bind(this));
		this._btnPrev = $('<div class="ibx-pagination-btn-previous">').ibxButtonSimple({glyph:'chevron_left', glyphClasses:'material-icons'}).on('click', this._onPrevPage.bind(this));
		this._btnNext = $('<div class="ibx-pagination-btn-next">').ibxButtonSimple({glyph:'chevron_right', glyphClasses:'material-icons'}).on('click', this._onNextPage.bind(this));
		this._btnLast = $('<div class="ibx-pagination-btn-last">').ibxButtonSimple({glyph:'last_page', glyphClasses:'material-icons'}).on('click', this._onLastPage.bind(this));
		this._pageInfo = $('<div class="ibx-pagination-page-info">').ibxLabel({iconPosition:'top'}).ibxWidget('startEditing');
		this.element.append([this._btnFirst, this._btnPrev, this._pageInfo, this._btnNext, this._btnLast]);
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		return aria;
	},
	_init: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	_onFirstPage:function(e)
	{
		var pageInfo = this.pageInfo();
		pageInfo.hint = ibi.ibxPagination.GO_FIRST;
		var evt = this.element.dispatchEvent('ibx_page_change', this._pageInfo, true, true);
		if(!evt.defaultPrevented)
			console.log('go first');
	},
	_onPrevPage:function(e)
	{

	},
	_onNextPage:function(e)
	{

	},
	_onLastPage:function(e)
	{

	},
	pageInfo:function()
	{
		var options = this.options;
		var info = {
			curPage: options.current,
			pageCount:options.pages,
		}
		return info;
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
	},
	_refresh: function ()
	{
		var options = this.options;
		this._super();
		this._pageInfo.ibxWidget({text:sformat('{1}/{2}', options.current, options.count)})
	}
});
$.ibi.ibxPagination.GO_FIRST = 0;
$.ibi.ibxPagination.GO_PREVIOUS = 1;
$.ibi.ibxPagination.GO_NEXT = 2;
$.ibi.ibxPagination.GO_LAST = 3;

//# sourceURL=pagination.ibx.js
