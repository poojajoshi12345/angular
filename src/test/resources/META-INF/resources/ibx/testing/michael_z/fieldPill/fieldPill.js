$.widget("ibi.fieldPill", $.ibi.ibxWidget,
{
	options:
	{
		nameRoot:true,
		fieldName: ""
	},
	
	_widgetClass: "field-pill",
	_create: function ()
	{
		this._super();
		var markup = ibx.resourceMgr.getResource(".pill-box-container", false).children();
		this.element.append(markup);
		ibx.bindElements(this.element);		
		
		this.pillDelete.on("click", this.deletePill.bind(this));
	},
	_refresh: function()
	{
		this._super();
		this.pillLabel.ibxWidget("option", "text", this.options.fieldName);
	},
	deletePill: function(e)
	{
		alert("deleted");
		$(".bucket-listener").trigger("field_deleted", {"field" : othis.options.fieldName});
	}	
});

//# sourceURL=fieldPill.js