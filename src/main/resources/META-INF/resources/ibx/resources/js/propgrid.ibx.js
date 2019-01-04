/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		colMap:[{title:"Property", size:"150px", justify:"start"}, {title:"Value", size:"300px", justify:"start"}],
		showRowHeaders:false,
		indentColumn:0,
		props:null,
	},
	_widgetClass:"ibx-property-grid",
	_create:function()
	{
		this._super();
		this.element.data("ibiIbxDataGrid", this);
		this.getSelectionManager().options.type = "nav";
	},
	_buildPropTree:function(props, parentRow)
	{
		var rows = [];
		for(var i = 0; props && i < props.length; ++i)
		{
			var prop = props[i];
			var row = $("<div>").ibxDataGridRow().ibxAddClass("pgrid-row").data("ibxProp", prop);
			rows.push(row);

			var ui = prop.ui = this._createUI(prop);
			row.append([ui.nameCell, ui.valueCell]);

			this.addRow(row);
			var childRows = this._buildPropTree(prop.props, row);
			row.ibxDataGridRow("addRow", childRows).ibxDataGridRow({"expanded":prop.expanded});
		}
		return rows;
	},
	_createUI:function(prop)
	{
		var ui = null;
		var event = this.element.dispatchEvent("ibx_prop_create_ui", prop, false, false);	
		if(!event.isDefaultPrevented())
		{
			var uiType = $.ibi.ibxPropertyGrid.uiTypes[prop.uiType] || ibxProperty;
			ui = new uiType(prop, this.element);
		}
		return ui;
	},
	startEditing:function(prop)
	{
	},
	stopEditing:function(prop)
	{
	},
	cancelEditing:function()
	{
		//do something here
	},
	propertyChanged:function(prop)
	{
		var event = this.element.dispatchEvent("ibx_prop_changed", prop, false, true);
		return event.isDefaultPrevented();
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "props")
		{
			this.removeRow();
			this._buildPropTree(value, null);
		}
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
	},
});

$.ibi.ibxPropertyGrid.uiTypes = {"ibxProperty":ibxProperty};
$.ibi.ibxPropertyGrid.extendProperty = function(baseProp, propType, uiType)
{
	ibx.inPropCtor = true;
	var p = propType.prototype = new baseProp();
	ibx.inPropCtor = false;
	p.constructor = propType;
	p._super = baseProp.prototype;
	$.ibi.ibxPropertyGrid.uiTypes[uiType] = propType;
	return p;
}

