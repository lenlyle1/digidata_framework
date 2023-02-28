<?php

namespace Lib\Debug\Traits;

trait DebuggerParseBacktraceTrait
{
    private static function parseBacktrace($raw)
    {
        unset($raw[0]); // take debug class out of the back trace
        $output = "\n\n";

        foreach($raw as $entry){
            $output .= "    File: " . (!empty($entry['file']) ? $entry['file'] : "") ." (Line: " .
                                  (!empty($entry['line']) ? $entry['line'] : "") . ")\n" .
                       "    Function: " . (!empty($entry['function']) ? $entry['function'] : "") . "()\n";
        }

        return trim($output);
    }
}