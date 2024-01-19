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
          v-model="form.cpf"
          :rules="cpfValidationRules"
          v-mask="'###.###.###-##'"
          color="purple darken-2"
          label="CPF"
          required
        ></v-text-field>
      </div>
      <div class="col-12 col-sm-6 col-md-6 pb-0">
        <v-text-field
          v-model="form.birthDate"
          :rules="dateValidationsRules"
          v-mask="'##/##/####'"
          color="purple darken-2"
          label="Data de Nascimento"
          required
        ></v-text-field>
      </div>
    </v-form>
  </div>
</template>

<script>
import { isRequired, isValidCPF, isValidDate } from "@/utils/validationUtils";
export default {
  name: "FormAddUser",
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
        cpf: "",
        birthDate: "",
      },
      rules: {
        required: [(val) => isRequired(val, "Este campo é obrigatório")],
        validCPF: [(val) => isValidCPF(val, "CPF inválido")],
      },
    };
  },
  watch: {
    itemEdit(newItem) {
      if (newItem !== null) {
        this.editMode = true;
        this.form.id = newItem.id;
        this.form.name = newItem.nome;
        this.form.cpf = newItem.cpf;
        this.form.birthDate = newItem.dataNascimento;
      } else {
        this.resetForm();
      }
    },
    deep: true,
    immediate: true,
  },
  computed: {
    cpfValidationRules() {
      const rules = [
        (val) => isRequired(val, "Este campo é obrigatório"),
        (val) => isValidCPF(val, "CPF inválido"),
      ];
      return rules;
    },
    dateValidationsRules() {
      const rules = [
        (val) => isRequired(val, "Este campo é obrigatório"),
        (val) => isValidDate(val, "Preencha todo o campo"),
      ];
      return rules;
    },
  },
  methods: {
    resetForm() {
      this.form.id = null;
      this.form.name = "";
      this.form.cpf = "";
      this.form.birthDate = "";
      this.editMode = false;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
