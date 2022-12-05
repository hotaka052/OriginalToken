import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { responseCard } from './response-card';
import { DialogBody } from './dialog-body';
import { getSpaceUserList, createMessage } from './google-api-request';
import { sha256, encrypt, decrypto } from './utils';

@Injectable()
export class GoogleChatService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * @dev 送信者がsoarigのアカウントかを確認
   * @param event requestの送信者のオブジェクト
   */
  async checkSoarigUser(event: any) {
    const sender = event.message.sender;
    return (
      sender?.domainId === this.configService.get<string>('SOARIG_DOMAIN_ID')
    );
  }

  /**
   * @dev userがすでにコントラクトに登録しているかを確認
   * @param event requestの送信者のオブジェクト
   */
  async checkAccount(event: any): Promise<{ isRegister: boolean }> {
    // 送信者を取得
    const sender = event.message.sender;

    // コントラクトを作成
    const contract =
      this.configService.get<ethers.Contract>('soaTokenContract');

    // 名前をhash化したものをuserIdとして扱う
    const userId = sha256(sender.displayName);

    // コントラクトに登録されているかを確認
    const isRegister = await contract.checkExistAccount(userId);

    return { isRegister };
  }

  /**
   * @dev user情報の登録
   * @param event requestの送信者のオブジェクト
   */
  async register(event: any): Promise<{ text: string }> {
    // リクエストの送信者
    const sender = event.message.sender;

    // コントラクトを作成
    const contract =
      this.configService.get<ethers.Contract>('soaTokenContract');

    // 新しいwalletを作成
    const newWallet = ethers.Wallet.createRandom();
    const privateKey = newWallet.privateKey;
    const accountAddress = newWallet.address;

    // userIdの取得
    const userId = sha256(sender.displayName);

    // space情報を暗号化
    const encrypted = encrypt(event.space.name);

    // アカウントの登録
    await contract.registerAddress(userId, accountAddress, encrypted);

    // initialトークンの発行
    await contract.initialMint(accountAddress);

    return {
      text: `アカウントの作成を完了しました。 \n 秘密鍵：${privateKey}`,
    };
  }

  /**
   * @dev user情報の取得
   */
  async info(event: any): Promise<any> {
    // 情報を取得する対象のユーザーを取得
    const user = event.message.sender;

    // コントラクトを取得
    const contract =
      this.configService.get<ethers.Contract>('soaTokenContract');

    // ユーザーのetehreumアドレスを取得
    const address = await contract.getAddressFromUserId(
      sha256(user.displayName),
    );

    // 送信数
    const sendNum = Number(
      ethers.utils.formatEther(await contract.sendNum(address)),
    );

    // 受取数
    const receiveNum = Number(
      ethers.utils.formatEther(await contract.receiveNum(address)),
    );

    // 総数
    const balance = Number(
      ethers.utils.formatEther(await contract.balanceOf(address)),
    );

    return responseCard({ user, address, balance, sendNum, receiveNum });
  }

  /**
   * @dev トークンの送信
   */
  async send(event: any): Promise<any> {
    const spaceInfo = event.message.space;
    return {
      action_response: {
        type: 'DIALOG',
        dialog_action: {
          dialog: {
            body: DialogBody(await getSpaceUserList(spaceInfo)),
          },
        },
      },
    };
  }

  /**
   * @dev トークンの送信
   */
  async sendToken(event: any) {
    // トークンの送信量
    const sendNum = 1;

    // コントラクトを取得
    const contract =
      this.configService.get<ethers.Contract>('soaTokenContract');

    const sender = event.user;
    const inputs = event.common.formInputs;

    // 送信者のアドレスを取得
    const fromAddress = await contract.getAddressFromUserId(
      sha256(sender.displayName),
    );

    // 送り先相手のアドレスを取得
    const toAddress = await contract.getAddressFromUserId(
      sha256(inputs.to.stringInputs.value[0]),
    );

    // トークンの送信
    await contract.transferFrom(
      fromAddress,
      toAddress,
      ethers.utils.parseUnits(sendNum.toString()),
    );

    const message = {
      text: 'トークンの送信が完了しました',
    };

    const encrypted = await contract.spaceId(fromAddress);
    const space = decrypto(encrypted);
    await createMessage(space, message);
  }
}
