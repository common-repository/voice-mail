/*!
 * jQuery.VoiceMail. The jQuery Voice Mail plugin
 *   
 * Licensed under GPLv3 licenses
 * http://www.gnu.org/licenses/gpl.html
 *
 *  * Version : 1.0.0
 * Released: 04 Dec, 2020 - 10:20
 * 
 */
(function($)
{
	var methods = {
			init: function(  ) 
			{
				var vmVoiceMailRecorder = null;
				var vmVoiceMailChunks = [];
				var vmVoiceMailCountDown = 180;

				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		        if (navigator.getUserMedia === undefined) 
				{
		            		return false;
		        }

				if (navigator.getUserMedia)
				{
					$('#vmstart').css('display','block');
					$('#vmstop').css('display','block');
					$('#divvoicemailaudio').css('display','block');
				}
				else
				{
					$('#vmstart').css('display','none');
					$('#vmstop').css('display','none');	
					$('#divvoicemailaudio').css('display','none');				
				}
			},
			
			startvoicemail : function () 
			{
				var vmVoiceMailCountDown = 180;


				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	            if (navigator.getUserMedia === undefined) 
				{
		            		return false;
            	}

				  vmVoiceMailChunks = [];

				$('#spanvoicemailcountdownlabel').css('display','block');
				
				$('#buttonvoicemailrecord').css('color','red');
				$('#buttonvoicemailrecord').css('display','none');

				$('#spanvoicemailcountdowntime').css('display','block');
				$('#spanvoicemailcountdowntime').text('180s'); 
				$('#buttonvoicemailStop').css('display','inline-block');
				$('#buttonvoicemailStop').css('color','red');
					
				$('#divvoicemailaudio').css('display','block');
				var vmcountdowninterval	 = setInterval(function () { if (vmVoiceMailCountDown > 0) { vmVoiceMailCountDown--;} 
				if (vmVoiceMailCountDown <= 0) { clearInterval (vmcountdowninterval); 
};
				$('#spanvoicemailcountdowntime').text(vmVoiceMailCountDown); } , 1000 );

				navigator.mediaDevices.getUserMedia({audio: true}).then(function(vmVoiceMailStream) 
				{
					var vmVoiceMailRecorder = new MediaRecorder(vmVoiceMailStream);
					vmVoiceMailRecorder = new MediaRecorder(vmVoiceMailStream);
					$.fn.voicemail.defaults.VoiceMailStream = vmVoiceMailStream;
					$.fn.voicemail.defaults.VoiceMailRecoder = vmVoiceMailRecorder;

					vmVoiceMailRecorder.ondataavailable = function(e) 
					{
						vmVoiceMailChunks.push(e.data);
					};

					$('#buttonvoicemailStop').click( function() {
					$('#spanvoicemailcountdowntime').text('0');
					$('#spanvoicemailcountdowntime').css('display','none');
					$('#buttonvoicemailrecord').voicemail('stopvoicemail',$.fn.voicemail.defaults.VoiceMailRecoder);
				});


				var vmcountdowninterval = setInterval(function () { 

					if (vmVoiceMailCountDown <= 0) { 
						clearInterval (vmcountdowninterval); 
						$('#spanvoicemailcountdowntime').text('0');
						$('#spanvoicemailcountdowntime').css('display','none'); 
						$('#buttonvoicemailrecord').voicemail('stopvoicemail',$.fn.voicemail.defaults.VoiceMailRecoder);
}
					 } , 1000 );
					vmVoiceMailRecorder.start();
				})
			},

			stopvoicemail : function (vmVoiceMailRecordertoStop) 
			{
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	            if (navigator.getUserMedia === undefined) 
				{
		            		return false;
            	}

           		if (vmVoiceMailRecordertoStop)
				{
					vmVoiceMailRecordertoStop.onstop = e => {

					  var vmVoiceMailblob = new Blob(vmVoiceMailChunks, { 'type': 'audio/ogg; codecs=opus' });
					  var audioURL = window.URL.createObjectURL(vmVoiceMailblob);
					  $('#audiovoicemailid').attr('src',audioURL);
					    var vmVoiceMailFileReader = new FileReader();
					    vmVoiceMailFileReader.readAsDataURL(vmVoiceMailChunks[0]); //!!! [0]?
					    vmVoiceMailFileReader.onload = function(e) 
						{
						        var vmVoiceMailFileUploadDate = vmVoiceMailFileReader.result;
						        $('#hiddensendvoicetoadmin').attr('value', vmVoiceMailFileUploadDate);
						}
					};

    if ($.fn.voicemail.defaults.VoiceMailRecoder) {
	if ($.fn.voicemail.defaults.VoiceMailRecoder.state == 'recording')
	{
		$.fn.voicemail.defaults.VoiceMailRecoder.stop();
	}
}

    if ($.fn.voicemail.defaults.VoiceMailStream) {
        $.fn.voicemail.defaults.VoiceMailStream.getTracks().forEach(function(track) {
            track.stop();
        });
	}
				}
			}
	}
	
	$.fn.voicemail = function(method)
	{
		
	    if ( methods[method] ) 
	    {
	        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } 
	    else if ( typeof method === 'object' || ! method ) 
	    {
	        return methods.init.apply( this, arguments );
	    } 
	    else 
	    {
	        $.error( 'Method ' +  method + ' does not exist on jQuery.voicemail' );
	    }

   };
   
   $.fn.voicemail.defaults = {
			recordtime: 180,
			VoiceMailStream: null,
			VoiceMailRecoder: null,
			};
})(jQuery);

