{if empty($message)}
    <div class="content-body floorPlan">
        <div class="card header-card mb-1">
            <div class="row p-1">
                <div class="col-6 d-flex flex-row align-items-center">
                    <div class="mr-1">
                        <label for="selectRoom" class="mb-0">{t}Room{/t}:</label>
                    </div>
                    <div class="mr-1 w-100">
                        <select id="selectRoom" class="form-control">
                            <option value="" selected disabled hidden>Select Room</option>
                        </select>
                    </div>
                </div>
                <div class="col-6">
                    <button class="btn round btn-outline-info pull-right" type="button" id="save" hidden>
                        <i class="fa fa-check imgHorizontalMargin"></i>{t}Save{/t}
                    </button>
                </div>
            </div>
        </div>

        <div class="d-flex flex-row align-items-top">
            <div class="main-menu menu-static menu-static-vertical menu-light menu-accordion card mr-1" data-scroll-to-active="true">
                <div class="main-menu-content">
                    <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                        <li class="nav-item has-sub">
                            <a href="#">
                                <i class="fa fa-map-pin"></i>
                                <span class="menu-title">{t}Slots{/t}</span>
                            </a>
                            <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Slots on the plan{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableSlotsOnPlan" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="source.Number">#</th>
                                                    <th data-field="source.SMIB" data-formatter="window.slotSMIBFormatter">SMIB</th>
                                                    <th data-field="source.Name">GM</th>
                                                    <th data-field="Delete" data-formatter="window.deleteFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>

                                </li>
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Free slots{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableFreeSlots" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="Number">#</th>
                                                    <th data-field="SMIB">SMIB</th>
                                                    <th data-field="Name">GM</th>
                                                    <th data-field="Add" data-formatter="window.addFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-sub">
                            <a href="#">
                                <i class="fa fa-empire"></i>
                                <span class="menu-title">{t}Roulettes{/t}</span>
                            </a>
                            <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Roulettes on the plan{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableRoulettesOnPlan" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="source.Number">#</th>
                                                    <th data-field="source.SMIB" data-formatter="window.slotSMIBFormatter">SMIB</th>
                                                    <th data-field="source.Name">GM</th>
                                                    <th data-field="Delete" data-formatter="window.deleteFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>

                                </li>
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Free Roulettes{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableFreeRoulettes" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="Number">#</th>
                                                    <th data-field="SMIB">SMIB</th>
                                                    <th data-field="Name">GM</th>
                                                    <th data-field="Add" data-formatter="window.addFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-sub">
                            <a href="#">
                                <i class="fa fa-money"></i>
                                <span class="menu-title">{t}Cashdesks{/t}</span>
                            </a>
                            <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Cashdesks on the plan{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableCashdesksOnPlan" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="source.Number">#</th>
                                                    <th data-field="source.EntityID" data-formatter="window.cashdeskIDFormatter">ID</th>
                                                    <th data-field="source.Name">Name</th>
                                                    <th data-field="Delete" data-formatter="window.deleteFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>

                                </li>
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Free Cashdesks{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableFreeCashdesks" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="Number">#</th>
                                                    <th data-field="EntityID">ID</th>
                                                    <th data-field="Name">Name</th>
                                                    <th data-field="Add" data-formatter="window.addFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-sub">
                            <a href="#">
                                <i class="fa fa-play"></i>
                                <span class="menu-title">{t}Video servers{/t}</span>
                            </a>
                            <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Video servers on the plan{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableVideoServersOnPlan" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="source.Number">#</th>
                                                    <th data-field="source.EntityID" data-formatter="window.videoserverIDFormatter">ID</th>
                                                    <th data-field="source.Name">Name</th>
                                                    <th data-field="Delete" data-formatter="window.deleteFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>

                                </li>
                                <li class="nav-item has-sub">
                                    <a href="#">
                                        <span class="menu-title">{t}Free Video servers{/t}</span>
                                    </a>

                                    <ul class="menu-content">
                                        <li>
                                            <table id="tableFreeVideoServers" class="tableObjects">
                                                <thead>
                                                <tr>
                                                    <th data-field="Number">#</th>
                                                    <th data-field="EntityID">ID</th>
                                                    <th data-field="Name">Name</th>
                                                    <th data-field="Add" data-formatter="window.addFormatter"></th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="stage" class="w-100"></div>
        </div>
    </div>

    <script src="<%= htmlWebpackPlugin.files.chunks.floor_plan.entry %>"></script>
{else}
    {include file='admin/partials/cashdesk/message.tpl'}
{/if}
{append tpl_js_files '/public/static/js/vendors/bootstrap-table/bootstrap-table.min.js' scope="global"}