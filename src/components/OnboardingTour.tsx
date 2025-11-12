import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { supabase } from "@/integrations/supabase/client";

export const OnboardingTour = () => {
  const [runTour, setRunTour] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Bem-vindo ao Gestor Escolar! 🎓</h2>
          <p>Vamos fazer um tour rápido pelas principais funcionalidades do sistema. Clique em "Avançar" para começar.</p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📊 Dashboard</h3>
          <p>Aqui você visualiza estatísticas gerais, cards customizáveis e informações consolidadas sobre alunos, cursos e turmas.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="alunos"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">👨‍🎓 Alunos</h3>
          <p>Gerencie o cadastro completo de alunos: dados pessoais, contatos, graduação, função e local de serviço.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="instrutores"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">👨‍🏫 Instrutores</h3>
          <p>Cadastre e organize instrutores com informações como especialidade, contatos e graduação.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="cursos"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📚 Cursos</h3>
          <p>Administre os cursos disponíveis: tipo, modalidade, local de realização e informações do coordenador.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="turmas"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">🏫 Turmas</h3>
          <p>Crie e gerencie turmas vinculadas a cursos, incluindo alunos matriculados, datas e situação da turma.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="horarios"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📅 Horários</h3>
          <p>Monte grades de horários para as turmas com disciplinas, instrutores e períodos semanais.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="notas"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📝 Notas</h3>
          <p>Registre e acompanhe as notas dos alunos por disciplina, incluindo notas de recuperação e médias.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="certificados"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">🎖️ Certificados</h3>
          <p>Crie templates de certificados personalizados e gere certificados para alunos de forma individual ou em massa.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="relatorios"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📄 Relatórios</h3>
          <p>Gere relatórios detalhados de alunos, turmas e estatísticas para análise e impressão.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="estatisticas"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">📈 Estatísticas</h3>
          <p>Visualize gráficos e análises estatísticas sobre o desempenho e distribuição de alunos no sistema.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="ai-assistant"]',
      content: (
        <div>
          <h3 className="font-bold mb-2">🤖 Assistente IA</h3>
          <p>Use o assistente virtual "Gestor" para consultar dados, gerar insights e receber ajuda com comandos de voz.</p>
        </div>
      ),
      placement: "left",
    },
    {
      target: "body",
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Tour Concluído! 🎉</h2>
          <p>Agora você conhece todas as principais funcionalidades do Gestor Escolar. Explore à vontade!</p>
          <p className="mt-2 text-sm text-muted-foreground">Você pode refazer este tour a qualquer momento nas configurações do seu perfil.</p>
        </div>
      ),
      placement: "center",
    },
  ];

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Verificar se já viu o tour
          const tourKey = `onboarding_tour_completed_${user.id}`;
          const hasSeenTour = localStorage.getItem(tourKey);
          
          if (!hasSeenTour) {
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
              setRunTour(true);
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar primeira visita:', error);
      }
    };

    checkFirstVisit();
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) && userId) {
      // Marcar tour como concluído
      const tourKey = `onboarding_tour_completed_${userId}`;
      localStorage.setItem(tourKey, "true");
      setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: 6,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: 10,
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Concluir",
        next: "Avançar",
        skip: "Pular",
      }}
    />
  );
};
