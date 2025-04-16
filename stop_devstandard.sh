var1=$(netstat -tnlp | grep 44000)
echo process info: ${var1}

get_pid=$(echo $var1 | awk '{print $7}' | cut -d'/' -f1)

echo "Process PID: $get_pid"

if [ -n "${get_pid}" ]; then
  kill -9 ${get_pid}
  if [ $? -eq 0 ]; then
    echo "Process is killed."
  else
    echo "Failed to kill the process."
  fi
else
  echo "Running process not found."
fi
