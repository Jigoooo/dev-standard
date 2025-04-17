#!/bin/bash

# 포트 44000을 사용 중인 PID 찾기
pid=$(netstat -aon | grep 44000 | grep LISTENING | awk '{print $5}' | sort -u)

echo "Found PID: $pid"

if [ -n "$pid" ]; then
  # 해당 PID로 프로세스 강제 종료 (Windows의 taskkill 사용)
  taskkill //PID "$pid" //F
  if [ $? -eq 0 ]; then
    echo "Process is killed."
  else
    echo "Failed to kill the process."
  fi
else
  echo "No process found using port 44000."
fi
