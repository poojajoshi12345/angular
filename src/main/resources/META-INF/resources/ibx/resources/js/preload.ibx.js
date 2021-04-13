/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:

/******************************************************************************
	ANY JAVASCRIPT CODE WE NEED EXECUTED BEFORE ANYTHING ELSE
******************************************************************************/

//IE11 does not support setDragImage, so we just stub it out for now.
if(DataTransfer && !DataTransfer.prototype.setDragImage)
	DataTransfer.prototype.setDragImage = function(){};



//# sourceURL=preload.ibx.js

