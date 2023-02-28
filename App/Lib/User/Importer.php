<?php

namespace Lib\User;

use \Lib\Debug\Debugger;
use \Lib\User\User;
use \Lib\Session\Session;

class Importer extends \Lib\Files\CsvParser
{
    public static function import($file)
    {
        global $memc;

        //Debugger::debug($file);

        $lines = self::parseCsv($file['tmp_name']);

        //Debugger::debug(Session::get('user'));

        $response = ['noErrors' => true];

        foreach ($lines as $num => $line) {
            Debugger::debug($line, 'Line for import');

            $line['import'] == true;
            $line['user_role'] = 'patient';
            $line['practice_id'] = Session::get('user')->practice_id;
            $line['time_zone'] = Session::get('user')->time_zone_id;
            $line['import'] = true;
            $line['gender_id'] = $memc->fetch('SELECT gender_id FROM gender WHERE gender_abbr = ?', [$line['gender']], 'fetchOne', 3600)->gender_id;

            //Debugger::debug($line);



            // we have data, save the user
            $result = User::save($line);

            //Debugger::debug($result, 'RESULT');

            if(!$result['success']) {
                $response['noErrors'] = false;
                $response['details']['lines'][($num + 1)]['errors'] = $result['errors'];
            } else {
                $response['details']['lines'][($num + 1)] = $line['first_name'] . ' ' . $line['last_name'] . ' Uploaded Successfully.';
            }

            //Debugger::debug($response);
        }

        $response['logFile'] = \Lib\Files\LogWriter::writeUploadLog($response['details']['lines']);

        return $response;
    }
}