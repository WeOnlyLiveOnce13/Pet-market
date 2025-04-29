import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // { Render orders on Client Side 
  //   path: 'orders',
  //   renderMode: RenderMode.Client,
  // },
  {
    path: '**',
    renderMode: RenderMode.Server,  //RenderMode.Server : render pages on server side when user request
  },
];
