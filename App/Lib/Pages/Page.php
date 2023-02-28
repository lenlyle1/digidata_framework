<?php

namespace Lib\Pages;

use Lib\Smarty\Template;
use Lib\Debug\Debugger;
use Lib\Database\DbGetter;

class Page
{
	static function loadAll()
	{
		$db = DbGetter::getDb();

		$sql = "SELECT * FROM cms_pages";
		$pages = $db->fetchAll($sql);

		return $pages;
	}

    static function load($slug)
    {
		$db = DbGetter::getDb();

		$sql = "SELECT * FROM cms_pages WHERE url_name = :url_name";
		$page = $db->fetchOne($sql, ['url_name' => $slug]);

		return $page;
    }   

    static function save($params)
    {
		$db = DbGetter::getDb();

		$pageParams = [
			':page_id' => $params['page_id'] ?? '',
			':url_name' => $params['url_name'],
			':title' => $params['title'],
			':content' => $params['content']
		];
		
		$sql = "INSERT INTO cms_pages (
					url_name,
					title,
					content
				) VALUES (
					:url_name,
					:title,
					:content
				)
                ON DUPLICATE KEY UPDATE
                	url_name = :url_name,
                	title = :title,
                	content = :content";

        return $db->insertUpdate($sql, $pageParams);

    }

    static function delete($urlName)
    {
		$db = DbGetter::getDb();

		$sql = "DELETE FROM cms_pages
				WHERE url_name = ?";

		return $db->runQuery($sql, [$urlName]);
    }
}