/********************************************************************************
 * BASE CLASS FOR IBX PROPERTY UI
********************************************************************************/
function ibxProperty(prop, grid)
{
	Object.call(this);
	if(ibx.inPropCtor) return;

	this.prop = prop;
	this.grid = grid;
	this.nameCell = $("<div>").text(prop.displayName).ibxAddClass(["pgrid-cell","pgrid-name-cell"]).attr("tabindex", 0).data("ibxProp", prop);
	this.valueCell = $("<div>").ibxHBox({align:"center"}).ibxAddClass(["pgrid-cell", "pgrid-value-cell"]).attr("tabindex", 0).data("ibxProp", prop);
	this.displayValue = $("<div>").ibxHBox({align:"center"}).text(prop.displayValue).ibxAddClass("pgrid-display-value-cell").attr("tabindex", 0).data("ibxProp", prop);
	this.editValue = $("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-edit-value-cell").attr("tabindex", 0).data("ibxProp", prop);

	this.valueCell.append(this.displayValue);
	this.valueCell.on(this.triggerEvent, this._onTriggerEvent.bind(this));
	this.valueCell.on("keyup", this._onTriggerEvent.bind(this));
	this.valueCell.on("keydown", this._onKeyEvent.bind(this));
	this.valueCell.on("focusout", this._onBlurEvent.bind(this));
	prop.ui = this;
}
var _p = ibxProperty.prototype = new Object();
_p.triggerEvent = "click";
_p.triggerKey = $.ui.keyCode.ENTER;
_p.prop = null;
_p.grid = null;
_p.nameCell = null;
_p.valueCell = null;
_p.displayValue = null;
_p.editValue = null;
_p.isEditing = function(){return this.valueCell.is(".pgrid-prop-editing");};
_p.isValueLosingFocus = function(e){return (e.relatedTarget && !$.contains(this.valueCell[0], e.relatedTarget));};
_p._onTriggerEvent = function(e)
{
	var isEditing = this.isEditing();
	var startEditing = (e.type == "keyup") ? e.keyCode == this.triggerKey : true;
	if(startEditing && !isEditing)
		this.startEditing()
};
_p._onKeyEvent = function(e)
{
	if(e.type == "keydown" && this.isEditing())
		e.stopPropagation();
};
_p._onBlurEvent = function(e)
{
	if(this.isValueLosingFocus(e))
		this.stopEditing();
};
_p.valueChanged = function(value)
{
	var event = this.grid.dispatchEvent("ibx_prop_changed", this.prop, false, true);
	return event.isDefaultPrevented();
};
_p.startEditing = function()
{
	var event = this.grid.dispatchEvent("ibx_start_prop_edit", this.prop, false, true);
	if(!event.isDefaultPrevented())
	{
		this.valueCell.ibxAddClass("pgrid-prop-editing");
		this.displayValue.detach();
		this.editValue.appendTo(this.valueCell);
		this.editValue.focus();
		this._startEditing();
	}
};
_p._startEditing = function()
{
	var prop = this.prop;
	this.editValue.text(prop.value);
	this.editValue.ibxEditable().ibxEditable("startEditing").on("ibx_changed", function(e)
	{
		prop.value = e.originalEvent.data;
		prop.displayValue = prop.value;
		this.displayValue.text(prop.value);
		this.stopEditing();
	}.bind(this));
};
_p.stopEditing = function()
{
	var event = this.grid.dispatchEvent("ibx_end_prop_edit", this.prop, false, true);
	if(!event.isDefaultPrevented())
	{
		this.valueCell.ibxRemoveClass("pgrid-prop-editing");
		this.editValue.detach();
		this.displayValue.appendTo(this.valueCell);
		this._stopEditing();
	}
}
_p._stopEditing = function()
{
};

/********************************************************************************
 * IBX PROPERTY UI FOR COLOR PICKER
********************************************************************************/
function ibxColorPickerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;

	this.displayValue.empty();
	this._displaySwatch = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-swatch").css("backgroundColor", this.prop.value);
	this._displayLabel = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-value").text(this.prop.displayValue);
	this.displayValue.prepend(this._displaySwatch, this._displayLabel);
	this.editValue = this.displayValue;

	this._colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", function(e, value)
	{
		var prop = this.prop;
		prop.value = value.text;
		this._displaySwatch.css("backgroundColor", prop.value);
		this._displayLabel.text(prop.value);
		this.valueChanged();
	}.bind(this));
	this._popup = $("<div class='pgrid-color-picker-popup'>");
	this._popup.ibxPopup({destroyOnClose:false, position:{my:"left top", at:"left bottom", of:this._displaySwatch}}).append(this._colorPicker);
	this._popup.on("ibx_close", this._onPopupClose.bind(this));
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxColorPickerProperty, "colorPicker");
_p._popup = null;
_p._onBlurEvent = function(e)
{
	if(!this._popup.is(e.relatedTarget))
		this._super._onBlurEvent.call(this, e);
};
_p._onPopupClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this.valueCell.focus();
};
_p._startEditing = function()
{
	//this._super._startEditing.call(this);
	this._displaySwatch.on("click", function(e)
	{
		this._colorPicker.ibxColorPicker("option", "color", this.prop.value);
		this._popup.ibxWidget("open");
	}.bind(this));
};
