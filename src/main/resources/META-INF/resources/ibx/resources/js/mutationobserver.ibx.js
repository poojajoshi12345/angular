/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	MUTATION OBSERVER
******************************************************************************/
$.widget("ibi.ibxMutationObserver", $.Widget, 
{
	options:
	{
		listen:false,
		autoBind:false,
		fnAll:$.noop,
		fnAddedNodes:$.noop,
		fnRemovedNodes:$.noop,
		fnAttribute:$.noop,
		fnCharacterData:$.noop,
		init:
		{
			childList:false,
			subtree:false,
			characterData:false,
			characterDataOldValue:false,
			attributes:false,
			attributeOldValue:false,
			//attributeFilter:[],
		},
		mutationObserver:null,
	},
	_create:function()
	{
		this._super();
		var options = this.options;
		options.mutationObserver = new MutationObserver(this._onMutationEvent.bind(this));
	},
	_destroy:function()
	{
		this.options.mutationObserver.disconnect();
		this._super();
	},
	_init:function()
	{
		this._super();
		this.refresh();
	},
	_onMutationEvent:function(mutations)
	{
		var options = this.options;
		options.fnAll(mutations);

		$.each(mutations, function(idx, mutation)
		{
			$.each(mutation.addedNodes, function(mutation, idx, node)
			{
				if(options.autoBind)
					ibx.bindElements(node);
				options.fnAddedNodes(node, mutation);
			}.bind(this, mutation));

			$.each(mutation.removedNodes, function(mutation, idx, node)
			{
				options.fnRemovedNodes(node, mutation);
			}.bind(this, mutation));

			if(mutation.attributeName)
				options.fnAttribute(mutation.target, mutation.oldValue, mutation.attributeName, mutation.attributeNamespace, mutation)
			if(mutation.type == "characterData")
				options.fnCharacterData(mutation.target, mutation.oldValue, mutation);
		}.bind(this));
	},
	records:function()
	{
		return this.options.mutationObserver.takeRecords();
	},
	refresh:function()
	{
		var options = this.options;
		if(options.listen)
			options.mutationObserver.observe(this.element[0], options.init);
		else
			options.mutationObserver.disconnect();
	}
});

//# sourceURL=mutationobserver.ibx.js

