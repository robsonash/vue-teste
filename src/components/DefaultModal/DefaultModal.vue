<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :max-width="maxWidth"
      @click:outside="clickOutside"
    >
      <v-card>
        <v-card-title>
          <span class="c-title">{{ title }}</span>
        </v-card-title>
        <slot v-if="modeRequest !== 'delete'"></slot>
        <v-card-actions class="c-card-actions">
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            :disabled="disabled"
            depressed
            color="red"
            text
            @click="cancel"
          >
            <span class="mdi mdi-block-helper mr-1"></span>
            {{ nameCancelButton }}
          </v-btn>
          <v-btn
            :loading="loading"
            :disabled="disabled"
            depressed
            color="green"
            text
            @click="send"
          >
            <span class="mdi mdi-check-bold mr-1"></span> {{ nameSendButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: "DefaultModal",
  props: {
    title: {
      type: String,
      required: true,
    },
    nameSendButton: {
      type: String,
      required: true,
    },
    nameCancelButton: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modeRequest: {
      type: String,
      default: "",
    },
    maxWidth: {
      type: String,
      default: "800px",
    },
  },
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    send() {
      this.$emit("send", this.modeRequest);
    },
    cancel() {
      this.$emit("cancel");
    },
    clickOutside() {
      this.$emit("clickOutside");
    },
  },
};
</script>
<style src="./styles.scss" scoped lang="scss" />
