export class StringUtil {

  public static formatarPrimeiraLetra(texto: string | null | undefined): string {
    if (!texto) return '';

    const nomes = texto.toLowerCase().split(' ');
    const nomesFormatados = nomes.map(nome => {
      return nome.charAt(0).toUpperCase() + nome.slice(1);
    });

    return nomesFormatados.join(' ');
  }
  
}
