class PAY {
  url = "https://cardsp.gdufe.edu.cn/blade-pay/pay";
  headers = {
    Host: "cardsp.gdufe.edu.cn",
    Connection: "keep-alive",
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://cardsp.gdufe.edu.cn",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    Referer: "https://cardsp.gdufe.edu.cn/charge-app/",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };
  method = "POST";
  body = "";
  option = {
    method: this.method,
    headers: this.headers,
    body: this.body,
  };
  constructor(method = "POST", synjones_auth, Authorization, UA) {
    this.method = method;
    this.headers["synjones-auth"] = synjones_auth;
    this.headers["Authorization"] = Authorization;
    this.headers["User-Agent"] =
      UA ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a1b)XWEB/9165";
  }
  post(body, headers, option = {}) {
    return (
      fetch(this.url, {
        method: this.method,
        headers: this.headers,
        body: body,
      })
        .then((response) => response.json())
        // .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error:", error);
          throw error;
        })
    );
  }
}

export { PAY };
