<?php

namespace Lib\Followups;

use \Lib\Database\DbGetter;
use \Lib\Debug\Debugger;

class Followups
{
    public static function fetchFollowup($user_id)
    {
        $db  = DbGetter::getDb();
        $sql = "SELECT
                    f.followup_id,
                    DATE_FORMAT(f.followup_date, '%m/%d/%Y') AS followup_date,
                    DATE_FORMAT(f.followup_date, '%W') AS followup_weekday,
                    f.followup_hour,
                    f.followup_minute,
                    coalesce(concat(x.first_name, ' ',x.last_name), 'n/a') AS clinician_name,
                    concat(y.first_name, ' ',y.last_name) patient_name,
                    followup_method
                FROM
                   followup AS f
                LEFT JOIN user_profile AS x ON (f.followup_participant = x.user_id)
                LEFT JOIN user_profile AS y ON (f.user_id = y.user_id)
            WHERE
                f.user_id = ?";

        $output = [];

        foreach ($db->fetchAll($sql,[$user_id]) as $obj){
            $output[] = [
                'followup_id' => $obj->followup_id,
                'date'        => $obj->followup_date,
                'day_of_week' => $obj->followup_weekday,
                'hour'        => ($obj->followup_hour > 12)? ($obj->followup_hour - 12) : $obj->followup_hour,
                'minute'      => (strlen($obj->followup_minute) > 1)? $obj->followup_minute: $obj->followup_minute.'0',
                'tod'         => ($obj->followup_hour > 12)? 'PM' : 'AM',
                'patient'     => $obj->patient_name,
                'clinician'   => $obj->clinician_name,
                'method'      => $obj->followup_method,
            ];
        }

        return $output;
    }

    public static function fetchSingleFollowup($patient_id, $followup_id, $user_id = null)
    {
        $db  = DbGetter::getDb();
        $sql = "SELECT
                    f.followup_id,
                    f.action_plan_id,
                    f.followup_date,
                    f.followup_hour,
                    f.followup_minute,
                    f.followup_participant,
                    f.followup_method,
                    f.regarding,
                    f.notes,
                    f.outcome,
                    f.next_step,
                    f.prompt_type,
                    f.completed_at,
                    CONCAT(up.first_name, ' ', up.last_name) AS patient_name,
                    CONCAT(upp.first_name, ' ', upp.last_name) AS provider_name,
                    pt.motivational_prompt_type_name AS reminder_method,
                    f.prompt_type,
                    fo.outcome_text,
                    fns.step_text
                FROM followup AS f
                JOIN user_profile AS up
                    USING (user_id)
                LEFT JOIN user_profile AS upp
                    ON upp.user_id = f.followup_participant
                LEFT JOIN motivational_prompt_type AS pt
                    ON f.prompt_type = pt.motivational_prompt_type_id
                LEFT JOIN followup_outcome AS fo
                    ON fo.outcome_id = f.outcome
                LEFT JOIN followup_next_step AS fns
                    ON fns.step_id = f.next_step
                WHERE
                    f.user_id = ? AND f.followup_id = ?";

        $return = [];

        $result = $db->fetchOne($sql, [$patient_id, $followup_id]);

        Debugger::debug($result, 'followup', true);

        if($result){
            foreach ($result as $key => $value) {
                $return[$key] = $value;
            }

            if (count($return) > 0 ) {
                return ['success' => true, 'payload' => $return];
            }
        }

        return json_encode(['success' => false, 'payload' => 'There has been an error saving follow up.']);
    }

