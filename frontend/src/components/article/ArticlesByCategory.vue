<template>
<div class="articles-by-category">
  <PageTitle icon="fa fa-folder-o" sub="Categoria"
    :main="category.name" />
  <ul>
    <li :key="article.id" v-for="article in articles">
      <ArticleItem :article="article" />
    </li>
  </ul>
  <div class="load-more">
    <button class="btn btn-lg btn-outline-primary"
      @click="getArticles" v-if="loadMore">
      Carregar mais artigos
    </button>
  </div>
</div>
</template>

<script>
import axios from 'axios';

import { baseApiUrl } from '../../global';
import PageTitle from '../templates/PageTitle.vue';
import ArticleItem from './ArticleItem.vue';

export default {
  name: 'ArticlesByCategory',
  components: { PageTitle, ArticleItem },
  data() {
    return {
      /** @type {Category} */
      category: {},
      articles: [],
      page: 1,
      loadMore: true,
    };
  },
  methods: {
    /**
     * Obtém a categoria
     */
    getCategory() {
      const url = `${baseApiUrl}/categories/${this.category.id}`;
      axios(url).then((res) => {
        this.category = res.data;
      });
    },
    /**
     * Obtém artigos
     */
    getArticles() {
      const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`;

      axios(url).then((res) => {
        this.articles = Array.isArray(this.articles) ? this.articles.concat(res.data) : [];
        this.page += 1;

        if (res.data.length === 0) this.loadMore = false;
      });
    },
  },
  watch: {
    $route(to) {
      this.category.id = to.params.id;
      this.articles = [];
      this.page = 1;
      this.loadMore = true;

      this.getCategory();
      this.getArticles();
    },
  },
  mounted() {
    this.category.id = this.$route.params.id;
    this.getCategory();
    this.getArticles();
  },
};
</script>

<style>
.articles-by-category ul {
  list-style-type: none;
  padding: 0;
}

.articles-by-category .load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
