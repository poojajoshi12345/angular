/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.25 $:

/******************************************************************************
	PAGINATION
******************************************************************************/
$.widget("ibi.ibxPagination", $.ibi.ibxHBox, 
{
	options:
	{
		'nameRoot': true,	
		'navKeyRoot':true,
		'focusDefault':true,
		'wrap':false,
		'align':'center',
		'inline':true,
		'pages':0,
		'page':0,
		'totalItems': 9999,
		'pageJumping': true,
		'showPageLocInfo': true,
		'showItemsPerPage': true,
		'itemsPerPage': 100,
		'selMgrOpts':{
			'selectableChildren':'.ibx-pagination-ctrl',
		},
		'aria':{},
	},
	_widgetClass:"ibx-pagination",
	_create:function()
	{
		this._super();
		this._loadWidgetTemplate('.ibx-pagination-template');
		this._btnFirst.on('click', this._onFirstPage.bind(this));
		this._btnPrev.on('click', this._onPrevPage.bind(this));
		this._btnNext.on('click', this._onNextPage.bind(this));
		this._btnLast.on('click', this._onLastPage.bind(this));
		this._pageInfo.on('click', this._onPageInfoClick.bind(this)).on('ibx_startediting ibx_stopediting ibx_canceledit ibx_textchanging', this._onPageInfoEditEvent.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		this._pageInfo.ibxWidget('setAccessibility', accessible, {label:sformat( ibx.resourceMgr.getString("IBX_PAGINATION_PAGE_INFO"), options.page + 1, options.pages + 1)});
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
		var options = this.options;
		var pageInfo = this.pageInfo($.ibi.ibxPagination.GO_FIRST, 0);
		var evt = this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', pageInfo.newPage);
	},
	_onPrevPage:function(e)
	{
		var options = this.options;
		var newPage = Math.max(0, options.page - 1);
		var pageInfo = this.pageInfo($.ibi.ibxPagination.GO_PREVIOUS, newPage);
		var evt = this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', pageInfo.newPage);
	},
	_onNextPage:function(e)
	{
		var options = this.options;
		var newPage = Math.min(options.pages, options.page + 1);
		var pageInfo = this.pageInfo($.ibi.ibxPagination.GO_NEXT, newPage);
		var evt = this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', pageInfo.newPage);
	},
	_onLastPage:function(e)
	{
		var options = this.options;
		var pageInfo = this.pageInfo($.ibi.ibxPagination.GO_LAST, options.pages);
		var evt = this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, true);
		if(!evt.defaultPrevented)
			this.option('page', pageInfo.newPage);
	},
	_onPageInfoClick:function(e)
	{
		if(this.options.pageJumping)
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
			var newPage = Math.min(Math.max(0, e.originalEvent.data - 1), options.pages);
			var pageInfo = this.pageInfo($.ibi.ibxPagination.GO_PAGE, newPage);
			var evt = this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, true);
			if(!evt.defaultPrevented)
				this.option('page', pageInfo.newPage);
			this.refresh();
			this.element.ibxSelectionManager('focus', this._pageInfo);
		}
		else
		if(e.type === 'ibx_canceledit')
			this.refresh();
		else
		if(e.type === 'ibx_textchanging')
		{
			var info  = e.originalEvent.data;
			var value = Number(info.newValue);
			var isValid = (/^[0-9]*$/).test(value);
			if(!isValid)
				e.preventDefault();
		}
	},
	pageInfo:function(hint, newPage)
	{
		var options = this.options;
		var info = {
			hint: hint,
			curPage: options.page,
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

		var idxStart = options.itemsPerPage * options.page;
		var idxEnd = idxStart + options.itemsPerPage;
		this._pageLocInfo.ibxWidget('option', 'text', sformat(ibx.resourceMgr.getString('IBX_PAGINATION_PAGE_LOC_INFO'), idxStart, idxEnd, options.totalItems));

		this._itemsPerPageLabel.css('display', options.showItemsPerPage ? '' : 'none');
		this._itemsPerPage.ibxWidget('userValue', options.itemsPerPage).css('display', options.showItemsPerPage ? '' : 'none');
		this._pageInfo.ibxWidget({text:sformat(ibx.resourceMgr.getString('IBX_PAGINATION_PAGE_INFO_DISPLAY'), options.page + 1, options.pages + 1)})
	}
});
$.ibi.ibxPagination.GO_PAGE = -1;
$.ibi.ibxPagination.GO_FIRST = 0;
$.ibi.ibxPagination.GO_PREVIOUS = 1;
$.ibi.ibxPagination.GO_NEXT = 2;
$.ibi.ibxPagination.GO_LAST = 3;

//# sourceURL=pagination.ibx.js
