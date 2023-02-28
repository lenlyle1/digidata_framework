{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > Roles
{/block}

{block name="content"}
    {foreach $roles as $role}
        <div class="pure-u-1-4">{$role->role_name} <a href="{pathFor name='admin-role-permissions'}?rid={$role->role_id}">Edit permissions</a></div></br>
    {/foreach}
{/block}
