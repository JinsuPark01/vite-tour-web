import { create } from "zustand";

const useLoginStore = create((set) => ({
  userName: null, // 사용자 이름 (null이면 로그인되지 않은 상태)
  isLoggedIn: false, // 로그인 상태를 나타내는 플래그

  // Actions
  logined: (userName) =>
    set({
      userName,
      isLogined: true,
    }),

  logouted: () =>
    set({
      userName: null,
      isLogined: false,
    }),
}));

export default useLoginStore;