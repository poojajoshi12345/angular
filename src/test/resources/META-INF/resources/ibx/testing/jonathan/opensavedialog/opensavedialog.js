/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:
//////////////////////////////////////////////////////////////////////////
$.widget("ibi.opensavedialog", $.ibi.ibxDialog, 
{
    options:
    {
        
        rootPath:"IBFS:/WFC/Repository",
        ctxPath:"",
        viewAs:"tiles",
        'dlgType': "save",
        title: "Save",
        fileTypes: "",
        multiselect: false

    },
    _ibfs:null,
    _fileName: '',
    _fileTitle: '',
    _items:null,
    _bSearch: false,
    _ses_auth_parm: "",
    _ses_auth_val: "",
    _applicationContext: "",
    _loaded:null,
    _ses_auth_parm: null, 
	_ses_auth_val: null,
	_fileTypesList: [],
    _create:function()    
    {
        this._super();
        this.option("caption", this.options.title);
        this.btnOK.ibxWidget("option", "text", this.options.title);
        this.element.resizable();
        this.sdViewTiles.hide();
        this.sdViewList.show();
        this.sdViewList.on('click', this._onViewAsList.bind(this));
        this.sdViewTiles.on('click', this._onViewAsTiles.bind(this));
        this.sdtxtFileTitle.on('ibx_textchanged', function (e){
        	
        	this._fileTitle = this.sdtxtFileTitle.ibxWidget("option", "text");  
        	this._fileName = this._fileTitle.replace(/ /g,"_").toLowerCase();
        	this.sdtxtFileName.ibxWidget("option", "text", this._fileName);
        	this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
        this.sdtxtFileName.on('ibx_textchanged', function (e){
        	
        	this._fileName = this.sdtxtFileName.ibxWidget("option", "text");
        	this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
        this.btnOK.on("click", function(e){
        	debugger;
        }.bind(this));
        
        this.listBox.hide();
        this.btnOK.ibxWidget('option', 'disabled', true);  
        
        this._items=new Items();        
        this._items.setMultiSelectAllowed(this.options.multiSelect);
    	this._ses_auth_parm = WFGlobals.getSesAuthParm(); 
		this._ses_auth_val =WFGlobals.getSesAuthVal();
		
		this._applicationContext=applicationContext;
		
		fileTypesList=this.options.fileTypes.split(";");
		this._items.setFileTypesList(fileTypesList);
		
    },
    _init:function()
    {
    	this._super();
    },
    _onViewAsList:function(e)
    {
        var rg = $(e.target);
        //this.option("viewAs", rg.ibxWidget("userValue"));
        //this.option("viewAs", "list");
        this.sdViewList.toggle();
        this.sdViewTiles.toggle();  
        this.listBox.show();
        this.tilesBox.hide();
    },
    _onViewAsTiles:function(e)
    {
        var rg = $(e.target);
        //this.option("viewAs", rg.ibxWidget("userValue"));
        //this.option("viewAs", "tiles");
        this.sdViewList.toggle();
        this.sdViewTiles.toggle(); 
        this.tilesBox.show();
        this.listBox.hide();
    },
    
    _onFolderClick:function(e)
    {
        var path = $(e.currentTarget).data("ibfsPath");
        Ibfs.load().done(function(folderItem, ibfs)
        {
            ibfs.listItems(path, null, null, {asJSON:true});
        }.bind(this, path));
    },
    _onFileClick:function(e)
    {
        var item = $(e.currentTarget);
        var ibfsItem = item.data("ibfsItem");
        if(!ibfsItem.container || ibfsItem.type == 'PGXBundle')
        {
            this.txtFilename.ibxWidget("option", "text", ibfsItem.description);
            this._fileName = ibfsItem.name;
        }
    },
    _onFileDblClick:function(e)
    {
        var item = $(e.currentTarget);
        var ibfsItem = item.data("ibfsItem");
        if(ibfsItem.container)
            this.option("ctxPath", ibfsItem.fullPath);
    },
    fileTitle: function (value)
    {    	
        if (typeof (value) == "undefined")        
        	return this._fileTitle;
        else
        {        	
        	this._fileTitle = value;
            this.stdtxtFileTitle.ibxWidget("option", "text", value);
            return this;
        }
    },
    fileName: function (value)
    {    
        if (typeof (value) == "undefined")
        {
        	var fullPath = this.options.ctxPath + "/" + this._fileName;
        	return fullPath;           
        }
        else
        {
            this._fileName = value.replace(/ /g,"_").toLowerCase();
            this.stdtxtFileName.ibxWidget("option", "text", this._fileName);
            return this;
        }
    },
    ibfsItems: function ()
    {
    	
    	var items = this._items.getAllSelectedItems();
    	if(items.length == 0)
    	{ 
    		var fullPath = this.fileName();
    		var item = this._items.findItemByPath(fullPath);
    		if(item)items.push(item);
    		if(fullPath)items[0]=this._items.findItemByPath(fullPath);
    	}	
    	return items;
    },
    path: function (value)
    {
        if (typeof (value) == "undefined")        
            return this.options.ctxPath;
        else
        {
            this.optins.ctxPath = value;
            this.refresh();
            return this;
        }
    },    
    checkForError: function(exInfo, cb_function)
    {
    	
    		//check for error
    		var xmldata = exInfo.xhr.responseXML;
    		
    		$(xmldata).children().each(function()
    		{
    			var tagName=this.tagName;
    			if(tagName=="ibfsrpc")
    			{
    				var retcode=$(this).attr('returncode');	
    				if (retcode!="10000")
    				{
    					// error
    					var name=$(this).attr('name');	
    					
    					cb_function("error", name);
    					
    				}
    			}						
    		});
    					
    },  
    refresh:function()
    {
    	this._super(); 
    	if(this.options.ctxPath.length > 0)
    	{
    		this._fileTypesList=this.options.fileTypes.split(";");
    		this._items.setFileTypesList(this._fileTypesList);
	    	if(this._ibfs)
	    		this.refreshit();
	    	else
	    	{	
	    		if(!this._loaded)
	    		{	
			    	this._loaded=Ibfs.load(this._applicationContext, this._ses_auth_parm, this._ses_auth_val);
			    	this._loaded.done(function(ibfs)
					{
					        this._ibfs=ibfs;
					        this.refreshit();
					}.bind(this));
	    		}
	    	}
    	}
    	
    },
    updateViews:function()
    {
    	
	    var bSearch = false;
		var filter = "";
		var columns = [
	       			["", "icon", "", true, ""],
	       			["Title","alpha", "description", true, ""],
	       			["Filename", "alpha", "name", false, ""],	       		
	       			["Summary","alpha", "summary",true, ""],
	       			["Last Modified","date", "lastModified",true, ""],	       			
	       			["Created On","date","createdOn", false, ""],
	       			["File Size","number", "length", true, ""],
	       			["Owner", "alpha", "createdBy", false, ""],	       			
	       			["", "menu", "", true, ""]	       		
	       		];
		//if(home_globals.textSearch)
		//   filter = home_globals.textSearch.getSearchText();
		//if(filter && filter.length > 0)bSearch = true;
		
		
		
		buildviews(this.tilesBox, this.listBox, this._items.getFolderList(), this._items.getItemList(), 
				columns,
				this._items.getSortedOrder(), this._items.getSortedValue(), this._items.getSortedValueType(),
				this.sortItems, this._items.toggleSelected, this._items.setCallBack, bSearch, this.openFolder, 
				this.fileDoubleClick, false, false, this.foldermenu, this.filemenu, this, this.fileSingleClick);
			
	
    },
    sortItems:function(key, type, toggle)
    {
    		this._items.sortItems(key, type, toggle);
    		this.updateViews();    		
    },
    openFolder:function(item)
    {
    	this.refreshit(item.fullPath);    	
    },
    selectItem:function(item)
    {
    	this.sdtxtFileTitle.ibxWidget("option", "text", item.description);
    	this.sdtxtFileName.ibxWidget("option", "text", item.name);
    	
        this._fileName = item.name;
        this._fileTitle = item.description;
        
        this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);
    	
    },    
    fileSingleClick: function(item)
    {
    	this.selectItem(item);
    },
    fileDoubleClick: function(item)
    {
    	this.selectItem(item);
    	this.close({ibfsItem:item});
    },    
    foldermenu:function()
    {
    	
    },
    filemenu:function()
    {
    	
    },
    destroy:function()
    {
    	 this_ibfs=null;
    	 this._fileName="";
    	 this._fileTitle= "";
    	 this._items=null;
    	 this._bSearch=false;    	 
    	 this._loaded=null;
    	 this.options.ctxPath="";
    },
    refreshit:function(path)
    {
    	//this._super();
     if(this._ibfs)
     {	 
        var bSearch = this._bSearch;
		var depth = null;
		var flatten = null;
		
		if(path)this.options.ctxPath = path;
		
		if(bSearch)
		{
			depth = 10;
			flatten = true;
		}	
		
		this._items.clearItems();
		
		this._breadCrumbTrail.ibxWidget(
		{ 	
	    	currentPath: this.options.ctxPath,    
	        isPhone: false,
	        items: this._items,
	        refreshFolder: this.refreshit,
	        thisContext: this
	    }
		);
		//this._breadCrumbTrail.ibxWidget("option", "currentPath", this.options.ctxPath);			
		
		
		
			this._ibfs.listItems(this.options.ctxPath, depth, flatten, { asJSON: true, clientSort: false , eError: 'fatal_error'}).done(function (exInfo)		
			{
				
				if(exInfo.result.length == 0)
				{
					this.checkForError(exInfo);				
				}
				$.each(exInfo.result, function (idx, item)
				{					
					if(item.container && item.type != "PGXBundle")
					{
						this._items.addFolderItem(item);
						
					}	
					else
					{
						this._items.addItem(item);
					
					}	
				}.bind(this));				
				//cb_function("doneadding", null);
				
				this.updateViews();
			}.bind(this));
     }	
    }
});
//# sourceURL=opensavedialog.js