/*Copyright 1996-2018 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.9 $:

jQuery.event.special['ibx_change'] = { noBubble: true };

var editorActionHandler = "/editor.bip";

$.widget("ibi.ibiAceWidget", $.ibi.ibxWidget, 
{
	options:
	{
		config:
		{
			"theme":"ace/theme/textmate",
			"mode":"ace/mode/text",
			"showFoldWidgets":true,
			"showPrintMargin":false,
			"showLineNumbers":true,
			"showGutter":true,
			"highlightActiveLine":true,
			"readOnly":false,
			"enableBasicAutocompletion": true,
	        "enableSnippets": true,
	        "enableLiveAutocompletion": true			
		},
	},
	
	_widgetClass:"wf-ace-text-editor",
	
	_create:function()
	{
		this._super();
		
		this._insertKeyStatus = false;
		
		this._ace_editor = ace.edit(this.element[0]);
		this._ace_editor.getSession().selection.on('changeCursor', this._onEditorAreaChangeCursorEvent.bind(this));				
//		this._ace_editor.textInput.getElement().addEventListener("keyup", this._onEditorAreaKeyUp.bind(this), false);
		this._ace_editor.textInput.getElement().addEventListener("keydown", this._onInsertKeyDown.bind(this), false);
		
		this._ace_editor.commands.removeCommand('find'); // disable ACE Editor's "Ctrl+f" "find" dialog	
		this._ace_editor.commands.removeCommand('gotoline'); // disable ACE Editor's "Ctrl+l" "gotoline" dialog	
/*		
		this._ace_editor.commands.addCommand({
		    name: "gotoline",
		    bindKey: {
		        win: "Ctrl-L",
		        mac: "Command-L"
		    },
		    exec: function(editor, line) {
		        return false;
		    },
		    readOnly: true
		})
*/		
	},
	
	_destroy:function()
	{
		this._super();
	},	
	
	_refresh:function()
	{
		var options = this.options;
		this._super();

		if(this._ace_editor)
		{
			this._ace_editor.setOptions(options.config);			
			this._ace_editor.resize();
		}
	},
	
	_onEditorAreaChangeCursorEvent:function (e)
	{	
		this.setCursorPositionInfo(e);
	},	
