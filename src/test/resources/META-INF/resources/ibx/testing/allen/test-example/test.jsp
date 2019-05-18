<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
$Revision: 1.2 $:--%>
<%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>ibx test</title>
    <meta http-equiv="X-UA-Compatible" content="IE=11">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <meta http-equiv="Expires" content="0"/>
    <meta name="google" value="notranslate">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--include this script...will boot ibx into the running state-->
    <Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
    <script type="text/javascript">
        <jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false"/>
                ibx(function ()
                {
                }, [{"src": "./resources/test_bundle.xml", "loadContext": "app"}], true);
    </script>

</head>
<body class="ibx-root">
<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
    <div class="menu" data-ibx-type="ibxHBox" data-ibxp-align="stretch" data-ibxp-justify="start">
        <div data-ibx-type="ibxMenuButton" tabindex="0">Menu 1
            <div data-ibx-type="ibxMenu">
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
            </div>
        </div>
        <div data-ibx-type="ibxMenuButton" tabindex="0">Menu 2
            <div data-ibx-type="ibxMenu">
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
            </div>
        </div>
        <div data-ibx-type="ibxMenuButton" tabindex="0">Menu 3
            <div data-ibx-type="ibxMenu">
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
                <div data-ibx-type="ibxMenuItem">Item</div>
            </div>
        </div>
    </div>

    <div class="main" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
        <div class="sidebar" data-ibx-type="ibxVBox" data-ibxp-align="stretch" role="listbox" tabindex="0"
             aria-multiselectable="true" aria-activedescendant="focused-item">
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 01
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 02
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 03
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 04
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 05
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 06
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 07
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 08
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 09
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 10
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 11
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 12
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 13
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 14
            </div>
            <div class="sidebar-item" role="option" data-ibx-type="ibxLabel" data-ibxp-justify="center"
                 aria-selected="false">Sidebar
                item 15
            </div>
        </div>


        <div class="content" data-ibx-type="ibxVBox" data-ibxp-align="stretch" role="main">
            <div class="title" data-ibx-type="ibxLabel" data-ibxp-justify="center">
                TITLE
            </div>

            <div class="search" data-ibx-type="ibxTextArea">
                <div data-ibxp-glyph-classes="material-icons" data-ibxp-glyph="search" data-ibxp-icon-position="right"
                     data-ibx-type="ibxLabel" data-ibxp-text="Search"></div>
            </div>


            <div class="tiles" data-ibx-type="ibxHBox" data-ibxp-align="start" data-ibxp-wrap="true">
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-001"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-002"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-003"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-004"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-005"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-006"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-007"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-008"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-009"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-010"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-011"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-012"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-013"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-014"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-015"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-016"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-017"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-018"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-019"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-020"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-021"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-022"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-023"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-024"></div>
                </div>
                <div class="tile" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
                    <div data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="tile-025"></div>
                </div>
            </div>


            <div id="listbox-outer" class="listbox" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-wrap="false"  tabindex="0" >
                <div data-ibx-type="ibxHBox" class="list-holders" data-ibxp-justify="center"  data-ibxp-align="start">
                    <div class="left-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch" role="listbox" aria-activedescendant="left-child-elem" ibx-focus="false">
                        <div class="listbox-middle-elem" data-ibx-type="ibxVBox" data-ibxp-align="stretch" ibx-focus="false">
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #001</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #002</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #003</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #004</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #005</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #006</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #007</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #008</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #009</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #010</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #011</div>
                            <div class="ak-list-items" role="option"   data-ibx-type="ibxLabel" aria-selected="false">Option #012</div>
                        </div>
                    </div>
                    <div class="right-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch" role="listbox" aria-activedescendant="right-child-elem">
                        <div class="listbox-middle-elem" data-ibx-type="ibxVBox" data-ibxp-align="stretch" ibx-focus="false">
                            <div class="ak-list-items" role="option" data-ibx-type="ibxLabel" aria-selected="false">Option #013</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #014</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #015</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #016</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #017</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #018</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #019</div>
                            <div class="ak-list-items" role="option"  data-ibx-type="ibxLabel" aria-selected="false">Option #020</div>
                        </div>
                    </div>
                </div>

                <div data-ibx-type="ibxVBox" class="btn-container" data-ibxp-justify="space-around">
                    <div data-ibx-type="ibxButton" data-ibxp-text="Add" class="addbtn"></div>
                    <div data-ibx-type="ibxButton" data-ibxp-text="Remove" class="removebtn"></div>
                </div>
            </div>


        </div>

    </div>

</div>
</body>
</html>
