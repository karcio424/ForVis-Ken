import { Network } from 'vis';
import jsPDF from 'jspdf';

export class DownloadableComponent {
  public network: any;

  downloadPdf() {
    var dataUrl = this.getDataUrl();
    var pdf = new jsPDF('l', 'mm', 'a4');
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
    pdf.save("image.pdf");
  }

  downloadPng() {
    var anchor = document.createElement('a');
    anchor.download = 'image.png';
    anchor.href = this.getDataUrl();
    anchor.click();
  }

  private getDataUrl() {
    return this.network.canvas.frame.canvas.toDataURL('image/png');
  }

}
