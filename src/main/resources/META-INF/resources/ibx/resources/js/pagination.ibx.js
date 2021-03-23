/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.25 $:

/******************************************************************************
	PAGINATION
******************************************************************************/
$.widget("ibi.ibxPagination", $.ibi.ibxHBox, 
{
	options:
	{
		'pages':0,
		'page':0,
		'navKeyRoot':true,
		'focusDefault':true,
		'wrap':false,
		'align':'center',
		'aria':{}
	},
	_widgetClass:"ibx-pagination",
	_create:function()
	{
		this._super();
		this._btnFirst = $('<div tabindex="-1" class="ibx-pagination-btn-first">').ibxButtonSimple({glyph:'first_page', glyphClasses:'material-icons'}).on('click', this._onFirstPage.bind(this));
		this._btnPrev = $('<div tabindex="-1" class="ibx-pagination-btn-previous">').ibxButtonSimple({glyph:'chevron_left', glyphClasses:'material-icons'}).on('click', this._onPrevPage.bind(this));
		this._btnNext = $('<div tabindex="-1" class="ibx-pagination-btn-next">').ibxButtonSimple({glyph:'chevron_right', glyphClasses:'material-icons'}).on('click', this._onNextPage.bind(this));
		this._btnLast = $('<div tabindex="-1" class="ibx-pagination-btn-last">').ibxButtonSimple({glyph:'last_page', glyphClasses:'material-icons'}).on('click', this._onLastPage.bind(this));
		this._pageInfo = $('<div tabindex="-1" class="ibx-pagination-page-info">').ibxButtonSimple();
		this._pageInfo.on('click', this._onPageInfoClick.bind(this)).on('ibx_startediting ibx_stopediting ibx_textchanging', this._onPageInfoEditEvent.bind(this));
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
		var pageInfo = this.pageInfo(0);
		pageInfo.hint = $.ibi.ibxPagination.GO_FIRST;
		var evt = this.element.dispatchEvent('ibx_page_change', this._pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', 0);
	},
	_onPrevPage:function(e)
	{
		var options = this.options;
		var newPage = Math.max(0, options.page - 1);
		var pageInfo = this.pageInfo(newPage);
		pageInfo.hint = $.ibi.ibxPagination.GO_PREVIOUS;
		var evt = this.element.dispatchEvent('ibx_page_change', this._pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', newPage);
	},
	_onNextPage:function(e)
	{

	},
	_onLastPage:function(e)
	{

	},
	_onPageInfoClick:function(e)
	{
		this._pageInfo.ibxWidget('startEditing');
	},
	_onPageInfoEditEvent:function(e)
	{
		var options = this.options;
		if(e.type === 'ibx_startediting')
			this._pageInfo.ibxWidget('option', 'text', options.page + 1);
		else
		if(e.type === 'ibx_stopediting')
		{
			options.page = Number(e.originalEvent.data - 1);
			this.element.ibxSelectionManager('focus', this._pageInfo);
			this.refresh();
		}
		else
		if(e.type === 'ibx_textchanging')
		{
			var info  = e.originalEvent.data;
			var value = Number(info.newValue);
			var isValid = (/^[0-9]*$/).test(value);
			if(!isValid || (value > options.pages))
				e.preventDefault();
		}
	},
	pageInfo:function(newPage)
	{
		var options = this.options;
		var info = {
			page: options.page,
			newPage:newPage,
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
		this._btnFirst.ibxWidget('option', 'disabled', options.page === 0);
		this._btnPrev.ibxWidget('option', 'disabled', options.page === 0);
		this._btnLast.ibxWidget('option', 'disabled', options.page === options.pages);
		this._btnNext.ibxWidget('option', 'disabled', options.page === options.pages);
		this._pageInfo.ibxWidget({text:sformat('{1}/{2}', options.page + 1, options.pages + 1)})
	}
});
$.ibi.ibxPagination.GO_FIRST = 0;
$.ibi.ibxPagination.GO_PREVIOUS = 1;
$.ibi.ibxPagination.GO_NEXT = 2;
$.ibi.ibxPagination.GO_LAST = 3;

//# sourceURL=pagination.ibx.js
