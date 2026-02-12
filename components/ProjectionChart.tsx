import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FinancialData, ChartDataPoint } from '../types';

interface ProjectionChartProps {
  data: FinancialData;
  onContinue: () => void;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, onContinue }) => {
  
  const chartData = useMemo(() => {
    const points: ChartDataPoint[] = [];
    const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
    
    // User path: Linear or slow growth
    // MentorFlow path: Exponential growth
    let currentUserRev = data.userMonthlyRevenue;
    let currentMentorRev = data.benchmarkMonthlyRevenue; // Starts higher due to immediate optimization
    
    months.forEach((month, index) => {
      // User grows 2% per month (organic/slow)
      currentUserRev = currentUserRev * 1.02;
      
      // MentorFlow grows 15% month over month (ads + funnel scaling)
      // Cap at reasonable max for realism if it goes too high, but let it fly for "Greed"
      currentMentorRev = currentMentorRev * 1.15;
      
      points.push({
        month,
        userRevenue: Math.round(currentUserRev),
        mentorFlowRevenue: Math.round(currentMentorRev)
      });
    });
    
    return points;
  }, [data]);

  const totalUser = chartData[11].userRevenue;
  const totalMentor = chartData[11].mentorFlowRevenue;
  const multiplier = (totalMentor / totalUser).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col animate-fade-in p-2 md:p-6 bg-zinc-900/90 border border-zinc-800 rounded-lg shadow-2xl relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
            Projeção de Receita <span className="text-yellow-500">(12 Meses)</span>
          </h2>
          <p className="text-zinc-400 text-sm">Análise de escalabilidade baseada na implementação MentorFlow.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-600 rounded-sm"></div>
                <span className="text-zinc-400">CAMINHO ATUAL</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                <span className="text-yellow-400 font-bold">CAMINHO MENTORFLOW</span>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-950/50 p-4 rounded border border-zinc-800">
            <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Cenário Atual</div>
            <div className="text-2xl font-mono text-zinc-300">R$ {data.userMonthlyRevenue.toLocaleString('pt-BR')} <span className="text-sm text-zinc-600">/mês</span></div>
            <div className="mt-2 text-xs text-zinc-500">
                Vendas: {data.userSales} | Ticket: R$ {data.userTicket.toLocaleString('pt-BR')}
            </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-900/20 to-zinc-900 p-4 rounded border border-yellow-500/30 relative">
             <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded uppercase">Potencial Otimizado</div>
            <div className="text-xs text-yellow-600 uppercase font-bold mb-1">Média do Setor</div>
            <div className="text-3xl font-mono text-yellow-400 font-bold">R$ {data.benchmarkMonthlyRevenue.toLocaleString('pt-BR')} <span className="text-sm text-yellow-600">/mês</span></div>
             <div className="mt-2 text-xs text-yellow-700/80">
                Vendas: {data.benchmarkSales} | Ticket: R$ {data.benchmarkTicket.toLocaleString('pt-BR')}
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-grow w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52525b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#52525b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMentor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="month" stroke="#52525b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
            <YAxis 
                stroke="#52525b" 
                tick={{fontSize: 10}} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `R$${value/1000}k`}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#3f3f46', borderRadius: '4px' }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area 
                type="monotone" 
                dataKey="userRevenue" 
                stroke="#71717a" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUser)" 
                name="Seu Caminho"
            />
            <Area 
                type="monotone" 
                dataKey="mentorFlowRevenue" 
                stroke="#eab308" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMentor)" 
                name="MentorFlow"
                animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <p className="text-zinc-400 text-sm mb-4 md:mb-0 max-w-lg">
            <span className="text-yellow-500 font-bold text-lg mr-2">Insight:</span>
            Seu modelo atual deixa <span className="text-white font-bold">{multiplier}x</span> de crescimento na mesa. O MentorFlow estrutura a máquina de vendas para atingir essa curva.
        </p>
        <button 
            onClick={onContinue}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm rounded transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]"
        >
            Retomar Diagnóstico &gt;
        </button>
      </div>

    </div>
  );
};

export default ProjectionChart;
