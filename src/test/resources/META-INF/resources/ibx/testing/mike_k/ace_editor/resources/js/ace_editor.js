/*Copyright 1996-2018 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.1 $:


$.widget("ibi.textEditor", $.ibi.ibxDialog, 
{
	options:
	{
		modal:false,
		resizable:true,
		defaultAction:"",
		captionLabelOptions:
		{
			text:ibx.resourceMgr.getString("BT_UNTITLED")
		}
	},
	
	_widgetClass:"text-editor",

	_create:function()
	{
		this._super();
		
		this._openEditors = [];
		
		this._supportedModes = 
		{
				"txt":["text"],
				"fex":["focexec"],
				"mas":["masterfile"],
				"prop":["text"],
				"man":["text"],
				"js":["javascript"],
				"htm":["html"],
				"html":["html"],
				"css":["css"],
				"sty":["css"],
				"r":["r"],
				"py":["python"],
				"sql":["sql"]
		};
				
		this._supportedFormats = 
		{
				"*":["allType"],
				"txt":["txtType"],
				"fex":["focexecType"],
				"mas":["masterType"],
				"prop":["propertyType"],
				"man":["manifestType"],
				"js":["jsType"],
				"htm":["htmlType"],
				"html":["htmlType"],
				"css":["cssType"],
				"sty":["wfStyleType"],
				"r":["rType"],
				"py":["pythonType"],
				"sql":["sqlType"]
		};
		
	    this.ace_editor = ace.edit("wf_editor");
	    
	    this.ace_editor.setTheme("ace/theme/twilight");
	    
	    //this.ace_editor.renderer.setShowGutter(true); // Turn ON/OFF line numbering and code folding. 
	    //this.ace_editor.renderer.setOption('showLineNumbers', false);
	    
	    //this.ace_editor.renderer.setOption('highlightActiveLine', false); 
	    //this.ace_editor.renderer.setOption('readOnly', false); 
	    //this.ace_editor.renderer.setOption('highlightActiveLine', false); 


	    this._editorDefaultMode = "text";
	    this._setEditorMode();
	    
	    this._insertKeyStatus = false;
	    this._setInsertStatusLabel();
	    
		this.bipActionHandler = "/views.bip";
		this.editorActionHandler = "/editor.bip";
		this.checkServerAccessHandler = "/chksrvacc.bip";		
		this.postFormActionHandler = location.protocol + applicationContext + this.editorActionHandler;
		this.resourceContext = applicationContext;
		
		this.currentAction = 0; // 1-New, 2-Open, 3-Close, 4-Exit, -1-Exit unconditional
		this.rootPath = "";
		this.defaultFolderPath = "";
		this.tool = "";
		this.type = "";
		this._callbackFunc = null;
		
		this.fullName = "";
		this.itemName = "";
		this.extension = "";
		this.itemDescription = "";			
		this.folderPath = "";
		this.fullItemPath = "";
		this.newDoc = true;
		this.linkName = true;
		
		this.changed = false;
		this.optionsChanged = false;
		
		//this.newWindow = newWindow;
	    this.fromClose = false;
	    this.editor_options = 
	    {
			"fType":this.extension,
			"newDoc":this.newDoc,
			"servers":[],
			"srvChk":false, 
		  	"server":"",
		  	"appChk":false,
		  	"appPath":"",
		  	"myReport":false,
		  	"paramPrompt":true,
		  	"roPath":"" 
		};
		this.iaMode = false;
		
		//this.unDoText = [];
		this.canchangeserverprops = true;
		
//		this._txtArea.on("ibx_textchanged", this._onEditorAreaTextchanged.bind(this));
		
		this.ace_editor.getSession().selection.on('changeSelection', this._onEditorChangeSelection.bind(this), false);
		
		this.ace_editor.getSession().selection.on('changeCursor', this._onEditorAreaChangeCursorEvent.bind(this));
		
		this.ace_editor.textInput.getElement().addEventListener("keydown", this._onInsertKeyDown.bind(this), false);
		
		this.ace_editor.textInput.getElement().addEventListener("keyup", this._onEditorAreaKeyUp.bind(this), false);
/*		
		this.ace_editor.commands.addCommand({
		    name: "onInsertKeyDown",
		    exec: this._onInsertKeyDown.bind(this),
		    bindKey: {mac: "Insert", win: "Insert"}
		})
*/		
		this._fileNew.on("ibx_menu_item_click", this._onMenuFileNew.bind(this));
		this._fileOpen.on("ibx_menu_item_click", this._onMenuFileOpen.bind(this));
		this._fileSave.on("ibx_menu_item_click", this._onMenuFileSave.bind(this));
		this._fileSaveAs.on("ibx_menu_item_click", this._onMenuFileSaveAs.bind(this));
		this._fileClose.on("ibx_menu_item_click", this._onMenuFileClose.bind(this));
		this._fileExit.on("ibx_menu_item_click", this._onMenuFileExit.bind(this));

		this._editUndo.on("ibx_menu_item_click", this._onMenuEditUndo.bind(this));
		this._editRedo.on("ibx_menu_item_click", this._onMenuEditRedo.bind(this));
		this._editDelete.on("ibx_menu_item_click", this._onMenuEditDelete.bind(this));
		this._editSelectAll.on("ibx_menu_item_click", this._onMenuEditSelectAll.bind(this));
		this._editUpperCase.on("ibx_menu_item_click", this._onMenuEditUpperCase.bind(this));
		this._editLowerCase.on("ibx_menu_item_click", this._onMenuEditLowerCase.bind(this));

		this._searchFind.on("ibx_menu_item_click", this._onMenuSearchFind.bind(this));
		this._searchGoTo.on("ibx_menu_item_click", this._onMenuSearchGoTo.bind(this));
		
		this._menuOptions.on("click", this._onMenuButtonOptions.bind(this));
		this._menuHelp.on("click", this._onMenuButtonHelp.bind(this));
		
		this._editUndo.ibxWidget("option", "disabled", true);
		this._editRedo.ibxWidget("option", "disabled", true);

		this._tbNew.on("click", this._onButtonSimpleNew.bind(this));
		this._tbOpen.on("click", this._onButtonSimpleOpen.bind(this));
		this._tbSave.on("click", this._onButtonSimpleSave.bind(this));
		this._tbRun.on("click", this._onButtonSimpleRun.bind(this));	
		//$("#fjkdvnkl").on("click", this._onButtonSimpleSelect.bind(this)); // example acces DOM element by ID
	
		this._btnCloseGoToLine.on("click", this._toggleGoToLine.bind(this));
		this._btnGoToLine.on("click", this._actionGoToLine.bind(this));
		this._txtGoToLine.on("keyup", this._onTxtGoToLineKeyup.bind(this));
		
		this._findText.on("ibx_textchanged", this._tchange.bind(this));
		
		this._btnFind.on("click", this._find.bind(this));
		this._btnFindPrevious.on("click", this._findPrev.bind(this));
		this._btnReplace.on("click", this._replaceFind.bind(this));	
		this._btnReplaceAll.on("click", this._replaceAll.bind(this));
//		this._btnUndo.on("click", this._unDo.bind(this));
		this._btnFindClose.on("click", this._onFindButtonCloseAction.bind(this));
		
		this._btnFind.ibxWidget("option", "disabled", true);
		this._btnFindPrevious.ibxWidget("option", "disabled", true);
		this._btnReplace.ibxWidget("option", "disabled", true);
		this._btnReplaceAll.ibxWidget("option", "disabled", true);
