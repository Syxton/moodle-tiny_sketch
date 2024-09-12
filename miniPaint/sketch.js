/**
 * On page load, see if a file is selected and load it.
 * If no image is selected, load the testimage.png.
 *
 */
$(document).ready(function() {
    setTimeout(function() {
        var selected = window.parent.tinyMCE.activeEditor.selection.getNode();
        if (selected.tagName == "IMG") {
            open_image(selected);
        } else {
            open_image(); // Open blank testimage.png if none is found.
        }

		$(".tox-pop", top.document).remove();

        $('.sketchsubmit').click(function(e) {
			e.preventDefault();
			let id = Date.now();
            var dataURI = $('#canvas_minipaint')[0].toDataURL();
			window.parent.tinyMCE.activeEditor.execCommand('mceInsertContent', 0, '<img id="' + id + '" src="' + dataURI + '" />');

			setTimeout(function () {
				// Check if force image alt text popup is enabled.
				if (window.parent.tinyMCE.activeEditor.options.get("tiny_sketch/plugin:data").params.forceaccessibility == '1') {
					// Check if media plugin is enabled.
					if (window.parent.tinyMCE.activeEditor.hasPlugin("tiny_media/plugin")) {
						let code = `
							function sketch_accessbility_open() {
								tinyMCE.activeEditor.selection.select($(tinyMCE.activeEditor.iframeElement).contents().find("img#" + "` + id + `")[0], true);
								$(tinyMCE.activeEditor.container).find("button[title='Image']").trigger("click");
								setTimeout(function () {
									$(".tox-pop").remove();
								}, 200);
							}
						`;
						$("#sketch_accessbility_script", top.document).remove();
						$("body", top.document).append($("<script />", {
							id: "sketch_accessbility_script",
							html: code,
						}))
						window.parent.sketch_accessbility_open();
					}
				}
				// Close window.
				$(".modal .close", top.document).click();
			}, 200);
        });
    }, 200);
  });

/**
 * Open image in Minipaint.
 *
 * @param {string|image} image image or image id
 */
function open_image(image){
	if(image == undefined)
		image = document.getElementById('testImage');
	if(typeof image == 'string'){
		image = document.getElementById(image);
	}
	var Layers = window.parent.document.getElementById('tinymce_sketch-iframe').contentWindow.Layers;
	var name = image.src.replace(/^.*[\\\/]/, '');
	var new_layer = {
		name: name,
		type: 'image',
		data: image,
		width: image.naturalWidth || image.width,
		height: image.naturalHeight || image.height,
		width_original: image.naturalWidth || image.width,
		height_original: image.naturalHeight || image.height,
	};
	Layers.insert(new_layer);
}
