#!/bin/bash
TZ-US/Eastern; export TZ

export JAVA_OPTS="-XX:+UseZGC \
                  -Xshare:off \
                  -Xms512m \
                  -Xmx2g \
                  -XX:+HeapDumpOnOutOfMemoryError \
                  -XX:HeapDumpPath=/app/logs/heap_dump.hprof"

java ${JAVA_OPTS} -cp /app/bin/cub-server.jar:/app/lib/* com.cube.CubeApplication