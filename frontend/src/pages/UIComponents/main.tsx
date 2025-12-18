import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/core/components/card';
import { Button } from '@/core/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/core/components/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/core/components/dropdown-menu';
import { Calendar } from '@/core/components/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/core/components/accordion';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { useUIComponents } from '@/domain/uiComponents/hooks/useUIComponents';
import { ChevronDownIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

function UIComponentsPage() {
  const { isLoading, createToast } = useUIComponents();

  // Modal states
  const [primaryModalOpen, setPrimaryModalOpen] = useState(false);
  const [secondaryModalOpen, setSecondaryModalOpen] = useState(false);

  // Kanban states
  const [kanbanColumns, setKanbanColumns] = useState({
    todo: [
      {
        id: 'card-1',
        title: 'Implementar Login',
        description: 'Implementar sistema de autenticação de usuários',
      },
      {
        id: 'card-2',
        title: 'Criar Dashboard',
        description: 'Desenvolver painel principal com métricas',
      },
      {
        id: 'card-3',
        title: 'Testar API',
        description: 'Executar testes automatizados da API REST',
      },
    ],
    progress: [] as Array<{ id: string; title: string; description: string }>,
    done: [] as Array<{ id: string; title: string; description: string }>,
  });
  const [draggedCard, setDraggedCard] = useState<{ id: string; fromColumn: string } | null>(null);

  // Calendar state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Tab state
  const [activeTab, setActiveTab] = useState('profile');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Drag and drop handlers
  const handleDragStart = (cardId: string, fromColumn: string) => {
    setDraggedCard({ id: cardId, fromColumn });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toColumn: string) => {
    if (!draggedCard) return;

    const fromColumn = draggedCard.fromColumn as keyof typeof kanbanColumns;
    const card = kanbanColumns[fromColumn].find((c) => c.id === draggedCard.id);
    if (!card) return;

    setKanbanColumns((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((c) => c.id !== draggedCard.id),
      [toColumn]: [...prev[toColumn as keyof typeof kanbanColumns], card],
    }));

    setDraggedCard(null);
  };

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'history' && !historyLoaded) {
      setHistoryLoading(true);
      setTimeout(() => {
        setHistoryLoading(false);
        setHistoryLoaded(true);
      }, 3000);
    }
  };

  // Disable weekends and past dates
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = date.getDay();
    return date < today || day === 0 || day === 6;
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Componentes de Interface</h1>
        <p className="text-muted-foreground">
          Demonstração de componentes interativos para testes de automação QA
        </p>
      </div>

      {/* Modais Sobrepostos */}
      <Card>
        <CardHeader>
          <CardTitle>Modais Sobrepostos</CardTitle>
          <CardDescription>Teste de modais com diferentes níveis de z-index</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setPrimaryModalOpen(true)}>Abrir Modal Principal</Button>

          <Dialog open={primaryModalOpen} onOpenChange={setPrimaryModalOpen}>
            <DialogContent className="z-[1000]">
              <DialogHeader>
                <DialogTitle>Modal Principal</DialogTitle>
                <DialogDescription>
                  Este é o modal principal. Clique no botão abaixo para abrir um modal secundário.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Conteúdo do modal principal</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPrimaryModalOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => setSecondaryModalOpen(true)}>Abrir Modal Secundário</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={secondaryModalOpen} onOpenChange={setSecondaryModalOpen}>
            <DialogContent className="z-[1100]">
              <DialogHeader>
                <DialogTitle>Modal Secundário</DialogTitle>
                <DialogDescription>
                  Este modal aparece sobre o modal principal com z-index superior.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Conteúdo do modal secundário</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setSecondaryModalOpen(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tooltips Interativos */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltips Interativos</CardTitle>
          <CardDescription>Tooltips em diferentes posições</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Botão Superior</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip posicionado abaixo</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Botão Inferior</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Tooltip posicionado acima</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Botão Esquerdo</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip posicionado à direita</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Botão Direito</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tooltip posicionado à esquerda</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dropdowns Aninhados */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdowns Aninhados</CardTitle>
          <CardDescription>Menu dropdown com submenus</CardDescription>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu Principal
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Item com Submenu</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Subitem 1</DropdownMenuItem>
                  <DropdownMenuItem>Subitem 2</DropdownMenuItem>
                  <DropdownMenuItem>Subitem 3</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>Item 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Sistema Drag-and-Drop Kanban */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema Drag-and-Drop Kanban</CardTitle>
          <CardDescription>Arraste os cartões entre as colunas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(['todo', 'progress', 'done'] as const).map((columnId) => (
              <div
                key={columnId}
                className="bg-muted/30 rounded-lg border p-4"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(columnId)}
              >
                <h3 className="mb-4 font-semibold">
                  {columnId === 'todo'
                    ? 'A Fazer'
                    : columnId === 'progress'
                    ? 'Em Progresso'
                    : 'Concluído'}
                </h3>
                <div className="space-y-2">
                  {kanbanColumns[columnId].map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id, columnId)}
                      className="bg-card cursor-move rounded-md border p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <h4 className="font-medium">{card.title}</h4>
                      <p className="text-muted-foreground text-sm">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendário de Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Agendamento</CardTitle>
          <CardDescription>
            Selecione um intervalo de datas (fins de semana e datas passadas desabilitados)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            disabled={isDateDisabled}
            numberOfMonths={2}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Abas com Carregamento Dinâmico */}
      <Card>
        <CardHeader>
          <CardTitle>Abas com Carregamento Dinâmico</CardTitle>
          <CardDescription>A aba "Histórico" simula carregamento de 3 segundos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" />
              </div>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Alterar Senha</h4>
                    <p className="text-muted-foreground text-sm">
                      Atualize sua senha periodicamente
                    </p>
                  </div>
                  <Button variant="outline">Alterar</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                    <p className="text-muted-foreground text-sm">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Button variant="outline">Ativar</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history">
              {historyLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <LoadingSpinner className="h-8 w-8" />
                </div>
              ) : historyLoaded ? (
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Login realizado</p>
                    <p className="text-muted-foreground text-sm">Há 2 horas</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Perfil atualizado</p>
                    <p className="text-muted-foreground text-sm">Há 1 dia</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Senha alterada</p>
                    <p className="text-muted-foreground text-sm">Há 3 dias</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Clique na aba para carregar o histórico</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Acordeões FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Acordeões FAQ</CardTitle>
          <CardDescription>Perguntas frequentes com respostas expansíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como posso alterar minha senha?</AccordionTrigger>
              <AccordionContent>
                Acesse Configurações &gt; Segurança &gt; Alterar Senha. Digite sua senha atual e a
                nova senha duas vezes para confirmar.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como ativar a autenticação de dois fatores?</AccordionTrigger>
              <AccordionContent>
                Vá em Configurações &gt; Segurança &gt; Autenticação de Dois Fatores. Escaneie o
                código QR com seu aplicativo autenticador e digite o código de verificação.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Como recuperar minha conta bloqueada?</AccordionTrigger>
              <AccordionContent>
                Entre em contato com o suporte através do email suporte@exemplo.com informando seu
                nome de usuário e o motivo do bloqueio.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Sistema de Notificações Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Notificações Toast</CardTitle>
          <CardDescription>
            Diferentes tipos de notificações com comportamentos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => createToast('success')} variant="default">
              Toast de Sucesso (4s)
            </Button>
            <Button onClick={() => createToast('error')} variant="destructive">
              Toast de Erro (Manual)
            </Button>
            <Button onClick={() => createToast('warning')} variant="outline">
              Toast de Aviso (6s)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { UIComponentsPage };
