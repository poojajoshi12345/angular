/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

function Items()
{
	var protoItems = Items.prototype;	
	this.itemList = [];
	this.folderList = [];
	this.allFolders = [];
	this.sortedValue =	"description";
	this.sortedValueType = "alpha";
	this.sortedOrder = "up";
	this.multiSelectAllowed = true;
	this.fileTypesList = [];
	var _this = this;
	
	protoItems.clearItems = function()
	{
		_this.itemList.length=0;		
		_this.folderList.length=0;			
	};
	protoItems.getItemList = function()
	{
		return _this.itemList;
	};
	protoItems.getFolderList = function()
	{
		return _this.folderList;
	};
	protoItems.setFileTypesList = function(fileTypes)
	{
		_this.fileTypesList = fileTypes;
	};	
	protoItems.addItem = function(item)
	{
		addFlag = true;
		if(_this.fileTypesList.length > 0)
		{
			var extension = item.extension;
			if(!extension && item.typeDescription == "Page Bundle")extension = "pgx";
			var i = _this.fileTypesList.indexOf(extension);
			if(i == -1)addFlag = false				
		}	
		if(addFlag)
		{	
			item.selected = false;		
			item.jqObject = null;
			_this.itemList.push(item);
		}	
	};
	protoItems.addFolderItem = function(item)
	{
		item.selected = false;		
		item.jqObject = null;
		_this.folderList.push(item);
		_this.allFoldersAdd(item);
	};
	protoItems.getFolderCount = function()
	{
		return _this.folderList.length;
	};
	protoItems.getItemCount = function()
	{
		return _this.itemList.length;
	};
	protoItems.setSortedValue = function(value)
	{
		_this.sortedValue = value;
	};
	protoItems.setSortedValueType = function(value)
	{
		_this.sortedValueType = value;
	};
	protoItems.setSortedOrder = function(value)
	{
		_this.sortedOrder = value;
	};
	protoItems.getSortedValue = function()
	{
		return _this.sortedValue;
	};
	protoItems.getSortedValueType = function()
	{
		return _this.sortedValueType;
	};
	protoItems.getSortedOrder = function()
	{
		return _this.sortedOrder;
	};
	protoItems.setSortedDefaults = function()
	{
		_this.sortedValue = "description";
		_this.sortedOrder = "up";
	};
	
	protoItems.toggleSelected = function(item, key)
	{
		var foundItem = _this.findItemByPath(item.fullPath);
		if(key == 3)
		{
			// context key
			if(foundItem.selected)return foundItem.selected;			
		}	
		foundItem.selected = foundItem.selected ? false : true;
		if(foundItem.selected)
			{
				foundItem.jqObject.trigger("selectSet");
				foundItem.jqObject_grid.trigger("selectSet");
			}
		else 
			{
				foundItem.jqObject.trigger("selectUnset");
				foundItem.jqObject_grid.trigger("selectUnset");
			}
		
		// ctrl key?	
		if(key == 1)return foundItem.selected;
		if(key == 2 && this._multiSelectAllowed)
		{
			// shift key
			protoItems.multiSelect(foundItem);
			
			return foundItem.selected;
		}		
		// make sure no other items are selected....
		_this.removeAllSelections(item);		
		return foundItem.selected;		
	};	
	
	protoItems.multiSelect = function(item)
	{
		// our item number?
		var itemNumber;
		if(item.container)
		{				
			var ilen=_this.folderList.length;		
			var i=0;		
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{	
					var ibfsitem=_this.folderList[i];					
					if(ibfsitem.fullPath == item.fullPath)
					{	
						itemNumber = i;
						break;
					}	
				}
			}							
		}
		else
		{	
			var ilen=_this.itemList.length;		
			var i=0;		
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{	
					var ibfsitem=_this.itemList[i];	
					if(ibfsitem.fullPath == item.fullPath)
					{
						itemNumber = i + _this.folderList.length;
					}	
				}	
			}							
		}
		// find the first selected folder
		var firstSelectedFolder = -1;
		var flen=_this.folderList.length;		
		var i=0;		
		if(flen > 0)
		{
			for (i=0; i < flen; i++)
			{	
				var ibfsitem=_this.folderList[i];
				if(ibfsitem.selected)
				{	
					firstSelectedFolder  = i;
					break;
				}	
			}
		}	
		// find the first selected item
		var firstSelectedItem = -1;
		var ilen=_this.itemList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.itemList[i];
				if(ibfsitem.selected)
				{	
					firstSelectedItem = flen + i;
					break;
				}	
			}
		}	
		
		if(firstSelectedItem > -1 || firstSelectedFolder > -1)
		{
			// remove all selections...
			_this.removeAllSelections(null);			
			// start selecting items...
			var firstSelected = (firstSelectedFolder == -1)? firstSelectedItem : firstSelectedFolder;
			var steps = 1;
			var starting = firstSelected;
			var ending = itemNumber; 
			if(firstSelected > itemNumber)
			{
					steps = -1;
					starting = itemNumber;
					ending = firstSelected;
					
			}
			flen = _this.folderList.length;
			var ibfsitem = null;
			for(i=starting; i <= ending; i += steps)
			{
				if(i < flen)			
					ibfsitem = _this.folderList[i];
				else
					ibfsitem = _this.itemList[i-flen];
				
				ibfsitem.jqObject.trigger("selectSet");
				ibfsitem.jqObject_grid.trigger("selectSet");
				ibfsitem.selected = true;
			}	
			
		}		
	};	
	
	protoItems.removeAllSelections = function(item)
	{
		
		var ilen=_this.folderList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.folderList[i];	
				if(item && ibfsitem.fullPath != item.fullPath)
				{	
					// if item is passed in we preserve it's selection...
					if(ibfsitem.selected)
						{	
							
							ibfsitem.jqObject.trigger("selectUnset");
							ibfsitem.jqObject_grid.trigger("selectUnset");
							ibfsitem.selected = false;
						}
				}	
			}							
		}
	
			
		ilen=_this.itemList.length;		
		i=0;			
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.itemList[i];	
				if(item && ibfsitem.fullPath != item.fullPath)
				{
					// if item is passed in we preserve it's selection...
					if(ibfsitem.selected)
						{							
							ibfsitem.jqObject.trigger("selectUnset");
							ibfsitem.jqObject_grid.trigger("selectUnset");
							ibfsitem.selected = false;
						}
				}	
			}							
		}
		
	};
	
	protoItems.findItemByPath = function(fullPath)
	{
		// find the item...		
		var ilen=_this.folderList.length;		
		var i=0;
		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.folderList[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return _this.folderList[i];					
				}	
			}							
		}	
			
		ilen=_this.itemList.length;
				
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.itemList[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return _this.itemList[i];						
				}	
			}							
		}
			
	};
	protoItems.setCallBack = function(fullPath, jobject, grid)
	{
		var foundItem = _this.findItemByPath(fullPath);
		if(grid)
			foundItem.jqObject_grid = jobject;
		else
			foundItem.jqObject = jobject;
	};
	
	
	
	protoItems.getAllSelectedItems = function()
	{
		var selectedList=[];
		var ilen=_this.folderList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.folderList[i];
				if(ibfsitem.selected)selectedList.push(ibfsitem);
			}							
		}			
		ilen=_this.itemList.length;		
					
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{
				var ibfsitem=_this.itemList[i];
				if(ibfsitem.selected)selectedList.push(ibfsitem);						
			}							
		}
		return selectedList;		
	};
	protoItems.allFoldersAdd = function(item)
	{
		var fullPath = item.fullPath;
		if(!_this.findallFoldersByPath(fullPath))		
			_this.allFolders.push(item);		
	};
	protoItems.allFoldersRemove = function(item)
	{
		var i = _this.allFolders.indexOf(item);		
		if(i > -1)
			_this.allFolders.splice(i,1);			
	};
	protoItems.setMultiSelectAllowed = function(multiSelectAllowed)
	{
		_this.multiSelectAllowed = multiSelectAllowed;
	};
	protoItems.findallFoldersByPath = function(fullPath)
	{	
		var ilen=_this.allFolders.length;		
		var i;	
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.allFolders[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return _this.allFolders[i];					
				}	
			}							
		}
		return null;
	};
	protoItems.findAllChildFoldersByPath = function(fullPath)
	{
		if(!fullPath.endsWith("/"))
			fullPath += "/";
		var ilen=_this.allFolders.length;		
		var i;
		var children=[];
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.allFolders[i];	
				if(ibfsitem.parentPath == fullPath)
				{					
					children.push(ibfsitem);				
				}	
			}							
		}
		return children;
		
	};
	protoItems.deleteAllChildFoldersByPath = function(fullPath)
	{
		if(!fullPath.endsWith("/"))
			fullPath += "/";
		var ilen=_this.allFolders.length;		
		var i;
		var deleteList=[];
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=_this.allFolders[i];	
				if(ibfsitem.parentPath == fullPath)
				{
					deleteList.push(i);
				}	
			}							
		}		
		if(deleteList.length > 0)
		{
			for(i = deleteList.length - 1; i >= 0; i--)
				_this.allFolders.splice(deleteList[i],1);
		}	
	};
	
	protoItems.sortItems = function(key, type, toggle)
	{	
		_this.removeAllSelections(null);
		if(toggle == null || toggle == true)
		{	
			if(_this.sortedOrder=="up")
				_this.sortedOrder="down";
			else 
				_this.sortedOrder="up";
		}
		if(_this.itemList.length > 1 || _this.folderList.length > 1)
		{	
		 	if(_this.itemList.length > 1)
		  		_this.itemList=_this._sortit(key, type, _this.itemList, _this.sortedOrder);
			if(_this.folderList.length > 1)
				_this.folderList = _this._sortit(key, type, _this.folderList, _this.sortedOrder);	
			
		  	_this.sortedValue=key;
		  	_this.sortedValueType=type;		  	  	
		}
	};
	
	protoItems._sortit = function(key, type, list, sortedOrder)
	{
		if(key == _this.sortedValue && sortedOrder == "up")
		{
			// sort up...	
			var aa="a." + key;
			var bb="b." + key;
			var aal="nameA";
			var bbl="nameB";
			if(type == "alpha")
			{
				aal="nameA ? nameA.toLowerCase():'none'";
				bbl="nameB ? nameB.toLowerCase():'none'";	
			}		
			list.sort(function(a, b) 
			{								
					var nameA = eval(aa);
					nameA = eval(aal);				
					var nameB = eval(bb);
					nameB = eval(bbl);												
					if (nameA < nameB)return -1;									
					if (nameA > nameB)return 1;  																			
					return 0;
			});			
		}
		else
		{
			var aa="a." + key;
			var bb="b." + key;
			var aal="nameA";
			var bbl="nameB";
			if(type == "alpha")
			{
				aal="nameA ? nameA.toLowerCase():'none'";
				bbl="nameB ? nameB.toLowerCase():'none'";	
			}		
			// sort down....							
			list.sort(function(a, b) 
			{								
				var nameA = eval(aa);
				nameA = eval(aal);				
				var nameB = eval(bb);
				nameB = eval(bbl);											
				if (nameA < nameB)return 1;									
				if (nameA > nameB)return -1;  																			
				return 0;
			});																
		}
		return list;
	};


	
}
