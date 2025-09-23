import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from "ngx-pagination"
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  providers:[],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input({ required: true }) items: any[] = []
  @Input({ required: true }) totalItems!: number
  @Input() limit = 20
  @Input() offset = 0
  @Input() id = "paginate"
  @Input() options = [20, 40, 60, 80, 100]

  @Output() pageChange = new EventEmitter()
  @Output() limitChange = new EventEmitter()

  constructor(
    private utilService: UtilityService,
  ){ }

  ngOnChanges(): void {
    this.setPaginationString()
  }

  paginationString: string = ""

  setPaginationString(): void {
    this.paginationString = this.utilService.getPaginationString(this.limit, this.offset, this.totalItems)
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event)
  }

  onLimitChange(): void {
    this.limitChange.emit(this.limit)
  }
}
