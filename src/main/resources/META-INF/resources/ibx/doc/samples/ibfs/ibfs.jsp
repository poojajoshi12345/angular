<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.2 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx ibfs sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				//create an Ibfs object and when loaded the last parm function will be called
				Ibfs.load(applicationContext, WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val, null).done(function(ibfs)
				{
					window.ibfs = ibfs;
					ibfs.login("admin", "admin").done(function(exInfo)
					{
						var rootItem = new IbfsRootItem(ibfs);
						$(".ibfs-tree-container").append(rootItem.getElement());
					});
				});

				//all ibfs calls emit events, which multiple interested parties can listen for.  Ibfs can be configured to use
				//any object as the event emitter, the window is the default.
				$(window).on("ibfs_list_items", function(e, exInfo)
				{
					var items = exInfo.result;
				});


				$(".ibfs-explore-button").on("click", function(e)
				{
					//var dlg = ibx.resourceMgr.getResource(".ibfs-explore-dialog");
					//dlg.ibxWidget({ctxPath:"IBFS:/WFC/Repository/Public"}).ibxWidget("open");
				});

				$(".output-frame").droppable({accept:".ibfs-item"}).on("drop", function(e, ui)
				{
					var data = ui.draggable.data();
					$(".output-frame").ibxWidget("option", "src", data.ibfsItem._item.uriExec);
				});

			}, ["../testing/samples/ibfs/resources/ibfs_bundle.xml"], true);



			/****
				Encapsulation of ibfs item in javascript...of course you could derive your own
				ibxWidget type that does the same thing via jQuery...makes no functional difference either way.
			****/
			function IbfsItem(item, ibfs)
			{
				this._ibfs = ibfs;
				this._item = item;
				this._item.uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", ibfs.getExOptions().appContext,
						encodeURIComponent(item.parentPath), encodeURIComponent(item.name));

				var options = 
				{
					wrap:"true", //allow the ibxLabel to wrap it's children...it's derived from ibxFlexBox
					justify:"start", //align the ibxLabel children to the left (start)
					text: item.description || item.name,
					glyph: "",//item.container ? "folder" : "insert_drive_file",
					glyphClasses: "ibx-icons " + Ibfs.DEFINES.ITEM_TYPE_INFO[item.type].glyphClasses || "",//item.container ? "folder" : "insert_drive_file","material-icons"
				}
				this._element = $("<div tabIndex='0'>").ibxLabel(options).ibxAddClass("ibfs-item").data({"ibfs":ibfs, "ibfsItem":this, "ibfsObject":item}); //dom element bound to widget.
				this._element.on(
				{
					"click":this._onClick.bind(this),
					"dblclick":this._onDblClick.bind(this)
				}); //dom click events bound to this
				this._widget = this._element.ibxWidget("instance"); //actual jQueryUI widget instance.  Can call functions directly on this.
				
				//container for children
				if(item.container)
					this._children = $("<div class='ibfs-children'>").ibxVBox({align:"stretch"}).appendTo(this._element);
				else
					this._element.ibxDraggable();
			};
			_p = IbfsItem.prototype = new Object();
			_p.getElement = function(){return this._element;};
			_p.getWidget = function(){return this._widget;};
			_p._onClick = function(e)
			{
				this.toggle();
				e.stopPropagation();
			};
			_p._onDblClick = function(e)
			{
				$(".output-frame").ibxWidget("option", "src", this._item.uriExec);
				e.stopPropagation();
			};
			_p._expanded = false;
			_p.toggle = function(){this.expand(!this._expanded);};
			_p.expand = function(expand)
			{
				if(this._item.container)
				{
					this._expanded = expand;
					this._children.empty()
					if(this._expanded)
					{
						this._ibfs.listItems(this._item.fullPath, null, null, {asJSON:true}).done(function(exInfo)
						{
							$.each(exInfo.result, function(idx, item)
							{
								var ibfsItem = new IbfsItem(item, this._ibfs);
								this._children.append(ibfsItem.getElement());
							}.bind(this));
						}.bind(this));
					}
				}
			};
			
			//encapsulates the static root IBFS:.
			function IbfsRootItem(ibfs, options)
			{
				var item = 
				{
					type:"MRFolder",
					description:"IBFS Tree Root",
					fullPath:"IBFS:",
					container:true
				}
				$.extend(item, options);
				IbfsItem.call(this, item, ibfs);
			}
			_p = IbfsRootItem.prototype = IbfsItem.prototype;
		</script>

		<style type="text/css">
			.outer-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.content-box
			{
				flex:1 1 auto;
			}

			.ibfs-tree-container
			{
				width:20%;
				overflow:auto;
			}

			.output-frame
			{
				flex:1 1 auto;
			}

			.ibfs-item
			{
				font-size:14px;
				line-height:1.5em;
			}

			.ibfs-item:focus
			{
				box-shadow:none;
			}
			.ibfs-item:focus > .ibx-label-text
			{
				background-color:#888;
				color:white;
			}

			.ibfs-children
			{
				width:100%; /*force flex box wrapping*/
				margin-left:.75em; /*indent for children*/
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="outer-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="tool-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="ibfs-explore-button" data-ibx-type="ibxButton" data-ibxp-inline="false" data-ibxp-text="IBFS Explore Dialog" data-ibxp-glyph="search" data-ibxp-glyph-classes="material-icons"></div>
			</div>

			<div class="content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="ibfs-tree-container" data-ibx-type="ibxWidget"></div>
				<div class="ibfs-output" data-ibx-type="ibxSplitter"></div>
				<div class="output-frame" data-ibx-type="ibxIFrame" data-ibxp-src="./ibfs_output_placeholder.jsp"></div>
			</div>

			<div class="footer-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
			</div>
		</div>
	</body>
</html>
