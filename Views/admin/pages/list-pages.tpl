{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > CMS Pages
{/block}

{block name="content"}
    <div class="row">
        <a class="btn" href="/admin/cms/edit">Add Page</a>
    </div>
    <table class="grid display hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {foreach $pages as $page}
                <tr>
                    <td class="">{$page->title}</td>
                    <!-- <td>{$page->permission_desc}</td> -->
                    <td><a href="/admin/cms/edit/{$page->url_name}">Edit</a></td>
                    <td><a href="/admin/cms/delete/{$page->url_name}">Delete</a></td>
                </tr>
            {/foreach}
        </tbody>
    </table>

{/block}
