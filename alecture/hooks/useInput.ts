import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';

// return 타입임. value, handler, setValue
type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

// <T> 제너릭을 사용하며  <T>(initialData: T)은 매개변수 타입 /  ReturnTypes<T>은 리턴 타입이며 위에 변수로 지정함.
const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
