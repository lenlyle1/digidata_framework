{extends file='admin/admin_lte_base.tpl'}

{block name="page_title"}Users{/block}

{block name="page_heading" append}
    Users > {ucwords($userType)}
{/block}


{block name="search-bar"}
    <div class="col-md-6">
        Users
    </div>
    <div class="col-md-6">
        Roles
    </div>
{/block}

{block name="content"}

        {include file="admin/pages/partials/users.tpl"}

    {** IMPORTER **}
    <div id="importer">
	<div class="modal" id="import">
	    <div class="modal-dialog">
		<div class="modal-content">
		    <div class="modal-header">
		       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">Import Patients</h4>
                    </div>
                    <div class="modal-body">
                        <p>Please select file for import.</p>

                        <p>Import sheet must be a CSV file. <a href="/assets/cth_patient_upload_sheet.csv">Click here</a> to download the template.</p>

                        <div id="upload-box">
                            <form id="upload-form" method="post" enctype="multipart/form-data">
                                Select CSV to upload:
                                <input type="file" name="fileToUpload" id="fileToUpload">
                                <button id="upload-button" class="btn" value="Upload CSV">Upload</button>
                            </form>
                        </div>
                        <div id="upload-response"></div>
                    </div>
		    <div class="modal-footer">
                      <button type="button" class="btn btn-default pull-left" data-dismiss="modal" id="cancel">Close</button>
                    </div>
		</div>
	    </div>
	</div>
    </div>
{/block}

{block name="footer_scripts" append}

    <script src="/assets/scripts/admin/users.js"></script>

{/block}
