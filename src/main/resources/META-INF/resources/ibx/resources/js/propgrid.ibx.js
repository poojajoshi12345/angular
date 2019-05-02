/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		selType:"none",
		colMap:[{title:"Property", size:"15em", justify:"start"}, {title:"Value", size:"flex", justify:"start"}],
		showRowHeaders:false,
		indentColumn:0,
		props:null,
		aria:
		{
			label:"Property Grid"	
		}
	},
	_widgetClass:"ibx-property-grid",
	_create:function()
	{
		this._super();
		this.element.data("ibiIbxDataGrid", this);
		this._sm.option({focusResetOnBlur:true, rubberBand:false, rubberBandPartialSelect:false});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.label = ibx.resourceMgr.getString("IBX_PGRID_LABEL");
		return aria;
	},
	_buildPropTree:function(props, allRows)
	{
		var rows = [];
		for(var i = 0; props && i < props.length; ++i)
		{
			var prop = props[i];
			var row = $("<div>").ibxDataGridRow().ibxAddClass("pgrid-row").data("ibxProp", prop);
			var ui = this._createUI(prop);
			row.append([ui.nameCell, ui.editorCell]);
			rows.push(row);
			allRows.push(row);

			var children = this._buildPropTree(prop.props, allRows);
			row.ibxDataGridRow("addRow", children).ibxDataGridRow({"expanded":prop.expanded});
		}
		return rows;
	},
	_createUI:function(prop)
	{
		var ui = null;
		var event = this.element.dispatchEvent("ibx_propcreate", prop, false, true);	
		if(!event.isDefaultPrevented())
		{
			var uiType = $.ibi.ibxPropertyGrid.uiTypes[prop.uiType] || ibxTextProperty;
			ui = new uiType(prop, this.element);
			this.element.dispatchEvent("ibx_propcreated", prop, false, false);	
		}
		else
			ui = event.data.ui;
		return ui;
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "props")
		{
			this.removeRow();
			var allRows = [];
			this._buildPropTree(value, allRows);
			this.addRows(allRows);
			this.updateHeaders();
			this.refresh();
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
	prop.ui = this;
	this.prop = prop;
	this.grid = grid;
	this.createUI();
	this.update();
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
	this.nameCell.attr("tabindex", 0).data("ibxProp", prop);

	this.editorCell = this.__createEditorCell().ibxAddClass(["pgrid-cell", "pgrid-editor-cell"]);
	this.editorCell.attr("tabindex", 0).data("ibxProp", prop);

	this.editor = this._createEditor().ibxAddClass("pgrid-editor").attr("tabindex", -1).data("ibxProp", prop);
	this.editor.on("keydown", this._onEditorKeyEvent.bind(this));
	this.editorCell.append(this.editor);
};
_p._createNameCell = function()
{
	return $("<div>").ibxLabel();
};
_p.__createEditorCell = function()
{
	//by default focus the actual editor when cell get's focus.
	return $("<div>").ibxHBox({focusDefault:true, align:"center"}).on("keydown keyup", this._onEditorCellKeyEvent.bind(this));
};
_p._createEditor = function()
{
	return $("<div>").ibxHBox({align:"center", nameRoot:true}).ibxAddClass("pgrid-prop");
};
_p._onEditorCellKeyEvent = function(e)
{
	if(e.type == "keyup" && e.keyCode == $.ui.keyCode.ENTER)
		this.editor.focus();
	else
	if(e.type == "keydown" && e.keyCode == $.ui.keyCode.ESCAPE)
		this.editorCell.focus();
};
_p._onEditorKeyEvent = function(e)
{
	if(e.type == "keydown" && e.keyCode != $.ui.keyCode.ESCAPE)
		e.stopPropagation();
}
_p._updateValue = function(newValue)
{
	var event = this.grid.dispatchEvent("ibx_propbeforeupdate", {"prop":this.prop, "newValue":newValue}, false, true);
	if(!event.isDefaultPrevented())
	{
		this.prop.value = event.data.newValue;
		this.grid.dispatchEvent("ibx_propupdated", {"prop":this.prop, "newValue":this.prop.value}, false, true);
	}
	else
		this.update();
	return this.prop.value;
};
_p.update = function()
{
	var prop = this.prop;
	this.nameCell.ibxWidget({text:this.prop.displayName}).prop("title", prop.nameTip);
	this.editorCell.prop("title", prop.valueTip || prop.value);
	this.editorCell.ibxWidget("option", "disabled", (prop.enabled === false) || false);
	this.editorCell.ibxWidget("option", "aria.label", ibx.resourceMgr.getString("IBX_PGRID_EDIT_CELL_LABEL") + (prop.valueTip || prop.nameTip));
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
	return editor.ibxAddClass("pgrid-prop-label");
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
	return $("<div>").ibxEditable({editOnFocus:true}).on("focus blur ibx_canceledit ibx_changed ibx_textchanging", this._onEditEvent.bind(this)).ibxAddClass("pgrid-prop-text");
};
_p._onEditEvent = function(e)
{
	var eType = e.type;
	if(eType == "ibx_textchanging")
	{
		var newValue = e.originalEvent.data.newValue;
		this._updateValue(newValue);
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
	return $("<div>").ibxButton({align:"center"}).on("click", this._onButtonEvent.bind(this)).ibxAddClass("pgrid-prop-button");
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
	return $("<div>").ibxCheckBoxSimple().on("ibx_change", this._onCheckEvent.bind(this)).ibxAddClass("pgrid-prop-checkbox");
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
	return $("<div>").ibxSwitch().on("ibx_change", this._onCheckEvent.bind(this)).ibxAddClass("pgrid-prop-switch");
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
	return $("<div>").ibxRadioGroup({wrap:false}).on("ibx_change", this._onChangeEvent.bind(this)).ibxAddClass("pgrid-prop-radiogroup");
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
		var btn = $("<div class='pgrid-prop-radio-button' tabindex='-1'>").ibxRadioButtonSimple({text:val.displayValue, userValue:val.value});
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
	var editor = $("<div>").ibxSelect({multiSelect:prop.multiSelect}).on("ibx_change", this._onSelectEvent.bind(this));
	var openBtn = editor.find(".ibx-select-open-btn");
	openBtn.ibxWidget("option", "iconPosition", "top");
	return editor.ibxAddClass("pgrid-prop-select");
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
	var editor = $("<div>").ibxMenuButton({showArrow:true}).on("ibx_select", this._onMenuSelect.bind(this));
	this.menu = editor.ibxWidget("option", "menu");
	return editor.ibxAddClass("pgrid-prop-select-menu");
};
_p._onMenuSelect = function(e)
{
	var prop = this.prop;
	var menuItem = $(e.originalEvent.data);
	var value = menuItem.ibxWidget("userValue");
	this._updateValue(value);
};
_p.update = function()
{
	ibxMenuProperty.base.update.call(this);
	var prop = this.prop;
	var menu = this.menu.ibxWidget("remove");
	for(var i = 0; i < prop.values.length; ++i)
	{
		var propValue = prop.values[i];
		var menuItem = $("<div>").ibxMenuItem({labelOptions:{text:propValue.displayValue}, userValue:propValue.value});
		menu.ibxWidget("add", menuItem);
	}
	this.editor.ibxWidget("option", "text", prop.displayValue);
};
/********************************************************************************
 * IBX PROPERTY UI FOR SELECT MENU BUTTON
********************************************************************************/
function ibxSelectMenuProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxSelectMenuProperty, "selectmenu");
_p.__createEditorCell = function()
{
	var editorCell = ibxSelectMenuProperty.base.__createEditorCell.call(this);
	return editorCell;
};
_p._createEditor = function()
{
	var editor = $("<div>").ibxSelectMenuButton().on("ibx_selchange", this._onMenuChange.bind(this));
	this.menu = editor.ibxWidget("option", "menu");
	return editor.ibxAddClass("pgrid-prop-select-menu");
};
_p._onMenuChange = function(e)
{
	var prop = this.prop;
	var value = e.originalEvent.data;
	if(prop.multiSelect)
		this._updateValue(value);
	else
	if(value.selected)
		this._updateValue(value);
};
_p.update = function()
{
	ibxSelectMenuProperty.base.update.call(this);
	var prop = this.prop;
	var menu = this.menu.ibxWidget("remove");
	for(var i = 0; i < prop.values.length; ++i)
	{
		var propValue = prop.values[i];
		var menuItem = $("<div>").ibxSelectMenuItem({text:propValue.displayValue, userValue:propValue.value});
		menu.ibxWidget("add", menuItem);
	}
	this.editor.ibxWidget("option", {defaultText:prop.displayValue, multiSelect:prop.multiSelect, userValue:prop.value});
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
	var slider = this.slider = $("<div tabindex='-1'>").ibxHSlider().ibxAddClass("pgrid-prop-slider-ctrl").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editor = ibxSliderProperty.base._createEditor.call(this);
	editor.ibxWidget("option", {focusDefault:true}).ibxWidget("add", [sliderValue[0], slider[0]]);
	return editor.ibxAddClass("pgrid-prop-slider");
};
_p._onSliderEvent = function(e, data)
{
	var value = data.value;
	this._updateValue(value);
	this.sliderValue.text(this.prop.value);
};
_p.update = function()
{
	ibxSliderProperty.base.update.call(this);

	var prop = this.prop;
	this.slider.ibxWidget("option",
	{
		min:prop.valueMin,
		max:prop.valueMax,
		step:prop.step,
		value:prop.value, //must be set after min/max/step, or spinner will always round value to whole number.
		minTextPos:"center",
		maxTextPos:"center",
		popupValue:false,
	});
	this.sliderValue.text(prop.value);
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
	var slider = this.slider = $("<div tabindex='-1'>").ibxHRange().ibxAddClass("pgrid-prop-slider-ctrl").on("ibx_change", this._onSliderEvent.bind(this));
	var sliderValue = this.sliderValue = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var sliderValue2 = this.sliderValue2 = $("<div>").ibxHBox({align:"center", justify:"center"}).ibxAddClass("pgrid-prop-slider-value");
	var editor = ibxRangeSliderProperty.base._createEditor.call(this);
	editor.ibxWidget("option", {focusDefault:true}).ibxWidget("add", [sliderValue[0], slider[0], sliderValue2[0]]);
	return editor.ibxAddClass("pgrid-prop-slider");
};
_p._onSliderEvent = function(e, data)
{
	var value = {"low":data.value, "high":data.value2};
	this._updateValue(value);
	this.sliderValue.text(value.low);
	this.sliderValue2.text(value.high);
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
	return $("<div>").ibxSpinner().on("ibx_change", this._onSpinnerEvent.bind(this)).ibxAddClass("pgrid-prop-spinner");
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
		value:prop.value || 0,
		min:prop.valueMin || 0,
		max:prop.valueMax || 100,
		step:prop.step || 1,
	});
};
/********************************************************************************
 * IBX PROPERTY UI FOR DATE
********************************************************************************/
function ibxDateProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxDateProperty, "date");
_p._createEditor = function()
{
	var prop = this.prop;
	this.datePicker = $("<div>").ibxDatePicker({type:"inline"}).on("ibx_change", this._onDateChange.bind(this));
	var editor = $("<div>").ibxMenuButton({showArrow:true});
	editor.ibxWidget("add", this.datePicker);
	return editor.ibxAddClass("pgrid-prop-date");
};
_p._onDateChange = function(e, data)
{
	this._updateValue(data.date);
	this.update();
};
_p.update = function()
{
	var prop = this.prop;
	ibxProperty.prototype.update.call(this);

	var fmt = prop.format || "mm/dd/yy";
	this.datePicker.ibxWidget("option", {date:prop.value, dateFormat:fmt});
	this.editor.ibxWidget("option", "text", prop.value);
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
	var colorPicker = this.colorPicker = $("<div tabindex='0'>").ibxColorPicker({setOpacity:false}).on("ibx_colorchange", this._onColorChange.bind(this));
	var menu = this.menu = $("<div class='pgrid-color-picker-menu'>").ibxMenu().ibxWidget("add", colorPicker);
	menu.on("ibx_close", this._onMenuClose.bind(this)).on("ibx_beforeopen", this._onBeforeMenuOpen.bind(this));
	var editor = $("<div>").ibxMenuButton({"menu":menu, "glyphClasses":"pgrid-color-picker-swatch"});
	var swatch = this.swatch = editor.find(".ibx-label-glyph");
	return editor.ibxAddClass("pgrid-prop-color-picker");
};
_p._onBeforeMenuOpen = function(e)
{
	var prop = this.prop;
	this.colorPicker.ibxWidget("option", {"color":prop.value.color, "opacity": prop.value.opacity ? prop.value.opacity : 1, "setOpacity": prop.value.opacity});
};
_p._onColorChange = function(e)
{
	var data = e.originalEvent.data;
	var prop = this.prop;
	prop.value.color = data.color;
	prop.value.opacity = data.opacity;
	this._updateValue(prop.value)
	this.editor.ibxWidget({text:prop.value.color});
	this.swatch.css({"backgroundColor": prop.value.color, "opacity": prop.value.opacity || 1});
};
_p._onMenuClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this.editor.focus();
};
_p.update = function()
{
	ibxColorPickerProperty.base.update.call(this);
	var prop = this.prop;
	this.editor.ibxWidget("option", "text", prop.value.color).attr("title", ibx.resourceMgr.getString("IBX_PGRID_COLOR_PICKER_LABEL") + prop.value.color);
	this.swatch.css({"backgroundColor": prop.value.color, "opacity": prop.value.opacity || 1});
	var prop = this.prop;
};
/********************************************************************************
 * IBX PROPERTY UI FOR BORDER
********************************************************************************/
function ibxBorderProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxBorderProperty, "border");
_p._createEditor = function()
{
	var editor = ibxBorderProperty.base._createEditor.call(this);
	editor.ibxWidget("option", "focusDefault", true);

	var ctrls = ibx.resourceMgr.getResource(".pgrid-prop-border-editor-template", false).children();
	editor.ibxWidget("add", ctrls);
	ibx.bindElements(editor);

	var widget = editor.data("ibxWidget");
	this.spinnerWidth = widget.spinnerWidth.on("ibx_change", this._onWidthChange.bind(this));
	this.btnStyle = widget.btnStyle.on("ibx_uservaluechanged", this._onStyleChange.bind(this));
	this.btnColor = widget.btnColor;
	this.swatch = this.btnColor.find(".ibx-label-glyph");
	this.colorMenu = widget.colorMenu;
	this.colorMenu.on("ibx_close", this._onMenuClose.bind(this)).on("ibx_beforeopen", this._onBeforeMenuOpen.bind(this));
	this.colorPicker = widget.colorPicker.on("ibx_colorchange", this._onColorChange.bind(this));
	return editor.ibxAddClass("pgrid-prop-border");
};
_p._onWidthChange = function(e, data)
{
	this.prop.value.width = data.value + "px";
	this._updateValue(this.prop.value);
	this.update();
};
_p._onStyleChange = function(e)
{
	var value = e.originalEvent.data;
	this.prop.value.style = value;
	this._updateValue(this.prop.value);
	this.update();
},
_p._onBeforeMenuOpen = function(e)
{
	var cInfo = this.prop.value.color;
	this.colorPicker.ibxWidget("option", {"color":cInfo.color, "opacity": cInfo.opacity ? cInfo.opacity : 1, "setOpacity": cInfo.opacity});
};
_p._onColorChange = function(e)
{
	var data = e.originalEvent.data;
	var cInfo = this.prop.value.color;
	cInfo.color = data.color;
	cInfo.color.opacity = data.opacity;
	this._updateValue(this.prop.value)
	this.update();
	this.editor.ibxWidget({text:cInfo.color});
	this.swatch.css({"backgroundColor": cInfo.color, "opacity": cInfo.opacity || 1});
};
_p._onMenuClose = function(e)
{
	//this makes sure when user clicks outside of popup this properly loses focus (stopEditing).
	this.editor.focus();
};

_p.update = function()
{
	var prop = this.prop;
	var cInfo = prop.value.color;
	this.spinnerWidth.ibxWidget("option", {value:parseInt(prop.value.width, 10)});
	this.btnStyle.ibxWidget("userValue", prop.value.style).css({borderStyle:prop.value.style, borderColor:cInfo.color, borderWidth:"2px"});

	this.swatch.css({"backgroundColor": cInfo.color, "opacity": cInfo.opacity || 1});
	this.btnColor.ibxWidget("option", {text:cInfo.color});
	this.btnColor.attr("title", ibx.resourceMgr.getString("IBX_PGRID_COLOR_PICKER_LABEL") + cInfo.color);
	ibxBorderProperty.base.update.call(this);
};
