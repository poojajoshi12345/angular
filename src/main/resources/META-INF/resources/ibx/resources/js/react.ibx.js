$.widget("ibi.ibxReactContainer", $.Widget, 
{
	options:
	{
		autoCreate:true,
		autoRender:true,
	},
	_widgetClass:"ibx-react-container",
	_create:function()
	{
		this._super();
		this.element.data("ibiIbxWidget", this);
	},
	_init:function()
	{
		this._super();
		this.option(ibx.getIbxMarkupOptions(this.element));
		if(this.options.autoCreate)
			this.createComponent(this.options.autoRender);
	},
	_component:null,
	component:function()
	{
		return this._component;
	},
	createComponent:function(andRender)
	{
		var reactComponent = this._bindComponents( this.element.children("[data-ibx-react-type]").first());
		if(andRender)
			ReactDOM.render(reactComponent[0], this.element[0]);
		return reactComponent;
	},
	_bindComponents:function(elements)
	{
		var retComponents = [];
		for(var i = 0; i < elements.length; ++i)
		{
			var element = $(elements[i]);
			if(element.prop('nodeType') === 1)
			{
				var args = [];
				var reactType = element.attr('data-ibx-react-type');
				args.push((reactType && (reactType[0] === reactType[0].toUpperCase())) ? eval(reactType) :  element.prop('nodeName').toLowerCase());
		
				var reactOptions = ibx.getIbxMarkupOptions(element);
				reactOptions.className = element.attr('class');
				args.push(reactOptions);

				var childComponents = this._bindComponents(element.contents());
				for(var j = 0; j < childComponents.length; ++j)
					args.push(childComponents[j]);

				this._component = React.createElement.apply(null, args);
				retComponents.push(this._component);
			}
			else
				retComponents.push(element.text());
		}
		return retComponents;
	}
});

$.widget("ibi.ibxReactComponent", $.Widget, 
{
	options:
	{
	},
	reactOptions:
	{
	},
	_widgetClass:"ibx-react-component",
	_create:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
		this.reactOptions = ibx.getIbxMarkupOptions(this.element);
	},
	createComponent:function()
	{
	}
});

//# sourceURL=react.ibx.js
