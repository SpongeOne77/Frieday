import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { clearAuthStorage, getToken, getUserInfo } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive(getUserInfo());

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    // const { data: loginToken, error } = await fetchLogin(userName, password);
    const { data: loginToken, error } = {
      data: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ1c2VyTmFtZSI6IlNveWJlYW4ifV0sImlhdCI6MTY5ODQ4NDg2MywiZXhwIjoxNzMwMDQ0Nzk5LCJhdWQiOiJzb3liZWFuLWFkbWluIiwiaXNzIjoiU295YmVhbiIsInN1YiI6IlNveWJlYW4ifQ._w5wmPm6HVJc5fzkSrd_j-92d5PBRzWUfnrTF1bAmfk',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ1c2VyTmFtZSI6IlNveWJlYW4ifV0sImlhdCI6MTY5ODQ4NDg4MSwiZXhwIjoxNzYxNTgwNzk5LCJhdWQiOiJzb3liZWFuLWFkbWluIiwiaXNzIjoiU295YmVhbiIsInN1YiI6IlNveWJlYW4ifQ.7dmgo1syEwEV4vaBf9k2oaxU6IZVgD2Ls7JK1p27STE'
      },
      code: '0000',
      msg: '请求成功'
    };

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await routeStore.initAuthRoute();

        if (redirect) {
          await redirectFromLogin();
        }

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
            duration: 4500
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // const { data: info, error } = await fetchGetUserInfo();
    const { data: info, error } = {
      data: {
        userId: '0',
        userName: 'Trama',
        roles: ['R_SUPER'],
        buttons: ['B_CODE1', 'B_CODE2', 'B_CODE3']
      }
    };

    if (!error) {
      // 2. store user info
      localStg.set('userInfo', info);

      // 3. update store
      token.value = loginToken.token;
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login
  };
});
