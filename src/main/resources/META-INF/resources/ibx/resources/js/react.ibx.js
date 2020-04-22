$.widget("ibi.ibxReactContainer", $.Widget, 
{
	options:
	{
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
		if(this.options.autoRender)
			this.createReactComponent(this.options.autoRender);
	},
	_component:null,
	component:function()
	{
		return this._component;
	},
	createReactComponent:function(andRender)
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
			var reactType = element.attr('data-ibx-react-type');
			if(reactType)
			{
				var args = [];
				args.push((reactType[0] === reactType[0].toUpperCase()) ? eval(reactType) :  reactType)
				
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
	createReactComponent:function()
	{
	}
});

//# sourceURL=react.ibx.js
