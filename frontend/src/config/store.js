import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isMenuVisible: true,
  },
  mutations: {
    toggleMenu(state, isVisible) {
      const newState = state;
      newState.isMenuVisible = isVisible === undefined ? !state.isMenuVisible : isVisible;
    },
  },
});
