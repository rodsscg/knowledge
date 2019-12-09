<template>
<div class="article-admin">
  <b-form>
    <input id="article-id" type="hidden"
      v-model="article.id">

    <!-- Nome -->
    <b-form-group label="Nome:" label-for="article-name">
      <b-form-input id="article-name" type="text" placeholder="Informe o nome do artigo..."
        required
        :readonly="mode === 'remove'" v-model="article.name"
      />
    </b-form-group>

    <!-- Descrição -->
    <b-form-group label="Descrição:" label-for="article-description">
      <b-form-input id="article-description" type="text" placeholder="Informe a descrição do artigo"
        required
        :readonly="mode === 'remove'" v-model="article.description"
      />
    </b-form-group>

    <!-- Imagem (URL) -->
    <b-form-group label="Imagem (URL):" label-for="article-imageUrl"
      v-if="mode === 'save'">
      <b-form-input id="article-imageUrl" type="text" placeholder="Informe a url da imagem"
        :readonly="mode === 'remove'" v-model="article.imageUrl"
      />
    </b-form-group>

    <!-- Categoria -->
    <b-form-group label="Categoria:" label-for="article-categoryId"
      v-if="mode === 'save'">
      <b-form-select id="article-categoryId"
        :options="categories" v-model="article.categoryId"
      />
    </b-form-group>

    <!-- Autor -->
    <b-form-group label="Autor:" label-for="article-userId"
      v-if="mode === 'save'">
      <b-form-select id="article-userId"
        :options="users" v-model="article.userId"
      />
    </b-form-group>

    <!-- Conteúdo -->
    <b-form-group label="Conteúdo" label-for="article.content">
      <VueEditor placeholder="Informe o conteúdo do artigo..."
        v-if="mode === 'save'" v-model="article.content"
      />
    </b-form-group>

    <!-- Botões -->
    <b-button variant="primary"
      v-if="mode === 'save'" @click="save">
      Salvar
    </b-button>
    <b-button variant="danger"
      v-if="mode === 'remove'" @click="remove">
      Excluir
    </b-button>
    <b-button class="ml-2"
      @click="reset">
      Cancelar
    </b-button>

  </b-form>
  <hr />

  <!-- Lista de artigos -->
  <b-table hover striped :items="articles" :fields="fields">
    <template v-slot:cell(actions)="data">
      <b-button class="mr-2" variant="warning" @click="loadArticle(data.item)">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
        <i class="fa fa-trash"></i>
      </b-button>
    </template>
  </b-table>

  <!-- Paginação -->
  <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
</div>
</template>

<script>
import axios from 'axios';
import { VueEditor } from 'vue2-editor';

import { baseApiUrl, showError } from '../../global';

export default {
  name: 'ArticleAdmin',
  components: { VueEditor },
  methods: {

    /**
     * Carregamento de artigos
     */
    loadArticles() {
      const url = `${baseApiUrl}/articles?page=${this.page}`;

      axios.get(url).then((res) => {
        // this.articles = res.data;
        this.articles = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },

    /**
     * Carrega um artigo para edição/exclusão
     */
    loadArticle(article, mode = 'save') {
      this.mode = mode;
      axios.get(`${baseApiUrl}/articles/${article.id}`)
        .then((res) => {
          this.article = res.data;
        });
    },

    /**
     * Limpa o formulário
     */
    reset() {
      this.mode = 'save';
      this.article = {};
      this.loadArticles();
    },

    /**
     * Salva um categoria (inser ou update)
     */
    save() {
      const method = this.article.id ? 'put' : 'post';
      const id = this.article.id ? `/${this.article.id}` : '';

      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadArticles();
        }).catch(showError);
    },

    /**
     * Exclui um categoria
     */
    remove() {
      const { id } = this.article;

      axios.delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        }).catch(showError);
    },

    /**
     * Carregamento das categorias
     */
    loadCategories() {
      const url = `${baseApiUrl}/categories`;

      axios.get(url).then((res) => {
        this.categories = res.data.map((category) => ({
          value: category.id,
          text: category.path,
        }));
      });
    },

    /**
     * Carregamento dos usuários
     */
    loadUsers() {
      const url = `${baseApiUrl}/users`;

      axios.get(url).then((res) => {
        this.users = res.data.map((user) => ({
          value: user.id,
          text: `${user.name} - ${user.email}`,
        }));
      });
    },
  },
  watch: {
    page() {
      this.loadArticles();
    },
  },
  data() {
    return {
      mode: 'save',
      article: {},
      articles: [],
      categories: [],
      users: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        {
          key: 'id',
          label: 'Código',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'description',
          label: 'Descrição',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ações',
        },
      ],
    };
  },
  mounted() {
    this.loadArticles();
    this.loadCategories();
    this.loadUsers();
  },
};
</script>
