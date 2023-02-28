{extends file='./switcher.tpl'}

{block name="page_heading" append}
    > {translate language=$language key="translations" text="Translations"}
{/block}

{block name="content"}
    <div class="box">
        <table id="transTable" class="display hover">
            <thead>
                <tr>
                    <th>English</th>
                    <th>Spanish</th>
                    <!-- DataTables needs the number of header columns to match the number of body columns -->
                    <td></td>
                    <td style="display:none;"></td>
                </tr>
            </thead>
            <tbody>
                {foreach $translations['keys'] as $id => $key}
                    <tr data-key="{$key->item_key}">
                        <td colspan="3" class="trans-key" style="display: none;"><b>Item Key:</b> {$key->item_key}</td>
                        <td class="en"><div>{$translations['en'][$key->item_key]}</div></td>
                        <td class="es"><div>{$translations['es'][$key->item_key]}</div></td>
                        <td class="edit">
                            <button type="submit" data-key="{$key->item_key}" class="edit-button btn btn-primary">Edit</button>
                            <button type="submit" data-key="{$key->item_key}" class="update-button btn btn-primary" style="display: none">Update</button>
                        </td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    </div>
{/block}

{block name="footer_scripts" append}
    <script>
        var apiLangUpdateUrl = '/api/update-translation{$apiKeys}';
        var updateText = '{translate language=$language key="update" text="Update"}';
        var editText = '{translate language=$language key="edit" text="Edit"}';
    </script>
    <script src="/assets/scripts/translation.js"></script>
{/block}
