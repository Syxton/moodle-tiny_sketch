$(document).ready(function() {
    setTimeout(function() {
        var selected = window.parent.tinyMCE.activeEditor.selection.getNode();
        if (selected.tagName == "IMG") {
            var image = new Image();
            image.crossOrigin = "anonymous";
            image.src = selected.src;
            var iframeBody = $(frameElement);
            var sketchcontent = iframeBody.contents()[0].defaultView;
            var Layers = sketchcontent.Layers;
            var name = image.src.replace(/^.*[\\\/]/, '');
            var new_layer = {
                name: name,
                type: 'image',
                data: image,
                width: image.naturalWidth || selected.width,
                height: image.naturalHeight || selected.height,
                width_original: image.naturalWidth || selected.width,
                height_original: image.naturalHeight || selected.height,
            };
            Layers.insert(new_layer);
        }

        $('.sketchsubmit').click(function(e) {
            e.preventDefault();

            var dataURI = $('#canvas_minipaint')[0].toDataURL();

            if (window.parent.tinyMCE.activeEditor.getParam('storeinrepo')) { // Setting to upload as image file.
                // Convert base64/URLEncoded data component to raw binary data held in a string.
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(dataURI.split(',')[1]);
                } else {
                    byteString = unescape(dataURI.split(',')[1]);
                }

                // Separate out the mime component.
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // Write the bytes of the string to a typed array.
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                var sketchimage = new Blob([ia], {type: mimeString});

                // Only handle the event if an image file was dropped in.
                var handlesDataTransfer = (sketchimage && sketchimage.size && sketchimage.type == 'image/png');
                if (handlesDataTransfer) {
                    var host = parent.tinyMCE.activeEditor.editorId,
                    options = parent.M.editor_tinymce.filepicker_options[host].image,
                    savepath = (options.savepath === undefined) ? '/' : options.savepath,
                    formData = new FormData(),
                    timestamp = 0,
                    uploadid = "",
                    xhr = new XMLHttpRequest(),
                    imagehtml = "",
                    keys = Object.keys(options.repositories);

                    e.preventDefault();
                    e.stopPropagation();
                    formData.append('repo_upload_file', sketchimage);
                    formData.append('itemid', options.itemid);

                    // List of repositories is an object rather than an array.  This makes iteration more awkward.
                    for (var i = 0; i < keys.length; i++) {
                        if (options.repositories[keys[i]].type === 'upload') {
                            formData.append('repo_id', options.repositories[keys[i]].id);
                            break;
                        }
                    }
                    formData.append('env', options.env);
                    formData.append('sesskey', parent.M.cfg.sesskey);
                    formData.append('client_id', options.client_id);
                    formData.append('savepath', savepath);
                    formData.append('ctx_id', options.context.id);

                    // Kick off a XMLHttpRequest.
                    xhr.onreadystatechange = function() {
                        var result,
                            file,
                            newhtml,
                            newimage;

                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                result = JSON.parse(xhr.responseText);
                                if (result) {
                                    if (result.error) {
                                        return new parent.M.core.ajaxException(result);
                                    }

                                    file = result;
                                    if (result.event && result.event === 'fileexists') {
                                        // A file with this name is already in use here - rename to avoid conflict.
                                        // Chances are, it's a different image.
                                        // If the user wants to reuse an existing image, they can copy/paste it.
                                        file = result.newfile;
                                    }

                                    // Replace placeholder with actual image.
                                    newhtml = '<img src="'+file.url+'" />';
                                    newimage = window.parent.Y.Node.create(newhtml);

                                    var ed = tinyMCEPopup.editor, v, args = {}, el;
                                    tinyMCEPopup.restoreSelection();

                                    // Fixes crash in Safari.
                                    if (tinymce.isWebKit) {
                                        ed.getWin().focus();
                                    }

                                    tinymce.extend(args, {
                                        src : file.url.replace(/ /g, '%20')
                                    });

                                    args.onmouseover = args.onmouseout = '';

                                    el = ed.selection.getNode();

                                    if (el && el.nodeName == 'IMG') {
                                        ed.dom.setAttribs(el, args);
                                    } else {
                                        tinymce.each(args, function(value, name) {
                                            if (value === "") {
                                                delete args[name];
                                            }
                                        });

                                        ed.execCommand('mceInsertContent',
                                                        false,
                                                        tinyMCEPopup.editor.dom.createHTML('img', args),
                                                        {skip_undo : 1});
                                        ed.undoManager.add();
                                    }

                                    tinyMCEPopup.editor.execCommand('mceRepaint');
                                    tinyMCEPopup.editor.focus();
                                    tinyMCEPopup.close();
                                }
                            } else {
                                Y.use('moodle-core-notification-alert', function() {
                                    new parent.M.core.alert({message: parent.M.util.get_string('servererror', 'moodle')});
                                });
                            }
                        }
                        return true;
                    };
                    xhr.open("POST", parent.M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', true);
                    xhr.send(formData);
                    return true;
                }
                return true;
            } else { // Insert as Base64 encoded DataURI.
                window.parent.tinyMCE.activeEditor.execCommand('mceInsertContent', 0, '<img src="'+dataURI+'" />');
                tinyMCEPopup.close();
            }
        });

        $('div[role="dialog"]',parent.document).css('position', 'fixed');
        $('div[role="dialog"]',parent.document).css('top', 0)
        $('div[role="dialog"]',parent.document).css('left', 0);

        $('div[role="dialog"]',parent.document).css('height', 'calc(100% - 0px)');
        $('div[role="dialog"]',parent.document).css('width', 'calc(100% - 0px)');

        $('div[role="dialog"] iframe',parent.document).css('height', 'calc(100% - 30px)');
        $('div[role="dialog"] iframe',parent.document).css('width', '100%');
    }, 500);
  });