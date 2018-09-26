/*global window: false, document: false, Element: false, jQuery: false, $: false */
/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

// TODO: dispatch more events
// TODO: promote connection lines to widgets
$.widget('ibi.ibxDiagram', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram',
	options: {
		selectMode: 'fit',  // One of 'fit' or 'touch'
		grid: {
			size: null,  // Either null (disable grid) or a number.  If a number, snap each node to a grid with intervals this large (in px).
			offset: {left: 0, top: 0}  // If grid.size is set, start grid this far from the top left corner of the diagram container
		}
	},
	_create: function() {
		this._super();
		this._connections = [];
		var w = this.element[0].clientWidth;
		var h = this.element[0].clientHeight;
		this._svgContainer = $('<svg xmlns="http://www.w3.org/2000/svg" class="ibx-diagram-svg-container" width="' + w + '" height="' + h + '"></svg>');
		this._nodeContainer = $('<div class="ibx-diagram-node-container">');
		this.children().each((function(idx, child) {
			this.add(child);
		}).bind(this));
		this.element.append(this._svgContainer);
		this.element.append(this._nodeContainer);
	},
	_destroy: function() {
		this._super();
	},
	_refresh: function() {
		this._super();

		this._svgContainer.attr('width', this.element[0].clientWidth);
		this._svgContainer.attr('height', this.element[0].clientHeight);

		this.element.click((function() {
			this.clearSelectedNodes();
			this.triggerSelectionChange();
		}).bind(this));

		if (this.options.grid.size == null) {
			this._nodeContainer.children().each(function(idx, child) {
				$(child).draggable({grid: false});
			});
		} else {
			var gridSize = this.options.grid.size;
			this._nodeContainer.children().each(function(idx, child) {
				child = $(child).ibxDiagramNode('instance');
				child.lockToGrid();
				child.element.draggable({grid: [gridSize, gridSize]});
			});
		}
		this.updateConnections();
	},
	convertToNode: function(node) {  // Convert any variation of a 'node' into an ibxDiagramNode instance
		if (node && node.widgetName === 'ibxDiagramNode') {  // TODO: clean this up - cascade isn't clear
			return node;  // Node is already an ibxDiagramNode
		} else if (node instanceof Element) {
			node = $(node);  // Assume node is a fully formed DOM node representing a diagram node
		} else if (!(node instanceof jQuery)) {
			node = $('<div>').ibxDiagramNode(node);  // Assume 'node' is an ibxDiagramNode options object like {left, right, className, ...}.  Create a DOM node for it.
		}
		var res = node.ibxDiagramNode('instance');
		if (res) {
			return res;
		}
		return node.ibxDiagramNode().ibxDiagramNode('instance');
	},
	add: function(el, elSibling, before, refresh) {
		var classList = el.customClassList;
		var node = this.convertToNode(el);
		if (!node) {
			return null;
		}

		elSibling = $(elSibling);
		if (elSibling.length) {
			node.element[before ? 'insertBefore' : 'insertAfter'](elSibling);
		} else {
			this._nodeContainer[before ? 'prepend' : 'append'](node.element);
		}

		node.diagram = this;
		node.init();

		if (classList) {
			node.element.addClass(classList.join(' '));
		}
		if (refresh) {
			this.refresh();
		}
		return node;
	},
	remove: function(el, destroy, refresh) {
		var ret;
		if (el == null) {  // no arguments mean remove everything
			this._nodeContainer.children().each((function(idx, child) {
				this.remove(child);
			}).bind(this));
		} else {
			var node = this.convertToNode(el);
			var evt = node.element.dispatchEvent(
				'ibx_diagram_delete_node',
				node,
				true, true, node.element[0]
			);
			if (!evt.isDefaultPrevented()) {
				ret = node.element[destroy ? 'remove' : 'detach']();
				this._connections = $.grep(this._connections, function(connection) {
					return connection.from.node !== node && connection.to.node !== node;
				});
			}
		}
		this.resetConnections();  // Don't leave any dangling connection lines
		if (refresh) {
			this.refresh();
		}
		return ret;
	},
	clear: function() {
		this._nodeContainer.children().each((function(idx, child) {
			this.convertToNode(child).element.detach();
		}).bind(this));
		this._connections = [];
		this.resetConnections();
		this.refresh();
	},
	removeSelectedNodes: function() {
		this._nodeContainer.children().each((function(idx, child) {
			child = $(child).ibxDiagramNode('instance');
			if (child.options.selected) {
				this.remove(child);
			}
		}).bind(this));
	},
	selectNode: function(e) {
		if (!e.ctrlKey) {
			this._nodeContainer.children().each(function(idx, child) {
				child = $(child).ibxDiagramNode('instance');
				child.options.selected = false;
				child.element.removeClass('ui-selected');
			});
		}
		var node = this.convertToNode(e.currentTarget);
		if (node && node.options.selectable) {
			node.options.selected = e.ctrlKey ? !node.options.selected : true;
			node.element.toggleClass('ui-selected', node.options.selected);
		}
		this.triggerSelectionChange();
	},
	clearSelectedNodes: function() {
		this._nodeContainer.children().each((function(idx, child) {
			child = $(child).ibxDiagramNode('instance');
			child.options.selected = false;
			child.element.removeClass('ui-selected');
		}).bind(this));
	},
	triggerSelectionChange: function() {
		this.element.dispatchEvent(
			'ibx_diagram_selection_change',
			this.getSelectedNodes(),
			true, true, this.element[0]  // canBubble, canCancel, relatedTarget
		);
	},
	getSelectedNodes: function() {
		return this._nodeContainer.children().filter(function(idx, child) {
			return $(child).ibxDiagramNode('option').selected;
		});
	},
	resetConnections: function() {
		this._svgContainer.empty();
		var connections = this._connections;
		this._connections = [];
		connections.forEach((function(connection) {
			this.addConnection(connection);
		}).bind(this));
	},
	addConnection: function(connection) {
		var g = $.ibi.ibxDiagram.getConnectionPath(connection.from.tip, connection.to.tip);
		if (connection.className) {
			g.addClass(connection.className);
		}
		this._svgContainer.append(g);
		var lineWidth = parseInt(window.getComputedStyle(g[0].firstElementChild).strokeWidth, 10);
		var from = this.convertToNode(connection.from.node);
		var to = this.convertToNode(connection.to.node);
		this._connections.push({
			className: connection.className,
			from: {
				node: from,
				anchor: connection.from.anchor,
				tip: $.ibi.ibxDiagram.clone(connection.from.tip)
			},
			to: {
				node: to,
				anchor: connection.to.anchor,
				tip: $.ibi.ibxDiagram.clone(connection.to.tip)
			},
			g: g[0],
			lineWidth: lineWidth
		});
		this.refresh();
		return this._connections.length - 1;
	},
	removeConnection: function(connectionIndex) {
		if (connectionIndex >= 0 && connectionIndex < this._connections.length) {
			this._connections.splice(connectionIndex, 1);
			this.resetConnections();
			this.refresh();
		}
	},
	updateConnections: function() {
		// Keep this function fast; it gets called on every mouse move
		for (var i = 0; i < this._connections.length; i++) {
			var connection = this._connections[i];
			var g = connection.g;
			var c1 = connection.from.node.element[0];
			var c1AnchorSize = connection.from.node.getAnchorSize(connection.from.anchor) / 2;
			var c2 = connection.to.node.element[0];
			var c2AnchorSize = connection.to.node.getAnchorSize(connection.to.anchor) / 2;
			var box1 = c1.getBoundingClientRect();
			var box2 = c2.getBoundingClientRect();
			var x1 = c1.offsetLeft + box1.width;
			var y1 = c1.offsetTop + (box1.height / 2);
			var x2 = c2.offsetLeft;
			var y2 = c2.offsetTop + (box2.height / 2);
			var padLeft = (g.childNodes[1] == null) ? 0 : connection.lineWidth;
			var padRight = (g.childNodes[2] == null) ? 0 : connection.lineWidth;
			var length = $.ibi.ibxDiagram.distance(x1, y1, x2, y2) - c1AnchorSize - padLeft - c2AnchorSize - padRight;
			var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

			// Move overall arrow to start connection point and rotate to point to end connection
			g.transform.baseVal.getItem(0).setTranslate(x1 + c1AnchorSize + padLeft, y1);
			g.transform.baseVal.getItem(1).setRotate(angle, 0, 0);

			g.childNodes[0].setAttribute('x2', length);  // Set line's end point
			if (g.childNodes[2]) {
				g.childNodes[2].transform.baseVal.getItem(0).setTranslate(length, 0);  // Position end arrow, if any
			}
		}
	}
});

