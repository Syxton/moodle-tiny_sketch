/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function () {
    // Load plugin specific language pack.
    tinymce.PluginManager.requireLangPack('sketch');

    // Initialize plugin.
    tinymce.create('tinymce.plugins.AddSketchButton', {
        init: function (ed, url) {
            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample').
            ed.addCommand('mceSketch', function () {
                ed.windowManager.open({
                    file: ed.getParam('moodle_plugin_base') + 'sketch/tinymce/sketch.html',
                    width: document.documentElement.scrollWidth,
                    height: document.documentElement.clientHeight - 30,
                    inline: true,
                    resizable: false
                }, {
                    plugin_url: url, // Plugin absolute URL.
                });
            });

            // Register example button.
            ed.addButton('sketch', {
                title: ed.getParam('sketchdescription'),
                cmd: 'mceSketch',
                image: url + '/img/icon.png'
            });

            // Add a node change handler, selects the button in the UI when a image is selected.
            ed.onNodeChange.add(function (ed, cm, n) {
                cm.setActive('sketch', n.nodeName == 'IMG');
            });
        },

        // Returns creator and version info about plugin.
        getInfo: function () {
            return {
                longname: ed.getParam('sketchlongdescription'),
                author: 'Matt Davidson',
                version: "1.0"
            };
        }
    });

    // Register plugin.
    tinymce.PluginManager.add('sketch', tinymce.plugins.AddSketchButton);
})();
