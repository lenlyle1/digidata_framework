    <div class="box">
        <table class="grid display hover">
            <thead>
                <tr class="staff-bg-active">
                    <th>Username</th>
                    <th>User Type</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {foreach $users as $id => $listUser}
                <tr>
                    <td>{$listUser->username}</td>
                    <td>{$listUser->role_name}</td>
                    <td>{$listUser->first_name}</td>
                    <td>{$listUser->last_name}</td>
                    <td>{$listUser->email_address}</td>
                    <td class="edit"><button data-user-id="{$listUser->user_id}" class="edit-user btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">Edit</button></td>
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
                </div>
            </div>
        </div>
    </div>


