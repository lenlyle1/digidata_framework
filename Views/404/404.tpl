{extends file='../site_base.tpl'}

{block name="content"}
    <main role="main">
        <div class="container">
            <div class="pure-g">
                <div class="pure-u-3-4">
                    <h1>That page could not be found</h1>
                </div>
                {if isset($missingTemplate)}
                    <div class="pure-u-3-4">
                        Template not found: {$missingTemplate}
                    </div>
                {/if}
            </div>
        </div>
    </main>
{/block}
