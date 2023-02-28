<?php

namespace Lib\Debug\Traits;

trait DebuggerObsafePrintRTrait
{
    private static function obsafePrintR($var, $return = false, $html = false, $level = 0)
    {
        $spaces = "";
        $space = $html ? "&nbsp;" : " ";
        for ($i = 1; $i <= 6; $i++) {
            $spaces .= $space;
        }
        $tabs = $spaces;
        for ($i = 1; $i <= $level; $i++) {
            $tabs .= $spaces;
        }
        if (is_array($var)) {
            $title = "Array";
        } elseif (is_object($var)) {
            $title = get_class($var)." Object";
        }
        $output = $title . self::$newline . self::$newline;
        foreach($var as $key => $value) {
            if (is_array($value) || is_object($value)) {
                $level++;
                $value = self::obsafePrintR($value, true, $html, $level);
                $level--;
            }
            $output .= $tabs . "[" . $key . "] => " . $value . self::$newline;
        }
        if ($return) {
            return $output;
        }else{
            echo $output;
        }
    }
}