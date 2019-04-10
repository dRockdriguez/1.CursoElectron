// Create app menu
module.exports = [{
    label: 'Electron',
    submenu: [
      {
        label: 'Item1'
      },
      {
        label: 'Item2'
      }
    ]
  }, {
    label: 'Actions',
    submenu: [
      {
        label: 'Action1',
        click: () => {
            console.log('click action1')
        },
        accelerator: 'Shift+Alt+G',
        submenu: [
            {
                label: 's1'
            },
            {
                label: 's2'
            }
        ]
      },
      {
        label: 'Action3',
        role: 'toggledevtools'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
    {
        label: 'Edit',
        submenu: [
            { role: 'copy' },
            { role: 'paste' }
        ]
    }]