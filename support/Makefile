#! vim noexpandtab
# Copyright (C) 2013 Platform 9 Systems, Inc.
#

TOP_DIR := $(abspath ..)
SRC_DIR := $(TOP_DIR)
BUILD_DIR := $(TOP_DIR)/build

VERSION ?= 1.0.0
AUTHPROXY_RPM := $(BUILD_DIR)/pf9-authproxy-$(VERSION).rpm
RPM_DIR := $(BUILD_DIR)/rpmbuild

${BUILD_DIR}:
	mkdir -p $@

${AUTHPROXY_RPM}: ${BUILD_DIR}
	echo "RPM build goes here"
	echo "SRC_DIR: $(SRC_DIR)"
	echo "BUILD_DIR: $(BUILD_DIR)"
	echo "RPM_DIR: $(RPM_DIR)"
	rpmbuild -bb --define "_topdir $(RPM_DIR)" --define "_src_dir $(SRC_DIR)" $(SRC_DIR)/support/authproxy-rpm.spec

rpm: ${AUTHPROXY_RPM}

clean:
	rm -rf $(BUILD_DIR)
