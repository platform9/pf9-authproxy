Name:           pf9-authproxy
Version:        1.0.0
Release:        1
Summary:        Platform9 Clarity UI

License:        Commercial
URL:            http://www.platform9.net

AutoReqProv:    no

Provides:       pf9-authproxy
Requires:       nodejs
Requires:       nodejs-request
Requires:       openstack-keystone

BuildArch:      noarch
Group:          pf9-authproxy

%description
Platform9 Authentication Proxy

%prep

%build

%install
SRC_DIR=%_src_dir  # pf9-authproxy
AUTHPROXY_DIR=${RPM_BUILD_ROOT}/opt/pf9/authproxy
INITD_DIR=${RPM_BUILD_ROOT}/etc/init.d
DU_CUSTOMIZE_DIR=${RPM_BUILD_ROOT}/opt/pf9/du-customize
mkdir -p $AUTHPROXY_DIR
cp $SRC_DIR/*.js $AUTHPROXY_DIR/
cp -r $SRC_DIR/node_modules $AUTHPROXY_DIR/
mkdir -p $INITD_DIR
cp $SRC_DIR/support/pf9-authproxy $INITD_DIR/
mkdir -p $DU_CUSTOMIZE_DIR
cp $SRC_DIR/support/80-customize-authproxy $DU_CUSTOMIZE_DIR/
%clean
rm -rf ${RPM_BUILD_ROOT}

%files
%defattr(-,root,root,-)
/opt/pf9
/etc/init.d/pf9-authproxy

%post

%preun

%postun

%changelog
