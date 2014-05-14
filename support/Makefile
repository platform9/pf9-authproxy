#! vim noexpandtab
# Copyright (C) 2013 Platform 9 Systems, Inc.
#

TOP_DIR := $(abspath ..)
SRC_DIR := $(TOP_DIR)
BUILD_DIR := $(TOP_DIR)/build

VERSION ?= 1.0.0
BUILD_NUMBER ?= 0
AUTHPROXY_RPM := $(BUILD_DIR)/pf9-authproxy-$(VERSION).rpm
RPM_DIR := $(BUILD_DIR)/rpmbuild
SPEC_FILE := $(BUILD_DIR)/rpm.spec

${BUILD_DIR}:
	mkdir -p $@

${SPEC_FILE}: ${BUILD_DIR}
	hash=`git rev-parse --short HEAD`; \
	sed -e "s/__BUILDNUM__/${BUILD_NUMBER}/" -e "s/__GITHASH__/$${hash}/" $(SRC_DIR)/support/authproxy-rpm.spec > ${SPEC_FILE}

${AUTHPROXY_RPM}: ${SPEC_FILE}
	echo "RPM build goes here"
	echo "SRC_DIR: $(SRC_DIR)"
	echo "BUILD_DIR: $(BUILD_DIR)"
	echo "RPM_DIR: $(RPM_DIR)"
	rpmbuild -bb --define "_topdir $(RPM_DIR)" --define "_src_dir $(SRC_DIR)" ${SPEC_FILE}

unit-test:
	cd $(TOP_DIR)/test; \
	./test_authproxy.js -t 6473635 -k http://127.0.0.1:5001 -l INFO

rpm: ${AUTHPROXY_RPM}

clean:
	rm -rf $(BUILD_DIR)
