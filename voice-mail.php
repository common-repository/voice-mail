<?php
/**
* Plugin Name: Voice Mail
* Plugin URI:  https://wordpress.org/plugins/voice-mail/
* Description: Voice Mail
* Version: 1.0.1
* Author: Voice Mail
* Author URI: https://wordpress.org/plugins/voice-mail
* Text Domain: voice-mail
* License: GPLv3 or later
*/
/*  
 This program comes with ABSOLUTELY NO WARRANTY;
https://www.gnu.org/licenses/gpl-3.0.html
https://www.gnu.org/licenses/quick-guide-gplv3.html
*/

if (!defined('ABSPATH'))
{
	exit;
}


define('Voice_MAIL_TEMPLATE_PATH', plugin_dir_path(__FILE__).'template'.'/');
define('Voice_MAIL_ASSET_PATH', plugin_dir_path(__FILE__).'asset'.'/');
define('Voice_MAIL_FILES_PATH', plugin_dir_path(__FILE__).'files'.'/');

function vmVoiceMailLoadScripts()
{
	wp_register_style( 'vmvoicemailfrontendcss', plugin_dir_url( __FILE__ ).'asset/css/vmvoicemailfrontend.css');
	wp_enqueue_style( 'vmvoicemailfrontendcss' );

	wp_register_script( 'vmvoicemailfrontendjs', plugin_dir_url( __FILE__ ).'asset/js/vmvoicemailfrontend.js', array('jquery'));
	wp_enqueue_script( 'vmvoicemailfrontendjs' );
}
add_action( 'wp_enqueue_scripts', 'vmVoiceMailLoadScripts' );


if (is_admin())
{
	//
}
else
{
	require_once(Voice_MAIL_TEMPLATE_PATH."default.php");
	add_shortcode('voice_mail', 'vmVoiceMailShortcode');
}

function vmVoiceMailDefaultTemplateLoadJs()
{
	?>
<script type="text/javascript">
jQuery(document).ready(function () 
{
	jQuery('#buttonvoicemailrecord').voicemail();
	jQuery('#buttonvoicemailrecord').click(function(){jQuery('#buttonvoicemailrecord').voicemail('init')});
	jQuery('#buttonvoicemailrecord').click(function(){jQuery('#buttonvoicemailrecord').voicemail('startvoicemail')});
	jQuery('#buttonvoicemailStop').click(function(){jQuery('#buttonvoicemailrecord').voicemail('stopvoicemail')});
})
</script>
<?php
}
 
add_action('wp_footer','vmVoiceMailDefaultTemplateLoadJs');


function vmVoiceMailSendMail($admin_mail,$voice_mail_title, $voice_mail_content)
{
	if (empty($voice_mail_content))
	{
		return false;
	}
	
	if (empty($admin_mail))
	{
		$admin_mail = get_option('admin_mail');		
	}
	
	if (empty($voice_mail_title))
	{
		$voice_mail_title = 'New voice mail';
	}
	
	@wp_mail($admin_mail,$voice_mail_title, $voice_mail_content );
	
}



