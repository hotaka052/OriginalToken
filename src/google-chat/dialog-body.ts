export const DialogBody = (itemList: any) => ({
  sections: [
    {
      header: '送信する相手を選んでください。',
      widgets: [
        {
          selectionInput: {
            name: 'to',
            label: 'トークンの送信先',
            type: 'DROPDOWN',
            items: itemList,
          },
        },
        {
          buttonList: {
            buttons: [
              {
                text: '送信',
                onClick: {
                  action: {
                    function: 'confirmDialogSuccess',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  ],
});
