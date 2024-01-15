(async () => {
  const callButton = document.getElementById('call');
  const client = new vonageClientSDK.VonageClient();
  let callId = null;

  // トークンを取得してセッションを作成
  const response = await fetch('/get-token');
  const data = await response.json();
  const jwt = data.jwt;
  client.createSession(jwt)
  .then((sessionId) => {
    console.log(`🐞 Id of created session: ${sessionId}`);
    callButton.innerText = '発信する';
    callButton.disabled = false;        
  })
  .catch((error) => {
    console.error(error);
  });

  // 発信ボタンをクリックしたときの処理
  callButton.addEventListener('click', (async () => {
    if (callButton.innerText === '発信する') {
      callButton.innerText = '発信中...';
      callButton.disabled = true;
      client.serverCall()
      .then((_callId) => {
        callId = _callId;
        console.log(`🐞 Id of created call: ${callId}`);
        callButton.innerText = '切断する';
        callButton.disabled = false;
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      callButton.innerText = '切断中...';
      callButton.disabled = true;
      await client.hangup(callId);
      callButton.innerText = '発信する';
      callButton.disabled = false;
    }
  }));

  // 切断されたときの処理
  client.on('callHangup', (callId, callQuality, reason) => {
    console.log(`🐞 Call hangup: ${callId}, callQuality: ${callQuality}, reason: ${reason}`);
    if (callButton.innerText !== '発信する') {
      callButton.innerText = '発信する';
      callButton.disabled = false;
    }
  });

})();