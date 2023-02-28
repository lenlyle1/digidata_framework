{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > Role Permissions - {$role->role_name}
{/block}

{block name="search-bar"}{/block}

{block name="content"}

    <form action="/admin/role-permissions" method="post" id="role-permissions">
        <input type="hidden" name="role_id" value="{$role->role_id}" />
    {foreach $permissions as $id => $permission}
        <div class="row half" style="border-bottom: 1px solid #ccc;">
            <div class="col-md-6" >
                {$permission->permission_desc}
            </div>

            <div class="col-md-6">
                <input type="checkbox" name="permissions[{$permission->permission_id}]"
                {if isset($rolePermissions[$permission->permission_id])}checked="checked"{/if} />
            </div>
        </div>
    {/foreach}
    </form>

    <div class="partial half center">
        <button id="save" class="btn btn-primary">Update Permissions</button>
    </div>
{/block}

{block name="footer_scripts" append}
    <script src="/assets/scripts/admin/role-permissions.js"></script>
{/block}
