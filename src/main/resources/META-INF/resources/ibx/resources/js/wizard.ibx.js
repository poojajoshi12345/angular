/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

$.widget("ibi.ibxWizard", $.ibi.ibxDialog, 
{
	options:
	{
		"type":"std wiz",
		"buttons":"prevnextcancel",
		"captionOptions":
		{
			"text":"ibxWizard"
		},
	},
	_widgetClass:"ibx-wizard",
	_create:function()
	{
		this._super();

		this.btnPrev = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-back-button'>").ibxButton({text:"Back", glyphClasses:"material-icons", "glyph":"navigate_before"}).on("click", this.goBack.bind(this));
		this.btnNext = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-next-button'>").ibxButton({text:"Next", glyphClasses:"material-icons", "glyph":"navigate_next", iconPosition:"right"}).on("click", this.goNext.bind(this));
		this.btnFinish = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-finish-button hidden'>").ibxButton({text:"Finnish"}).on("click", this.close.bind(this, "finish"));
		this.btnBox.ibxWidget("remove", ".ibx-dialog-ok-button, .ibx-dialog-apply-button, .ibx-dialog-no-button");
		this.btnBox.ibxWidget("add", [this.btnPrev[0], this.btnNext[0], this.btnFinish[0]], this.btnCancel, true);

		this._tabPane = $("<div class='ibx-wiz-tab-pane'>").on("ibx_change", this._onTabChange.bind(this)).ibxTabPane().ibxWidget("instance");
		$.ibi.ibxDialog.prototype.add.call(this, this._tabPane.element);
		var pages = this.element.find(".ibx-wizard-page").detach();
		this.add(pages);
		this.go(0);
	},
	_destroy:function()
	{
		this._super();
	},
	children:function(selector)
	{
		return this._tabPane.children(selector || ".ibx-wizard-page");
	},
	add:function(el, elSibling, before, refresh)
	{
		this._tabPane.add(el, elSibling, before, refresh);
	},
	remove:function(el, destroy, refresh)
	{
		this._tabPane.remove(el, destroy, refresh);
	},
	goNext:function(e)
	{
		this.go($.ibi.ibxWizard.NEXT)
	},
	goBack:function(e)
	{
		this.go($.ibi.ibxWizard.PREV)
	},
	go:function(where)
	{
		var pages = this.children();

		where = isNaN(where) ? pages.index(where) : where;

		var idx = this._tabPane.selectedIndex();
		var idxNext = idx;
		switch(where)
		{
			case $.ibi.ibxWizard.PREV:
			case $.ibi.ibxWizard.NEXT:
				idxNext += where;
				break;
			case $.ibi.ibxWizard.FIRST:
				idxNext = 0;
				break;
			case $.ibi.ibxWizard.LAST:
				idxNext = pages.length-1;
				break;
			default:
				idxNext = where;
		}

		var info = 
		{
			"pages":pages,
			"goIdx":false,
			"idxCur":idx,
			"curPage":pages[idx],
			"idxNext":idxNext,
			"nextPage":pages[idxNext],
			"isFirst":idxNext == 0,
			"isLast":idxNext >= (pages.length-1),
		};
		
		var evt = this.element.dispatchEvent("ibx_beforewizardpagechange", info);
		if(!evt.isDefaultPrevented())
		{
			if(info.nextPage)
			{
				//based on new page, manage dialog state.
				this._tabPane.selected(info.nextPage);
				var pageOptions = $(info.nextPage).ibxWidget("option");

				var title = sformat("{1} ({2} of {3})", pageOptions.tabOptions.text, info.idxNext + 1, info.pages.length);
				info = {"idxCurPage":idx, "pages":pages, "selPage":pages[idx], "isFirst":info.isFirst, "isLast": info.isLast, "title":title};				
				this.element.dispatchEvent("ibx_wizardpagechange", info);
				this.title(info.title);

				this.btnPrev.ibxToggleClass("hidden", info.isFirst);
				this.btnNext.ibxToggleClass("hidden", info.isLast);
				this.btnFinish.ibxToggleClass("hidden", !info.isLast);
			}
		}
	},
	title:function(caption)
	{
		if(caption === undefined)
			return this.options.captionOptions.text;
		this.option("captionOptions.text", caption);
	},
	_onTabChange:function(e, page)
	{
		return;
		if(!this._tabPane.element.is(e.target))
			return;
		page = $(page);
		var pageOptions = page.ibxWidget("option");
		var pages = this._tabPane.children();
		var idxPage = pages.index(page) + 1;
		this.title(sformat("{1} ({2} of {3})", pageOptions.tabOptions.text, idxPage, pages.length));
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "selected")
		{
			this._tabPage.option(key, value);
		}
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.option;
	}
});
$.ibi.ibxWizard.NEXT = 1;
$.ibi.ibxWizard.PREV = -1;
$.ibi.ibxWizard.FIRST = 0;
$.ibi.ibxWizard.LAST = Infinity;

$.widget("ibi.ibxWizardPage", $.ibi.ibxTabPage,{_widgetClass:"ibx-wizard-page"});

//# sourceURL=wizard.ibx.js