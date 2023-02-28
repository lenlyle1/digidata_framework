<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{$sitename} Admin {block name="title"}{/block}</title>
    <meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" name="viewport">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.15/css/dataTables.bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/rowgroup/1.0.0/css/rowGroup.dataTables.min.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="/assets/plugins/AdminLTE-2.3.11/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/plugins/AdminLTE-2.3.11/css/AdminLTE.css">
    <link rel="stylesheet" href="/assets/styles/admin/admin.css">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
</head>
<body class="hold-transition skin-cth sidebar-mini">
<div class="wrapper">
    <header class="main-header">
        <a href="/" class="logo">
            <span class="logo-mini">CTH</span>
            <span class="logo-lg">{$sitename} Admin</span>
        </a>
        <nav class="navbar navbar-static-top " role="navigation" style="color: #fff; font-size: 3rem;">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" style="font-size: .5em;"></a>
            <span class="practice-name">{$user->practice_name}</span>
            <span><a href="{pathFor name="signout"}"><button class="btn btn-primary btn-sm">Signout</button></a></span>
        </nav>
    </header>
    <aside class="main-sidebar">
        <section class="sidebar">
            <div class="user-panel">
                <div class="pull-left info">
                    <p>{$user->username}</p>
                </div>
            </div>
            <ul class="sidebar-menu">
                <li class="header">Menu</li>
                <li {if $route['name'] == 'admin-dashboard'}class="active"{/if}><a href="/admin/dashboard">Dashboard</a></li>
<!-- 
                <li><a href="{pathFor name='admin-users'}">Users</a></li> -->
                {if \Lib\User\User::can('edit_roles', $userPermissions)}
                    <li><a href="{pathFor name='admin-list-roles'}">Roles</a></li>
                {/if}
                {if \Lib\User\User::can('edit_permissions', $userPermissions)}
                    <li><a href="{pathFor name='admin-list-permissions'}">Permissions</a></li>
                {/if}<!-- 
                {if \Lib\User\User::can('edit_translations', $userPermissions)}
                    <li><a href="{pathFor name='admin-translations'}">Translations</a></li>
                {/if} -->
                {if \Lib\User\User::can('edit_pages', $userPermissions)}
                    <li><a href="{pathFor name='admin-pages'}">CMS Pages</a></li>
                {/if}
                {if \Lib\User\User::can('edit_products', $userPermissions)}
                    <li><a href="{pathFor name='admin-products'}">Products</a></li>
                {/if}
            </ul>
        </section>
    </aside>
    <div class="content-wrapper">
        <section class="content-header">
            <h1>{block name="page_heading"}Admin{/block}</h1>
        </section>
        <section class="content">
            {block name="search-bar"}{/block}
            {block name="content"}{/block}
        </section>
    </div>
    <footer>
        {block name="footer_scripts"}
            <script>
                var is_live = {$is_live};
                var auth_id = '{$auth_id}';
                var auth_public = '{$auth_public}';
            </script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
            <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
            <script src="https://cdn.rawgit.com/vast-engineering/jquery-popup-overlay/1.7.13/jquery.popupoverlay.js"></script>
            <script src="https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js"></script>
            <script src="https://cdn.datatables.net/rowgroup/1.0.0/js/dataTables.rowGroup.min.js"></script>
            <script src="/assets/plugins/AdminLTE-2.3.11/bootstrap/js/bootstrap.min.js"></script>
            <script src="/assets/plugins/AdminLTE-2.3.11/js/AdminLTE.min.js"></script>
            <script src="/assets/scripts/admin/logging.js"></script>
            <script src="/assets/scripts/admin/form-errors.js"></script>
            <script src="/assets/scripts/admin/admin.js"></script>
            <script src="//cdn.ckeditor.com/4.8.0/standard/ckeditor.js"></script>
        {/block}
    </footer>
</div>

    {if is_array($flash)}
        <div class="flash-text">{foreach $flash as $message}{$message}<br />{/foreach}</div>
    {/if}

</body>
</html>
