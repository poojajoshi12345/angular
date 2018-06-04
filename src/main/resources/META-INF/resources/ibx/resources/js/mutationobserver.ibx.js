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
		allEvents:false,
		childList:false,
		subtree:false,
		characterData:false,
		characterDataOldValue:false,
		attributes:false,
		attributeOldValue:false,
		attributeFilter:null,
		mutationObserver:null,
	},
	_create:function()
	{
		this._super();
		var options = this.options;
		options.mutationObserver = new MutationObserver(this._onMutationEvent.bind(this));
	},
	_init:function()
	{
		this.refresh();
		this._super();
	},
	_destroy:function()
	{
		this.options.mutationObserver.disconnect();
		this._super();
	},
	_onMutationEvent:function(mutations)
	{
		var options = this.options;

		this.element.dispatchEvent("ibx_nodemutated", mutations, false, false);
		$.each(mutations, function(idx, mutation)
		{
			if(mutation.addedNodes.length)
				this.element.dispatchEvent("ibx_nodesadded", mutation.addedNodes, false, false);
			if(mutation.removedNodes.length)
				this.element.dispatchEvent("ibx_nodesremoved", mutation.removedNodes, false, false);
			if(mutation.attributeName)
				this.element.dispatchEvent("ibx_nodeattrchange", mutation, false, false);
			if(mutation.type == "characterData")
				this.element.dispatchEvent("ibx_nodecharchange", mutation, false, false);
		}.bind(this));
	},
	records:function()
	{
		return this.options.mutationObserver.takeRecords();
	},
	refresh:function()
	{
		var options = this.options;
		var all = options.allEvents;
		var moOptions = 
		{
			childList: all || options.childList || options.subtree,
			subtree: all || options.subtree,
			characterData: all || options.characterData,
			characterDataOldValue: all || options.characterDataOldValue,
			attributes: all || options.attributes,
			attributeOldValue: all || options.attributeOldValue,
		};
		if(moOptions.attributes && options.attributeFilter)
			moOptions.attributeFilter = options.attributeFilter;

		if(options.listen)
			options.mutationObserver.observe(this.element[0], moOptions);
		else
			options.mutationObserver.disconnect();
	}
});

//# sourceURL=mutationobserver.ibx.js