    public static function scheduleFollowup($followup_id = null, $action_plan_id = null, $user_id, $date, $hour, $minute, $tod, $reminder_method, $followup_method, $coach, $regarding, $notes, $outcome, $next_step, $email = null, $phone = null)
    {
        $db  = DbGetter::getDb();

        $hour = $hour + (($tod === 'PM')? 12 : 0);
        Debugger::debug($date, 'DATE before');
        $date = Date('Y-m-d', strtotime($date));
        Debugger::debug($date, 'DATE after');

        $completed_at = ($outcome*1 === 1)?  date('Y-m-d H:i:s', time()) : NULL;

        $params = [
            ':followup_id' => $followup_id,
            ':action_plan_id' => $action_plan_id,
            ':user_id' => $user_id,
            ':followup_date' => $date,
            ':followup_hour' => $hour,
            ':followup_minute' => $minute,
            ':followup_participant' => $coach,
            ':followup_method' => $followup_method,
            ':regarding' =>  $regarding,
            ':notes' => $notes,
            ':outcome' => $outcome,
            ':next_step' => $next_step,
            ':prompt_type' => $reminder_method,
            ':completed_at' => $completed_at,
            ':phone_reminder_num' => $phone,
            ':email_reminder_address' => $email
        ];

        $sql = "INSERT INTO followup (
                    followup_id,
                    action_plan_id,
                    user_id,
                    followup_date,
                    followup_hour,
                    followup_minute,
                    followup_participant,
                    followup_method,
                    regarding,
                    notes,
                    outcome,
                    next_step,
                    prompt_type,
                    completed_at,
                    phone_reminder_num,
                    email_reminder_address
                ) VALUES (
                    :followup_id,
                    :action_plan_id,
                    :user_id,
                    :followup_date,
                    :followup_hour,
                    :followup_minute,
                    :followup_participant,
                    :followup_method,
                    :regarding,
                    :notes,
                    :outcome,
                    :next_step,
                    :prompt_type,
                    :completed_at,
                    :phone_reminder_num,
                    :email_reminder_address
                )
                ON DUPLICATE KEY UPDATE
                    action_plan_id         = :action_plan_id,
                    followup_date          = :followup_date,
                    followup_hour          = :followup_hour,
                    followup_minute        = :followup_minute,
                    followup_participant   = :followup_participant,
                    followup_method        = :followup_method,
                    regarding              = :regarding,
                    prompt_type            = :prompt_type,
                    notes                  = :notes,
                    outcome                = :outcome,
                    next_step              = :next_step,
                    phone_reminder_num     = :phone_reminder_num,
                    email_reminder_address = :email_reminder_address,
                    completed_at           = :completed_at,
                    modified_at            = now()";

        if( empty($followup_id) ) {
            $result = $db->insertUpdate($sql, $params);
        } else {
            $result = $db->upsert($sql, $params);
        }


        return ['success' => $result];

    }

    public static function fetchFollowupsForStaff($staffUser, $type = null, $userId = null)
    {
        $db  = DbGetter::getDb();

        $sql = "SELECT
                    f.followup_id, f.user_id, f.followup_date, f.followup_hour, f.followup_minute, f.followup_method, f.completed_at,
                    u.unique_identifier, concat(up.first_name, ' ',up.last_name) AS user_name, concat(ups.first_name, ' ',ups.last_name) AS staff_name,
                    upd.mrn,
                    tz.time_zone_name,
                    (SELECT count(*)
                     FROM followup AS ff
                     WHERE ff.user_id = f.user_id
                     AND ff.followup_date >= NOW()) AS future_followups
                FROM followup AS f
                LEFT JOIN user AS u
                    ON (f.user_id = u.user_id)
                LEFT JOIN user_profile AS up
                    ON (u.user_id = up.user_id)
                LEFT JOIN user_profile AS ups
                    ON ups.user_id = f.followup_participant
                LEFT JOIN user_patient_details AS upd
                    ON (u.user_id = upd.user_id)
                LEFT JOIN time_zone AS tz
                    ON tz.time_zone_id = u.time_zone_id
                WHERE 1 = 1 ";


        $params = [];

        if($staffUser->practice_id){
            $sql .= "AND up.practice_id = ? ";
            $params[] = $staffUser->practice_id;
        }

        if($type == 'overdue'){
            $sql .= "AND f.followup_date < NOW() ";
        } else {
            $sql .= "AND f.followup_date >= NOW() ";
        }
        if($userId){
            $sql .= "AND u.user_id = ? ";
            $params[] = $userId;
        }

        //$sql .= "AND f.outcome != 1";

        $output = [];


        foreach ($db->fetchAll($sql, $params) as $obj){
            Debugger::debug($obj);
            $followupDate = new \DateTime($obj->followup_date . ' ' . $obj->followup_hour . ':' . $obj->followup_minute,
                                          new \DateTimeZone($obj->time_zone_name));

            $followupTime = $followupDate->format('H:i:s');
            \Lib\Debug\Debugger::debug($followupDate);

            $output[] = [
                'patient_id' => $obj->user_id,
                'unique_identifier' => $obj->unique_identifier,
                'followup_id' => $obj->followup_id,
                'date'    => $followupDate,
                'mrn'     => $obj->mrn,
                'who'     => $obj->user_name,
                'with'    => $obj->staff_name,
                'method'  => $obj->followup_method,
                'future_followups' => $obj->future_followups,
                'completed_at' => $obj->completed_at
            ];
        }

        return $output;
    }



    public static function loadFollowupOutcomesList()
    {
        global $memc;

        $db  = DbGetter::getDb();

        $sql = "SELECT * FROM followup_outcome";

        return $memc->fetch($sql, [], 'fetchAll', 2592000, 'followup_outcomes');
    }

    public static function loadFollowupNextStepsList()
    {
        global $memc;

        $db  = DbGetter::getDb();

        $sql = "SELECT * FROM followup_next_step";

        return $memc->fetch($sql, [], 'fetchAll', 2592000, 'followup_next_steps');

    }
}