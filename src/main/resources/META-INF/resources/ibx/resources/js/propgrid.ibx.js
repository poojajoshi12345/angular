/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		colMap:[{title:"Property", size:"15em", justify:"start"}, {title:"Value", size:"flex", justify:"start"}],
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
			row.append([ui.nameCell, ui.editorCell]);

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
			this.updateHeaders();
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
	this.update();
	prop.ui = this;
}
var _p = ibxProperty.prototype = new Object();
_p.prop = null;
_p.grid = null;
_p.nameCell = null;
_p.editorCell = null;
_p.editor = null;
_p.displayValue = null;
_p.isEditing = function(){return this._valueCell.is(".pgrid-prop-editing");};
_p.createUI = function()
{
	var prop = this.prop;
	this.nameCell = this._createNameCell().ibxAddClass(["pgrid-cell","pgrid-name-cell"]);
	this.nameCell.attr("tabindex", 0).data("ibxProp", prop).data("ibxProp", prop);

	this.editorCell = this.__createEditorCell().ibxAddClass(["pgrid-cell", "pgrid-editor-cell"]);
	this.editorCell.attr("tabindex", 0).data("ibxProp", prop).data("ibxProp", prop);

	this.editor = this._createEditor().attr("tabindex", 0).data("ibxProp", prop).css("flex", "0 0 auto");
	this.editorCell.append(this.editor);
};
_p._createNameCell = function()
{
	return $("<div>").ibxLabel();
};
_p.__createEditorCell = function()
{
	return $("<div>").ibxHBox({focusDefault:true, align:"center"});
};
_p._createEditor = function()
{
	return $("<div>").ibxHBox({align:"center"});
};
_p._updateValue = function(newValue)
{
	var event = this.grid.dispatchEvent("ibx_prop_beforeupdate", {"prop":this.prop, "newValue":newValue}, false, true);
	if(!event.isDefaultPrevented())
	{
		this.prop.value = newValue;
		this.grid.dispatchEvent("ibx_prop_updated", {"prop":this.prop, "newValue":this.prop.value}, false, true);
	}
	return !event.isDefaultPrevented();
};
_p.update = function()
{
	var prop = this.prop;
	this.nameCell.ibxWidget({text:this.prop.displayName}).prop("title", prop.nameTip);
	this.editorCell.prop("title", prop.valueTip);
	this.editorCell.ibxWidget("option", "disabled", (prop.enabled === false) || false)
};
/********************************************************************************
 * IBX PROPERTY UI FOR BASIC LABEL/GROUPING/SEPARATING
********************************************************************************/
function ibxLabelProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxLabelProperty, "label");
_p._createEditor = function()
{
	var prop = this.prop;
	var editor = ibxLabelProperty.base._createEditor.call(this);
	editor.text(prop.value);
	return editor;
};
_p.update = function()
{
	ibxLabelProperty.base.update.call(this);
	this.editor.attr("tabindex", "");
};
/********************************************************************************
 * IBX PROPERTY UI FOR BASIC TEXT ENTRY
********************************************************************************/
function ibxTextProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxTextProperty, "text");
_p._createEditor = function()
{
	return $("<div>").ibxEditable({editOnFocus:true}).ibxAddClass("pgrid-prop-text").on("focus blur ibx_canceledit ibx_changed ibx_textchanging", this._onEditEvent.bind(this));
};
_p._onEditEvent = function(e)
{
	var eType = e.type;
	if(eType == "ibx_textchanging")
	{
		var newValue = e.originalEvent.data.newValue;
		var updated = this._updateValue(newValue);
		if(!updated)
			this.update();
	}
	else
	if(eType == "ibx_canceledit")
	{
		this.prop.value = e.originalEvent.data;
		this.update();
	}
};
_p.update = function()
{
	var prop = this.prop;
	ibxTextProperty.base.update.call(this);
	this.editor.text(prop.value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR BUTTON
********************************************************************************/
function ibxButtonProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxButtonProperty, "button");
_p._createEditor = function()
{
	return $("<div>").ibxButton({align:"center"}).ibxAddClass("pgrid-prop-button").on("click", this._onButtonEvent.bind(this));
};
_p._onButtonEvent = function(e)
{
	this._updateValue(this.prop.value);
};
_p.update = function()
{
	var prop = this.prop;
	ibxButtonProperty.base.update.call(this);
	return this.editor.ibxWidget("option", {text:this.prop.displayValue});
};
/********************************************************************************
 * IBX PROPERTY UI FOR CHECK BUTTON
********************************************************************************/
function ibxCheckBoxProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxCheckBoxProperty, "checkbox");
_p._createEditor = function()
{
	return $("<div>").ibxCheckBoxSimple().ibxAddClass("pgrid-prop-checkbox").on("ibx_change", this._onCheckEvent.bind(this));
};
_p._onCheckEvent = function(e)
{
	var checked = $(e.target).ibxWidget("option", "checked");
	this._updateValue(checked);
};
_p.update = function()
{
	var prop = this.prop;
	ibxCheckBoxProperty.base.update.call(this);
	return this.editor.ibxWidget("option", {text:this.prop.displayValue, checked:this.prop.value});
};
/********************************************************************************
 * IBX PROPERTY UI FOR SWITCH
********************************************************************************/
function ibxSwitchProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxCheckBoxProperty, ibxSwitchProperty, "switch");
_p._createEditor = function()
{
	return $("<div>").ibxSwitch().ibxAddClass("pgrid-prop-switch").on("ibx_change", this._onCheckEvent.bind(this));
};
_p.update = function()
{
	var prop = this.prop;
	ibxSwitchProperty.base.update.call(this);
	this.editor.ibxWidget("option", {text:this.prop.displayValue, checked:this.prop.value});
};
/********************************************************************************
 * IBX PROPERTY UI FOR RADIO GROUP
********************************************************************************/
function ibxRadioGroupProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxRadioGroupProperty, "radiogroup");
_p._createEditor = function()
{
	return $("<div>").ibxRadioGroup({navKeyRoot:true, wrap:false}).ibxAddClass("pgrid-prop-radiogroup").on("ibx_change", this._onChangeEvent.bind(this));;
};
_p._onChangeEvent = function(e)
{
	//will get a lot of ibx_change events from the child radio buttons...th displayValue represents the actual button group.
	if(this.editor.is(e.target))
	{
		var value = this.editor.ibxWidget("userValue");
		this._updateValue(value);
	}
};
_p.update = function()
{
	ibxRadioGroupProperty.base.update.call(this);

	var prop = this.prop;
	var editor = this.editor;
	var grpName = editor.ibxWidget("option", "name");
	var vals = prop.values;

	editor.ibxWidget("remove").ibxWidget("userValue", prop.value);
	for(var i = 0; i < vals.length; ++i)
	{
		var val = vals[i];
		var btn = $("<div class='pgrid-prop-radio-button' tabindex='0'>").ibxRadioButtonSimple({text:val.displayValue, userValue:val.value});
		editor.ibxWidget("add", btn);
	}
};
/********************************************************************************
 * IBX PROPERTY UI FOR SELECT PICKER
********************************************************************************/
function ibxSelectProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSelectProperty, "select");
_p._createEditor = function()
{
	var prop = this.prop;
	var editor = $("<div>").ibxSelect({multiSelect:prop.multiSelect}).ibxAddClass("pgrid-prop-select").on("ibx_change", this._onSelectEvent.bind(this));
	var openBtn = editor.find(".ibx-select-open-btn");
	openBtn.ibxWidget("option", "iconPosition", "top");
	return editor;
};
_p._onSelectEvent = function(e)
{
	var value = $(e.target).ibxWidget("userValue");
	this._updateValue(value);
};
_p.update = function()
{
	ibxSelectProperty.base.update.call(this);

	var prop = this.prop;
	var value = prop.value;//need to save because adding items resets the userValue?
	var editor = this.editor;
	editor.ibxWidget("removeControlItem");
	var vals = prop.values;
	for(var i = 0; i < vals.length; ++i)
	{
		var val = vals[i];
		var selItem = null;
		if(prop.multiSelect)
			selItem = $("<div>").ibxSelectCheckItem({text:val.displayValue, userValue:val.value});
		else
			selItem = $("<div>").ibxSelectItem({text:val.displayValue, userValue:val.value});
		editor.ibxWidget("addControlItem", selItem);
	}
	editor.ibxWidget("userValue", value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR MENU BUTTON
********************************************************************************/
function ibxMenuProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxMenuProperty, "menu");
_p._createEditor = function()
{
	var menu = this.menu = $("<div>").ibxMenu().on("ibx_select", this._onMenuEvent.bind(this));
	this.menuButton = $("<div tabindex='0'>").ibxMenuButton({"showArrow":true, "menu":menu}).ibxAddClass("pgrid-prop-menu");
	return this.menuButton;
};
_p._onMenuEvent = function(e, data)
{
	var prop = this.prop;
	var menuItem = $(data);
	var propVal = menuItem.ibxWidget("option", "userValue");
	var value = propVal.value
	var displayVal = propVal.displayValue;

	if(prop.multiSelect)
	{
		displayVal = [];
		value = []
		var menuItems = this.menu.ibxWidget("children", ".checked");
		for(var i = 0; i < menuItems.length; ++i)
		{
			let propVal = $(menuItems[i]).ibxWidget("option", "userValue");
			displayVal.push(propVal.displayValue);
			value.push(propVal.value);
		}
		displayVal = displayVal.join(" ,");
	}

	if(this._updateValue(value))
	{
		this.menuButton.ibxWidget("option", "text", displayVal || prop.displayValue);
		this.editorCell.prop("title", prop.valueTip || displayVal);
	}
};
_p.update = function()
{
	ibxMenuProperty.base.update.call(this);

	var prop = this.prop;
	var selValue = prop.value;
	var menu = this.menu.ibxWidget("remove");
	for(var i = 0; i < prop.values.length; ++i)
	{
		var value = prop.values[i];
		var menuItem = $("<div>");
		prop.multiSelect ? menuItem.ibxCheckMenuItem() : menuItem.ibxMenuItem();
		menuItem.ibxWidget("option", {labelOptions:{text:value.displayValue}, userValue:value});
		
		if(prop.multiSelect && -1 != prop.value.indexOf(value.value))
			menuItem.ibxWidget("option", "checked", true);
		
		menu.ibxWidget("add", menuItem);
		if(value.value == prop.value)
			selValue = value.displayValue;
	}
	menu.ibxWidget("option", {text:selValue, multiSelect:prop.multiSelect});
	this.menuButton.ibxWidget("option", {text:selValue || prop.displayValue});
};
/********************************************************************************
 * IBX PROPERTY UI FOR SLIDER
********************************************************************************/
function ibxSliderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSliderProperty, "slider");
_p._createEditor = function()
{
	var prop = this.prop;
	var slider = this.slider = $("<div>").ibxHSlider().ibxAddClass("pgrid-prop-slider-ctrl").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editor = ibxSliderProperty.base._createEditor.call(this);
	editor.ibxAddClass("pgrid-prop-slider").ibxWidget("add", [sliderValue[0], slider[0]]);
	return editor;
};
_p._onSliderEvent = function(e, data)
{
	var value = data.value;
	if(this._updateValue(value))
		this.sliderValue.text(value);
};
_p.update = function()
{
	ibxSliderProperty.base.update.call(this);

	var prop = this.prop;
	this.slider.ibxWidget("option",
	{
		value:prop.value,
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
		minTextPos:"center",
		maxTextPos:"center",
		popupValue:false,
	});
	this.sliderValue.text(prop.value)
};
/********************************************************************************
 * IBX PROPERTY UI FOR RANGE SLIDER
********************************************************************************/
function ibxRangeSliderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxRangeSliderProperty, "rangeslider");
_p._createEditor = function()
{
	var prop = this.prop;
	var slider = this.slider = $("<div>").ibxHRange().ibxAddClass("pgrid-prop-slider-ctrl").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var sliderValue2 = this.sliderValue2 = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editor = ibxRangeSliderProperty.base._createEditor.call(this);
	editor.ibxAddClass("pgrid-prop-slider").ibxWidget("add", [sliderValue[0], slider[0], sliderValue2[0]]);
	return editor;
};
_p._onSliderEvent = function(e, data)
{
	var value = {"low":data.value, "high":data.value2};
	if(this._updateValue(value))
	{
		this.sliderValue.text(value.low);
		this.sliderValue2.text(value.high);
	}
};
_p.update = function()
{
	ibxSliderProperty.base.update.call(this);

	var prop = this.prop;
	this.slider.ibxWidget("option",
	{
		value:prop.value.low,
		value2:prop.value.high,
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
		minTextPos:"center",
		maxTextPos:"center",
		popupValue:false,
	});
	this.sliderValue.text(prop.value.low);
	this.sliderValue2.text(prop.value.high);
};
/********************************************************************************
 * IBX PROPERTY UI FOR SPINNER
********************************************************************************/
function ibxSpinnerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSpinnerProperty, "spinner");
_p._createEditor = function()
{
	return $("<div>").ibxSpinner().ibxAddClass("pgrid-prop-spinner").on("ibx_change", this._onSpinnerEvent.bind(this));
};
_p._onSpinnerEvent = function(e, data)
{
	var value = data.value;
	this._updateValue(value);
};
_p.update = function()
{
	ibxSliderProperty.base.update.call(this);

	var prop = this.prop;
	this.editor.ibxWidget("option",
	{
		value:prop.value,
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
	});
};
/********************************************************************************
 * IBX PROPERTY UI FOR COLOR PICKER
********************************************************************************/
function ibxColorPickerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxColorPickerProperty, "colorpicker");
_p._popup = null;
_p._createEditor = function()
{
	this.editSwatch = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-swatch").on("click", this._onSwatchClick.bind(this));
	this.editLabel = $("<span tabindex='0'>").ibxAddClass("pgrid-color-picker-value");

	var colorPicker = this.colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", this._onColorChange.bind(this));
	var popup = this.popup = $("<div class='pgrid-color-picker-popup'>");
	popup.ibxPopup({destroyOnClose:false, position:{my:"left top", at:"left bottom", of:this.editSwatch}}).append(colorPicker);
	popup.on("ibx_close", this._onPopupClose.bind(this));

	var editor = ibxColorPickerProperty.base._createEditor.call(this);
	editor.ibxWidget("add", [this.editSwatch[0], this.editLabel[0]]);
	return editor;
};
_p._onSwatchClick = function(e)
{
	this.colorPicker.ibxColorPicker("option", "color", this.prop.value);
	this.popup.ibxWidget("open");
};
_p._onColorChange = function(e, data)
{
	if(this._updateValue(data.text))
	{
		this.editSwatch.css("backgroundColor", this.prop.value);
		this.editLabel.text(this.prop.value);
	}
};
_p._onPopupClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this.editor.focus();
};
_p.update = function()
{
	ibxColorPickerProperty.base.update.call(this);
	var prop = this.prop;
	this.editSwatch.css("backgroundColor", this.prop.value);
	this.editLabel.text(this.prop.value);
};
/********************************************************************************
 * IBX PROPERTY UI FOR DATE
********************************************************************************/
function ibxDateProperty(prop, grid)
{
	ibxMenuProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxMenuProperty, ibxDateProperty, "date");
