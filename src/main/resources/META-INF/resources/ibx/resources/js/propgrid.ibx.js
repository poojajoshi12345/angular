/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROPERTY GRID
******************************************************************************/
$.widget("ibi.ibxPropertyGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		colMap:[{title:"Property", size:"150px", justify:"start"}, {title:"Value", size:"1000px", justify:"start"}],
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
			var row = $("<div>").ibxDataGridRow().ibxAddClass("pgrid-prop-row").data("ibxProp", prop);
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
	$.ibi.ibxPropertyGrid.uiTypes[uiType] = propType;
	return p;
}

function ibxProperty(prop, grid)
{
	Object.call(this);
	if(ibx.inPropCtor) return;

	this.prop = prop;
	this.grid = grid;
	this.nameCell = $("<div>").text(prop.displayName).ibxAddClass("pgrid-name-cell").attr("tabindex", 0).data("ibxProp", prop);
	this.valueCell = $("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-value-cell").attr("tabindex", 0).data("ibxProp", prop);
	this.displayValue = $("<div>").ibxHBox({align:"center"}).text(prop.displayValue).ibxAddClass("pgrid-display-value-cell").attr("tabindex", 0).data("ibxProp", prop);
	this.editValue = $("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-edit-value-cell").attr("tabindex", 0).data("ibxProp", prop);

	this.valueCell.append(this.displayValue);
	this.valueCell.on(this.triggerEvent, this._onTriggerEvent.bind(this));
	this.valueCell.on("keyup", this._onTriggerEvent.bind(this));
	this.valueCell.on("keydown", this._onKeyEvent.bind(this));
	prop.ui = this;
}
var _p = ibxProperty.prototype = new Object();
_p.triggerEvent = "dblclick";
_p.triggerKey = $.ui.keyCode.ENTER;
_p.prop = null;
_p.grid = null;
_p.nameCell = null;
_p.valueCell = null;
_p.displayValue = null;
_p.editValue = null;
_p.isEditing = function(){return this.valueCell.is(".pgrid-prop-editing");};
_p._onTriggerEvent = function(e)
{
	var startEditing = (e.type == "keyup") ? e.keyCode == this._triggerKey : true;
	if(startEditing)
		this.startEditing()
};
_p._onKeyEvent = function(e)
{
	if(e.type == "keydown")
		e.stopPropagation();
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
		this.displayValue.detach();
		this.editValue.appendTo(this.valueCell);
		this._startEditing();
	}
};
_p._startEditing = function()
{
	var prop = this.prop;
	this.valueCell.ibxAddClass("pgrid-prop-editing");
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

function ibxColorPickerProperty(prop, grid)
{
	ibxProperty.call(this, prop, grid);
	if(ibx.inPropCtor) return;

	this.displayValue.empty();
	this._displaySwatch = $("<span>").ibxAddClass("pgrid-color-picker-display-value").css("backgroundColor", this.prop.value);
	this._displayLabel = $("<span>").text(this.prop.displayValue);
	this.displayValue.append(this._displaySwatch).append(this._displayLabel);
	this.editValue = this.displayValue;
}
var _p = $.ibi.ibxPropertyGrid.extendProperty(ibxProperty, ibxColorPickerProperty, "colorPicker");

_p._startEditing = function()
{
	this._displaySwatch.on("click", function(e)
	{
		if(!this._popup)
		{
			this._colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", function(e, value)
			{
				var prop = this.prop;
				prop.value = value.text;
				this._displaySwatch.css("backgroundColor", prop.value);
				this._displayLabel.text(prop.value);
				this.valueChanged();
			}.bind(this));

			this._popup = $("<div class='pgrid-color-picker-popup'>").ibxPopup({position:{my:"left top", at:"left bottom", of:this._displaySwatch}}).append(this._colorPicker);
			this._popup.ibxWidget({"destroyOnClose":false})
		}
		this._colorPicker.ibxColorPicker("option", "color", this.prop.value);
		this._popup.ibxWidget("open");

	}.bind(this));
};
