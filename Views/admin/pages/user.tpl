{extends file='admin/admin_lte_base.tpl'}

{block name="page_title"}Users{/block}

{block name="page_heading" append}
    > User > {$user->last_name}, {$user->first_name}
{/block}

{block name="search-bar"}

{/block}

{block name="content"}

    {if $userType}
        {include file="admin/pages/partials/user_"|cat:$userType|cat:".tpl"}
    {/if}

    {** IMPORTER **}
    <div id="importer" class="well" style="display: none;">
        <div class="modal-title">
            Import Users
        </div>
        <div>
            <p>Please select file for import.</p>

            <p>Import sheet must be a tab separated CSV file.</p>

            <div id="upload-box">
                <form id="upload-form" method="post" enctype="multipart/form-data">
                    Select CSV to upload:
                    <input type="file" name="fileToUpload" id="fileToUpload">
                    <button id="upload-button" value="Upload CSV">
                </form>
            </div>
        </div>
    </div>
{/block}

{block name="footer_scripts" append}

<script src="/assets/scripts/admin/users.js"></script>

{/block}