//		this._btnUndo.ibxWidget("option", "disabled", true);
				
		this.element.on("ibx_open", this._onEditorOpen.bind(this)); // On open of the Editor.
		this.element.on("ibx_beforeclose", this._onEditorBeforeclose.bind(this)); // On 'X' close of the Editor.
		
		this._goToLine.hide();
		this._findReplace.hide();
		
		this.element.resizable();
		
		this.btnBox.css("display", "none"); // Hide Editor Dialog OK and Cancel buttons
	},
	
	
		
	// Menu Items
	_onMenuFileNew:function(e)
	{
		this.currentAction = 1;
		this._onNewFunction(e);
	},
	
	_onMenuFileOpen:function(e)
	{
		this.currentAction = 2;
		this._onOpen(e);
	},
	
	_onMenuFileSave:function(e)
	{
		this._onSaveFunction(e);
	},
	
	_onMenuFileSaveAs:function(e)
	{
		this._onSaveAsFunction(e);
	},
	
	_onMenuFileClose:function(e)
	{
		this.currentAction = 3;
		this._onClose(e);
	},
	
	_onMenuFileExit:function(e)
	{
    	this.currentAction = 4;
    	this._onExitFunction(e);
	},

	_onMenuEditRedo:function(e)
	{
		this._redoEditor(e);
	},
	
	_onMenuEditUndo:function(e)
	{
		this._undoEditor(e);
	},
	
	_onMenuEditDelete:function(e)
	{
		this._deleteSelectedText(e);
	},
	
	_onMenuEditSelectAll:function(e)
	{
		this._selectAll(e);
	},
	
	_onMenuEditUpperCase:function(e)
	{
    	this._selectionToUpperCase(e);
	},

	_onMenuEditLowerCase:function(e)
	{
    	this._selectionToLowerCase(e);
	},

	_onMenuSearchFind:function(e)
	{
    	this._toggleFindReplace(e);
	},
	
	_onMenuSearchGoTo:function(e)
	{
    	this._toggleGoToLine(e);
	},	
	
	// Menu Buttons
	_onMenuButtonOptions:function(e)
	{
		this._onOptions(e);
	},	

	_onMenuButtonHelp:function(e)
	{
		this._onHelp(e);
	},
		
	// Toolbar Buttons
	_onButtonSimpleNew:function(e)
	{
		this.currentAction = 1;
		this._onNewFunction(e);
	},
	
	_onButtonSimpleOpen:function(e)
	{
		this.currentAction = 2;
		this._onOpen(e);
	},
	
	_onButtonSimpleSave:function(e)
	{
		this._onSaveFunction(e);
	},
	
	_onButtonSimpleRun:function(e)
	{
    	this._onRunFunction(e);
	},
		
	// ACE Text Area
	_onEditorAreaTextchanged:function (e)
	{   
		this._setEditorChanged(true);
	},	
	_onEditorAreaChangeCursorEvent:function (e)
	{	
		this._setCursorPositionInfo(e);
	},	
	_onEditorChangeSelection:function (e)
	{		
		this._setEditorChanged(true);
	},
	_onEditorAreaKeyDown:function (e)
	{		
		this._setCursorPositionInfo(e);
	},	
	_onEditorAreaKeyUp:function (e)
	{		
		this._setEditorChanged(true);
	},

	//---------------------------------------------------------------------------------------------------------
	_onEditorOpen:function()
	{
		this._setCursorPositionInfo();
		this.ace_editor.focus();
	},
	
	_onEditorBeforeclose:function(e)
	{			
		if(this.currentAction != -1)
		{
			e.preventDefault();
			this._setCursorPositionInfo();
			this._onExit();
		}
	},
	
	setCallbackFunction:function(f)
	{
		this._callbackFunc = f;
	},
	
	setEditorPath:function(rootPath, folderPath, fileName) // Public method to setup Editor.
	{
		this.rootPath = this._checkPath(rootPath);
		
		this._setEditorPath( this._checkPath(folderPath), fileName);			
	},
	
	_setEditorPath:function(folderPath, fileName)
	{		
		this._clearEditorEnvironment();
		
		this.newDoc = !fileName || fileName.length == 0;

		if(folderPath && folderPath.length > 0)
		{
			this.defaultFolderPath = folderPath;
			this.folderPath = folderPath;
		}
		
		if(fileName && fileName.length > 0)
		{
	        var extSeparatorIdx = fileName.lastIndexOf(".");
	        
	        this.itemName = fileName.substring(0, extSeparatorIdx);
	        this.extension = fileName.substring(extSeparatorIdx + 1);   // do not include '.'
	        
	        this._setEditorMode();
		}
		
		if(this.folderPath.length > 0 && this.itemName.length > 0)
		{
			this.fullItemPath = folderPath + "/" + fileName;
			
			this._getItemSummary(this.fullItemPath);
		}
		
		if (!this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
		{	
			if(this.fullItemPath)
				this._getEditorEnv(this.fullItemPath);
			else
				this._getEditorEnv(this.folderPath);
		}			
	},
	
	_onNewFunction:function(e)
	{
		this._onClose(e);
	},
	
	_onOpen:function(e)
	{       
		
		if (this.changed || this.optionsChanged)
		{
			// Save Confirm Dialog
			var options = 
			{		
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_yes"));
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_no"));
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_cancel"));
			
			dlg.ibxDialog("open");
			
			dlg.on("ibx_apply", function(e, closeData)
			{
				// NO
				dlg.ibxWidget("close");
				
				this.currentAction = 0;
				this._onOpenDialog(e);
				
			}.bind(this)).on("ibx_close", function (e, closeData)
			{						

				if (closeData == "ok") // YES
				{
					if (!this.iaMode )
					{
	                    this.fromClose = true;
					}
	                this.closing = true;							
					this.fexText = this.ace_editor.getValue();
					this._onSave();				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			this.ace_editor.focus();
				}
				
			}.bind(this));
		}
		else
		{
			this.ace_editor.focus();
			this._onOpenDialog(e);
		}		
	},
	
	_onOpenDialog:function(e)
	{		
		var openDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		openDlg.ibxWidget({
			fileTypes:[[ibx.resourceMgr.getString(this._getEditorFormatName("*")), "*.*"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"],			           
			           [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],
		               [ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"], 
			           [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],
			           [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"]], 
			dlgType:"open", 
			title: ibx.resourceMgr.getString("bid_open"), 
			ctxPath:this.folderPath.length > 0 ? this.folderPath : this.rootPath,
			rootPath:this.rootPath});
		
		openDlg.ibxWidget('open');
		
		openDlg.on("ibx_beforeclose", function(e, closeData)
		{
			//alert("ibx_beforeclose");
			//return false;
		}).on("ibx_close", function (e, closeData)
		{						
			
			this._onOpenDialogResult(openDlg, closeData);
			
		}.bind(this));
	},
	
	_onOpenDialogResult:function(openDlg, closeData)
	{
		if(closeData == "ok")
		{
			var ibfsItems = openDlg.ibxWidget('ibfsItems');	
			var folderPath = this._checkPath( (ibfsItems.length > 0 )? ibfsItems[0].parentPath : "");
			var fileName = (ibfsItems.length > 0 )? ibfsItems[0].name : "";	
			var itemExtension = (ibfsItems.length > 0 )? ibfsItems[0].extension : "";	

			this._setEditorPath(folderPath, fileName, itemExtension);
			this.newDoc = false;
			this.editor_options.newDoc = false;
			this._setCursorPositionInfo();
		}
		else
		{
			this.currentAction = 0;
		}

		this.ace_editor.focus();
	},

	_onSaveFunction:function(e)
	{
		this._onSave();		
	},
	_onSaveAsFunction:function(e)
	{
		this._onSaveAs(e);
	},
	_onRunFunction:function(e)
	{
		this._doRun(e);
	},	
	
	_onExitFunction:function(e)
	{
		this._onExit(e);
	},	
	
	_onHelp:function(e)
	{
		var url = IBI_HELP_CONTEXT + "/advanced/redirect.jsp?topic=/com.ibi.help/help.htm#edithelp_mrappleteditor";
		var specs = "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400";
		
		window.open(url, "_blank", specs, true);
	},
	
	

	_onFindButtonCloseAction:function(e)
	{
		this._toggleFindReplace(e);
	},
	
	
	
	_getItemSummary:function(ibfsPath)
	{			
		var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
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
				var rCanChangeServerProps = el.attr("canchangeserverprops");

				this.folderPath = rPath;
				this.fullName = rName + "." + rExtension;
				this.itemName = rName;
				this.extension = rExtension;
				this.itemDescription = rDescription;	
				this.tool = rTool;
				this.type = rType;				
				this.canchangeserverprops = rCanChangeServerProps == "true";

				if(this.canchangeserverprops)
					this._menuOptions.show();
				else
					this._menuOptions.hide();
				
				var item_content = $("item_content", data);
				el = $(item_content);				
				var fText = el.text();
				fText = this._decodeCDATAEncoding(fText);
				this.fexText = fText;					
				this.ace_editor.setValue(fText, -1);//this._txtArea.ibxWidget("option", "text", fText);
				
				this.element.ibxWidget("option", "captionOptions", {text: this.folderPath + "/" + this.itemDescription});
	 			this._setCursorPositionInfo();
	 			this.ace_editor.focus();
	 			
	 			this._setEditorChanged(false);
	 			this.optionsChanged = false;
			});
	},
	
	_decodeCDATAEncoding:function (text)
	{
		
		text = text.replace(/IBI_CDATA_START_PATTERN/g, "<![CDATA");
		text = text.replace(/IBI_CDATA_END_PATTERN/g, "]]>");	
		
		return text;
	},
	
	_getNewTabName:function()
	{
		return new Date().getTime();
	},
	
	_getEditorEnv:function(ibfsPath)
	{			
		var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
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
				var status =  $("status", data);
				el = $(status);
				var result =  el.attr("result");

				if(result != "success")
				{
					if (result != "n/a")
					{
						var message = el.attr("message");
						
						var options = 
						{
							type:"std error",
							caption:ibx.resourceMgr.getString("BT_ERROR"),
							buttons:"ok",
							messageOptions:
							{
								text:sformat(ibx.resourceMgr.getString("BT_EDA_ERROR2"), message)
							}
						};
						var dlg = $.ibi.ibxDialog.createMessageDialog(options);
						dlg.ibxDialog("open");	
					}
					return;
				}
				else
				{
					var servers = $("server", data);
					
					servers.each(function(idx, el)
					{
						el = $(el);
						
						var srv = el.attr("name");					
						this.editor_options.servers.push(srv);
						
					}.bind(this));
					
					var defServerElement = $("defServer", data);
					el = $(defServerElement);
					
					var defServer = el.attr("name");
					var isChecked = el.attr("assigned") == "true";
					
					this.editor_options.server = defServer;
					this.editor_options.srvChk = isChecked;

					
					var defAppElement = $("defApp", data);
					el = $(defAppElement);
					
					var defApp = el.attr("name");
					var isAppChecked = el.attr("assigned") == "true";
					
					this.editor_options.appPath = defApp;
					this.editor_options.appChk = isAppChecked;					
					
					var paramPromptElement = $("paramPrompt", data);
					el = $(paramPromptElement);
					var paramPrompt = el.attr("value") == "true";					
					this.editor_options.paramPrompt = paramPrompt;
					
					var casterStdAloneElement = $("casterStdAlone", data);
					el = $(casterStdAloneElement);
					var casterStdAlone = el.attr("value") == "true";	
					this.editor_options.casterStdAlone = casterStdAlone;
					
					if(this.editor_options.casterStdAlone)
						this.extension = "htm";					
					
					var autoLinkTargetElement = $("autoLinkTarget", data);
					el = $(autoLinkTargetElement);
					var autoLinkTarget = el.attr("value") == "true";	
					this.editor_options.autoLinkTarget = autoLinkTarget;
				}           		
				
			}.bind(this));
	},	
	
	
	_doRun: function(e)
	{
		var randomnum = Math.floor(Math.random() * 100000);	
		var fexText = this.ace_editor.getValue();//this._txtArea.ibxWidget('option', 'text');
		var width = 800;
		var height = 600;
		var top = (screen.height-height)/2;
		var left = (screen.width-width)/2; 	 		
		
		var action = this.postFormActionHandler;

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
		options.fields[IBI_random]=randomnum;
		
		if (!this.newDoc)
	    {
			options.fields["IBFS_edItem_path"] = this.folderPath + "/" + this.itemName + "." + this.extension;
	    }
		
		var form = $("<form>").ibxForm(options).ibxForm("submit", doc);
	},
	
	_onSaveAs:function(e)
	{		           
		var saveFileTypes = [[ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],
					         [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
					         [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"],	
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
			                 [ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],			                 		                     
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],		
					         [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],
							 [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"]];
			
		if(this.folderPath.indexOf("/WFC/") < 0)
			saveFileTypes = [[ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],
					         [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
					         [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"],	
			                 [ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
			                 [ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],			                 
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],
		                     [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],	
					         [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],		                     
							 [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"]];

		if (this.folderPath.indexOf("/WFC/") != -1) 			    
		{			    	
			if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
				saveFileTypes.push([ibx.resourceMgr.getString(this._getEditorFormatName("prop")), "prop"]);
			    	
			if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
				saveFileTypes.push([ibx.resourceMgr.getString(this._getEditorFormatName("man")), "man"]);		    	
		}	
		
		var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		saveDlg.ibxWidget({
			fileTypes:saveFileTypes, 
			dlgType:"save", 
			title: ibx.resourceMgr.getString("bid_save_as"), 
			ctxPath:this.folderPath.length > 0 ? this.folderPath : this.rootPath,
			rootPath:this.rootPath});
		
		saveDlg.ibxWidget('open');
		
		saveDlg.ibxWidget('fileName', this.itemName);
        saveDlg.ibxWidget('fileTitle', this.itemDescription);
		
		saveDlg.data("mode", "saveas");
		
		saveDlg.on("ibx_close", function (e, closeData)
		{						
			if(closeData == "ok") 
			{
				this._saveResource(e, saveDlg);
			}
			
		}.bind(this));
		
	},
	
	_onSave:function(e)
	{				
		if (!this.changed && !this.optionsChanged && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		if (this.newDoc)
		{			
			var saveFileTypes = [[ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
						         [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
						         [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"],
				                 [ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],			                 						         
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],
						         [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],			                     
								 [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"]];

				
			if(this.folderPath.indexOf("/WFC/") < 0)
				saveFileTypes = [[ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
						         [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
						         [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"],	
				                 [ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],
			                     [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],	
						         [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],			                     
								 [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"]];

			if (this.folderPath.indexOf("/WFC/") != -1) 			    
			{			    	
				if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
					saveFileTypes.push([ibx.resourceMgr.getString(this._getEditorFormatName("prop")), "prop"]);
				    	
				if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
					saveFileTypes.push([ibx.resourceMgr.getString(this._getEditorFormatName("man")), "man"]);		    	
			}		
			
			var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
			saveDlg.ibxWidget({
				fileTypes:saveFileTypes, 
				dlgType:"save", 
				title: ibx.resourceMgr.getString("bid_save_as"), 
				ctxPath: this.folderPath,
				rootPath:this.rootPath});
			
			saveDlg.ibxWidget('open');
			
			saveDlg.on("ibx_close", function (e, closeData)
			{						
				if(closeData == "ok") 
				{
					this._saveResource(e, saveDlg);
				}
				
			}.bind(this));			
		}
		else
		{
			this._saveResource(null);
		} 	
	},
	
	_doSave:function(mode)
	{
		if (!this.changed && !this.optionsChanged && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		var fexText = this.ace_editor.getValue();//this._txtArea.ibxWidget('option', 'text');
	 	var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument = {};
	 	
	 	argument["BIP_REQUEST_TYPE"] = "BIP_EDITOR_SAVE";		

	 	argument["folder"] = this.folderPath;
	 	argument["itemName"] = this.itemName;	 	
	 	argument["itemDesc"] = this.itemDescription;
	 	argument["newItem"] = this.overWrite ? false : this.newDoc;
	 	argument["iaSave"] = this.iaSave;
		if (mode == "saveas" && this.iaSave)
		{
			argument["mode"] = mode;
			argument["oldname"] = this.orgName;
		}
	 	argument["extension"] = this.extension;
	 	argument["paramPrompt"] = this.editor_options.paramPrompt;
	 	argument["fexData"] = encodeURIComponent(fexText); 	
		if (this.editor_options.srvChk)
			argument["server"] = this.editor_options.server;
		if (this.editor_options.appChk)
			argument["appPath"] = this.editor_options.appPath;
	 	argument["myReport"] = false;
	 	argument["IBI_random"] = randomnum;
	 	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();		

	 	$.post(uriExec, argument)  
	 		.done(function( data ) 
	 		{
	 			this._gotSaveResponse(data);	 			
	 		}.bind(this));
	},
	
	_saveSetup:function(mode)
	{	
		if (!this.closing)	
		{
			this.fexText = this.ace_editor.getValue(); //this._txtArea.ibxWidget('option', 'text');
		}
		var summary = null;
		this.iaSave = false;
		this.toolLost = false;

		if ((!this.newDoc || mode=="saveas") && this.tool &&  (this.tool != "editor" && this.tool != "htmlcanvas"))		
		{

			var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
			var randomnum = Math.floor(Math.random() * 100000);	
			var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_FOCEXEC_IA_PARSE",		
		 		ibfsPath: this.folderPath + "/" + this.fullName,
		 		fexText:this.fexText,
		 		repType:this.type,		 		
		 		IBI_random: randomnum				 		
		 	};
	 	
			$.get({	"url": uriExec,	"context": this,"data": argument})
				.done(function( data ) 
				{				
					var status =  $("status", data);
					el = $(status);
					var result =  el.attr("result");

					if(result != "success")
					{	
						var options = 
						{		
							type:"std question",
							caption:ibx.resourceMgr.getString("BT_MESSAGE"),
							buttons:"okcancel",
							moveable:false,
							closeButton:false,
							messageOptions:{text:ibx.resourceMgr.getString("BT_LOSE_TOOL")}
						};
						
						var dlg = $.ibi.ibxDialog.createMessageDialog(options);						
						dlg.ibxDialog("open");
						
						dlg.on("ibx_close", function (e, closeData)
						{						

							if (closeData == "ok") 
							{
								this.iaSave = false;
								this.toolLost = true;
								this._doSave();				
				            }
						}.bind(this));
					}
					else
					{
						this.iaSave = true;
						this._doSave(mode);
					}

				}.bind(this));
		}
		else
		{
			this._doSave(mode);
		}
	},

	_saveResource:function(e, saveDlg)
	{	
		var mode = null;

		if (saveDlg != null)  // this routine can be called via a dialog or straight (with a null event)
		{			
			mode = saveDlg.data("mode");
			
			var fileName = saveDlg.ibxWidget('fileName');	
			var fileTitle = saveDlg.ibxWidget('fileTitle');				
			var path = this._checkPath( saveDlg.ibxWidget('path') );
			var fileExists = saveDlg.ibxWidget('fileExists');

			if (mode == "saveas")
			{	   
				this.newDoc = true;
				this.orgName = this.itemName;
			}
			
	        if (!fileName)
	        {
	        	this.currentAction = 0;
	        	if (this.newWindow && this.fromClose)
	        	{
	        		window.close();
	        	}
	        	return;
	        }
	        
	        if (path.split("/").length <= 3)
	        {
	        	// navigated to WFC root, to which items are forbidden
				var options = 
				{
					type:"std error",
					caption:ibx.resourceMgr.getString("BT_ERROR"),
					buttons:"ok",
					messageOptions:
					{
						text:ibx.resourceMgr.getString("BT_NO_ROOT_SAVE")
					}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);
				dlg.ibxDialog("open");
	        	return;
	        }
	        
	        if (fileTitle.charAt(0) == '~') // SEC-56 - ibfs uses '~' as prefix for mycontent folders
	        {
				var options = 
				{
					type:"std error",
					caption:ibx.resourceMgr.getString("BT_ERROR"),
					buttons:"ok",
					messageOptions:
					{
						text:ibx.resourceMgr.getString("BT_INVALID_STR_CHAR")
					}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);
				dlg.ibxDialog("open");
	        	e.preventDefault();
	        	return;
	        }
           
	        if (fileExists)
        	   this.overWrite = true;
	           	
	        this.itemDescription = fileTitle;
    
	        var extSeparatorIdx = fileName.lastIndexOf(".");
	        var pathSeparatorIdx = fileName.lastIndexOf("/");
    
	        this.itemName = fileName.substring(pathSeparatorIdx + 1, extSeparatorIdx);
	        this.extension = fileName.substring(extSeparatorIdx + 1);   // do not include '.'
	        this.folderPath = path;
   
	        if (!e || !this.closing)	// cannot access caption during closing
	        	this.element.ibxWidget("option", "captionOptions", {text: this.folderPath + "/" + this.itemDescription});
		}

		this._saveSetup(mode);     
		
		this.overWrite = false;
	},
	
	_gotSaveResponse:function(data)
	{
		if (this.newDoc)
		{			
			if(this._callbackFunc)
			{
				this._callbackFunc.call();
			}
						
			$(document).dispatchEvent( 'FORCE_ACTION_ON_CURRENT_FOLDER', {"detail":this.folderPath} );			
		}
		else
		{		
			if (!this.closing)
			{
				this.ace_editor.focus();
				this.element.ibxWidget("option", "captionOptions", {text: this.folderPath + "/" + this.itemDescription});
			}
		}
		
		this.newDoc = false;
		this._setEditorChanged(false);
		this.optionsChanged = false;
		
		this._setEditorMode();
		
		if(this.currentAction == 1)
		{
			this.currentAction = 0;		
			this._clearEditorEnvironment();
			this.newDoc = true;
			this.ace_editor.focus();
			this._setCursorPositionInfo();
		}
		else if(this.currentAction == 2)
		{
			this.currentAction = 0;
			this._onOpenDialog();
		}
		else if(this.currentAction == 3)
		{
			this.currentAction = 0;
			this._clearEditorEnvironment();
			this.ace_editor.focus();
			this._setCursorPositionInfo();
		}
		else if(this.currentAction == 4)
		{
			this._clearEditorEnvironment();
			this.currentAction = -1;
			this.close();      
		}
	},
	
	
	_onNew:function(e)
	{	
		this._onClose(e);
	},
	
	_onClose:function(e)
	{
		
		if (this.changed || this.optionsChanged)
		{
			var options = 
			{		
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_yes"));
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_no"));
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_cancel"));
			
			dlg.ibxDialog("open");
			
			dlg.on("ibx_apply", function(e, closeData)
			{
				// NO
				dlg.ibxWidget("close");
				
				this.currentAction = 0;
				this._clearEditorEnvironment(e);
				this.newDoc = true;
				this.editor_options.newDoc = true;
		 		this.ace_editor.focus();
		 		this._setCursorPositionInfo(e);
				
			}.bind(this)).on("ibx_close", function (e, closeData)
			{
				if (closeData == "ok") // YES
				{
					if (!this.iaMode )
					{
	                    this.fromClose = true;
					}
	                this.closing = true;							
					this.fexText = this.ace_editor.getValue();
					this._onSave(e);				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			this.ace_editor.focus();
				}

			}.bind(this));
		}
		else
		{
			this._clearEditorEnvironment(e);
			this.newDoc = true;
	 		this.ace_editor.focus();
	 		this._setCursorPositionInfo(e);
		}
	},

	_onExit:function(e)
	{
		if (this.changed || this.optionsChanged)
		{
			var options = 
			{		
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_yes"));
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_no"));
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_cancel"));
			
			dlg.ibxDialog("open");
			
			dlg.on("ibx_apply", function(e, closeData)
					{
						// NO				
						dlg.ibxWidget("close");
						this._clearEditorEnvironment(e);
						this.currentAction = -1;
						this.close();
						
					}.bind(this)).on("ibx_close", function (e, closeData)
					{
						
						this._onExitResult(closeData);
						
					}.bind(this));		
		}
		else
		{			
			this._clearEditorEnvironment(e);
			this.currentAction = -1;
			this.close();
		}
	},
	
	_onExitResult:function(closeData)
	{
		if (closeData == "ok") // YES
		{
            this.fromClose = true;
            this.closing = true;							
			this.fexText = this.ace_editor.getValue(); 
			this._onSave();		
			this._clearEditorEnvironment();
			this.currentAction = -1;
			this.close();
        }				
		else if (closeData == "cancel") // CANCEL
		{	
			this.currentAction = 0;
 			this.ace_editor.focus();
		}
	},
	
	_selectionToUpperCase:function(e)
	{
		this.ace_editor.toUpperCase();			
		this._setEditorChanged(true);
		this._setCursorPositionInfo(e);
	},
	
	_selectionToLowerCase:function(e)
	{
		this.ace_editor.toLowerCase();			
		this._setEditorChanged(true);
		this._setCursorPositionInfo(e);
	},
	
	_selectAll:function(e)
	{
		this.ace_editor.focus();		
		this.ace_editor.selection.selectAll();		
	},
	
	_deleteSelectedText:function(e)
	{
		var selectedRange = this.ace_editor.selection.getRange();		
		this.ace_editor.getSession().getDocument().remove(selectedRange);		
		this._setEditorChanged(true);
		this._setCursorPositionInfo(e);
	},
	
	_redoEditor:function(e)
	{
		if(this.ace_editor.getSession().getUndoManager().hasRedo())
		{			
			this.ace_editor.getSession().getUndoManager().redo();
			this._setEditorChanged(true);
		}
		
		if(!this.ace_editor.getSession().getUndoManager().hasRedo())
			this._editRedo.ibxWidget("option", "disabled", true);
		
		if(this.ace_editor.getSession().getUndoManager().hasUndo())
			this._editUndo.ibxWidget("option", "disabled", false);
		else
			this._editUndo.ibxWidget("option", "disabled", true);
	},
	
	_undoEditor:function(e)
	{
		if(this.ace_editor.getSession().getUndoManager().hasUndo())
		{
			this.ace_editor.getSession().getUndoManager().undo();
			this._setEditorChanged(true);
		}
		
		if(!this.ace_editor.getSession().getUndoManager().hasUndo())
			this._editUndo.ibxWidget("option", "disabled", true);
			
		
		if(this.ace_editor.getSession().getUndoManager().hasRedo())
			this._editRedo.ibxWidget("option", "disabled", false);
		else
			this._editRedo.ibxWidget("option", "disabled", false);
	},
	
	_setEditorChanged:function(status)
	{
		this.changed = status;
		
		if(status)
		{
			this._editUndo.ibxWidget("option", "disabled", false);
		}
		else
		{
			this._resetUndoManager();
		}
	},
	
	_resetUndoManager:function()
	{
		this.ace_editor.getSession().getUndoManager().reset();
		
		this._editUndo.ibxWidget("option", "disabled", true);
		this._editRedo.ibxWidget("option", "disabled", true);
	},
	
	_clearEditorEnvironment:function(e)
	{
		this.currentAction = 0;
		this.fullItemPath = "";
		this.ace_editor.setValue("", -1);//this._txtArea.ibxWidget("option", "text", "");
		
		this.folderPath = this.defaultFolderPath;
		this.fullName = "";
		var parts = [];
		this.itemName = "";
		this.extension = "";
		this.itemDescription = "";
		this._setEditorChanged(false);
		this.optionsChanged = false;
	    this.fromClose = false;
		this.canchangeserverprops = true;
		this._menuOptions.show();
		this._setEditorMode();
		
	    this.editor_options = {
				"fType":"",
				"newDoc":true,
				"servers":[],
				"srvChk":false, 
			  	"server":"",
			  	"appChk":false,
			  	"appPath":"",
			  	"myReport":false,
			  	"paramPrompt":true,
			  	"roPath":"" 
			  };

		//this.unDoText = [];
		
		this.element.ibxWidget("option", "captionOptions", {text: ibx.resourceMgr.getString("BT_UNTITLED")});
	},
	
	_setCursorPositionInfo:function(e)
	{		
		var contentLength =  this.ace_editor.session.getValue().length;		
		var lineCount = this.ace_editor.session.getLength();
		var cursor = this.ace_editor.selection.getCursor();		
		var linePosition = cursor.row +1;		
		var columnPosition = cursor.column +1;
	
		this._lengthLbl.ibxWidget("option", "text", contentLength);
		
		this._linesLbl.ibxWidget("option", "text", lineCount);
		
		this._linePosLbl.ibxWidget("option", "text", linePosition);
		
		this._columnPosLbl.ibxWidget("option", "text", columnPosition);
	},
	
	_toggleGoToLine:function(e)
	{
		this.ace_editor.execCommand("gotoline");
		/*
		var isVisible = this._goToLine.is(":visible");
		
		if (isVisible)
		{
	    	this._txtGoToLine.ibxWidget("option", "text", "");
	    	this._goToLine.hide();
			this.ace_editor.focus();
			return;
		}
		
		this._goToLine.show();		
		this._txtGoToLine[0].focus();		
		*/
	},
	
	_onTxtGoToLineKeyup:function(e)
	{
		var code = e.keyCode || e.which;
		
	    if(code == $.ui.keyCode.ENTER)
	    {
	        this._actionGoToLine(e);
	        return;
	    }
	    
	    var lineNumber = this._txtGoToLine.ibxWidget("option", "text");

	    if(isNaN(lineNumber))
	    {
	    	lineNumber = lineNumber.length > 1 ? lineNumber.substring(0, lineNumber.length-1) : "";
	    	this._txtGoToLine.ibxWidget("option", "text", lineNumber);
	    }
	},
	
	_actionGoToLine:function(e)
	{
		var lineNumber = this._txtGoToLine.ibxWidget("option", "text");

		if(isNaN(lineNumber)) 
		{
			return;
		}

		this.ace_editor.gotoLine(lineNumber);
		
		this._toggleGoToLine(e);
		this._setCursorPositionInfo(e);
	},
	
	_toggleFindReplace:function(e)
	{
		
		this.ace_editor.execCommand("find");
		
		/*
		var isVisible = this._findReplace.is(":visible");
		
		if (isVisible)
		{
			this._findReplace.hide();
			this.ace_editor.focus();
			return;
		}

		var selection = this.ace_editor.session.getTextRange(this.ace_editor.getSelectionRange());
		
		if(selection.length > 0)
		{
			this._findText.ibxWidget("option", "text", selection);
			
			this._btnFind.ibxWidget("option", "disabled", false);
			this._btnFindPrevious.ibxWidget("option", "disabled", false);
			this._btnReplace.ibxWidget("option", "disabled", false);	
			this._btnReplaceAll.ibxWidget("option", "disabled", false);	
		}
						
		this._findReplace.show();		
		this._findText.focus();		
		*/
	},
	
	_tchange:function(e)
	{
		var text = this._findText.ibxWidget("option", "text");

		if (text.length == 0)
		{
			this._btnFind.ibxWidget("option", "disabled", true);
			this._btnFindPrevious.ibxWidget("option", "disabled", true);
			this._btnReplace.ibxWidget("option", "disabled", true);
			this._btnReplaceAll.ibxWidget("option", "disabled", true);
		}
		else
		{
			this._btnFind.ibxWidget("option", "disabled", false);
			this._btnFindPrevious.ibxWidget("option", "disabled", false);
			this._btnReplace.ibxWidget("option", "disabled", false);
			this._btnReplaceAll.ibxWidget("option", "disabled", false);
		}
	},
	
	_find:function(e)
	{		
		/*
		var dlg;
		var idx;
		
		var ea = this._txtArea[0].firstChild;
		var cs = this._cbMatchCase.ibxWidget("checked");
		var eaValLC = cs? ea.value : ea.value.toLowerCase();
		
		var ft = cs ? this._findText.ibxWidget("option", "text") : this._findText.ibxWidget("option", "text").toLowerCase();
		
		var ftLen = ft.length;
		var eaValLCLen = eaValLC.length;
		
		var selStart = ea.selectionStart;
		var selEnd = ea.selectionEnd;
			
		if(selStart != selEnd) // selection found
		{
			selStart ++; // search ONE charachter forward
			// selStart += ftLen; // search after ENTIRE previously found result
		}
		
		if(selStart == eaValLCLen || selStart > eaValLCLen) // wrap around
		{ 
			selStart = 0;
		}

		idx = eaValLC.indexOf(ft, selStart);
		
		if (idx == -1)
		{
			idx = eaValLC.indexOf(ft, 0);
		}
			
		if (idx != -1)
		{	
			
			ea.setSelectionRange(idx, idx + ftLen);
			ea.focus();								// need this for FF
			//ea.setFocused(true);	// need this for Chrome				

			
			this._setCursorPositionInfo(e);
					
			if(isChrome) //hack for chrome scrolling
			{			
				var rowHeight = 15;
				//var linePosition = this.linePosLbl.getText();
				var linePosition = this._linePosLbl.ibxWidget("option", "text");
				
				if(linePosition > 0)
					linePosition -= 1;
				
				var scrollPosition = rowHeight * linePosition;
				
				ea.scrollTop = scrollPosition;
			}
			
			this._btnFind.ibxWidget("option", "disabled", false);
			this._btnFindPrevious.ibxWidget("option", "disabled", false);
			this._btnReplace.ibxWidget("option", "disabled", false);
			this._btnReplaceAll.ibxWidget("option", "disabled", false);
		}
		else
		{
			this._btnFind.ibxWidget("option", "disabled", true);
			this._btnFindPrevious.ibxWidget("option", "disabled", true);
			this._btnReplace.ibxWidget("option", "disabled", true);
			this._btnReplaceAll.ibxWidget("option", "disabled", true);

			var options = 
			{
				type:"std error",
				caption: ibx.resourceMgr.getString("BT_ERROR"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("bid_textNotFound2"), ft)
				}
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");			
		}
		*/
	},

	_findPrev:function(e)
	{	
		/*
		var dlg;
		var idx;
		
		var ea = this._txtArea[0].firstChild;
		var cs = this._cbMatchCase.ibxWidget("checked");
		var eaValLC = cs? ea.value : ea.value.toLowerCase();
		var ft = cs ? this._findText.ibxWidget("option", "text") : this._findText.ibxWidget("option", "text").toLowerCase();
		
		var ftLen = ft.length;
		var eaValLCLen = eaValLC.length;
		var selStart = ea.selectionStart;
		var selEnd = ea.selectionEnd;

		if(selStart == 0) // wrap around
		{ 
			selStart = eaValLCLen;
		}
		
		if(selStart == selEnd) // no selection
		{
			if(selStart-ftLen < 0) // lastIndexOf(string, x) search inclusive position x
			{
				selStart = eaValLCLen;
			}
			else
			{
				selStart -= ftLen; //  search for result that located ENTIRELY BEFORE CURSOR
			}
		}
		else // selection found, the result CAN be located ONE character BEFORE SELECTION.
		{
			if(selStart > 0) // lastIndexOf(string, x) search inclusive position x
			{
				selStart --;  // search ONE charachter backward
			}
			
//			if(selStart > ftLen) // lastIndexOf(string, x) search inclusive position x
//			{
//				selStart -= ftLen; // search for result that located ENTIRELY BEFORE SELECTION.
//			}

		}
		
		idx = eaValLC.lastIndexOf(ft, selStart);
		
		if (idx == -1) // wrap around to search the remainder of text
		{
			idx = eaValLC.lastIndexOf(ft, eaValLCLen);
		}
		
		if (idx != -1)
		{
	
			ea.setSelectionRange(idx, idx + ftLen);
			ea.focus();								// need this for FF
			//ea.setFocused(true);	// need this for Chrome		
			
			this._setCursorPositionInfo(e);
			
			if(isChrome) //hack for chrome scrolling
			{			
				var rowHeight = 15;
				var linePosition = this._linePosLbl.ibxWidget("option", "text");
				
				if(linePosition > 1)
					linePosition -= 1;
				
				var scrollPosition = (rowHeight * linePosition) - rowHeight;
				
				ea.scrollTop = scrollPosition;
			}
			
			this._btnFind.ibxWidget("option", "disabled", false);
			this._btnFindPrevious.ibxWidget("option", "disabled", false);
			this._btnReplace.ibxWidget("option", "disabled", false);
			this._btnReplaceAll.ibxWidget("option", "disabled", false);

		}
		else
		{
			this._btnFind.ibxWidget("option", "disabled", true);
			this._btnFindPrevious.ibxWidget("option", "disabled", true);
			this._btnReplace.ibxWidget("option", "disabled", true);
			this._btnReplaceAll.ibxWidget("option", "disabled", true);

			var options = 
			{
				type:"std information",
				caption:ibx.resourceMgr.getString("BT_MESSAGE"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("bid_textNotFound2"), ft)
				}
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");	
			
		}
*/		
	},

	_replace:function(e)
	{
		/*
		this.unDoText.push(this._txtArea.ibxWidget("option", "text"));
		this._btnUndo.ibxWidget("option", "disabled", false);
		
		var ea = this._txtArea[0].firstChild;
		var ft = this._findText.ibxWidget("option", "text");
		var replText = this._replaceText.ibxWidget("option", "text");
		var ftLen = ft.length;
		this._setEditorChanged(true);
		
		if (document.selection)
		{
			this.textRange.text = replText;
//			this.textRange = ea.createTextRange();
		}
		else
		{
			var val = ea.value; 
		    var selStart = ea.selectionStart;
		    ea.value = val.slice(0, selStart) + replText + val.slice(ea.selectionEnd);        
		    ea.selectionEnd = selStart + replText.length;
		}
		this._btnReplace.ibxWidget("option", "disabled", true);
		*/
	},

	_replaceFind:function(e)
	{
		this._replace(e);
		//this.find(e);
	},

	_replaceAll:function(e)
	{
		/*
		this.unDoText.push(this._txtArea.ibxWidget("option", "text"));
		this._btnUndo.ibxWidget("option", "disabled", false);
		
		this._setEditorChanged(true);
		
		var cs = this._cbMatchCase.ibxWidget("checked");		
		var ft = this._findText.ibxWidget("option", "text");
		var replText = this._replaceText.ibxWidget("option", "text");
		
		var text = this._txtArea.ibxWidget("option", "text");
		var text2 = "";
		
		if(cs)
		{
			text2 = text.replace(new RegExp(ft, 'g'), replText);
		}
		else
		{
			text2 = text.replace(new RegExp(ft, "ig"), replText);
		}
			
		if (text2 != text)
		{
			this._txtArea.ibxWidget("option", "text", text2);
		}
		*/
	},

	_onOptions:function(e)
	{	
		
		this._editorOptionsDlg = ibx.resourceMgr.getResource('.text-editor-options', true);
		
		this._editorOptionsDlg.ibxWidget("option", "captionOptions", {text: ibx.resourceMgr.getString("bid_editor_options")});
		this._editorOptionsDlg.ibxWidget({buttons:"okcancelapply"});
		
		this._editorOptionsDlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_OK"));
		this._editorOptionsDlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_reset"));
		this._editorOptionsDlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_cancel"));
		
		this._editorOptionsDlg.ibxWidget('open');		
		
		this._initOptions();		
		
		this._editorOptionsDlg.on("ibx_apply", function(e, closeData)
		{
			// RESET			
			this._resetOptions();
			
		}.bind(this)).on("ibx_beforeclose", function (e, closeData)
		{						
			if(closeData == "ok")
			{
				this._gatherOptions(this._editorOptionsDlg);
				this.ace_editor.focus();
			}	
			else
			{
				// Cancel
				this.ace_editor.focus();
			}
		}.bind(this));
	},
	
	_initOptions:function()
	{	
		var servers = this.editor_options.servers;
		var defServer = this.editor_options.server;
		
		var srvList = this._editorOptionsDlg.ibxWidget("member", "_srvList");
		srvList.ibxWidget("remove", ".ibx-select-item", true);
		
	 	function sortServers(name1, name2)
	 	{
	 		return (name1 < name2 ? -1 : (name1 > name2 ? 1 : 0));
	 	}
	 	
	 	servers = servers.sort(sortServers);

		for (var i = 0; i < servers.length; i++)
		{
			var srv = servers[i];
			var selected = (defServer && srv == defServer);

			var selItem = $("<div>").ibxSelectItem({text: srv, userValue: srv, selected: selected});
			srvList.ibxSelect("addControlItem", selItem);
		}
		
		this._editorOptionsDlg.ibxWidget("member", "_srvChk").ibxWidget("checked", this.editor_options.srvChk);

		if (this.editor_options.srvChk)
		{
			srvList.ibxWidget("option", "disabled", false);
		}

		this._editorOptionsDlg.ibxWidget("member", "_appChk").ibxWidget("checked", this.editor_options.appChk);


		if (this.editor_options.appChk)
		{
			this._editorOptionsDlg.ibxWidget("member", "_avlAppList").ibxWidget("option", "disabled", false);
			this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("option", "disabled", false);
		}
		else
		{
			this._editorOptionsDlg.ibxWidget("member", "_avlAppList").ibxWidget("option", "disabled", true);
			this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("option", "disabled", true);
		}
		
		var defApp = this.editor_options.appPath;
		
		var appParts = defApp.split(" ");
		
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		selAppList.ibxWidget("remove", ".ibx-select-item", true);
		
		for (var k = 0; k < appParts.length; k++)
		{
			var selApp = appParts[k];

			//selApp = decodeHtmlEncoding(selApp); //:TODO
			
			if (selApp.length > 0)
			{
				var selItem = $("<div>").ibxSelectItem({text: selApp, userValue: selApp});
				selAppList.ibxSelectItemList("add", selItem);
			}
		}
		
		this._editorOptionsDlg.ibxWidget("member", "_paramPrompt").ibxWidget("checked", this.editor_options.paramPrompt);

		this._editorOptionsDlg.ibxWidget("member", "_srvChk").on("click", this._srvChkChange.bind(this));
		this._editorOptionsDlg.ibxWidget("member", "_appChk").on("click", this._appChkChange.bind(this));
		this._editorOptionsDlg.ibxWidget("member", "_srvList").on("ibx_change", this._srvListChange.bind(this));
		
		this._editorOptionsDlg.ibxWidget("member", "_appBtn").on("click", this._getAppsServerAccess.bind(this));
		this._editorOptionsDlg.ibxWidget("member", "_selAppBtn").on("click", this._addApp.bind(this));		
		this._editorOptionsDlg.ibxWidget("member", "_delAppBtn").on("click", this._delApp.bind(this));
		
		this._editorOptionsDlg.ibxWidget("member", "_avlAppList").on("dblclick", this._addApp.bind(this));
		this._editorOptionsDlg.ibxWidget("member", "_selAppList").on("dblclick", this._delApp.bind(this));
		
		this._editorOptionsDlg.ibxWidget("member", "_appUp").on("click", this._upApp.bind(this));
		this._editorOptionsDlg.ibxWidget("member", "_appDown").on("click", this._dwnApp.bind(this));
	},
	
	_getAppsServerAccess:function()
	{		
		var sa = new ServerAccess();
		var currentServer = this._editorOptionsDlg.ibxWidget("member", "_srvList").ibxWidget("userValue");
		sa.checkCredentials(currentServer, this._getApps.bind(this), "", false);
	},
	
	_resetOptions:function()
	{
		this._optionsChanged = false;
		
		var path = this.options.newDoc ? this.folderPath : this.folderPath + "/" + this.fullName; 

		this._getEditorEnv(path);
		
		var srvList = this._editorOptionsDlg.ibxWidget("member", "_srvList");
		srvList.ibxWidget("remove", ".ibx-select-item", true);
		
		var avlAppList = this._editorOptionsDlg.ibxWidget("member", "_avlAppList");
		avlAppList.ibxWidget("remove", ".ibx-select-item", true);
		
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		selAppList.ibxWidget("remove", ".ibx-select-item", true);

		this._editorOptionsDlg.ibxWidget("member", "_appChk").ibxWidget("checked", false);

		this._initOptions();
	},
	
	_gatherOptions:function(optionsDlg)
	{		
		if (!optionsDlg)
		{
			return;
		}
		else 
		{
			this.optionsChanged = true;
			this.editor_options.paramPrompt = this._editorOptionsDlg.ibxWidget("member", "_paramPrompt").ibxWidget("checked");
			this.editor_options.srvChk = this._editorOptionsDlg.ibxWidget("member", "_srvChk").ibxWidget("checked");
			this.editor_options.appChk = this._editorOptionsDlg.ibxWidget("member", "_appChk").ibxWidget("checked");
					
			this.editor_options.server = this._editorOptionsDlg.ibxWidget("member", "_srvList").ibxWidget("userValue");

			this.editor_options.appPath = "";
						
			var ch = this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("children");
			
			var appPathValue = "";
			
			for (var i = 0; i < ch.length; i++)
			{
				var aP = ch[i];
				var aPText = $(aP).ibxWidget("userValue");

				if (i == 0)
				{
					appPathValue = aPText;
				}
				else
				{
					appPathValue += (" " + aPText);
				}
			}
			
			this.editor_options.appPath = appPathValue;
		}

	},	

	_upApp:function(e)
	{		
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		var selApp = selAppList.ibxWidget("selected");

		if(!selApp || selApp.length != 1)
			return;
		
		var prevSibling = selApp.prev();
		
	    if(prevSibling.length == 1) 
		{		
	    	selAppList.ibxWidget("add", selApp, prevSibling, true);
		}
	},

	_dwnApp:function(e)
	{
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		var selApp = selAppList.ibxWidget("selected");

		if(!selApp || selApp.length != 1)
			return;
		
		var nextSibling = selApp.next();
		
	    if(nextSibling.length == 1) 
		{		
	    	selAppList.ibxWidget("add", selApp, nextSibling);
		}
	},

	_addApp:function(e)
	{		
		var avlAppList = this._editorOptionsDlg.ibxWidget("member", "_avlAppList");
		var avlSelApp = avlAppList.ibxWidget("selected");

		if(!avlSelApp)
			return;
		
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		var al = avlSelApp.length;
		
		for(var i = 0; i < al; i++)
		{
	    	selAppList.ibxWidget("removeSelection");
	    	selAppList.ibxWidget("add", avlSelApp[i]);
		}
	},
	
	_delApp:function(e)
	{
		var selAppList = this._editorOptionsDlg.ibxWidget("member", "_selAppList");
		var selSelApp = selAppList.ibxWidget("selected");
		
		if(!selSelApp)
			return;
		
		var avlAppList = this._editorOptionsDlg.ibxWidget("member", "_avlAppList");

		var sl = selSelApp.length;
		
		for(var i = 0; i < sl; i++)
		{
			avlAppList.ibxWidget("removeSelection");
			avlAppList.ibxWidget("add", selSelApp[i]);
		}
		
		avlAppList.ibxWidget("sort");
	},
	
	_getApps:function() 
	{ 
		var server = this._editorOptionsDlg.ibxWidget("member", "_srvList").ibxWidget("userValue");
		if (!server)
		{
			return;
		}

		var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_GET_APPS",		
	 		server: server,
	 		IBI_random: randomnum				 		
	 	};
 	
		$.get({	"url": uriExec,	"context": this,"data": argument})
			.done(function( data ) 
			{				
				this._gotApps(data);
			});
	},
	
	_gotApps:function(data)
	{
		var avlAppList = this._editorOptionsDlg.ibxWidget("member", "_avlAppList");		
		avlAppList.ibxWidget("remove", ".ibx-select-item", true);
		
		var status =  $("status", data);
		el = $(status);
		var result =  el.attr("result");

		if(result != "success")
		{
			if (result != "n/a")
			{
				var message = el.attr("message");
				
				var options = 
				{
					type:"std error",
					caption:ibx.resourceMgr.getString("BT_ERROR"),
					buttons:"ok",
					messageOptions:
					{
						text:sformat(ibx.resourceMgr.getString("BT_EDA_ERROR2"), message)
					}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);
				dlg.ibxDialog("open");	
			}
			return;
		}
		else
		{
			var ch = this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("children");
			
			var selApps = [];
			
			for (var i = 0; i < ch.length; i++)
			{
				var aP = ch[i];
				selApps.push( $(aP).ibxWidget("userValue") );
			}

			var apps = $("app", data);
			
			apps.each(function(idx, el)
			{				
				el = $(el);
				
				var appName = el.attr("name");	
				var selected = false;

				for(var j = 0; j < selApps.length; j++ )
				{
					if(appName == selApps[j])
					{
						selected = true;
						break;
					}
				}
				
				if(!selected)
				{
					var selItem = $("<div>").ibxSelectItem({text: appName, userValue: appName});
					avlAppList.ibxSelectItemList("add", selItem);
				}
				
			}.bind(this));			
		} 
		
		avlAppList.ibxWidget("sort");
	},
	
	_srvListChange:function(e)
	{		
		this._editorOptionsDlg.ibxWidget("member", "_avlAppList").ibxWidget("remove", ".ibx-select-item", true);
		this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("remove", ".ibx-select-item", true);
	},
	
	_srvChkChange:function(e)
	{
		var isSrvChecked = this._editorOptionsDlg.ibxWidget("member", "_srvChk").ibxWidget("checked");
		this._editorOptionsDlg.ibxWidget("member", "_srvList").ibxWidget("option", "disabled", !isSrvChecked);
	},
	
	_appChkChange:function(e)
	{
		var isAppChecked = this._editorOptionsDlg.ibxWidget("member", "_appChk").ibxWidget("checked");		
		this._editorOptionsDlg.ibxWidget("member", "_avlAppList").ibxWidget("option", "disabled", !isAppChecked);
		this._editorOptionsDlg.ibxWidget("member", "_selAppList").ibxWidget("option", "disabled", !isAppChecked);
	},
	
	_getEditorFormatName:function(ext)
	{		
	    var formatName = this._supportedFormats[ext];
	    
	    return formatName;
	},
	
	_setEditorMode:function()
	{		
	    var mode = this._supportedModes[this.extension];
	    
	    if(!mode)
	    	mode = this._editorDefaultMode;
	    
	    this.ace_editor.session.setMode("ace/mode/"+mode);
		this._editorMode = mode;	    
	},
/*    
	_setDefaultCursorPosition:function(textArea)
	{
		this.ace_editor.selection.moveTo(0, 0);
		this.ace_editor.focus();
	},
*/	
	_onInsertKeyDown:function(evt) 
	{				
		var charCode = (evt.which) ? evt.which : event.keyCode;
				
		if(charCode==45)
		{
			if(this._insertKeyStatus)
			{
				this._insertKeyStatus = false;
			}
			else
			{
				this._insertKeyStatus = true;
			}
			
			this._setInsertStatusLabel();
		}
	},
	
	_setInsertStatusLabel:function()
	{
		if(this._insertKeyStatus)
		{
        	this._insertLbl.ibxWidget("option", "text", ibx.resourceMgr.getString("bid_insert_on"));
		}
		else
		{
        	this._insertLbl.ibxWidget("option", "text", ibx.resourceMgr.getString("bid_insert_off"));
		}
	},

	_checkPath:function(path)
	{
		//if(path.endsWith("/"))
		if( path.indexOf("/", path.length - 1) !== -1)
			path = path.substring(0, path.length - 1);
			
		return path;
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
//# sourceURL=ace_editor.js