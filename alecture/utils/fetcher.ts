import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true, // 쿠키 생성 
    })
    .then((response) => response.data);

export default fetcher;
