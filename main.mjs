import { PAY } from "./api.mjs";
import { sleep, getRandomInt } from "./utils.mjs";

// 财大e卡小程序中的支付密码
const PASSWORD = "888888";
// headers中的 'synjones-auth'
const synjones_auth = "bearer fawegfewggerh.gregregegrehbre.gregergehberbre";
// headers中的 'Authorization'
const Authorization = "Basic gregerhgerhbterhnbrt=";
// third_party 用户信息
const user_third_party = {
  accountId: 123, // number
  telPhone: "16811112222", // string. 趣智校园的手机号
  sex: "女", // string
  name: "湾区一流", // string. 趣智校园的用户名
  myCustomInfo: "16811112222", // string. 一般为手机号
};

const pay = new PAY("POST", synjones_auth, Authorization);

let MONEY;

const newOrder = () => {
  let body = `feeitemid=7&tranamt=${String(
    MONEY
  )}&flag=choose&source=app&paystep=0&abstracts=&third_party=`;

  const third_party = encodeURI(
    JSON.stringify({
      ...{
        // 以下参数具体作用不详
        projectId: 3288,
        projectName: "广东财经大学",
        identifier: "null",
        statusId: 0,
        // accountMoney: 3003, // 趣智校园账户当前余额，因为懒得再写一个代码去查询，所以省略掉。
        accountGivenMoney: 0,
        alias: null,
        tags: null,
        isCard: 0,
        cardStatusId: -1,
        cardPhysicalId: null,
        isUseCode: 0,
      },
      ...user_third_party,
    })
  );

  body += third_party;

  return pay.post(body).then((res) => {
    const data = res.data;
    const { paystep, orderid, payList } = data;
    return { paystep, orderid, payList };
  });
};

// 获取 passwordMap
const getMap = (newOrderRes = {}) => {
  const { paystep, orderid, payList } = newOrderRes;
  const { id, pay_type_code } = payList[0];
  const body = `paytypeid=${id}&paytype=${pay_type_code}&paystep=${paystep}&orderid=${orderid}`;

  return pay.post(body).then((res) => {
    const data = res.data;
    const { paystep, ccctype, passwordMap } = data;
    return { paystep, orderid, payList, ccctype, passwordMap };
  });
};

// 根据 passwordMap 映射密码
const reflectPassword = (password = "", passwordMap = {}) => {
  if (typeof password != "string") {
    password = String(password);
  }
  const mask = Object.values(passwordMap)[0];
  let res = "";
  for (const x of password) {
    res += String(mask.indexOf(x));
  }
  return res;
};

// 完成支付
const checkout = (getMapData = {}) => {
  const { paystep, orderid, payList, ccctype, passwordMap } = getMapData;
  const { id, pay_type_code } = payList[0];
  console.info("balance:", ccctype[0].balance);

  const body = `orderid=${orderid}&paystep=${paystep}&paytype=${pay_type_code}&paytypeid=${id}&userAgent=wechat-mp&ccctype=${
    ccctype[0].ccctype
  }&password=${reflectPassword(PASSWORD, passwordMap)}&uuid=${
    Object.keys(passwordMap)[0]
  }&isWX=1`;

  return pay.post(body).then((res) => {
    const data = res.data;
    console.log(res);
  });
};

const loop = async () => {
  const total_money = 0.3; // 总充值金额
  const max_delay = 2; // 每次 操作/并发 之间的最大延时
  const concurrency = 1; // 并发数
  MONEY = 0.01; // 单次充值金额

  const max_num = total_money / MONEY; // 最大运行次数
  let count = 0;

  while (count < max_num) {
    console.debug("loop", count);
    const ls = [];
    for (let i = 0; i < concurrency; i++) {
      ls.push(
        new Promise(async (resolve, reject) => {
          const newOrderRes = await newOrder();
          // console.log(newOrderRes.orderid, newOrderRes.passwordMap);
          const getMapData = await getMap(newOrderRes);
          // console.log(getMapData);
          const checkoutData = await checkout(getMapData);
          resolve();
        })
      );
      count += 1;
    }
    await Promise.all(ls);

    const R = getRandomInt(max_delay * 1000);
    console.log("sleep", R);
    console.log();
    await sleep(R);
  }
};

loop();
