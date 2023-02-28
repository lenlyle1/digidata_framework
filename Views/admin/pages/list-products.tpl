{extends file='admin/admin_lte_base.tpl'}

{block name="page_heading" append}
    > Products
{/block}

{block name="content"}
    <div class="row">
        <a class="btn" href="/admin/products/edit">Add Product</a>
    </div>
    <table class="grid display hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {foreach $products as $product}
                <tr>
                    <td class="">{$product->name}</td>
                    <td>{$product->description}</td>
                    <td><a href="{pathFor name='admin-products-edit'}/{$product->product_id}">Edit</a></td> 
                </tr>
            {/foreach}
        </tbody>
    </table>
    
{/block}
