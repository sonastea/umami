import { createSlice } from '@reduxjs/toolkit';
import { getItem } from 'lib/web';
import { LOCALE_CONFIG, THEME_CONFIG } from 'lib/constants';

const app = createSlice({
  name: 'app',
  initialState: {
    locale: getItem(LOCALE_CONFIG) || 'en-US',
    theme: getItem(THEME_CONFIG) || 'light',
    versions: {
      current: process.env.VERSION,
      latest: null,
    },
  },
  reducers: {
    setLocale(state, action) {
      state.locale = action.payload;
      return state;
    },
    setTheme(state, action) {
      state.theme = action.payload;
      return state;
    },
    setVersions(state, action) {
      state.versions = action.payload;
      return state;
    },
  },
});

export const { setLocale, setTheme, setVersions } = app.actions;

export default app.reducer;

export function checkVersion() {
  return async (dispatch, getState) => {
    const {
      app: {
        versions: { current },
      },
    } = getState();

    const data = await fetch('https://api.github.com/repos/mikecao/umami/releases/latest', {
      method: 'get',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }).then(res => {
      if (res.ok) {
        return res.json();
      }

      return null;
    });

    if (!data) {
      return;
    }

    const { tag_name } = data;

    const latest = tag_name.startsWith('v') ? tag_name.slice(1) : tag_name;

    return dispatch(
      setVersions({
        current,
        latest,
      }),
    );
  };
}