$.ibi.ibxDiagram.clone = function(json) {
	return JSON.parse(JSON.stringify(json || null));
};

$.ibi.ibxDiagram.distance = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

$.ibi.ibxDiagram.arrowShapeToPath = function(tip) {
	var size = tip.size || 10, shape = (tip.shape || '').toLowerCase();
	switch (shape) {
		case 'arrow-hollow':
			return 'M' + size + ' ' + (-size) + 'L0 0L' + size + ' ' + size + 'L0 0';
		case 'arrow':
			return 'M' + size + ' ' + (-size) + 'L0 0L' + size + ' ' + size + 'Z';
	}
	return '';
};

$.ibi.ibxDiagram.getConnectionPath = function(fromTip, toTip) {
	// Connections are drawn in a group that has been transformed such that
	// (0, 0) is at left connection and (100, 0) is on right connection
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.setAttribute('transform', 'translate(0, 0) rotate(0)');

	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute('x1', 0);
	line.setAttribute('y1', 0);
	line.setAttribute('x2', 0);
	line.setAttribute('y2', 0);
	g.appendChild(line);

	if (fromTip) {
		var tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tip.setAttribute('d', $.ibi.ibxDiagram.arrowShapeToPath(fromTip));
		g.appendChild(tip);
	}

	if (toTip) {
		var tip2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tip2.setAttribute('d', $.ibi.ibxDiagram.arrowShapeToPath(toTip));
		tip2.setAttribute('transform', 'translate(0, 0) rotate(180)');
		g.appendChild(tip2);
	}
	return $(g).addClass('ibx-diagram-connection');
};

