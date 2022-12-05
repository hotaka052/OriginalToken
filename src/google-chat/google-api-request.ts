// eslint-disable-next-line
const { google } = require('googleapis');

/**
 * spaceにいるユーザーのリストを取得
 */
export const getSpaceUserList = async (space: any) => {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.CLOUD_KEY),
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  });

  const chat = google.chat({
    version: 'v1',
    auth: auth,
  });

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
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.CLOUD_KEY),
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  });

  const chat = google.chat({
    version: 'v1',
    auth: auth,
  });

  await chat.spaces.messages.create({
    parent: space,
    requestBody: message,
  });
};
