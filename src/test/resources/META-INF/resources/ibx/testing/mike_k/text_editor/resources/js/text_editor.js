/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.textEditor", $.ibi.ibxDialog, 
{
	options:
	{
		modal:false,
		resizable:true,
		captionLabelOptions:
		{
			text:"Edit - IBFS:/some/file/path.fex"
		}
	},
	
	_widgetClass:"text-editor",

	_create:function()
	{
		this._super();
		
		var resBody = ibx.resourceMgr.getResource(".text-editor-resources", false);
		
		this.contentBox.append(resBody.children());
		
		ibx.bindElements(this.contentBox);
		
		this.extension = "";
		this.itemDescription = "";	
		this.tool = "";
		this.type = "";
		this.itemName = "car.fex";
		this.folderPath = "IBFS:/WFC/Repository/Public/";
		this.fullItemPath = this.folderPath + this.itemName;
		
		$(".te-menu").on("ibx_select", this._onMenuItemSelect.bind(this));
		
		$(".te-menu-button").on("click", this._onMenuButtonSelect.bind(this));					
		
		$(".te-tb-btn").on("click", this._onButtonSimpleSelect.bind(this));					
		//$("#fjkdvnkl").on("click", this._onButtonSimpleSelect.bind(this)); // acces DOM element by ID
	
		this.element.resizable();
		
		this.btnBox.css("display", "none");
	},
	
	setEditorPath:function(folderPath, itemName, itemExtension)
	{
		this.folderPath = folderPath;
		
		if(itemName && itemName.length > 0 && itemExtension && itemExtension.length > 0)
		{
			this.itemName = itemName;
			this.extension = itemExtension;			
			this.fullItemPath = this.folderPath + "/" + this.itemName + "." + this.extension;
			
			this._getItemSummary(this.fullItemPath);
		}
		
		if (!this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
		{	
			this._getEditorEnv(this.fullItemPath);
		}
	},
	
	_onMenuItemSelect:function(e, menuItem)
	{
		var cmd = $(menuItem).data("menuCmd");
		//alert("You selected: " + cmd);
		
		switch (cmd) 
		{
			case "fileNew":
				break;
			case "fileOpen":
				break;
			case "fileSave":
				break;
			case "fileSaveAS":
				break;
			case "fileClose":
				break;
		    case "fileExit":
		    	
		    	this.close();
		    	break;

			default:
		}
	},
	
	_onMenuButtonSelect:function(e)
	{
		var cmd = $(e.currentTarget).data("menuCmd");
		//alert("You selected: " + cmd);
	},
	
	_onButtonSimpleSelect:function(e)
	{
		var cmd = $(e.currentTarget).data("menuCmd");
		//alert("'_onButtonSimpleSelect' You selected: " + cmd);
		
		switch (cmd) 
		{
			case "onNew":
				this._onNewFunction(e);
				break;
			case "onOpen":
				this._onOpenFunction(e);
				break;
			case "onSave":
				this._onSaveFunction(e);
				break;
		    case "onRun":
		    	this._onRunFunction(e);
		    	break;

			default:
		}
	
	},

	_onNewFunction:function(e)
	{

	},	
	_onOpenFunction:function(e)
	{

	},	
	_onSaveFunction:function(e)
	{
		this._doSave();		
	},
	_onRunFunction:function(e)
	{
		this._doRun(e);
	},	
	
	_getItemSummary:function(ibfsPath)
	{			
		var uriExec = sformat("{1}/editor.bip", applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_GET_ITEM_SUMMARY",		
	 		path: ibfsPath,
	 		IBI_random: randomnum				 		
	 	};
 	
		$.get({	"url": uriExec,	"context": this,"data": argument})
			.done(function( data ) 
			{				
				var item_summary = $("item_summary", data);

				el = $(item_summary);
				
				var rFullPath = el.attr("fullpath");
				var rPath = el.attr("path");
				var rName = el.attr("name");
				var rExtension = el.attr("extension");
				var rDescription = el.attr("description");
				var rTool = el.attr("tool");
				var rType = el.attr("type");
									
				this.folderPath = rPath;
				this.fullName = rName + "." + rExtension;
				this.itemName = rName;
				this.extension = rExtension;
				this.itemDescription = rDescription;	
				this.tool = rTool;
				this.type = rType;
	 
				var item_content = $("item_content", data);
				el = $(item_content);					
				this.fexText = el.text();					
				$(".te-txt-area").ibxWidget("option", "text", this.fexText);
			});
	},	
	
	_getEditorEnv:function(ibfsPath)
	{			
		var uriExec = sformat("{1}/editor.bip", applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_EDITOR_ENV",		
	 		path: ibfsPath,
	 		IBI_random: randomnum				 		
	 	};
 	
		$.get(uriExec, argument)
			.done(function( data ) 
			{
				
				var edaNodes = $("server", data);
				
				edaNodes.each(function(idx, el)
				{
					el = $(el);
					
					var edaNodeName = el.attr("name");					

				});	  
				      				             		
			
			});
	},	
	
	
	
	_doRun: function(e)
	{
		var fexText = $(".te-txt-area").ibxWidget('option', 'text');
		var width = 800;
		var height = 600;
		var top = (screen.height-height)/2;
		var left = (screen.width-width)/2; 	 		
		
		var action = location.protocol + applicationContext + "/editor.bip";

		var win = window.open("", "_blank", "status=yes," + "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left + ", resizable=yes, scrollbars=yes");
		var doc = win.document;
		
		var options =
		{
		        "action":action,
		        "fields":
		        {
		        	"BIP_REQUEST_TYPE": "BIP_RUN_ADHOC",
		        	"BIP_folder":this.folderPath,
					"BIP_fexText":fexText,
					"BIP_paramPrompt":false,
					"BIP_server":"EDASERVE",
					"BIP_appPath":"",
					
		        }
		};
		
		options.fields[WFGlobals.getSesAuthParm()]=WFGlobals.getSesAuthVal();
		options.fields[IBI_random]=Math.random();
		
		var form = $("<form>").ibxForm(options).ibxForm("submit", doc);
		
/*		
		var parms = {"BIP_REQUEST_TYPE":"BIP_RUN_ADHOC",
					 "BIP_folder":encodeURIComponent(this.folderPath),
					 "BIP_fexText":encodeURIComponent(fexText),
					 "BIP_paramPrompt":false,
					 "BIP_server":"EDASERVE",
					 "BIP_appPath":""
					};
					
	    if (true) //(!this.newDoc)
	    {
	    	parms["IBFS_edItem_path"] = encodeURIComponent(this.folderPath) + '/' + encodeURIComponent(this.itemName) + "." + this.extension);
	    }

		parms[WFGlobals.getSesAuthParm()] = decodeURIComponent(WFGlobals.getSesAuthVal());


		
		var form = buildForm(doc, this.postFormActionHandler, parms);
		form.submit();
		
*/		
	},
	
	
	
	
	_doSave:function()
	{
		
		var fexText = $(".te-txt-area").ibxWidget('option', 'text');
		
	 	var uriExec = sformat("{1}/editor.bip", applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument = {};
	 	
	 	argument["BIP_REQUEST_TYPE"] = "BIP_EDITOR_SAVE";		

	 	argument["folder"] = this.folderPath;
	 	argument["itemName"] = this.itemName;	 	
	 	argument["itemDesc"] = this.itemDescription;
	 	argument["newItem"] = false;
	 	argument["iaSave"] = false;
	 	argument["extension"] = this.extension;
	 	argument["paramPrompt"] = false;
	 	argument["fexData"] = encodeURIComponent(fexText);
	 	argument["myReport"] = false;
	 	argument["IBI_random"] = randomnum;
	 	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();

	 	$.post(uriExec, argument)  
	 		.done(function( data ) {
	 			//alert( "Data Loaded: " + data );
	 		});
	 	
	 	//home_globals.homePage.postCall(uriExec,argument,false,"");
	 	
/*	 	
		var parms = [];
		parms.push("BIP_REQUEST_TYPE=BIP_EDITOR_SAVE"); 
		parms.push("folder=" + decodeHtmlEncoding(this.folderPath));
		parms.push("itemName=" + decodeHtmlEncoding(this.itemName));
		parms.push("itemDesc=" + decodeHtmlEncoding(this.itemDescription));	// already encoded
			// newDoc might be true from tool change above, so set newItem to false
		parms.push("newItem=" + (this.overWrite ? false : this.newDoc));	 
		parms.push("iaSave=" + this.iaSave);
		if (mode == "saveas" && this.iaSave)
		{
			parms.push("mode=" + mode);
			parms.push("oldname=" + this.orgName);
		}
		parms.push("extension=" + this.extension);
		parms.push("paramPrompt=" + this.options.paramPrompt);
		parms.push("fexData=" + encodeURIComponent(this.fexText)); // CLRPT-122 encode % chars in text
			
		if (this.options.srvChk)
		{
			parms.push("server=" + this.options.server);
		}

		if (this.options.appChk)
		{
			parms.push("appPath=" + this.options.appPath);
		}

		parms.push("myReport=" + false);

		this.tree.ajaxRequestEx(this.editorActionHandler, parms, true, this.gotSaveResponse, null, this);
*/		
	},
	
	_destroy:function()
	{
		this._super();
	},
	
	refresh:function()
	{
		this._super();
	}
});
//# sourceURL=text_editor.js