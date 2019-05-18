/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.17 $:

$.widget("ibi.ibxForm", $.ibi.ibxWidget,
{
	options:
	{
		name:"myForm",
		action:"",
		target:"_self",
		method:"post",
		encType:"application/x-www-form-urlencoded; charset=utf-8",
		acceptCharset:"",
		fields:{}		
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
	submit:function(doc)
	{
		if(this.element.parent().length)
			this.element.submit();
		else
		{
			this.element.uniqueId();
			var id = this.element.prop("id");
			var doc = $(doc ? doc.documentElement : document.documentElement);
			var frm = doc.find("body").append(this.element.prop("outerHTML")).find("#"+id);
			frm.submit();

			//clean up after our selves.
			if(doc.is(document.documentElement))
				frm.remove();
		}
		return;
	},
	_refresh: function ()
	{
		var options = this.options;
		this._super();
		this.element.attr("name", options.name);
		this.element.attr("action", options.action);
		this.element.attr("target", options.target);
		this.element.attr("method", options.method);
		this.element.attr("enctype", options.encType);
		this.element.attr("accept-charset", options.acceptCharset);
		this.element.remove(".ibx-form-internal-field");
		$.each(options.fields, function(name, value)
		{
			var input = $("<input class='ibx-form-internal-field'>").prop(
			{
				"type": "hidden",
				"name": name,
				"value": value
			});
			this.element.append(input);
		}.bind(this));
	}
});
//# sourceURL=form.ibx.js

