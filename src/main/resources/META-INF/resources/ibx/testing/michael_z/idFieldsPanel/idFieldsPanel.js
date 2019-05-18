$.widget("ibi.idFieldsPanel", $.ibi.ibxWidget,
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
	},
	sizeAfterLoad: function()
	{
		var numberOfPanes = $(".metadata-pane").length;
		var equalHeight = parseInt(this.element.css("height"),10) / numberOfPanes;
		$(".metadata-pane").css("height", equalHeight);
	}
});

//# sourceURL=idFieldsPanel.js