$.widget("ibi.idFieldsPanel", $.ibi.ibxVBox,
{
	options:
	{
	},	
	_widgetClass: "id-fields-panel",
	_create: function ()
	{
		this._super();
		var markup = ibx.resourceMgr.getResource(".metadataPanel", false).children();
		this.element.append(markup);
		ibx.bindElements(this.element);
		
		
	}
});

//# sourceURL=idFieldsPanel.js