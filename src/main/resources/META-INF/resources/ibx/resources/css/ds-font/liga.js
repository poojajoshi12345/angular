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
            'analytic-functions': '&#xeaf8;',
            'fex-procedure': '&#xeade;',
            'focexec-procedure': '&#xeade;',
            'script-procedure': '&#xeade;',
            'variable': '&#xeadb;',
            'etl-parallel-job': '&#xeadd;',
            'triple-cube-frame': '&#xead9;',
            'connection-data-wizard': '&#xeab2;',
            'etl-copy-wizard': '&#xeab2;',
            'computer-tablet': '&#xea45;',
            'browser-session': '&#xea79;',
            'windows-command-line-session': '&#xeabb;',
            'search-file': '&#xe900;',
            'wc-dt-search': '&#xe900;',
            'bulb-lit-up': '&#xe901;',
            'wallet-outline': '&#xe909;',
            'data-access': '&#xe90e;',
            'security-shield-plain': '&#xe910;',
            'disabled': '&#xe914;',
            'need-value': '&#xe916;',
            'measure-disc': '&#xe926;',
            'measure-disc1': '&#xe926;',
            'measure-disc2': '&#xe926;',
            'single-cube-frame': '&#xe927;',
            'ibi-mfd': '&#xe92f;',
            'parent-children-hierarchy': '&#xe92f;',
            'wc-dt-tree': '&#xe930;',
            'diagnostic-stethoscope': '&#xe933;',
            'wc-connector-verify': '&#xe931;',
            'test-ok': '&#xe931;',
            'test-fail': '&#xe932;',
            'wc-dt-bulk-load-verify': '&#xe934;',
            'wc-connector-bulk-load-verify': '&#xe934;',
            'wc-dt-case-sensitivity-verify': '&#xe935;',
            'wc-connector-case-sensitivity-verify': '&#xe935;',
            'report-line-chart': '&#xe937;',
            'thought-bubble': '&#xe943;',
            'folder-closed-solid': '&#xe949;',
            'folder-open-solid': '&#xe94a;',
            'folders-closed-solid': '&#xe948;',
            'generic-key': '&#xe94f;',
            'measure-disc1-hollow': '&#xe92e;',
            'measure-disc2-hollow': '&#xe92e;',
            'dimension-square-hollow-shadowed': '&#xe952;',
            'dimension-square-hollow': '&#xe953;',
            'add-all': '&#xe954;',
            'arrow-top-down': '&#xe955;',
            'arrow-bottom-up': '&#xe956;',
            'table-3x3-outline': '&#xeabd;',
            'graph-scatter-diagram': '&#xe95d;',
            'boxplot': '&#xe95f;',
            'procedure-test-query': '&#xe963;',
            'ib-full-logo': '&#xe965;',
            'ib-social-media-webicon': '&#xe967;',
            'dimension-abc': '&#xe96a;',
            'dimension-numeric': '&#xe96c;',
            'folder-plus-solid': '&#xe98c;',
            'new-item': '&#xe98c;',
            'lesser-or-equal': '&#xe990;',
            'greater-or-equal': '&#xe98d;',
            'folder-minus-solid': '&#xe993;',
            'adjust-function': '&#xe991;',
            'mathsymbol-function-x': '&#xe991;',
            'wc-dt-setting': '&#xe996;',
            'menu-item-drilldown': '&#xe99c;',
            'edit-object': '&#xe9aa;',
            'folder-closed-delete-solid': '&#xe9ab;',
            'geomarker': '&#xe9bb;',
            'dimension-geolocation': '&#xe9be;',
            'layers': '&#xeaca;',
            'measure-ruler-single': '&#xe9d0;',
            'column-group': '&#xe9d7;',
            'set-of-books': '&#xe9e0;',
            'wc-dt-mdf-flatten-view': '&#xe9ec;',
            'filetype-unassigned': '&#xea16;',
            'filetype-html': '&#xeafa;',
            'filetype-r': '&#xea07;',
            'filetype-unknown': '&#xea1a;',
            'filetype-json': '&#xe9fb;',
            'filetype-html5': '&#xea19;',
            'filetype-txt': '&#xe9ed;',
            'filetype-java': '&#xe9f5;',
            'file-filter2': '&#xea18;',
            'ibi-master': '&#xe9f6;',
            'filetype-excel-icon': '&#xea1b;',
            'filetype-excel': '&#xea1b;',
            'filetype-xlsx': '&#xea1b;',
            'filetype-ppt': '&#xe9f4;',
            'filetype-xml': '&#xe9f0;',
            'filetype-js': '&#xe9f1;',
            'filetype-shx': '&#xe9f2;',
            'filetype-mas': '&#xe9f3;',
            'filetype-sql': '&#xe9f7;',
            'filetype-tar': '&#xe9f9;',
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
            'filetype-css': '&#xea0d;',
            'filetype-xsd': '&#xea0e;',
            'filetype-prj': '&#xea10;',
            'filetype-pdf': '&#xea11;',
            'filetype-log': '&#xea12;',
            'filetype-hti': '&#xea13;',
            'filetype-tro': '&#xea14;',
            'filetype-acx': '&#xea15;',
            'filetype-shp': '&#xea1c;',
            'uppercase': '&#xe975;',
            'touppercase': '&#xe975;',
            'lowercase': '&#xea3c;',
            'tolowercase': '&#xea3c;',
            'file-filter': '&#xea40;',
            'disk-file-save': '&#xea46;',
            'disk-file-save-as': '&#xea3a;',
            'disk-file-save-all': '&#xea44;',
            'target-data-source': '&#xea47;',
            'wc-dt-database': '&#xea49;',
            'disable-trace': '&#xea4e;',
            'stop-octagon-solid': '&#xea4f;',
            'signal-bars-1': '&#xea50;',
            'signal-bars-2': '&#xea51;',
            'signal-bars-3': '&#xea51;',
            'signal-bars-4': '&#xea51;',
            'signal-bars-5': '&#xea52;',
            'help-question-mark': '&#xea54;',
            'maintenance': '&#xea59;',
            'configuration': '&#xea5a;',
            'repeat-process': '&#xea61;',
            'goto-next-down': '&#xea6a;',
            'goto-next-up': '&#xea6b;',
            'goto-previous-left': '&#xea6e;',
            'goto-next-right': '&#xea6c;',
            'goto-start': '&#xea6d;',
            'goto-end': '&#xea69;',
            'data-join-innerjoin2': '&#xea84;',
            'data-join-crossjoin': '&#xeacb;',
            'data-join-fulljoin2': '&#xea85;',
            'union': '&#xea85;',
            'data-join-rightjoin2': '&#xea86;',
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
