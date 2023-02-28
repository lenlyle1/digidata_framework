{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > CMS > {if $page}Edit{else}Add{/if} Page
{/block}

{block name="content"}
    <div>
        <form action="{pathFor name='admin-page-save'}" method="POST">
            <input type="hidden" name="page_id" value="{if $page->page_id}{$page->page_id}{else}null{/if}" />
            <div class="form-group">
                <input class="form-control" type="text" name="title" placeholder="Page title" value="{$page->title}" />
            </div>
            <div class="form-group">
                <input class="form-control" type="text" name="url_name" placeholder="Page URL" value="{$page->url_name}" />
            </div>
            <div class="form-group">
                <textarea name="content" id="pageBody">{$page->content}</textarea>
            </div>
            <br>
            <button type="submit">Submit</button>
        </form>
   
    </div>

    <script>
        $(document).ready(function() {
            CKEDITOR.replace( 'pageBody' );
        });
    </script>
{/block}
