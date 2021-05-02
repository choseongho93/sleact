import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr'; // 전역으로 로그인된 유저 정보를 session처럼 가지고있음.

const LogIn = () => {
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher); // useSWR은 fetcher로 넘겨주고 fetcher을 실제로 구현해야함. GET으로 정보를 가져옴. useSWR은 GET사용만 권장.

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          revalidate();  // post로 통신했지만, revalidate해서 다시 GET API를 통신해서 정보를 가져옴. 많은 요청이 발생함.
          
          //mutate(response.data, false); //mutate는 api를 다시보내서 정보를 가져오는것이 아니라 현재 통신한 response값을 SWR에 저장하는것. 많은 요청이 필요없음.
          // 두번째 인자인 false를 하는이유는 다시 api요청을 해서 확인하는 작업을 안하기 위함임. 그래서 true가 디폴트이고 ture일경우 통신이 또 이루어짐.
          // true일경우, 서버에 요청이 가기도 전에 실제 데이터를 바꾸고 그뒤로 api 요청을 보냄 / 장점은 유저가 빠르게 화면에서 확인이 가능. 이것을 옵티미스틱 UI라 함.
          // 또한 내가 보낸 요청이 성공할꺼라고 가정하고 성공 액션을 해주고, 점검해서 api 요청하고 문제가 생기면 실패로 변경함.  이 반대는 매시미스틱 UI 
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) { //내정보가 있다면 리다이렉트  const { data, error, revalidate } = useSWR('/api/users', fetcher);
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
