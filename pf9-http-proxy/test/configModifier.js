var stdio = require('stdio');
var nconf = require('nconf');

nconf.file({ file: '/etc/pf9/pf9HttpProxyConfig.json' });

var ops = stdio.getopt({
    'logPath': {key: 'P', args: 1, description: 'sets the path of the log file for the proxy server'},
    'logLevel': {key: 'L', args: 1, description: 'sets the level for the log (default is info)'},
    'globalPath': {key: 'G', args: 1, description: 'sets the path of the global.conf file to read'},
    'logTarget': {key: 'T', args: 1, description: 'sets the target for the event logs (mixpanel/file)'},
    'mixpanelToken': {key: 't', args: 1, description: 'sets the project token for the mixpanel'},
    'filePath': {key: 'F', args: 1, description: 'sets the path of the file to which events have to be logged'},
    'port': {key: 'p', args: 1, description: 'sets the listening port for the proxy server'},
    'testData': {key: 'D', args: 1, description: 'sets the input test data file for testing'},
    'keystoneUrl': {key: 'k', args: 1, description: 'sets the forwarding URL for the keystone request'},
    'novaUrl': {key: 'n', args: 1, description: 'sets the forwarding URL for the nova request'},
    'glanceUrl': {key: 'g', args: 1, description: 'sets the forwarding URL for the glance request'},
    'resmgrUrl': {key: 'r', args: 1, description: 'sets the forwarding URL for the resmgr request'},
    'serverOn': {key: 's', args: 1, description: 'sets the test number at which server needs to be started (index from 0)'}
});

configure();
function configure() {

    nconf.set('log:logPath', ops.logPath || '/var/log/pf9-http-proxy/pf9-http-proxy.log');
    nconf.set('log:logLevel', ops.logLevel || 'info');
    nconf.set('global:path', ops.globalPath || '/etc/pf9/global.conf');
    nconf.set('events:logTarget', ops.logTarget || 'mixpanel');
    nconf.set('events:mixpanelProjectToken', ops.mixpanelToken || '91ab0c153f5127466c2e04229e60b3a4');
    nconf.set('events:outputFilePath', ops.filePath || '/var/log/pf9-http-proxy/events.json');
    nconf.set('default:port', ops.port || '9637');
    nconf.set('test:testData', ops.testData || '/source/pf9-authproxy/pf9-http-proxy/test/testData.js');
    nconf.set('keystone:url', ops.keystoneUrl || 'http://127.0.0.1:5000');
    nconf.set('nova:url', ops.novaUrl || 'http://127.0.0.1:8774');
    nconf.set('glance:url', ops.glanceUrl || 'http://127.0.0.1:9292');
    nconf.set('resmgr:url', ops.resmgrUrl || 'http://127.0.0.1:8083');
    nconf.set('test:serverOn', ops.serverOn || '0');

    nconf.save(function (err) {});
}
