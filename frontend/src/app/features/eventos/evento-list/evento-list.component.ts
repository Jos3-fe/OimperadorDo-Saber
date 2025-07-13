import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../../core/services/evento.service';
import { EventoDTO } from '../../../core/models/EventoDTO';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Curso } from '../../../core/models/curso';

interface EventoTemplate {
    id?: number;
    titulo: string;
    data: string;
    dataEvento: string;
    local: string;
    descricao: string;
    imgUrl3: string;
    linkInscricao: string;
    destaque: boolean;
}

interface EventosResponse {
    content: EventoTemplate[];
    totalElements: number;
}

@Component({
    selector: 'app-evento-list',
    standalone: true,
    imports: [CommonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './evento-list.component.html',
    styleUrls: ['./evento-list.component.scss']
})
export class EventoListComponent implements OnInit {

    curso: Curso | undefined;
    eventos: EventosResponse = { content: [], totalElements: 0 };
    loading = true;
    error: string | null = null;

    // Parâmetros de paginação
    page = 0;
    size = 10;
    sortBy = 'dataEvento';
    sortDir = 'asc';

    constructor(
        private eventoService: EventoService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.carregarEventos();
    }

    carregarEventos(): void {
        this.loading = true;
        this.error = null;

        this.eventoService.getEventosPaginated(this.page, this.size, this.sortBy, this.sortDir)
            .pipe(
                map((response: any) => ({
                    content: response.content.map((evento: EventoDTO) => this.mapearEventoParaTemplate(evento)),
                    totalElements: response.totalElements
                })),
                catchError((error: any) => {
                    console.error('Erro ao carregar eventos:', error);
                    this.error = 'Erro ao carregar eventos';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao carregar eventos'
                    });
                    return of({ content: [], totalElements: 0 });
                })
            )
            .subscribe({
                next: (response: EventosResponse) => {
                    this.eventos = response;
                    this.loading = false;
                },
                error: (error: any) => {
                    this.loading = false;
                    console.error('Erro na subscrição:', error);
                }
            });
    }

    private mapearEventoParaTemplate(evento: EventoDTO): EventoTemplate {
        return {
            id: evento.id,
            titulo: evento.titulo,
            data: evento.dataEvento,
            dataEvento: evento.dataEvento,
            local: evento.local || 'Local a definir',
            descricao: evento.descricao || 'Descrição não disponível',
            imgUrl3: evento.imgUrl || 'assets/images/default-event.jpg',
            linkInscricao: '#',
            destaque: false
        };
    }

    formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleDateString('pt-AO', options);
    }
}