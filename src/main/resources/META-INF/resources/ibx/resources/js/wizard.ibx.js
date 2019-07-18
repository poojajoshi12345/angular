/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

$.widget("ibi.ibxWizard", $.ibi.ibxDialog, 
{
	options:
	{
		"type":"std wiz",
		"titlePageSteps":true,
		"captionOptions":
		{
			"text":"ibxWizard"
		},
	},
	_widgetClass:"ibx-wizard",
	_create:function()
	{
		this._super();

		this.btnPrev = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-back-button'>").ibxButton({text:ibx.resourceMgr.getString("IBX_WIZ_BTN_PREV"), glyphClasses:"material-icons", "glyph":"navigate_before"}).on("click", this.goBack.bind(this));
		this.btnNext = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-next-button'>").ibxButton({text:ibx.resourceMgr.getString("IBX_WIZ_BTN_NEXT"), glyphClasses:"material-icons", "glyph":"navigate_next", iconPosition:"right"}).on("click", this.goNext.bind(this));
		this.btnFinish = $("<div tabindex='0' class='ibx-dialog-button ibx-wizard-finish-button hidden'>").ibxButton({text:ibx.resourceMgr.getString("IBX_WIZ_BTN_FINISH")}).on("click", this.close.bind(this, "finish"));
		this.btnBox.ibxWidget("remove", ".ibx-dialog-ok-button, .ibx-dialog-apply-button, .ibx-dialog-no-button");
		this.btnBox.ibxWidget("add", [this.btnPrev[0], this.btnNext[0], this.btnFinish[0]], this.btnCancel, true);
		this._tabPane = $("<div class='ibx-wiz-tab-pane'>").ibxTabPane().ibxWidget("instance");
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
	open:function(page)
	{
		this.go(page || 0);
		this._super();
	},
	allowNext:function(allow)
	{
		this.btnNext.ibxWidget("option", "disabled", !allow);
		this.btnFinish.ibxWidget("option", "disabled", !allow);
	},
	allowPrev:function(allow)
	{
		this.btnPrev.ibxWidget("option", "disabled", !allow);
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
		var options = this.options;
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
			"idxCur":idx,
			"curPage":pages[idx],
			"idxNext":idxNext,
			"nextPage":pages[idxNext],
			"isFirst":idxNext == 0,
			"isLast":idxNext >= (pages.length-1),
			"allowNext":false,
			"allowPrev":true,
		};
		
		var evt = this.element.dispatchEvent("ibx_beforewizardpagechange", info);
		if(!evt.isDefaultPrevented())
		{
			if(info.nextPage)
			{
				//based on new page, manage dialog state.
				this._tabPane.selected(info.nextPage);
				var pageOptions = $(info.nextPage).ibxWidget("option");

				var title = options.titlePageSteps ? sformat(ibx.resourceMgr.getString("IBX_WIZ_DEF_TITLE"), pageOptions.tabOptions.text, info.idxNext + 1, info.pages.length) : pageOptions.tabOptions.text;
				info.title = title;
				info.curPage = info.nextPage;
				info.idxCur = info.idxNext;
				
				delete info.idxNext;
				delete info.nextPage;

				this.element.dispatchEvent("ibx_wizardpagechange", info, true, false);
				this.title(info.title);

				this.allowNext(info.allowNext);
				this.allowPrev(info.allowPrev);

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
	page:function()
	{
		return this._tabPane.selected();
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