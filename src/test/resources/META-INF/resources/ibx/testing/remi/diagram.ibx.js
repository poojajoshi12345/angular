/*global document: false, Element: false, jQuery: false, $: false */
/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget('ibi.ibxDiagram', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram',
	options: {
		grid: {
			size: null,  // Either null (disable grid) or a number.  If a number, snap each node to a grid with intervals this large (in px).
			offset: {left: 0, top: 0}  // If grid.size is set, start grid this far from the top left corner of the diagram container
		}
	},
	_create: function() {

		this._super();
		this.element.click((function(e) {
			if ($(e.target).ibxDiagramNode('instance') == null) {
				this.select();
			}
		}).bind(this));
		this._children = [];
		this._connections = [];

		this.children().each((function(idx, node) {
			this.addNode(node);
		}).bind(this));

		var w = this.element[0].clientWidth;
		var h = this.element[0].clientHeight;
		this._canvas = $('<svg xmlns="http://www.w3.org/2000/svg" class="ibx-diagram-canvas" width="' + w + '" height="' + h + '"></svg>');
		this.element.append(this._canvas);
	},
	_destroy: function() {
		this._super();
	},
	addNode: function(node) {
		if (node instanceof Element) {
			node = $(node);
		} else if (!(node instanceof jQuery)) {  // Assume 'node' is an ibxDiagramNode options object like {left, right, className, ...}
			var child = $('<div>').ibxDiagramNode(node);
			node = child;
		}

		if (node.ibxDiagramNode('instance') == null) {  // If node is not yet an ibxDiagramNode, make it one
			node = node.ibxDiagramNode(node);
		}

		node = node.draggable({containment: 'parent', stack: '.ibx-diagram-node'})
			.on('drag', (function() {this.updateConnections();}).bind(this))
			.css('position', '')  // draggable sets position to relative; undo that
			.mousedown((function(e) {this.select(e.currentTarget);}).bind(this));

		this._children.push(node);
		if (node[0].parentElement !== this.element[0]) {
			this.element.append(node);
		}
		this.refresh();
		return node;
	},
	select: function(node) {
		this._children.forEach(function(child) {
			child.removeClass('ui-state-highlight');
		});
		if (node) {
			$(node).addClass('ui-state-highlight');
		}
	},
	addConnection: function(connection) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line = $(line).attr({x1: 0, y1: 0, x2: 500, y2: 500}).addClass('ibx-diagram-connection');
		this._canvas.append(line);
		var from = connection.from.node, to = connection.to.node;
		if (typeof from === 'number') {
			from = this._children[from];
		}
		if (typeof to === 'number') {
			to = this._children[to];
		}
		this._connections.push({
			from: {node: from[0], anchor: connection.from.anchor},
			to: {node: to[0], anchor: connection.to.anchor},
			line: line[0]
		});
		this.refresh();
		return line;
	},
	updateConnections: function() {
		this._connections.forEach(function(connection) {
			var line = connection.line;
			var c1 = connection.from.node;
			var c2 = connection.to.node;
			var box1 = c1.getBoundingClientRect();
			var box2 = c2.getBoundingClientRect();
			line.setAttribute('x1', c1.offsetLeft + box1.width - 1);
			line.setAttribute('y1', c1.offsetTop + (box1.height / 2));
			line.setAttribute('x2', c2.offsetLeft + 1);
			line.setAttribute('y2', c2.offsetTop + (box2.height / 2));
		});
	},
	refresh: function() {
		this._super();
		if (this.options.grid.size == null) {
			this._children.forEach(function(child) {
				child.draggable({grid: false});
			});
		} else {
			var gridSize = this.options.grid.size;
			var offset = this.options.grid.offset;
			this._children.forEach((function(child) {
				var pos = child.position();
				child.css({
					left: (Math.floor(pos.left / gridSize) * gridSize) + offset.left,
					top: (Math.floor(pos.top / gridSize) * gridSize) + offset.top
				});
				child.draggable({grid: [gridSize, gridSize]});
			}).bind(this));
		}
		this.updateConnections();
	}
});

$.widget('ibi.ibxDiagramNode', $.ibi.ibxWidget, {
	_widgetClass: 'ibx-diagram-node',
	options: {  // All optional; can also be set via the equivalent CSS properties
		left: null, top: null,
		width: null, height: null
	},
	_create: function() {
		this._super();
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}
		if (this.options.text) {
			this.element.html(this.options.text);
		}
		if (this.options.anchors) {
			this.addAnchor('top', this.options.anchors.top);
			this.addAnchor('right', this.options.anchors.right);
			this.addAnchor('bottom', this.options.anchors.bottom);
			this.addAnchor('left', this.options.anchors.left);
		}
	},
	addAnchor: function(position, anchor) {
		if (!anchor || !anchor.width || !anchor.height) {
			return;
		}
		var div = $('<div>');
		div.css({width: anchor.width, height: anchor.height, position: 'absolute'});
		if (anchor.className) {
			div.addClass(anchor.className);
		}
		var left, top;
		var w = this.options.width, h = this.options.height;
		var anchorX = anchor.width / 2, anchorY = anchor.height / 2;
		switch (position) {
			case 'top':
				left = (w / 2) - anchorX;
				top = -anchorY;
				break;
			case 'right':
				left = w - anchorX;
				top = (h / 2) - anchorY;
				break;
			case 'bottom':
				left = (w / 2) - anchorX;
				top = h - anchorY;
				break;
			case 'left':
				left = -anchorX;
				top = (h / 2) - anchorY;
				break;
		}
		div.css({left: left, top: top});
		this.element.append(div);
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
	}
});

//# sourceURL=diagram.ibx.js
