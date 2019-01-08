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
			var uiType = $.ibi.ibxPropertyGrid.uiTypes[prop.uiType] || ibxTextProperty;
			ui = new uiType(prop, this.element);
		}
		return ui;
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
};

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
	this.nameCell.prop("title", prop.tooltip);
	this.valueCell = $("<div>").ibxHBox({align:"center"}).ibxAddClass(["pgrid-cell", "pgrid-value-cell"]).attr("tabindex", 0).data("ibxProp", prop);
	this.valueCell.prop("title", prop.tooltip);

	this.displayValue = $("<div>").ibxHBox({align:"center"}).text(prop.displayValue).ibxAddClass("pgrid-display-value-cell").attr("tabindex", 0).data("ibxProp", prop);
	this.editValue = $("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-edit-value-cell").attr("tabindex", 0).data("ibxProp", prop);

	this.valueCell.append(this.displayValue);
	this.valueCell.on(this.editEvent, this._onTriggerEvent.bind(this));
	this.valueCell.on("keyup keydown focusout", this._onTriggerEvent.bind(this));
	prop.ui = this;
}
var _p = ibxProperty.prototype = new Object();
_p.editEvent = "click";
_p.editKey = $.ui.keyCode.ENTER;
_p.cancelKey = $.ui.keyCode.ESCAPE;
_p.prop = null;
_p.propClean = null;
_p.grid = null;
_p.nameCell = null;
_p.valueCell = null;
_p.displayValue = null;
_p.editValue = null;
_p.isEditing = function(){return this.valueCell.is(".pgrid-prop-editing");};
_p._onTriggerEvent = function(e)
{
	var eType = e.type;
	var isEditing = this.isEditing();
	var startEditing = !isEditing && ((e.type == "keydown") && (e.keyCode == this.editKey) || eType == this.editEvent);
	var cancelEditing = isEditing && (eType == "keydown") && (e.keyCode == this.cancelKey);
	var stopEditing = isEditing && (eType == "focusout") && (e.relatedTarget && !$.contains(this.valueCell[0], e.relatedTarget));
	if(startEditing)
		this._startEditing();
	else
	if(stopEditing)
		this._stopEditing();
	else
	if(cancelEditing)
		this._cancelEditing();
	else
	if(eType == "keydown" && isEditing)
		e.stopPropagation();
};
_p._startEditing = function()
{
	var event = this.grid.dispatchEvent("ibx_start_prop_edit", this.prop, false, true);
	if(!event.isDefaultPrevented())
	{
		this._propClean = $.extend(true, {}, this.prop);
		this.valueCell.ibxAddClass("pgrid-prop-editing");
		this.displayValue.detach();
		this.editValue.appendTo(this.valueCell);
		this.editValue.focus();
		this.startEditing();
	}
};
_p.startEditing = $.noop;
_p._stopEditing = function()
{
	var event = this.grid.dispatchEvent("ibx_end_prop_edit", this.prop, false, true);
	if(!event.isDefaultPrevented())
	{
		this._propClean = null;
		this.valueCell.ibxRemoveClass("pgrid-prop-editing");
		this.editValue.detach();
		this.displayValue.appendTo(this.valueCell);
		this.stopEditing();
	}
};
_p.stopEditing = $.noop;
_p._cancelEditing = function()
{
	var event = this.grid.dispatchEvent("ibx_cancel_prop_edit", this.prop, false, true);
	if(!event.isDefaultPrevented())
	{
		this.prop = this._propClean;
		this._stopEditing();
		this.cancelEditing();
	}
};
_p.cancelEditing = $.noop;
_p.updatePropertyValue = function(newValue)
{
	var event = this.grid.dispatchEvent("ibx_before_prop_update", {"prop":this.prop, "newValue":newValue}, false, true);
	if(!event.isDefaultPrevented())
	{
		this.prop.value = newValue;
		this.grid.dispatchEvent("ibx_prop_updated", {"prop":this.prop, "newValue":this.prop.value}, false, true);
	}
	return !event.isDefaultPrevented();
};
/********************************************************************************
 * IBX PROPERTY UI FOR BASIC TEXT ENTRY
********************************************************************************/
function ibxTextProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.editValue.ibxEditable().on("ibx_canceledit ibx_changed ibx_textchanging", this._onEditEvent.bind(this));
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxTextProperty, "text");
_p.startEditing = function()
{
	var prop = this.prop;
	this.editValue.text(prop.value);
	this.editValue.ibxEditable("startEditing");
};
_p.stopEditing = function()
{
	this.editValue.ibxEditable("stopEditing");
	this.displayValue.text(this.prop.value);
};
_p._onEditEvent = function(e)
{
	var eType = e.type;
	if(eType == "ibx_textchanging")
	{
		var newValue = e.originalEvent.data.newValue;
		var updated = this.updatePropertyValue(newValue);
		if(!updated)
			this.editValue.text(this.prop.value);
	}
	else
	if(eType == "ibx_changed")
		this._stopEditing();
	else
	if(eType == "ibx_canceledit")
	{
		this.prop.value = e.originalEvent.data;
		this._cancelEditing();
	};
}
/********************************************************************************
 * IBX PROPERTY UI FOR COLOR PICKER
********************************************************************************/
function ibxColorPickerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;

	this.displayValue.empty();
	this._displaySwatch = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-swatch").css("backgroundColor", this.prop.value);
	this._displaySwatch.on("click", this._onSwatchClick.bind(this));
	this._displayLabel = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-value").text(this.prop.displayValue);
	this.displayValue.prepend(this._displaySwatch, this._displayLabel);
	this.editValue = this.displayValue;
	this._colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", this._onColorChange.bind(this));
	this._popup = $("<div class='pgrid-color-picker-popup'>");
	this._popup.ibxPopup({destroyOnClose:false, position:{my:"left top", at:"left bottom", of:this._displaySwatch}}).append(this._colorPicker);
	this._popup.on("ibx_close", this._onPopupClose.bind(this));
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxColorPickerProperty, "colorPicker");
_p._popup = null;
_p._onTriggerEvent = function(e)
{
	if(!this._popup.is(e.relatedTarget))
		this._super._onTriggerEvent.call(this, e);
};
_p._onSwatchClick = function(e)
{
	this._colorPicker.ibxColorPicker("option", "color", this.prop.value);
	this._popup.ibxWidget("open");
};
_p._onColorChange = function(e, data)
{
	this.updatePropertyValue(data.text);
	this._displaySwatch.css("backgroundColor", this.prop.value);
	this._displayLabel.text(this.prop.value);
};
_p._onPopupClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this.valueCell.focus();
};
