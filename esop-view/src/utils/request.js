import axios from "axios";

export default function request() {
  const startup = (url) => axios.get(`http://${url}/esop-server/station/getIp`);
  // const startup = (url) => axios.get(`http://${url}/station/getIp`);
  return {
    startup
  }
}
