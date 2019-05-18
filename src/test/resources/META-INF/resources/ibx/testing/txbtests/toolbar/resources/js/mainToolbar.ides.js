$.widget("ibi.ibToolbar", $.ibi.ibxHBox,
{
	options:
	{
		nameRoot:true
	},
	
	_widgetClass: "ibToolbar",	
	_create: function ()
	{
		this._super();
		var markup = ibx.resourceMgr.getResource(".ides-toolbar-main", false).children();
		this.element.append(markup);
		ibx.bindElements(this.element);
		//$(document).ready(function() {			
			//set up UI state
			this._updateUIState();
			//register events 
			this._addEventHandlers();
		//});		
	},
	
	_refresh: function()
	{
		this._super();
	},
	
	_updateUIState: function()
	{		
	},
	
	_addEventHandlers: function()
	{			
		this.idesCmdOpen.on("ibx_triggered", this._tbCommandOpenExecute.bind(this)); 
		this.idesCmdNew.on("ibx_triggered", this._tbCommandNewExecute.bind(this)); 
		this.idesCmdSave.on("ibx_triggered", this._tbCommandSaveExecute.bind(this)); 
		this.idesCmdSaveAs.on("ibx_triggered", this._tbCommandSaveAsExecute.bind(this)); 
		this.idesCmdClose.on("ibx_triggered", this._tbCommandCloseExecute.bind(this)); 
		this.idesCmdUndo.on("ibx_triggered", this._tbCommandUndoExecute.bind(this)); 
		this.idesCmdRedo.on("ibx_triggered", this._tbCommandRedoExecute.bind(this)); 		
	},
	
	//handle events
	_tbCommandOpenExecute: function(e)
	{
		//alert("Ibfs fex browse dialog");
	},
	
	_tbCommandNewExecute: function(e)
	{
		//alert("Ibfs master browse dialog");		
	},
	
	_tbCommandSaveExecute: function(e)
	{
		//alert("Ibfs save dialog");		
		this._isChecked = this._isChecked ? false : true;
		$(".ides_button_save").toggleClass("ides-toolbar-button-checked", this._isChecked);
	},
	
	_tbCommandSaveAsExecute: function(e)
	{
		//alert("Ibfs save dialog");
	},
	
	_tbCommandCloseExecute: function(e)
	{
		//alert("Check if dirty and close");
	},
	
	_tbCommandUndoExecute: function(e)
	{
		//alert("call Undo producer");
	},
	
	_tbCommandRedoExecute: function(e)
	{
		//alert("call redo producer");
	}
});

//# sourceURL=ibToolbar.js