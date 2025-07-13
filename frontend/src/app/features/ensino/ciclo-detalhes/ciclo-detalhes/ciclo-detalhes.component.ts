import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Interface para a estrutura de dados de detalhes de ciclo
interface CicloDetalhe {
  id: number;
  titulo: string;
  subtitulo: string;
  descricaoCompleta: string;
  faixaEtaria: string;
  objectivos: string[];
  disciplinasPrincipais: string[];
  atividadesExtracurriculares: string[]; // Adicionado!
  imagemCapa: string;
}

@Component({
  selector: 'app-ciclo-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // Para o botão de voltar, por exemplo
  ],
  templateUrl: './ciclo-detalhes.component.html',
  styleUrls: ['./ciclo-detalhes.component.scss']
})
export class CicloDetalhesComponent implements OnInit {
  ciclo: CicloDetalhe | undefined;

  constructor(private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const cicloId = +id;

        // Dados mockados para Ensino Primário e I Ciclo
        if (cicloId === 101) { // ID para Ensino Primário
          this.ciclo = {
            id: 101,
            titulo: 'Ensino Primário',
            subtitulo: 'A Base do Conhecimento para o Futuro',
            descricaoCompleta: 'O nosso programa de Ensino Primário foca no desenvolvimento integral da criança, abrangendo do 1º ao 6º ano. Priorizamos uma aprendizagem lúdica e estimulante que constrói uma base sólida em leitura, escrita, matemática e ciências, ao mesmo tempo em que fomenta a criatividade e o pensamento crítico.',
            faixaEtaria: '6 a 11 anos',
            objectivos: [
              'Desenvolvimento da literacia e numeracia',
              'Estímulo à curiosidade e ao gosto pela aprendizagem',
              'Promoção da socialização e valores morais',
              'Desenvolvimento de habilidades cognitivas básicas'
            ],
            disciplinasPrincipais: ['Língua Portuguesa', 'Matemática', 'Estudo do Meio', 'Educação Moral e Cívica', 'Educação Artística', 'Educação Física'],
            atividadesExtracurriculares: [ // Conforme a imagem
              'Aula de Reforço',
              'Capoeira',
              'Francês',
              'Ballet',
              'Música',
              'Natação',
              'Xadrez',
              'Inglês',
              'ATL (Actividades de Tempos Livres)'
            ],
            imagemCapa: 'assets/images/ensino-primario-banner.jpg' // Adicionar imagem apropriada
          };
        } else if (cicloId === 201) { // ID para I Ciclo
          this.ciclo = {
            id: 201,
            titulo: 'I Ciclo',
            subtitulo: 'Aprofundamento e Preparação para o Ensino Médio',
            descricaoCompleta: 'O I Ciclo (7ª a 9ª Classe) é uma fase crucial de transição e aprofundamento do conhecimento. Nosso currículo é desenhado para fortalecer as competências adquiridas no primário e introduzir conceitos mais complexos nas diversas áreas do saber, preparando os alunos para os desafios do Ensino Médio e desenvolvendo a sua autonomia.',
            faixaEtaria: '12 a 14 anos',
            objectivos: [
              'Consolidação de conhecimentos nas disciplinas base',
              'Desenvolvimento do raciocínio lógico e da capacidade de análise',
              'Estímulo à participação cívica e à consciência social',
              'Orientação vocacional inicial'
            ],
            disciplinasPrincipais: ['Língua Portuguesa', 'Matemática', 'Física e Química', 'Biologia', 'Geografia', 'História', 'Inglês', 'Educação Visual e Tecnológica'],
            atividadesExtracurriculares: [ // Conforme a imagem
              'Aula de Reforço',
              'Capoeira',
              'Francês',
              'Ballet',
              'Música',
              'Natação',
              'Xadrez',
              'Inglês',
              'ATL (Actividades de Tempos Livres)'
            ],
            imagemCapa: 'assets/images/i-ciclo-banner.jpg' // Adicionar imagem apropriada
          };
        } else {
          // Se o ID não corresponder a um ciclo conhecido, redireciona
          this.router.navigate(['/curso']);
        }
      } else {
        // Se não houver ID na URL, redireciona
        this.router.navigate(['/cursos']);
      }
    });
  }
}