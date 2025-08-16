// // logo.ts (ou logo.model.ts)

// import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

// export class Logo {
//   uuid: string;
//   mimeType: string;
//   hash: string;
//   conteudoBase64: string;

//   constructor(uuid: string, mimeType: string, hash: string, conteudoBase64: string) {
//     this.uuid = uuid;
//     this.mimeType = mimeType;
//     this.hash = hash;
//     this.conteudoBase64 = conteudoBase64;
//   }

//   // Método que retorna a URL segura para a imagem
//   getSafeUrl(sanitizer: DomSanitizer): SafeUrl {
//     const base64WithPrefix = `data:${this.mimeType};base64,${this.conteudoBase64}`;
//     const temp =  sanitizer.bypassSecurityTrustUrl(base64WithPrefix);
//     console.log(temp);
//     return temp;
//   }
// }