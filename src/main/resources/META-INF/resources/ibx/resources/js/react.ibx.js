$.widget("ibi.ibxReactComponent", $.Widget, 
{
	options:
	{
		reactType:null,
	},
	reactProps:{},
	_widgetClass:"ibx-react-component",
	_create:function()
	{
		this._super();
		this.element.ibxAddClass(this._widgetClass);
		this.element.data("ibiIbxWidget", this);
	},
	_init:function()
	{
		this._super();
		this.options.reactType = this.element.attr('data-ibx-react-type') || this.options.reactType;
		this.render(ibx.getIbxMarkupOptions(this.element));
	},
	render:function(props)
	{
		var options = this.options;
		props = this.reactProps = $.extend({}, this.reactProps, props);

		var args = [eval(options.reactType), props];
		var component = React.createElement.apply(null, args);
		ReactDOM.render(component, this.element[0]);
	},
});

//# sourceURL=react.ibx.js
