/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxForm", $.ibi.ibxWidget,
{
	options:
	{
		name:"",
		action:"",
		target:"_self",
		method:"post",
		encType:"application/x-www-form-urlencoded; charset=utf-8",
		fields:[]		
	},
	_widgetClass: "ibx-form",
	_create: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	submit:function()
	{
		var parent = this.element.parent();
		if(!parent.length)
			this.element.appendTo("body");
		this.element[0].submit();
		if(!parent.length)
			parent.detach();
	},
	refresh: function ()
	{
		var options = this.options;
		this._super();
		this.element.attr("name", options.name);
		this.element.attr("action", options.action);
		this.element.attr("target", options.target);
		this.element.attr("method", options.method);
		this.element.attr("enctype", options.encType);
		this.element.empty();
		$.each(options.fields, function(idx, fld)
		{
			var input = $("<input>").prop(
			{
				type:"hidden",
				name:fld.name,
				value:fld.value
			});
			this.element.append(input);
		}.bind(this));
	}
});
//# sourceURL=form.ibx.js

