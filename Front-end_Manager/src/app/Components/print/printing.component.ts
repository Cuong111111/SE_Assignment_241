import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-print-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.css'],
})
export class PrintingComponent {
  copiesControl = new FormControl(1);
  printerControl = new FormControl('HP LaserJet 1020');
  pagesControl = new FormControl('all');
  sidesControl = new FormControl('one-sided');
  orientationControl = new FormControl('portrait');
  paperSizeControl = new FormControl('letter');
  marginsControl = new FormControl('normal');
}