$.widget('ibi.ibxDiagramNode', $.ibi.ibxWidget, {  // TODO: derive from base jquery ui widget ($.Widget)
	_widgetClass: 'ibx-diagram-node',
	options: {  // All optional; can also be set via the equivalent CSS properties
		left: null,
		top: null,  // TODO: remove these, but keep json api
		width: null,
		height: null,
		text: '',  // TODO: kill this
		data: null,  // TODO: kill or hide this
		annotations: [],
		selectable: true,  // If true, node can be clicked on to select it  // TODO: like delete, fire event, if shut down don't select
		moveable: true,    // If true, node cannot be dragged or moved around
		selected: false
	},
	_create: function() {
		this._super();
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}
		if (this.options.text) {
			this.element.html($('<span class="ibx-diagram-node-text">' + this.options.text + '</span>'));
		}
	},
	_destroy: function() {
		this._super();
	},
	refresh: function() {
		this._super();
		this.element.css({
			left: this.options.left,
			top: this.options.top,
			width: this.options.width,
			height: this.options.height
		});
		this.element.toggleClass('ibx-selectable', this.options.selectable);
		if (this.diagram) {
			this.element.draggable({disabled: !this.options.moveable});
			this.lockToGrid();
			this.diagram.updateConnections();
		}
	},
	init: function() {  // TODO: change to _init, so it's called automatically

		var diagram = this.diagram;
		var options = this.options;
		var nodeEl = this.element;
		var selectedNodes, offset;

		nodeEl.draggable({
			containment: 'parent',
			stack: '.ibx-diagram-node',
			disabled: !options.moveable,
			start: function() {  // TODO: move multi-select movement code to diagram
				selectedNodes = [];
				diagram._nodeContainer.children().each((function(idx, child) {
					child = $(child).ibxDiagramNode('instance');
					var el = child.element[0];
					if (child.options.selected && child.options.moveable && el !== this) {
						selectedNodes.push({
							node: el,
							offset: el.getBoundingClientRect()
						});
					}
				}).bind(this));
				if (selectedNodes.length) {
					selectedNodes.canvasSize = {
						width: diagram.element[0].clientWidth,
						height: diagram.element[0].clientHeight
					};
					offset = this.getBoundingClientRect();
				}
			},
			drag: function(e, ui) {
				if (selectedNodes.length) {
					var box = selectedNodes.canvasSize;
					var dx = ui.position.top - offset.top, dy = ui.position.left - offset.left;
					selectedNodes.forEach(function(el) {
						el.node.style.left = Math.max(0, Math.min(box.width - el.offset.width, el.offset.left + dy)) + 'px';
						el.node.style.top = Math.max(0, Math.min(box.height - el.offset.height, el.offset.top + dx)) + 'px';
					});
				}
			}
		}).css('position', '')  // draggable sets position to relative; undo that
			.on('drag', function(e) {
				diagram.convertToNode(e.target).updatePosition();
				diagram.updateConnections();
			});

		nodeEl.toggleClass('ibx-selectable', options.selectable);
		nodeEl.attr('tabindex', diagram._nodeContainer.children().length);  // Need tabindex to make basic divs focusable and receive keyboard events
		nodeEl.keydown(function(e) {
			if (e.keyCode !== $.ui.keyCode.DELETE) {  // TODO: move function callback to prototype callback or similar
				return;
			}
			diagram.removeSelectedNodes();
		});
		nodeEl.click(function(e) {
			diagram.selectNode(e);
			e.stopPropagation();
		});

		// Force position to absolute, in case it's been set otherwise elsewhere
		nodeEl.css('position', 'absolute');

		// If position / size was set via CSS instead of options, copy those settings to options for consistency
		if (options.left == null || options.top == null) {
			this.updatePosition();
		}
		if (options.width == null || options.height == null) {
			var box = this.element[0].getBoundingClientRect();
			options.width = box.width;
			options.height = box.height;
		}
		this.children().each((function(idx, domNode) {
			var annotation = this.addAnnotation(domNode);
			if (annotation) {
				this.options.annotations.push(annotation);
			}
		}).bind(this));

		if (this.options.annotations.length) {
			this.options.annotations = this.options.annotations.map((function(annotation) {
				if (annotation && annotation.widgetName === 'ibxDiagramAnnotation') {
					return annotation;  // Node is already an ibxDiagramAnnotation
				}
				var classList = annotation.customClassList;
				annotation = $('<div>').ibxDiagramAnnotation(annotation);  // Assume 'annotation' is an ibxDiagramNode options object like {left, right, className, ...}.  Create a DOM node for it.
				annotation = this.addAnnotation(annotation);

				if (classList) {
					annotation.element.addClass(classList.join(' '));
				}
				return annotation;
			}).bind(this));
		}
	},
	addAnnotation: function(annotation) {
		annotation = $(annotation).ibxDiagramAnnotation('instance');
		if (annotation) {
			annotation.parent = this;
			if (annotation.element[0].parentElement !== this.element[0]) {
				this.element.append(annotation.element);
			}
			annotation.init();
		}
		return annotation;
	},
	updatePosition: function() {
		this.options.left = this.element[0].offsetLeft;
		this.options.top = this.element[0].offsetTop;
	},
	lockToGrid: function() {
		var gridSize = this.diagram.options.grid.size;
		if (this.options.moveable && gridSize != null) {
			var offset = this.diagram.options.grid.offset;
			var pos = this.element.position();
			this.element.css({
				left: (Math.floor(pos.left / gridSize) * gridSize) + offset.left,
				top: (Math.floor(pos.top / gridSize) * gridSize) + offset.top
			});
		}
	},
	getAnchorSize: function(side) {
		var annotations = this.options.annotations;
		for (var i = 0; i < annotations.length; i++) {
			var o = annotations[i].options;
			if (o.position === side) {
				return (side === 'top' || side === 'bottom') ? o.height : o.width;
			}
		}
		return 0;
	}
});

