<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="form-add-user">
    <v-form
      class="c-container-form"
      data-test-form
      ref="form"
      @submit.prevent="submit"
    >
      <div class="col-12 col-sm-6 col-md-6 pb-0">
        <v-text-field
          v-model="form.name"
          :rules="rules.required"
          color="purple darken-2"
          label="Nome"
          required
        ></v-text-field>
      </div>
      <div class="col-12 col-sm-6 col-md-6 pb-0">
        <v-text-field
          v-model="form.unitaryValue"
          :rules="rules.required"
          color="purple darken-2"
          label="Valor Unitário"
          type="number"
          required
        ></v-text-field>
      </div>
      <div class="col-12 col-sm-12 col-md-12 pb-0">
        <v-textarea
          v-model="form.description"
          :rules="rules.required"
          color="purple darken-2"
          label="Descrição"
          required
        ></v-textarea>
      </div>
    </v-form>
  </div>
</template>

<script>
import { isRequired } from "@/utils/validationUtils";
export default {
  name: "FormAddProduct",
  props: {
    itemEdit: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      editMode: false,
      form: {
        id: null,
        name: "",
        description: "",
        unitaryValue: "",
      },
      rules: {
        required: [(val) => isRequired(val, "Este campo é obrigatório")],
      },
    };
  },
  watch: {
    itemEdit(newItem) {
      if (newItem !== null) {
        this.editMode = true;
        this.form.id = newItem.id;
        this.form.name = newItem.nome;
        this.form.description = newItem.descricao;
        this.form.unitaryValue = newItem.valorUnitario;
      } else {
        this.resetForm();
      }
    },
    deep: true,
    immediate: true,
  },

  methods: {
    resetForm() {
      this.form.id = null;
      this.form.name = "";
      this.form.description = "";
      this.form.unitaryValue = "";
      this.editMode = false;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
