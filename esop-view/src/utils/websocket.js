import {ref} from "vue";

export default function customWebSocket({
                                          url,
                                          onConnect,
                                          onClosed,
                                          onError,
                                          onMessage,
                                        }) {
  
  const connectionStatus = ref(false);
  const createWebsocket = (localAddress) => {
    let _localAddress = localAddress;
    const ws = new WebSocket(url);
    const heartbeat = setInterval(() => {
      console.log("ready for heartbeat")
      ws.send("The heartbeat packets")
    }, 5000)
    
    ws.addEventListener('open', function (event) {
      console.log("连接成功后的回调函数")
      connectionStatus.value = true;
      ws.send(_localAddress.toString())
      
      onConnect && onConnect(event)
    });
    ws.addEventListener('close', function (event) {
      console.log("连接关闭后的回调函数")
      connectionStatus.value = false;
      heartbeat && clearInterval(heartbeat)
      setTimeout(() => {
        createWebsocket()
      }, 10000)
    });
    ws.addEventListener('error', function (event) {
      console.log("连接报错时的回调函数")
      onError && onError(event)
    });
    ws.addEventListener('message', function (event) {
      console.log(event.data)
      onMessage && onMessage(event.data)
      console.log("收到服务器数据后的回调函数")
    });
    return ws
  }
  return {
    createWebsocket,
    connectionStatus
  }
}
