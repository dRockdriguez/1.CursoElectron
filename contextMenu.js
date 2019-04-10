// Create app menu
module.exports = [{
        label: 'Edit',
        submenu: [
            { role: 'copy' },
            { role: 'paste' },
            {type: 'separator'},
            { role: 'undo'},
            {role: 'redo'}
        ]
    }]