#!/bin/bash

sh gitpull.sh

sh gitlocalcommit.sh "merging"

sh gitpull.sh

sh gitstatus.sh

pm2 reload all