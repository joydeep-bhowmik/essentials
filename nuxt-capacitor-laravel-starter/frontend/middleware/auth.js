import { $api } from "~/lib/$http";

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState("user", async () => {
    try {
      const response = await $api("user");

      return response.data;
    } catch (error) {
      console.error(error);
    }
  });

  if (!user.value) {
    return abortNavigation();
  }
});
