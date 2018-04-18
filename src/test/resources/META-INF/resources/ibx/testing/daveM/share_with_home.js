/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

	$.widget("ibi.sharewith", $.ibi.ibxDialog,
	{
		options:
		{
			path: "",
			show: "all", // Users/Group
		},	
		_widgetClass: "home-sharewith",		
		
		_getIBFSlistShares: function()
		{	
			form.ibxWidget('open');	
			this._startProgress();

			var uriExec = sformat("{1}/wfirs", applicationContext);
			var argument=
			{
				IBFS_service: "ibfs",		
				IBIVAL_returnmode: "XMLENFORCE",
				IBFS_action: "listShares",
				IBFS_path: this.options.path,
				IBFS_flatten: "false",
				IBFS_recursionDepth: "1"	
			 };	
			argument[IBI_random] = Math.floor(Math.random() * 100000);
	   		argument[home_globals.SesAuthParm] = home_globals.SesAuthParmVal;
	   		
	   		$.post(uriExec, argument , function(data, status) 
			{
				if (status=="success") 
				{
					this.shareWithlist = [];
					var items = $("item", data);
					items.each(function(idx, el)
					{
						el = $(el);
						var fullPath = el.attr("fullPath");
						var name = el.attr("name");
						var type = "u";
						var email = "";
						if (fullPath.lastIndexOf("USERS/") != -1)
						{
							this.currentUserArrayStr += name + ",";
							email = el.attr("email");
						}
						else
						{
							this.currentGroupArrayStr += name + ",";
							type = "g";
						}
						this.shareWithlist.push({
					        name: name,
					        description: el.attr("description"),
						    email: email,
						    type: type
						});
						
					}.bind(this));
					
					this.shareWithlist.sort(function (a, b) {
						return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
					});

					$(".Share-with-others-menu").on("ibx_select", this._onMenuItemSelect.bind(this));

					this._stopProgress();
					
					if (this.shareWithlist.length > 0)
						this._ShareWithList(this.options.show); // Show current Group and Users list shared
				}
				else
					alert("listShares failed");				
			}.bind(this));
		},

		_ShareWithList: function(type)
		{ // user, group, all
			this._startProgress();
			$(form).find(".share-with-container").children().remove();
			this._showContainerTitle(); // depend on the type
			var itemList = $(".share-with-container");

			for (var i=0; i < this.shareWithlist.length; i++)
			{
				if (type == "all" || this.shareWithlist[i].type == type)
				{
					var userdata = {}; // init
					userdata.type = this.shareWithlist[i].type;
					userdata.name = this.shareWithlist[i].name;
	
					var item = new userGroupItem(this.shareWithlist[i],false);
					item.element.addClass("share-with-item-user");
					item.element.data("userData",userdata);
					itemList.append(item.element);
				}
			}
			
			$(form).find(".sw-close-button").on('click', function (e)
			{ 
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
					return; // do nothing

				var userData = $(e.currentTarget.parentElement).data("userData");
				
				this.currentUserArrayStr=",";
				this.currentGroupArrayStr=",";
				
				for (var i=0; i < this.shareWithlist.length; i++)
				{ // remove object that got deleted
					if (this.shareWithlist[i].type == userData.type && this.shareWithlist[i].name == userData.name)
						this.shareWithlist.splice(i, 1);						
				}
				
				for (var i=0; i < this.shareWithlist.length; i++)
				{
					if (this.shareWithlist[i].type == "u")
						this.currentUserArrayStr += this.shareWithlist[i].name + ",";
					else
						this.currentGroupArrayStr += this.shareWithlist[i].name + ",";
				}						
				
				$(e.currentTarget.parentElement).remove();
				this._showContainerTitle();
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);

			}.bind(this));
			
			this._stopProgress();
		},

		_DropDownList: function()
		{ // show drop down dialog
			clearTimeout(this.typingTimer);
	
			var searchString = form.find(".share-with-txt-search").ibxWidget("option", "text");

			var runAjax = true;
			if (this.basesearchString == "")
			{ // init
				this.currentSearchArray = [];
				this.basesearchString = searchString;
			}
			else
			{
				if (this.currentSearchArray.length < 500 && searchString.substr(0, this.basesearchString.length).toUpperCase() == this.basesearchString.toUpperCase())
					runAjax = false;
				else
					this.basesearchString = "";
			}
	
			if (runAjax)
			{
				this._startProgress();

				$('#shareWithDropdown').empty();
	
				var url;
				switch (this.showOption)
				{
					case "u":
						url = sformat("{1}/userlist", applicationContext);
						break;
					case "g":
						url = sformat("{1}/grouplist ", applicationContext);
						break;
					case "all":
					default:
						url = sformat("{1}/usergrouplist", applicationContext);
						break;
				}

				$.ajax({
				    type: "POST",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					url: url,
					data: {"searchPath":"*" + searchString + "*","searchRows": 100,"searchIndex": 0},		
					dataType: "json",
					context: this,
				    success: function(json) 
				    {
				    	if (json.length > 0)		    		
				    	{				    	
					    	this.currentSearchArray = json;
							// Show the popup window
							this.searchDialog.ibxWidget("open").position({my:"left top", at:"left-5px bottom+6px", of: form.find(".share-with-btn-search")});
							
							json.length < this.maxRows ? $(this.searchDialog).find(".share-with-dropdown-label").hide() : $(this.searchDialog).find(".share-with-dropdown-label").show();
	
							var itemList = $('#shareWithDropdown');						
							for (var i = 0; i < json.length; i++)
					    	{			    		
								var userdata = json[i]; // init
		
								var item = new userGroupItem(json[i],true);
								
								if (json[i].type == "u")
								{
									if (this.currentUserArrayStr.indexOf("," + json[i].name + ",") == -1)
										{
											item.element.addClass("share-with-item");
											userdata.disabled = false;						
										}
										else
										{
											item.element.addClass("share-with-item share-with-item-disabled");
											userdata.disabled = true;						
										}						
								}
								else
								{
									if (this.currentGroupArrayStr.indexOf("," + json[i].name + ",") == -1)
									{
										item.element.addClass("share-with-item");
										userdata.disabled = false;
									}
									else
									{
										item.element.addClass("share-with-item share-with-item-disabled");
										userdata.disabled = true;
									}
								}
								
								item.element.data("userData",userdata);
								itemList.append(item.element);
					    	}
							
							this.searchDialog.focus();
							$(".share-with-txt-search").focus();
	
					    	this._stopProgress();

					    	$('#shareWithDropdown').on("scroll", function (event) 
					    	{
								$.ajax({
								    type: "POST",
									contentType: "application/x-www-form-urlencoded; charset=UTF-8",
									url: url,
									data: {"searchPath":"*" + this.basesearchString + "*","searchRows": 100,"searchIndex": 100},		
									dataType: "json",
									context: this,
								    success: function(json) 
								    {
										var itemList = $('#shareWithDropdown');						
										for (var i = 0; i < json.length; i++)
								    	{			    		
											var userdata = json[i]; // init
					
											var item = new userGroupItem(json[i],true);
											
											if (json[i].type == "u")
											{
												if (this.currentUserArrayStr.indexOf("," + json[i].name + ",") == -1)
													{
														item.element.addClass("share-with-item");
														userdata.disabled = false;						
													}
													else
													{
														item.element.addClass("share-with-item share-with-item-disabled");
														userdata.disabled = true;						
													}						
											}
											else
											{
												if (this.currentGroupArrayStr.indexOf("," + json[i].name + ",") == -1)
												{
													item.element.addClass("share-with-item");
													userdata.disabled = false;
												}
												else
												{
													item.element.addClass("share-with-item share-with-item-disabled");
													userdata.disabled = true;
												}
											}
											
											item.element.data("userData",userdata);
											itemList.append(item.element);
								    	}								    	
								    }
								});
/*					    	    var lastDiv = document.querySelector(".item-user-group > div:last-child");
					    	    var maindiv = document.querySelector(".share-with-dropdown");
					    	    var lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
					    	    var pageOffset = maindiv.offsetTop + maindiv.clientHeight;   
					    	    if (pageOffset > lastDivOffset - 10) 
					            if ($('#shareWithDropdown').height() <= $('#shareWithDropdown').scrollTop())
					            {
					                alert('end of page');
					            }
					    		/*
							     var newDiv = document.createElement("div");
							        newDiv.innerHTML = "my awesome new div";
							        $('#shareWithDropdown').append(newDiv);*/
					    	}.bind(this));

							$(this.searchDialog).find(".share-with-item").on( "click", function( e ) 
							{
								var userdata = $(e.currentTarget).data("userData");
	
								if (userdata.disabled) // user click on disable item
									return;
										
								$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);
	
								if (userdata.type == "g")
									this.currentGroupArrayStr += userdata.name + ",";
								else
									this.currentUserArrayStr += userdata.name + ",";
								
								this.isDropdownOpen = false;
								
								this.shareWithlist.push({
									name: userdata.name,
									description: userdata.description,
									email: userdata.email,
									type: userdata.type
								});
								
								this.shareWithlist.sort(function (a, b) {
									return (a.description < b.description ? -1 : (a.description > b.description ? 1 : 0));
								});
								
								this._ShareWithList(this.showOption); // Show current Group and Users list shared
								this.searchDialog.ibxWidget("close");
								this._resetUserGroup();
							}.bind(this));	
				    	}
						else
						{
							this._stopProgress();
						//	this.searchDialog.ibxWidget("close");
						//	this._resetUserGroup();
						}
				    },
			        error: function() 
			        {   
			        	alert("usergrouplist failed");
			        }
				});
			}
			else
			{
				// show hide items in the dialog
				var newString = searchString.startsWith("*") ? searchString.substr(1) : searchString;
				var regx = new RegExp(newString, "gi");
				var items = $(".item-user-group");
				items.each(function(text, regx, idx, el)
				{
					var item = el._userGroupItem;
					if(!item)
						return;
					var passed = regx.test(item.description);
					passed = passed || regx.test(item.name); 
					el.style.display = passed ? "" : "none";
				}.bind(this, newString, regx));
			}

		},

		_create: function ()
		{
			this._super();
			this.shareWithlist = [];
			this.currentSearchArray = [];
			this.currentUserArrayStr = ",";
			this.currentGroupArrayStr = ",";
			this.showOption = this.options.show;
			this.isDropdownOpen = false;
			this.searchDialog = null;
			this.maxRows = 500;
			this.typingTimer=null;
			this.basesearchString = "";
			
			form = ibx.resourceMgr.getResource('.share-with-others-dialog');
			this.searchDialog = ibx.resourceMgr.getResource('.share-with-container-dialog', true);
			
			$(this.searchDialog).find(".share-with-dropdown-label").hide();
			$(this.searchDialog).find(".share-with-dropdown-label").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("str_showing_first_x_entries"),this.maxRows));

			form.find(".share-with-title").hide();
			
			$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
			$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_share_with_others"));
			$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("home_ok"));

			this._getIBFSlistShares(); // start collection data
			 
			$(form).find(".share-with-txt-search").on('ibx_action ibx_textchanged', function (e, info)
			{
				clearTimeout(this.typingTimer);
				var str = $(form).find(".share-with-txt-search").ibxWidget("option", "text");
				if (str.length == 0)
				{
					this.isDropdownOpen = false;
					this.searchDialog.ibxWidget("close");
					this._resetUserGroup();
				}									
				else
					this.typingTimer = setTimeout(function() { this._DropDownList();}.bind(this), 250);
			}.bind(this));
			
			$(form).find(".ibx-dialog-cancel-button").on('click', function (e)
			{ 
				this.searchDialog.ibxWidget("close");
				this._resetUserGroup();
			}.bind(this));
			
			$(form).find(".ibx-dialog-ok-button").on('click', function (e)
			{ 
				var i;
				var arShareIds = [];
				for (var i=0; i < this.shareWithlist.length; i++)
				{
					if (this.shareWithlist[i].type == "u")
						arShareIds.push("IBFS:/SSYS/USERS/"+this.shareWithlist[i].name);
					else
						arShareIds.push("IBFS:/SSYS/GROUPS/"+this.shareWithlist[i].name);
						
				}
				home_globals.ibfs.setShares(this.options.path, arShareIds, { asJSON: true, eError: 'fatal_error' }).done(function (exInfo)		
				{		
					if (exInfo.result.length == 0)
					{
						this._checkForError(exInfo);				
					}
					home_globals.homePage.refreshfolder(this.options.path.substring(0, this.options.path.lastIndexOf('/')));
						    	
				}.bind(this));
			}.bind(this));
			
			$( window ).resize(function() 
			{
				if (this.searchDialog != null && this.searchDialog.ibxWidget("isOpen"))
				{
					this.searchDialog.ibxWidget("close");
					this._resetUserGroup(); // reset
				}
			}.bind(this));
			
			$(form).on("ibx_beforeclose", function(e, closeData)
			{
				if (this.searchDialog)
				{
					this.searchDialog.ibxWidget("close");
					this.searchDialog.detach();
				}
				
			}.bind(this));
		},	
		
		_onMenuItemSelect:function(e, menuItem)
		{
			this.showOption = $(menuItem).data("menuCmd");
			this._setmenuItem(this.showOption);
			this.searchDialog.ibxWidget("close");
			this._resetUserGroup();
			
			if (this.isDropdownOpen)
			{ // you must close the menu if it is open
	//			this._resetUserGroup(); // reset
				this.isDropdownOpen = false;
	//			this.searchDialog.ibxWidget("close");
			}
//			this._ShareWithList(this.showOption); // Show current list shared
		},
		
		_resetUserGroup: function()
		{
			$(form).find(".share-with-txt-search").ibxWidget('option', 'text', "");
			this.basesearchString = "";
			this.currentSearchArray = [];
		},
		
		_setmenuItem: function(show)
		{	
			switch (show)
			{
				case "u":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", true);					
					break;
				case "g":
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", false);
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", true);
					break;
				case "all":
				default:
					$(form).find(".share-with-txt-search").ibxWidget('option', 'placeholder', ibx.resourceMgr.getString("home_enter_users_and_groups"));
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUser']").ibxWidget("option", "checked", false);										
					$(".Share-with-others-menu").find("[data-ibx-name='miModeGroup']").ibxWidget("option", "checked", false);					
					$(".Share-with-others-menu").find("[data-ibx-name='miModeUserGroup']").ibxWidget("option", "checked", true);
					break;
			}
			this._ShareWithList(show); // Show current list shared
		},
		
		_showContainerTitle: function()
		{ 
			switch (this.showOption)
			{
				case "u":
					this.currentUserArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "g":
					this.currentGroupArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
				case "all":
				default:
					this.currentGroupArrayStr.length == 1 && this.currentUserArrayStr.length == 1 ? $(form).find(".share-with-title").hide() : $(form).find(".share-with-title").show();
					break;
			}			
		},
				
	    _checkForError: function(exInfo)
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
	    				var text = $(this).attr('localizeddesc');	    					
	    				captionText = ibx.resourceMgr.getString("unrecoverable_error");
	    				var options = 
	    				{
	    					type:"medium error",
	    					caption:captionText,
	    					buttons:"ok",		
	    					messageOptions:{text:text}
	    				};
	    				var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
	    				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	    				{	    					
	    				});	    				
	    			}
	    		}						
	    	});
	    					
	    },
				    
		_startProgress:function()
		{	
			var settings = 
			{
				customImage:true
			};

			var options = 
			{
				text: "",
				showProgress: true,
				curVal: 0,
			};
			
			if(settings.customImage)
				options.glyphClasses = "fa fa-circle-o-notch";

			var waiting = ibx.waitStart().css("font-size", "3em");
			settings._startDate = new Date();
			settings._interval = window.setInterval(function(waiting, options, settings)
			{
				waiting.ibxWidget("option", options);
			}, 900, waiting, options, settings);
		},		

		_stopProgress:function()
		{
			ibx.waitStop();
		},
		
		_destroy: function ()
		{
			this._super();
		},
	});
	
	var template = ibx.resourceMgr.getResource('.sw-item-template', true);
	function userGroupItem(ibfsItem,IsClose)
	{
		this.ibfsItem = ibfsItem;
		
		var description = this.description = ibfsItem.description;
		var type = this.type = ibfsItem.type;
		var name = ibfsItem.name;

		if (type == "u" && ibfsItem.email != "" && name != ibfsItem.email)
			name += "(" + ibfsItem.email + ")";						
		this.name = name;
		
		this.element = template.clone().removeClass("sw-item-template");
		if (IsClose) // dropdown items
			this.element.find(".item-close-icon").hide();
		else // share with items
			this.element.removeClass("item-user-group");
		this.element[0]._userGroupItem = this;
		this.element.find(".sw-item-desc").text(description);
		this.element.find(".sw-item-name").text(name);
		this.element.find(".sw-item-icon").addClass((type == "u") ? "sw-item-user" : "sw-item-group");
	}


//# sourceURL=share_with_home.js