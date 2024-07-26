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
 * Tiny Sketch commands.
 *
 * @module      tiny_sketch/commands
 * @copyright   2023 Matt Davidson <davidso1@rose-hulman.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';
import {getButtonImage} from 'editor_tiny/utils';
import {component, buttonName, icon} from './common';
import {SketchEmbed} from './embed';

export const getSetup = async() => {
    const isImage = (node) => node.nodeName.toLowerCase() === 'img';

    const [
        buttonText,
        buttonImage,
    ] = await Promise.all([
        getString('pluginname', component),
        getButtonImage('icon', component),
    ]);

    const handleSketchAction = (editor) => {
        const sketchImage = new SketchEmbed(editor);
        sketchImage.displayDialogue();
    };

    // Note: The function returned here must be synchronous and cannot use promises.
    // All promises must be resolved prior to returning the function.
    return (editor) => {
        // Register the Icon.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the Menu Button as a toggle.
        // This means that when highlighted over an existing image element it will show as toggled on.
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: buttonText,
            onAction: () => handleSketchAction(editor),
            onSetup: api => {
                return editor.selection.selectorChangedWithUnbind(
                    'img:not([data-mce-object]):not([data-mce-placeholder]),figure.image',
                    api.setActive
                ).unbind;
            }
        });

        // Add the Sketch Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: buttonText,
            onAction: () => handleSketchAction(editor),
        });

        editor.ui.registry.addContextToolbar(buttonName, {
            predicate: isImage,
            items: buttonName,
            position: 'node',
            scope: 'node'
        });

        editor.ui.registry.addContextMenu(buttonName, {
            update: () =>  '',
        });
    };
};
