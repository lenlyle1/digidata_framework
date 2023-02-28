<?php


$m = new Memcached();
$m->addServer('localhost', 11211);
$m->setOption(\Memcached::OPT_LIBKETAMA_COMPATIBLE, true);
// $m->flush();
// $m->set('int', 100);
// $m->set('string', 'a simple string');
// $m->set('array', array(11, 12));
// /* expire 'object' key in 5 minutes */
// $m->set('object', new stdclass, time() + 300);


var_dump($m->get('int'));
var_dump($m->get('string'));
var_dump($m->get('array'));
var_dump($m->get('object'));

var_dump($m->getAllKeys());

