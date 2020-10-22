/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'allmfdtools-bv-flatten-view': '&#xe957;',
            'alpha-datatype-derived-v2': '&#xeaf8;',
            'alpha-datatype-key-v2': '&#xeafd;',
            'analytic-functions-advanced': '&#xeb00;',
            'change-source': '&#xeb02;',
            'change-target': '&#xeb03;',
            'data-except-all2': '&#xeb06;',
            'data-file': '&#xeb07;',
            'data-intersect-all2': '&#xeb08;',
            'data-union-all2': '&#xeb09;',
            'database-automap': '&#xeb0d;',
            'database-join': '&#xeb0e;',
            'database-source-keyed': '&#xeb0f;',
            'database-source': '&#xeb10;',
            'database-target-keyed': '&#xeb11;',
            'database-target-new-keyed': '&#xeb12;',
            'database-target-new': '&#xeb13;',
            'database-view-joins': '&#xeb14;',
            'datatype-date-derived': '&#xeb19;',
            'datatype-date-key': '&#xeb1a;',
            'datatype-geo-derived': '&#xeb1b;',
            'datatype-geo-key': '&#xeb1c;',
            'datatype-time-derived': '&#xeb1d;',
            'datatype-time-key': '&#xeb1e;',
            'datatype-timestamp-derived': '&#xeb1f;',
            'datatype-timestamp-key': '&#xeb20;',
            'decompose_date': '&#xeb21;',
            'dmc-from-data-source-keyed': '&#xeb26;',
            'dmc-rom-data-source': '&#xeb27;',
            'dmc-sql-filtered-data': '&#xeb28;',
            'dmc-sql-fltr-and-fltrd-data': '&#xeb29;',
            'dmc-sql-fltr-srtd-fltrd-data': '&#xeb2a;',
            'dmc-sql-gear': '&#xeb2b;',
            'dmc-sql-sorted': '&#xeb2c;',
            'dmc-sql-srtd-fltrd-data': '&#xeb2d;',
            'dmc-sql-with-filter-sorted': '&#xeb32;',
            'dmc-sql-with-filter': '&#xeb33;',
            'editor-foldlines': '&#xeb34;',
            'filtered-data': '&#xeb35;',
            'from-data-source': '&#xeb36;',
            'join-profiler': '&#xeb37;',
            'numeric-datatype-decimal-derived-v2': '&#xeb38;',
            'numeric-datatype-decimal-hash': '&#xeb39;',
            'numeric-datatype-decimal-key-hash': '&#xeb3a;',
            'numeric-datatype-decimal-key-v2': '&#xeb3b;',
            'numeric-datatype-derived-v2': '&#xeb3c;',
            'numeric-datatype-key-hash': '&#xeb3d;',
            'numeric-datatype-key-v2': '&#xeb46;',
            'parameters-add-default-parm': '&#xeb47;',
            'parameters-add-set-parm': '&#xeb48;',
            'parameters-edit-set-parm': '&#xeb49;',
            'sql-filtered-data': '&#xeb4a;',
            'sql-gear': '&#xeb4b;',
            'sql-sorted': '&#xeb4c;',
            'sql-with-filter-and-filtered-data': '&#xeb4d;',
            'sql-with-filter-and-sorted-filtered-data': '&#xeb4e;',
            'sql-with-filter-sorted': '&#xeb4f;',
            'sql-with-filter': '&#xeb50;',
            'sql-with-sorted-filtered-data': '&#xeb51;',
            'start-email-and-scheduler': '&#xeb52;',
            'start-email': '&#xeb53;',
            'start-procedure-flow': '&#xeb54;',
            'start-scheduler': '&#xeb5d;',
            'target-transformations': '&#xeb5e;',
            'use-data': '&#xeb5f;',
            'wc-dt-database-add': '&#xeb60;',
            'wc-dt-join-add': '&#xeb61;',
            'wc-dt-join-remove': '&#xeb62;',
            'wc-dt-join': '&#xeb63;',
            'wc-dt-tree-remove': '&#xeb64;',
            'layers-geographic': '&#xeb65;',
            'invert-case': '&#xeb66;',
            'format-conversion': '&#xeb67;',
            'manage-sql-repository': '&#xeb68;',
            'measure-rulers-cascaded': '&#xeb69;',
            'mfd-bv-flatten-view': '&#xeb6a;',
            'migration': '&#xeb6b;',
            'object-caption': '&#xeb6c;',
            'procedure-flow-scheduled': '&#xeb6d;',
            'remove-from-hierarchy': '&#xeb6e;',
            'replace': '&#xeb6f;',
            'repository-management': '&#xeb70;',
            'task-email': '&#xeb71;',
            'variable-size-large': '&#xeb72;',
            'variable-size-small': '&#xeb72;',
            'variable-size-medium': '&#xeb72;',
            'wc-dbms-prerequisites': '&#xeb73;',
            'where-total': '&#xeb74;',
            'write-in-calender': '&#xeb75;',
            'flow-procedure-c': '&#xeb76;',
            'flow-procedure-cc': '&#xeb77;',
            'flow-procedure-directload-d': '&#xeb78;',
            'flow-procedure-directload-file-export': '&#xeb79;',
            'flow-procedure-directload-star': '&#xeb7a;',
            'flow-procedure-q': '&#xeb7b;',
            'flow-procedure-qc': '&#xeb7c;',
            'cascaded-windows': '&#xeb7d;',
            'time-dimension': '&#xeb7e;',
            'timestamp': '&#xeb7f;',
            'focexec-procedure-scheduled': '&#xeb80;',
            'flow-procedure-scheduled': '&#xeb81;',
            'fex-procedure-scheduled': '&#xeb82;',
            'workspace-cogs': '&#xeb83;',
            'dimension-square-shadowed': '&#xeb84;',
            'dimension-square': '&#xeb85;',
            'folder-closed-delete-outline': '&#xeb86;',
            'folder-o': '&#xeb87;',
            'folder-closed-outline': '&#xeb87;',
            'folder-minus-outline': '&#xeb88;',
            'page-with-check': '&#xeb89;',
            'page-with-plus-sign': '&#xeb8a;',
            'page-with-times-sign': '&#xeb8b;',
            'set-options-and-run': '&#xeb8c;',
            'resource-management': '&#xeb8d;',
            'find-next': '&#xeb8e;',
            'find-previous': '&#xeb8f;',
            'geomarker-check': '&#xeb90;',
            'geomarker-delete': '&#xeb91;',
            'geomarker-edit': '&#xeb92;',
            'geomarker-exclamation': '&#xeb93;',
            'geomarker-minus': '&#xeb94;',
            'flow-procedure': '&#xeb95;',
            'dmc': '&#xeb96;',
            'direct-load-flow': '&#xeb97;',
            'sql-box': '&#xeb98;',
            'dmc-sql-basic': '&#xeb99;',
            'dimension-square-hollow2': '&#xeb9a;',
            'dimension-square-hollow1': '&#xeb9b;',
            'dimension-numeric-decimal-2': '&#xeb9c;',
            'dimension-numeric-2': '&#xeb9d;',
            'dimension-alpha-2': '&#xeb9e;',
            'bulb-exclamation-mark': '&#xeb9f;',
            'analytic-functions': '&#xeba0;',
            'rm-reconfigure': '&#xeb3e;',
            'row-total': '&#xeb3f;',
            'scheduled-listener-job': '&#xeb40;',
            'sidebar-close': '&#xeb41;',
            'sidebar-open': '&#xeb42;',
            'snowflake': '&#xeb43;',
            'tab-navigate-mode-off': '&#xeb44;',
            'tab-navigate-mode-on': '&#xeb45;',
            'low-procedure-square-scheduled': '&#xeb55;',
            'flow-procedure-square-startflow': '&#xeb56;',
            'flow-procedure-square': '&#xeb57;',
            'data-except': '&#xeb58;',
            'data-intersect': '&#xeb59;',
            'dbms-passthrough': '&#xeb5a;',
            'fex-scheduled': '&#xeb5b;',
            'fex-start': '&#xeb5c;',
            'folder-open-o': '&#xeb2e;',
            'folder-open-outline': '&#xeb2e;',
            'folder-plus-outline': '&#xeb2f;',
            'folders-closed-outline': '&#xeb30;',
            'question-markin-square': '&#xeb0b;',
            'wc-connector-logo-raw-data-file': '&#xeafe;',
            'table-2x2-outline': '&#xeaff;',
            'procedure-flow': '&#xeb0a;',
            'mathsymbol-function': '&#xeb05;',
            'geomarker-plus-outline': '&#xeb15;',
            'geomarker-plus': '&#xeb16;',
            'geomarker-question': '&#xeb17;',
            'source-control': '&#xeafb;',
            'etl-custom-copy': '&#xeb18;',
            'profile-count': '&#xeb0c;',
            'literal-constant': '&#xeb01;',
            'flow-direct-load-procedure': '&#xeafc;',
            'verb-print': '&#xeba1;',
            'query-1': '&#xeba2;',
            'query-2': '&#xeba3;',
            'query-3': '&#xeba4;',
            'union-1': '&#xeba5;',
            'union-2': '&#xeba6;',
            'connect': '&#xeba7;',
            'hilite-tip': '&#xeba8;',
            'columns-12': '&#xeaf4;',
            'columns-28': '&#xeaf5;',
            'columns-45': '&#xeaf6;',
            'columns-80': '&#xeaf7;',
            'circle-plus': '&#xeaec;',
            'list-view': '&#xeaed;',
            'accounts': '&#xeaef;',
            'role': '&#xeaeb;',
            'integration': '&#xeae9;',
            'offline': '&#xeae6;',
            'move-to-target': '&#xeae1;',
            'pending': '&#xeadf;',
            'template': '&#xeae0;',
            'fex-procedure': '&#xeade;',
            'focexec-procedure': '&#xeade;',
            'script-procedure': '&#xeade;',
            'work-flow': '&#xeada;',
            'variable': '&#xeadb;',
            'hour-glass': '&#xeadc;',
            'etl-parallel-job': '&#xeadd;',
            'drag-drop': '&#xead4;',
            'follow': '&#xead5;',
            'followed': '&#xead6;',
            'paw': '&#xead7;',
            'triple-cube-frame': '&#xead9;',
            'spaces': '&#xead9;',
            'thumb-up': '&#xeace;',
            'thumb-down': '&#xeacf;',
            'thumb-up-outline': '&#xead1;',
            'thumb-down-outline': '&#xead0;',
            'flame': '&#xead2;',
            'add-overlay': '&#xeaab;',
            'grab': '&#xeaac;',
            'gavel': '&#xeaad;',
            'level-down': '&#xeaae;',
            'level-up': '&#xeaaf;',
            'circle-o-notch': '&#xeab0;',
            'power-off': '&#xeab1;',
            'connection-data-wizard': '&#xeab2;',
            'etl-copy-wizard': '&#xeab2;',
            'paperclip': '&#xeab3;',
            'neutral': '&#xeab4;',
            'smile': '&#xeab5;',
            'sad': '&#xeab6;',
            'sign-in': '&#xeab7;',
            'sign-out': '&#xeab8;',
            'toggle-off': '&#xeab9;',
            'toggle-on': '&#xeaba;',
            'align-control-top-left': '&#xea9e;',
            'align-control-top-center': '&#xea9f;',
            'align-control-top-right': '&#xeaa0;',
            'align-control-middle-left': '&#xeaa1;',
            'align-control-middle-right': '&#xeaa3;',
            'align-control-bottom-left': '&#xeaa4;',
            'align-control-bottom-center': '&#xeaa5;',
            'align-control-bottom-right': '&#xeaa6;',
            'double-quotes': '&#xea9c;',
            'single-quotes': '&#xea9d;',
            'type-chart': '&#xea98;',
            'fex-chart': '&#xea98;',
            'new-chart': '&#xea98;',
            'type-data': '&#xea99;',
            'type-page': '&#xea9a;',
            'type-report': '&#xea9b;',
            'paint-brush': '&#xea91;',
            'dashboard': '&#xe91c;',
            'computer-tablet': '&#xea45;',
            'browser-session': '&#xea79;',
            'explorer': '&#xe907;',
            'windows-command-line-session': '&#xeabb;',
            'inspect-1': '&#xe903;',
            'profile-data-2': '&#xe903;',
            'jump-menu': '&#xe90f;',
            'search': '&#xe900;',
            'search-file': '&#xe900;',
            'wc-dt-search': '&#xe900;',
            'inspect-2': '&#xea89;',
            'profile-data': '&#xea89;',
            'bulb': '&#xe901;',
            'bulb-lit-up': '&#xe901;',
            'url': '&#xe902;',
            'tag': '&#xe904;',
            'group': '&#xe905;',
            'fields': '&#xe906;',
            'pyramid': '&#xe908;',
            'funnel': '&#xe90a;',
            'wallet-outline': '&#xe909;',
            'check': '&#xe90b;',
            'reporting-object': '&#xe90c;',
            'scale': '&#xe90d;',
            'access-list': '&#xeacc;',
            'permissions': '&#xeacc;',
            'preset': '&#xe90e;',
            'data-access': '&#xe90e;',
            'security-shield-checked': '&#xeb04;',
            'un-scure': '&#xea8a;',
            'security': '&#xe910;',
            'security-shield-plain': '&#xe910;',
            'remove': '&#xe911;',
            'asterisk': '&#xe912;',
            'what-if': '&#xe913;',
            'calculator': '&#xe913;',
            'disabled': '&#xe914;',
            'block': '&#xe914;',
            'layout': '&#xe915;',
            'need-value': '&#xe916;',
            'rotate': '&#xe917;',
            'swap': '&#xe917;',
            'side-by-side': '&#xe918;',
            'percent': '&#xe919;',
            'stacked': '&#xe91a;',
            'absolute': '&#xe91b;',
            'new-visualization': '&#xe91d;',
            'portal': '&#xe91e;',
            'new-portal': '&#xe91e;',
            'bell': '&#xe91f;',
            'announcement': '&#xe920;',
            'clock': '&#xe921;',
            'schedule': '&#xe922;',
            'insight': '&#xe923;',
            'cursor-default': '&#xe924;',
            'cursor': '&#xe925;',
            'shape-circle': '&#xe926;',
            'measure-disc': '&#xe926;',
            'measure-disc1': '&#xe926;',
            'measure-disc2': '&#xe926;',
            'single-cube-frame': '&#xe927;',
            'shape-square': '&#xe928;',
            'shape-molecule': '&#xe929;',
            'shape-fill': '&#xe92a;',
            'star-half': '&#xeaee;',
            'star-empty': '&#xe92b;',
            'favorite': '&#xe92c;',
            'processes': '&#xeaf3;',
            'hierarchy': '&#xe92f;',
            'ibi-mfd': '&#xe92f;',
            'parent-children-hierarchy': '&#xe92f;',
            'tree': '&#xe930;',
            'wc-dt-tree': '&#xe930;',
            'outline': '&#xe930;',
            'outline-selection': '&#xeacd;',
            'diagnostic-stethoscope': '&#xe933;',
            'test-pass': '&#xe931;',
            'wc-connector-verify': '&#xe931;',
            'test-ok': '&#xe931;',
            'test': '&#xe931;',
            'test-fail': '&#xe932;',
            'test-bulk': '&#xe934;',
            'wc-dt-bulk-load-verify': '&#xe934;',
            'wc-connector-bulk-load-verify': '&#xe934;',
            'wc-dt-case-sensitivity-verify': '&#xe935;',
            'wc-connector-case-sensitivity-verify': '&#xe935;',
            'fex-data-extract': '&#xe936;',
            'fex': '&#xea92;',
            'fex-alert': '&#xea93;',
            'fex-document': '&#xe937;',
            'report-line-chart': '&#xe937;',
            'aggregate': '&#xe938;',
            'report': '&#xe939;',
            'fex-visualization': '&#xe93a;',
            'shortcut': '&#xe93b;',
            'file': '&#xe93c;',
            'file-text': '&#xeabc;',
            'close': '&#xe93d;',
            'export-image': '&#xe93e;',
            'open': '&#xe93f;',
            'restore': '&#xe940;',
            'pop-out': '&#xe941;',
            'reply': '&#xeaf1;',
            'annotate': '&#xe942;',
            'blog': '&#xe943;',
            'thought-bubble': '&#xe943;',
            'recent': '&#xe944;',
            'date': '&#xe945;',
            'calendar': '&#xe945;',
            'calendar-range': '&#xea94;',
            'ungroup': '&#xe947;',
            'ungroup-all': '&#xe946;',
            'folder': '&#xe949;',
            'folder-closed-solid': '&#xe949;',
            'folder-open-solid': '&#xe94a;',
            'folders-closed-solid': '&#xe948;',
            'email-list': '&#xe94b;',
            'email': '&#xe94c;',
            'share': '&#xe94d;',
            'lock': '&#xe94e;',
            'key': '&#xe94f;',
            'generic-key': '&#xe94f;',
            'unlock': '&#xe950;',
            'measure-disc1-hollow': '&#xe92e;',
            'measure-disc2-hollow': '&#xe92e;',
            'radio': '&#xe92d;',
            'checkbox': '&#xe951;',
            'checkbox-checked': '&#xe951;',
            'dimension-square-hollow-shadowed': '&#xe952;',
            'checkbox-unchecked': '&#xe953;',
            'maximize': '&#xe953;',
            'view-presentation': '&#xe953;',
            'panel-no-header': '&#xe953;',
            'merge-group': '&#xe953;',
            'dimension-square-hollow': '&#xe953;',
            'add-all': '&#xe954;',
            'arrow-top-down': '&#xe955;',
            'upload': '&#xe956;',
            'arrow-bottom-up': '&#xe956;',
            'arrow-bottom-up-bold': '&#xe956;',
            'table-3x3-outline': '&#xeabd;',
            'chart-matrix-marker': '&#xeabe;',
            'pie-chart': '&#xe959;',
            'chart-area': '&#xe958;',
            'chart-treemap': '&#xe95a;',
            'bar-chart': '&#xe95b;',
            'bar-chart-small': '&#xe95b;',
            'line-chart': '&#xe95c;',
            'scatter-chart': '&#xe95d;',
            'graph-scatter-diagram': '&#xe95d;',
            'log-scale': '&#xe95e;',
            'boxplot': '&#xe95f;',
            'chart-other': '&#xe960;',
            'chart-ring': '&#xe961;',
            'ga': '&#xe962;',
            'procedure-test-query': '&#xe963;',
            'logo-version-control': '&#xe964;',
            'twitter-square': '&#xeabf;',
            'facebook': '&#xeac0;',
            'ib-full-logo': '&#xe965;',
            'python-1': '&#xe966;',
            'python-2': '&#xe966;',
            'ib-social-media-webicon': '&#xe967;',
            'logo-infoassist': '&#xe968;',
            'r-2': '&#xe969;',
            'r-1': '&#xe969;',
            'Abc': '&#xe96a;',
            'dimension-abc': '&#xe96a;',
            'dimension': '&#xe96a;',
            'number': '&#xe96c;',
            'dimension-numeric': '&#xe96c;',
            'arrows-v': '&#xe96b;',
            'summary': '&#xe96d;',
            'detail': '&#xe96d;',
            'bulleted-summary': '&#xe96e;',
            'small-multiples': '&#xe96f;',
            'content-box': '&#xe970;',
            'content-add': '&#xe971;',
            'content-remove': '&#xe972;',
            'draggable': '&#xe973;',
            'switch': '&#xe974;',
            'user': '&#xe976;',
            'group-users': '&#xe977;',
            'xg-boost': '&#xe978;',
            'polynomial': '&#xe979;',
            'random-forest': '&#xe97a;',
            'k-nearest': '&#xe97b;',
            'predictive': '&#xe97c;',
            'enabled': '&#xe97d;',
            'status-warn': '&#xe97e;',
            'status-running': '&#xe97f;',
            'status-queued': '&#xe980;',
            'status-alert': '&#xe981;',
            'join': '&#xe982;',
            'difference': '&#xe983;',
            'subtract': '&#xe984;',
            'intersect': '&#xe985;',
            'verb-sum': '&#xe986;',
            'add-verb': '&#xeac1;',
            'equal': '&#xe987;',
            'average': '&#xe988;',
            'divide': '&#xe989;',
            'hash': '&#xe98b;',
            'plus': '&#xe98c;',
            'new': '&#xe98c;',
            'plus-thin': '&#xe98c;',
            'new-app': '&#xe98c;',
            'folder-plus-solid': '&#xe98c;',
            'new-item': '&#xe98c;',
            'plus-small': '&#xe98c;',
            'or': '&#xea8d;',
            'not-equal-too': '&#xea8e;',
            'and': '&#xea8f;',
            'tilde': '&#xea90;',
            'less-than': '&#xe98f;',
            'greater-than': '&#xe98a;',
            'lesser-or-equal': '&#xe990;',
            'greater-or-equal': '&#xe98d;',
            'count': '&#xe992;',
            'minus': '&#xe993;',
            'minus-small': '&#xe993;',
            'folder-minus-solid': '&#xe993;',
            'times-small': '&#xe994;',
            'adjust-function': '&#xe991;',
            'mathsymbol-function-x': '&#xe991;',
            'fx-program': '&#xe98e;',
            'ellipsis-h-sm': '&#xe995;',
            'setting': '&#xe996;',
            'ellipsis-v-sm': '&#xe996;',
            'wc-dt-setting': '&#xe996;',
            'bars': '&#xe997;',
            'button-group': '&#xe998;',
            'double-listbox': '&#xe999;',
            'heading': '&#xe99a;',
            'prompt': '&#xe99b;',
            'listbox': '&#xe99c;',
            'menu-item-drilldown': '&#xe99c;',
            'single-slider': '&#xe99d;',
            'button': '&#xe99e;',
            'submit': '&#xea95;',
            'label': '&#xe99f;',
            'text-input': '&#xe9a0;',
            'text-area': '&#xe9a1;',
            'dropdown': '&#xe9a2;',
            'slider-range': '&#xe9a3;',
            'hilite': '&#xe9a5;',
            'copy': '&#xe9a7;',
            'clone': '&#xe9a7;',
            'paste': '&#xe9a9;',
            'edit': '&#xe9aa;',
            'edit-object': '&#xe9aa;',
            'folder-closed-delete-solid': '&#xe9ab;',
            'reset': '&#xea96;',
            'reset-thin': '&#xea96;',
            'print': '&#xeaa7;',
            'redo': '&#xe9a8;',
            'undo': '&#xe9ac;',
            'cut': '&#xe9ad;',
            'in-place': '&#xe9ae;',
            'align-control-bottom': '&#xe9af;',
            'align-control-right': '&#xe9b0;',
            'align-middle': '&#xe9b1;',
            'align-control-center': '&#xe9b2;',
            'align-control-top': '&#xe9b3;',
            'align-control-left': '&#xe9b4;',
            'map-polygon': '&#xe9b5;',
            'map-polygon-2': '&#xeac2;',
            'map-point-density-2': '&#xe9b6;',
            'choropleth': '&#xe9b7;',
            'map': '&#xe9b8;',
            'pinned': '&#xeaf0;',
            'pin': '&#xe9b9;',
            'thermometer': '&#xead3;',
            'map-point-density-1': '&#xe9ba;',
            'map-point-marker': '&#xe9bb;',
            'geomarker': '&#xe9bb;',
            'geo': '&#xe9be;',
            'dimension-geolocation': '&#xe9be;',
            'route': '&#xe9bf;',
            'map-multi-layer': '&#xeac9;',
            'layers': '&#xeaca;',
            'map-line': '&#xe9bc;',
            'map-point-bubble': '&#xe9bd;',
            'selection-square': '&#xeac3;',
            'outline-slider': '&#xeaf2;',
            'selection-square-pan': '&#xeac4;',
            'outline-basic': '&#xeac5;',
            'outline-tab': '&#xeac6;',
            'outline-accordion': '&#xeac7;',
            'outline-section': '&#xe9c0;',
            'selection-content': '&#xe9c1;',
            'selection-control': '&#xe9c2;',
            'outline-panel-group': '&#xe9c3;',
            'connected': '&#xe9c4;',
            'broken': '&#xe9c5;',
            'empty-box': '&#xe9c6;',
            'split-y': '&#xe9c7;',
            'size': '&#xe9c8;',
            'animate': '&#xe9c9;',
            'axis-grid': '&#xe9ca;',
            'outline-filter-grid': '&#xe9ca;',
            'axis-1': '&#xe9cb;',
            'axis-2': '&#xe9cc;',
            'bucket': '&#xe9cd;',
            'y-axis': '&#xe9cf;',
            'y2-axis': '&#xe9cf;',
            'right-left': '&#xeae8;',
            'x-axis': '&#xe9ce;',
            'x2-axis': '&#xe9ce;',
            'bottom-top': '&#xeae7;',
            'measure': '&#xe9d0;',
            'measure-ruler-single': '&#xe9d0;',
            'color': '&#xe9d1;',
            'pane_properties': '&#xe9d2;',
            'pane_buckets': '&#xe9d3;',
            'panel': '&#xe9d4;',
            'pane_resources': '&#xe9d5;',
            'pivot': '&#xe9d6;',
            'columns': '&#xe9d7;',
            'matrix-columns': '&#xe9d7;',
            'column-group': '&#xe9d7;',
            'cell-merge': '&#xe9d8;',
            'cell-split': '&#xe9d9;',
            'rows': '&#xe9da;',
            'matrix-rows': '&#xe9da;',
            'transpose': '&#xe9db;',
            'gauge-label': '&#xe9dc;',
            'gauge-needle': '&#xe9dd;',
            'gauge-simple': '&#xe9de;',
            'what-if-icon': '&#xe9df;',
            'library': '&#xe9e0;',
            'set-of-books': '&#xe9e0;',
            'workbook': '&#xe9e1;',
            'book-open': '&#xe9e2;',
            'pages': '&#xe9e5;',
            'bookmark': '&#xe9e4;',
            'address-book': '&#xe9e3;',
            'tiles': '&#xe9e6;',
            'list': '&#xe9e7;',
            'show': '&#xe9e8;',
            'hide': '&#xe9eb;',
            'view-new-window': '&#xe9e9;',
            'preview': '&#xe9e9;',
            'refresh': '&#xe9ea;',
            'wc-dt-mdf-flatten-view': '&#xe9ec;',
            'filetype-unassigned': '&#xea16;',
            'ahtml': '&#xeaf9;',
            'file-html': '&#xeafa;',
            'filetype-html': '&#xeafa;',
            'filetype-r': '&#xea07;',
            'file-unknown': '&#xea1a;',
            'filetype-unknown': '&#xea1a;',
            'file-visdis': '&#xea0f;',
            'file-image': '&#xea03;',
            'file-json': '&#xe9fb;',
            'filetype-json': '&#xe9fb;',
            'html5': '&#xea19;',
            'filetype-html5': '&#xea19;',
            'filetype-txt': '&#xe9ed;',
            'filetype-java': '&#xe9f5;',
            'file-filter2': '&#xea18;',
            'data-rec': '&#xe9ee;',
            'file-sty': '&#xea0a;',
            'master': '&#xe9f6;',
            'ibi-master': '&#xe9f6;',
            'deferred-ticket': '&#xeaa8;',
            'deferred-output': '&#xe9f8;',
            'file-excel': '&#xea1b;',
            'filetype-excel-icon': '&#xea1b;',
            'filetype-excel': '&#xea1b;',
            'filetype-xlsx': '&#xea1b;',
            'file-powerpoint': '&#xe9f4;',
            'filetype-ppt': '&#xe9f4;',
            'file-word': '&#xea05;',
            'file-ely': '&#xe9ef;',
            'file-xml': '&#xe9f0;',
            'filetype-xml': '&#xe9f0;',
            'file-js': '&#xe9f1;',
            'filetype-js': '&#xe9f1;',
            'filetype-shx': '&#xe9f2;',
            'filetype-mas': '&#xe9f3;',
            'filetype-sql': '&#xe9f7;',
            'filetype-tar': '&#xe9f9;',
            'file-zip': '&#xe9fa;',
            'filetype-zip': '&#xe9fa;',
            'filetype-dbf': '&#xe9fc;',
            'filetype-foc': '&#xe9fd;',
            'filetype-ftm': '&#xe9fe;',
            'filetype-jpeg': '&#xea17;',
            'filetype-jpg': '&#xea17;',
            'filetype-png': '&#xea1d;',
            'filetype-psd': '&#xe9ff;',
            'filetype-gif': '&#xea00;',
            'filetype-bmp': '&#xea08;',
            'filetype-tsv': '&#xea01;',
            'filetype-bak': '&#xea02;',
            'filetype-csv-plus': '&#xea04;',
            'filetype-csv': '&#xea04;',
            'filetype-sty': '&#xea06;',
            'filetype-rdata': '&#xea09;',
            'filetype-dat': '&#xea0b;',
            'filetype-svg': '&#xea0c;',
            'file-css': '&#xea0d;',
            'filetype-css': '&#xea0d;',
            'filetype-xsd': '&#xea0e;',
            'filetype-prj': '&#xea10;',
            'file-pdf': '&#xea11;',
            'filetype-pdf': '&#xea11;',
            'filetype-log': '&#xea12;',
            'filetype-hti': '&#xea13;',
            'filetype-tro': '&#xea14;',
            'filetype-acx': '&#xea15;',
            'filetype-shp': '&#xea1c;',
            'align-right': '&#xea1e;',
            'justified': '&#xea1f;',
            'align-center': '&#xea20;',
            'align-left': '&#xea21;',
            'grid-4x2x1': '&#xea22;',
            'grid-2x1-side': '&#xea23;',
            'blank': '&#xea24;',
            'page': '&#xea25;',
            'new-page': '&#xea25;',
            'grid-2x1': '&#xea26;',
            'info-app': '&#xea27;',
            'grid-three-column': '&#xea28;',
            'grid-3x3x3': '&#xea28;',
            'selection-polygon': '&#xea29;',
            'selection-clear': '&#xea2a;',
            'selection-polyline': '&#xea2b;',
            'selection': '&#xea2c;',
            'pan-selection': '&#xeae3;',
            'selection-square1': '&#xeae4;',
            'selection-freeform': '&#xeae5;',
            'selection-circle': '&#xea2d;',
            'grid-4x4': '&#xea2e;',
            'panel-tab': '&#xea2f;',
            'link-tile': '&#xea30;',
            'panel-slideout': '&#xea31;',
            'panel-in-panel': '&#xea32;',
            'panel-accordion': '&#xea33;',
            'accordion-filter': '&#xeaa9;',
            'container': '&#xea34;',
            'panel-slider': '&#xea35;',
            'header': '&#xea37;',
            'footer': '&#xea36;',
            'label-underline': '&#xea38;',
            'label-bold': '&#xea3b;',
            'bold': '&#xea3b;',
            'label-italic': '&#xea3d;',
            'increase-indentation': '&#xea8b;',
            'uppercase': '&#xe975;',
            'touppercase': '&#xe975;',
            'decrease-indentation': '&#xea8c;',
            'lowercase': '&#xea3c;',
            'tolowercase': '&#xea3c;',
            'case-sensitive': '&#xea39;',
            'filter': '&#xea40;',
            'quick-filter': '&#xea40;',
            'file-filter': '&#xea40;',
            'compound': '&#xea3e;',
            'medium-padding-margin': '&#xea41;',
            'small-padding-margin': '&#xea42;',
            'large-padding-margin': '&#xea43;',
            'save': '&#xea46;',
            'floppy': '&#xea46;',
            'disk-file-save': '&#xea46;',
            'disk-file-save-as': '&#xea3a;',
            'disk-file-save-all': '&#xea44;',
            'target-data-source': '&#xea47;',
            'metadata': '&#xea48;',
            'new-database': '&#xea49;',
            'wc-dt-database': '&#xea49;',
            'database': '&#xea49;',
            'server': '&#xea4a;',
            'flow': '&#xea4b;',
            'query': '&#xea4c;',
            'drop-target': '&#xea4d;',
            'trace': '&#xea4e;',
            'disable-trace': '&#xea4e;',
            'stop-octagon-outline': '&#xeb31;',
            'stop-octagon-solid': '&#xea4f;',
            'signal-bars-1': '&#xea50;',
            'signal-bars-2': '&#xea51;',
            'signal-bars-3': '&#xea51;',
            'signal-bars-4': '&#xea51;',
            'signal-bars-5': '&#xea52;',
            'info': '&#xea53;',
            'question': '&#xea54;',
            'help-question-mark': '&#xea54;',
            'home': '&#xea55;',
            'office': '&#xea56;',
            'tools': '&#xea57;',
            'all-settings': '&#xea58;',
            'maintenance': '&#xea59;',
            'configure': '&#xea5a;',
            'properties': '&#xea5a;',
            'configuration': '&#xea5a;',
            'images': '&#xea5b;',
            'pause': '&#xea62;',
            'play': '&#xea5c;',
            'video': '&#xea60;',
            'camera': '&#xea5e;',
            'microphone': '&#xea5d;',
            'microphone-slash': '&#xeac8;',
            'controls': '&#xea5f;',
            'sliders': '&#xea5f;',
            'repeat-process': '&#xea61;',
            'sort-amount-asc': '&#xea63;',
            'sort-desc': '&#xea64;',
            'sort-alpha-asc': '&#xea3f;',
            'alpha-descending': '&#xea65;',
            'sort-alternate': '&#xeaea;',
            'move-horizontal': '&#xea66;',
            'move-vertical': '&#xea67;',
            'selection-pan': '&#xea68;',
            'chevron-down': '&#xea6a;',
            'chevron-up': '&#xea6b;',
            'chevron-left': '&#xea6e;',
            'chevron-right': '&#xea6c;',
            'chevron-first': '&#xea6d;',
            'goto-end': '&#xea69;',
            'arrow_downward': '&#xea6f;',
            'arrow_upward': '&#xea70;',
            'sort-asc': '&#xea70;',
            'arrow-right': '&#xea71;',
            'arrow_forward': '&#xea71;',
            'arrow-left': '&#xea72;',
            'arrow_back': '&#xea72;',
            'arrow-circle-left': '&#xea72;',
            'goto-bottom': '&#xeb22;',
            'goto-top': '&#xeb23;',
            'goto_end': '&#xeb24;',
            'goto_start': '&#xeb25;',
            'caret-down': '&#xea73;',
            'goto-next-down': '&#xea73;',
            'caret-up': '&#xea74;',
            'goto-next-up': '&#xea74;',
            'caret-left': '&#xea76;',
            'goto-previous-left': '&#xea76;',
            'caret-right': '&#xea75;',
            'expand': '&#xea77;',
            'compress': '&#xea78;',
            'autofit': '&#xea97;',
            'label-right': '&#xea7a;',
            'label-none': '&#xea7b;',
            'label-top': '&#xea7c;',
            'label-left': '&#xea7d;',
            'new-table': '&#xeaaa;',
            'insert-before': '&#xea7e;',
            'insert-after': '&#xea7f;',
            'insert-right': '&#xea80;',
            'insert-left': '&#xea81;',
            'filterbar-off': '&#xea82;',
            'filterbar-on': '&#xea83;',
            'join-inner': '&#xea84;',
            'data-join-innerjoin2': '&#xea84;',
            'data-join-crossjoin': '&#xeacb;',
            'join-full-outer': '&#xea85;',
            'data-join-fulljoin2': '&#xea85;',
            'union': '&#xea85;',
            'join-right-outer': '&#xea86;',
            'data-join-rightjoin2': '&#xea86;',
            'join-none': '&#xea87;',
            'join-left-outer': '&#xea88;',
            'data-join-leftjoin2': '&#xea88;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/ds-icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
