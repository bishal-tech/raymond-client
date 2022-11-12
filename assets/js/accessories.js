let iFrameHost = "https://3dviewer.imaginarium.io";
let iFrameSource;
var payload = {};
$(document).ready(function() {
	
	$(window).on('message', function(event) {
		let origin = event.origin || event.originalEvent.origin; // ForChrome, the origin property is in the event.originalEvent object.
		let data = event.data || event.originalEvent.data;
		let source = event.source || event.originalEvent.source;
		if(data.action === 'Handshake' && origin === iFrameHost) {
			iFrameSource = source;
			iFrameSource.postMessage(payload, iFrameHost);
		}
	});
});

function initPayload(design_id, material, enamels) {
	payload = {
				command: "initWebgl",
				design_id : design_id,
				material : material,
				enamels : enamels,
				id: 'raymond'
			};
}