// TODO: get rid of this entirely; caller can just use ibxLabel.overlays
$.widget('ibi.ibxDiagramAnnotation', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram-annotation',
	options: {  // All optional; can also be set via the equivalent CSS properties
		position: null,  // Either ''top', 'right', 'bottom', left', or an object {left, top}
		width: null,
		height: null,
		offset: 0,
		text: ''
	},
	_create: function() {
		this._super();
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}
		if (this.options.text) {
			this.element.html($('<span class="ibx-diagram-annotation-text">' + this.options.text + '</span>'));
		}
	},
	_destroy: function() {
		this._super();
	},
	refresh: function() {
		this._super();
	},
	init: function() {
		var options = this.options;
		var position = {left: null, top: null, width: null, height: null};
		if (options.position != null) {
			var pos = this.getPosition();
			position.left = pos.left;
			position.top = pos.top;
		}
		position.width = options.width;
		position.height = options.height;
		this.element.css(position);
	},
	getPosition: function() {
		var pos = this.options.position;
		if (pos.hasOwnProperty('left') && pos.hasOwnProperty('top')) {
			return pos;
		}
		if (!this.parent) {
			return {left: 0, top: 0};
		}
		var offset = this.options.offset || 0;
		var w = (this.options.width / 2) + offset;
		var h = (this.options.height / 2) + offset;
		var parentW = this.parent.options.width, parentH = this.parent.options.height;
		if (pos === 'top') {
			return {left: (parentW / 2) - w, top: -h};
		} else if (pos === 'right') {
			return {left: parentW - w, top: (parentH / 2) - h};
		} else if (pos === 'bottom') {
			return {left: (parentW / 2) - w, top: parentH - h};
		} else if (pos === 'left') {
			return {left: -w, top: (parentH / 2) - h};
		}
		return {left: 0, top: 0};
	}
});

//# sourceURL=diagram.ibx.js
