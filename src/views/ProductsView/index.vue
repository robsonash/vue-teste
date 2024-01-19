<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="page-product" class="c-container">
    <div class="c-container-table">
      <div class="c-add-user">
        <div class="c-container-icone">
          <span class="c-icone mdi mdi-package-variant"></span>
          <span class="c-container-icone-text">Lista de Produtos</span>
        </div>
        <div class="c-add-button">
          <v-btn class="btn" @click="addProducts">ADICIONAR PRODUTO</v-btn>
        </div>
      </div>
      <DataTable
        :dense="false"
        :items-per-page="10"
        :hideDefaultFooter="false"
        :disablePagination="false"
        :headers="products.headers"
        :items="products.items"
        :templateSearch="true"
        labelSearch="Pesquisar produto"
        :showMoreButtons="true"
        :loading="tableLoading"
      />
    </div>
    <DefaultModal
      ref="ModalAddProduct"
      :title="modalAddProduct.title"
      :nameSendButton="modalAddProduct.nameSendButton"
      nameCancelButton="Cancelar"
      :modeRequest="modeRequest"
      :loading="modalAddProduct.loading"
      :disabled="modalAddProduct.disabled"
      @cancel="resetForm"
      @send="sendAddUser"
      @clickOutside="resetForm"
    >
      <FormAddProduct
        class="c-body"
        v-if="formProduct && modeRequest !== 'delete'"
        ref="CFormAddProduct"
        :itemEdit="itemEdit"
      />
    </DefaultModal>
  </div>
</template>

<script>
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/Products";
import DataTable from "@/components/DataTable/DataTable";
import FormAddProduct from "@/views/ProductsView/Partials/FormAddProduct/index";
import DefaultModal from "@/components/DefaultModal/DefaultModal";
export default {
  name: "ProductView",
  components: {
    DataTable,
    DefaultModal,
    FormAddProduct,
  },
  data() {
    return {
      modeRequest: "",

      products: {
        headers: [],
        items: [],
      },
      formProduct: false,
      modalAddProduct: {
        title: "A",
        nameSendButton: "",
        nameCancelButton: "",
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
        const { data } = await getAllProducts();
        this.products.items = data;
        if (data.length > 0) {
          this.products.headers = this.formatHeaders(
            Object.keys(this.products.items[0])
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
      this.products.headers.push({
        text: "Ações",
        value: "acoes",
      });

      this.products.items.forEach((item) => {
        item.acoes = [
          { text: "Editar", action: () => this.editUser(item) },
          { text: "Excluir", action: () => this.deleteUser(item) },
        ];
      });
    },
    resetForm() {
      this.modeRequest = "";
      this.formProduct = false;
      this.itemEdit = null;
      this.$refs.ModalAddProduct.dialog = false;
    },
    addProducts() {
      this.modeRequest = "add";

      this.formProduct = true;
      this.itemEdit = null;
      this.modalAddProduct.title = "Adicionar Produto";
      this.modalAddProduct.nameSendButton = "Adicionar";

      this.$refs.ModalAddProduct.dialog = true;
    },
    editUser(item) {
      this.modeRequest = "edit";
      this.formProduct = true;
      this.modalAddProduct.title = "Editar Produto";
      this.modalAddProduct.nameSendButton = "Atualizar";
      this.$refs.ModalAddProduct.dialog = true;
      this.$nextTick(() => {
        this.$set(this, "itemEdit", item);
      });
    },
    deleteUser(item) {
      this.formProduct = true;
      this.modeRequest = "delete";
      this.modalAddProduct.title = "Deseja realmente deletar esse produto?";
      this.modalAddProduct.nameSendButton = "Deletar";
      this.$refs.ModalAddProduct.dialog = true;
      this.$nextTick(() => {
        this.$set(this, "itemEdit", item);
      });
    },

    cancelAddUser() {
      this.$refs.ModalAddProduct.dialog = false;
    },

    sendAddUser(mode) {
      if (mode !== "delete") {
        if (!this.$refs.CFormAddProduct.$refs.form.validate()) {
          return;
        }
        this.addPerson(this.$refs.CFormAddProduct.form, mode);
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
          valorUnitario: form.unitaryValue,
          descricao: form.description,
        };
        let response;
        if (mode === "add") {
          response = await createProduct(payload);
          if (response) {
            this.$toast.success("Produto cadastrado!", "Sucesso:", {
              position: "topRight",
            });
          }
        } else if (mode === "edit") {
          response = await updateProduct(id, payload);
          if (response) {
            this.$toast.success("Editado com sucesso!", "Sucesso:", {
              position: "topRight",
            });
          }
        } else if (mode === "delete") {
          response = await deleteProduct(id);
          if (response) {
            this.$toast.success("Excluído com sucesso!", "Sucesso:", {
              position: "topRight",
            });
          }
        }
        this.resetForm();
        this.loadingDisabled(false);

        this.fetchData();
        this.formProduct = false;
      } catch (error) {
        this.$toast.error(error, "Erro:", {
          position: "topRight",
        });
        this.loadingDisabled(false);
        this.resetForm();
      }
    },
    loadingDisabled(value) {
      this.modalAddProduct.loading = value;
      this.modalAddProduct.disabled = value;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
