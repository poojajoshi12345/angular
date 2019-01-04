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
		triggerKey:$.ui.keyCode.ENTER,
		triggerEvent:"dblclick",
	},
	_widgetClass:"ibx-property-grid",
	_create:function()
	{
		this._super();
		this.element.data("ibiIbxDataGrid", this);
		this.getSelectionManager().options.type = "nav";
		this._boundEditTrigger = this._onEditTrigger.bind(this);
		this.element.on("keyup", this._boundEditTrigger);
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
		var ui = prop.ui =
		{
			"prop":prop,
			"nameCell":$("<div>").text(prop.displayName).ibxAddClass("pgrid-name-cell").attr("tabindex", 0).data("ibxProp", prop),
			"valueCell":$("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-value-cell").attr("tabindex", 0).data("ibxProp", prop),
			"displayValue":$("<div>").ibxHBox({align:"center"}).text(prop.displayValue).ibxAddClass("pgrid-display-value-cell").attr("tabindex", 0).data("ibxProp", prop),
			"editValue":$("<div>").ibxHBox({align:"center"}).ibxAddClass("pgrid-edit-value-cell").attr("tabindex", 0).data("ibxProp", prop),
			"startEditing":$.noop,
			"stopEditing":$.noop,
		};
		ui.valueCell.append(ui.displayValue);

		var event = this.element.dispatchEvent("ibx_prop_create_ui", ui, false, false);	
		if(!event.isDefaultPrevented())
		{
			var type = (-1 == $.ibi.ibxPropertyGrid.uiTypes.indexOf(prop.uiType)) ? null : prop.uiType;
			if(type == "colorPicker")
			{
				ui.displayValue.empty();
				ui._displaySwatch = $("<span>").ibxAddClass("pgrid-color-picker-display-value").css("backgroundColor", prop.value);
				ui._displayLabel = $("<span>").text(prop.displayValue);
				ui.displayValue.append(ui._displaySwatch).append(ui._displayLabel);
				ui.editValue = ui.displayValue;
				ui.startEditing = function(prop, pGrid)
				{
					var ui = prop.ui
					ui._displaySwatch.on("click", function(pGrid, e)
					{
						var ui = prop.ui;
						if(!ui._popup)
						{
							ui._colorPicker = $("<div>").ibxColorPicker({setOpacity:false}).on("ibx_change", function(pGrid, e, value)
							{
								var prop = this.prop;
								prop.value = value.text;
								this._displaySwatch.css("backgroundColor", prop.value);
								this._displayLabel.text(prop.value);
								pGrid.propertyChanged(prop)
							}.bind(ui, pGrid));

							ui._popup = $("<div class='pgrid-color-picker-popup'>").ibxPopup({position:{my:"left top", at:"left bottom", of:ui._displaySwatch}}).append(ui._colorPicker);
							ui._popup.ibxWidget({"destroyOnClose":false})
						}
						ui._colorPicker.ibxColorPicker("option", "color", prop.value);
						ui._popup.ibxWidget("open");

					}.bind(prop, pGrid));
				};
			}
			else
			{
				ui.startEditing = function(prop, pGrid)
				{
					var ui = prop.ui;
					ui.editValue.text(prop.value);
					ui.editValue.ibxEditable().ibxEditable("startEditing").on("ibx_changed", function(pGrid, e)
					{
						prop.value = e.originalEvent.data;
						prop.displayValue = prop.value;
						this.displayValue.text(prop.value);
						pGrid.stopEditing(this.prop);
					}.bind(ui, pGrid));
				};
			}
		}
		return ui;
	},
	_onEditTrigger:function(e)
	{
		var cell = $(e.target).closest(".dgrid-cell");
		var startEdit = (e.type == "keyup") ?  (e.keyCode == this.options.triggerKey) : cell.is(".pgrid-value-cell");
		if(cell.length && startEdit)
			this.startEditing(cell.data("ibxProp"));

	},
	startEditing:function(prop)
	{
		var event = this.element.dispatchEvent("ibx_start_prop_edit", prop, false, true);
		if(!event.isDefaultPrevented())
		{
			var ui = prop.ui;
			ui.valueCell.ibxAddClass("pgrid-editing-cell");
			ui.displayValue.detach();
			ui.editValue.appendTo(ui.valueCell);
			ui.startEditing(prop, this);
		}
	},
	stopEditing:function(prop)
	{
		var event = this.element.dispatchEvent("ibx_end_prop_edit", prop, false, true);
		if(!event.isDefaultPrevented())
		{
			var ui = prop.ui;
			ui.valueCell.ibxRemoveClass("pgrid-editing-cell");
			ui.editValue.detach();
			ui.displayValue.appendTo(ui.valueCell);
			ui.stopEditing(prop);
		}
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
		else
		if(key == "triggerEvent")
		{
			this.element.off(options.triggerEvent);
			this.element.on(value, this._onEditTrigger.bind(this));
		}			
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
	},
});
$.ibi.ibxPropertyGrid.uiTypes = ["text", "radio", "check", "select", "colorPicker", "borderSelector"];
