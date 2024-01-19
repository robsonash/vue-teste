<template>
  <div>
    <v-data-table
      :dense="dense"
      :single-ed="singleExpand"
      :expanded.sync="expanded"
      :show-expand="showExpand"
      :item-key="itemKey"
      @pagination="getPagination"
      :page="currentPage"
      :items-per-page="itemsPerPage"
      :headers="headers"
      :search="search"
      :items="items"
      class="elevation-1"
      :footer-props="{ itemsPerPageOptions: [] }"
      :hide-default-footer="hideDefaultFooter"
      :disable-pagination="disablePagination"
    >
      <template v-if="templateSearch" v-slot:top>
        <v-text-field
          v-model="search"
          :label="labelSearch"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-if="!showExpand" v-slot:item="{ item }">
        <tr :class="{ 'custom-hover': loading }">
          <td v-for="(header, columnIndex) in headers" :key="columnIndex">
            <div v-if="loading">
              <v-skeleton-loader type="list-item" :loading="loading" />
            </div>
            <div v-else>
              <template v-if="header.value !== 'acoes'">
                {{ item[header.value] }}
              </template>
              <template v-else>
                <MoreButtons :acoes="item.acoes" />
              </template>
            </div>
          </td>
        </tr>
      </template>
      <template v-if="showExpand" v-slot:item.acoes="{ item }">
        <MoreButtons :acoes="item.acoes" />
      </template>
      <template v-slot:no-data>
        <div class="alert alert-info mb-0">
          <b>Nenhuma informação encontrada.</b>
        </div>
      </template>
      <template v-slot:no-results>
        <div class="alert alert-info mb-0">
          <b>Nenhuma informação encontrada.</b>
        </div>
      </template>
      <template v-if="showExpand" v-slot:expanded-item="{ headers, item }"
        ><td :colspan="headers.length">
          <slot name="expanded" :item="item"></slot>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import MoreButtons from "@/components/MoreButtons/MoreButtons";
export default {
  name: "DataTable",
  components: {
    MoreButtons,
  },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    showMoreButtons: {
      type: Boolean,
      default: false,
    },
    hideDefaultFooter: {
      type: Boolean,
      required: false,
    },
    disablePagination: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    templateSearch: {
      type: Boolean,
      default: false,
    },
    labelSearch: {
      type: String,
      default: "",
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    singleExpand: {
      type: Boolean,
      default: true,
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    itemKey: {
      type: String,
      default: "name",
    },
  },
  data() {
    return {
      expanded: [],
      search: "",
      currentPage: 1,
    };
  },
  watch: {
    items: {
      handler() {
        this.currentPage = 1;
      },
      deep: true,
    },
  },
  methods: {
    getPagination(options) {
      this.currentPage = options.page;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
