{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > CMS > {if $page}Edit{else}Add{/if} Product {if $product} - {$product->name}{/if}
{/block}

{block name="content"}
    <div>
        <form action="{pathFor name='admin-products-save'}" method="POST">
            <input type="hidden" name="product_id" value="{if $product->product_id}{$product->product_id}{else}null{/if}" />
            <div class="form-group">
                <label for="name">Name</label>
                <input class="form-control" type="text" name="name" placeholder="Product name" value="{$product->name}" />
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea class="form-control" name="description" id="desciption">{$product->description}</textarea>
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
