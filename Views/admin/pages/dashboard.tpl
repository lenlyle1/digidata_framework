{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > Dashboard
{/block}

{block name="content"}
    <div id="dashboard-tabs" class="ui-helper-clearfix">
        <ul>
            <li><a href="#overdue-followup-tab">Overdue Follow Ups</a></li>
            <li><a href="#followups-tab">Follow Ups</a></li>
            <li><a href="#overdue-patients">Overdue Patients</a></li>
        </ul>

        {include file='admin/pages/partials/followup-tabs.tpl'}

        <div id="overdue-patients">
            <h3>Overdue Patients</h3>
            <div class="scroll box">
            {if $overdue_patients}
                <table class="grid overdue_patients pure-table pure-table-bordered display hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last Action Plan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$overdue_patients key=key item=patient}
                        <tr class="overdue">
                            <td>{$patient->first_name} {$patient->last_name}</td>
                            <td>{$patient->action_plan_date}</td>
                        </tr>
                        {/foreach}
                    </tbody>
                </table>
                {else}
                    <div class="col-md-12">
                        No overdue patients at this time
                    </div>
                {/if}
            </div>
        </div>
    </div>

        {include file="admin/pages/partials/followup-modal.tpl"}
        {include file="admin/pages/partials/followup-modal-basic.tpl"}
{/block}

{block name="footer_scripts" append}
    <script src="/assets/scripts/admin/followups.js"></script>
{/block}
