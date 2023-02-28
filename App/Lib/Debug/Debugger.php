<?php

namespace Lib\Debug;

/**
* Debugging class - writes to log in live environment
* logging turn offable in config to stop large log files on live server
*
* Author: Len Lyle
*/
Class Debugger
{
    use Traits\DebuggerWritelogTrait;
    use Traits\DebuggerGetItemsTrait;
    use Traits\DebuggerSetLogPathTrait;
    use Traits\DebuggerParseBacktraceTrait;
    use Traits\DebuggerObsafePrintRTrait;

    private static $newline = "\n";

    private static $logPath = "/var/www/log/";

    private static $logfile = "debuglog";

    private static $dirSplitter = "/";

    public static function setPath($path)
    {
        self::$logPath = $path;
    }

    public static function debug($data = null, $name = '', $showBacktrace = false, $logfile = null)
    {
        // do not log live site
        if(IS_LIVE && $logfile != 'sqlerr') {
            return;
        }

        if(!is_dir(self::$logPath)){
            //echo self::$logPath;
            mkdir(self::$logPath);
        }
        if(empty($logfile)){
            $logfile = self::$logfile;
        }

        // backtrace to source file.
        $backtraceData = debug_backtrace();
        $file = $backtraceData[0]['file'];
        $line = $backtraceData[0]['line'];
        if(!isset(self::$logfile)){
            $filebits = explode(self::$dirSplitter, $file);
            self::$logfile = array_pop($filebits);
        }

        // parse the backtrace
        $backtrace = self::parseBacktrace($backtraceData);

        if (is_array($data) || is_object($data)) {
            $logdata = self::obsafePrintR($data, TRUE);
        } else {
            $logdata = $data;
        }

        // create time stamp;
        $dt = new \DateTime;
        $time = $dt->format('D M j G:i:s');
        //print_r($time);
        // [Tue Jun 20 07:35:01.901106 2017]
        $logmessage = '' .
                      self::$newline .
                      '[' . $time . '] ' .
                      (($name) ? $name : 'Debug') . " - File:" . $file . " - Line:" . $line .
                      self::$newline .
                      $logdata .
                      (($showBacktrace) ?
                          self::$newline .
                          self::$newline .
                          "-------------------------------" .
                          self::$newline .
                          "Backtrace: " . $backtrace .
                          self::$newline .
                          "-------------------------------" .
                          self::$newline
                      : "") .
                      self::$newline .
                      self::$newline;

        self::Writelog(self::$logPath . $logfile, $logmessage);

    }
}
