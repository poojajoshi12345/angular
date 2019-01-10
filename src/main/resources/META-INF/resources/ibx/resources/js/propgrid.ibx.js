/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		colMap:[{title:"Property", size:"200px", justify:"start"}, {title:"Value", size:"300px", justify:"start"}],
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
			row.append([ui._nameCell, ui._valueCell]);

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
	propType.base = baseProp.prototype;
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
	this.createUI();
	prop.ui = this;
}
var _p = ibxProperty.prototype = new Object();
_p.editEvent = "click";
_p.editKey = $.ui.keyCode.ENTER;
_p.cancelKey = $.ui.keyCode.ESCAPE;
_p.prop = null;
_p.propClean = null;
_p.grid = null;
_p._nameCell = null;
_p._valueCell = null;
_p.displayValue = null;
_p.editValue = null;
_p.isEditing = function(){return this._valueCell.is(".pgrid-prop-editing");};
_p.createUI = function()
{
	var prop = this.prop;
	this._nameCell = this.createNameCell().ibxAddClass(["pgrid-cell","pgrid-name-cell"]).attr("tabindex", 0).data("ibxProp", prop);
	this._nameCell.prop("title", prop.nameTip);
	this._valueCell = this.createValueCell().ibxAddClass(["pgrid-cell", "pgrid-value-cell"]).attr("tabindex", 0).data("ibxProp", prop);
	this._valueCell.prop("title", prop.valueTip);
	this._valueCell.on(this.editEvent, this._onTriggerEvent.bind(this));
	this._valueCell.on("keyup keydown focusout", this._onTriggerEvent.bind(this));

	this.editValue = this.createEditValue().attr("tabindex", 0).data("ibxProp", prop);
	this.displayValue = this.createDisplayValue().attr("tabindex", 0).data("ibxProp", prop);
	this._valueCell.append(this.displayValue);
};
_p.createNameCell = function()
{
	return $("<div>").ibxLabel({text:this.prop.displayName});
};
_p.createValueCell = function()
{
	return $("<div>").ibxHBox({align:"center"});
};
_p.createEditValue = function()
{
	return $("<div>").ibxHBox({align:"center"});
};
_p.createDisplayValue = function()
{
	return this.editValue;//by default edit and display are the same.
};
_p._onTriggerEvent = function(e)
{
	var eType = e.type;
	var isEditing = this.isEditing();
	var startEditing = !isEditing && ((e.type == "keydown") && (e.keyCode == this.editKey) || eType == this.editEvent);
	var cancelEditing = isEditing && (eType == "keydown") && (e.keyCode == this.cancelKey);
	var stopEditing = isEditing && (eType == "focusout") && (e.relatedTarget && !$.contains(this._valueCell[0], e.relatedTarget));
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
		this._valueCell.ibxAddClass("pgrid-prop-editing");
		this.displayValue.detach();
		this.editValue.appendTo(this._valueCell);
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
		this._valueCell.ibxRemoveClass("pgrid-prop-editing");
		this.editValue.detach();
		this.displayValue.appendTo(this._valueCell);
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
 * IBX PROPERTY UI FOR BASIC LABEL/GROUPING/SEPARATING
********************************************************************************/
function ibxLabelProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue.text(prop.displayValue).attr("tabindex", "");	
	this.editValue.text(prop.editValue);
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxLabelProperty, "label");
_p._startEditing = $.noop;
/********************************************************************************
 * IBX PROPERTY UI FOR BASIC TEXT ENTRY
********************************************************************************/
function ibxTextProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue.text(prop.displayValue);
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
	}
};
/********************************************************************************
 * IBX PROPERTY UI FOR BUTTON
********************************************************************************/
function ibxButtonProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxButtonProperty, "button");
_p.createEditValue = function()
{
	return $("<div>").ibxButton({text:this.prop.displayValue, align:"center"}).ibxAddClass("pgrid-button").on("click", this._onButtonEvent.bind(this));
};
_p._onButtonEvent = function(e)
{
	this.updatePropertyValue(this.prop.value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR CHECK BUTTON
********************************************************************************/
function ibxCheckBoxProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxCheckBoxProperty, "checkbox");
_p.createEditValue = function()
{
	return $("<div>").ibxCheckBoxSimple({text:this.prop.displayValue, checked:this.prop.value}).on("ibx_change", this._onCheckEvent.bind(this));
};
_p.startEditing = function()
{
	var prop = this.prop;
	this.editValue.ibxWidget("option", {"checked":prop.value});
};
_p.stopEditing = function()
{
};
_p._onCheckEvent = function(e)
{
	var checked = $(e.target).ibxWidget("option", "checked");
	this.updatePropertyValue(checked);
};
/********************************************************************************
 * IBX PROPERTY UI FOR SWITCH
********************************************************************************/
function ibxSwitchProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxCheckBoxProperty, ibxSwitchProperty, "switch");
_p.createEditValue = function()
{
	return $("<div>").ibxSwitch({text:this.prop.displayValue, checked:this.prop.value}).ibxAddClass("pgrid-prop-switch").on("ibx_change", this._onCheckEvent.bind(this));
};
/********************************************************************************
 * IBX PROPERTY UI FOR RADIO GROUP
********************************************************************************/
function ibxRadioGroupProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxRadioGroupProperty, "radioGroup");
_p.createEditValue = function()
{
	var prop = this.prop;
	var editValue = $("<div>").ibxRadioGroup({navKeyRoot:true, wrap:false}).on("ibx_change", this._onChangeEvent.bind(this));
	var grpName = editValue.ibxWidget("option", "name");
	var vals = prop.values;
	for(var i = 0; i < vals.length; ++i)
	{
		var val = vals[i];
		var btn = $("<div class='pgrid-prop-radio-button' tabindex='0'>").ibxRadioButtonSimple({text:val.displayName, userValue:val.value});
		editValue.ibxWidget("add", btn);
	}
	return editValue;
};
_p.startEditing = function()
{
	var prop = this.prop;
	this.displayValue.ibxWidget("userValue", prop.value);
};
_p.stopEditing = function()
{
};
_p._onChangeEvent = function(e)
{
	//will get a lot of ibx_change events from the child radio buttons...th displayValue represents the actual button group.
	if(this.displayValue.is(e.target))
	{
		var value = this.displayValue.ibxWidget("userValue");
		this.updatePropertyValue(value);
	}
};
/********************************************************************************
 * IBX PROPERTY UI FOR SELECT PICKER
********************************************************************************/
function ibxSelectProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSelectProperty, "select");
_p.createEditValue = function()
{
	var prop = this.prop;
	var editValue = $("<div>").ibxSelect({multiSelect:prop.multiSelect}).ibxAddClass("pgrid-prop-select").on("ibx_change", this._onSelectEvent.bind(this));
	var openBtn = editValue.find(".ibx-select-open-btn");
	openBtn.ibxWidget("option", "iconPosition", "top");

	var vals = prop.values;
	for(var i = 0; i < vals.length; ++i)
	{
		var val = vals[i];
		var selItem = null;
		if(prop.multiSelect)
			selItem = $("<div>").ibxSelectCheckItem({text:val.displayName, userValue:val.value});
		else
			selItem = $("<div>").ibxSelectItem({text:val.displayName, userValue:val.value});
		editValue.ibxWidget("addControlItem", selItem);
	}
	editValue.ibxSelect("userValue", prop.value);
	return editValue;
};
_p.startEditing = function()
{
	var prop = this.prop;
	this.editValue.ibxWidget("option", {"checked":prop.value});
};
_p.stopEditing = function()
{
};
_p._onSelectEvent = function(e)
{
	var value = $(e.target).ibxWidget("userValue");
	this.updatePropertyValue(value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR MENU BUTTON
********************************************************************************/
function ibxMenuProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxMenuProperty, "menu");
_p.createEditValue = function()
{
	var prop = this.prop;
	var selValue = prop.value;
	var menu = $("<div>").ibxMenu().on("ibx_select", this._onMenuEvent.bind(this));
	for(var i = 0; i < prop.values.length; ++i)
	{
		var value = prop.values[i];
		var item = $("<div>").ibxMenuItem({labelOptions:{text:value.displayName}, userValue:value});
		menu.ibxWidget("add", item);
		if(value.value == prop.value)
			selValue = value.displayName;
	}
	var menuButton = this.menuButton = $("<div tabindex='0'>").ibxMenuButton({"text":selValue, "menu":menu, "iconPosition":"right", "glyph":"arrow_drop_down", "glyphClasses":"material-icons pgrid-prop-menu-btn"}).ibxAddClass("pgrid-prop-menu");
	return menuButton;
},
_p._onMenuEvent = function(e, data)
{
	var item = $(data);
	var value = item.ibxWidget("option", "userValue");
	if(this.updatePropertyValue(value.value))
	{
		this.menuButton.ibxWidget("option", "text", value.displayName);
	}
};
/********************************************************************************
 * IBX PROPERTY UI FOR SLIDER
********************************************************************************/
function ibxSliderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSliderProperty, "slider");
_p.createEditValue = function()
{
	var prop = this.prop;
	var slider = this.slider = $("<div>").ibxHSlider(
	{
		value:prop.value,
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
		minTextPos:"center",
		maxTextPos:"center",
		popupValue:false,
	}).ibxAddClass("pgrid-prop-slider").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editValue = ibxSliderProperty.base.createEditValue.call(this);
	editValue.ibxWidget("add", [sliderValue[0], slider[0]]);
	return editValue;
},
_p._onSliderEvent = function(e, data)
{
	var value = data.value;
	if(this.updatePropertyValue(value))
		this.sliderValue.text(value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR RANGE SLIDER
********************************************************************************/
function ibxRangeSliderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxRangeSliderProperty, "rangeSlider");
_p.createEditValue = function()
{
	var prop = this.prop;
	var slider = this.slider = $("<div>").ibxHRange(
	{
		value:prop.value.low,
		value2:prop.value.high,
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
		minTextPos:"center",
		maxTextPos:"center",
		popupValue:false,
	}).ibxAddClass("pgrid-prop-slider").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var sliderValue2 = this.sliderValue2 = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editValue = ibxRangeSliderProperty.base.createEditValue.call(this);
	editValue.ibxWidget("add", [sliderValue[0], slider[0], sliderValue2[0]]);
	return editValue;
},
_p._onSliderEvent = function(e, data)
{
	var value = {"low":data.value, "high":data.value2};
	if(this.updatePropertyValue(value))
	{
		this.sliderValue.text(value.low);
		this.sliderValue2.text(value.high);
	}
};
/********************************************************************************
 * IBX PROPERTY UI FOR COLOR PICKER
********************************************************************************/
function ibxColorPickerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
	this.displayValue = this.editValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxColorPickerProperty, "colorPicker");
