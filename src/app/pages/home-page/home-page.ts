import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as pdfjsLib from 'pdfjs-dist';
import { ProjectCard } from '../../components/project-card/project-card';
import { AppDivider } from '../../components/app-divider/app-divider';
import { AppButton } from '../../components/app-button/app-button';
import { AppFooter } from '../../components/app-footer/app-footer';
import { projects } from '../../data/projects';

@Component({
  imports: [CommonModule, RouterLink, ProjectCard, AppDivider, AppButton, AppFooter],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage implements AfterViewInit {
  @ViewChild('leftCanvas') private leftCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightCanvas') private rightCanvas?: ElementRef<HTMLCanvasElement>;
  private pdfDocument?: pdfjsLib.PDFDocumentProxy;
  protected readonly pageIndex = signal(0);
  protected readonly pdfPageCount = signal(0);
  protected readonly pdfError = signal(false);
  protected readonly pdfErrorMessage = signal('');
  protected readonly isTurning = signal(false);
  protected readonly zoomLevel = signal(1);
  protected readonly activePortfolio = signal<'web' | 'graphic'>('web');
  protected readonly projects = projects;

  ngAfterViewInit() {
    void this.loadPdf();
  }
  protected get totalSpreads() {
    return Math.ceil((this.pdfPageCount() + 1) / 2);
  }
  protected get currentSpread() {
    return Math.floor(this.pageIndex() / 2) + 1;
  }
  protected async previousSpread() {
    await this.turnTo(Math.max(0, this.pageIndex() - 2), 'backward');
  }
  protected async nextSpread() {
    await this.turnTo(Math.min(this.pdfPageCount() - 1, this.pageIndex() + 2), 'forward');
  }
  protected zoomIn() { this.zoomLevel.update((zoom) => Math.min(1.5, Number((zoom + 0.1).toFixed(1)))); }
  protected zoomOut() { this.zoomLevel.update((zoom) => Math.max(1, Number((zoom - 0.1).toFixed(1)))); }
  protected resetZoom() { this.zoomLevel.set(1); }
  protected selectPortfolio(portfolio: 'web' | 'graphic') { this.activePortfolio.set(portfolio); }
  protected get zoomIsActive() { return this.zoomLevel() > 1; }

  private async loadPdf() {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('assets/pdf.worker.min.mjs', document.baseURI).toString();
      const pdfUrl = new URL('assets/Portafolio-Web.pdf', document.baseURI).toString();
      this.pdfDocument = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
      this.pdfPageCount.set(this.pdfDocument.numPages);
      await this.renderSpread(this.pdfDocument, 0);
    } catch (error) {
      this.pdfError.set(true);
      this.pdfErrorMessage.set(error instanceof Error ? error.message : 'Error desconocido al cargar el PDF.');
    }
  }

  private async turnTo(index: number, direction: 'forward' | 'backward') {
    if (this.isTurning() || index === this.pageIndex() || !this.pdfPageCount()) return;
    this.isTurning.set(true);
    document.querySelector('.pdf-book')?.classList.add(`is-turning-${direction}`);
    await new Promise((resolve) => setTimeout(resolve, 320));
    this.pageIndex.set(index);
    await this.renderSpread(this.pdfDocument!, index);
    await new Promise((resolve) => setTimeout(resolve, 320));
    document.querySelector('.pdf-book')?.classList.remove(`is-turning-${direction}`);
    this.isTurning.set(false);
  }

  private async renderSpread(pdf: pdfjsLib.PDFDocumentProxy, startPage: number) {
    await Promise.all([
      this.renderPage(pdf, startPage, this.leftCanvas?.nativeElement),
      this.renderPage(pdf, startPage + 1, this.rightCanvas?.nativeElement),
    ]);
  }

  private async renderPage(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNumber: number,
    canvas?: HTMLCanvasElement,
  ) {
    if (!canvas) return;
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({
      scale: Math.min(2.5, 1200 / page.getViewport({ scale: 1 }).width),
    });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, viewport }).promise;
  }
}
