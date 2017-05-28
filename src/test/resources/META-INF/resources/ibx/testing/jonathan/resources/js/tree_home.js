/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
//////////////////////////////////////////////////////////////////////////

function IbfsItem(item, ibfs, padding)
{
	this._padding = padding;
	this._item = item;
	this._ibfs = ibfs;
	this._element = $("<div>").ibxVBox({ align: "stretch", justifiy: "start" });
	this._glyph = "";
	this._glyphSel = "";
	this._glyphClasses = "";
	this._glyphClassesSel = "";

	if (item.container)
	{
		this._glyphClasses = "ibx-icons ibx-glyph-plus-small";
		this._glyphClassesSel = "ibx-icons ibx-glyph-minus-small";
	}
	else
	{
		if(item.clientInfo.typeInfo)
		{	
			this._glyphClasses = item.clientInfo.typeInfo.glyphClasses ? item.clientInfo.typeInfo.glyphClasses : "ibx-icons ibx-glyph-file-unknown";
		}
		else
			this._glyphClasses = "ibx-icons ibx-glyph-file-unknown";	

	}
	this._label = $("<div class='ibfs-label' style='padding-left:" + this._padding + "px;'>").ibxLabel({ glyph: this._glyph, glyphClasses: this._glyphClasses, wrap: false, justify: "start", text: item.description }).addClass("ibfs-item").addClass(item.container ? "ibfs_folder" : "ibfs_file");
	this._element.append(this._label); //dom element bound to widget.

	/*
	if (item.container)
	  this._element.ibxWidget('option', 'ctxMenu' , ibxResourceMgr.getResource('.ibfs-folder-ctx-menu'));
	*/

	this._label.on("click", this._onClick.bind(this)); //dom click event bound to this.
	this._label.on("dblclick", this._onDblClick.bind(this)); //dom click event bound to this.
	this._label.ibxDraggable(
		{
			centerCursor: true,
			helper: function ()
			{
				return this._label.clone().removeAttr("id");
			}.bind(this),
			start: function (event, ui)
			{
				ui.helper.data('type', 'tree');
				ui.helper.data('item', JSON.stringify(this._item));				
			}.bind(this)
		}
	);

	this._widget = this._element.ibxWidget("instance"); //actual jQueryUI widget instance.  Can call functions directly on this.

	//container for children
	if (item.container)
		this._children = $("<div class='ibfs-children'>").ibxVBox({ align: "stretch", justifiy: "start" }).appendTo(this._element);
}


IbfsItem.folderPadding = 10;
IbfsItem.filePadding = 30;

_p = IbfsItem.prototype = new Object();
_p.getElement = function () { return this._element; };
_p.getWidget = function () { return this._widget; };
_p._onClick = function (e)
{
	if (!this._item.container)
	{
		$(document).trigger( "treedoubleclick", this._item );
	}
	else 
	{	
		this.toggle();
		$(document).trigger( "clearitems", this._item );
		
	}	
	e.stopPropagation();
};

_p._refresh = function(fullPath)
{
		this._ibfs.listItems(fullPath, null, null, { asJSON: true, clientSort: false }).done(function (exInfo)
			{
				$.each(exInfo.result, function (idx, item)
				{
					var ibfsItem = new IbfsItem(item, this._ibfs, this._padding + (item.container ? IbfsItem.folderPadding : IbfsItem.filePadding));
					if(item.container)
					{	
						//this._children.append(ibfsItem.getElement());
						$(document).trigger( "addafolderitem", item );
					}	
					else
					{							
						$(document).trigger( "addanitem", item );
					}	
				});
				$(document).trigger("doneadding");
			});	
		
};
_p._onDblClick = function (e)
{	
	if (!this._item.container)
	{
		$(document).trigger( "treedoubleclick", this._item );
	}	
	e.stopPropagation();
};
_p._expanded = false;

	

_p.toggle = function () { this.expand(!this._expanded); };
_p.expand = function (expand)
{
	if (this._item.container)
	{
		this._expanded = expand;
		var glyph = "folder";

		this._children.empty();
		if (this._expanded)
		{
			if (this._glyphClassesSel)
				this._label.data('ibiIbxLabel')._setOption('glyphClasses', this._glyphClassesSel);
			this._label.addClass('fld-open');
			glyph = "folder_open";
			this._ibfs.listItems(this._item.fullPath, null, null, { asJSON: true, clientSort: false }).done(function (exInfo)
			{
				$.each(exInfo.result, function (idx, item)
				{
					var ibfsItem = new IbfsItem(item, this._ibfs, this._padding + (item.container ? IbfsItem.folderPadding : IbfsItem.filePadding));
					if(item.container)
					{
						$(document).trigger( "addafolderitem", item );
						this._children.append(ibfsItem.getElement());
					}	
					else
					{							
						$(document).trigger( "addanitem", item );
					}	
				}.bind(this));
				$(document).trigger("doneadding");
			}.bind(this));
			
		}
		else
		{
			if (this._glyphClassesSel)
				this._label.data('ibiIbxLabel')._setOption('glyphClasses', this._glyphClasses);
			this._label.removeClass('fld-open');
		}

		this._widget.option("glyph", glyph);
	}
};

 
//encapsulates the static root IBFS:.
function IbfsRootItem(ibfs, path)
{	
		var item =	
		{
			description: "Repository",
			fullPath: path,
			container: true
		};	
		
	IbfsItem.call(this, item, ibfs, IbfsItem.folderPadding);	
	
	//this._label.hide();
	this.toggle();
}

	
_p = IbfsRootItem.prototype = IbfsItem.prototype;

//# sourceURL=tree_home.js
