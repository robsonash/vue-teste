<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="page-product" class="c-container">
    <div class="c-container-table">
      <div class="c-request">
        <span class="c-icone mdi mdi-list-box-outline"></span>
        <span class="c-request-text">Pedidos</span>
      </div>
      <DataTable
        :dense="false"
        itemKey="id"
        :showExpand="true"
        :singleExpand="true"
        :items-per-page="10"
        :hideDefaultFooter="false"
        :disablePagination="false"
        :headers="request.headers"
        :items="request.items"
        :templateSearch="true"
        labelSearch="Pesquisar pedido"
        :showMoreButtons="true"
        :loading="tableLoading"
      >
        <template v-slot:expanded="{ item }">
          <!--     <div v-for="produto in item.produtos" :key="produto.id"> -->
          <!--       <span>id: {{ produto.id }}</span> -
            <span>Nome: {{ produto.produto.nome }}</span> -
            <span>Valor Unitário:{{ produto.valor }}</span> -
            <span>Quantidade:{{ produto.quantidade }}</span> -->
          <table class="c-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Produto</th>
                <th>Valor Unitário</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in item.produtos" :key="produto.id">
                <td>{{ produto.id }}</td>
                <td>{{ produto.produto.nome }}</td>
                <td>{{ formatCurrency(produto.valor) }}</td>
                <td>{{ produto.quantidade }}</td>
              </tr>
            </tbody>
          </table>
          <!--   </div> -->
        </template>
      </DataTable>
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
import { getAllRequests, deleteRequest } from "@/services/Requests";
import DataTable from "@/components/DataTable/DataTable";
import FormAddProduct from "@/views/ProductsView/Partials/FormAddProduct/index";
import DefaultModal from "@/components/DefaultModal/DefaultModal";
import { formatBirthDate } from "@/utils/FormatBirthDate";
import { formatCurrency } from "@/utils/FormatCurrency";

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

      request: {
        headers: [],
        items: [],
      },
      formProduct: false,
      modalAddProduct: {
        title: "",
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
    formatBirthDate,
    formatCurrency,
    async fetchData() {
      try {
        this.tableLoading = true;
        const { data } = await getAllRequests();
        this.request.items = data.map((request) => {
          return {
            id: request.id,
            idCliente: request.cliente.id,
            cliente: request.cliente.nome,
            dataEmissao: this.formatBirthDate(request.dataEmissao),
            valorTotal: this.formatCurrency(request.valorTotal),
            produtos: request.itens,
          };
        });
        if (data.length > 0) {
          this.request.headers = [
            {
              text: "Id",
              value: "id",
            },
            {
              text: "Cliente",
              value: "cliente",
            },
            {
              text: "Data de Emissão",
              value: "dataEmissao",
            },
            {
              text: "Valor Total",
              value: "valorTotal",
            },
          ];
        }
        this.addActionsButtons();
        this.request.headers.push({
          text: "Detalhes",
          value: "data-table-expand",
        });
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    addActionsButtons() {
      this.request.headers.push({
        text: "Ações",
        value: "acoes",
      });

      this.request.items.forEach((item) => {
        item.acoes = [
          { text: "Excluir", action: () => this.deleteRequest(item) },
        ];
      });
    },
    resetForm() {
      this.modeRequest = "";
      this.formProduct = false;
      this.itemEdit = null;
      this.$refs.ModalAddProduct.dialog = false;
    },

    deleteRequest(item) {
      this.formProduct = true;
      this.modeRequest = "delete";
      this.modalAddProduct.title = "Deseja realmente deletar esse pedido?";
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
        let response;
        if (mode === "delete") {
          response = await deleteRequest(id);
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
