import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Definição da interface para os detalhes do curso
interface CursoDetalhe {
  id: number;
  titulo: string;
  subtitulo: string;
  descricaoCompleta: string;
  publicoAlvo: string[];
  prerequisitos: string[];
  modulos: { titulo: string; topicos: string[] }[];
  duracao: string;
  modalidade: string;
  vagasDisponiveis: number;
  dataInicioProximaTurma: string;
  cargaHoraria: string;
  certificacao: string;
  imagemCapa: string;
  beneficios: string[];
  categoria?: string; // Tornar opcional, pois será inferido pela estrutura
  metodologia?: string; // Propriedades adicionais para pré-escolar
  metodologiaTopicos?: string[];
  estrutura?: string;
  estruturaTopicos?: string[];
}

@Component({
  selector: 'app-curso-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso-detail.component.html',
  styleUrls: ['./curso-detail.component.scss']
})
export class CursoDetailComponent implements OnInit {
  curso: CursoDetalhe | undefined;
  categoria: string = '';
  nome: string | null = null;

  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    // Subscreve às mudanças nos parâmetros da rota
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria') || ''; // Obtém a categoria
      this.nome = params.get('nome'); // Obtém o nome do curso (para II Ciclo)

      if (this.categoria) {
        this.loadCursoDetails(); // Carrega os detalhes se a categoria estiver presente
      } else {
        // Redireciona para a página de cursos se a categoria não for encontrada
        this.router.navigate(['/cursos']);
      }
    });
  }

  loadCursoDetails(): void {
    // Dados mockados organizados por categoria e, para o II Ciclo, por nome do curso
    const cursosMockados: { [key: string]: any } = {
      'PRE_ESCOLAR': {
        id: 1,
        titulo: 'Educação Pré-Escolar',
        subtitulo: 'Primeiros Passos no Mundo do Conhecimento',
        descricaoCompleta: 'Nosso programa de Educação Pré-Escolar oferece um ambiente acolhedor e estimulante para crianças de 3 a 5 anos, com atividades lúdicas que promovem o desenvolvimento integral nos aspectos físico, psicológico, intelectual e social. Trabalhamos com uma abordagem pedagógica inovadora que respeita o ritmo de aprendizagem de cada criança.',
        publicoAlvo: [
          'Crianças de 3 anos (Jardim I)',
          'Crianças de 4 anos (Jardim II)',
          'Crianças de 5 anos (Jardim III)'
        ],
        prerequisitos: [
          'Idade mínima de 3 anos completos até 31 de março',
          'Cartão de vacinação atualizado',
          'Exame médico recente'
        ],
        modulos: [
          {
            titulo: 'Desenvolvimento Integral',
            topicos: [
              'Estimulação psicomotora',
              'Desenvolvimento da linguagem oral',
              'Percepção sensorial',
              'Coordenação motora fina e grossa'
            ]
          },
          {
            titulo: 'Socialização e Autonomia',
            topicos: [
              'Hábitos de higiene e organização',
              'Regras de convivência',
              'Expressão de sentimentos',
              'Trabalho em grupo'
            ]
          },
          {
            titulo: 'Iniciação ao Conhecimento',
            topicos: [
              'Pré-alfabetização',
              'Conceitos matemáticos básicos',
              'Exploração do meio ambiente',
              'Arte e criatividade'
            ]
          }
        ],
        duracao: '3 Anos (Divididos em Jardim I, II e III)',
        modalidade: 'Presencial (Período Matutino ou Vespertino)',
        vagasDisponiveis: 25,
        dataInicioProximaTurma: '2025-02-03T07:30:00',
        cargaHoraria: '25 horas semanais (4 horas diárias)',
        certificacao: 'Certificado de Conclusão da Educação Pré-Escolar',
        imagemCapa: '/../../../../assets/cursos/preescolar.jpeg',
        beneficios: [
          'Ambiente seguro e adaptado para crianças',
          'Professores especializados em educação infantil',
          'Alimentação balanceada supervisionada',
          'Atividades extracurriculares: música, educação física e artes',
          'Acompanhamento psicológico e pedagógico',
          'Preparação para a transição ao Ensino Primário'
        ],
        categoria: 'pre-escolar',
        metodologia: 'Utilizamos o método sócio-construtivista, com ênfase em:',
        metodologiaTopicos: [
          'Aprendizagem através de brincadeiras dirigidas',
          'Projetos temáticos interdisciplinares',
          'Contato com a natureza e experimentação',
          'Uso de tecnologias educacionais apropriadas'
        ],
        estrutura: 'Nossa estrutura inclui:',
        estruturaTopicos: [
          'Salas de aula amplas e coloridas',
          'Parque infantil coberto e descoberto',
          'Biblioteca infantil',
          'Sala de psicomotricidade',
          'Refeitório exclusivo',
          'Sanitários adaptados'
        ]
      },
      'ENSINO_PRIMARIO': {
        id: 2,
        titulo: 'Ensino Primário',
        subtitulo: 'Educação Básica',
        descricaoCompleta: 'Ensino fundamental do 1º ao 6º ano...',
        publicoAlvo: ['Crianças de 6 a 12 anos'],
        prerequisitos: ['Idade mínima de 6 anos'],
        modulos: [
          { titulo: 'Módulo 1: Língua Portuguesa', topicos: ['Leitura', 'Escrita'] },
          { titulo: 'Módulo 2: Matemática', topicos: ['Operações Básicas', 'Geometria'] }
        ],
        duracao: '6 Anos',
        modalidade: 'Presencial',
        vagasDisponiveis: 50,
        dataInicioProximaTurma: '2025-02-01T08:00:00',
        cargaHoraria: '5400 horas',
        certificacao: 'Certificado de Conclusão',
        imagemCapa: '../../../../assets/cursos/iniciacao.jpeg',
        beneficios: ['Formação básica', 'Desenvolvimento intelectual', 'Preparação para ciclos seguintes'],
        categoria: 'ensino-primario'
      },
      'PRIMEIRO_CICLO': {
        id: 3,
        titulo: 'I Ciclo',
        subtitulo: 'Ensino Secundário - Ciclo Inicial',
        descricaoCompleta: 'Ciclo inicial do ensino secundário...',
        publicoAlvo: ['Jovens de 12 a 15 anos'],
        prerequisitos: ['Conclusão do ensino primário'],
        modulos: [
          { titulo: 'Módulo 1: Ciências Naturais', topicos: ['Biologia', 'Química'] },
          { titulo: 'Módulo 2: Ciências Sociais', topicos: ['História', 'Geografia'] }
        ],
        duracao: '3 Anos',
        modalidade: 'Presencial',
        vagasDisponiveis: 45,
        dataInicioProximaTurma: '2025-02-01T08:00:00',
        cargaHoraria: '3600 horas',
        certificacao: 'Certificado de Conclusão',
        imagemCapa: 'assets/images//../../../../assets/cursos/base.jpeg',
        beneficios: ['Formação geral', 'Preparação para II Ciclo', 'Desenvolvimento crítico'],
        categoria: 'primeiro-ciclo'
      },
      // Dados para o SEGUNDO_CICLO devem estar num único objeto
      'SEGUNDO_CICLO': {
        'Informática de Gestão': {
          id: 4,
          titulo: 'Informática de Gestão',
          subtitulo: 'Curso Científico-Tecnológico',
          descricaoCompleta: 'Curso do ensino secundário que combina informática com gestão, preparando alunos para o ensino superior em áreas tecnológicas e empresariais.',
          publicoAlvo: ['Alunos que concluiram o 9º ano, com interesse em tecnologia'],
          prerequisitos: ['Ter concluiod o 9º ano(ensino de báse)'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Matemática',
                'Tecnologias de Informação',
                'Economia'
              ]
            },
            {
              titulo: 'Opções Técnicas',
              topicos: [
                'Programação Básica',
                'Sistemas de Informação',
                'Gestão de Projetos'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          dataInicioProximaTurma: '2025-09-15T08:00:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Diploma do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
                      
          beneficios: [
            'Preparação para cursos superiores na área tecnológica',
            'Desenvolvimento de raciocínio lógico',
            'Base para certificações em TI'
          ],
          categoria: 'segundo-ciclo'
        },
        'Contabilidade e Gestão': {
          id: 1, // Atenção: id repetido, pode causar confusão se usado como identificador único
          titulo: 'Contabilidade e Gestão',
          subtitulo: 'Curso de Ciências Socioeconómicas',
          descricaoCompleta: 'Curso secundário com enfoque em economia e gestão, ideal para alunos interessados em áreas empresariais e contabilidade.',
          publicoAlvo: ['Alunos que concluiram o 9º ano'],
          prerequisitos: ['Ter concluiod o 9º ano(ensino de báse)'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Economia',
                'Contabilidade',
                'Matemática Aplicada'
              ]
            },
            {
              titulo: 'Opções',
              topicos: [
                'Direito',
                'Gestão',
                'Estatística'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          vagasDisponiveis: 30,
          dataInicioProximaTurma: '2025-09-15T08:00:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Diploma do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
          beneficios: [
            'Preparação para cursos superiores em gestão',
            'Base para concursos administrativos',
            'Desenvolvimento de competências analíticas'
          ],
          categoria: 'segundo-ciclo'
        },
        'Finanças': {
          id: 5,
          titulo: 'Finanças',
          subtitulo: 'Curso de Ciências Socioeconómicas',
          descricaoCompleta: 'Curso do ensino secundário com enfoque em economia e finanças, preparando alunos para o ensino superior nas áreas de gestão, economia e contabilidade.',
          publicoAlvo: ['Alunos concluintes do 9º ano com interesse em economia'],
          prerequisitos: ['Aprovação no 9º ano'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Economia A',
                'Matemática Aplicada às Ciências Sociais',
                'Contabilidade'
              ]
            },
            {
              titulo: 'Opções',
              topicos: [
                'Introdução às Finanças',
                'Mercados Financeiros',
                'Estatística'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          vagasDisponiveis: 28,
          dataInicioProximaTurma: '2025-09-01T08:30:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Diploma do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
          beneficios: [
            'Preparação para cursos superiores em economia e gestão',
            'Base para concursos na área financeira',
            'Desenvolvimento de raciocínio quantitativo'
          ],
          categoria: 'segundo-ciclo'
        },
        'Gestão Comercial e Marketing': {
          id: 4, // Atenção: id repetido, pode causar confusão se usado como identificador único
          titulo: 'Gestão Comercial e Marketing',
          subtitulo: 'Curso de Ciências Sociais',
          descricaoCompleta: 'Curso secundário que explora conceitos de gestão, comunicação e comportamento do consumidor, com aplicações práticas em projetos escolares.',
          publicoAlvo: ['Alunos que concluiram o 9º ano'],
          prerequisitos: ['Ter concluiod o 9º ano(ensino de báse)'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Economia',
                'Psicologia',
                'Sociologia'
              ]
            },
            {
              titulo: 'Opções',
              topicos: [
                'Introdução ao Marketing',
                'Técnicas de Comunicação',
                'Projetos Empresariais'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          vagasDisponiveis: 35,
          dataInicioProximaTurma: '2025-09-15T08:00:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Diploma do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
          beneficios: [
            'Base para cursos superiores em comunicação e gestão',
            'Desenvolvimento de competências sociais',
            'Participação em feiras e projetos escolares'
          ],
          categoria: 'segundo-ciclo'
        },
        'Ciências Económicas e Jurídicas': {
          id: 5, // Atenção: id repetido, pode causar confusão se usado como identificador único
          titulo: 'Ciências Económicas e Jurídicas',
          subtitulo: 'Curso de Ciências Sociais e Humanas',
          descricaoCompleta: 'Curso secundário que integra conhecimentos de economia, direito e sociologia, com enfoque na análise de questões sociais contemporâneas.',
          publicoAlvo: ['Alunos que concluiram o 9º ano'],
          prerequisitos: ['Ter concluiod o 9º ano(ensino de báse)'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Economia A',
                'Direito',
                'História'
              ]
            },
            {
              titulo: 'Opções',
              topicos: [
                'Relações Internacionais',
                'Políticas Públicas',
                'Projetos de Cidadania'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          vagasDisponiveis: 22,
          dataInicioProximaTurma: '2025-09-15T08:00:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Diploma do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
          beneficios: [
            'Preparação para cursos superiores em direito e ciências sociais',
            'Participação em modelos das Nações Unidas',
            'Visitas de estudo a instituições públicas'
          ],
          categoria: 'segundo-ciclo'
        },
        'Construção Civil': {
          id: 6,
          titulo: 'Construção Civil',
          subtitulo: 'Curso Científico-Tecnológico',
          descricaoCompleta: 'Curso secundário com componente técnica em construção, integrando conhecimentos de matemática, física e tecnologias aplicadas.',
          publicoAlvo: ['Alunos que concluiram o 9º ano'],
          prerequisitos: ['Ter concluiod o 9º ano(ensino de báse)'],
          modulos: [
            {
              titulo: 'Tronco Comum',
              topicos: [
                'Português',
                'Inglês',
                'Filosofia',
                'Educação Física'
              ]
            },
            {
              titulo: 'Disciplinas Específicas',
              topicos: [
                'Matemática B',
                'Física e Química',
                'Desenho Técnico'
              ]
            },
            {
              titulo: 'Opções Técnicas',
              topicos: [
                'Tecnologias de Construção',
                'Segurança e Ambiente',
                'Projetos de Engenharia'
              ]
            }
          ],
          duracao: '4 Anos (10º-13º ano)',
          modalidade: 'Presencial',
          vagasDisponiveis: 20,
          dataInicioProximaTurma: '2025-09-15T08:00:00',
          cargaHoraria: '32 horas semanais',
          certificacao: 'Certificado do Ensino Secundário',
          imagemCapa: '/../../../../assets/cursos/informatica.jpeg',
          beneficios: [
            'Preparação para cursos superiores em engenharia',
            'Participação em projetos interdisciplinares',
            'Visitas técnicas a obras e laboratórios'
          ],
          categoria: 'segundo-ciclo'
        }
      }
    };

    // Verifica se a categoria é 'SEGUNDO_CICLO' e se o nome do curso foi fornecido
    if (this.categoria === 'SEGUNDO_CICLO' && this.nome) {
      const cursosDoCiclo = cursosMockados[this.categoria];
      if (cursosDoCiclo) {
        // Tenta encontrar o curso usando o nome exato (ignorando caixa)
        const cursoKey = Object.keys(cursosDoCiclo).find(key =>
            key.toLowerCase() === this.nome?.toLowerCase()
        );
        if (cursoKey) {
          this.curso = cursosDoCiclo[cursoKey]; // Atribui o curso encontrado
        }
      }
    } else {
      // Para as outras categorias (Pré, Primário e I Ciclo), busca diretamente pela categoria
      this.curso = cursosMockados[this.categoria];
    }

    console.log('Curso encontrado:', this.curso);

    // Se o curso não for encontrado, exibe um erro e redireciona
    if (!this.curso) {
      console.error('Curso não encontrado para:', {
        categoria: this.categoria,
        nomeCurso: this.nome
      });
      this.router.navigate(['/cursos']);
    }
  }
}
