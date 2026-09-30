#!/bin/bash
TZ-US/Eastern; export TZ

PID= `ps -ef | grep java | grep "cube-server.jar" | awk '{ print $2 }'`
if [ "${PID}" == "" ];then
  echo "service is not running! skip stop."
else
  echo "service is going to be killed, Process id was: ${PID}."
  kill -15 ${PID}
  echo "service is stopped, Process id was: ${PID}."
fi

exit 0