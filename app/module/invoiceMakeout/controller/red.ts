import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, HTTPQuery } from '@eggjs/tegg';
import { CommonService } from '@/module/common';

@HTTPController({
  path: '/red',
})
export class RedController {
  @Inject()
  commonService: CommonService;

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'user',
  })
  async user(@HTTPQuery({ name: 'userId' }) userId: string) {
    return await this.commonService.login(userId);
  }
}
