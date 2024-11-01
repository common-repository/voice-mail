<?php

if (!defined('ABSPATH'))
{
	exit;
}

function vmVoiceMailShortcode()
{
	if (isset($_POST['hiddensendvoicetoadmin']))
	{
		$getvmVoiceMailData = sanitize_text_field($_POST['hiddensendvoicetoadmin']);

		$file_name =  md5(uniqid(mt_rand(),1)).'.ogg';
		
		$getvmVoiceMailToFile =  str_replace('data:audio/ogg; codecs=opus;base64,','',$getvmVoiceMailData);
		$getvmVoiceMailToFile = base64_decode($getvmVoiceMailToFile);
		$vmVoiceMailFP = fopen(Voice_MAIL_FILES_PATH.$file_name,'w');
		fwrite($vmVoiceMailFP,$getvmVoiceMailToFile);
		fclose($vmVoiceMailFP);
		
		$admin_mail = get_option('admin_mail');
		$voice_mail_title = 'New voice mail';
		$voice_mail_url = plugin_dir_url( __FILE__ ).'files/'.$file_name;
		$voice_mail_content = "You have a <a target = '_blank' href='$voice_mail_url'>new voice mail</a>";
		vmVoiceMailSendMail($admin_mail,$voice_mail_title, $voice_mail_content);
	}
	

	if (is_admin())
	{
		return '';
	}
	else
	{
		$vmVoiceMailFormContent = "
	<h5>Please click the record button to start recording, click the submit button to send the recording to me</h5>
	<form class='voicemailform' name='voicemailform' action='' method='POST'>
		<span id='spanvoicemailcountdownlabel'>Countdown: </span>
		<span id='spanvoicemailcountdowntime'></span>
		<div id='divvoicemailaudio'>
		<audio controls id='audiovoicemailid'></audio>
		</div>
		<button type='button' id='buttonvoicemailrecord' class='buttonvoicemailrecord hide-if-no-js button-link js-update-details-toggle' aria-expanded='false'>
		" .
			 __( ' Record ' )
		."
		</button>
		<button type='button' id='buttonvoicemailStop' class='buttonvoicemailStop hide-if-no-js button-link js-update-details-toggle' aria-expanded='false'>
		 ".
			__( ' Stop ' )
		."
		</button>
		<input type='hidden' id='hiddensendvoicetoadmin' name='hiddensendvoicetoadmin' value='' />
		<input type='submit' class='button-primary' id='voiceMailSendRecordSubmit' name='voiceMailSendRecordSubmit' value='". __(' Submit ')."'>
	</form>";
	}
	return $vmVoiceMailFormContent;
	
}


