# Vonage Click to call

Vonage Voice SDK を使って Click to Call を行うサンプルプログラムです。

## 必要なもの

- Vonageアカウント
- 発信用電話番号（Vonageダッシュボードから購入）
- Vonage CLI
- Node.js環境（Ver.18以上）
- yarn（npmでも可）
- ngrok

## プログラムのダウンロード

```zsh
git clone https://github.com/mobilebiz/vonage-click-to-call.git
cd vonage-click-to-call
yarn install
```

## アプリケーションの準備

以下の手順で、アプリケーションを作成していきます。

### Vonage CLI の設定

```zsh
vonage config:set --apiKey=YOUR_API_KEY --apiSecret=YOUR_API_SECRET
```

### アプリケーションの作成

URLについては、ngrokで発行するURLを利用します。そのため、現時点でわからない場合はngrokを実行したときに Vonage API ダッシュボードから変更してください。

```zsh
vonage apps:create "Vonage Click to call" --voice_answer_url=https://example.com/webhooks/answer --voice_event_url=https://example.com/webhooks/event
```

作成されたアプリケーションのIDが表示されるのでメモしておきます。

### 秘密鍵の設定

アプリケーションが作成されると、フォルダ内に`voange_app.json`と`vonage_click_to_call.key`が作成されますので、`vonage_click_to_call.key`を`private.key`という名前に変更しておきます。

```zsh
mv my_sample_app.key private.key
```

### ユーザーの作成

Voice Client で利用するために、アプリケーション内にユーザーを作成しておく必要があります。今回は、`supportuser`という名前でユーザーを作成します。

```zsh
vonage apps:users:create supportuser
```

## 環境変数の設定

`.env.sample`を`.env`という名前に変更します。

```zsh
mv .env.sample .env
```

`.env`をエディタで開き、値を設定していきます。

Key|Value
:--|:--
APPLICATION_ID|先ほど作成したアプリケーションのIDを指定します。
PORT|プログラムの待ち受けポートを指定します。デフォルトは`3000`です。
FROM_NUMBER|Vonageで購入した発信用の番号を指定します。日本の番号は、先頭に`81`を指定し、先頭の`0`を削除します。例：08012345678→818012345678
TO_NUMBER|発信先の電話番号を指定します。指定方法は、FROM_NUMBERと同じです。

## サーバーの起動

### プログラムの起動

以下のコマンドで、設定したポートでローカルでプログラムが起動します。

```zsh
yarn start
```

### ngrok の起動

外部からアクセスできるように、ngrokでプログラムを公開します。

```zsh
ngrok http 3000
```

ポート番号を変更した場合やサブドメインを持っている方は、コマンドを適宜変更してください。

## アプリケーションの設定変更

ngrokで払い出されたURLで、アプリケーション設定を更新します。`YOUR_APP_ID`には、アプリケーションのID、`YOUR_NGROK_URL`には、ngrokで払い出されたURLを指定してください。

```zsh
vonage apps:update YOUR_APP_ID --voice_answer_url=https://YOUR_NGROK_URL/answer --voice_event_url=https://YOUR_NGROK_URL/event
```

## テスト

ブラウザでngrokで払い出されたURLを開きます。  
`発信する`のボタンを押すと、「発信します。しばらくお待ち下さい。」というガイダンスが流れて、指定した電話番号に発信が行われます。
