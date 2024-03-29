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
		'navKeyRoot': false,
		'focusDefault':true,
		'wrap':false,
		'align':'center',
		'inline':true,
		'pages':0,
		'page':0,
		'totalItems': 0,
		'pageJumping': true,
		'showPageLocInfo': true,
		'showItemsPerPage': true,
		'itemsPerPage': 0,
		'itemsPerPageArray': [25, 50, 75, 100, 200],
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
		this._itemsPerPage.on('ibx_change', this._onItemsPerPageChange.bind(this));
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
	_onItemsPerPageChange:function(e, val)
	{	
		this.option('itemsPerPage', $(e.target).ibxWidget("userValue"));
		var pageInfo = this.pageInfo($.ibi.ibxPagination.ITEMS_PER_PAGE, 0);
		this.element.dispatchEvent('ibx_pagination_change', pageInfo, true, false);
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
			itemsPerPage: options.itemsPerPage,
			curPage: options.page,
			newPage:newPage,
			pageCount:options.pages,
		}
		return info;
	},
	_setOption:function(key, value)
	{
		const options = this.options;
		const bChanged = options[key] !== value;
		this._super(key, value);

		if(key === 'itemsPerPage' && bChanged) {
			this._itemsPerPage.ibxWidget('userValue', options.itemsPerPage);
		}
		if (key === 'itemsPerPageArray' && bChanged) {
			this._itemsPerPage.ibxWidget('removeControlItem');
			options.itemsPerPageArray.forEach(function(pageSize, idx) {
				const selectItem = $('<div>').ibxSelectItem({selected: idx === 0, text: pageSize, userValue: pageSize});
				this._itemsPerPage.ibxWidget('addControlItem', selectItem);
			}, this);
			this._itemsPerPage.ibxWidget('userValue', options.itemsPerPage);
			this.options.page = 0;
		}
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
		this._pageLocInfo.ibxWidget('option', 'text', sformat(ibx.resourceMgr.getString('IBX_PAGINATION_PAGE_LOC_INFO'), idxStart + 1, Math.min(idxEnd, options.totalItems), options.totalItems));

		this._itemsPerPageLabel.css('display', options.showItemsPerPage ? '' : 'none');
		this._itemsPerPage.css('display', options.showItemsPerPage ? '' : 'none');
		this._pageInfo.ibxWidget({text:sformat(ibx.resourceMgr.getString('IBX_PAGINATION_PAGE_INFO_DISPLAY'), options.page + 1, options.pages + 1)})

		if (Array.isArray(options.itemsPerPageArray)) {
			const filteredPageSizeOptions = options.itemsPerPageArray.filter(function(pageSize) {
				return !isNaN(pageSize) && pageSize > 0;
			});

			this.options.itemsPerPageArray =  filteredPageSizeOptions.length
				? filteredPageSizeOptions
				: $.ibi.ibxPagination.DEFAULTS_ITEMS_PER_PAGE_ARRAY;
		} else {
			this.options.itemsPerPageArray =  $.ibi.ibxPagination.DEFAULTS_ITEMS_PER_PAGE_ARRAY
		}

		this._pageLocInfo.css('display', options.showPageLocInfo ? '' : 'none');
		this._itemsPerPageLabel.css('display', options.showItemsPerPage ? '' : 'none');
		this._itemsPerPage.css('display', options.showItemsPerPage ? '' : 'none');
	}
});
$.ibi.ibxPagination.ITEMS_PER_PAGE = -2;
$.ibi.ibxPagination.GO_PAGE = -1;
$.ibi.ibxPagination.GO_FIRST = 0;
$.ibi.ibxPagination.GO_PREVIOUS = 1;
$.ibi.ibxPagination.GO_NEXT = 2;
$.ibi.ibxPagination.GO_LAST = 3;
$.ibi.ibxPagination.DEFAULTS_ITEMS_PER_PAGE_ARRAY = [25, 50, 75, 100, 200];

//# sourceURL=pagination.ibx.js
