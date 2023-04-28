// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny Sketch configuration.
 *
 * @module      tiny_sketch/configuration
 * @copyright   2023 Matt Davidson <davidso1@rose-hulman.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    buttonName,
} from './common';
import uploadFile from 'editor_tiny/uploader';
import {
    addContextmenuItem,
} from 'editor_tiny/utils';

const configureMenu = (menu) => {
    // Add the Sketch icon to the end of the Tools menu.
    menu.tools.items += ` ${buttonName}`;

    return menu;
};

const configureToolbar = (toolbar) => {
    // The toolbar contains an array of named sections.
    // The Moodle integration ensures that there is a section called 'content'.

    return toolbar.map((section) => {
        if (section.name === 'content') {
            // Insert the image, and embed, buttons at the start of it.
            section.items.unshift(buttonName);
        }
        return section;
    });
};

export const configure = (instanceConfig) => {
    // Update the instance configuration to add the Media menu option to the menus and toolbars and upload_handler.
    return {
        contextmenu: addContextmenuItem(instanceConfig.contextmenu, buttonName),
        menu: configureMenu(instanceConfig.menu),
        toolbar: configureToolbar(instanceConfig.toolbar),

        // eslint-disable-next-line camelcase
        images_upload_handler: (blobInfo, progress) => uploadFile(
            window.tinymce.activeEditor,
            'image',
            blobInfo.blob(),
            blobInfo.filename(),
            progress
        ),

        // eslint-disable-next-line camelcase
        images_reuse_filename: true,
    };
};
