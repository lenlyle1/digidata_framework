
                <div>
                    <div>
                        <form id="user-details" method="post" onsubmit="return false;">
                            <div id="user-form">
                                <input type="hidden" name="userId" value="{$user->user_id}" />
                                {if !empty($tzList)}
                                <div class="form-group">
                                    <label for="time_zone">Time zone: </label>
                                    <select name="time_zone" id="time_zone" class="form-control">
                                        <option value=""> - Select Timezone - </option>
                                    {foreach $tzList as $tz}
                                        <option value="{$tz->time_zone_id}"{if $tz->time_zone_id == $user->time_zone_id} selected="selected"{/if}>{$tz->time_zone_name}</option>
                                    {/foreach}
                                    </select>
                                </div>
                                {/if}
                                <div class="form-group">

                                    <label for="first_name">User Role: </label>
                                    <select name="user_role" id="user_role" class="form-control">
                                        <option value=""> - Select Role - </option>
                                        {foreach $roles as $role}
                                        <option value="{$role->role_id}" {if $role->role_name == $user->role_name}selected="selected"{/if}>{$role->role_name}</option>
                                        {/foreach}
                                    </select>
                                </div>
                               <fieldset>
                                    <legend>User Information</legend>

                                    <div id="names">
                                        <div class="col-md-6 form-group">
                                            <label for="first_name">First Name: </label>
                                            <input type="text" name="first_name" id="first_name" value="{$user->first_name}" class="required form-control" />
                                        </div>

                                        <div class="col-md-6 form-group">
                                            <label for="last_name">Last Name: </label>
                                            <input type="text" name="last_name" id="last_name" value="{$user->last_name}" class="required form-control" />
                                        </div>
                                    </div>

                                    <div class="col-md-12 form-group">
                                        <label for="email_address">Email Address: </label>
                                        <input type="text" name="email_address" id="email_address" value="{$user->email_address}" class=" form-control required" />
                                    </div>

                                    <div id="phone-numbers">
                                        <div class="col-md-6 form-group">
                                            <label>Office Phone: </label>
                                            <input type="text" name="home_phone" id="home_phone" value="{$user->home_phone}" class=" form-control"/>
                                        </div>
                                        <div class="col-md-6 form-group">
                                            <label>Mobile Phone: </label>
                                            <input type="text" name="mobile_phone" id="mobile_phone" value="{$user->mobile_phone}" class=" form-control" />
                                        </div>
                                    </div>

                                </fieldset>

                                <div id="login-info" class="col-md-6">
                                    <fieldset>
                                        <legend>Login Information</legend>

                                        <div class="form-group">
                                            <label for="username">Username: </label>
                                            <input type="text" name="username" id="username" value="{$user->username}" class="required form-control" />
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