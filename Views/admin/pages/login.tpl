{extends file='admin/admin_lte_base.tpl'}

{block name="page_title"}Login{/block}

{block name="content"}
    <main role="main">
        <div class="wrap">
            <div class="container">
                <div class="login-box">
                    <div class="login-header">
                        <p>User Login</p>
                    </div>
                    <div class="login-fields">
                        {if $errors}
                            <div class="form-error">{$errors}</div>
                        {/if}
                        <form id="login-form" style="padding:20px" method="post" action="/auth/signin">
                            <input id="username" name="username" type="text" placeholder="Username" autocapitalize="none" required>
                            <input id="password" name="password" type="password" placeholder="Password" required>
                            <a href="#" onclick="$('#login-form').submit();" class="pure-button" id="login-submit">Log In</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
{/block}
