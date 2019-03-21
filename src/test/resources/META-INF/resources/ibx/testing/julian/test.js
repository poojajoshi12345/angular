	_onMouseEvent:function(e)
	{
		var eType = e.type;
		var options = this.options;
		var eTrueX = e.offsetX + this.element.prop("scrollLeft");
		var eTrueY = e.offsetY + this.element.prop("scrollTop");
		
		if(eType == "mousedown")
		{
			this.stop();

			var event = this.element.dispatchEvent("ibx_beforerubberbandstart", null, true, true);
			if(!event.isDefaultPrevented())
			{
				var pos = this.element.css("position");
				if(pos != "absolute")
					this.element.css("position", "relative").data("ibxSelMgrRubberBandOrigPos", pos);

				var isTarget = this.element.is(e.target);
				var eTrueX = (isTarget ? 0 : e.target.offsetLeft) + e.offsetX;
				var eTrueY = (isTarget ? 0 : e.target.offsetTop) + e.offsetY;
				this._startPoint = {"x":eTrueX, "y":eTrueY};
				this.element.ibxAddClass("ibx-sm-rubber-band-active");
				this._rubberBand = $("<div class='ibx-sm-rubber-band'>").css({"left":eTrueX, "top":eTrueY}).appendTo(this.element);
				this.element.ibxAutoScroll("start");
				this.element.dispatchEvent("ibx_rubberbandstart", null, true, false, this._rubberBand[0]);
			}
		}
		else
		if(eType == "mouseup" && this._rubberBand)
			this.stop();
		else
		if(eType == "mousemove" && this._rubberBand)
		{
			var left = Math.min(this._startPoint.x, eTrueX);
			var top = Math.min(this._startPoint.y, eTrueY);
			var width = Math.abs(this._startPoint.x - eTrueX);
			var height = Math.abs(this._startPoint.y - eTrueY);
			var rBounds = {"left": left, "top":top, "width":width, "height":height};
			this._rubberBand.css(rBounds);
			this.element.dispatchEvent("ibx_rubberbandchange", rBounds, true, false, this._rubberBand[0]);
		}
	},


	_onMouseEvent:function(e)
	{
		var eType = e.type;
		var options = this.options;
		var eTrueX = e.offsetX + this.element.prop("scrollLeft");
		var eTrueY = e.offsetY + this.element.prop("scrollTop");
		
		if(eType == "mousedown")
		{
			this.stop();
			var pos = this.element.css("position");
			if(pos != "absolute")
				this.element.css("position", "relative").data("ibxSelMgrRubberBandOrigPos", pos);
			var isTarget = this.element.is(e.target);
			var eTrueX = (isTarget ? 0 : e.target.offsetLeft) + e.offsetX;//if not target have to offset because coords are relative to target until dragging (pointer-events:none while dragging).
			var eTrueY = (isTarget ? 0 : e.target.offsetTop) + e.offsetY;//if not target have to offset because coords are relative to target until dragging (pointer-events:none while dragging).
			this._startPoint = {"x":eTrueX, "y":eTrueY};
		}
		else
		if(eType == "mouseup")
			this.stop();
		else
		if(eType == "mousemove" && this._startPoint)
		{
			if(!this._rubberBand)
			{
				var event = this.element.dispatchEvent("ibx_beforerubberbandstart", null, true, true);
				if(!event.isDefaultPrevented())
				{
					this.element.ibxAddClass("ibx-sm-rubber-band-active");
					this._rubberBand = $("<div class='ibx-sm-rubber-band'>").css({"left":eTrueX, "top":eTrueY}).appendTo(this.element);
					this.element.ibxAutoScroll("start");
					this.element.dispatchEvent("ibx_rubberbandstart", null, true, false, this._rubberBand[0]);
				}
			}
			else
			{
				var left = Math.min(this._startPoint.x, eTrueX);
				var top = Math.min(this._startPoint.y, eTrueY);
				var width = Math.abs(this._startPoint.x - eTrueX);
				var height = Math.abs(this._startPoint.y - eTrueY);
				var rBounds = {"left": left, "top":top, "width":width, "height":height};
				this._rubberBand.css(rBounds);
				this.element.dispatchEvent("ibx_rubberbandchange", rBounds, true, false, this._rubberBand[0]);
			}
		}
	},
