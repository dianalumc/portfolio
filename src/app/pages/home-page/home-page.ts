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
  // ── Portafolio Web ──────────────────────────────────────────────────────────
  @ViewChild('leftCanvas')  private leftCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightCanvas') private rightCanvas?: ElementRef<HTMLCanvasElement>;
  private webPdf?: pdfjsLib.PDFDocumentProxy;
  protected readonly webPageIndex    = signal(0);
  protected readonly webPageCount    = signal(0);
  protected readonly webError        = signal(false);
  protected readonly webErrorMessage = signal('');
  protected readonly webIsTurning    = signal(false);
  protected readonly webZoom         = signal(1);

  // ── Portafolio Diseño Gráfico ───────────────────────────────────────────────
  @ViewChild('leftCanvasG')  private leftCanvasG?: ElementRef<HTMLCanvasElement>;
  @ViewChild('rightCanvasG') private rightCanvasG?: ElementRef<HTMLCanvasElement>;
  private graphicPdf?: pdfjsLib.PDFDocumentProxy;
  protected readonly graphicPageIndex    = signal(0);
  protected readonly graphicPageCount    = signal(0);
  protected readonly graphicError        = signal(false);
  protected readonly graphicErrorMessage = signal('');
  protected readonly graphicIsTurning    = signal(false);
  protected readonly graphicZoom         = signal(1);
  private graphicLoaded = false;

  // ── Shared ──────────────────────────────────────────────────────────────────
  protected readonly activePortfolio = signal<'web' | 'graphic'>('web');
  protected readonly projects = projects;

  ngAfterViewInit() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('assets/pdf.worker.min.mjs', document.baseURI).toString();
    void this.loadWebPdf();
  }

  // ── Selección de tab ────────────────────────────────────────────────────────
  protected async selectPortfolio(portfolio: 'web' | 'graphic') {
    this.activePortfolio.set(portfolio);
    if (portfolio === 'graphic' && !this.graphicLoaded) {
      this.graphicLoaded = true;
      await new Promise((r) => setTimeout(r, 0));
      void this.loadGraphicPdf();
    }
  }

  // ── Web: navegación y zoom ──────────────────────────────────────────────────
  protected async webPreviousSpread() { await this.turnTo('web', Math.max(0, this.webPageIndex() - 2), 'backward'); }
  protected async webNextSpread()     { await this.turnTo('web', Math.min(this.webPageCount() - 1, this.webPageIndex() + 2), 'forward'); }
  protected webZoomIn()    { this.webZoom.update((z) => Math.min(1.5, Number((z + 0.1).toFixed(1)))); }
  protected webZoomOut()   { this.webZoom.update((z) => Math.max(1,   Number((z - 0.1).toFixed(1)))); }
  protected webResetZoom() { this.webZoom.set(1); }
  protected get webZoomIsActive() { return this.webZoom() > 1; }

  // ── Gráfico: navegación y zoom ──────────────────────────────────────────────
  protected async graphicPreviousSpread() { await this.turnTo('graphic', Math.max(0, this.graphicPageIndex() - 2), 'backward'); }
  protected async graphicNextSpread()     { await this.turnTo('graphic', Math.min(this.graphicPageCount() - 1, this.graphicPageIndex() + 2), 'forward'); }
  protected graphicZoomIn()    { this.graphicZoom.update((z) => Math.min(1.5, Number((z + 0.1).toFixed(1)))); }
  protected graphicZoomOut()   { this.graphicZoom.update((z) => Math.max(1,   Number((z - 0.1).toFixed(1)))); }
  protected graphicResetZoom() { this.graphicZoom.set(1); }
  protected get graphicZoomIsActive() { return this.graphicZoom() > 1; }

  // ── Carga ───────────────────────────────────────────────────────────────────
  private async loadWebPdf() {
    try {
      const url = new URL('assets/Portafolio-Web.pdf', document.baseURI).toString();
      this.webPdf = await pdfjsLib.getDocument({ url }).promise;
      this.webPageCount.set(this.webPdf.numPages);
      await this.renderSpread('web', 0);
    } catch (e) {
      this.webError.set(true);
      this.webErrorMessage.set(e instanceof Error ? e.message : 'Error desconocido.');
    }
  }

  private async loadGraphicPdf() {
    try {
      const url = new URL('assets/Portafolio-Dise%C3%B1oGrafico.pdf', document.baseURI).toString();
      this.graphicPdf = await pdfjsLib.getDocument({ url }).promise;
      this.graphicPageCount.set(this.graphicPdf.numPages);
      await this.renderSpread('graphic', 0);
    } catch (e) {
      this.graphicError.set(true);
      this.graphicErrorMessage.set(e instanceof Error ? e.message : 'Error desconocido.');
    }
  }

  // ── Motor ────────────────────────────────────────────────────────────────────
  private async turnTo(tab: 'web' | 'graphic', index: number, direction: 'forward' | 'backward') {
    const isTurning = tab === 'web' ? this.webIsTurning : this.graphicIsTurning;
    const pageIndex = tab === 'web' ? this.webPageIndex : this.graphicPageIndex;
    const pageCount = tab === 'web' ? this.webPageCount : this.graphicPageCount;
    const bookEls   = document.querySelectorAll('.pdf-book');
    const bookEl    = bookEls[tab === 'web' ? 0 : 1];
    if (isTurning() || index === pageIndex() || !pageCount()) return;
    isTurning.set(true);
    bookEl?.classList.add(`is-turning-${direction}`);
    await new Promise((r) => setTimeout(r, 320));
    pageIndex.set(index);
    await this.renderSpread(tab, index);
    await new Promise((r) => setTimeout(r, 320));
    bookEl?.classList.remove(`is-turning-${direction}`);
    isTurning.set(false);
  }

  private async renderSpread(tab: 'web' | 'graphic', startPage: number) {
    const pdf   = tab === 'web' ? this.webPdf!    : this.graphicPdf!;
    const left  = tab === 'web' ? this.leftCanvas  : this.leftCanvasG;
    const right = tab === 'web' ? this.rightCanvas : this.rightCanvasG;
    await Promise.all([
      this.renderPage(pdf, startPage,     left?.nativeElement),
      this.renderPage(pdf, startPage + 1, right?.nativeElement),
    ]);
  }

  private async renderPage(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number, canvas?: HTMLCanvasElement) {
    if (!canvas) return;
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const page     = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: Math.min(2.5, 1200 / page.getViewport({ scale: 1 }).width) });
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    await page.render({ canvas, viewport }).promise;
  }
}
