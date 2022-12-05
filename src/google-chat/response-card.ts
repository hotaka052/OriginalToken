export const responseCard = ({
  user,
  address,
  balance,
  sendNum,
  receiveNum,
}) => ({
  cardsV2: [
    {
      cardId: 'soa-original-card',
      card: {
        header: {
          title: user.displayName,
          subtitle: user.email,
          imageUrl: user.avatarUrl,
          imageType: 'CIRCLE',
          imageAltText: 'Avatar for Sasha',
        },
        sections: [
          {
            header: 'Contact Info',
            widgets: [
              {
                textParagraph: {
                  text: `公開鍵：${address}`,
                },
              },
              {
                textParagraph: {
                  text: `トークン数：${balance} SOA`,
                },
              },
              {
                textParagraph: {
                  text: `送信数：${sendNum} SOA`,
                },
              },
              {
                textParagraph: {
                  text: `受信数：${receiveNum} SOA`,
                },
              },
            ],
          },
        ],
      },
    },
  ],
});
