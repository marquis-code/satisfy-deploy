import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import type { Login } from "@/api_factory/modules/auth"

export const useCustomerLogin = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loginCustomer = async (credentials: Login) => {
    loading.value = true
    error.value = null

    try {
      const res = (await auth_api.$_customer_login(credentials)) as any
      if (res.type !== "ERROR") {
        // Handle successful login
        return res
      } else {
        error.value = res.data.message || "Login failed"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { loginCustomer, loading, error }
}

