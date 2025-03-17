import { supabase } from "./supabase";

/**
 * Verifica se o usuário está autenticado
 */
export async function verificarUsuario() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error("⚠️ Usuário não autenticado!", error);
    return null;
  }

  console.log("✅ Usuário autenticado:", data.user);
  return data.user;
}

/**
 * Verifica se a sessão do usuário ainda está ativa
 */
export async function verificarSessao() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session) {
    console.error("⚠️ Sessão ausente ou expirada!", error);
    return null;
  }

  console.log("🔑 Sessão ativa:", data.session);
  return data.session;
}