_p._popup = null;
_p.createEditValue = function()
{
	var displaySwatch = this.displaySwatch = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-swatch").css("backgroundColor", this.prop.value);
	displaySwatch.on("click", this._onSwatchClick.bind(this));
	var displayLabel = this.displayLabel = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-value").text(this.prop.displayValue);

	var colorPicker = this.colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", this._onColorChange.bind(this));
	var popup = this.popup = $("<div class='pgrid-color-picker-popup'>");
	popup.ibxPopup({destroyOnClose:false, position:{my:"left top", at:"left bottom", of:displaySwatch}}).append(colorPicker);
	popup.on("ibx_close", this._onPopupClose.bind(this));

	var editValue = ibxColorPickerProperty.base.createEditValue.call(this);
	editValue.ibxWidget("add", [displaySwatch[0], displayLabel[0]]);
	return editValue;
};
_p._onTriggerEvent = function(e)
{
	if(!this.popup.is(e.relatedTarget))
		ibxColorPickerProperty.base._onTriggerEvent.call(this, e);
};
_p._onSwatchClick = function(e)
{
	this.colorPicker.ibxColorPicker("option", "color", this.prop.value);
	this.popup.ibxWidget("open");
};
_p._onColorChange = function(e, data)
{
	if(this.updatePropertyValue(data.text))
	{
		this.displaySwatch.css("backgroundColor", this.prop.value);
		this.displayLabel.text(this.prop.value);
	}
};
_p._onPopupClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this._valueCell.focus();
};
