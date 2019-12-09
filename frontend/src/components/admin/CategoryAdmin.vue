<template>
<div class="category-admin">
  <b-form>
    <input id="category-id" type="hidden"  v-model="category.id">

    <!-- Nome -->
    <b-form-group label="Nome:" label-for="category-name">
      <b-form-input
        id="category-name"
        type="text"
        placeholder="Informe o nome da categoria..."
        required
        :readonly="mode === 'remove'"
        v-model="category.name"
      />
    </b-form-group>

    <!-- Categoria Pai / Caminho -->
    <b-form-group label="Categoria pai:" label-for="category-parentId" v-if="mode === 'save'">
      <b-form-select
        id="category-parentId"
        :options="categories"
        v-model="category.parentId"
      />
    </b-form-group>
    <b-form-group label="Caminho:" label-for="category-path" v-else>
      <b-form-input
        id="category-path"
        type="text"
        readonly
        :value="category.path"
      />
    </b-form-group>

    <!-- Botões -->
    <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
    <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
    <b-button class="ml-2" @click="reset">Cancelar</b-button>

  </b-form>
  <hr />

  <!-- Lista de categorias -->
  <b-table hover striped :items="categories" :fields="fields">
    <template v-slot:cell(actions)="data">
      <b-button class="mr-2" variant="warning" @click="loadCategory(data.item)">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button variant="danger" @click="loadCategory(data.item, 'remove')">
        <i class="fa fa-trash"></i>
      </b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import axios from 'axios';
import { baseApiUrl, showError } from '../../global';

export default {
  name: 'CategoryAdmin',
  methods: {

    /**
     * Carregamento de categorias
     */
    loadCategories() {
      const url = `${baseApiUrl}/categories`;

      axios.get(url).then((res) => {
        // this.categories = res.data;
        this.categories = res.data.map((category) => ({
          ...category,
          value: category.id,
          text: category.path,
        }));
      });
    },

    /**
     * Carrega um categoria para edição/exclusão
     */
    loadCategory(category, mode = 'save') {
      this.mode = mode;
      this.category = { ...category };
    },

    /**
     * Limpa o formulário
     */
    reset() {
      this.mode = 'save';
      this.category = {};
      this.loadCategories();
    },

    /**
     * Salva um categoria (inser ou update)
     */
    save() {
      const method = this.category.id ? 'put' : 'post';
      const id = this.category.id ? `/${this.category.id}` : '';

      axios[method](`${baseApiUrl}/categories${id}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadCategories();
        }).catch(showError);
    },

    /**
     * Exclui um categoria
     */
    remove() {
      const { id } = this.category;

      axios.delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        }).catch(showError);
    },
  },
  data() {
    return {
      mode: 'save',
      category: {},
      categories: [],
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
          key: 'path',
          label: 'Caminho',
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
    this.loadCategories();
  },
};
</script>
