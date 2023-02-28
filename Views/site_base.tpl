<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{block name="title"}{/block}</title>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="description" content="" />
        <meta name="keyword" content="" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous">
       

        {block name="js"}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        {/block}
        
    </head>
    <body>
        <header>
            <div class="contentHolder">
                <div class="left">
                    <div class="logo">
                        <a href="/">
                            <span class="site-name">Heather in Wales</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
        <div class="contentHolder main-body">
            {block name="content"}
                Default content
            {/block}
        </div>


        <footer>    
            <div class="contentHolder"> 
                <div class="row">
                    {include file="footer-menu.tpl"}
                </div>
            </div>
        </footer>
    </body>
</html>