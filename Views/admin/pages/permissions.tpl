{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > Permissions
{/block}

{block name="content"}
    <table class="grid display hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {foreach $permissions as $permission}
                <tr>
                    <td class="">{$permission->permission_name}</td>
                    <td>{$permission->permission_desc}</td>
                    {* <td><a href="{pathFor name='admin-edit-permission'}?pid={$permission->permission_id}">Edit</a></td> *}
                </tr>
            {/foreach}
        </tbody>
    </table>

    <hr/>
    <div>
        Add new permission
        <div>
            <form action="/admin/permissions" method="post">
                <input type="text" name="permission_name" placeholder="Name" />
                <input type="text" name="permission_desc" />
                <input type="submit" class="btn btn-primary" value="Add Permission" />
            </form>
        </div>
    </div>
{/block}
