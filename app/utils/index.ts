const { chromium } = require("playwright");

const excuteScreenShot = async (page, num) => {
  await page.screenshot({ path: "example" + num + ".png" });
};

interface LoginVo {
  no: String,
  userName: String,
  pwd: String,
}

const excuteLogin = async (page, loginInfo: LoginVo) => {
  // 跳转登录页
  await page.getByText("登录").click();

  // "915101070988989038"
  await page
    .getByPlaceholder("统一社会信用代码/纳税人识别号")
    .fill(loginInfo.no);
  // ("413028197612077218"
  await page
    .getByPlaceholder("居民身份证号码/手机号码/用户名")
    .fill(loginInfo.userName);
  // "12366@Dzswj"
  await page
    .getByPlaceholder("个人用户密码(初始密码为证件号码后六位)")
    .fill(loginInfo.pwd);

  // 滑块滑动
  let sliderElement = await page.waitForSelector(".drag");
  // let sliderElement = await page.$(".drag");
  let slider = await sliderElement.boundingBox();

  let sliderHandle = await page.$(".handler");
  let handle = await sliderHandle.boundingBox();

  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(handle.x + slider.width, handle.y + handle.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  await page.getByRole("button", { name: "登录" }).click();

  await fillVerificationCode(page, "123456");
  // 选择法定代表人
  await page.getByRole("button", { name: "确认" }).click();
};

const fillVerificationCode = async (page, code) => {
  // 填写验证码
  await page.getByRole("button", { name: "获取验证码" }).click();
  await page.getByPlaceholder("请输入短信验证码").fill(code);
  await page.getByRole("button", { name: "登录" }).click();
}

const excuteOpen = async (page) => {
  setTimeout(async () => {
    await page.goto(
      "https://dppt99.sichuan.chinatax.gov.cn:8443/blue-invoice-makeout"
    );
    await page.locator("div").filter({ hasText: "立即开票" }).nth(1).click();
    await page
      .locator("form")
      .filter({
        hasText:
          "电子发票 纸质发票选择票类特定业务差额征税减按征税减按政策说明",
      })
      .locator("svg")
      .first()
      .click();
    await page
      .getByRole("listitem")
      .filter({ hasText: "增值税专用发票" })
      .click();
    await page
      .locator("div")
      .filter({ hasText: "选择票类特定业务" })
      .getByPlaceholder("请选择（非必选项）")
      .click();
    await page.getByRole("listitem").filter({ hasText: "稀土" }).click();
    await page.locator("div").filter({ hasText: "立即开票" }).nth(1).click();

    // 填写表单信息
    await page.locator(".t-input__inner").first().fill("测试开票");
    await page
      .locator(
        "div:nth-child(2) > .t-form__controls > .t-form__controls-content > span > .t-input__wrap > .t-input > .t-input__inner"
      )
      .fill("500123455678");
    await page
      .locator(".xmmc_handle > .t-input__wrap > .t-input > .t-input__inner")
      .fill("*稀土冶炼分离产品*醋酸富镝");
    await page
      .locator(
        ".t-table__ellipsis > .t-input__wrap > .t-input > .t-input__inner"
      )
      .fill("2");
    await page
      .locator(".t-input-number > .t-input__wrap > .t-input > .t-input__inner")
      .first()
      .fill("3");
    await page
      .locator(
        "td:nth-child(7) > .t-table__ellipsis > .t-input-number > .t-input__wrap > .t-input > .t-input__inner"
      )
      .fill("116");
    await page.getByRole("button", { name: "发票开具" }).click();
  }, 1000);
};

const initTask = async () => {
  // const browser = await chromium.launch();
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  // Create pages, interact with UI elements, assert values
  const page = await context.newPage();
  await page.goto("https://etax.sichuan.chinatax.gov.cn:5100/");

  const page2 = await context.newPage();
  await page2.goto("https://tpass.sichuan.chinatax.gov.cn:8443/#/login");

  let num = 0;
  await excuteScreenShot(page, num++);

  // setInterval(async () => {
  //   await excuteScreenShot(page, num++);
  // }, 10000);

  await excuteLogin(page, {
    no: '915101070988989038',
    userName: '413028197612077218',
    pwd: '12366@Dzswj',
  });

  // await page.reload();
  // 跳转开票页面
  // await page.locator("a").filter({ hasText: "蓝字发票开具" }).first().click();

  // 蓝字开票
  await excuteOpen(page);

  // await browser.close();
};

export default {
  initTask,
  excuteLogin,
  excuteOpen,
};
