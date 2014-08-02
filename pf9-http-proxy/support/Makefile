#
# Copyright (c) 2014 Platform9 Systems, Inc.
#

TOP_DIR := $(abspath ..)
SRC_DIR := $(TOP_DIR)
BUILD_DIR := $(TOP_DIR)/build

VERSION ?= 1.0.0
BUILD_NUMBER ?= 0
HTTPPROXY_RPM := $(BUILD_DIR)/pf9-http-proxy-$(VERSION).rpm
RPM_DIR := $(BUILD_DIR)/rpmbuild
SPEC_FILE := $(BUILD_DIR)/rpm.spec

${BUILD_DIR}:
	mkdir -p $@

${SPEC_FILE}: ${BUILD_DIR}
	hash=`git rev-parse --short HEAD`; \
	sed -e "s/__BUILDNUM__/${BUILD_NUMBER}/" -e "s/__GITHASH__/$${hash}/" $(SRC_DIR)/support/http-proxy-rpm.spec > ${SPEC_FILE}

${HTTPPROXY_RPM}: ${SPEC_FILE}
	echo "RPM build goes here"
	echo "SRC_DIR: $(SRC_DIR)"
	echo "BUILD_DIR: $(BUILD_DIR)"
	echo "RPM_DIR: $(RPM_DIR)"
	rpmbuild -bb --define "_topdir $(RPM_DIR)" --define "_src_dir $(SRC_DIR)" ${SPEC_FILE}

unit-test:
	cd $(TOP_DIR)/test; \
	/bin/sh testScript.sh

rpm: ${HTTPPROXY_RPM}

clean:
	rm -rf $(BUILD_DIR)
