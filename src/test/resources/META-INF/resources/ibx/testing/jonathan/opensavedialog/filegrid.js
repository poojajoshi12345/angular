/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function filegrid()
{	
	var _this=this;
	
	filegrid.prototype.init = function (parentarea, columns, sortCallBack, selectedCallBack, setCallBack, showColumns, 
			openFolderCallBack, runCallBack, isMobile, thisContext, fileSingleClick, columnmenu)
	{			
			this.parentarea = parentarea;		
			this.initialized = true;		
			//this.gridarea=".grid-main";
			this.gridarea = parentarea;
			_this.selectedCallBack = selectedCallBack;
			_this.setCallBack = setCallBack;
			_this.openFolderCallBack = openFolderCallBack;
			_this._isMobile = isMobile;
			_this.runCallBack = runCallBack;
			_this.thisContext = thisContext;
			_this.fileSingleClick = fileSingleClick;
			
			$(parentarea).empty();
			//this.gridmain = ".files-listing";
			this.gridmain = parentarea;
			//$(this.gridmain).empty();
			this.columns = columns;	
			this.showColumns = showColumns;
			
			var ilen = columns.length;
			// build the title area
			var titlebox='<div class="files-box-files-title"  data-ibx-type="ibxHBox" data-ibxp-align="center" >';
			var jtitlebox=$(titlebox);
			var currcol=0;
			var numvisibleitems=0;
			var maxwidth=95;
			for(i=0; i<ilen; i++ )
			{
				if(showColumns[i])
				{
					var type=columns[i][1];
					if(type!="icon" && type!="menu")numvisibleitems++;
					if(type=="menu")maxwidth=maxwidth-10;
					
				}	
			}
			var percentitem = Math.floor(maxwidth / numvisibleitems) + "%";
			var flexitem = "1 1 " + percentitem;
			this.flexitem = flexitem;
			var icon = false;
			
			for(i=0; i<ilen; i++ )
			{
				if(showColumns[i])
				{	
					currcol++;
					
					var type=columns[i][1];
					var cell="";
					var jcell="";				
					if(type == "icon")
					{
						
						cell="";
						icon=true;
					}
					else if(type=="menu")
					{
						cell="<div class='grid-cell-title'></div>";
						jcell=$(cell);	
						$(jcell).css("width", "10px");	
					}	
					else
					{
						var sorticon = "";
						if(columns[i][4] == "up")sorticon="arrow_upward";
						else if(columns[i][4] == "down")sorticon="arrow_downward";			
							
						cell="<div class='grid-cell-title' data-ibx-type='ibxButtonSimple' data-ibxp-icon-position='right' data-ibxp-glyph-classes='material-icons'";
						cell+=sformat(" data-ibxp-glyph='{1}' data-ibxp-text='{2}' </div>", sorticon, columns[i][0]);
						jcell=$(cell);											
						
						if(columns[i][2] == "description" && columns[i][4] == "up")
						{
							jcell.on("click", sortCallBack.bind(_this.thisContext, "default", "", true));							
						}
						else
						{
							jcell.on("click", sortCallBack.bind(_this.thisContext, columns[i][2], columns[i][1], true));							
						}				
						if(icon == true)
						{							
							icon = false;
						}
						
					}	
					if(cell != "")
					{					
						if(type!="menu")$(jcell).css("flex", flexitem);
						$(jtitlebox).append(jcell);
					}				
				}			
			}
			// we now add an options menu at the end
			var cell="<div class='grid-cell-title grid-cell-title-cog' data-ibxp-glyph-classes='fa fa-cog' data-ibx-type='ibxButton' ></div>";
			var jcell=$(cell);		
			//$(jcell).attr('onClick', 'columnmenu(this)');
			jcell.on("click", columnmenu.bind(_this.thisContext, jcell));
			$(jtitlebox).append(jcell);
			
			$(this.gridmain).append(jtitlebox);
			ibx.bindElements(this.gridmain);
			var filebox='<div class="files-box-files-area" data-ibx-type="ibxVBox" data-ibxp-align="stretch"></div>';
			this.jfilebox=$(filebox);
			$(this.gridmain).append(this.jfilebox);
			ibx.bindElements(this.gridmain);
			
	};
	
	filegrid.prototype.initialized=false;
	filegrid.prototype.parenatera=null;
	filegrid.prototype.columns=null;
	filegrid.prototype.gridarea="";
	filegrid.prototype.flexitem="";
	filegrid.prototype.jfilebox="";
	
	
	filegrid.prototype.addrow = function(data, ibfsitem, folder, inrow)
	{
		var rowbox='<div class="files-box-files-row"  data-ibx-type="ibxHBox" data-ibxp-align="center" ></div>';
		var jrowbox=$(rowbox);	
		var grname="grid_row" + inrow ;
		$(jrowbox).addClass(grname);
		
		var columns=this.columns;
		var showColumns=this.showColumns;
		var ilen=columns.length;
		var currcol=0;
		//var xfunction = (folder)? "foldermenu" : "filemenu";
		//xfunction+="(this, '" + ibfsitem + "');";
		var icon = false;
		var iconcol = -1;
		var havemenu = false;
		for(i=0; i<ilen; i++ )
		{		
			if(showColumns[i])
			{			
					
				currcol++;
				var cell="";
				var jcell="";
				
				var type=columns[i][1];
				if(type=="icon")
				{				
					
					icon = true;
					iconcol = i;
					
					
				}	
				else if(type=="alpha" || type=="number" || type=="date")
				{	
					cell="<div class='grid-cell-data' data-ibx-type='ibxLabel' data-ibxp-icon-position='left' ";
					cell+=sformat("data-ibxp-text='{1}'  ></div>", data[i]);				
					
					jcell=$(cell);
					ibx.bindElements(jcell);
					if(icon)
					{	
						$(jcell).ibxLabel("option", "glyphClasses", data[iconcol]);
						if(folder)$(jcell).addClass("files-box-files-folder-icon");
						icon=false;
					}	
				}	
				else if(type=="menu")
				{	
					cell="<div class='cell-image' data-ibxp-glyph-classes='fa fa-ellipsis-v' data-ibx-type='ibxButton' ></div>";				
					jcell=$(cell);	
					if(folder)
					{	
						$(jcell).click(function(){
							_this.selectedCallBack(ibfsitem,3);
							foldermenu(this,ibfsitem);
						});
					}	
					else
					{
						$(jcell).click(function(){
							_this.selectedCallBack(ibfsitem,3);
							filemenu(this,ibfsitem);
						});		
					}
					//$(jcell).attr('onClick', xfunction);
					$(jcell).css("width", "10px");
					havemenu = true;
				}
				
				
						
				if(cell !="" && !_this.isMobile)
				{	
					if(!folder)
					{
						$(jcell).on("dblclick", _this.runCallBack.bind(_this.thisContext,ibfsitem));
						//$(jcell).dblclick(function(){_this.runCallBack(ibfsitem);}).bind(_this.thisContext);	
						$(jcell).contextmenu(function(){							
							_this.selectedCallBack(ibfsitem,3);
							filemenu(this,ibfsitem);
						});				
					}
					else
					{
						$(jcell).on("dblclick", _this.openFolderCallBack.bind(_this.thisContext,ibfsitem));
						//$(jcell).dblclick(function(){_this.openFolderCallBack(ibfsitem);}).bind(_this.thisContext);					
						$(jcell).contextmenu(function(){
							_this.selectedCallBack(ibfsitem,3);
							foldermenu(this,ibfsitem);
						});
					}
					
				}
				
				if(cell!="")
				{
					if(type!="menu")$(jcell).css("flex", this.flexitem);				
					
					$(jrowbox).append(jcell);
					if(!havemenu)
					{	
						cell="<div></div>";
						jcell=$(cell);	
						$(jcell).css("width", "10px");
						$(jrowbox).append(jcell);
					}
				}
			}	
		}		
		var odd = false;
		if(inrow % 2 == 0)odd = true;
		if(odd)$(jrowbox).addClass("grid-row-odd");
		var x="."+grname;
		$(jrowbox).hover(function()
				{
					if(odd)$(x).removeClass("grid-row-odd");
				    $(x).addClass("grid-row-hover");
				    }, function(){	    	
				    $(x).removeClass("grid-row-hover");
				    if(odd)$(x).addClass("grid-row-odd");
				});
		
		$(jrowbox).click(function(event)				
		{
				var item = $(this).data("ibfsitem"); 
				var key=0;
				if (event.ctrlKey || event.metaKey)key=1;
				if (event.shiftKey)key=2;
				var isSelected = _this.selectedCallBack(item,key);
									
		});
		if(_this.fileSingleClick)$(jrowbox).on("click", _this.fileSingleClick.bind(_this.thisContext,ibfsitem));	
					
		
		$(jrowbox).data("ibfsitem", ibfsitem);
		
		$(jrowbox).on( "selectSet", function( event ) {	
			if(odd)$(jrowbox).removeClass("grid-row-odd");
			$(jrowbox).addClass("grid-row-selected");
		});
		$(jrowbox).on( "selectUnset", function( event ) {	
			
			$(jrowbox).removeClass("grid-row-selected");
			if(odd)$(jrowbox).addClass("grid-row-odd");
		});
		
		
		
		_this.setCallBack(ibfsitem.fullPath, jrowbox, true);
	
		$(this.jfilebox).append(jrowbox);
		ibx.bindElements(this.gridmain);
			
	};

};
