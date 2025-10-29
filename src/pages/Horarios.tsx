import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, User, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const defaultBlock = (turma_id: string, dia_semana: string, aula_numero: number) => ({
  turma_id,
  dia_semana,
  aula_numero,
  disciplina: "",
  professor: "",
  sala: "",
  observacao: "",
});

export default function Horarios() {
  const { t } = useTranslation();
  
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [grade, setGrade] = useState<any[]>([]);

  const [activeTurma, setActiveTurma] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [novaTurmaNome, setNovaTurmaNome] = useState("");
  const [novoAlunoNome, setNovoAlunoNome] = useState("");
  const [novaDisciplinaNome, setNovaDisciplinaNome] = useState("");

  useEffect(() => {
    const last = localStorage.getItem("lovable_last_turma");
    if (last) {
      setActiveTurma(JSON.parse(last));
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (activeTurma) {
      localStorage.setItem("lovable_last_turma", JSON.stringify(activeTurma));
      loadTurmaData(activeTurma.id);
    }
  }, [activeTurma]);

  async function loadAll() {
    setLoading(true);
    try {
      const { data: t } = await supabase.from("turmas").select("*");
      setTurmas(t || []);

      const last = localStorage.getItem("lovable_last_turma");
      if (last) {
        const parsed = JSON.parse(last);
        const found = (t || []).find((x: any) => x.id === parsed.id);
        if (found) setActiveTurma(found);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function loadTurmaData(turmaId: string) {
    setLoading(true);
    try {
      // Carregar alunos vinculados via aluno_turma
      const { data: vinculos } = await supabase
        .from("aluno_turma")
        .select("aluno_id")
        .eq("turma_id", turmaId);
      
      const alunoIds = (vinculos || []).map((v: any) => v.aluno_id);
      
      if (alunoIds.length > 0) {
        const { data: a } = await supabase
          .from("alunos")
          .select("*")
          .in("id", alunoIds);
        setAlunos(a || []);
      } else {
        setAlunos([]);
      }

      const { data: d } = await supabase.from("disciplinas").select("*").eq("turma_id", turmaId);
      setDisciplinas(d || []);

      const { data: g } = await supabase.from("grade_aulas").select("*").eq("turma_id", turmaId);
      const full = ensureFullGrade(turmaId, g || []);
      setGrade(full);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar turma");
    } finally {
      setLoading(false);
    }
  }

  function ensureFullGrade(turmaId: string, existingBlocks: any[]) {
    const blocks = [];
    for (let di = 0; di < DIAS.length; di++) {
      const dia = DIAS[di];
      for (let i = 1; i <= 8; i++) {
        const found = existingBlocks.find((b: any) => b.aula_numero === i && b.dia_semana === dia);
        if (found) blocks.push(found);
        else blocks.push(defaultBlock(turmaId, dia, i));
      }
    }
    return blocks;
  }

  function openTurma(t: any) {
    setActiveTurma(t);
  }

  async function criarTurma() {
    if (!novaTurmaNome.trim()) return;
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Usuário não autenticado");
      return;
    }

    const { data, error } = await supabase
      .from("turmas")
      .insert([{ 
        nome: novaTurmaNome.trim(), 
        tipo_militar: "Marinha do Brasil", 
        situacao: "Em Andamento", 
        ano: new Date().getFullYear(),
        user_id: user.user.id,
        curso_id: "00000000-0000-0000-0000-000000000000" // placeholder
      }])
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Erro ao criar turma");
      return;
    }
    setTurmas((prev) => [...prev, data]);
    setNovaTurmaNome("");
    toast.success("Turma criada ✅");
  }

  async function criarAluno() {
    if (!novoAlunoNome.trim() || !activeTurma) return;
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Usuário não autenticado");
      return;
    }

    const { data, error } = await supabase
      .from("alunos")
      .insert([{ 
        nome_completo: novoAlunoNome.trim(), 
        graduacao: "Soldado", 
        tipo_militar: "Marinha do Brasil",
        user_id: user.user.id
      }])
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Erro ao adicionar aluno");
      return;
    }
    
    // Vincular à turma
    const { error: vinculoError } = await supabase
      .from("aluno_turma")
      .insert([{ aluno_id: data.id, turma_id: activeTurma.id }]);
    
    if (vinculoError) {
      console.error(vinculoError);
      toast.error("Erro ao vincular aluno");
      return;
    }
    
    setAlunos((prev) => [...prev, data]);
    setNovoAlunoNome("");
    toast.success("Aluno adicionado ✅");
  }

  async function criarDisciplina() {
    if (!novaDisciplinaNome.trim() || !activeTurma) return;
    const { data, error } = await supabase
      .from("disciplinas")
      .insert([{ nome: novaDisciplinaNome.trim(), turma_id: activeTurma.id, carga_horaria: 0 }])
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Erro ao criar disciplina");
      return;
    }
    setDisciplinas((prev) => [...prev, data]);
    setNovaDisciplinaNome("");
    toast.success("Disciplina criada ✅");
  }

  async function salvarBloco(b: any) {
    const payload = {
      turma_id: b.turma_id,
      dia_semana: b.dia_semana,
      aula_numero: b.aula_numero,
      disciplina: b.disciplina || "",
      professor: b.professor || "",
      sala: b.sala || "",
      observacao: b.observacao || "",
    };
    const { error } = await supabase
      .from("grade_aulas")
      .upsert(payload, { onConflict: "turma_id,dia_semana,aula_numero" });
    if (error) {
      console.error(error);
      toast.error("Erro ao salvar");
      return;
    }
    toast.success("✅ Salvo automaticamente");
  }

  function onChangeBlock(index: number, field: string, value: string) {
    const copy = [...grade];
    copy[index] = { ...copy[index], [field]: value };
    setGrade(copy);
  }

  async function onSaveBlock(index: number) {
    const b = grade[index];
    if (!activeTurma) return;
    b.turma_id = activeTurma.id;
    await salvarBloco(b);
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-72 bg-card border-r p-4">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">{t('schedules.title')}</h2>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {turmas.map((t) => (
            <button
              key={t.id}
              onClick={() => openTurma(t)}
              className={`w-full text-left px-3 py-2 rounded flex justify-between items-center transition-colors ${
                activeTurma?.id === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded bg-primary"></span>
                <strong>{t.nome}</strong>
              </span>
              <span className="text-sm opacity-70">{t.tipo_militar || "misto"}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <input
            value={novaTurmaNome}
            onChange={(e) => setNovaTurmaNome(e.target.value)}
            placeholder="Nova turma"
            className="w-full p-2 border rounded mb-2 bg-background"
          />
          <button
            onClick={criarTurma}
            className="w-full p-2 bg-primary text-primary-foreground rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Criar Turma
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Painel de Turmas</h1>
            <p className="text-sm text-muted-foreground">Abra uma turma para ver a relação de alunos e a grade de aulas.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm">{activeTurma ? `Turma ativa: ${activeTurma.nome}` : "Nenhuma turma selecionada"}</div>
            <div className="text-xs text-muted-foreground">Horário: Manhã 08:00–12:00 | Tarde 13:00–17:00</div>
          </div>
        </header>

        {!activeTurma && (
          <div className="p-6 bg-card border rounded">Selecione uma turma na barra lateral para começar.</div>
        )}

        {activeTurma && (
          <div className="space-y-6">
            <section className="bg-card p-4 rounded border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Alunos - {activeTurma.nome}</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={novoAlunoNome}
                    onChange={(e) => setNovoAlunoNome(e.target.value)}
                    placeholder="Novo aluno"
                    className="p-2 border rounded bg-background"
                  />
                  <button onClick={criarAluno} className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {alunos.map((al) => (
                  <div key={al.id} className="p-2 border rounded flex items-center justify-between bg-background">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{al.nome_completo}</div>
                        <div className="text-xs text-muted-foreground">ID: {al.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card p-4 rounded border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Disciplinas</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={novaDisciplinaNome}
                    onChange={(e) => setNovaDisciplinaNome(e.target.value)}
                    placeholder="Nova disciplina"
                    className="p-2 border rounded bg-background"
                  />
                  <button onClick={criarDisciplina} className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Criar
                  </button>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {disciplinas
                  .filter((d) => d.turma_id === activeTurma.id)
                  .map((d) => (
                    <div key={d.id} className="px-3 py-1 border rounded text-sm bg-background">
                      {d.nome}
                    </div>
                  ))}
                {disciplinas.filter((d) => d.turma_id === activeTurma.id).length === 0 && (
                  <div className="text-sm text-muted-foreground">Nenhuma disciplina nesta turma.</div>
                )}
              </div>
            </section>

            <section className="bg-card p-4 rounded border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Grade Semanal</h2>
                <div className="text-sm text-muted-foreground">Edite um bloco e clique em Salvar.</div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-3">
                  {DIAS.map((dia, di) => (
                    <div key={dia} className="bg-accent/50 p-2 rounded">
                      <div className="font-medium mb-2">{dia}</div>
                      <div className="space-y-2">
                        {grade
                          .filter((g) => g.dia_semana === dia)
                          .map((b) => {
                            const globalIndex = di * 8 + (b.aula_numero - 1);
                            const isManha = b.aula_numero <= 4;
                            return (
                              <div key={`${dia}-${b.aula_numero}`} className="p-2 border rounded bg-card">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-xs font-semibold">
                                    {isManha ? `Manhã - Aula ${b.aula_numero}` : `Tarde - Aula ${b.aula_numero - 4}`}
                                  </div>
                                  <div className="text-xs text-muted-foreground">50 min</div>
                                </div>

                                <input
                                  placeholder="Disciplina"
                                  value={b.disciplina || ""}
                                  onChange={(e) => onChangeBlock(globalIndex, "disciplina", e.target.value)}
                                  className="w-full p-1 border rounded mb-1 text-sm bg-background"
                                />
                                <input
                                  placeholder="Professor"
                                  value={b.professor || ""}
                                  onChange={(e) => onChangeBlock(globalIndex, "professor", e.target.value)}
                                  className="w-full p-1 border rounded mb-1 text-sm bg-background"
                                />
                                <input
                                  placeholder="Sala"
                                  value={b.sala || ""}
                                  onChange={(e) => onChangeBlock(globalIndex, "sala", e.target.value)}
                                  className="w-full p-1 border rounded mb-1 text-sm bg-background"
                                />
                                <input
                                  placeholder="Observação"
                                  value={b.observacao || ""}
                                  onChange={(e) => onChangeBlock(globalIndex, "observacao", e.target.value)}
                                  className="w-full p-1 border rounded mb-1 text-sm bg-background"
                                />

                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => onSaveBlock(globalIndex)}
                                    className="text-sm px-2 py-1 border rounded hover:bg-accent transition-colors"
                                  >
                                    Salvar
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
