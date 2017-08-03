/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxFlexBox", $.ibi.ibxWidget, 
{
	options:
	{
		"inline":false,
		"direction":"row",
		"wrap":true,
		"justify":"start",
		"justifyItems":"start",
		"justifyContent":"start",
		"align":"start",
		"alignItems":"start",
		"alignContent":"start"
	},
	_widgetClass:"ibx-flexbox",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this._super();
		this.element.removeClass(this._curClasses);
	},
	_setOption:function(key, value)
	{
		var fc = $.ibi.ibxFlexBox.statics.flexClasses;
		var options = this.options;
		if(fc[key])
			this.element.removeClass(fc[key][options[key]]);
		this._super(key, value);
	},
	_refresh:function()
	{
		var options = this.options;
		var fc = $.ibi.ibxFlexBox.statics.flexClasses;;
		var classes = "";
		classes += fc["display"][options.inline ? "inline" : "block"] + " ";
		classes += fc["direction"][options.direction] + " ";
		classes += fc["wrap"][options.wrap] + " ";
		classes += fc["justify"][options.justify] + " ";
		classes += fc["align"][options.align] + " ";
		//classes += fc["alignItems"][options.alignContent];
		//classes += fc["alignContent"][options.alignContent];
		this._curClasses = classes;
		this.element.addClass(classes);
		this._super();
	}
});
$.widget("ibi.ibxHBox", $.ibi.ibxFlexBox, {options:{direction:"row",wrap:false}, _widgetClass:"ibx-flexbox-horizontal"});
$.widget("ibi.ibxVBox", $.ibi.ibxFlexBox, {options:{direction:"column",wrap:false}, _widgetClass:"ibx-flexbox-vertical"});

$.ibi.ibxFlexBox.statics = 
{
	"flexClasses":
	{
		"display":
		{
			"block":"fbx-block",
			"inline":"fbx-inline"
		},
		"direction":
		{
			"row":"fbx-row",
			"rowReverse":"fbx-row-reverse",
			"column":"fbx-column",
			"columnReverse":"fbx-column-reverse"
		},
		"wrap":
		{
			"false":"fbx-nowrap",
			"true":"fbx-wrap",
			"reverse":"fbx-wrap-reverse"
		},
		"justify":
		{
			"start":"fbx-justify-content-start fbx-justify-items-start",
			"end":"fbx-justify-content-end fbx-justify-items-end",
			"center":"fbx-justify-content-center fbx-justify-items-center",
			"spaceBetween":"fbx-justify-content-space-between",
			"spaceAround":"fbx-justify-content-space-around"
		},
		"justifyContent":
		{
			"start":"fbx-justify-content-start",
			"end":"fbx-justify-content-end",
			"center":"fbx-justify-content-center",
			"spaceBetween":"fbx-justify-content-space-between",
			"spaceAround":"fbx-justify-content-space-around"
		},
		"justifyItems":
		{
			"start":"fbx-justify-items-start",
			"end":"fbx-justify-items-end",
			"center":"fbx-justify-items-center",
		},
		"align":
		{
			"start":"fbx-align-items-start fbx-align-content-start",
			"end":"fbx-align-items-end fbx-align-content-end",
			"center":"fbx-align-items-center fbx-align-content-center",
			"stretch":"fbx-align-items-stretch fbx-align-content-stretch",
			"baseline":"fbx-align-items-baseline",
			"spaceBetween":"fbx-align-items-baseline",
			"spaceAround":"fbx-align-content-space-around"
		},
		"alignItems":
		{
			"start":"fbx-align-items-start",
			"end":"fbx-align-items-end",
			"center":"fbx-align-items-center",
			"stretch":"fbx-align-items-stretch",
			"baseline":"fbx-align-items-baseline"
		},
		"alignContent":
		{
			"start":"fbx-align-content-start",
			"end":"fbx-align-content-end",
			"center":"fbx-align-content-center",
			"stretch":"fbx-align-content-stretch",
			"spaceBetween":"fbx-align-items-baseline",
			"spaceAround":"fbx-align-content-space-around"
		}
	}
};

//# sourceURL=flexbox.ibx.js
