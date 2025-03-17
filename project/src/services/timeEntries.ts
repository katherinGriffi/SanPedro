import { supabase } from '../lib/supabase';

export type TimeEntry = {
  id?: string;
  user_id: string;
  workplace: string;
  start_time?: string;
  end_time?: string;
};



// Criar um novo apontamento (Iniciar expediente)
export async function createTimeEntry(user_id: string, workplace: string) {
  if (!user_id) {
    console.error("Erro: user_id não pode ser nulo.");
    return null;
  }

  const entry = {
    user_id,
    workplace,
    start_time: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('time_entries').insert([entry]).select().single();

  if (error) {
    console.error('Erro ao criar registro de expediente:', error.message);
    return null;
  }

  return data;
}

// Atualizar apontamento (Finalizar expediente)
export async function updateTimeEntry(entry_id: string) {
  if (!entry_id) {
    console.error("Erro: entry_id não pode ser nulo.");
    return null;
  }

  const { data, error } = await supabase
    .from('time_entries')
    .update({ end_time: new Date().toISOString() })
    .eq('id', entry_id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao finalizar expediente:', error.message);
    return null;
  }

  return data;
}