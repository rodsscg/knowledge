<template>
<div class="user-admin">
  <b-form>
    <input type="hidden" id="user-id" v-model="user.id">
    <b-row>

      <!-- Nome -->
      <b-col md="6" sm="12">
        <b-form-group label="Nome:" label-for="user-name">
          <b-form-input
            id="user-name"
            type="text"
            placeholder="Informe o nome do usuário..."
            required
            :readonly="mode === 'remove'"
            v-model="user.name"
          />
        </b-form-group>
      </b-col>

      <!-- E-mail -->
      <b-col md="6" sm="12">
        <b-form-group label="E-mail:" label-for="user-email">
          <b-form-input
            id="user-email"
            type="text"
            placeholder="Informe o e-mail do usuário..."
            required
            :readonly="mode === 'remove'"
            v-model="user.email"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Admin -->
    <b-form-checkbox
      id="user-admin"
      class="mt-3 mb-3"
      v-model="user.admin"
      v-show="mode === 'save'">
      Administrador?
    </b-form-checkbox>

    <b-row v-show="mode === 'save'">

      <!-- Senha -->
      <b-col md="6" sm="12">
        <b-form-group label="Senha:" label-for="user-password">
          <b-form-input
            id="user-password"
            type="password"
            placeholder="Informe a senha do usuário..."
            required
            v-model="user.password"
          />
        </b-form-group>
      </b-col>

      <!-- Confirmação de senha -->
      <b-col md="6" sm="12">
        <b-form-group label="Confirme a senha:" label-for="user-confirm-password">
          <b-form-input
            id="user-confirm-password"
            type="password"
            placeholder="Confirme a senha do usuário..."
            required
            v-model="user.confirmPassword"
          />
        </b-form-group>
      </b-col>

    </b-row>

    <!-- Botões -->
    <b-row>
      <b-col xs="12">
        <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
        <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
        <b-button class="ml-2" @click="reset">Cancelar</b-button>
      </b-col>
    </b-row>

  </b-form>
  <hr />

  <!-- Lista de usuários -->
  <b-table hover striped :items="users" :fields="fields">
    <template v-slot:cell(actions)="data">
      <b-button class="mr-2" variant="warning" @click="loadUser(data.item)">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button variant="danger" @click="loadUser(data.item, 'remove')">
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
  name: 'UserAdmin',
  methods: {

    /**
     * Carregamento de usuários
     */
    loadUsers() {
      const url = `${baseApiUrl}/users`;

      axios.get(url).then((res) => {
        this.users = res.data;
      });
    },

    /**
     * Carrega um usuário para edição/exclusão
     */
    loadUser(user, mode = 'save') {
      this.mode = mode;
      this.user = { ...user };
    },

    /**
     * Limpa o formulário
     */
    reset() {
      this.mode = 'save';
      this.user = {};
      this.loadUsers();
    },

    /**
     * Salva um usuário (inser ou update)
     */
    save() {
      const method = this.user.id ? 'put' : 'post';
      const id = this.user.id ? `/${this.user.id}` : '';

      axios[method](`${baseApiUrl}/users${id}`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadUsers();
        }).catch(showError);
    },

    /**
     * Exclui um usuário
     */
    remove() {
      const { id } = this.user;

      axios.delete(`${baseApiUrl}/users/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        }).catch(showError);
    },
  },
  data() {
    return {
      mode: 'save',
      user: {},
      users: [],
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
          key: 'email',
          label: 'E-mail',
          sortable: true,
        },
        {
          key: 'admin',
          label: 'Administrador',
          sortable: true,
          formatter: (value) => (value ? 'Sim' : 'Não'),
        },
        {
          key: 'actions',
          label: 'Ações',
        },
      ],
    };
  },
  mounted() {
    this.loadUsers();
  },
};
</script>

<style>

</style>
