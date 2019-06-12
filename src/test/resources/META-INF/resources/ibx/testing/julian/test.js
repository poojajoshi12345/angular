
function shape()
{

}
_p = shape.prototype = new Object();
_p.init = function()
{

};

function oval()
{

}
_p = oval.prototype = new shape();
_p.init = function()
{
	/*...*/
	shape.prototype.init.call(this);
}


$.widget("shapeapp.obj", {
	options: {
		_positionX: 1,
		_positionY: 2,
		_visibility: false,
	},

	_create: function () {

	},
	_internalPositionX:0,
	positionX: function (x) {
		if (x === undefined) {      
			return this.option("_positionX");
		}
		else {
			this.option("_positionX", isNaN(x) ? 0 : x);
		}
	},

	positionY: function (y) {
		if (y === undefined) {
			return this.option("_positionY");
		}
		else {
			this.option("_positionY", isNaN(y) ? 0 : y);
		}
	},

	visibility: function (visibility) {
		if (visibility === undefined) {
			return this.option("_visibility");
		}
		else {
			this.option("_visibility", visibility);
		}
	},
});

$.shapeapp.obj.variable = "foo"

//#region Marker Widget
$.widget("shapeapp.marker", $.shapeapp.obj, {
	_create: function () {
		this._elem = $("<div></div>");
		this._elem.addClass("marker");
		this._elem.data(this);
	},

	positionX: function (x) {
		$.shapeapp.obj("positionX",x);
	},

	setPosition: function (x, y) {
		this.positionX(x);
		this.positionY(y);
		this.configure();
	},

	configure: function () {
		this._elem.css({
			"top": this.positionY + "px",
			"left": this.positionX + "px"
		});
	},

	getElem: function(){
		return this._elem;
	}


});