    {if $users}
      <div class="box">
        <table class="grid display hover" data-page-length="100">
            <thead>
                <tr class="patients-bg-active">
                {if empty($user->practice_name)}
                    <th>Practice</th>
                {/if}
                {if \Lib\User\User::can('login_as_patient', $userPermissions)}
                    <td></td>
                {/if}
                {if \Lib\User\User::can('view_patient_phi', $userPermissions)}
                    <th>MRN</th>
                    {* <th>Practice</th> *}
                    {* <th>User Type</th> *}
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Age</th>
                    <th>Height</th>
                {else}
                    <th>User Key</th>
                {/if}
                    <th>Last Health Survey</th>
                    <th>Last Action Plan</th>
                    <th>Next Followup</th>
                </tr>
            </thead>
            <tbody>
                {foreach $users as $id => $listUser}
                <tr>
                {if empty($user->practice_name)}
                    <td>{$listUser->practice_name}</td>
                {/if}
                {if \Lib\User\User::can('login_as_patient', $userPermissions)}
                    <td class="login_button" data-user_id="{$listUser->user_id}"><button data-user_id="{$listUser->user_id}" class="login-user whole-form_open btn btn-primary btn-sm">Login As</button></td>
                {/if}
                {if \Lib\User\User::can('view_patient_phi', $userPermissions)}
                    <td><a href="/admin/user/patient/{$listUser->user_id}">{$listUser->mrn}</a></td>
                    {* <td>{$listUser->practice_name}</td> *}
                    {* <td>{$listUser->role_name}</td> *}
                    <td><a href="/admin/user/patient/{$listUser->user_id}">{$listUser->first_name}</a></td>
                    <td><a href="/admin/user/patient/{$listUser->user_id}">{$listUser->last_name}</a></td>
                    <td>{$listUser->date_of_birth|date_format:"m/d/Y"}</td>
                    <td>{calcAge dob=$listUser->date_of_birth}</td>
                    <td>{($listUser->height / 12)|floor}' {$listUser->height % 12}"</td>
                {else}
                    <td><a href="/admin/user/patient/{$listUser->user_id}">{$listUser->unique_identifier}</a></td>
                {/if}
                    <td>{$listUser->evaluation_date|date_format:"m/d/Y"}</td>
                    <td>{$listUser->action_plan_date|date_format:"m/d/Y"}</td>
                    <td>{$listUser->followup_date|date_format:"m/d/Y"}</td>
                </tr>
                {/foreach}
            </tbody>
        </table>
      </div>
    {/if}

    <div id="whole-form">
        <div class="modal" id="myModal">
	    <div class="modal-dialog">
		<div class="modal-content">
		    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">Add New Patient</h4>
                    </div>
                    <div class="modal-body">
                    <form id="user-details" method="post" onsubmit="return false;">
                        <input type="hidden" name="user_role" value="patient" />
                        <div id="user-form" >
                            <div id="practice">
                                <label>Practice:</label>
                                {if $user->practice_id}
                                    {$user->practice_name}
                                    <input type="hidden" name="practice_id" value="{$user->practice_id}" />
                                {else}
                                    <select name="practice_id" id="practice_id">
                                        <option value=""> - Select - </option>
                                    {foreach $practices as $practice}
                                        <option value="{$practice->practice_id}">{$practice->name}</option>
                                    {/foreach}
                                    </select>
                                {/if}
                            </div>
                        </div>
                            <fieldset>
                                <legend>User Information</legend>
                                <div class="patient-only">
                                    {* <div class="partial half"> *}
                                    <div class="col-md-6 form-group">
                                            <label for="mrn">Patient MRN:* </label>
                                            <input class="form-control" type="text" name="mrn" id="mrn" value="" class="required" />
                                    </div>

                                    <div class="col-md-6 form-group">
                                            <label for="date_of_birth">Date of Birth*: </label>
                                            <input class="form-control" type="text" name="date_of_birth" id="date_of_birth" style="width:11rem" class="required" placeholder="mm/mm/yyyy" />
                                    </div>

                                    <div class="col-md-6 form-group">
                                        <label for="gender_id">Gender:* </label>
                                        <select class="form-control" name="gender_id" class="required" id="gender_id">
                                            <option value="">Select</option>
                                            {foreach $genders as $id => $gender}
                                                <option value="{$gender->gender_id}"{if $gender->gender_id == $patient->gender_id} selected="selected"{/if}>{$gender->gender}</option>
                                            {/foreach}
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label for="time_zone">Time zone:* </label>
                                        <select class="form-control" name="time_zone" id="time_zone">
                                            <option value=""> - Select - </option>
                                        {foreach $tzList as $tz}
                                            <option value="{$tz->time_zone_id}"{if (!empty($patient->time_zone_id) && $tz->time_zone_id == $patient->time_zone_id) || (empty($patient->time_zone_id) && $tz->time_zone_id == 11)} selected="selected"{/if}>{$tz->time_zone_name}</option>
                                        {/foreach}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div class="col-md-12 form-group">
                                        <label for="height_feet">Height: </label>
                                        <select name="height_feet" id="height_feet">
                                            <option value="">Feet</option>
                                            {for $feet=0 to 8}
                                            <option value="{$feet}" {if $feet == $patient->height_feet}selected="selected"{/if}>{$feet}</option>
                                            {/for}
                                        </select>
                                        <select name="height_inches">
                                            <option value="">Inches</option>
                                            {for $inches=0 to 12}
                                            <option value="{$inches}">{$inches}</option>
                                            {/for}
                                        </select>
                                    </div>
                                </div>

                                <div id="names">
                                    <div class="col-md-6 form-group">
                                        <label for="first_name">First Name:* </label>
                                        <input class="form-control" type="text" name="first_name" id="first_name" value="" class="required" />
                                    </div>

                                    <div class="col-md-6 form-group">
                                        <label for="last_name">Last Name:* </label>
                                        <input class="form-control" type="text" name="last_name" id="last_name" value="" class="required" />
                                    </div>
                                </div>

                                <div class="col-md-12 form-group">
                                    <label for="email_address">Email Address: </label>
                                    <input class="form-control" type="text" name="email_address" id="email_address" value="" class="long required" />
                                </div>

                                <div class="col-md-12 form-group">
                                    <label for="confirm_email">Confirm Email: </label>
                                    <input class="form-control" type="text" name="confirm_email" id="confirm_email" value="" class="long required" />
                                </div>

                                <div id="phone-numbers">
                                    <div class="col-md-6 form-group">
                                        <label>Home Phone: </label>
                                        <input class="form-control" type="text" name="home_phone" id="home_phone" value="" />
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label>Mobile Phone: </label>
                                        <input class="form-control" type="text" name="mobile_phone" id="mobile_phone" value="" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="language">Language: </label>
                                    <select class="form-control" name="language">
                                    {foreach $languages as $language}
                                        <option value="{$language->language_id}">{$language->language}</option>
                                    {/foreach}
                                    </select>
                                </div>
                            </fieldset>

                            <div class="col-md-6" id="login-info">
                                <fieldset>
                                    <legend>Login Information</legend>

                                    <div class="form-group">
                                        <label for="username">Username: </label>
                                        <input class="form-control" type="text" name="username" id="username" value="" class="required" />
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Password: </label>
                                        <input class="form-control" type="text" name="password" id="password" value="" class="required" />
                                    </div>
                                    <div class="form-group">
                                        <label for="confirm_password">Confirm Password: </label>
                                        <input class="form-control" type="text" name="confirm_password" id="confirm_password" value="" class="required" />
                                    </div>
                                </fieldset>
                            </div>

                            <div class="col-md-6 patient-only">
                                <fieldset>
                                    <legend>CTH Information</legend>

                                    <div class="form-group">
                                        <label for="coach">Coach: </label>
                                        {if !empty($coaches)}
                                            <select class="form-control" name="coach" id="coach">
                                                <option value=""> - Select - </option>
                                            {foreach $coaches as $coach}
                                                <option value="{$coach->user_id}">{$coach->last_name}, {$coach->first_name}</option>
                                            {/foreach}
                                            </select>
                                        {else}
                                            No coaches available for this practice
                                        {/if}
                                    </div>
                                    <div class="form-group">
                                        <label for="provider">Provider: </label>
                                        {if !empty($providers)}
                                            <select class="form-control" name="provider" id="provider">
                                                <option value=""> - Select - </option>
                                            {foreach $providers as $provider}
                                                <option value="{$provider->user_id}">{$provider->last_name}, {$provider->first_name}</option>
                                            {/foreach}
                                            </select>
                                        {else}
                                            No providers available for this practice
                                        {/if}
                                    </div>

                                    <div class="col-md-6">
                                        <label for="type_2_dm">Type 2 DM: </label>
                                        <input type="checkbox" name="type_2_dm" id="type_2_dm" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="type_2_dm">Test user: </label>
                                        <input type="checkbox" name="test_user" id="type_2_dm" />
                                    </div>
                                </fieldset>
                            </div>
                    </form>
		    <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal" id="cancel">Cancel</button>
                      <button type="button" class="btn btn-primary" id="save">Save</button>
                    </div>
		</div>
	    </div>
        </div>
    </div>
