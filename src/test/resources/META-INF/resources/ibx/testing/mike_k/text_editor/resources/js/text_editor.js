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
		this.rootPath = "";
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
		
		this.element.on("ibx_open", this._onIbxOpen.bind(this)); // On open of the Editor.
		
		$(".goToLine").hide();
		$(".findReplace").hide();
		
		this.element.resizable();
		
		this.btnBox.css("display", "none"); // Editor Dialog OK / Cancel buttons
	},
	
	_onIbxOpen()
	{
		//alert("_onIbxOpen");
	},
	
	setEditorPath:function(rootPath, folderPath, fileName) // Public method to setup Editor.
	{
		this.rootPath = this._checkPath(rootPath);
		
		this._setEditorPath( this._checkPath( this.folderPath ), fileName);			
	},
	
	_setEditorPath:function(folderPath, fileName)
	{
		this._clearEditorEnvironment();
		
		this.newDoc = fileName.length == 0;

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
		
		if (this.fullItemPath && !this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
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
				this._onOpen(e);
				break;
			case "fileSave":
				
				this._onSaveFunction(e);
				break;
			case "fileSaveAs":
				this._onSaveAsFunction(e);
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
				this._onOpen(e);
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
	_onOpen:function(e)
	{       
		
		if (this.changed || this.optionsChanged)
		{
			// Save Confirm Dialog
			var options = 
			{		
				type:"std question",
				caption:"Select An Option", // TODO: NLS
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", "Yes"); // TODO: NLS
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", "No");
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", "Cancel");
			
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
					this.fexText = $(".te-txt-area").ibxWidget("option", "text");
					this._onSave(e);				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			$(".te-txt-area").focus();
				}
				
			}.bind(this));			
		}
		else
		{
 			$(".te-txt-area").focus();			
			this._onOpenDialog(e);
		}		
	},
	
	_onOpenDialog:function(e)
	{		
		var openDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		openDlg.ibxWidget({
			fileTypes:[[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("htmlType"), "htm"], [ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]], 
			dlgType:"open", 
			title: ibx.resourceMgr.getString("bid_open"), 
			ctxPath:this.folderPath.length > 0 ? this.folderPath.length : this.rootPath,
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
			
			this._setCursorPosition($(".te-txt-area")[0].firstChild);
			this._setCursorPositionInfo();
		}
		else
		{
			this.currentAction = 0;
		}

		$(".te-txt-area").focus();
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
								
				this.folderPath = rPath;
				this.fullName = rName + "." + rExtension;
				this.itemName = rName;
				this.extension = rExtension;
				this.itemDescription = rDescription;	
				this.tool = rTool;
				this.type = rType;
	 
				var item_content = $("item_content", data);
				el = $(item_content);				
				var fText = el.text();
				fText = this._decodeCDATAEncoding(fText);
				this.fexText = fText;					
				$(".te-txt-area").ibxWidget("option", "text", fText);
				
				//this.setCaption(decodeHtmlEncoding(this.folderPath) + "/" + decodeHtmlEncoding(this.itemDescription));
				//$(".text-editor-resources").ibxWidget("option", "text", this.folderPath + this.itemDescription);
				//this.options.text = this.folderPath + this.itemDescription;
				this.options.captionLabelOptions.text = this.folderPath + "/" + this.itemDescription;
				
	 			this._setCursorPosition($(".te-txt-area")[0].firstChild);
	 			this._setCursorPositionInfo();
	 			$(".te-txt-area").focus();
	 			
	 			this.changed = false;
	 			this.optionsChanged = false;
			});
	},
	
	_decodeCDATAEncoding:function (text)
	{
		
		text = text.replace(/IBI_CDATA_START_PATTERN/g, "<![CDATA");
		text = text.replace(/IBI_CDATA_END_PATTERN/g, "]]>");	
		
		return text;
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
			/*<edaEnv>
				<status result="success" message=""/>
					<servers>						
						<server name="EDASERVE" />						
						<server name="KRAK2" />						
						<server name="KRAK" />						
						<server name="MARTA" />						
						<defServer name="EDASERVE" assigned="true">
							<defApp name="baseapp ibisamp" assigned="true"/>
							<apps>											
							</apps>
						</defServer>
					</servers>
					<flags>
						<paramPrompt value="true"/>
						<runOlap value="false"/>
						<casterStdAlone value="false"/>
						<enableAutoLink value="false"/>
						<autoLinkTarget value="false"/>
					</flags>
				</edaEnv> */								
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
							caption: "Error", // TODO: NLS
							buttons:"ok",
							messageOptions:
							{
								text:sformat("{1}"+ibx.resourceMgr.getString("BT_EDA_ERROR"), message)
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
					
					if (this.options.autoLinkTarget)
					{
						// keep keys disabled for now to avoid propagation of enter key during credential verification 
						this._checkCredentials(event, defServer, true);  	
					}
					else
					{
						$(".te-txt-area").on("keyup", this._onEditorAreaKeyUp.bind(this));
					}
				}           		
				
			}.bind(this));
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
			options.fields["IBFS_edItem_path"] = this.folderPath + "/" + this.itemName + "." + this.extension;
	    }
		
		var form = $("<form>").ibxForm(options).ibxForm("submit", doc);
	},
	
	_onSaveAs:function(e)
	{				
		var saveFileTypes = [[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("htmlType"), "htm"],[ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]];
			
		if(this.folderPath.indexOf("/WFC/") < 0)
			saveFileTypes = [[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("masterType"), "mas"],[ibx.resourceMgr.getString("htmlType"), "htm"], [ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]];

		if (this.folderPath.indexOf("/WFC/") != -1) 			    
		{			    	
			if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
				saveFileTypes.push([ibx.resourceMgr.getString("propertyType"), "prop"]);
			    	
			if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
				saveFileTypes.push([ibx.resourceMgr.getString("manifestType"), "man"]);		    	
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
		
		saveDlg.on("ibx_beforeclose", function(e, closeData)
		{
			//alert("ibx_beforeclose");
			//return false;
		}).on("ibx_close", function (e, closeData)
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
			var saveFileTypes = [[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("htmlType"), "htm"],[ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]];
			
			if(this.folderPath.indexOf("/WFC/") < 0)
				saveFileTypes = [[ibx.resourceMgr.getString("focexecType"), "fex"],[ibx.resourceMgr.getString("masterType"), "mas"],[ibx.resourceMgr.getString("htmlType"), "htm"], [ibx.resourceMgr.getString("wfStyleType"), "sty"],[ibx.resourceMgr.getString("cssType"), "css"]];

			if (this.folderPath.indexOf("/WFC/") != -1) 			    
			{			    	
				if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
					saveFileTypes.push([ibx.resourceMgr.getString("propertyType"), "prop"]);
				    	
				if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
					saveFileTypes.push([ibx.resourceMgr.getString("manifestType"), "man"]);		    	
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
	
	
	// BIP-893 rewritten for being called after editor instantiation based on item property 'autolink'
	_credentialResponse:function(e) 
	{
		alert("_credentialResponse");
		
		
		//msg = sformat("{1}"+ibx.resourceMgr.getString("key"), param1);

/*		
		var msg;
		var loader = e.getTarget();
		var udata = loader.getUserData();
		var server = udata.server;
		// var func = udata.func;  func not needed, on success return, editor is already open 
		var tree = udata.tree;
		var doc = loader.getDocument();
		var status = doc.getElementsByTagName("status")[0].getAttribute("result");
		if (status == "credentials")   // failed attempt - TRY AGAIN
		{
			this.checkCredentials(e, server, false);
			return;
		}
		else if (status == "serverdown")  // server could have gone down since prior attempt was made		
		{
			msg = BiStringBundle.formatString(g_strBundle.getString("BT_SERVER_DOWN"), server);
			mdlg = BiDialog.createMessageDialog(msg);  
			mdlg.addEventListener("dialogresult", function(){ this.close();}, this); 
			mdlg.setVisible(true);
		}
		else if (status == "error")  // ditto
		{
			msg = doc.getElementsByTagName("status")[0].getAttribute("message");
			msg = BiStringBundle.formatString(g_strBundle.getString("BT_ERROR_RUN"), server, msg);
			mdlg = BiDialog.createMessageDialog(msg);
			mdlg.addEventListener("dialogresult", function(){ this.close();}, this);
			mdlg.setVisible(true);
		}
		else  // BIP-893 - on success just return - editor is already open 
		{   
			// enable the edit keys now 
			$(".te-txt-area").on("keyup", this._onEditorAreaKeyUp.bind(this));
			return;
		}
		
*/		
	},

	_sendCredentials:function(e)
	{
		alert("_sendCredentials");
/*
		var dlg = e.getTarget();
		var res = dlg.getDialogResult();
		if (!res)
		{	
			// BIP-893 - on cancel - close editor window
			this.close();
			return;
		}
			
		var userid = res.strUserName;
		var pwd = res.strPassword;

		var udata = dlg.getUserData();
		var server = udata.server;
		var tree = udata.tree;

		var parms = [];
		parms.push("BIP_REQUEST_TYPE=BIP_SET_SRV_CRED"); 
		parms.push("server=" + server); 
		parms.push("IBIR_userid=" + userid);
		parms.push("IBIR_password=" + pwd); 
		parms.push(IBI_random + "=" + rand());
		this.tree.ajaxRequestEx(this.bipActionHandler, parms, true, this.credentialResponse, udata, this);
*/		
	},

	//BIP-893 rewritten to be called after editor instantiation based on item property 'autolink'
	//SEC-347 after the first time, need to let the user know if his attempt has failed
	_checkCredentials:function(ev, server, firstTime)
	{
		alert("_checkCredentials");

		var msg;
	 	var uriExec = sformat("{1}"+this.checkServerAccessHandler, applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument = {};
	 	
	 	argument["BIP_REQUEST_TYPE"] = "BIP_CHK_SRVR_ACCESS";		

	 	argument["server"] = server;
	 	argument["IBI_random"] = randomnum;
	 	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();		

	 	$.post(uriExec, argument)  
	 		.done(function( data ) 
	 		{

				var status =  $("status", data);
				el = $(status);
				var result =  el.attr("result");

				if(result != "credentials")
				{

					/*
					 if (!firstTime)		
	 				{
	 					alert(g_strBundle.getString("BT_BAD_CREDENTIALS"));		
	 				}
	 				var dlg = serverLogon(server);
	 				dlg.setUserData({"server":server, "tree":this.tree});
	 				dlg.addEventListener("dialogresult", this.sendCredentials, this);
					 */
				}
				else if (status == "serverdown")  // close Editor
	 			{					
					msg = sformat("{1}"+ibx.resourceMgr.getString("BT_SERVER_DOWN"), server);
					
					var options = 
					{
						type:"std error",
						caption: "Error", // TODO: NLS title
						buttons:"ok",
						messageOptions:
						{
							text:msg
						}
					};
					
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");			
					
					dlg.on("ibx_close", function (e, closeData)
							{						
								this._onExit(ev);
							}.bind(this));
	 			}
				else if (status == "serverundefined")
	 			{					
					msg = sformat("{1}"+ibx.resourceMgr.getString("BT_SERVER_UNDEF"), server);
					
					var options = 
					{
						type:"std error",
						caption: "Error", // TODO: NLS title
						buttons:"ok",
						messageOptions:
						{
							text:msg
						}
					};
					
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");			
					
					dlg.on("ibx_close", function (e, closeData)
							{						
								this._onExit(ev);
							}.bind(this));
	 			}
				else if (status == "error")
	 			{					
					msg = sformat("{1}"+ibx.resourceMgr.getString("BT_ERROR_RUN"), server);

					var options = 
					{
						type:"std error",
						caption: "Error", // TODO: NLS title
						buttons:"ok",
						messageOptions:
						{
							text:msg
						}
					};
					
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open");			
					
					dlg.on("ibx_close", function (e, closeData)
							{						
								this._onExit(ev);
							}.bind(this));
	 			}
				else // BIP-893 - on success just return - editor is already open 
	 			{		 
	 				// enable the keys now
	 				$(".te-txt-area").on("keyup", this._onEditorAreaKeyUp.bind(this));	
	 			}
				
	 		}.bind(this));
	},
	
	_doSave:function(mode)
	{
		if (!this.changed && !this.optionsChanged && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		var fexText = $(".te-txt-area").ibxWidget('option', 'text');
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
		var tool = this.tool;
 
//Text already retrieved if closing.
//Doing it now would set 'null' as the fextext
		
		if (!this.closing)	
		{
			this.fexText =  $(".te-txt-area").ibxWidget('option', 'text');
		}
		var summary = null;
		this.iaSave = false;
		this.toolLost = false;

		if ((!this.newDoc || mode=="saveas") && tool && tool != "editor")		
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
							caption:"Message", // TODO: NLS
							buttons:"okcancel",
							moveable:false,
							closeButton:false,
							messageOptions:{text:ibx.resourceMgr.getString("BT_LOSE_TOOL"), }
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
		//var saveDlg = null;

		if (saveDlg != null)  // this routine can be called via a dialog or straight (with a null event)
		{			
			mode = saveDlg.data("mode");
			
			var fileName = saveDlg.ibxWidget('fileName');	
			var fileTitle = saveDlg.ibxWidget('fileTitle');				
			var path = this._checkPath( saveDlg.ibxWidget('path') );
			var fileExists = saveDlg.ibxWidget('fileExists');
				
			//msg = sformat("{1}"+ibx.resourceMgr.getString("key"), param1);

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
					caption: "Error", // TODO: NLS title
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
					caption: "Error", // TODO: NLS title
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
	        	this.options.captionLabelOptions.text = this.folderPath + "/" + this.itemDescription;
		}

		this._saveSetup(mode);     
		
		this.overWrite = false;
	},
	
	_gotSaveResponse:function(data)
	{				
		if (this.newDoc)
		{
			// TODO: refresh tree if any
			
		}
		else
		{		
			if (!this.closing)
			{
				$(".te-txt-area").focus();
				//this.setCaption(decodeHtmlEncoding(this.folderPath) + "/" + decodeHtmlEncoding(this.itemDescription));		
				this.options.captionLabelOptions.text = this.folderPath + "/" + this.itemDescription;
			}
		}
		
		this.newDoc = false;
		this.changed = false;
		this.optionsChanged = false;
		
		if(this.currentAction == 1)
		{
			this.currentAction = 0;		
			this._clearEditorEnvironment();
			this.newDoc = true;
			$(".te-txt-area").focus();
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
			$(".te-txt-area").focus();
			this._setCursorPositionInfo();
		}
		else if(this.currentAction == 4)
		{
			this.currentAction = 0;
			this._clearEditorEnvironment();
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
				type:"std question",
				caption:"Select An Option", // TODO: NLS
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", "Yes"); // TODO: NLS
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", "No");
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", "Cancel");
			
			dlg.ibxDialog("open");
			
			dlg.on("ibx_apply", function(e, closeData)
			{
				// NO
				dlg.ibxWidget("close");
				
				this.currentAction = 0;
				this._clearEditorEnvironment(e);
				this.newDoc = true;
				this.editor_options.newDoc = true;

				this._setCursorPosition($(".te-txt-area")[0].firstChild);
		 		$(".te-txt-area").focus();
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
					this.fexText = $(".te-txt-area").ibxWidget("option", "text");
					this._onSave(e);				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			$(".te-txt-area").focus();
				}

			}.bind(this));
		}
		else
		{
			this._clearEditorEnvironment(e);
			this.newDoc = true;
	 		$(".te-txt-area").focus();
	 		this._setCursorPositionInfo(e);
		}
	},

	_onExit:function(e)
	{
		this._clearEditorEnvironment(e);
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
			
			var options = 
			{
				type:"std error",
				caption: "Error", // TODO: NLS title
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("bid_textNotFound")  // How to get String ???????
				}
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");			
		}
	},

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
			
			var options = 
			{
				type:"std information",
				caption: "Message", // TODO: NLS
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("bid_textNotFound")  // How to get String ???????
				}
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");	
			
		}
	},

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

	_replaceFind:function(e)
	{
		this._replace(e);
		//this.find(e);
	},

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

	_checkPath(path)
	{
		if(path.endsWith("/"))
			path = path.substring(0, path.lastIndexOf("/"))
			
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
//# sourceURL=text_editor.js