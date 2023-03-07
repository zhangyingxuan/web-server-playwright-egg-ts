import { EggLogger } from 'egg';
import { SingletonProto, AccessLevel, Inject } from '@eggjs/tegg';
import utils from '@/utils/index'

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
export class CommonService {
  // 注入一个 logger
  @Inject()
  logger: EggLogger;

  // 封装业务
  async login(userId: string): Promise<string> {
    // 调用登录逻辑，根据url 判断是否登录成功
    const result = { userId, handledBy: 'foo module' };
    this.logger.info('[hello] get result: %j', result);
    utils.initTask();
    return `hello, ${result.userId}`;
  }
}
