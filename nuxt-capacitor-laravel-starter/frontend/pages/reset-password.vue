<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useUsers } from "~/composables/user";
import PrimaryButton from "@/components/PrimaryButton.vue";
import GuestLayout from "@/layouts/GuestLayout.vue";
import TextInput from "@/components/TextInput.vue";
import InputLabel from "@/components/InputLabel.vue";
import ValidationErrors from "@/components/ValidationErrors.vue";

const route = useRoute();

const store = useUsers();

const token = route.params.token;

const email = route.query.email;

const form = ref({
  token: token,
  email: email,
  password: "",
  password_confirmation: "",
});

const processing = ref(false);

const setErrors = ref();

const errors = computed(() => setErrors.value);

const submit = () => {
  store.resetPassword(form, setErrors, processing);
};
</script>

<template>
  <GuestLayout>
    <ValidationErrors class="mb-4" :errors="errors" />

    <form @submit.prevent="submit">
      <div>
        <InputLabel for="email" value="Email" />
        <TextInput
          id="email"
          v-model="form.email"
          type="email"
          class="mt-1 block w-full"
          required
          autofocus
          autocomplete="username"
        />
      </div>

      <div class="mt-4">
        <InputLabel for="password" value="Password" />
        <TextInput
          id="password"
          v-model="form.password"
          type="password"
          class="mt-1 block w-full"
          required
          autocomplete="new-password"
        />
      </div>

      <div class="mt-4">
        <InputLabel for="password_confirmation" value="Confirm Password" />
        <TextInput
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          class="mt-1 block w-full"
          required
          autocomplete="new-password"
        />
      </div>

      <div class="flex items-center justify-end mt-4">
        <PrimaryButton class="ml-4" :processing="processing">
          Reset Password
        </PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>