_p._createEditor = function()
{
	var prop = this.prop;
	var dp = this.datePicker = $("<div>").ibxDatePicker({type:"inline"}).on("ibx_change", this._onDateChange.bind(this));
	var editor = ibxDateProperty.base._createEditor.call(this);
	this.menu.ibxWidget("add", dp);
	return editor;
};
_p._onDateChange = function(e, data)
{
	this._updateValue(data.date);
	this.editor.ibxWidget("option", {text:data.date});
},
_p.update = function()
{
	var prop = this.prop;
	ibxProperty.prototype.update.call(this);

	var fmt = prop.format || "mm/dd/yy";
	this.datePicker.ibxWidget("option", {date:prop.value, dateFormat:fmt});
	this.editor.ibxWidget("option", {text:prop.value});
};
/********************************************************************************
 * IBX PROPERTY UI FOR BORDER
********************************************************************************/
function ibxCssBorderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxCssBorderProperty, "cssborder");
_p._createEditor = function()
{
	var width = this.width = $("<div>").ibxEditable().ibxAddClass("pgrid-prop-cssborder-width");

	var styleMenu = this.styleMenu = $("<div>").ibxMenu();
	var styleBtn = this.styleBtn = $("<div>").ibxMenuButton({showArrow:true, menu:styleMenu}).ibxAddClass("pgrid-prop-cssborder-style");

	var cp = this.colorPicker = $("<div>").ibxColorPicker({}).ibxAddClass("pgrid-prop-cssborder-color");
	var colorMenu = this.ColorMenu = $("<div>").ibxMenu().ibxWidget("add", cp);
	var colorBtn = this.styleBtn = $("<div>").ibxMenuButton({showArrow:true, menu:colorMenu}).ibxAddClass("pgrid-prop-cssborder-color");
	
	var editor = ibxCssBorderProperty.base._createEditor.call(this);
	editor.ibxWidget("add", [width[0], styleBtn[0], colorBtn[0]]);
	return editor;
};
_p._onDateChange = function(e, data)
{
	this._updateValue(data.date);
	this.editor.ibxWidget("option", {text:data.date});
},
_p.update = function()
{
	var prop = this.prop;
	ibxCssBorderProperty.base.update.call(this);
};
