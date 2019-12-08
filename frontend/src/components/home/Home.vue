<template>
<div class="home">
  <PageTitle icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento" />
  <div class="stats">
    <Stat color="#d54d50" title="Categorias" icon="fa fa-folder" :value="stat.categories" />
    <Stat color="#3bc480" title="Artigos" icon="fa fa-file" :value="stat.articles" />
    <Stat color="#3282cd" title="Usuários" icon="fa fa-user" :value="stat.users" />
  </div>
</div>
</template>

<script>
import axios from 'axios';

import PageTitle from '../templates/PageTitle.vue';
import Stat from './Stat.vue';
import baseApiUrl from '../../global';

export default {
  name: 'Home',
  components: { PageTitle, Stat },
  methods: {
    getStats() {
      axios.get(`${baseApiUrl}/stats`)
        .then(({ data }) => {
          this.stat = data;
        });
    },
  },
  data() {
    return {
      stat: {},
    };
  },
  mounted() {
    this.getStats();
  },
};
</script>

<style>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
