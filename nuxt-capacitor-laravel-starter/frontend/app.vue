<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const userStore = useUsers();

try {
  await userStore.getUserData();
} catch (error) {
  console.log(error);
}
</script>
