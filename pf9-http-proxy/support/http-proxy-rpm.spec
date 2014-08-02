Name:		pf9-http-proxy
Version:	1.0.0
Release:	__BUILDNUM__.__GITHASH__
Summary:	Platform9 proxy server

Group:		pf9-http-proxy
License:	Commercial
URL:		http://www.platform9.net
BuildArch:  noarch

Provides:   pf9-http-proxy
Requires:   nodejs
Requires:   npm

%description
Platform9 HTTP-proxy for request routing

%prep

%build

%install
SRC_DIR=%_src_dir
HTTPPROXY_DIR=${RPM_BUILD_ROOT}/opt/pf9/pf9httpproxy
PF9_DIR=${RPM_BUILD_ROOT}/etc/pf9
INITD_DIR=${RPM_BUILD_ROOT}/etc/init.d
DU_CUSTOMIZE_DIR=${RPM_BUILD_ROOT}/opt/pf9/du-customize
mkdir -p $HTTPPROXY_DIR
cp $SRC_DIR/*.js $HTTPPROXY_DIR/
cp -r $SRC_DIR/requestHandlers $HTTPPROXY_DIR/
cp $SRC_DIR/package.json $HTTPPROXY_DIR/
mkdir -p $PF9_DIR
cp $SRC_DIR/sample/pf9HttpProxyConfig.json $PF9_DIR
mkdir -p $INITD_DIR
cp $SRC_DIR/support/pf9-http-proxy $INITD_DIR
mkdir -p $DU_CUSTOMIZE_DIR
cp $SRC_DIR/support/85-customize-httpproxy.sh $DU_CUSTOMIZE_DIR/

%clean
rm -rf ${RPM_BUILD_ROOT}

%files
%defattr(-,root,root,-)
/opt/pf9
/etc/init.d/pf9-http-proxy
/etc/pf9/pf9HttpProxyConfig.json
/opt/pf9/du-customize/85-customize-httpproxy.sh

%doc

%changelog
