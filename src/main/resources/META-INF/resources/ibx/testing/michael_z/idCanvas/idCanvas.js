$.widget("ibi.idCanvas", $.ibi.ibxWidget,
{
	options:
	{
		
	},	
	_widgetClass: "id-canvas",
	_create: function ()
	{
		this._super();
		var markup = ibx.resourceMgr.getResource(".canvas-panel", false).children();
		this.element.append(markup);
		ibx.bindElements(this.element);
		
		this._chart = new tdgchart();
		this.firstChart = true;
		this.dropLabel = $("<div>").ibxLabel({"text": "Drop measures and dimensions here"}).addClass("drop-label");
	},
	loadChart: function(oPreview)
	{		 
		var wasInSample = this.inSample;
		if (oPreview.sample)
		{
			this._chart.noDataMode = true;
			this.inSample = true;			
		}
		else
		{
			this.inSample = false;
		}				
		if (oPreview.pfjscript || oPreview.mbscript)
		{
			if (oPreview.pfjscript)
				eval(oPreview.pfjscript);
			if (oPreview.mbscript)
				eval(oPreview.mbscript);		
		}
		else
		{
			for (var i=0;i<oPreview.scriptBlocks.length;++i)
			{
				var script = oPreview.scriptBlocks[i].scriptBlocks;
				if (script)
					eval(script);
			}
		}
		var chartDiv = $(".chart-div")[0];
		if (!wasInSample && !this.inSample && !this.firstChart)
			this._chart.morph();
		else
			this._chart.draw(chartDiv);
		this.firstChart = false;
		this._showDropLabel(this.inSample);
	},
	_showDropLabel: function(bShow)
	{
		var $dropLabel = $(".drop-label");
		var $chartDiv = $(".chart-div");
		if (bShow)
		{			
			var left = $chartDiv.width()/2;
			var top = $chartDiv.height()/2;			
			var labelOffset = $dropLabel.width()/2;
			left = left-labelOffset;
			$dropLabel.css("left", left);
			$dropLabel.css("top", top);
			$dropLabel.show();
		}
		else
		{
			$dropLabel.hide();
		}
		$chartDiv.toggleClass("chart-sample", bShow);	
	}
});

//# sourceURL=idCanvas.js