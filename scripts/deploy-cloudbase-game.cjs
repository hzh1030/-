// Deploy only into the existing free environment. Credentials stay in the CLI profile.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const runtime = path.join(root, '.sites-runtime');
const CloudBase = require(path.join(runtime, 'tooling/cloudbase-manager/node_modules/@cloudbase/manager-node'));
const envId = 'hzh1030-d2gewomfcc0f183ad';
const origin = 'https://hzh1030-d2gewomfcc0f183ad-1500413737.ap-shanghai.app.tcloudbase.com';
const serverName = 'werewolf';

async function main() {
  const {credential: c} = JSON.parse(fs.readFileSync(path.join(runtime, 'cloudbase-profile/.config/.cloudbase/auth.json'), 'utf8'));
  const cloud = new CloudBase({envId, region: 'ap-shanghai', secretId: c.tmpSecretId, secretKey: c.tmpSecretKey, token: c.tmpToken});
  const billing = (await cloud.env.describeBillingInfo({EnvId: envId})).EnvBillingInfoList.find(item => item.EnvId === envId);
  if (!billing || billing.PackageId !== 'baas_trial' || billing.EnableOverrun || billing.IsAutoRenew) {
    throw new Error('Deployment stopped: the existing zero-cost plan could not be verified.');
  }
  const action = process.argv[2] || 'deploy';
  if (action === 'routes') {console.log(JSON.stringify(await cloud.env.describeHttpServiceRoute({EnvId: envId}))); return;}
  if (action === 'origin') {
    const detail = await cloud.cloudrun.detail({serverName});
    const vars = {...JSON.parse(detail.ServerConfig.EnvParams || '{}'), PUBLIC_ORIGIN: origin};
    const {parseObjectToDiffConfigItem} = require(path.join(runtime, 'tooling/cloudbase-manager/node_modules/@cloudbase/manager-node/lib/cloudrun'));
    const result = await cloud.commonService('tcbr', '2022-02-17').call({Action: 'SubmitServerConfigChangeDiff', Param: {EnvId: envId, ServerName: serverName, Items: parseObjectToDiffConfigItem({EnvParams: JSON.stringify(vars)})}});
    console.log(JSON.stringify({originUpdated: origin, result})); return;
  }
  if (action === 'route') {
    const domain = new URL(origin).hostname;
    const current = await cloud.env.describeHttpServiceRoute({EnvId: envId});
    if (!current.Domains?.some(item => item.Domain === domain)) throw new Error('Website domain not found in the existing HTTP gateway.');
    const existing = current.Domains.find(item => item.Domain === domain);
    const routeMethod = existing.Routes?.length ? 'modifyHttpServiceRoute' : 'createHttpServiceRoute';
    const result = await cloud.env[routeMethod]({EnvId: envId, Domain: {Domain: domain, Routes: [{
      Path: '/', UpstreamResourceType: 'STATIC_STORE', UpstreamResourceName: 'staticstore',
      EnableAuth: false, EnableSafeDomain: false, EnablePathTransmission: false, Enable: true,
    }, {
      Path: '/game', UpstreamResourceType: 'CBR', UpstreamResourceName: serverName,
      EnableAuth: false, EnableSafeDomain: false, EnablePathTransmission: true, Enable: true,
    }]}});
    console.log(JSON.stringify({gameRouteConfigured: true, domain, result})); return;
  }
  const status = await cloud.commonService('tcbr', '2022-02-17').call({Action: 'DescribeEnvBaseInfo', Param: {EnvId: envId}});
  const state = status.Response || status;
  if (action === 'status') {console.log(JSON.stringify(state)); return;}
  if (!state.IsExist) {
    if (action !== 'init') throw new Error('Cloud hosting is not initialized. Run the free-plan init action first.');
    const result = await cloud.commonService('tcbr', '2022-02-17').call({Action: 'CreateCloudRunEnv', Param: {EnvId: envId, EnvType: 'baas', PackageType: 'Trial'}});
    console.log(JSON.stringify({initializing: true, envId, result}));
    return;
  }
  if (action === 'init') {console.log(JSON.stringify({alreadyInitialized: true, envId, status: state.EnvBaseInfo?.Status})); return;}
  if (action !== 'deploy') throw new Error('Unknown action.');
  if (state.EnvBaseInfo?.Status !== 'normal') throw new Error('Cloud hosting is still initializing.');
  const serverConfig = {
    Cpu: 0.25, Mem: 0.5, MinNum: 0, MaxNum: 1, Port: 9000,
    OpenAccessTypes: ['PUBLIC'], Dockerfile: 'Dockerfile',
    EnvParams: JSON.stringify({PUBLIC_ORIGIN: origin, PORT: '9000'}),
    CustomLogs: 'stdout', InitialDelaySeconds: 5,
    PolicyDetails: [{PolicyType: 'cpu', PolicyThreshold: 80}],
    InstallDependency: false,
  };
  console.log(JSON.stringify({envId, serverName, package: billing.PackageId, expiry: billing.ExpireTime, serverConfig}));
  const result = await cloud.cloudrun.deploy({serverName, targetPath: path.join(root, 'deploy/cloudbase/functions/werewolf'), serverConfig, deployInfo: {ReleaseType: 'FULL'}});
  fs.writeFileSync(path.join(runtime, 'qa/cloudbase-game-deploy-submission.json'), JSON.stringify({envId, serverName, serverConfig, result}, null, 2));
  console.log(JSON.stringify({submitted: true, requestId: result.RequestId}));
}
main().catch(error => {console.error(JSON.stringify({error: error.message, code: error.code, requestId: error.requestId})); process.exitCode = 1;});
