    <div class="box">
        <table class="grid display hover">
            <thead>
                <tr class="staff-bg-active">
                    <th>Practice</th>
                    <th>User Type</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Provider</th>
                    <th>Coach</th>
                    <th>Group Leader</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {foreach $users as $id => $listUser}
                <tr>
                    <td>{* <a href="/admin/user/staff/{$listUser->user_id}"> *}{$listUser->practice_name}</td>
                    <td>{$listUser->role_name}</td>
                    <td>{$listUser->first_name}</td>
                    <td>{$listUser->last_name}</td>
                    <td>{$listUser->email_address}</td>
                    <td>{$listUser->username}</td>
                    <td>{if $listUser->is_provider}Yes{else}No{/if}</td>
                    <td>{if $listUser->is_coach}Yes{else}No{/if}</td>
                    <td>{if $listUser->leader_count}Yes{else}No{/if}</td>
                    <td class="edit">{if \Lib\User\User::can('edit_staff',
                    $userPermissions)}<button data-user-id="{$listUser->user_id}" class="edit-user btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">Edit</button>{/if}</td>
                </tr>
                {/foreach}
            </tbody>
        </table>
    </div>

    <div id="whole-form">
        <div class="modal" id="myModal">
	    <div class="modal-dialog">
		<div class="modal-content">
		    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">Edit User</h4>
                    </div>
                    <div class="modal-body">
                        <form id="user-details" method="post" onsubmit="return false;">
                            <div id="user-form">
                                <div class="form-group">
                                    <label for="time_zone">Time zone: </label>
                                    <select name="time_zone" id="time_zone" class="form-control">
                                        <option value=""> - Select Timezone - </option>
                                    {foreach $tzList as $tz}
                                        <option value="{$tz->time_zone_id}"{if $tz->time_zone_id == $user->time_zone_id} selected="selected"{/if}>{$tz->time_zone_name}</option>
                                    {/foreach}
                                    </select>
                                </div>
                                <div class="form-group">

                                    <label for="first_name">User Role: </label>
                                    <select name="user_role" id="user_role" class="form-control">
                                        <option value=""> - Select Role - </option>
                                        {if \Lib\User\User::can('add_practice_staff', $userPermissions)}<option value="practice staff">Practice Staff</option>{/if}
                                        {if \Lib\User\User::can('add_research_staff', $userPermissions)}<option value="research staff">Research Staff</option>{/if}
                                        {if \Lib\User\User::can('add_practice_admin', $userPermissions)}<option value="practice admin">Practice Admin</option>{/if}
                                        {if \Lib\User\User::can('add_cth_administrator', $userPermissions)}<option value="cth administrator">CTH Administrator</option>{/if}
                                        {if \Lib\User\User::can('add_cth_groupleader', $userPermissions)}<option value="cth groupleader">CTH Groupleader</option>{/if}
                                        {if \Lib\User\User::can('add_translator', $userPermissions)}<option value="translator">Translator</option>{/if}
                                    </select>
                                </div>
                                <div id="practice" class="form-group">
                                    <label for="first_name">Practice: </label>
                                    {if $user->practice_id}
                                        {$user->practice_name}
                                        <input type="hidden" name="practice_id" value="{$user->practice_id}" />
                                    {else}
                                        <select name="practice_id" id="practice_id" class="form-control">
                                            <option value=""> - Select Practice - </option>
                                        {foreach $practices as $practice}
                                            <option value="{$practice->practice_id}">{$practice->name}</option>
                                        {/foreach}
                                        </select>
                                    {/if}
                                </div>
                                <fieldset>
                                    <legend>User Information</legend>

                                    <div id="names">
                                        <div class="col-md-6 form-group">
                                            <label for="first_name">First Name: </label>
                                            <input type="text" name="first_name" id="first_name" value="" class="required form-control" />
                                        </div>

                                        <div class="col-md-6 form-group">
                                            <label for="last_name">Last Name: </label>
                                            <input type="text" name="last_name" id="last_name" value="" class="required form-control" />
                                        </div>
                                    </div>

                                    <div class="col-md-12 form-group">
                                        <label for="email_address">Email Address: </label>
                                        <input type="text" name="email_address" id="email_address" value="" class=" form-control required" />
                                    </div>

                                    <div class="col-md-12 form-group">
                                        <label for="confirm_email">Confirm Email: </label>
                                        <input type="text" name="confirm_email" id="confirm_email" value="" class=" form-control required" />
                                    </div>

                                    <div id="phone-numbers">
                                        <div class="col-md-6 form-group">
                                            <label>Office Phone: </label>
                                            <input type="text" name="home_phone" id="home_phone" value="" class=" form-control"/>
                                        </div>
                                        <div class="col-md-6 form-group">
                                            <label>Mobile Phone: </label>
                                            <input type="text" name="mobile_phone" id="mobile_phone" value="" class=" form-control" />
                                        </div>
                                        <div id="coach-provider">
                                            <div class="col-md-6 form-group">
                                                <label>Is Coach: </label>
                                                <input type="checkbox" name="is_coach" id="is_coach" value="1" />
                                            </div>
                                            <div class="col-md-6 form-group">
                                                <label>Is Provider: </label>
                                                <input type="checkbox" name="is_provider" id="is_provider" value="1" />
                                            </div>
                                        </div>
                                    </div>

                                </fieldset>

                                <div id="login-info" class="col-md-6">
                                    <fieldset>
                                        <legend>Login Information</legend>

                                        <div class="form-group">
                                            <label for="username">Username: </label>
                                            <input type="text" name="username" id="username" value="" class="required form-control" />
                                        </div>
                                        <div class="form-group">
                                            <label for="password">Password: </label>
                                            <input type="text" name="password" id="password" value="" class="required form-control" />
                                        </div>
                                        <div class="form-group">
                                            <label for="confirm_password">Confirm Password: </label>
                                            <input type="text" name="confirm_password" id="confirm_password" value="" class="required form-control" />
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-default pull-left" data-dismiss="modal" id="cancel">Close</button>
                      <button type="button" class="btn btn-primary" id="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>