/*	
	_onEditorAreaKeyUp:function (e)
	{		
		//this._setEditorChanged(true);
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
			
			this.setInsertStatusLabel();
		}
	},
	
	editor:function()
	{
		return this._ace_editor;
	},
	
	isClean:function()
	{
		return this._ace_editor.getSession().getUndoManager().isClean();
	},
	
	setClean:function()
	{
		this._ace_editor.getSession().getUndoManager().markClean();
	},
	
	resetUndoManager:function()
	{
		this._ace_editor.getSession().getUndoManager().reset();
	},
	
	selectionToUpperCase:function(e)
	{
		this._ace_editor.execCommand("touppercase");
	},
	
	selectionToLowerCase:function(e)
	{
		this._ace_editor.execCommand("tolowercase");
	},

	editorComment:function(e)
	{
		this._ace_editor.execCommand("togglecomment");
	},
	
	editorCommentBlock:function(e)
	{
		this._ace_editor.execCommand("toggleBlockComment");
	},
	
	selectAll:function(e)
	{
		this._ace_editor.execCommand("selectall");		
	},
	
	deleteSelectedText:function(e)
	{
		var selectedRange = this._ace_editor.selection.getRange();		
		this._ace_editor.getSession().getDocument().remove(selectedRange);		
	},
	
	editorRedo:function(e)
	{
		if(this._ace_editor.getSession().getUndoManager().hasRedo())
		{			
			this._ace_editor.getSession().getUndoManager().redo();
		}
	},
	
	editorUndo:function(e)
	{
		if(this._ace_editor.getSession().getUndoManager().hasUndo())
		{
			this._ace_editor.getSession().getUndoManager().undo();
		}
	},
	
	editorCut:function(e)
	{
		this.editorCopy(e);	
		this.deleteSelectedText(e);
		this._ace_editor.focus();
	},
	
	editorCopy:function(e)
	{
		var selection = this._ace_editor.session.getTextRange(this._ace_editor.getSelectionRange());
		if(selection && selection.length > 0)
		{
			var data = {"_editorClipboardData":selection};		
			$(document).trigger("SET_EDITOR_CLIPBOARD_METADATA", data);
		}
		this._ace_editor.focus();
	},
	
	editorPaste:function(editorClipboardData)
	{
		this._ace_editor.insert(editorClipboardData);
		this._ace_editor.focus();
	},

	setInsertStatusLabel:function()
	{
		var keyStatus = this._insertKeyStatus ? ibx.resourceMgr.getString("bid_insert_on") : ibx.resourceMgr.getString("bid_insert_off");
		var data = {"insertKeyStatus":keyStatus};		
		$(document).trigger("SET_STATUS_BAR_INSERT_KEY_METADATA", data);
	},
	
	setCursorPositionInfo:function()
	{		
		var contentLength =  this._ace_editor.session.getValue().length;		
		var lineCount = this._ace_editor.session.getLength();
		var cursor = this._ace_editor.selection.getCursor();		
		var linePosition = cursor.row +1;		
		var columnPosition = cursor.column +1;
	
		//this._editorEnvironment.element.ibxWidget("member", "_lengthLbl").ibxWidget("option", "text", contentLength);
		var data = {"contentLength":contentLength, "lineCount":lineCount,"linePosition":linePosition, "columnPosition":columnPosition};
		$(document).trigger("SET_STATUS_BAR_CURSOR_METADATA", data);
	},
	
	broadcastEditorOptions:function()
	{
		var data = {"_config": this.options.config};		
		$(document).trigger("EDITOR_OPTIONS_CHANGED_EVENT", data);
	},
	
	content:function(content)
	{
		if(content)
		{
			this._ace_editor.setValue(content, -1);
		}
		else
		{
			return this._ace_editor.getValue();
		}
	}	
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$.widget("ibi.textEditorTabPage", $.ibi.ibxTabPage, 
{
	options:
	{
		nameRoot : true,
		selected : true
	},
	
	_widgetClass:"text-editor-tab-page",

	_create:function()
	{
		this._super();

	    this._editorWidget = null;
		
		this._defaultSearchOptions = {
		    backwards: false,
		    wrap: true,
		    caseSensitive: false,
		    wholeWord: false,
		    regExp: false
		};
		
		this._search = null;
		
		this.currentAction = 0; // 1-New, 2-Open, 3-Close, 4-Exit, -1-Exit unconditional

		this.defaultFolderPath = "";
		this.tool = "";
		this.type = "";
		this.mode = "";
		this._callbackFunc = null;
		
		this.fullName = "";
		this.itemName = "";
		this.extension = "";
		this.itemDescription = "";			
		this.rootPath = "";
		this.folderPath = "";
		this.fullItemPath = "";
		this.newDoc = true;
		this.linkName = true;
				
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
		this.canchangeserverprops = true;
		
		var mybutton = $("<div class='text-editor-tab-page-close-button'>").ibxButtonSimple({'glyphClasses':'ibx-icons ibx-glyph-close'});
        this._tabButton.ibxWidget("add", mybutton);
        mybutton.on("click", this._onTabCloseButton.bind(this));        
		
		this._searchPanel = ibx.resourceMgr.getResource('.te-search-panel', false);
		this.element.append(this._searchPanel);
		ibx.bindElements(this._searchPanel);	

		this._editorWidget = $("<div class=\"wf-ace-text-editor\" data-ibx-type=\"ibiAceWidget\"></div>");
		this.element.append(this._editorWidget);
		ibx.bindElements(this._editorWidget);
		
		var contextMenu = ibx.resourceMgr.getResource(".te-edit-menu");
		this._editorWidget.ibxWidget("option", "ctxMenu", contextMenu);
		
		contextMenu.find(".menu-edit-copy").on("ibx_menu_item_click", this._onMenuEditCopy.bind(this));
		contextMenu.find(".menu-edit-cut").on("ibx_menu_item_click", this._onMenuEditCut.bind(this));
		contextMenu.find(".menu-edit-paste").on("ibx_menu_item_click", this._onMenuEditPaste.bind(this));

		contextMenu.find(".menu-edit-selectall").on("ibx_menu_item_click", this._onMenuEditSelectAll.bind(this));
		contextMenu.find(".menu-edit-clear").on("ibx_menu_item_click", this._onMenuEditClear.bind(this));
		contextMenu.find(".menu-edit-uppercase").on("ibx_menu_item_click", this._onMenuEditUpperCase.bind(this));
		contextMenu.find(".menu-edit-lowercase").on("ibx_menu_item_click", this._onMenuEditLowerCase.bind(this));
		
		contextMenu.find(".menu-edit-undo").on("ibx_menu_item_click", this._onMenuEditUndo.bind(this));
		contextMenu.find(".menu-edit-redo").on("ibx_menu_item_click", this._onMenuEditRedo.bind(this));
		
		contextMenu.find(".menu-edit-comment").on("ibx_menu_item_click", this._onMenuEditComment.bind(this));
		contextMenu.find(".menu-edit-comment-block").on("ibx_menu_item_click", this._onMenuEditCommentBlock.bind(this));

	},
	
	_init:function()
	{
		this._super();
	},

	_destroy:function()
	{
		this._super();
	},
	
	_refresh:function()
	{
		this._super();
	},
	
	initEditor:function(rootPath, folderPath, itemName, mode)
	{
		this.rootPath = rootPath;
		
		if(folderPath && folderPath.length > 0)
			this.folderPath = folderPath;
		else
			this.folderPath = rootPath;
		
		this.ace_editor = this._editorWidget.ibxWidget("editor");
		
		if(mode)
		{
			var editorConfig = this._editorWidget.ibxWidget("option", "config");
			
			editorConfig.mode = mode;
			
			this._editorWidget.ibxWidget("option", "config", editorConfig);
			
			this._editorWidget.ibxWidget("refresh");
		}
		
	    if(folderPath && itemName)
	    {
	    	this._getEditorContent (folderPath, itemName);	    	
	    }
	    else
	    {
	    	this.newDoc = true;
	    }
	    
	    this._searchPanel.hide();

		this._cbMatchCase.on("ibx_change", this._onMatchCaseChange.bind(this));
		this._cbMatchWholeWord.on("ibx_change", this._onMatchWholeWordChange.bind(this));
		this._cbWrapAround.on("ibx_change", this._onWrapAroundChange.bind(this));
		
		this._btnFindNext.on("click", this._onFindNext.bind(this));
		this._btnReplaceNext.on("click", this._onReplaceNext.bind(this));	
		this._btnReplaceAll.on("click", this._onReplaceAll.bind(this));	    
		
		this._editorWidget.ibxWidget("editor").commands.addCommand({
		    name: "find",
		    bindKey: {
		        win: "Ctrl-F",
		        mac: "Command-F"
		    },
		    exec: function(editor, line) {
		        this.toggleSearchPanel();
		    }.bind(this),
		    readOnly: true
		})		
		
	    this.getStatusBarInfo();
	    
		this._editorWidget.ibxWidget("refresh");
		this.setEditorFocus();
	},	
	
	setEditorFocus:function()
	{
		this._editorWidget.ibxWidget("editor").focus();
	},
	
	getFullItemPath:function()
	{
		return this.fullItemPath;
	},
	
	_getEditorFormatName:function(name)
	{
		var data = {"_format":name};
		$(document).trigger("GET_EDITOR_FORMAT_BY_EXTENSION_EVENT", data);		
		return data._format;
	},
	
	_onTabCloseButton:function(e)
	{
		this.closeFile(e);
	},	
	
	_onMenuEditCopy:function(e)
	{
		this._editorWidget.ibxWidget("editorCopy");
	},
	
	_onMenuEditCut:function(e)
	{
		this._editorWidget.ibxWidget("editorCut");
	},
	
	_onMenuEditPaste:function(e)
	{
		$(document).trigger("PASTE_EDITOR_CLIPBOARD_METADATA");
	},
	
	_onMenuEditClear:function(e)
	{
		this._editorWidget.ibxWidget("deleteSelectedText");
	},
	
	_onMenuEditSelectAll:function(e)
	{
		this._editorWidget.ibxWidget("selectAll");
	},
	
	_onMenuEditUpperCase:function(e)
	{
		this._editorWidget.ibxWidget("selectionToUpperCase");
	},

	_onMenuEditLowerCase:function(e)
	{
		this._editorWidget.ibxWidget("selectionToLowerCase");
	},
	
	_onMenuEditUndo:function(e)
	{
		this._editorWidget.ibxWidget("editorUndo");
	},
	_onMenuEditRedo:function(e)
	{
		this._editorWidget.ibxWidget("editorRedo");
	},
	
	_onMenuEditComment:function(e)
	{
		this._editorWidget.ibxWidget("editorComment");
	},

	_onMenuEditCommentBlock:function(e)
	{
		this._editorWidget.ibxWidget("editorCommentBlock");
	},
	
	_onFindNext:function(e)
	{
		this._findNext(e);
	},
	_onReplaceNext:function(e)
	{
		this._replaceNext(e);
	},
	_onReplaceAll:function(e)
	{
		this._replaceAll(e);
	},	
	
	_onMatchCaseChange:function(e)
	{
		this._setMatchCase(e);
	},
	_onMatchWholeWordChange:function(e)
	{
		this._setMatchWholeWord(e);
	},
	_onWrapAroundChange:function(e)
	{
		this._setWrapAround(e);
	},
	
	_getEditorContent:function(folderPath, fileName)
	{		
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
		}
		
		if(this.folderPath.length > 0 && this.itemName.length > 0)
		{
			this.fullItemPath = folderPath + "/" + fileName;
			
			this._getItemSummary(this.fullItemPath);
		}
		
		if (!this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
		{	
			if(this.fullItemPath)
				this._getEditorServerEnv(this.fullItemPath);
			else
				this._getEditorServerEnv(this.folderPath);
		}
	},
	
	_getItemSummary:function(ibfsPath)
	{			
		var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
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
/*
				if(this.canchangeserverprops)
					this._editorEnvironment.element.ibxWidget("member", "_menuOptions").show();
				else
					this._editorEnvironment.element.ibxWidget("member", "_menuOptions").hide();
*/				
				var item_content = $("item_content", data);
				el = $(item_content);				
				var fText = el.text();
				fText = this._decodeCDATAEncoding(fText);
				
				this._editorWidget.ibxWidget("content", fText); 
				
				this._editorWidget.ibxWidget("resetUndoManager"); // to prevent UNDO of file content placed in editor on open
				this._editorWidget.ibxWidget("setClean"); // to prevent editor "dirty" state on file content placed in editor on open
				
				this.element.ibxWidget("option", {"tabOptions": {"text": this.itemDescription}});
				this._editorWidget.ibxWidget("setCursorPositionInfo");
				this.setEditorFocus();
			});
	},
	
	_getEditorServerEnv:function(ibfsPath)
	{			
		var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
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
	
	saveFileAs:function(e)
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
	
	saveFile:function()
	{
		if (this._editorWidget.ibxWidget("isClean") && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
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
				ctxPath:this.folderPath.length > 0 ? this.folderPath : this.rootPath,
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
		if (this._editorWidget.ibxWidget("isClean") && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		var fexText = this._editorWidget.ibxWidget("content");
	 	var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
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
		var summary = null;
		this.iaSave = false;
		this.toolLost = false;

		if ((!this.newDoc || mode=="saveas") && this.tool &&  (this.tool != "editor" && this.tool != "htmlcanvas"))		
		{

			var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
			var randomnum = Math.floor(Math.random() * 100000);	
			var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_FOCEXEC_IA_PARSE",		
		 		ibfsPath: this.folderPath + "/" + this.fullName,
		 		fexText:this._editorWidget.ibxWidget("content"),
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
			var path = saveDlg.ibxWidget('path');
			var fileExists = saveDlg.ibxWidget('fileExists');
			
			var data = {"_path":path};
			$(document).trigger("CHECK_PATH_EVENT", data);
			
			path = data._path;

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
				this.element.ibxWidget("option", {"tabOptions": {"text": this.itemDescription}});

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
			
			var data = {"_extension":this.extension, "_mode":""};
			$(document).trigger("GET_EDITOR_MODE_BY_EXTENSION_EVENT", data);			
			
			if(data._mode)
			{				
				var editorConfig = this._editorWidget.ibxWidget("option", "config");
				
				editorConfig.mode = data._mode;
				
				this._editorWidget.ibxWidget("option", "config", editorConfig);
				
				this._editorWidget.ibxWidget("refresh");
			}
						
			$(document).dispatchEvent( 'FORCE_ACTION_ON_CURRENT_FOLDER', {"detail":this.folderPath} );			
		}
		
		if (!this.closing)
		{
			this.setEditorFocus();
			this.element.ibxWidget("option", {"tabOptions": {"text": this.itemDescription}});
		}
		
		this.newDoc = false;
		this._editorWidget.ibxWidget("setClean"); // remove editor "dirty" state but preserving UndoManager history
		
		if(this.currentAction == 1)
		{
			this.currentAction = 0;		
			this.newDoc = true;
			this.setEditorFocus();
			this._editorWidget.ibxWidget("setCursorPositionInfo");
		}
		else if(this.currentAction == 2)
		{
			this.currentAction = 0;
			this._onOpenDialog();
		}
		else if(this.currentAction == 3) // from Close
		{
			$(document).trigger('REMOVE_TAB_PAGE_EVENT');
		}
		else if(this.currentAction == 4)
		{
			this.currentAction = -1;
			this.close();      
		}
	},
	
	clearSelected:function(e)
	{
		this._editorWidget.ibxWidget("deleteSelectedText");
	},
	
	closeFile:function(e)
	{
		if( !this._editorWidget.ibxWidget("isClean"))
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
				
				$(document).trigger("REMOVE_TAB_PAGE_EVENT");
				
			}.bind(this)).on("ibx_close", function (e, closeData)
			{
				if (closeData == "ok") // YES
				{
					if (!this.iaMode )
					{
	                    this.fromClose = true;
					}
	                this.closing = true;							
					this.currentAction = 3;
					this.saveFile(e);				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			this.setEditorFocus();
				}

			}.bind(this));
		}
		else
		{
			$(document).trigger("REMOVE_TAB_PAGE_EVENT");
		}
		
	},
	
	editorRedo:function(e)
	{
		this._editorWidget.ibxWidget("editorRedo");
	},
	
	editorUndo:function(e)
	{
		this._editorWidget.ibxWidget("editorUndo");
	},
	
	editorCut:function(e)
	{
		//this.ace_editor.execCommand("cut");
		/*
		var press = jQuery.Event("keydown");
		press.ctrlKey = true;
		press.which = 120;//x
		$(this.ace_editor).trigger(press);
		*/
		this._editorWidget.ibxWidget("editorCut");
	},
	
	editorCopy:function(e)
	{
		//this.ace_editor.execCommand("copy");
		/*
		var press = jQuery.Event("keypress");
		press.ctrlKey = true;
		press.which = 99;//c
		$(this.ace_editor).trigger(press);
		*/
		this._editorWidget.ibxWidget("editorCopy");
	},
	
	editorPaste:function(editorClipboardData)
	{
		//this.ace_editor.execCommand("paste");
		/*
		var press = jQuery.Event("keypress");
		press.ctrlKey = true;
		press.which = 118;//v
		$(this.ace_editor).trigger(press);
		*/
		this._editorWidget.ibxWidget("editorPaste", editorClipboardData);
	},
	
	runFile:function()
	{
		var randomnum = Math.floor(Math.random() * 100000);	
		var fexText = this._editorWidget.ibxWidget("content");
		var width = 800;
		var height = 600;
		var top = (screen.height-height)/2;
		var left = (screen.width-width)/2; 	 		
		
		var action = location.protocol + applicationContext + editorActionHandler;

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
	
	toggleSearchPanel:function(e)
	{
		var isVisible = this._searchPanel.is(":visible");
		
		if (isVisible)
		{
			this._searchPanel.hide();
			this.setEditorFocus();
			return;
		}

		var selection = this._editorWidget.ibxWidget("editor").session.getTextRange(this._editorWidget.ibxWidget("editor").getSelectionRange());
		
		this._cbMatchCase.ibxWidget("checked", this._defaultSearchOptions.caseSensitive);
		this._cbMatchWholeWord.ibxWidget("checked", this._defaultSearchOptions.wholeWord);
		this._cbWrapAround.ibxWidget("checked", this._defaultSearchOptions.wrap);
		
		if(selection.length > 0)
		{
			this._findText.ibxWidget("option", "text", selection);
			
			//this._btnFind.ibxWidget("option", "disabled", false);
			//this._btnFindPrevious.ibxWidget("option", "disabled", false);
			//this._btnReplace.ibxWidget("option", "disabled", false);	
			//this._btnReplaceAll.ibxWidget("option", "disabled", false);	
		}
						
		this._searchPanel.show();		
		this._findText.focus();		
	},
	
	_findNext:function()
	{
		var findText = this._findText.ibxWidget("option", "text");
		
		if(findText && findText.length > 0)
		{
			this._editorWidget.ibxWidget("editor").find(findText, this._defaultSearchOptions);
		}
	},
	
	_replaceNext:function()
	{
		var replaceWith = this._replaceText.ibxWidget("option", "text");
		
		if(replaceWith && replaceWith.length > 0)
		{
			this._editorWidget.ibxWidget("editor").findNext();		
			this._editorWidget.ibxWidget("editor").replace(replaceWith);
		}
	},	
	
	_replaceAll:function()
	{
		var findText = this._findText.ibxWidget("option", "text");
		
		if(findText && findText.length > 0)
		{
			var replaceWith = this._replaceText.ibxWidget("option", "text");
			
			if(replaceWith && replaceWith.length > 0)
			{
				this._editorWidget.ibxWidget("editor").find(findText, this._defaultSearchOptions);
				this._editorWidget.ibxWidget("editor").replaceAll(replaceWith);
			}
		}
	},
	
	_setMatchCase:function(e)
	{
		this._defaultSearchOptions.caseSensitive = this._cbMatchCase.ibxWidget("checked");
	},
	
	_setMatchWholeWord:function(e)
	{
		this._defaultSearchOptions.wholeWord = this._cbMatchWholeWord.ibxWidget("checked");
	},
	
	_setWrapAround:function()
	{
		this._defaultSearchOptions.wrap = this._cbWrapAround.ibxWidget("checked");
	},
	
	isClean:function()
	{
		return this._editorWidget.ibxWidget("isClean");
	},
	
	toggleLineNumbering:function()
	{				
		var editorConfig = this._editorWidget.ibxWidget("option", "config");

		var show = editorConfig.showLineNumbers;
		
		if(show)
			editorConfig.showLineNumbers = false;
		else
			editorConfig.showLineNumbers = true;
		
		this._editorWidget.ibxWidget("option", "config", editorConfig);
		
		this._editorWidget.ibxWidget("refresh");
	},
	
	toggleAutocomplete:function()
	{						
		var editorConfig = this._editorWidget.ibxWidget("option", "config");

		var enableBasicAutocompletion = editorConfig.enableBasicAutocompletion;
		var enableSnippets = editorConfig.enableSnippets;
		var enableLiveAutocompletion = editorConfig.enableLiveAutocompletion;

		if(enableBasicAutocompletion)
			editorConfig.enableBasicAutocompletion = false;
		else
			editorConfig.enableBasicAutocompletion = true;
		
		if(enableSnippets)
			editorConfig.enableSnippets = false;
		else
			editorConfig.enableSnippets = true;
		
		if(enableLiveAutocompletion)
			editorConfig.enableLiveAutocompletion = false;
		else
			editorConfig.enableLiveAutocompletion = true;		
		
		this._editorWidget.ibxWidget("option", "config", editorConfig);

		this._editorWidget.ibxWidget("refresh");
	},
	
	getStatusBarInfo:function()
	{		
		this._editorWidget.ibxWidget("setInsertStatusLabel");
		this._editorWidget.ibxWidget("setCursorPositionInfo");
	},
	
	getEditorOptions:function()
	{		
		this._editorWidget.ibxWidget("broadcastEditorOptions");
	},
	
	_decodeCDATAEncoding:function (text)
	{
		text = text.replace(/IBI_CDATA_START_PATTERN/g, "<![CDATA");
		text = text.replace(/IBI_CDATA_END_PATTERN/g, "]]>");	
		return text;
	}
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$.widget("ibi.textEditor", $.ibi.ibxWidget, 
{
	options:
	{

	},
	
	_widgetClass:"text-editor",

	_create:function()
	{
		this._super();
		
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
		
		this._supportedThemes = ["textmate","github"];

		this._editorClipboard = "";

		this.rootPath = "";
		this.folderPath = "";
	    
		this.bipActionHandler = "/views.bip";
		this.checkServerAccessHandler = "/chksrvacc.bip";		
		this.resourceContext = applicationContext;
		
		$(window).on('beforeunload', this._onBeforeUnload.bind(this));
		$(window).on('unload', this._onUnload.bind(this));
		
		$(document).on("SET_STATUS_BAR_CURSOR_METADATA", this._onSetStatusBarCursorMetadata.bind(this));
		$(document).on("SET_STATUS_BAR_INSERT_KEY_METADATA", this._onSetStatusBarInsertKeyMetadata.bind(this)); 
		$(document).on("EDITOR_OPTIONS_CHANGED_EVENT", this._onEditorOptionsChanged.bind(this));
		$(document).on("SET_EDITOR_CLIPBOARD_METADATA", this._onSetEditorClipdoardMetadata.bind(this));     
		$(document).on("PASTE_EDITOR_CLIPBOARD_METADATA", this._onMenuButtonPaste.bind(this));    // use Toolbar Button Paste 
		$(document).on("SET_EDITOR_CLIPBOARD_METADATA", this._onSetEditorClipdoardMetadata.bind(this));     
		$(document).on("REMOVE_TAB_PAGE_EVENT", this._removeTabPage.bind(this));    // Remove Tab Page 
		$(document).on("GET_EDITOR_FORMAT_BY_EXTENSION_EVENT", this._getEditorFormatByExtensionEventHandler.bind(this));
		$(document).on("GET_EDITOR_MODE_BY_EXTENSION_EVENT", this._getEditorModeByExtensionEventHandler.bind(this));
		$(document).on("CHECK_PATH_EVENT", this._checkPathEventHandler.bind(this));

		//this._fileNew.on("ibx_menu_item_click", this._onMenuFileNew.bind(this));
		
		this._fileNewR = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("r"))}, 'userValue': "r"});
		this._fileNewPY = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("py"))}, 'userValue': "py"});
		this._fileNewTXT = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("txt"))}, 'userValue': "txt"});
		this._fileNewMAS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("mas"))}, 'userValue': "mas"});
		this._fileNewFEX = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("fex"))}, 'userValue': "fex"});
		this._fileNewHTM = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("htm"))}, 'userValue': "htm"});
		this._fileNewSTY = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("sty"))}, 'userValue': "sty"});
		this._fileNewCSS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("css"))}, 'userValue': "css"});
		this._fileNewSQL = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("sql"))}, 'userValue': "sql"});
		this._fileNewJS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString(this._getEditorFormatName("js"))}, 'userValue': "js"});

		this._fileNewR.on("click", this._onMenuFileNew.bind(this));
		this._fileNewPY.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewTXT.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewMAS.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewFEX.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewHTM.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewSTY.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewCSS.on("click", this._onMenuFileNew.bind(this));
		this._fileNewSQL.on("click", this._onMenuFileNew.bind(this));
		this._fileNewJS.on("click", this._onMenuFileNew.bind(this));

        this._fileNewSubmenu.ibxWidget("add", this._fileNewR);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewPY);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewTXT);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewMAS);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewFEX);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewHTM);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewSTY);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewCSS);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewSQL);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewJS);		
        
		this._fileOpen.on("ibx_menu_item_click", this._onMenuFileOpen.bind(this));
		this._fileSave.on("ibx_menu_item_click", this._onMenuFileSave.bind(this));
		this._fileSaveAs.on("ibx_menu_item_click", this._onMenuFileSaveAs.bind(this));
		//this._filePreferences.on("_filePreferences", this._onMenuFilePreferences.bind(this));
		this._fileClose.on("ibx_menu_item_click", this._onMenuFileClose.bind(this));
		this._fileExit.on("ibx_menu_item_click", this._onMenuFileExit.bind(this));
		this._menuSave.on("click", this._onMenuButtonSave.bind(this));
		this._menuClearSelected.on("click", this._onMenuButtonClearSelected.bind(this));
		this._menuUndo.on("click", this._onMenuButtonUndo.bind(this));
		this._menuRedo.on("click", this._onMenuButtonRedo.bind(this));
		this._menuCut.on("click", this._onMenuButtonCut.bind(this));
		this._menuCopy.on("click", this._onMenuButtonCopy.bind(this));
		this._menuPaste.on("click", this._onMenuButtonPaste.bind(this));
		this._menuRun.on("click", this._onMenuButtonRun.bind(this));
		this._menuSearch.on("click", this._onMenuSearch.bind(this));
		this._optionsLineNumbering.on("click", this._onMenuOptionsLineNumbering.bind(this));
		this._optionsAutocomplete.on("click", this._onMenuOptionsAutocomplete.bind(this));
		this._optionsStatusBar.on("click", this._onMenuOptionsStatusBar.bind(this));
		this._menuHelp.on("click", this._onMenuButtonHelp.bind(this));		
		this._editorTabPane.on("ibx_change", this._editorTabPaneChanged.bind(this));
	},
	// window event handlers
	_onBeforeUnload:function(e)
	{				
		if(this.isDirty())
		{
	      return "prompt";
		}
		else 
		{
			if(window.opener && window.opener.editorWindow)
			{
				window.opener.editorWindow = null;
			}
			
			return undefined;
		}
	},
	
	_onUnload:function(e)
	{		
		if(window.opener && window.opener.editorWindow)
		{
			window.opener.editorWindow = null;
		}
	},
	// menu items event handlers
	_onMenuFileNew:function(e)
	{
		this.currentAction = 1;
		this._onNewFunction(e);
	},
	
	_onMenuFileOpen:function(e)
	{
		this.currentAction = 2;
		this._onFileOpen(e);
	},
	
	_onMenuFileSave:function(e)
	{
		this._onSaveFileFunction(e);
	},
	
	_onMenuFileSaveAs:function(e)
	{
		this._onSaveAsFunction(e);
	},
	
	_onMenuFilePreferences:function(e)
	{
		alert("_onMenuFilePreferences");
	},
	
	_onMenuFileClose:function(e)
	{
		this.currentAction = 3;
		this._onCloseFile(e);
	},
	
	_onMenuFileExit:function(e)
	{
    	this.currentAction = 4;
    	this._onExitFunction(e);
	},
	
	_onMenuButtonRedo:function(e)
	{
		this._onEditorRedoFunction(e);
	},
	
	_onMenuButtonUndo:function(e)
	{
		this._onEditorUndoFunction(e);
	},

	_onMenuButtonCut:function(e)
	{
		this._onEditorCutFunction(e);		
	},
	_onMenuButtonCopy:function(e)
	{
		this._onEditorCopyFunction(e);		
	},
	_onMenuButtonPaste:function(e)
	{
		this._onEditorPasteFunction(e);		
	},
	
	_onMenuButtonSave:function(e)
	{
    	this._onSaveFileFunction(e);
	},
	
	_onMenuButtonRun:function(e)
	{
    	this._onRunFunction(e);
	},
	
	_onMenuButtonClearSelected:function(e)
	{
		this._onClearSelected(e);
	},
	
	_onMenuSearch:function(e)
	{
    	this._toggleSearchPanel(e);
	},
	
	_onMenuGoToLine:function(e)
	{
		alert("_onMenuhGoToLine");
    	//this._toggleGoToLine(e);
	},
	_onMenuOptionsLineNumbering:function(e)
	{		
		this._toggleLineNumbering(e);
	},
	_onMenuOptionsAutocomplete:function(e)
	{		
		this._toggleAutocomplete(e);
	},
	_onMenuOptionsStatusBar:function(e)
	{
		this._toggleStatusBar(e);
	},
	_onMenuButtonHelp:function(e)
	{
		this._onHelp(e);
	},	

	_editorTabPaneChanged:function(e)
	{
		this._onEditorTabPaneChanged(e);
	},
	//---------------------------------------------------------------------------------------------------------	
	setCallbackFunction:function(f)
	{
		this._callbackFunc = f;
	},
	
	openEditorTab:function(rootPath, folderPath, fileName, fileExtension) // Public method to open Editor Tab.
	{		
		this.rootPath = this._checkPath(rootPath);
		
		var tabBar = this._editorTabPane.ibxWidget("tabBar");
		var tabBtns = tabBar.ibxWidget("children");
		
		for (var i = 0; i < tabBtns.length; i++)
		{
			var tabBtn = $(tabBtns.get(i));
			var tabPg =  tabBtn.ibxWidget("option", "tabPage"); 
			var oldPath = tabPg.ibxWidget("getFullItemPath");
			var newPath = folderPath+"/"+fileName;
			
			if(oldPath == newPath)
			{
				this._editorTabPane.ibxWidget("selected", tabPg);
				return;
			}
		}
			
		var mode = null;// mode is a path to JS module
/*		
		if(fileExtension && this._supportedModes[fileExtension])
			mode = "ace/mode/"+this._supportedModes[fileExtension]; 
		else
		{	
	    	if(fileName && fileName.length > 0)
	    	{
	    		var extSeparatorIdx = fileName.lastIndexOf(".");	    	        
	    		fileExtension = fileName.substring(extSeparatorIdx + 1);   
	    		
	    		mode = this._supportedModes[fileExtension];
	    		
	    		if(mode)
	    			mode = "ace/mode/"+mode;
	    	}
	    }
*/
		if(fileExtension)
			mode = this._getEditorModeByExtension(fileExtension);
		else
		{
	    	if(fileName && fileName.length > 0)
	    		mode = this._getEditorModeByPath(fileName);
	    }
		
		var newTab = $("<div class='text-editor-tab-page'>").textEditorTabPage({ tabOptions:  { 'text': ibx.resourceMgr.getString("BT_UNTITLED"), 'glyph': '', 'glyphClasses': '' } });				
		newTab.ibxWidget("initEditor", this.rootPath, folderPath, fileName, mode);		
		this._editorTabPane.ibxWidget("add", newTab);
	},

	_checkPathEventHandler:function(e, data)
	{
		data._path = this._checkPath(data._path);
	},
	
	_getEditorFormatByExtensionEventHandler:function(e, data)
	{
		data._format = this._getEditorFormatByExtension(data._extension);
	},
	_getEditorModeByExtensionEventHandler:function(e, data)
	{
		data._mode = this._getEditorModeByExtension(data._extension);
	},
	_getEditorModeByExtension:function(extension)
	{
		return this._getEditorModeByPath("/myfile."+extension);
	},
	_getEditorModeByPath:function(p)
	{
	    var modelist = ace.require("ace/ext/modelist");
	    return modelist.getModeForPath(p).mode;
	},
	
	_onEditorTabPaneChanged:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;

		tabPage.ibxWidget("getStatusBarInfo");
		tabPage.ibxWidget("getEditorOptions");
		tabPage.ibxWidget("setEditorFocus");
	}, 
	
	_onNewFunction:function(e)
	{		
		var extensionValue = $(e.currentTarget).ibxWidget("option", "userValue");		
		this.openEditorTab(this.rootPath, this.rootPath, "" , extensionValue);
	},
	
	_onFileOpen:function(e)
	{
		this._onFileOpenDialog(e);
	},
	
	_onFileOpenDialog:function(e)
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
			this._onFileOpenDialogResult(openDlg, closeData);
		}.bind(this));
	},
	
	_onFileOpenDialogResult:function(openDlg, closeData)
	{
		if(closeData == "ok")
		{
			var ibfsItems = openDlg.ibxWidget('ibfsItems');	
			var folderPath = this._checkPath( (ibfsItems.length > 0 )? ibfsItems[0].parentPath : "");
			var fileName = (ibfsItems.length > 0 )? ibfsItems[0].name : "";	
			var itemExtension = (ibfsItems.length > 0 )? ibfsItems[0].extension : "";	

			this.openEditorTab(this.rootPath, folderPath, fileName);
		}
//		else
//			this.ace_editor.focus();
	},

	_onSaveFileFunction:function(e)
	{
		this._onSaveFile();		
	},
	_onSaveAsFunction:function(e)
	{
		this._onSaveFileAs(e);
	},
	
	_onEditorRedoFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorRedo");
	},
	
	_onEditorUndoFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorUndo");
	},
	
	_onClearSelected:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("clearSelected");
	},

	_onSetEditorClipdoardMetadata:function(e, data)
	{
		this._editorClipboard = data._editorClipboardData;
	},
	
	_onEditorCutFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorCut");
	},
	
	_onEditorCopyFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorCopy");
	},
	
	_onEditorPasteFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorPaste", this._editorClipboard);
	},
	
	_onRunFunction:function(e)
	{
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("runFile");
	},	
	
	_onExitFunction:function(e)
	{
		this._onExit();
	},	
	
	_onHelp:function(e)
	{
		var url = IBI_HELP_CONTEXT + "/advanced/redirect.jsp?topic=/com.ibi.help/help.htm#edithelp_mrappleteditor";
		var specs = "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400";
		
		window.open(url, "_blank", specs, true);
	},	
	
	_onSaveFileAs:function(e)
	{		           
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("saveFileAs");		
	},
	
	_onSaveFile:function(e)
	{						
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("saveFile");
	},

	_onCloseFile:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("closeFile");
	},
	
	_removeTabPage:function()
	{		
		var tabPage = this._editorTabPane.ibxWidget("selected");
		
		this._editorTabPane.ibxWidget("remove", tabPage, true, true);

		tabPage = this._editorTabPane.ibxWidget("selected");
		
		if(!tabPage)
			this._resetStatusBarInfo();
	},

	isDirty:function(e)
	{
        var tabBar = this._editorTabPane.ibxWidget("tabBar");        
        var tabBtns = tabBar.ibxWidget("children");
        
        for (var i = 0; i < tabBtns.length; i++)
        {
        	var tabBtn = $(tabBtns.get(i));
        	var tabPg = tabBtn.ibxWidget("option", "tabPage");
               
        	if (!tabPg.ibxWidget("isClean"))
        		return true;
        }
        
        return false;
	},
	
	_onExit:function()
	{
		window.close();
	},

	_resetStatusBarInfo:function(e)
	{	
		this._lengthLbl.ibxWidget("option", "text", "");		
		this._linesLbl.ibxWidget("option", "text", "");		
		this._linePosLbl.ibxWidget("option", "text", "");		
		this._columnPosLbl.ibxWidget("option", "text", "");
		this._insertLbl.ibxWidget("option", "text", "");
	},
	
	_onSetStatusBarCursorMetadata:function (e, data)
	{  	
		this._lengthLbl.ibxWidget("option", "text", data.contentLength);		
		this._linesLbl.ibxWidget("option", "text", data.lineCount);		
		this._linePosLbl.ibxWidget("option", "text", data.linePosition);		
		this._columnPosLbl.ibxWidget("option", "text", data.columnPosition);
	},
	
	_onSetStatusBarInsertKeyMetadata:function (e, data)
	{   
		this._insertLbl.ibxWidget("option", "text", data.insertKeyStatus);
	},
	
	_onEditorOptionsChanged:function(e, data)
	{
		this._optionsLineNumbering.ibxWidget("option", "checked", data._config.showLineNumbers);
		this._optionsAutocomplete.ibxWidget("option", "checked", data._config.enableBasicAutocompletion);
	},
	
	_toggleSearchPanel:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleSearchPanel");		
	},

	_toggleStatusBar:function(e)
	{
		var isVisible = this._statusBar.is(":visible");
		
		if (isVisible)
		{
			this._statusBar.hide();
			return;
		}
		
		this._statusBar.show();
	},
	
	_toggleLineNumbering:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleLineNumbering");		
	},
	_toggleAutocomplete:function(e)
	{		
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleAutocomplete");		
	},
	_getEditorFormatName:function(ext)
	{		
	    var formatName = this._supportedFormats[ext];
	    return formatName;
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
	
	_refresh:function()
	{
		this._super();
	}
});

//# sourceURL=wf_ace_editor.js