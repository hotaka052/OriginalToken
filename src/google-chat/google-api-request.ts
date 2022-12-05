// eslint-disable-next-line
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './cloud-original-token-key.json',
  scopes: ['https://www.googleapis.com/auth/chat.bot'],
});

const chat = google.chat({
  version: 'v1',
  auth: auth,
});

/**
 * spaceにいるユーザーのリストを取得
 */
export const getSpaceUserList = async (space: any) => {
  const { data } = await chat.spaces.members.list({ parent: space.name });

  const userList = data.memberships.map((user: any) => ({
    text: user.member.displayName,
    value: user.member.displayName,
    selected: false,
  }));

  return userList;
};

/**
 * メッセージの作成
 */
export const createMessage = async (space: any, message: any) => {
  await chat.spaces.messages.create({
    parent: space,
    requestBody: message,
  });
};
