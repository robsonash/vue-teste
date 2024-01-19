<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="page-home" class="c-container">
    <div class="c-container-table">
      <div class="c-add-user">
        <div class="c-container-icone">
          <span class="c-icone mdi mdi-account"></span>
          <span class="c-container-icone-text">Lista de Usuários</span>
        </div>
        <div class="c-add-button">
          <v-btn class="btn" @click="addUser">ADICIONAR USUÁRIO</v-btn>
        </div>
      </div>
      <DataTable
        :dense="false"
        :items-per-page="10"
        :hideDefaultFooter="false"
        :disablePagination="false"
        :headers="people.headers"
        :items="people.items"
        :templateSearch="true"
        labelSearch="Pesquisar Usuário"
        :showMoreButtons="true"
        :loading="tableLoading"
      />
    </div>
    <DefaultModal
      ref="ModalAddUser"
      :title="modalAddUser.title"
      :nameSendButton="modalAddUser.nameSendButton"
      nameCancelButton="Cancelar"
      :modeRequest="modeRequest"
      :loading="modalAddUser.loading"
      :disabled="modalAddUser.disabled"
      @cancel="resetForm"
      @send="sendAddUser"
      @clickOutside="resetForm"
    >
      <FormAddUser
        class="c-body"
        v-if="formUser && modeRequest !== 'delete'"
        ref="CFormAddUser"
        :itemEdit="itemEdit"
      />
    </DefaultModal>
  </div>
</template>

<script>
import {
  getAllPeople,
  createPerson,
  updatePerson,
  deletePerson,
} from "@/services/People"; // Importe a função de serviço
import DataTable from "@/components/DataTable/DataTable";
import FormAddUser from "@/views/HomeView/Partials/FormAddUser/index";
import DefaultModal from "@/components/DefaultModal/DefaultModal";
export default {
  name: "HomeView",
  components: {
    DataTable,
    DefaultModal,
    FormAddUser,
  },
  data() {
    return {
      modeRequest: "",

      people: {
        headers: [],
        items: [],
      },
      formUser: false,
      modalAddUser: {
        title: "Adicionar Usuário",
        nameSendButton: "Adicionar",
        nameCancelButton: "Cancelar",
        loading: false,
        disabled: false,
      },
      itemEdit: null,
      tableLoading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.tableLoading = true;
        const { data } = await getAllPeople();
        this.people.items = data.map((user) => {
          return {
            ...user,
            dataNascimento: this.formatBirthDate(user.dataNascimento),
          };
        });
        if (data.length > 0) {
          this.people.headers = this.formatHeaders(
            Object.keys(this.people.items[0])
          );
        }
        this.addActionsButtons();
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    formatHeaders(keys) {
      return keys.map((key) => ({
        text: this.formatHeaderText(key),
        value: key,
      }));
    },
    formatHeaderText(key) {
      const words = key.split(/(?=[A-Z])/);
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    addActionsButtons() {
      this.people.headers.push({
        text: "Ações",
        value: "acoes",
      });

      this.people.items.forEach((item) => {
        item.acoes = [
          { text: "Ir ás compras", action: () => this.shopping(item) },
          { text: "Editar", action: () => this.editUser(item) },
          { text: "Excluir", action: () => this.deleteUser(item) },
        ];
      });
    },
    resetForm() {
      this.modeRequest = "";
      this.formUser = false;
      this.itemEdit = null;
      this.$refs.ModalAddUser.dialog = false;
    },
    shopping(item) {
      const userId = item.id;

      this.$router.push(`/${userId}/compras`);
    },
    addUser() {
      this.modeRequest = "add";

      this.formUser = true;
      this.itemEdit = null;
      this.modalAddUser.title = "Adicionar Usuário";
      this.modalAddUser.nameSendButton = "Adicionar";

      this.$refs.ModalAddUser.dialog = true;
    },
    editUser(item) {
      this.modeRequest = "edit";
      this.formUser = true;
      this.modalAddUser.title = "Editar Usuário";
      this.modalAddUser.nameSendButton = "Atualizar";
      this.$refs.ModalAddUser.dialog = true;
      this.$nextTick(() => {
        this.$set(this, "itemEdit", item);
      });
    },
    deleteUser(item) {
      this.formUser = true;
      this.modeRequest = "delete";
      this.modalAddUser.title = "Deseja realmente deletar esse usuário?";
      this.modalAddUser.nameSendButton = "Deletar";
      this.$refs.ModalAddUser.dialog = true;
      this.$nextTick(() => {
        this.$set(this, "itemEdit", item);
      });
    },

    cancelAddUser() {
      this.$refs.ModalAddUser.dialog = false;
    },

    sendAddUser(mode) {
      if (mode !== "delete") {
        if (!this.$refs.CFormAddUser.$refs.form.validate()) {
          return;
        }
        this.addPerson(this.$refs.CFormAddUser.form, mode);
        return;
      }
      this.addPerson({ id: this.itemEdit.id }, mode);
    },

    async addPerson(form, mode) {
      try {
        this.loadingDisabled(true);

        const id = form.id;
        const payload = {
          nome: form.name,
          cpf: form.cpf,
          dataNascimento: this.formatBirthDate(form.birthDate),
        };
        let response;
        if (mode === "add") {
          response = await createPerson(payload);
          if (response) {
            this.$toast.success("Usuário cadastrado!", "Sucesso:", {
              position: "topRight",
            });
          }
        } else if (mode === "edit") {
          response = await updatePerson(id, payload);
          if (response) {
            this.$toast.success("Editado com sucesso!", "Sucesso:", {
              position: "topRight",
            });
          }
        } else if (mode === "delete") {
          response = await deletePerson(id);
          if (response) {
            this.$toast.success("Excluído com sucesso!", "Sucesso:", {
              position: "topRight",
            });
          }
        }
        this.resetForm();
        this.loadingDisabled(false);

        this.fetchData();
        this.formUser = false;
      } catch (error) {
        this.$toast.error(error, "Erro:", {
          position: "topRight",
        });
        this.loadingDisabled(false);
        this.resetForm();
      }
    },
    formatBirthDate(birthDate) {
      if (/\d{2}\/\d{2}\/\d{4}/.test(birthDate)) {
        const [day, month, year] = birthDate.split("/");
        return `${year}-${month}-${day}`;
      } else if (/\d{4}-\d{2}-\d{2}/.test(birthDate)) {
        const [year, month, day] = birthDate.split("-");
        return `${day}/${month}/${year}`;
      } else {
        return birthDate;
      }
    },
    loadingDisabled(value) {
      this.modalAddUser.loading = value;
      this.modalAddUser.disabled = value;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
