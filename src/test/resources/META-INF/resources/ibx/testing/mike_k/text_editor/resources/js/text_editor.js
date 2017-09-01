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
			text:ibx.resourceMgr.getString("BT_UNTITLED")
		}
	},
	
	_widgetClass:"text-editor",

	_create:function()
	{
		this._super();		
		var resBody = ibx.resourceMgr.getResource(".text-editor-resources", false);
		
		this.contentBox.append(resBody.children());
		
		ibx.bindElements(this.contentBox);		
		
		this.bipActionHandler = "/views.bip";
		this.editorActionHandler = "/editor.bip";
		this.checkServerAccessHandler = "/chksrvacc.bip";		
		this.postFormActionHandler = location.protocol + applicationContext + this.editorActionHandler;
		this.resourceContext = applicationContext;
		
		this.currentAction = 0; // 1-New, 2-Open, 3-Close, 4-Exit
		this.defaultFolderPath = "";
		this.oldCursorCharacterPosition = 0;
		this.tool = "";
		this.type = "";
		
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
		
		this.unDoText = [];
		
		// BIP-893 - postpone key enable until know if autolink property is set on the item
		//if (this.folderPath.indexOf("IBFS:/EDA") == 0)  // BIP-1496 set now for reporting servers // Why do we need this???
			$(".te-txt-area").on("keyup", this._onEditorAreaKeyUp.bind(this));

		//$(".te-txt-area").on("keydown", this._onEditorAreaKeyDown.bind(this));  // !!!!!!!!!!!!!!!!!
			
		$(".te-txt-area").on("click", this._onEditorAreaClickEvent.bind(this));
		$(".te-txt-area").on("ibx_textchanged", this._onEditorAreaTextchanged.bind(this));
		$(".te-menu").on("ibx_menu_item_click", this._onMenuItemSelect.bind(this));
		$(".te-menu-button").on("click", this._onMenuButtonSelect.bind(this));
		$(".te-tb-btn").on("click", this._onButtonSimpleSelect.bind(this));
		//$("#fjkdvnkl").on("click", this._onButtonSimpleSelect.bind(this)); // acces DOM element by ID
	
		$(".btnCloseGoToLine").on("click", this._toggleGoToLine.bind(this));
		$(".btnGoToLine").on("click", this._actionGoToLine.bind(this));
		$(".txtGoToLine").on("keyup", this._onTxtGoToLineKeyup.bind(this));
		
		$(".findText").on("ibx_textchanged", this._tchange.bind(this));
		
		$(".btnFind").on("click", this._find.bind(this));
		$(".btnFindPrevious").on("click", this._findPrev.bind(this));
		$(".btnReplace").on("click", this._replaceFind.bind(this));	
		$(".btnReplaceAll").on("click", this._replaceAll.bind(this));
		$(".btnUndo").on("click", this._unDo.bind(this));
		$(".btnFindClose").on("click", this._onFindButtonCloseAction.bind(this));
		
		$(".btnFind").ibxWidget("option", "disabled", true);
		$(".btnFindPrevious").ibxWidget("option", "disabled", true);
		$(".btnReplace").ibxWidget("option", "disabled", true);
		$(".btnReplaceAll").ibxWidget("option", "disabled", true);
		$(".btnUndo").ibxWidget("option", "disabled", true);
		
		
		$(".goToLine").hide();
		$(".findReplace").hide();
		
		this.element.resizable();
		
		this.btnBox.css("display", "none"); // Editor Dialog OK / Cancel buttons
	},
	
	setEditorPath:function(folderPath, itemName, itemExtension) // Public method to setup Editor.
	{
		this._clearEditorEnvironment();
		
		this.defaultFolderPath = folderPath;
		this.folderPath = folderPath;
		this.newDoc = true;

		if(itemName && itemName.length > 0 && itemExtension && itemExtension.length > 0)
		{
			this.itemName = itemName;
			this.extension = itemExtension;			
			this.fullItemPath = this.folderPath + this.itemName;
			
			this._getItemSummary(this.fullItemPath);
		}
		
		if (!this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
		{	
			this._getEditorEnv(this.fullItemPath);
		}
	
	},
	
	_onMenuItemSelect:function(e, menuItem) //Menu Items
	{
		var cmd = $(menuItem).data("menuCmd");
		
		switch (cmd) 
		{
			case "fileNew":
				
				this.currentAction = 1;
				this._onNewFunction(e);
				break;
			case "fileOpen":
				
				this.currentAction = 2;
				this._onOpenFunction(e);
				break;
			case "fileSave":
				
				this._onSaveFunction(e);
				break;
			case "fileSaveAs":
				
				break;
			case "fileClose":
				
				this.currentAction = 3;
				this._onClose(e);
				break;
		    case "fileExit":
		    	
		    	this.currentAction = 4;
		    	this._onExitFunction(e);		    	
		    	break;
		    case "editDelete":
		    	
				this._deleteSelectedText(e);
		    	break;		    
		    case "editSelectAll":
		    	
		    	this._selectAllText(e);
		    	break;
		    case "editUpperCase":
		    	
		    	this._selectionToUpperCase(e);
		    	break;
		    case "editLowerCase":
		    	
		    	this._selectionToLowerCase(e);
		    	break;
		    case "searchFind":
		    	
		    	this._toggleFindReplace(e);
		    	break;
		    case "searchGoTo":
		    	
		    	this._toggleGoToLine(e);
		    	break;
	    	
			default:
		}
	},
		
	_onMenuButtonSelect:function(e) // Menu Buttons (Options, Help)
	{
		var cmd = $(e.currentTarget).data("menuCmd");
		
		switch (cmd) 
		{
			case "menuOptions":
				
				this._onOptions(e);
				break;
			case "menuHelp":
				
				this._onHelp(e);
				break;	
			default:
		}
		
	},
	
	_onButtonSimpleSelect:function(e) // Toolbar Buttons
	{
		var cmd = $(e.currentTarget).data("menuCmd");
		
		switch (cmd) 
		{
			case "onNew":
				
				this.currentAction = 1;
				this._onNewFunction(e);
				break;
			case "onOpen":
				
				this.currentAction = 2;
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
	
	
	_onEditorAreaTextchanged:function (e)
	{   
		this.changed = true;
	},	
	_onEditorAreaClickEvent:function (e)
	{	
		this._setCursorPositionInfo(e);
	},	
	_onEditorAreaKeyDown:function (e)
	{		
		this._setCursorPositionInfo(e);
	},	
	_onEditorAreaKeyUp:function (e)
	{		
		this._setCursorPositionInfo(e);
		this._setBtns(e);	    
	},

	_onNewFunction:function(e)
	{
		this._onClose(e);
	},	
	_onOpenFunction:function(e)
	{       
		var openDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		openDlg.ibxWidget({
			fileTypes:[[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("htmlType"), "htm"], [ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]], 
			dlgType:"open", 
			title: ibx.resourceMgr.getString("bid_open"), 
			ctxPath: this.folderPath});
		
		openDlg.ibxWidget('open');
		
		openDlg.on("ibx_beforeclose", function(e, closeData)
		{
			//alert("ibx_beforeclose");
			//return false;
		}).on("ibx_close", function (e, closeData)
		{						
			
			if(closeData == "ok")
			{
				var ibfsItems = openDlg.ibxWidget('ibfsItems');	
				var folderPath = (ibfsItems.length > 0 )? ibfsItems[0].parentPath : "";
				var fileName = (ibfsItems.length > 0 )? ibfsItems[0].name : "";	
				var itemExtension = (ibfsItems.length > 0 )? ibfsItems[0].extension : "";	

				this.setEditorPath(folderPath, fileName, itemExtension);
							
			}	
			
 			this._setCursorPosition($(".te-txt-area")[0].firstChild);
 			this._setCursorPositionInfo();
 			$(".te-txt-area").focus();
			
		}.bind(this));
		

	},
	_onSaveFunction:function(e)
	{
		this._doSave();		
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
				
				//this.setCaption(decodeHtmlEncoding(this.folderPath) + "/" + decodeHtmlEncoding(this.itemDescription));
				
				this.options.captionLabelOptions.text = this.folderPath + this.itemDescription;
				
	 			this._setCursorPosition($(".te-txt-area")[0].firstChild);
	 			this._setCursorPositionInfo();
	 			$(".te-txt-area").focus();
			});
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
		var randomnum = Math.floor(Math.random() * 100000);	
		var fexText = $(".te-txt-area").ibxWidget('option', 'text');
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
			options.fields["IBFS_edItem_path"] = this.folderPath + this.itemName + "." + this.extension;
	    }
		
		var form = $("<form>").ibxForm(options).ibxForm("submit", doc);
	},
	
	_doSave:function()
	{
		
		var fexText = $(".te-txt-area").ibxWidget('option', 'text');
		
	 	var uriExec = sformat("{1}"+this.editorActionHandler, applicationContext);
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
	 		.done(function( data ) 
	 		{
	 			//alert( "Data Loaded: " + data );	 			

	 			$(".te-txt-area").focus();
	 			
	 		}.bind(this));
	 	
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
		parms.push("paramPrompt=" + this.editor_options.paramPrompt);
		parms.push("fexData=" + encodeURIComponent(this.fexText)); // CLRPT-122 encode % chars in text
			
		if (this.editor_options.srvChk)
		{
			parms.push("server=" + this.editor_options.server);
		}

		if (this.editor_options.appChk)
		{
			parms.push("appPath=" + this.editor_options.appPath);
		}

		parms.push("myReport=" + false);

		this.tree.ajaxRequestEx(this.editorActionHandler, parms, true, this.gotSaveResponse, null, this);
*/		
	},
	
	_onNew:function(e)
	{	
		this._onClose(e);
	},
	
	_onClose:function(e)
	{
		this.currentAction = 0;
		this._clearEditorEnvironment(e);
		this.newDoc = true;

		this._setCursorPosition($(".te-txt-area")[0].firstChild);
 		this._setCursorPositionInfo(e);
 		$(".te-txt-area").focus();
	},
	
	_onExit:function(e)
	{
		this.close();
	},
	

	
	_selectionToUpperCase:function(e)
	{
		var textArea = $(".te-txt-area")[0].firstChild;
		
		this._changeSelectionCase(textArea, true);
			
		this.changed = true;
		
		this._setCursorPositionInfo(e);
	},
	
	_selectionToLowerCase:function(e)
	{
		var textArea = $(".te-txt-area")[0].firstChild;
		
		//alert("Selection Start="+textArea.selectionStart + " Selection End="+textArea.selectionEnd);

		this._changeSelectionCase(textArea, false);
			
		this.changed = true;

		this._setCursorPositionInfo(e);
	},
	
	_selectAllText:function(e)
	{
		var textArea = $(".te-txt-area")[0].firstChild;
		
		this._selectAll(textArea);
		
		//alert("Selection Start="+textArea.selectionStart + " Selection End="+textArea.selectionEnd);

	},
	
	_deleteSelectedText:function(e)
	{
		var textArea = $(".te-txt-area")[0].firstChild;
		
		this._deleteTextareaSelectedText(textArea);
		
		this.changed = true;
		
		this._setCursorPositionInfo(e);
	},
	
	
	
	_setBtns:function(e)
	{
		// What does this do ????
		
		//this._setCursorPositionInfo(e);
		
/*		
		var keyCode = e.getKeyCode();
		if (e.getCtrlKey())
		{
			var key = String.fromCharCode(keyCode).toUpperCase();
			if (key == 'C' || key == 'A')
			{
				return;
			}
		}
		else
		{
			switch (keyCode)
			{
				// these are cursor movement keys
				case BiKeyboardEvent.UP:
				case BiKeyboardEvent.DOWN:
				case BiKeyboardEvent.LEFT:
				case BiKeyboardEvent.RIGHT:
				case BiKeyboardEvent.SHIFT:
				case BiKeyboardEvent.CTRL:
				case BiKeyboardEvent.END:
				case BiKeyboardEvent.HOME:
				case BiKeyboardEvent.TAB:
				return;
			}
		}

		this.changed = true;
*/		
	},
	
	_clearEditorEnvironment:function(e)
	{
		this.currentAction = 0;
		this.fullItemPath = "";
		this.oldCursorCharacterPosition = 0;
		$(".te-txt-area").ibxWidget("option", "text", "");
		
		this.folderPath = this.defaultFolderPath;
		this.fullName = "";
		var parts = [];
		this.itemName = "";
		this.extension = "";
		this.itemDescription = "";
		this.changed = false;
		this.optionsChanged = false;
	    this.fromClose = false;
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

		this.unDoText = [];
		
		this.options.captionLabelOptions.text = ibx.resourceMgr.getString("BT_UNTITLED");
	},
	
	_setCursorPositionInfo:function(e)
	{
		var tae = $(".te-txt-area")[0].firstChild;
		
		var caracterPosition = this._getCaracterPosition(tae);

		var textValue = tae.value;

		var textBefore = textValue.substring(0, caracterPosition);

		var lines = this._getLines(textBefore);

		var linePosition = this._getLinePosition(lines);

		var columnPosition = this._getColumnPosition(lines);
		
		//dlg.characterPosLbl.setText(caracterPosition + 1);
		
		$(".te-linePosLbl").ibxWidget("option", "text", linePosition);
		
		$(".te-columnPosLbl").ibxWidget("option", "text", columnPosition + 1);
		
		this.oldCursorCharacterPosition = caracterPosition;

	},

	// returns an array of strings splin on carraige return 
	_getLines:function(t)
	{
		return t.split(/\r*\n/);
	},

	_getLinePosition:function(lines)
	{
		return lines.length;
	},

	_getColumnPosition:function(lines)
	{
		var lineNum = lines.length;
		
		return lineNum > 0 ? lines[lineNum-1].length : 0;
	},

	_getCaracterPosition:function(ta) 
	{	
		if (ta.selectionStart) 
		{ 
			return ta.selectionStart; 
		} 

		return 0; 
	},
	
	_changeSelectionCase:function(textArea, toUpper)
	{
		var selection;
		var textAreaValue = textArea.value;
		var selStart = textArea.selectionStart;
		var selEnd = textArea.selectionEnd;

		selection = textAreaValue.substring(selStart, selEnd);
		
		selection = toUpper ? selection.toUpperCase() : selection.toLowerCase();
		
		var selLength = selection.length;
		
		if(selLength == 0) return;
		
		this.changed = true;		
		
		textArea.value = textAreaValue.slice(0, selStart) + selection + textAreaValue.slice(selEnd);        
		   
		textArea.focus();	
		
		textArea.setSelectionRange(selStart, selEnd);
	},

	_goToLineFunction:function(textArea, lineNumber)
	{
		var textValue = textArea.value;

		var lines = this._getLines(textValue);
		
		var linesLength = lines.length;
		
		if(lineNumber > linesLength) 
			lineNumber = linesLength;

		var cursorPosition = 0;
		
		for(var i = 0; i < lineNumber-1; i++)
		{
			var ll = lines[i].length +1;
			cursorPosition += ll;
		}
/*		
		if (BiBrowserCheck.ie_standards_patch) // hack to deal with IE not selecting and scrolling to range set by setSelectionRange(selStart, selEnd)
		{
		    var range = textArea.createTextRange();
		    range.collapse(true);
		    range.moveEnd('character', cursorPosition);
		    range.moveStart('character', cursorPosition);
		    range.select();
		}
		else
		{
*/		
			textArea.setSelectionRange(cursorPosition, cursorPosition);
			textArea.focus();
//		}
	},
	
	
	
	_toggleGoToLine:function(e)
	{
		var isVisible = $(".goToLine").is(":visible");
		
		if (isVisible)
		{
	    	$(".txtGoToLine").ibxWidget("option", "text", "");
	    	$(".goToLine").hide();
			$(".te-txt-area")[0].focus();
			return;
		}
		
		$(".goToLine").show();		
		$(".txtGoToLine")[0].focus();		
	},
	
	_onTxtGoToLineKeyup:function(e)
	{
		var code = e.keyCode || e.which;
		
	    if(code == $.ui.keyCode.ENTER)
	    {
	        this._actionGoToLine(e);
	        return;
	    }
	    
	    var lineNumber = $(".txtGoToLine").ibxWidget("option", "text");

	    if(isNaN(lineNumber))
	    {
	    	lineNumber = lineNumber.length > 1 ? lineNumber.substring(0, lineNumber.length-1) : "";
	    	$(".txtGoToLine").ibxWidget("option", "text", lineNumber);
	    }
	},
	
	_actionGoToLine:function(e)
	{
		var lineNumber = $(".txtGoToLine").ibxWidget("option", "text");

		if(isNaN(lineNumber)) 
		{
			return;
		}
		
		var textArea = $(".te-txt-area")[0].firstChild;
		this._goToLineFunction(textArea, lineNumber);
		this._toggleGoToLine(e);
		this._setCursorPositionInfo(e);
	},
	
	
	_toggleFindReplace:function(e)
	{
		var isVisible = $(".findReplace").is(":visible");
		
		if (isVisible)
		{
			$(".findReplace").hide();
			$(".te-txt-area")[0].focus();
			return;
		}
			
		/*
		// set lables width based on widest
		var fLen = $(".findLbl").width();
		var rLen = $(".replaceLbl").width();

		var maxLblLen =  fLen > rLen ? fLen : rLen;
		
		$(".findLbl").width(maxLblLen);
		$(".replaceLbl").width(maxLblLen);
		
		// set buttons width based on widest
		var btnWidths = [];
		
		btnWidths.push($(".btnFind").width());
		btnWidths.push($(".btnFindPrevious").width());
		btnWidths.push($(".btnReplace").width());
		btnWidths.push($(".btnReplaceAll").width());
		btnWidths.push($(".btnUndo").width());
		btnWidths.push($(".btnFindClose").width());
		
		function numSort(a, b)
		{
			a = Number(a);
			b = Number(b);
			
			return a < b ? -1 : a > b ? 1 : 0;
		}
		
		btnWidths.sort(numSort);
		var maxBtnLen = btnWidths[5];
		
		$(".btnFind").width(maxBtnLen);
		$(".btnFindPrevious").width(maxBtnLen);
		$(".btnReplace").width(maxBtnLen);
		$(".btnReplaceAll").width(maxBtnLen);
		$(".btnUndo").width(maxBtnLen);
		$(".btnFindClose").width(maxBtnLen);
*/
		var selection;
		var ta = $(".te-txt-area")[0].firstChild;
		var tav = ta.value;
		if (document.selection)
		{
			if (window.getSelection)
			{ 
				selection = window.getSelection(); 
			}
			else if (document.getSelection)
			{ 
				selection = document.getSelection(); 
			}
			else if (document.selection)
			{ 
				selection = document.selection.createRange().text; 
			}
		}
		else
		{
			selection = tav.substring(ta.selectionStart, ta.selectionEnd);		
		}
		
		if(selection.length > 0)
		{
			$(".findText").ibxWidget("option", "text", selection);
			
			$(".btnFind").ibxWidget("option", "disabled", false);
			$(".btnFindPrevious").ibxWidget("option", "disabled", false);
			$(".btnReplaceAll").ibxWidget("option", "disabled", false);	
		}
						
		$(".findReplace").show();
		
		$(".findText").focus();
	},
	
	
	_unDo:function(e)
	{
		var ta = $(".te-txt-area").ibxWidget("option", "text", this.unDoText.pop());
		
		$(".btnReplace").ibxWidget("option", "disabled", true);
		
		if (this.unDoText.length == 0)
		{
			$(".btnUndo").ibxWidget("option", "disabled", true);
		}
	},
	
	_tchange:function(e)
	{
		var text = $(".findText").ibxWidget("option", "text");

		if (text.length == 0)
		{
			$(".btnFind").ibxWidget("option", "disabled", true);
			$(".btnFindPrevious").ibxWidget("option", "disabled", true);
			$(".btnReplaceAll").ibxWidget("option", "disabled", true);
		}
		else
		{
			$(".btnFind").ibxWidget("option", "disabled", false);
			$(".btnFindPrevious").ibxWidget("option", "disabled", false);
			$(".btnReplaceAll").ibxWidget("option", "disabled", false);
		}
	},
	
	_find:function(e)
	{
		var dlg;
		var idx;
		
		var ea = $(".te-txt-area")[0].firstChild;
		var cs = $(".cbMatchCase").ibxWidget("checked");
		var eaValLC = cs? ea.value : ea.value.toLowerCase();
		
		//var ft = cs ? this.fp.findText.getText() : this.fp.findText.getText().toLowerCase();		
		var ft = cs ? $(".findText").ibxWidget("option", "text") : $(".findText").ibxWidget("option", "text").toLowerCase();
		
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
/*			
			if (BiBrowserCheck.ie_standards_patch) // hack to deal with IE not selecting and scrolling to range set by setSelectionRange(selStart, selEnd)
			{
			    var range = ea.createTextRange();
			    range.collapse(true);
			    range.moveEnd('character', idx + ftLen);
			    range.moveStart('character', idx);
			    range.select();
			}
			else
			{
*/			
				ea.setSelectionRange(idx, idx + ftLen);
				ea.focus();								// need this for FF
				//ea.setFocused(true);	// need this for Chrome				
//			}
			
			this._setCursorPositionInfo(e);
					
			if(isChrome) //hack for chrome scrolling
			{			
				var rowHeight = 15;
				//var linePosition = this.linePosLbl.getText();
				var linePosition = $(".linePosLbl").ibxWidget("option", "text");
				
				if(linePosition > 0)
					linePosition -= 1;
				
				var scrollPosition = rowHeight * linePosition;
				
				ea.scrollTop = scrollPosition;
			}
			
			$(".btnFind").ibxWidget("option", "disabled", false);
			$(".btnFindPrevious").ibxWidget("option", "disabled", false);
			$(".btnReplace").ibxWidget("option", "disabled", false);

		}
		else
		{
			$(".btnFind").ibxWidget("option", "disabled", true);
			$(".btnFindPrevious").ibxWidget("option", "disabled", true);
			$(".btnReplace").ibxWidget("option", "disabled", true);
/*			
			dlg = BiDialog.createMessageDialog(BiStringBundle.formatString(g_strBundle.getString("bid_textNotFound"), ft));
			dlg.setOpaque(true);
			dlg.setVisible(true);
			return;
*/			
		}
	},
	/*-------------------------------------------------------------------------------------------------------*/
	_findPrev:function(e)
	{	
		var dlg;
		var idx;
		
		var ea = $(".te-txt-area")[0].firstChild;
		var cs = $(".cbMatchCase").ibxWidget("checked");
		var eaValLC = cs? ea.value : ea.value.toLowerCase();
		//var ft = cs ? this.fp.findText.getText() : this.fp.findText.getText().toLowerCase();
		var ft = cs ? $(".findText").ibxWidget("option", "text") : $(".findText").ibxWidget("option", "text").toLowerCase();
		
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
			/*
			if(selStart > ftLen) // lastIndexOf(string, x) search inclusive position x
			{
				selStart -= ftLen; // search for result that located ENTIRELY BEFORE SELECTION.
			}
			 */
		}
		
		idx = eaValLC.lastIndexOf(ft, selStart);
		
		if (idx == -1) // wrap around to search the remainder of text
		{
			idx = eaValLC.lastIndexOf(ft, eaValLCLen);
		}
		
		if (idx != -1)
		{
/*			
			if (BiBrowserCheck.ie_standards_patch) // hack to deal with IE not selecting and scrolling to range set by setSelectionRange(selStart, selEnd)
			{
			    var range = ea.createTextRange();
			    range.collapse(true);
			    range.moveEnd('character', idx + ftLen);
			    range.moveStart('character', idx);
			    range.select();
			}
			else
			{
*/			
				ea.setSelectionRange(idx, idx + ftLen);
				ea.focus();								// need this for FF
				//ea.setFocused(true);	// need this for Chrome		
//			}
			
			this._setCursorPositionInfo(e);
			
			if(isChrome) //hack for chrome scrolling
			{			
				var rowHeight = 15;
				var linePosition = $(".linePosLbl").ibxWidget("option", "text");
				
				if(linePosition > 1)
					linePosition -= 1;
				
				var scrollPosition = (rowHeight * linePosition) - rowHeight;
				
				ea.scrollTop = scrollPosition;
			}
			
			$(".btnFind").ibxWidget("option", "disabled", false);
			$(".btnFindPrevious").ibxWidget("option", "disabled", false);
			$(".btnReplace").ibxWidget("option", "disabled", false);

		}
		else
		{
			$(".btnFind").ibxWidget("option", "disabled", true);
			$(".btnFindPrevious").ibxWidget("option", "disabled", true);
			$(".btnReplace").ibxWidget("option", "disabled", true);
/*			
			dlg = BiDialog.createMessageDialog(BiStringBundle.formatString(g_strBundle.getString("bid_textNotFound"), ft));
			dlg.setOpaque(true);
			dlg.setVisible(true);
			return;
*/			
		}
	},
	/*-------------------------------------------------------------------------------------------------------*/
	_replace:function(e)
	{
		this.unDoText.push($(".te-txt-area").ibxWidget("option", "text"));
		$(".btnUndo").ibxWidget("option", "disabled", false);
		
		var ea = $(".te-txt-area")[0].firstChild;
		var ft = $(".findText").ibxWidget("option", "text");
		var replText =$(".replaceText").ibxWidget("option", "text");
		var ftLen = ft.length;
		this.changed = true;
		
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
		$(".btnReplace").ibxWidget("option", "disabled", true);
	},
	/*-------------------------------------------------------------------------------------------------------*/
	_replaceFind:function(e)
	{
		this._replace(e);
		//this.find(e);
	},
	/*-------------------------------------------------------------------------------------------------------*/
	_replaceAll:function(e)
	{
		this.unDoText.push($(".te-txt-area").ibxWidget("option", "text"));
		$(".btnUndo").ibxWidget("option", "disabled", false);
		
		this.changed = true;
		
		var cs = $(".cbMatchCase").ibxWidget("checked");		
		var ft = $(".findText").ibxWidget("option", "text");
		var replText =$(".replaceText").ibxWidget("option", "text");
		
		var text = $(".te-txt-area").ibxWidget("option", "text");
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
			$(".te-txt-area").ibxWidget("option", "text", text2);
		}
	},

	
	
	
	
	_onOptions:function(e)
	{
		/*
		this.optionsDlg = new BipEditorOptionsDlg(this);
		this.optionsDlg.setVisible(true);
		this.optionsDlg.init(this.options);
		this.optionsDlg.addEventListener("dialogresult", this.gatherOptions, this);
		*/
	},

	_selectAll:function(textArea)
	{
		textArea.focus();
		
		textArea.select();
	},

	_deleteTextareaSelectedText:function(textArea)
	{
		var selection;
		var textAreaValue = textArea.value;
		var textAreaValueLength = textAreaValue.length;	
		var selStart = textArea.selectionStart;
		var selEnd = textArea.selectionEnd;
		var newValue = textAreaValue.substring(0, selStart);	
		newValue += textAreaValue.substring(selEnd, textAreaValueLength);
		
		textArea.value = newValue;
		
		textArea.setSelectionRange(selStart, selStart);
		textArea.focus();
	},
	_setCursorPosition:function(textArea)
	{
		textArea.setSelectionRange(0, 0);
		textArea.focus();
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