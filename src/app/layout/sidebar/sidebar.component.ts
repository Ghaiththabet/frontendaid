import {
  Router,
  NavigationEnd,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
import { AuthService, Role } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { SidebarService } from './sidebar.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';



// Si vous n’avez pas besoin de traduire directement dans ce composant,
// vous pouvez supprimer TranslateModule et FeatherModule des 'imports'.
@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  // Gardez seulement ce dont vous avez besoin.
  // Par exemple, si vous n'utilisez pas le pipe 'translate' ici,
  // vous n'êtes pas obligé d'importer TranslateModule.
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    NgScrollbarModule,
    // NgScrollbar si vous utilisez <ng-scrollbar> dans le template
    // Sinon, commentez-le.
    // NgScrollbar,
    // FeatherModule,
    // TranslateModule,
  ]
})
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  // Tableau d'objets décrivant les liens du menu
  public sidebarItems!: RouteInfo[];

  // Hauteur calculée de la fenêtre (pour scrollbar)
  public innerHeight?: number;

  // Référence au body pour manipuler les classes
  public bodyTag!: HTMLElement;

  listMaxHeight?: string;
  listMaxWidth?: string;

  // Infos utilisateur
  userFullName?: string;
  userImg?: string;
  userType?: string;

  // Hauteur de l’en-tête (pour le calcul d’espace)
  headerHeight = 60;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    super();
  }

  // Détecter les changements de taille de fenêtre
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  // Fermer le menu si clic à l'extérieur
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  ngOnInit() {
    // Stocker la référence au <body>
    this.bodyTag = this.document.body;

    // Récupérer l’utilisateur connecté
    if (this.authService.currentUserValue) {
      const user = this.authService.currentUserValue;
      const userRole = user.role;

      this.userFullName = user.firstName + ' ' + user.lastName;
      // Image par défaut si user.img n’est pas défini
      this.userImg = user.img || 'assets/images/user/user.jpg';

      // Déterminer le "type" en fonction du rôle
      if (userRole === Role.Admin) {
        this.userType = 'Admin';
      } else if (userRole === Role.Client) {
        this.userType = 'Client';
      } else if (userRole === Role.Employee) {
        this.userType = 'Employee';
      } else {
        // Valeur par défaut
        this.userType = 'Admin';
      }

      // Charger la liste des routes (menu) depuis le service
      this.subs.sink = this.sidebarService.getRouteInfo()
        .subscribe((routes: RouteInfo[]) => {
          // Filtrer selon le rôle
          this.sidebarItems = routes.filter(
            (x) =>
              x.role.indexOf(userRole) !== -1 || x.role.indexOf('All') !== -1
          );
        });
    }

    // Initialiser la sidebar
    this.initLeftSidebar();
  }

  initLeftSidebar() {
    this.setMenuHeight();
    this.checkStatuForResize(true);

    // Écouter les événements de navigation
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Sur mobile, refermer le menu après navigation
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  // Vérifier si le menu doit être "fermé" sur les petits écrans
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }

  // Survol de la sidebar (quand le menu est réduit)
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  // Cliquer sur un item qui a un sous-menu
  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');
      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }

  // Déconnexion
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/authentication/signin']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      },
    });
  }
}
