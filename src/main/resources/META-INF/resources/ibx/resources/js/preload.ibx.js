/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	ANY JAVASCRIPT CODE WE NEED EXECUTED BEFORE ANYTHING ELSE
******************************************************************************/

//IE11 does not support setDragImage, so we just stub it out for now.
if(DataTransfer && !DataTransfer.prototype.setDragImage)
	DataTransfer.prototype.setDragImage = function(){};


//# sourceURL=ibxPreLoad.ibx.js
